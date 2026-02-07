import * as assert from 'assert';
import { parseMarkdownToSlides, SlideContent } from '../../generators/pptxGenerator';

suite('PPTX Generator Test Suite', () => {

    suite('parseMarkdownToSlides', () => {

        test('should parse title slide from # heading', () => {
            const markdown = `# My Presentation`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides.length, 1);
            assert.strictEqual(slides[0].type, 'title');
            assert.strictEqual(slides[0].title, 'My Presentation');
        });

        test('should parse content slide with bullets', () => {
            const markdown = `# Title
- Bullet one
- Bullet two
- Bullet three`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides.length, 1);
            assert.strictEqual(slides[0].title, 'Title');
            assert.strictEqual(slides[0].bullets?.length, 3);
            assert.strictEqual(slides[0].bullets?.[0], 'Bullet one');
        });

        test('should parse subtitle from ## heading', () => {
            const markdown = `# Main Title
## Subtitle Here`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides.length, 1);
            assert.strictEqual(slides[0].title, 'Main Title');
            assert.strictEqual(slides[0].subtitle, 'Subtitle Here');
        });

        test('should parse section slide with [section] marker', () => {
            const markdown = `## [section] Part One`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides.length, 1);
            assert.strictEqual(slides[0].type, 'section');
            assert.strictEqual(slides[0].title, 'Part One');
        });

        test('should parse speaker notes from > blockquotes', () => {
            const markdown = `# Slide Title
- Content here
> This is a speaker note`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides.length, 1);
            assert.ok(slides[0].notes?.includes('This is a speaker note'));
        });

        test('should split slides on --- separator', () => {
            const markdown = `# Slide One

---

# Slide Two`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides.length, 2);
            assert.strictEqual(slides[0].title, 'Slide One');
            assert.strictEqual(slides[1].title, 'Slide Two');
        });

        test('should handle asterisk bullets', () => {
            const markdown = `# Title
* Asterisk bullet one
* Asterisk bullet two`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides[0].bullets?.length, 2);
            assert.strictEqual(slides[0].bullets?.[0], 'Asterisk bullet one');
        });

        test('should strip fenced code blocks', () => {
            const markdown = `# Code Example
- Before code
\`\`\`javascript
const x = 1;
\`\`\`
- After code`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides[0].bullets?.length, 2);
            assert.strictEqual(slides[0].bullets?.[0], 'Before code');
            assert.strictEqual(slides[0].bullets?.[1], 'After code');
        });

        test('should strip inline backticks from bullets', () => {
            const markdown = `# Code
- Use \`npm install\` to install`;
            const slides = parseMarkdownToSlides(markdown);
            
            assert.strictEqual(slides[0].bullets?.[0], 'Use npm install to install');
        });

        test('should handle empty markdown', () => {
            const slides = parseMarkdownToSlides('');
            assert.strictEqual(slides.length, 0);
        });

        test('should handle markdown with only whitespace sections', () => {
            const markdown = `---

   

---`;
            const slides = parseMarkdownToSlides(markdown);
            assert.strictEqual(slides.length, 0);
        });
    });
});
