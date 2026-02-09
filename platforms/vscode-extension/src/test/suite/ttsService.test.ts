/**
 * TTS Service Unit Tests
 * 
 * Tests for language detection, markdown-to-speech processing,
 * and text preparation for speech synthesis.
 */

import * as assert from 'assert';
import { detectLanguage, prepareTextForSpeech, getVoiceForLanguage, LANGUAGE_VOICES } from '../../tts';

suite('TTS Service Test Suite', () => {
    
    suite('Language Detection', () => {
        
        test('should detect English text', () => {
            const result = detectLanguage('The quick brown fox jumps over the lazy dog');
            assert.strictEqual(result.lang, 'en-US');
            assert.ok(result.confidence > 0, 'Should have positive confidence');
        });
        
        test('should detect Spanish text', () => {
            const result = detectLanguage('El rápido zorro marrón salta sobre el perro perezoso');
            assert.strictEqual(result.lang, 'es-ES');
            assert.ok(result.confidence > 0);
        });
        
        test('should detect French text', () => {
            const result = detectLanguage('Le renard brun rapide saute par-dessus le chien paresseux');
            assert.strictEqual(result.lang, 'fr-FR');
            assert.ok(result.confidence > 0);
        });
        
        test('should detect German text', () => {
            const result = detectLanguage('Der schnelle braune Fuchs springt über den faulen Hund');
            assert.strictEqual(result.lang, 'de-DE');
            assert.ok(result.confidence > 0);
        });
        
        test('should detect Chinese text', () => {
            const result = detectLanguage('敏捷的棕色狐狸跳过懒狗');
            assert.strictEqual(result.lang, 'zh-CN');
            assert.ok(result.confidence > 0);
        });
        
        test('should detect Japanese text', () => {
            const result = detectLanguage('すばしこい茶色の狐がのろまな犬を飛び越える');
            assert.strictEqual(result.lang, 'ja-JP');
            assert.ok(result.confidence > 0);
        });
        
        test('should detect Korean text', () => {
            const result = detectLanguage('빠른 갈색 여우가 게으른 개를 뛰어넘는다');
            assert.strictEqual(result.lang, 'ko-KR');
            assert.ok(result.confidence > 0);
        });
        
        test('should detect Arabic text', () => {
            const result = detectLanguage('الثعلب البني السريع يقفز فوق الكلب الكسول');
            assert.strictEqual(result.lang, 'ar-SA');
            assert.ok(result.confidence > 0);
        });
        
        test('should detect Russian text', () => {
            const result = detectLanguage('Быстрая коричневая лиса прыгает через ленивую собаку');
            assert.strictEqual(result.lang, 'ru-RU');
            assert.ok(result.confidence > 0);
        });
        
        test('should return en-US with 0 confidence for very short text', () => {
            const result = detectLanguage('Hi');
            assert.strictEqual(result.lang, 'en-US');
            assert.strictEqual(result.confidence, 0);
        });
        
        test('should return en-US with 0 confidence for empty text', () => {
            const result = detectLanguage('');
            assert.strictEqual(result.lang, 'en-US');
            assert.strictEqual(result.confidence, 0);
        });
        
        test('should handle text with 5 characters (threshold)', () => {
            const result = detectLanguage('Hello');
            // Should attempt detection, not return 0 confidence
            assert.strictEqual(result.lang, 'en-US');
        });
    });
    
    suite('Voice Selection', () => {
        
        test('should return correct voice for en-US', () => {
            const voice = getVoiceForLanguage('en-US');
            assert.strictEqual(voice, 'en-US-GuyNeural');
        });
        
        test('should return correct voice for es-ES', () => {
            const voice = getVoiceForLanguage('es-ES');
            assert.strictEqual(voice, 'es-ES-AlvaroNeural');
        });
        
        test('should fallback to en-US for unknown language', () => {
            const voice = getVoiceForLanguage('xx-XX');
            assert.strictEqual(voice, 'en-US-GuyNeural');
        });
        
        test('should have voices for all documented languages', () => {
            const expectedLanguages = [
                'en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'de-DE', 
                'it-IT', 'pt-BR', 'pt-PT', 'nl-NL', 'pl-PL', 'ru-RU',
                'zh-CN', 'ja-JP', 'ko-KR', 'ar-SA', 'hi-IN', 'tr-TR'
            ];
            
            for (const lang of expectedLanguages) {
                assert.ok(LANGUAGE_VOICES[lang], `Missing voice for ${lang}`);
                assert.ok(LANGUAGE_VOICES[lang].voice, `Missing voice name for ${lang}`);
                assert.ok(LANGUAGE_VOICES[lang].name, `Missing display name for ${lang}`);
            }
        });
    });
    
    suite('Markdown to Speech Preparation', () => {
        
        test('should remove inline code backticks', () => {
            const result = prepareTextForSpeech('Use the `console.log` function');
            assert.ok(!result.includes('`'), 'Should not contain backticks');
            assert.ok(result.includes('console.log'), 'Should preserve code text');
        });
        
        test('should convert bold to plain text', () => {
            const result = prepareTextForSpeech('This is **bold** text');
            assert.ok(!result.includes('**'), 'Should not contain asterisks');
            assert.ok(result.includes('bold'), 'Should preserve bold text');
        });
        
        test('should convert italic to plain text', () => {
            const result = prepareTextForSpeech('This is *italic* text');
            assert.ok(!result.includes('*'), 'Should not contain asterisks');
            assert.ok(result.includes('italic'), 'Should preserve italic text');
        });
        
        test('should strip code blocks and summarize', () => {
            const markdown = '```typescript\nconst x = 1;\n```';
            const result = prepareTextForSpeech(markdown);
            assert.ok(result.includes('TypeScript'), 'Should mention language');
            assert.ok(result.includes('code block'), 'Should indicate code block');
            assert.ok(!result.includes('const x'), 'Should not include code');
        });
        
        test('should convert mermaid diagrams to summary', () => {
            const markdown = '```mermaid\ngraph TD\nA-->B\n```';
            const result = prepareTextForSpeech(markdown);
            assert.ok(result.includes('diagram'), 'Should mention diagram');
        });
        
        test('should handle headers with level indication', () => {
            const result = prepareTextForSpeech('# Main Title\n## Section\n### Subsection');
            assert.ok(result.includes('Title'), 'Should include title marker');
            assert.ok(result.includes('Heading'), 'Should include heading marker');
            assert.ok(result.includes('Section'), 'Should include section marker');
        });
        
        test('should convert task list to spoken format', () => {
            const markdown = '- [x] Done task\n- [ ] Todo task';
            const result = prepareTextForSpeech(markdown);
            assert.ok(result.includes('Completed'), 'Should say completed for checked');
            assert.ok(result.includes('To do'), 'Should say to do for unchecked');
        });
        
        test('should convert links to text with indicator', () => {
            const markdown = 'Visit [Google](https://google.com) for more';
            const result = prepareTextForSpeech(markdown);
            assert.ok(result.includes('Google'), 'Should preserve link text');
            assert.ok(result.includes('link'), 'Should indicate external link');
            assert.ok(!result.includes('https://'), 'Should not include URL');
        });
        
        test('should expand common abbreviations', () => {
            const result = prepareTextForSpeech('The API uses JSON and TTS');
            assert.ok(result.includes('A P I'), 'Should expand API');
            assert.ok(result.includes('text to speech'), 'Should expand TTS');
        });
        
        test('should convert arrows to words', () => {
            const result = prepareTextForSpeech('A → B ← C');
            assert.ok(result.includes('leads to'), 'Should convert right arrow');
            assert.ok(result.includes('from'), 'Should convert left arrow');
        });
        
        test('should handle emoji with redundant text', () => {
            const result = prepareTextForSpeech('✅ Completed task');
            // Should not say "completed completed"
            const completedCount = (result.match(/completed/gi) || []).length;
            assert.strictEqual(completedCount, 1, 'Should not duplicate "completed"');
        });
        
        test('should handle standalone emoji', () => {
            const result = prepareTextForSpeech('Status: ✅');
            assert.ok(result.includes('completed'), 'Should convert checkmark emoji');
        });
        
        test('should convert version patterns', () => {
            const result = prepareTextForSpeech('Released v2.1.0 today');
            assert.ok(result.includes('version 2.1.0'), 'Should expand version');
        });
        
        test('should convert percentage patterns', () => {
            const result = prepareTextForSpeech('Progress is 85%');
            assert.ok(result.includes('85 percent'), 'Should expand percent');
        });
        
        test('should convert file extensions', () => {
            const result = prepareTextForSpeech('Edit the file.ts and config.json');
            assert.ok(result.includes('TypeScript file'), 'Should expand .ts');
            assert.ok(result.includes('JSON file'), 'Should expand .json');
        });
        
        test('should clean up multiple periods and commas', () => {
            const result = prepareTextForSpeech('End of sentence.. Next sentence');
            assert.ok(!result.includes('..'), 'Should not have double periods');
        });
        
        test('should handle blockquotes', () => {
            const result = prepareTextForSpeech('> This is a quote');
            assert.ok(result.includes('Quote'), 'Should indicate quote');
            assert.ok(result.includes('This is a quote'), 'Should preserve quote text');
        });
        
        test('should handle images with alt text', () => {
            const result = prepareTextForSpeech('![Screenshot of dashboard](./img.png)');
            assert.ok(result.includes('image'), 'Should indicate image');
            assert.ok(result.includes('Screenshot of dashboard'), 'Should include alt text');
        });
    });
    
    suite('Table to Speech', () => {
        
        test('should convert simple table to spoken format', () => {
            const table = `| Name | Age |
| --- | --- |
| Alice | 30 |
| Bob | 25 |`;
            
            const result = prepareTextForSpeech(table);
            assert.ok(result.includes('Table'), 'Should indicate table');
            assert.ok(result.includes('columns'), 'Should mention columns');
            assert.ok(result.includes('Row'), 'Should mention rows');
        });
        
        test('should handle tables with formatting', () => {
            const table = `| Status | Description |
| --- | --- |
| **Active** | Currently running |
| *Pending* | Waiting to start |`;
            
            const result = prepareTextForSpeech(table);
            assert.ok(result.includes('Active'), 'Should preserve content');
            assert.ok(!result.includes('**'), 'Should strip formatting');
        });
    });
});
