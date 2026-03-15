/**
 * md-to-word.cjs v3.0.0 - Convert Markdown with Mermaid diagrams to professional Word documents
 *
 * Node.js port of md-to-word.py — eliminates the Python/python-docx dependency.
 *
 * Usage:
 *   node md-to-word.cjs SOURCE.md [OUTPUT.docx] [--no-format-tables] [--keep-temp]
 *
 * Examples:
 *   node md-to-word.cjs README.md
 *   node md-to-word.cjs docs/spec.md spec.docx
 *   node md-to-word.cjs README.md --no-format-tables
 *
 * Requirements:
 *   - pandoc  (winget install pandoc)
 *   - mermaid-cli (npm install -g @mermaid-js/mermaid-cli)
 *   - jszip   (npm dependency — resolved from extension node_modules)
 *   - svgexport (npm install -g svgexport) [optional, for SVG banners]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// JSZip loading — try multiple resolution paths
// ---------------------------------------------------------------------------
let JSZip;
try {
  JSZip = require('jszip');
} catch {
  // When running from workspace, jszip may not be in the local node_modules.
  // The caller should set NODE_PATH to the extension's node_modules.
  console.error('ERROR: jszip not found. Ensure NODE_PATH includes the extension node_modules.');
  console.error('  Post-processing will be skipped — output may lack professional formatting.');
  JSZip = null;
}

// ---------------------------------------------------------------------------
// Page Layout Constants (Letter: 8.5" × 11", 1" margins)
// ---------------------------------------------------------------------------
const PAGE_WIDTH_INCHES = 6.5;
const PAGE_HEIGHT_INCHES = 9.0;
const MAX_IMAGE_RATIO = 0.90;
const MAX_IMAGE_WIDTH = PAGE_WIDTH_INCHES * MAX_IMAGE_RATIO;   // ~5.85"
const MAX_IMAGE_HEIGHT = PAGE_HEIGHT_INCHES * MAX_IMAGE_RATIO; // ~8.1"
const PNG_DPI = 96;

// ---------------------------------------------------------------------------
// OOXML namespace
// ---------------------------------------------------------------------------
const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const WP_NS = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';

// ---------------------------------------------------------------------------
// PNG dimensions reader (no dependencies)
// ---------------------------------------------------------------------------
function getPngDimensions(pngPath) {
  try {
    const buf = Buffer.alloc(24);
    const fd = fs.openSync(pngPath, 'r');
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      return { width, height };
    }
  } catch { /* ignore */ }
  return { width: 0, height: 0 };
}

// ---------------------------------------------------------------------------
// Image sizing
// ---------------------------------------------------------------------------
function calculateOptimalSize(pngPath, mmdContent) {
  const { width: widthPx, height: heightPx } = getPngDimensions(pngPath);
  if (widthPx === 0 || heightPx === 0) {
    return determineImageSizeHeuristic(mmdContent);
  }
  const widthIn = widthPx / PNG_DPI;
  const heightIn = heightPx / PNG_DPI;
  const widthScale = widthIn > 0 ? MAX_IMAGE_WIDTH / widthIn : 1;
  const heightScale = heightIn > 0 ? MAX_IMAGE_HEIGHT / heightIn : 1;
  const scale = Math.min(widthScale, heightScale, 1.0);
  const targetWidth = widthIn * scale;
  const targetHeight = heightIn * scale;
  const aspectRatio = heightIn > 0 ? widthIn / heightIn : 1;
  if (aspectRatio >= 1.0) {
    return `{width=${targetWidth.toFixed(1)}in}`;
  }
  return `{height=${targetHeight.toFixed(1)}in}`;
}

function determineImageSizeHeuristic(mmdContent) {
  const lower = mmdContent.toLowerCase();
  const subgraphCount = (lower.match(/subgraph/g) || []).length;
  if (lower.includes('gantt')) return '{width=5.8in}';
  if (subgraphCount >= 3) return '{width=5.8in}';
  if (lower.includes('flowchart lr') || lower.includes('graph lr')) return '{width=5.8in}';
  if (lower.includes('flowchart tb') || lower.includes('graph tb')) {
    if (subgraphCount >= 2) return '{height=8in}';
    return '{width=5in}';
  }
  return '{width=5in}';
}

// ---------------------------------------------------------------------------
// Mermaid / SVG conversion
// ---------------------------------------------------------------------------
function findMermaidBlocks(content) {
  const pattern = /```mermaid\r?\n([\s\S]*?)```/g;
  const blocks = [];
  let m;
  while ((m = pattern.exec(content)) !== null) {
    blocks.push({ index: blocks.length, content: m[1] });
  }
  return blocks;
}

function convertMermaidToPng(mmdContent, outputPath) {
  const tmpFile = path.join(os.tmpdir(), `alex-mmd-${Date.now()}-${Math.random().toString(36).slice(2)}.mmd`);
  try {
    fs.writeFileSync(tmpFile, mmdContent, 'utf8');
    execSync(`npx mmdc -i "${tmpFile}" -o "${outputPath}" -b white`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000
    });
    return true;
  } catch (err) {
    return false;
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
  }
}

function convertSvgToPng(svgPath, pngPath) {
  try {
    execSync(`npx svgexport "${svgPath}" "${pngPath}" 800:`, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
    });
    return true;
  } catch {
    console.log(`WARNING: svgexport not available, skipping ${svgPath}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Markdown preprocessing
// ---------------------------------------------------------------------------
function preprocessMarkdown(content) {
  const lines = content.split('\n');
  const result = [];
  let prevWasList = false;
  let prevWasBlank = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const stripped = line.trim();
    const isList = /^[-*+]\s|^\d+\.\s|^[-*+]\s*\[[ xX]\]/.test(stripped);
    const isBlank = !stripped;

    // Add blank line before lists if previous line was not blank/list
    if (isList && !prevWasList && !prevWasBlank && result.length > 0) {
      result.push('');
    }

    // Add blank line after heading if next line is not blank
    if (i > 0 && result.length > 0) {
      const prevLine = lines[i - 1].trim();
      if (prevLine.startsWith('#') && !isBlank) {
        if (result[result.length - 1] !== '') {
          result.push('');
        }
      }
    }

    // Convert checkbox markers for pandoc compatibility
    if (/^[-*+]\s*\[ \]/.test(stripped)) {
      line = line.replace(/^([-*+])\s*\[ \]/, '$1 ☐');
    } else if (/^[-*+]\s*\[[xX]\]/.test(stripped)) {
      line = line.replace(/^([-*+])\s*\[[xX]\]/, '$1 ☑');
    }

    result.push(line);
    prevWasList = isList;
    prevWasBlank = isBlank;
  }

  // Add blank line after lists before non-list content
  const final = [];
  for (let i = 0; i < result.length; i++) {
    final.push(result[i]);
    const stripped = result[i].trim();
    const isList = /^[-*+]\s|^\d+\.\s|^[-*+]\s*[☐☑]/.test(stripped);
    if (isList && i + 1 < result.length) {
      const nextStripped = result[i + 1].trim();
      const nextIsList = /^[-*+]\s|^\d+\.\s|^[-*+]\s*[☐☑]/.test(nextStripped);
      if (!nextIsList && nextStripped) {
        final.push('');
      }
    }
  }
  return final.join('\n');
}

// ---------------------------------------------------------------------------
// OOXML Post-Processing Helpers
// ---------------------------------------------------------------------------

/**
 * Insert a child element snippet right after the opening tag of a parent.
 * If `existingTag` is already present inside parent, replaces it.
 */
function ensureChildElement(parentXml, childTag, childSnippet) {
  const existingPattern = new RegExp(`<${childTag}[\\s>][\\s\\S]*?<\\/${childTag}>|<${childTag}[^/]*\\/>`, 'g');
  let cleaned = parentXml.replace(existingPattern, '');
  // Insert after the opening tag of the parent
  const openTagEnd = cleaned.indexOf('>');
  if (openTagEnd === -1) return parentXml;
  return cleaned.slice(0, openTagEnd + 1) + childSnippet + cleaned.slice(openTagEnd + 1);
}

/**
 * Format all tables in document.xml with professional styling.
 */
function formatTables(xml) {
  // Borders XML snippet
  const bordersXml =
    '<w:tblBorders xmlns:w="' + W_NS + '">' +
    '<w:top w:val="single" w:sz="6" w:space="0" w:color="666666"/>' +
    '<w:left w:val="single" w:sz="6" w:space="0" w:color="666666"/>' +
    '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="666666"/>' +
    '<w:right w:val="single" w:sz="6" w:space="0" w:color="666666"/>' +
    '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>' +
    '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>' +
    '</w:tblBorders>';

  // Auto-fit width
  const autoWidthXml =
    '<w:tblW xmlns:w="' + W_NS + '" w:type="auto" w:w="0"/>';
  const autoLayoutXml =
    '<w:tblLayout xmlns:w="' + W_NS + '" w:type="autofit"/>';

  // Process each table
  xml = xml.replace(/<w:tbl\b[^>]*>([\s\S]*?)<\/w:tbl>/g, (tableMatch) => {
    // --- Table properties ---
    tableMatch = tableMatch.replace(/<w:tblPr\b[^>]*>([\s\S]*?)<\/w:tblPr>/g, (tblPrMatch, inner) => {
      // Remove existing borders, width, layout
      let cleaned = inner
        .replace(/<w:tblBorders[\s\S]*?<\/w:tblBorders>/g, '')
        .replace(/<w:tblW[^/]*\/>/g, '')
        .replace(/<w:tblLayout[^/]*\/>/g, '');
      return `<w:tblPr>${cleaned}${bordersXml}${autoWidthXml}${autoLayoutXml}</w:tblPr>`;
    });

    // --- Row formatting ---
    let rowIndex = 0;
    tableMatch = tableMatch.replace(/<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/g, (rowMatch, rowInner) => {
      const currentRow = rowIndex++;
      const isHeader = currentRow === 0;
      const isEvenData = currentRow > 0 && currentRow % 2 === 0;

      // Cell shading color
      let shadingColor = 'FFFFFF';
      if (isHeader) shadingColor = '0078D4';
      else if (isEvenData) shadingColor = 'F0F0F0';

      const shadingXml = `<w:shd xmlns:w="${W_NS}" w:fill="${shadingColor}" w:val="clear"/>`;

      // Can't-split row property
      const cantSplitXml = `<w:cantSplit xmlns:w="${W_NS}"/>`;

      // Add cantSplit to row properties
      if (rowMatch.includes('<w:trPr>')) {
        rowMatch = rowMatch.replace(/<w:trPr>([\s\S]*?)<\/w:trPr>/, (m, trInner) => {
          let c = trInner.replace(/<w:cantSplit[^/]*\/>/g, '');
          return `<w:trPr>${c}${cantSplitXml}</w:trPr>`;
        });
      } else {
        // Insert trPr after <w:tr...>
        rowMatch = rowMatch.replace(/(<w:tr\b[^>]*>)/, `$1<w:trPr>${cantSplitXml}</w:trPr>`);
      }

      // Format each cell
      rowMatch = rowMatch.replace(/<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g, (cellMatch) => {
        // Add/replace cell shading in tcPr
        if (cellMatch.includes('<w:tcPr>')) {
          cellMatch = cellMatch.replace(/<w:tcPr>([\s\S]*?)<\/w:tcPr>/, (m, tcInner) => {
            let c = tcInner.replace(/<w:shd[^/]*\/>/g, '');
            return `<w:tcPr>${c}${shadingXml}</w:tcPr>`;
          });
        } else {
          cellMatch = cellMatch.replace(/(<w:tc\b[^>]*>)/, `$1<w:tcPr>${shadingXml}</w:tcPr>`);
        }

        // Header row: bold white text
        if (isHeader) {
          cellMatch = cellMatch.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (rprMatch, rprInner) => {
            let c = rprInner
              .replace(/<w:b[^/]*\/>/g, '')
              .replace(/<w:color[^/]*\/>/g, '')
              .replace(/<w:sz[^/]*\/>/g, '');
            return `<w:rPr>${c}<w:b/><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr>`;
          });
          // Runs without rPr — add one
          cellMatch = cellMatch.replace(/<w:r>((?:(?!<w:rPr)[\s\S])*?<w:t)/g,
            `<w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr><w:t`);
        } else {
          // Data rows: 9pt black text
          cellMatch = cellMatch.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (rprMatch, rprInner) => {
            let c = rprInner
              .replace(/<w:sz[^/]*\/>/g, '')
              .replace(/<w:color[^/]*\/>/g, '');
            return `<w:rPr>${c}<w:sz w:val="18"/><w:color w:val="000000"/></w:rPr>`;
          });
        }

        return cellMatch;
      });

      return rowMatch;
    });

    return tableMatch;
  });

  return xml;
}

/**
 * Center all paragraphs that contain images.
 */
function centerImages(xml) {
  // Find paragraphs containing <wp:inline (image)
  return xml.replace(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g, (pMatch, pInner) => {
    if (!pInner.includes('<wp:inline') && !pInner.includes('wp:inline')) return pMatch;
    const jcCenter = `<w:jc w:val="center"/>`;
    // Add center alignment to pPr
    if (pMatch.includes('<w:pPr>')) {
      return pMatch.replace(/<w:pPr>([\s\S]*?)<\/w:pPr>/, (m, pprInner) => {
        let c = pprInner.replace(/<w:jc[^/]*\/>/g, '');
        return `<w:pPr>${c}${jcCenter}</w:pPr>`;
      });
    }
    // Insert pPr after <w:p...>
    return pMatch.replace(/(<w:p\b[^>]*>)/, `$1<w:pPr>${jcCenter}</w:pPr>`);
  });
}

/**
 * Apply heading colors and spacing.
 */
function formatHeadings(xml) {
  const headingStyles = {
    'Heading1': { color: '00528B', spaceBefore: 360, spaceAfter: 120 }, // 18pt / 6pt
    'Heading2': { color: '0078D4', spaceBefore: 280, spaceAfter: 80 },  // 14pt / 4pt
    'Heading3': { color: '105E7E', spaceBefore: 240, spaceAfter: 80 },  // 12pt / 4pt
    'Heading4': { color: '105E7E', spaceBefore: 200, spaceAfter: 60 },  // 10pt / 3pt
  };

  return xml.replace(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g, (pMatch, pInner) => {
    // Detect heading style
    const styleMatch = pInner.match(/<w:pStyle\s+w:val="(Heading\d)"/);
    if (!styleMatch) return pMatch;
    const styleName = styleMatch[1];
    const cfg = headingStyles[styleName];
    if (!cfg) return pMatch;

    // Add keepNext, keepLines, spacing to pPr
    const spacingXml = `<w:spacing w:before="${cfg.spaceBefore}" w:after="${cfg.spaceAfter}"/>`;
    const keepNextXml = '<w:keepNext/>';
    const keepLinesXml = '<w:keepLines/>';

    if (pMatch.includes('<w:pPr>')) {
      pMatch = pMatch.replace(/<w:pPr>([\s\S]*?)<\/w:pPr>/, (m, pprInner) => {
        let c = pprInner
          .replace(/<w:spacing[^/]*\/>/g, '')
          .replace(/<w:keepNext[^/]*\/>/g, '')
          .replace(/<w:keepLines[^/]*\/>/g, '');
        return `<w:pPr>${c}${spacingXml}${keepNextXml}${keepLinesXml}</w:pPr>`;
      });
    }

    // Set heading color on runs
    pMatch = pMatch.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (rprMatch, rprInner) => {
      let c = rprInner.replace(/<w:color[^/]*\/>/g, '');
      return `<w:rPr>${c}<w:color w:val="${cfg.color}"/></w:rPr>`;
    });

    return pMatch;
  });
}

/**
 * Format code blocks with Consolas font, gray background, border.
 */
function formatCodeBlocks(xml) {
  const codeStyles = ['SourceCode', 'VerbatimChar', 'Code'];

  return xml.replace(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g, (pMatch, pInner) => {
    // Detect code style
    const styleMatch = pInner.match(/<w:pStyle\s+w:val="([^"]+)"/);
    if (!styleMatch) return pMatch;
    const styleName = styleMatch[1];
    const isCode = codeStyles.some(s => styleName.includes(s)) ||
      styleName.toLowerCase().includes('code') ||
      styleName.toLowerCase().includes('verbatim');
    if (!isCode) return pMatch;

    // Paragraph-level: spacing, keep-together, shading, border
    const pShadingXml = `<w:shd w:fill="F5F5F5" w:val="clear"/>`;
    const pBorderXml =
      '<w:pBdr>' +
      '<w:left w:val="single" w:sz="24" w:space="4" w:color="CCCCCC"/>' +
      '<w:top w:val="single" w:sz="4" w:space="1" w:color="E0E0E0"/>' +
      '<w:bottom w:val="single" w:sz="4" w:space="1" w:color="E0E0E0"/>' +
      '<w:right w:val="single" w:sz="4" w:space="1" w:color="E0E0E0"/>' +
      '</w:pBdr>';
    const codeSpacingXml = '<w:spacing w:before="60" w:after="60"/>';
    const keepTogetherXml = '<w:keepLines/>';

    if (pMatch.includes('<w:pPr>')) {
      pMatch = pMatch.replace(/<w:pPr>([\s\S]*?)<\/w:pPr>/, (m, pprInner) => {
        let c = pprInner
          .replace(/<w:shd[^/]*\/>/g, '')
          .replace(/<w:pBdr>[\s\S]*?<\/w:pBdr>/g, '')
          .replace(/<w:spacing[^/]*\/>/g, '')
          .replace(/<w:keepLines[^/]*\/>/g, '');
        return `<w:pPr>${c}${pShadingXml}${pBorderXml}${codeSpacingXml}${keepTogetherXml}</w:pPr>`;
      });
    }

    // Run-level: Consolas 9pt dark gray
    pMatch = pMatch.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (rprMatch, rprInner) => {
      let c = rprInner
        .replace(/<w:rFonts[^/]*\/>/g, '')
        .replace(/<w:sz[^/]*\/>/g, '')
        .replace(/<w:color[^/]*\/>/g, '');
      return `<w:rPr>${c}<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="18"/><w:color w:val="1E1E1E"/></w:rPr>`;
    });

    return pMatch;
  });
}

/**
 * Fix paragraph spacing — widow/orphan control, list spacing.
 */
function fixParagraphSpacing(xml) {
  return xml.replace(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g, (pMatch, pInner) => {
    const styleMatch = pInner.match(/<w:pStyle\s+w:val="([^"]+)"/);
    const styleName = styleMatch ? styleMatch[1] : '';

    // Skip empty paragraphs
    if (!pInner.includes('<w:t')) return pMatch;

    // Determine spacing
    let widowControlXml = '<w:widowControl/>';
    let spacingXml = '';

    if (styleName.includes('List')) {
      spacingXml = '<w:spacing w:before="40" w:after="40"/>';
    } else if (styleName === 'Normal' || styleName === 'BodyText' || styleName === '') {
      spacingXml = '<w:spacing w:before="120" w:after="120"/>';
    }

    // Skip headings and code (already handled)
    if (styleName.startsWith('Heading') || styleName.includes('Code') ||
        styleName.includes('Source') || styleName.includes('Verbatim')) {
      return pMatch;
    }

    if (pMatch.includes('<w:pPr>')) {
      pMatch = pMatch.replace(/<w:pPr>([\s\S]*?)<\/w:pPr>/, (m, pprInner) => {
        let c = pprInner.replace(/<w:widowControl[^/]*\/>/g, '');
        if (spacingXml && !pprInner.includes('<w:spacing')) {
          c += spacingXml;
        }
        return `<w:pPr>${c}${widowControlXml}</w:pPr>`;
      });
    }

    return pMatch;
  });
}

/**
 * Apply all OOXML formatting passes to document.xml content.
 */
function applyAllFormatting(xml, options) {
  if (!options.noFormatTables) {
    xml = formatTables(xml);
  }
  xml = centerImages(xml);
  xml = formatHeadings(xml);
  xml = formatCodeBlocks(xml);
  xml = fixParagraphSpacing(xml);
  return xml;
}

// ---------------------------------------------------------------------------
// DOCX Post-Processing via JSZip
// ---------------------------------------------------------------------------
async function postProcessDocx(docxPath, options) {
  if (!JSZip) {
    console.log('⚠️  Skipping post-processing (jszip not available)');
    return;
  }

  const data = fs.readFileSync(docxPath);
  const zip = await JSZip.loadAsync(data);

  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) {
    console.log('⚠️  No word/document.xml found in docx — skipping post-processing');
    return;
  }

  let docXml = await docXmlFile.async('string');
  docXml = applyAllFormatting(docXml, options);
  zip.file('word/document.xml', docXml);

  const result = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  fs.writeFileSync(docxPath, result);
}

// ---------------------------------------------------------------------------
// CLI Argument Parsing
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = argv.slice(2);
  const result = {
    source: null,
    output: null,
    imagesDir: 'images',
    noFormatTables: false,
    keepTemp: false
  };

  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--no-format-tables') {
      result.noFormatTables = true;
    } else if (args[i] === '--keep-temp') {
      result.keepTemp = true;
    } else if (args[i] === '--images-dir' && i + 1 < args.length) {
      result.imagesDir = args[++i];
    } else if (!args[i].startsWith('--')) {
      positional.push(args[i]);
    }
  }

  if (positional.length === 0) {
    console.error('Usage: node md-to-word.cjs SOURCE.md [OUTPUT.docx] [--no-format-tables] [--keep-temp]');
    process.exit(1);
  }

  result.source = positional[0];
  result.output = positional[1] || positional[0].replace(/\.md$/i, '.docx');
  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv);

  const sourcePath = path.resolve(args.source);
  if (!fs.existsSync(sourcePath)) {
    console.error(`ERROR: Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  const outputPath = path.resolve(args.output);
  const sourceDir = path.dirname(sourcePath);
  const imagesDir = path.join(sourceDir, args.imagesDir);

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log(`📄 Converting ${sourcePath} → ${outputPath}`);

  // Phase 0: Preprocess markdown
  let content = fs.readFileSync(sourcePath, 'utf8');
  console.log('🔧 Preprocessing markdown...');
  content = preprocessMarkdown(content);

  // Phase 1: Find and convert Mermaid diagrams
  const mermaidBlocks = findMermaidBlocks(content);
  console.log(`📊 Found ${mermaidBlocks.length} Mermaid diagrams`);

  const replacements = [];
  for (const block of mermaidBlocks) {
    const pngName = `diagram-${block.index + 1}.png`;
    const pngPath = path.join(imagesDir, pngName);
    process.stdout.write(`   Converting diagram ${block.index + 1}... `);

    if (convertMermaidToPng(block.content, pngPath)) {
      const size = calculateOptimalSize(pngPath, block.content);
      replacements.push(`![Diagram ${block.index + 1}](${args.imagesDir}/${pngName})${size}`);
      console.log(`✓ ${size}`);
    } else {
      console.log('✗ (failed)');
      replacements.push(`![Diagram ${block.index + 1}](${args.imagesDir}/${pngName})`);
    }
  }

  // Phase 2: Convert SVG references to PNG
  const svgPattern = /!\[([^\]]*)\]\(([^)]+\.svg)\)/g;
  let svgMatch;
  while ((svgMatch = svgPattern.exec(content)) !== null) {
    const [fullMatch, altText, svgRelPath] = svgMatch;
    const svgPath = path.join(sourceDir, svgRelPath);

    if (fs.existsSync(svgPath)) {
      const pngName = path.basename(svgPath, '.svg') + '.png';
      const pngPath = path.join(imagesDir, pngName);

      if (!fs.existsSync(pngPath)) {
        process.stdout.write(`🖼️  Converting SVG: ${path.basename(svgPath)}... `);
        if (convertSvgToPng(svgPath, pngPath)) {
          console.log('✓');
        } else {
          console.log('✗');
        }
      }

      const newRef = `![${altText}](${args.imagesDir}/${pngName}){width=5.8in}`;
      content = content.replace(fullMatch, newRef);
    }
  }

  // Phase 3: Replace mermaid blocks with image references
  const mermaidPattern = /```mermaid\r?\n[\s\S]*?```/;
  for (const replacement of replacements) {
    content = content.replace(mermaidPattern, replacement);
  }

  // Write temporary markdown
  const tempMd = path.join(sourceDir, '_temp_word.md');
  fs.writeFileSync(tempMd, content, 'utf8');

  // Phase 4: Convert to Word with pandoc
  console.log('📝 Generating Word document...');
  const resourcePath = path.resolve(sourceDir);
  try {
    execSync(
      `pandoc "${tempMd}" -o "${outputPath}" --from markdown --to docx --resource-path="${resourcePath}"`,
      { stdio: ['pipe', 'pipe', 'pipe'], timeout: 120000 }
    );
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString() : String(err);
    console.error(`ERROR: pandoc failed: ${stderr}`);
    process.exit(1);
  }

  // Phase 5: Apply OOXML formatting
  console.log('🎨 Applying formatting...');
  await postProcessDocx(outputPath, {
    noFormatTables: args.noFormatTables
  });

  // Cleanup
  if (!args.keepTemp) {
    try { fs.unlinkSync(tempMd); } catch { /* ignore */ }
  }

  const stats = fs.statSync(outputPath);
  console.log(`✅ Done! Output: ${outputPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error(`FATAL: ${err.message || err}`);
  process.exit(1);
});
