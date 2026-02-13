#!/usr/bin/env node
/**
 * Alex PPTX Generator CLI
 * 
 * Usage:
 *   npx ts-node scripts/pptxgen-cli.ts --input slides.md --output deck.pptx
 *   npx ts-node scripts/pptxgen-cli.ts --content "Title Slide|Bullet 1|Bullet 2" --output deck.pptx
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { parseMarkdownToSlides, generateAndSavePresentation, SlideContent, PresentationOptions } from '../../platforms/vscode-extension/src/generators/pptxGenerator';

// Simple argument parser
function parseArgs(): Record<string, string> {
    const args: Record<string, string> = {};
    const argv = process.argv.slice(2);
    
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith('--')) {
            const key = argv[i].substring(2);
            const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : 'true';
            args[key] = value;
            if (value !== 'true') i++;
        }
    }
    return args;
}

function printUsage(): void {
    console.log(`
Alex PPTX Generator CLI

Usage:
  pptxgen-cli --input <file.md> [options]
  pptxgen-cli --content "Title|Bullet1|Bullet2" [options]

Options:
  --input, -i      Input markdown file
  --content, -c    Pipe-separated content (Title|Bullet1|Bullet2)
  --output, -o     Output file path (default: output.pptx)
  --title, -t      Presentation title
  --author, -a     Author name
  --layout         Layout: 16x9 (default), 16x10, 4x3
  --theme          Theme: alex-brand (default), minimal, dark
  --help, -h       Show this help

Examples:
  pptxgen-cli --input presentation.md --output myslides.pptx
  pptxgen-cli --content "Welcome|• Point 1|• Point 2" --title "Demo" -o demo.pptx
`);
}

async function main(): Promise<void> {
    const args = parseArgs();

    if (args.help || args.h || Object.keys(args).length === 0) {
        printUsage();
        process.exit(0);
    }

    const inputFile = args.input || args.i;
    const contentArg = args.content || args.c;
    const outputFile = args.output || args.o || 'output.pptx';
    const title = args.title || args.t || 'Alex Presentation';
    const author = args.author || args.a || 'Alex Cognitive Architecture';
    const layout = (args.layout || '16x9') as '16x9' | '16x10' | '4x3';
    const theme = (args.theme || 'alex-brand') as 'alex-brand' | 'minimal' | 'dark';

    let slides: SlideContent[] = [];

    if (inputFile) {
        // Parse markdown file
        const mdPath = path.resolve(inputFile);
        try {
            await fs.access(mdPath);
        } catch {
            console.error(`Error: File not found: ${mdPath}`);
            process.exit(1);
        }
        const markdown = await fs.readFile(mdPath, 'utf-8');
        slides = parseMarkdownToSlides(markdown);
    } else if (contentArg) {
        // Parse pipe-separated content
        const parts = contentArg.split('|').map(s => s.trim());
        if (parts.length > 0) {
            slides.push({
                type: 'title',
                title: parts[0],
                subtitle: parts.length > 1 ? 'Auto-generated presentation' : undefined
            });
        }
        if (parts.length > 1) {
            slides.push({
                type: 'content',
                title: 'Content',
                bullets: parts.slice(1).map(p => p.replace(/^[•\-*]\s*/, ''))
            });
        }
    } else {
        console.error('Error: Either --input or --content is required');
        printUsage();
        process.exit(1);
    }

    if (slides.length === 0) {
        console.error('Error: No slides parsed from input');
        process.exit(1);
    }

    const options: PresentationOptions = {
        title,
        author,
        layout,
        theme
    };

    const outputPath = path.resolve(outputFile);
    console.log(`Generating ${slides.length} slides...`);

    const result = await generateAndSavePresentation(slides, options, outputPath);

    if (result.success) {
        console.log(`✅ Presentation saved: ${result.filePath}`);
        console.log(`   Slides: ${result.slideCount}`);
    } else {
        console.error(`❌ Failed: ${result.error}`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
