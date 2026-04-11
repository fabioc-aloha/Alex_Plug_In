/**
 * data-ingest.cjs -- Universal data ingestion muscle
 * Version: 1.0.0
 *
 * Normalizes data from any supported source into a common JSON structure.
 * Detects format, parses, infers column types, handles encoding, and cleans
 * null variants. Output is columnar metadata + rows suitable for analysis
 * and visualization pipelines.
 *
 * Usage:
 *   node data-ingest.cjs <path>                    # Auto-detect format from file
 *   node data-ingest.cjs <url>                     # Fetch + auto-detect
 *   node data-ingest.cjs --stdin                   # Read piped/clipboard data
 *   node data-ingest.cjs <path> --sheet "Sheet2"   # Select Excel sheet
 *   node data-ingest.cjs <path> --limit 5000       # Limit output rows
 *   node data-ingest.cjs <path> --preview          # Show first 5 rows only
 *   node data-ingest.cjs <path> --output out.json  # Write to file instead of stdout
 *
 * Supported formats:
 *   .csv, .tsv    -- Delimiter detection + streaming parse
 *   .xlsx, .xls   -- SheetJS parse (requires: npm install xlsx)
 *   .json, .jsonl -- JSON.parse / line-delimited
 *   http(s)://    -- Fetch + content-type detection
 *
 * Output structure:
 *   { metadata: { source, format, encoding, rowCount, columnCount, parseWarnings },
 *     columns: [{ name, type, nullCount, uniqueCount, min?, max? }],
 *     rows: [...] }
 */
'use strict';

const fs = require('fs');
const path = require('path');

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const NULL_VARIANTS = new Set(['', 'null', 'NULL', 'NA', 'N/A', 'n/a', 'NaN', 'nan', 'None', 'none', '#N/A', '-']);
const DEFAULT_LIMIT = 10000;
const MAX_PREVIEW_ROWS = 5;

// -----------------------------------------------------------------------------
// FORMAT DETECTION
// -----------------------------------------------------------------------------

function detectFormat(source) {
  if (/^https?:\/\//i.test(source)) return 'url';
  const ext = path.extname(source).toLowerCase();
  const formatMap = {
    '.csv': 'csv', '.tsv': 'tsv',
    '.xlsx': 'xlsx', '.xls': 'xlsx',
    '.json': 'json', '.jsonl': 'jsonl'
  };
  return formatMap[ext] || 'csv'; // default to CSV
}

// -----------------------------------------------------------------------------
// CSV / TSV PARSER
// -----------------------------------------------------------------------------

function detectDelimiter(firstLine) {
  const candidates = [',', '\t', ';', '|'];
  let best = ',';
  let bestCount = 0;
  for (const d of candidates) {
    const count = (firstLine.match(new RegExp(d === '|' ? '\\|' : d, 'g')) || []).length;
    if (count > bestCount) { bestCount = count; best = d; }
  }
  return best;
}

function parseCsv(content, delimiter) {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0], delimiter);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i], delimiter);
    if (values.length === headers.length) {
      rows.push(values);
    } else if (values.length > 0) {
      // Pad or trim to header length
      while (values.length < headers.length) values.push('');
      rows.push(values.slice(0, headers.length));
    }
  }
  return { headers, rows };
}

function parseCsvLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === delimiter) { result.push(current.trim()); current = ''; }
      else { current += ch; }
    }
  }
  result.push(current.trim());
  return result;
}

// -----------------------------------------------------------------------------
// JSON PARSER
// -----------------------------------------------------------------------------

function parseJson(content) {
  const data = JSON.parse(content);
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(h => obj[h] !== undefined ? String(obj[h]) : ''));
    return { headers, rows };
  }
  throw new Error('JSON must be an array of objects');
}

function parseJsonl(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  const objects = lines.map(l => JSON.parse(l));
  if (objects.length === 0) return { headers: [], rows: [] };
  const headers = Object.keys(objects[0]);
  const rows = objects.map(obj => headers.map(h => obj[h] !== undefined ? String(obj[h]) : ''));
  return { headers, rows };
}

// -----------------------------------------------------------------------------
// XLSX PARSER (optional dependency)
// -----------------------------------------------------------------------------

function parseXlsx(filePath, sheetName) {
  let XLSX;
  try {
    XLSX = require('xlsx');
  } catch {
    throw new Error('xlsx package not installed. Run: npm install xlsx');
  }
  const workbook = XLSX.readFile(filePath);
  const sheet = sheetName
    ? workbook.Sheets[sheetName]
    : workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error(`Sheet "${sheetName || workbook.SheetNames[0]}" not found`);
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  if (jsonData.length === 0) return { headers: [], rows: [] };
  const headers = jsonData[0].map(String);
  const rows = jsonData.slice(1).map(row => row.map(v => v !== undefined ? String(v) : ''));
  return { headers, rows };
}

// -----------------------------------------------------------------------------
// TYPE INFERENCE & COLUMN PROFILING
// -----------------------------------------------------------------------------

function inferType(values) {
  let numCount = 0, dateCount = 0, boolCount = 0, total = 0;
  for (const v of values) {
    if (NULL_VARIANTS.has(v)) continue;
    total++;
    if (/^-?\d+(\.\d+)?$/.test(v) || /^-?\d{1,3}(,\d{3})*(\.\d+)?$/.test(v)) numCount++;
    else if (/^\d{4}-\d{2}-\d{2}/.test(v) || /^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(v)) dateCount++;
    else if (/^(true|false|yes|no|0|1)$/i.test(v)) boolCount++;
  }
  if (total === 0) return 'string';
  if (numCount / total > 0.8) return 'number';
  if (dateCount / total > 0.8) return 'date';
  if (boolCount / total > 0.8) return 'boolean';
  return 'string';
}

function profileColumn(name, values) {
  const type = inferType(values);
  let nullCount = 0;
  const uniqueSet = new Set();
  const numericValues = [];

  for (const v of values) {
    if (NULL_VARIANTS.has(v)) { nullCount++; continue; }
    uniqueSet.add(v);
    if (type === 'number') {
      const n = parseFloat(v.replace(/,/g, ''));
      if (!isNaN(n)) numericValues.push(n);
    }
  }

  const col = { name, type, nullCount, uniqueCount: uniqueSet.size };
  if (type === 'number' && numericValues.length > 0) {
    numericValues.sort((a, b) => a - b);
    col.min = numericValues[0];
    col.max = numericValues[numericValues.length - 1];
    col.mean = Math.round((numericValues.reduce((s, v) => s + v, 0) / numericValues.length) * 100) / 100;
    col.median = numericValues[Math.floor(numericValues.length / 2)];
  }
  return col;
}

// -----------------------------------------------------------------------------
// NULL NORMALIZATION
// -----------------------------------------------------------------------------

function normalizeNulls(rows) {
  return rows.map(row => row.map(v => NULL_VARIANTS.has(v) ? null : v));
}

// -----------------------------------------------------------------------------
// COLUMN NAME CLEANUP
// -----------------------------------------------------------------------------

function cleanColumnNames(headers) {
  return headers.map(h => h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------

async function ingest(source, options = {}) {
  const warnings = [];
  let format = detectFormat(source);
  let content, filePath;

  // Read content
  if (format === 'url') {
    const resp = await fetch(source, { signal: AbortSignal.timeout(30000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    content = await resp.text();
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('json')) format = 'json';
    else if (ct.includes('tab-separated')) format = 'tsv';
    else format = 'csv';
    filePath = source;
  } else {
    filePath = path.resolve(source);
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
    if (format === 'xlsx') {
      // Binary -- handled by xlsx
    } else {
      content = fs.readFileSync(filePath, 'utf-8');
    }
  }

  // Parse
  let parsed;
  switch (format) {
    case 'csv':
    case 'tsv': {
      const delim = format === 'tsv' ? '\t' : detectDelimiter(content.split(/\r?\n/)[0] || '');
      parsed = parseCsv(content, delim);
      break;
    }
    case 'json':
      parsed = parseJson(content);
      break;
    case 'jsonl':
      parsed = parseJsonl(content);
      break;
    case 'xlsx':
      parsed = parseXlsx(filePath, options.sheet);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  // Clean headers
  const rawHeaders = parsed.headers;
  const cleanHeaders = cleanColumnNames(rawHeaders);

  // Check for duplicate column names
  const seen = new Set();
  for (let i = 0; i < cleanHeaders.length; i++) {
    if (seen.has(cleanHeaders[i])) {
      cleanHeaders[i] = `${cleanHeaders[i]}_${i}`;
      warnings.push(`Duplicate column name "${rawHeaders[i]}" renamed to "${cleanHeaders[i]}"`);
    }
    seen.add(cleanHeaders[i]);
  }

  // Normalize nulls
  const rows = normalizeNulls(parsed.rows);

  // Apply limit
  const limit = options.preview ? MAX_PREVIEW_ROWS : (options.limit || DEFAULT_LIMIT);
  const limitedRows = rows.slice(0, limit);
  if (rows.length > limit) {
    warnings.push(`Output limited to ${limit} rows (${rows.length} total). Use --limit to adjust.`);
  }

  // Profile columns
  const columns = cleanHeaders.map((name, i) => {
    const colValues = rows.map(r => r[i] !== null ? String(r[i]) : '');
    return profileColumn(name, colValues);
  });

  return {
    metadata: {
      source: path.basename(filePath || source),
      format,
      encoding: 'utf-8',
      rowCount: rows.length,
      columnCount: columns.length,
      parseWarnings: warnings
    },
    columns,
    rows: limitedRows
  };
}

// -----------------------------------------------------------------------------
// CLI
// -----------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
data-ingest.cjs -- Universal data ingestion

Usage:
  node data-ingest.cjs <path|url>
  node data-ingest.cjs <path> --sheet "Sheet2"
  node data-ingest.cjs <path> --limit 5000
  node data-ingest.cjs <path> --preview
  node data-ingest.cjs <path> --output out.json

Supported: .csv, .tsv, .xlsx, .xls, .json, .jsonl, http(s)://
    `.trim());
    process.exit(0);
  }

  const source = args.find(a => !a.startsWith('--'));
  if (!source) { console.error('Error: No source specified'); process.exit(1); }

  const options = {};
  const sheetIdx = args.indexOf('--sheet');
  if (sheetIdx !== -1) options.sheet = args[sheetIdx + 1];
  const limitIdx = args.indexOf('--limit');
  if (limitIdx !== -1) options.limit = parseInt(args[limitIdx + 1], 10);
  if (args.includes('--preview')) options.preview = true;

  try {
    const result = await ingest(source, options);
    const output = JSON.stringify(result, null, 2);

    const outIdx = args.indexOf('--output');
    if (outIdx !== -1) {
      fs.writeFileSync(args[outIdx + 1], output, 'utf-8');
      console.log(`Written to ${args[outIdx + 1]} (${result.metadata.rowCount} rows, ${result.metadata.columnCount} columns)`);
    } else {
      console.log(output);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();

module.exports = { ingest, detectFormat, parseCsv, parseJson, profileColumn };
