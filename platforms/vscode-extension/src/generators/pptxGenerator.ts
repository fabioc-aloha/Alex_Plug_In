/**
 * Alex PPTX Generator
 * 
 * Programmatic PowerPoint generation via PptxGenJS.
 * Zero cloud dependencies — runs in Alex's Node.js runtime.
 * 
 * @module pptxGenerator
 */

import pptxgen from 'pptxgenjs';
import * as fs from 'fs-extra';
import * as path from 'path';

// =============================================================================
// TYPES
// =============================================================================

export interface SlideContent {
    type: 'title' | 'content' | 'section' | 'chart' | 'table' | 'image' | 'twoColumn';
    title?: string;
    subtitle?: string;
    bullets?: string[];
    notes?: string;
    data?: ChartData | TableData | ImageData | TwoColumnData;
}

export interface ChartData {
    chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter';
    series: Array<{
        name: string;
        labels: string[];
        values: number[];
    }>;
    title?: string;
}

export interface TableData {
    headers: string[];
    rows: string[][];
    highlightLastRow?: boolean;
}

export interface ImageData {
    path?: string;
    base64?: string;
    width?: number;
    height?: number;
    caption?: string;
}

export interface TwoColumnData {
    left: { title?: string; bullets?: string[] };
    right: { title?: string; bullets?: string[] };
}

export interface PresentationOptions {
    title: string;
    author?: string;
    subject?: string;
    company?: string;
    layout?: '16x9' | '16x10' | '4x3';
    theme?: 'alex-brand' | 'minimal' | 'dark';
    compression?: boolean;
}

export interface GenerateResult {
    success: boolean;
    filePath?: string;
    base64?: string;
    error?: string;
    slideCount?: number;
}

// =============================================================================
// ALEX BRAND COLORS (GitHub Pastel v2)
// =============================================================================

const ALEX_COLORS = {
    // Primary
    blue: { fill: 'ddf4ff', text: '0550ae', border: '80ccff' },
    green: { fill: 'd3f5db', text: '1a7f37', border: '6fdd8b' },
    purple: { fill: 'd8b9ff', text: '6639ba', border: 'bf8aff' },
    // Accent
    gold: { fill: 'fff8c5', text: '9a6700', border: 'd4a72c' },
    bronze: { fill: 'fff1e5', text: '953800', border: 'ffb77c' },
    red: { fill: 'ffebe9', text: 'cf222e', border: 'f5a3a3' },
    // Neutral
    gray: { fill: 'eaeef2', text: '24292f', border: 'afb8c1' },
    white: { fill: 'FFFFFF', text: '1f2328', border: 'd0d7de' },
} as const;

// Chart colors for series
const CHART_COLORS = ['0550ae', '1a7f37', '9a6700', '6639ba', '953800', 'cf222e'];

// =============================================================================
// SLIDE MASTERS
// =============================================================================

function defineAlexSlideMasters(pres: pptxgen): void {
    // Title Slide
    pres.defineSlideMaster({
        title: 'ALEX_TITLE',
        background: { color: ALEX_COLORS.blue.text },
        objects: [
            {
                text: {
                    text: 'ALEX',
                    options: {
                        x: 0.5, y: 0.4, w: 3, h: 0.4,
                        color: 'FFFFFF', fontSize: 12, fontFace: 'Arial', bold: true
                    }
                }
            },
            {
                rect: { x: 0, y: 6.3, w: '100%', h: 0.7, fill: { color: ALEX_COLORS.green.text } }
            }
        ],
        slideNumber: { x: 9.25, y: 6.45, color: 'FFFFFF', fontSize: 10 }
    });

    // Content Slide
    pres.defineSlideMaster({
        title: 'ALEX_CONTENT',
        background: { color: 'FFFFFF' },
        objects: [
            {
                rect: { x: 0, y: 0, w: '100%', h: 0.7, fill: { color: ALEX_COLORS.blue.text } }
            },
            {
                text: {
                    text: 'Alex Cognitive Architecture',
                    options: {
                        x: 0.5, y: 0.18, w: 5, h: 0.35,
                        color: 'FFFFFF', fontSize: 10, fontFace: 'Arial'
                    }
                }
            },
            {
                rect: { x: 0, y: 6.7, w: '100%', h: 0.3, fill: { color: ALEX_COLORS.gray.fill } }
            }
        ],
        slideNumber: { x: 9.25, y: 6.75, color: ALEX_COLORS.gray.text, fontSize: 9 }
    });

    // Section Divider
    pres.defineSlideMaster({
        title: 'ALEX_SECTION',
        background: { color: ALEX_COLORS.purple.fill },
        objects: [
            {
                rect: { x: 0, y: 3.35, w: '100%', h: 0.04, fill: { color: ALEX_COLORS.purple.text } }
            }
        ]
    });

    // Chart Slide
    pres.defineSlideMaster({
        title: 'ALEX_CHART',
        background: { color: 'FFFFFF' },
        objects: [
            {
                rect: { x: 0, y: 0, w: '100%', h: 0.7, fill: { color: ALEX_COLORS.blue.text } }
            },
            {
                text: {
                    text: 'Data & Analytics',
                    options: {
                        x: 0.5, y: 0.18, w: 5, h: 0.35,
                        color: 'FFFFFF', fontSize: 10, fontFace: 'Arial'
                    }
                }
            }
        ],
        slideNumber: { x: 9.25, y: 6.75, color: ALEX_COLORS.gray.text, fontSize: 9 }
    });
}

// =============================================================================
// SLIDE BUILDERS
// =============================================================================

function addTitleSlide(pres: pptxgen, content: SlideContent): void {
    const slide = pres.addSlide({ masterName: 'ALEX_TITLE' });

    // Main title
    slide.addText(content.title || 'Untitled Presentation', {
        x: 0.5, y: 2.5, w: 9, h: 1,
        fontSize: 40, fontFace: 'Arial', bold: true,
        color: 'FFFFFF', align: 'center'
    });

    // Subtitle
    if (content.subtitle) {
        slide.addText(content.subtitle, {
            x: 0.5, y: 3.6, w: 9, h: 0.6,
            fontSize: 18, fontFace: 'Arial',
            color: ALEX_COLORS.blue.border, align: 'center'
        });
    }

    // Speaker notes
    if (content.notes) {
        slide.addNotes(content.notes);
    }
}

function addContentSlide(pres: pptxgen, content: SlideContent): void {
    const slide = pres.addSlide({ masterName: 'ALEX_CONTENT' });

    // Title
    if (content.title) {
        slide.addText(content.title, {
            x: 0.5, y: 0.9, w: 9, h: 0.6,
            fontSize: 28, fontFace: 'Arial', bold: true,
            color: ALEX_COLORS.gray.text
        });
    }

    // Bullets
    if (content.bullets && content.bullets.length > 0) {
        const yStart = content.title ? 1.7 : 1.0;
        content.bullets.forEach((bullet, i) => {
            slide.addText(bullet, {
                x: 0.8, y: yStart + i * 0.6, w: 8.2, h: 0.5,
                fontSize: 16, fontFace: 'Arial',
                color: ALEX_COLORS.gray.text,
                bullet: { type: 'bullet' }
            });
        });
    }

    // Speaker notes
    if (content.notes) {
        slide.addNotes(content.notes);
    }
}

function addSectionSlide(pres: pptxgen, content: SlideContent): void {
    const slide = pres.addSlide({ masterName: 'ALEX_SECTION' });

    // Section title
    slide.addText(content.title || 'Section', {
        x: 0.5, y: 2.8, w: 9, h: 0.8,
        fontSize: 36, fontFace: 'Arial', bold: true,
        color: ALEX_COLORS.purple.text, align: 'center'
    });

    // Subtitle
    if (content.subtitle) {
        slide.addText(content.subtitle, {
            x: 0.5, y: 3.7, w: 9, h: 0.5,
            fontSize: 16, fontFace: 'Arial',
            color: ALEX_COLORS.purple.text, align: 'center'
        });
    }
}

function addChartSlide(pres: pptxgen, content: SlideContent): void {
    const slide = pres.addSlide({ masterName: 'ALEX_CHART' });
    const chartData = content.data as ChartData;

    // Title
    if (content.title) {
        slide.addText(content.title, {
            x: 0.5, y: 0.9, w: 9, h: 0.5,
            fontSize: 24, fontFace: 'Arial', bold: true,
            color: ALEX_COLORS.gray.text
        });
    }

    if (!chartData || !chartData.series) {
        return;
    }

    // Map chart type
    const chartTypeMap: Record<string, pptxgen.CHART_NAME> = {
        'bar': pres.ChartType.bar,
        'line': pres.ChartType.line,
        'pie': pres.ChartType.pie,
        'doughnut': pres.ChartType.doughnut,
        'area': pres.ChartType.area,
        'scatter': pres.ChartType.scatter,
    };

    const chartType = chartTypeMap[chartData.chartType] || pres.ChartType.bar;

    slide.addChart(chartType, chartData.series, {
        x: 0.5, y: 1.5, w: 9, h: 4.8,
        chartColors: CHART_COLORS,
        showTitle: !!chartData.title,
        title: chartData.title,
        showValue: chartData.chartType !== 'pie',
        showPercent: chartData.chartType === 'pie' || chartData.chartType === 'doughnut',
        showLegend: chartData.series.length > 1,
        legendPos: 'b'
    });

    if (content.notes) {
        slide.addNotes(content.notes);
    }
}

function addTableSlide(pres: pptxgen, content: SlideContent): void {
    const slide = pres.addSlide({ masterName: 'ALEX_CONTENT' });
    const tableData = content.data as TableData;

    // Title
    if (content.title) {
        slide.addText(content.title, {
            x: 0.5, y: 0.9, w: 9, h: 0.5,
            fontSize: 24, fontFace: 'Arial', bold: true,
            color: ALEX_COLORS.gray.text
        });
    }

    if (!tableData || !tableData.headers || !tableData.rows) {
        return;
    }

    // Build table rows
    const rows: pptxgen.TableRow[] = [];

    // Header row
    rows.push(tableData.headers.map(h => ({
        text: h,
        options: { bold: true, fill: { color: ALEX_COLORS.blue.text }, color: 'FFFFFF', fontSize: 12 }
    })));

    // Data rows
    tableData.rows.forEach((row, rowIdx) => {
        const isLastRow = rowIdx === tableData.rows.length - 1;
        const shouldHighlight = isLastRow && tableData.highlightLastRow;

        rows.push(row.map(cell => ({
            text: cell,
            options: {
                fill: { color: shouldHighlight ? ALEX_COLORS.gray.fill : 'FFFFFF' },
                bold: shouldHighlight,
                fontSize: 11,
                color: ALEX_COLORS.gray.text
            }
        })));
    });

    // Calculate column widths
    const colCount = tableData.headers.length;
    const tableWidth = 9;
    const colW = Array(colCount).fill(tableWidth / colCount);

    slide.addTable(rows, {
        x: 0.5, y: 1.6, w: tableWidth,
        colW,
        border: { type: 'solid', pt: 0.5, color: ALEX_COLORS.gray.border },
        fontFace: 'Arial',
        autoPage: true,
        autoPageRepeatHeader: true
    });

    if (content.notes) {
        slide.addNotes(content.notes);
    }
}

function addImageSlide(pres: pptxgen, content: SlideContent): void {
    const slide = pres.addSlide({ masterName: 'ALEX_CONTENT' });
    const imageData = content.data as ImageData;

    // Title
    if (content.title) {
        slide.addText(content.title, {
            x: 0.5, y: 0.9, w: 9, h: 0.5,
            fontSize: 24, fontFace: 'Arial', bold: true,
            color: ALEX_COLORS.gray.text
        });
    }

    if (!imageData) {
        return;
    }

    const imgOpts: pptxgen.ImageProps = {
        x: 1, y: 1.6,
        w: imageData.width || 8,
        h: imageData.height || 4.5
    };

    if (imageData.base64) {
        imgOpts.data = imageData.base64;
    } else if (imageData.path) {
        imgOpts.path = imageData.path;
    }

    slide.addImage(imgOpts);

    // Caption
    if (imageData.caption) {
        slide.addText(imageData.caption, {
            x: 0.5, y: 6.2, w: 9, h: 0.4,
            fontSize: 10, fontFace: 'Arial', italic: true,
            color: ALEX_COLORS.gray.text, align: 'center'
        });
    }

    if (content.notes) {
        slide.addNotes(content.notes);
    }
}

function addTwoColumnSlide(pres: pptxgen, content: SlideContent): void {
    const slide = pres.addSlide({ masterName: 'ALEX_CONTENT' });
    const colData = content.data as TwoColumnData;

    // Main title
    if (content.title) {
        slide.addText(content.title, {
            x: 0.5, y: 0.9, w: 9, h: 0.5,
            fontSize: 24, fontFace: 'Arial', bold: true,
            color: ALEX_COLORS.gray.text
        });
    }

    if (!colData) {
        return;
    }

    // Left column
    if (colData.left) {
        if (colData.left.title) {
            slide.addText(colData.left.title, {
                x: 0.5, y: 1.6, w: 4.3, h: 0.4,
                fontSize: 16, fontFace: 'Arial', bold: true,
                color: ALEX_COLORS.blue.text
            });
        }
        if (colData.left.bullets) {
            colData.left.bullets.forEach((bullet, i) => {
                slide.addText(bullet, {
                    x: 0.7, y: 2.1 + i * 0.55, w: 4.1, h: 0.5,
                    fontSize: 13, fontFace: 'Arial',
                    color: ALEX_COLORS.gray.text,
                    bullet: { type: 'bullet' }
                });
            });
        }
    }

    // Right column
    if (colData.right) {
        if (colData.right.title) {
            slide.addText(colData.right.title, {
                x: 5.2, y: 1.6, w: 4.3, h: 0.4,
                fontSize: 16, fontFace: 'Arial', bold: true,
                color: ALEX_COLORS.green.text
            });
        }
        if (colData.right.bullets) {
            colData.right.bullets.forEach((bullet, i) => {
                slide.addText(bullet, {
                    x: 5.4, y: 2.1 + i * 0.55, w: 4.1, h: 0.5,
                    fontSize: 13, fontFace: 'Arial',
                    color: ALEX_COLORS.gray.text,
                    bullet: { type: 'bullet' }
                });
            });
        }
    }

    if (content.notes) {
        slide.addNotes(content.notes);
    }
}

// =============================================================================
// MARKDOWN PARSER
// =============================================================================

/**
 * Parse markdown content into slide structure
 */
export function parseMarkdownToSlides(markdown: string): SlideContent[] {
    const slides: SlideContent[] = [];
    const sections = markdown.split(/^---$/m).filter(s => s.trim());

    for (const section of sections) {
        const lines = section.trim().split('\n');
        let currentSlide: SlideContent = { type: 'content', bullets: [] };

        for (const line of lines) {
            const trimmed = line.trim();

            if (trimmed.startsWith('# ')) {
                // If this is the first slide and only a title, make it title slide
                if (slides.length === 0 && currentSlide.bullets?.length === 0) {
                    currentSlide.type = 'title';
                }
                currentSlide.title = trimmed.replace(/^#\s+/, '');
            } else if (trimmed.startsWith('## ')) {
                // Check for section indicator
                if (trimmed.toLowerCase().includes('[section]')) {
                    currentSlide.type = 'section';
                    currentSlide.title = trimmed.replace(/^##\s+/, '').replace(/\[section\]/i, '').trim();
                } else {
                    currentSlide.subtitle = trimmed.replace(/^##\s+/, '');
                }
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                currentSlide.bullets = currentSlide.bullets || [];
                currentSlide.bullets.push(trimmed.replace(/^[-*]\s+/, ''));
            } else if (trimmed.startsWith('> ')) {
                // Speaker notes
                currentSlide.notes = (currentSlide.notes || '') + trimmed.replace(/^>\s+/, '') + '\n';
            }
        }

        if (currentSlide.title || (currentSlide.bullets && currentSlide.bullets.length > 0)) {
            slides.push(currentSlide);
        }
    }

    return slides;
}

// =============================================================================
// MAIN GENERATOR
// =============================================================================

/**
 * Generate a PowerPoint presentation
 */
export async function generatePresentation(
    slides: SlideContent[],
    options: PresentationOptions
): Promise<GenerateResult> {
    try {
        const pres = new pptxgen();

        // Metadata
        pres.author = options.author || 'Alex Cognitive Architecture';
        pres.company = options.company || 'Alex';
        pres.subject = options.subject || 'Auto-generated presentation';
        pres.title = options.title;

        // Layout
        const layoutMap: Record<string, string> = {
            '16x9': 'LAYOUT_16x9',
            '16x10': 'LAYOUT_16x10',
            '4x3': 'LAYOUT_4x3'
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pres.layout = layoutMap[options.layout || '16x9'] as any;

        // Define Alex brand slide masters
        defineAlexSlideMasters(pres);

        // Build slides
        for (const slideContent of slides) {
            switch (slideContent.type) {
                case 'title':
                    addTitleSlide(pres, slideContent);
                    break;
                case 'section':
                    addSectionSlide(pres, slideContent);
                    break;
                case 'chart':
                    addChartSlide(pres, slideContent);
                    break;
                case 'table':
                    addTableSlide(pres, slideContent);
                    break;
                case 'image':
                    addImageSlide(pres, slideContent);
                    break;
                case 'twoColumn':
                    addTwoColumnSlide(pres, slideContent);
                    break;
                case 'content':
                default:
                    addContentSlide(pres, slideContent);
                    break;
            }
        }

        // Generate output
        const base64 = await pres.write({ outputType: 'base64' }) as string;

        return {
            success: true,
            base64,
            slideCount: slides.length
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : String(err)
        };
    }
}

/**
 * Generate and save a PowerPoint presentation to disk
 */
export async function generateAndSavePresentation(
    slides: SlideContent[],
    options: PresentationOptions,
    outputPath: string
): Promise<GenerateResult> {
    const result = await generatePresentation(slides, options);

    if (!result.success || !result.base64) {
        return result;
    }

    try {
        // Ensure directory exists
        await fs.ensureDir(path.dirname(outputPath));

        // Convert base64 to buffer and write
        const buffer = Buffer.from(result.base64, 'base64');
        await fs.writeFile(outputPath, buffer);

        return {
            success: true,
            filePath: outputPath,
            slideCount: result.slideCount
        };
    } catch (err) {
        return {
            success: false,
            error: `Failed to save file: ${err instanceof Error ? err.message : String(err)}`
        };
    }
}

/**
 * Generate presentation from markdown file
 */
export async function generateFromMarkdown(
    markdownPath: string,
    options: Partial<PresentationOptions> = {}
): Promise<GenerateResult> {
    try {
        const markdown = await fs.readFile(markdownPath, 'utf-8');
        const slides = parseMarkdownToSlides(markdown);

        if (slides.length === 0) {
            return { success: false, error: 'No slides parsed from markdown' };
        }

        const outputPath = markdownPath.replace(/\.md$/, '.pptx');
        const title = options.title || path.basename(markdownPath, '.md');

        return generateAndSavePresentation(slides, { ...options, title }, outputPath);
    } catch (err) {
        return {
            success: false,
            error: `Failed to read markdown: ${err instanceof Error ? err.message : String(err)}`
        };
    }
}
