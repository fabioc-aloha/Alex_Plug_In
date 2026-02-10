# Language Detection Patterns

**Purpose**: Reusable strategies for detecting natural language in text content
**Created**: 2026-02-05 (Meditation Session)
**Author**: Alex (consolidated from TTS v2.1 implementation)

---

## Detection Strategy Overview

When processing multilingual text, use a two-tier detection approach:

1. **Character-based detection** (high confidence) - For scripts with unique Unicode ranges
2. **Word-pattern detection** (medium confidence) - For Latin-script languages with distinctive markers

---

## Tier 1: Character-Based Detection

Languages with unique scripts can be detected with near-100% accuracy by checking character ranges.

```typescript
const SCRIPT_PATTERNS: Record<string, RegExp> = {
  'zh': /[\u4e00-\u9fff]/,           // Chinese (CJK Unified Ideographs)
  'ja': /[\u3040-\u309f\u30a0-\u30ff]/, // Japanese (Hiragana + Katakana)
  'ko': /[\uac00-\ud7af\u1100-\u11ff]/, // Korean (Hangul)
  'ar': /[\u0600-\u06ff]/,           // Arabic
  'he': /[\u0590-\u05ff]/,           // Hebrew
  'th': /[\u0e00-\u0e7f]/,           // Thai
  'hi': /[\u0900-\u097f]/,           // Hindi (Devanagari)
  'ru': /[\u0400-\u04ff]/,           // Russian/Cyrillic
  'el': /[\u0370-\u03ff]/,           // Greek
  'vi': /[\u1ea0-\u1ef9]/,           // Vietnamese diacritics
};
```

**Scoring**: Count characters matching each pattern. Script with highest ratio wins.

---

## Tier 2: Word-Pattern Detection

For Latin-script languages, detect via common function words and patterns.

```typescript
const WORD_PATTERNS: Record<string, RegExp> = {
  'es': /\b(el|la|los|las|que|de|en|por|para|con)\b/gi,    // Spanish
  'fr': /\b(le|la|les|de|des|que|est|dans|pour|avec)\b/gi, // French
  'de': /\b(der|die|das|und|ist|nicht|ein|eine|für)\b/gi,  // German
  'pt': /\b(o|a|os|as|de|que|não|para|com|uma)\b/gi,       // Portuguese
  'it': /\b(il|la|di|che|non|per|una|sono|con|del)\b/gi,   // Italian
  'nl': /\b(de|het|een|van|en|in|is|dat|op|te)\b/gi,       // Dutch
  'pl': /\b(i|w|do|na|to|nie|jest|się|że|co)\b/gi,         // Polish
  'sv': /\b(och|i|att|det|som|en|på|är|av|för)\b/gi,       // Swedish
  'no': /\b(og|i|er|det|en|på|som|med|til|av)\b/gi,        // Norwegian
  'da': /\b(og|i|at|det|en|er|af|på|med|til)\b/gi,         // Danish
  'fi': /\b(ja|on|ei|se|että|oli|kun|niin|vain|hän)\b/gi,  // Finnish
  'tr': /\b(ve|bir|bu|için|ile|de|da|o|ne|gibi)\b/gi,      // Turkish
  'id': /\b(dan|yang|di|untuk|dengan|pada|ke|ini|itu)\b/gi, // Indonesian
  'tl': /\b(ang|ng|sa|at|na|mga|ay|ito|ko|ako)\b/gi,       // Tagalog
  'ro': /\b(și|de|în|la|cu|un|pentru|pe|este|sau)\b/gi,    // Romanian
  'cs': /\b(a|v|se|na|je|to|že|s|do|pro)\b/gi,             // Czech
  'hu': /\b(a|az|és|hogy|nem|is|meg|ez|van|volt)\b/gi,     // Hungarian
};
```

**Scoring**: Count pattern matches per language. Normalize by text length.

---

## Confidence Calculation

```typescript
function detectLanguage(text: string): { language: string; confidence: number } {
  const scores: Record<string, number> = {};
  
  // Tier 1: Character-based (high weight)
  for (const [lang, pattern] of Object.entries(SCRIPT_PATTERNS)) {
    const matches = (text.match(pattern) || []).length;
    scores[lang] = (scores[lang] || 0) + (matches / text.length) * 100;
  }
  
  // Tier 2: Word-pattern (lower weight)
  for (const [lang, pattern] of Object.entries(WORD_PATTERNS)) {
    const matches = (text.match(pattern) || []).length;
    scores[lang] = (scores[lang] || 0) + (matches / text.split(/\s+/).length) * 50;
  }
  
  // Find best match
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topLang, topScore] = sorted[0] || ['en', 0];
  
  return { language: topLang, confidence: topScore };
}
```

---

## User Prompt Fallback

When `confidence < THRESHOLD` (recommended: 15%), prompt the user:

```typescript
const CONFIDENCE_THRESHOLD = 0.15;

if (result.confidence < CONFIDENCE_THRESHOLD) {
  const selected = await showLanguageQuickPick(result.language);
  return selected || 'en'; // Default to English
}
```

---

## Application Contexts

| Feature | How It Uses Detection |
|---------|----------------------|
| **TTS** | Select appropriate voice and `xml:lang` for SSML |
| **Translation** | Detect source language before translation |
| **Spellcheck** | Load correct dictionary |
| **Code comments** | Identify mixed-language documentation |
| **Search** | Apply language-specific tokenization |

---

## Synapses

- [.github/skills/text-to-speech/SKILL.md] (High, Enables, Bidirectional) - "Primary consumer of detection"
- [.github/skills/accessibility/SKILL.md] (Medium, Enables, Forward) - "i18n accessibility features"

---

## References

- Unicode Standard: https://unicode.org/charts/
- Edge TTS voice list: `edge-tts --list-voices`
- ISO 639-1 language codes: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
