# Localization & Internationalization (i18n/l10n)

> **Domain**: Software localization, internationalization, multilingual application development
> **Activation**: Language detection, translation systems, RTL support, ICU MessageFormat, LQA
> **Version**: 1.0.0

---

## Activation Triggers

- "localization", "internationalization", "i18n", "l10n"
- "translate", "translation", "multilingual"
- "language detection", "Accept-Language", "locale"
- "RTL", "right-to-left", "Arabic", "Hebrew"
- "ICU MessageFormat", "pluralization"
- "font loading", "CJK", "Unicode"
- "translation quality", "LQA"

---

## Core Concepts

### Terminology Distinction

| Term | Meaning | Scope |
|------|---------|-------|
| **i18n** | Internationalization | Engineering architecture to support multiple locales |
| **l10n** | Localization | Adapting content for specific locales |
| **Locale** | Language + Region | `en-US`, `pt-BR`, `zh-Hans` |
| **BCP 47** | Language tag standard | RFC 5646 compliant tags |

### BCP 47 Language Tags

```
language[-script][-region][-variant]

Examples:
- en          → English (generic)
- en-US       → English (United States)
- en-GB       → English (United Kingdom)
- pt-BR       → Portuguese (Brazil)
- zh-Hans     → Chinese (Simplified script)
- zh-Hant     → Chinese (Traditional script)
- sr-Latn     → Serbian (Latin script)
- sr-Cyrl     → Serbian (Cyrillic script)
```

**Rules:**
- Use hyphen (`-`), not underscore (`_`)
- Lowercase language, titlecase script, uppercase region
- Keep tags minimal (no script unless disambiguating)

---

## Language Detection

### Detection Cascade (Priority Order)

```
┌─────────────────────────────────────────────┐
│  1. User Explicit Selection (highest)       │
│     └── Stored preference in database       │
├─────────────────────────────────────────────┤
│  2. Identity Provider Profile               │
│     └── MS Graph preferredLanguage          │
│     └── OIDC locale claim                   │
├─────────────────────────────────────────────┤
│  3. Organization/Tenant Default             │
│     └── Admin-configured default            │
├─────────────────────────────────────────────┤
│  4. Accept-Language Header                  │
│     └── Browser/OS setting (privacy-safe)   │
├─────────────────────────────────────────────┤
│  5. navigator.language (client-side)        │
│     └── Fallback for SPA interactions       │
├─────────────────────────────────────────────┤
│  6. Default Locale (lowest)                 │
│     └── Application default (usually 'en')  │
└─────────────────────────────────────────────┘
```

### Accept-Language Parsing

```typescript
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const SUPPORTED_LOCALES = ['en', 'en-GB', 'es', 'pt-BR', 'fr', 'de', 'ja', 'ko', 'zh-Hans', 'zh-Hant'];
const DEFAULT_LOCALE = 'en';

function detectLanguageFromHeader(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  try {
    const negotiator = new Negotiator({
      headers: { 'accept-language': acceptLanguage }
    });
    const languages = negotiator.languages();
    return match(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE);
  } catch {
    return DEFAULT_LOCALE;
  }
}
```

### CLDR Fallback Chains

```typescript
const LOCALE_FALLBACKS: Record<string, string[]> = {
  'pt-BR': ['pt-BR', 'pt', 'en'],
  'pt-PT': ['pt-PT', 'pt', 'en'],
  'zh-Hans': ['zh-Hans', 'zh', 'en'],
  'zh-Hant': ['zh-Hant', 'zh', 'en'],
  'en-GB': ['en-GB', 'en'],
  'fr-CA': ['fr-CA', 'fr', 'en'],
  'es-419': ['es-419', 'es', 'en'],  // Latin American Spanish
  // All others fall back directly to 'en'
};

function getWithFallback<T>(
  key: string,
  locale: string,
  translations: Record<string, Record<string, T>>
): T | undefined {
  const chain = LOCALE_FALLBACKS[locale] || [locale, 'en'];
  for (const loc of chain) {
    if (translations[loc]?.[key]) {
      return translations[loc][key];
    }
  }
  return undefined;
}
```

---

## Translation Patterns

### Basic Translation Function

```typescript
type TranslationKey = keyof typeof translations.en;

function t(
  key: TranslationKey,
  locale: string,
  replacements?: Record<string, string | number>
): string {
  const chain = LOCALE_FALLBACKS[locale] || [locale, 'en'];

  for (const loc of chain) {
    const translation = translations[loc]?.[key];
    if (translation) {
      return applyReplacements(translation, replacements);
    }
  }

  console.warn(`Missing translation: ${key} for ${locale}`);
  return key;
}

function applyReplacements(
  text: string,
  replacements?: Record<string, string | number>
): string {
  if (!replacements) return text;
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    text
  );
}
```

### ICU MessageFormat (Pluralization)

```typescript
import IntlMessageFormat from 'intl-messageformat';

const PLURAL_MESSAGES = {
  en: {
    items: '{count, plural, one {# item} other {# items}}',
    members: '{count, plural, one {# member} other {# members}}',
  },
  pl: {
    // Polish has complex plural rules (one, few, many, other)
    items: '{count, plural, one {# element} few {# elementy} many {# elementów} other {# elementu}}',
  },
  ar: {
    // Arabic has 6 plural forms!
    items: '{count, plural, zero {لا عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصرًا} other {# عنصر}}',
  },
};

function formatPlural(key: string, count: number, locale: string): string {
  const messages = PLURAL_MESSAGES[locale] || PLURAL_MESSAGES.en;
  const message = messages[key] || PLURAL_MESSAGES.en[key];
  const formatter = new IntlMessageFormat(message, locale);
  return formatter.format({ count }) as string;
}
```

### Date/Time/Number Formatting

```typescript
// Date formatting with locale
function formatDate(date: Date, locale: string, style: 'full' | 'long' | 'medium' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: style }).format(date);
}

// Time formatting with locale
function formatTime(date: Date, locale: string, style: 'full' | 'long' | 'medium' | 'short' = 'short'): string {
  return new Intl.DateTimeFormat(locale, { timeStyle: style }).format(date);
}

// Number formatting (respects decimal separators)
function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

// Percentage formatting
function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value / 100);
}

// Currency formatting
function formatCurrency(value: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}
```

---

## RTL (Right-to-Left) Support

### RTL Languages

```typescript
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd'];

function isRTL(locale: string): boolean {
  const lang = locale.split('-')[0];
  return RTL_LANGUAGES.includes(lang);
}

function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

function getTextAlign(locale: string): 'left' | 'right' | 'start' {
  return 'start';  // CSS logical property - auto-adapts
}
```

### CSS Logical Properties (RTL-Safe)

```css
/* ❌ DON'T use physical properties */
.container {
  margin-left: 1rem;
  padding-right: 2rem;
  text-align: left;
  border-left: 1px solid;
}

/* ✅ DO use CSS logical properties */
.container {
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
  text-align: start;
  border-inline-start: 1px solid;
}
```

### Tailwind RTL Plugin

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
}

// Usage: rtl: prefix
<div className="ml-4 rtl:mr-4 rtl:ml-0">
  Content with RTL-aware margins
</div>
```

### Document Direction

```typescript
// Set document direction based on locale
function setDocumentDirection(locale: string): void {
  document.documentElement.dir = getDirection(locale);
  document.documentElement.lang = locale;
}
```

---

## Font Handling

### Unicode Coverage by Script

| Script | Languages | Recommended Font |
|--------|-----------|------------------|
| Latin | en, es, fr, de, pt, it, nl, pl, sv, etc. | Inter, Noto Sans |
| Latin Extended | cs, hu, hr, ro, tr, vi | Noto Sans |
| Cyrillic | ru, uk, bg, sr-Cyrl | Noto Sans |
| CJK - Japanese | ja | Noto Sans JP |
| CJK - Korean | ko | Noto Sans KR |
| CJK - Simplified | zh-Hans | Noto Sans SC |
| CJK - Traditional | zh-Hant | Noto Sans TC |
| Thai | th | Noto Sans Thai |
| Arabic | ar | Noto Sans Arabic |
| Hebrew | he | Noto Sans Hebrew |
| Devanagari | hi, mr, ne | Noto Sans Devanagari |

### PDF Font Registration (react-pdf)

```typescript
import { Font } from '@react-pdf/renderer';

// Register multilingual fonts
Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/notosans/v36/...-Regular.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/notosans/v36/...-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Noto Sans JP',
  src: 'https://fonts.gstatic.com/s/notosansjp/v52/...-Regular.otf',
});

Font.register({
  family: 'Noto Sans SC',
  src: 'https://fonts.gstatic.com/s/notosanssc/v36/...-Regular.otf',
});

// Font selection by locale
function getFontFamily(locale: string): string {
  const lang = locale.split('-')[0];
  switch (lang) {
    case 'ja': return 'Noto Sans JP';
    case 'ko': return 'Noto Sans KR';
    case 'zh': return locale.includes('Hant') ? 'Noto Sans TC' : 'Noto Sans SC';
    case 'th': return 'Noto Sans Thai';
    case 'ar': return 'Noto Sans Arabic';
    case 'he': return 'Noto Sans Hebrew';
    case 'hi': return 'Noto Sans Devanagari';
    default: return 'Noto Sans';
  }
}
```

### Web Font Loading Strategy

```typescript
// Preload critical fonts
<link rel="preload" href="/fonts/NotoSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

// Font-display strategy
@font-face {
  font-family: 'Noto Sans';
  src: url('/fonts/NotoSans-Regular.woff2') format('woff2');
  font-display: swap;  /* Show fallback immediately, swap when loaded */
}
```

---

## Text Expansion & Contraction

### Expansion Ratios by Language

| Language | vs English | Example |
|----------|------------|---------|
| German | +30% | "Settings" → "Einstellungen" |
| Finnish | +30-40% | Complex compound words |
| French | +15-20% | Longer phrases |
| Spanish | +20-25% | Gender agreement |
| Italian | +15% | |
| Russian | +15% | |
| Arabic | +25% | Plus RTL |
| Chinese | -30% | "Download" → "下载" |
| Japanese | -10-20% | |
| Korean | -10% | |

### UI Design Guidelines

```css
/* ❌ Fixed width - will truncate */
.button { width: 100px; }

/* ✅ Flexible with constraints */
.button {
  min-width: 80px;
  max-width: 200px;
  padding-inline: 1rem;
}

/* ✅ Truncation with tooltip */
.label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## Pseudo-Localization (Testing)

```typescript
function pseudoLocalize(text: string): string {
  // 1. Preserve placeholders
  const placeholders: string[] = [];
  let processed = text.replace(/\{[^}]+\}/g, (match) => {
    placeholders.push(match);
    return `__PH${placeholders.length - 1}__`;
  });

  // 2. Transform characters (simulates accented text)
  processed = processed
    .replace(/a/g, 'à').replace(/A/g, 'À')
    .replace(/e/g, 'é').replace(/E/g, 'É')
    .replace(/i/g, 'í').replace(/I/g, 'Í')
    .replace(/o/g, 'ó').replace(/O/g, 'Ó')
    .replace(/u/g, 'ú').replace(/U/g, 'Ú');

  // 3. Add ~30% padding (simulates German expansion)
  const padding = '~'.repeat(Math.ceil(processed.length * 0.3));

  // 4. Wrap with markers (reveals untranslated strings)
  processed = `[${processed}${padding}]`;

  // 5. Restore placeholders
  placeholders.forEach((ph, i) => {
    processed = processed.replace(`__PH${i}__`, ph);
  });

  return processed;
}

// "Welcome, {name}!" → "[Wélcómé, {name}!~~~~~~]"
```

**Benefits:**
- Reveals untranslated/hardcoded strings (missing `[...]` markers)
- Tests text expansion before real translations
- Works in development without translation files
- Identifies layout issues early

---

## Next.js i18n Setup

### Middleware Configuration

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'en-GB', 'es', 'pt-BR', 'fr', 'de', 'ja', 'ko', 'zh-Hans', 'zh-Hant'],
  defaultLocale: 'en',
  localeDetection: true,  // Uses Accept-Language
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### Request Configuration

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  const locale = detectLanguageFromHeader(acceptLanguage);

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
```

### URL Strategy Options

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| Subpath | `/es/dashboard` | SEO-friendly, shareable | Routing complexity |
| Query param | `/dashboard?lang=es` | Simple | Not SEO-friendly |
| Cookie/Header | Auto-detect | Seamless | Can't share language links |
| Subdomain | `es.example.com` | Clear separation | DNS/hosting complexity |

**Recommendation:** Subpath for public pages, cookie for app pages.

---

## Localization Quality Assurance (LQA)

### LQA Dimensions

| Dimension | Focus | Example Issues |
|-----------|-------|----------------|
| **Linguistic** | Grammar, terminology | "Guardar" vs "Salvar" (regional Spanish) |
| **Functional** | Layout, encoding | Text truncation, broken characters |
| **Cultural** | Appropriateness | Colors, icons, date formats |
| **Legal** | Compliance | GDPR wording, privacy notices |
| **Technical** | Performance | RTL rendering, font loading |

### Automated Testing

```typescript
describe('Localization QA', () => {
  const SUPPORTED_LOCALES = ['en', 'es', 'pt-BR', 'fr', 'de', 'ja'];

  // Test: All keys present
  test.each(SUPPORTED_LOCALES)('%s has all translation keys', (locale) => {
    const baseKeys = Object.keys(translations.en);
    const localeKeys = Object.keys(translations[locale] || {});
    const missing = baseKeys.filter(key => !localeKeys.includes(key));
    expect(missing).toEqual([]);
  });

  // Test: No empty translations
  test.each(SUPPORTED_LOCALES)('%s has no empty strings', (locale) => {
    const empty = Object.entries(translations[locale] || {})
      .filter(([_, v]) => !v?.trim())
      .map(([k]) => k);
    expect(empty).toEqual([]);
  });

  // Test: Placeholder consistency
  test.each(SUPPORTED_LOCALES)('%s has matching placeholders', (locale) => {
    const issues: string[] = [];
    Object.entries(translations.en).forEach(([key, enValue]) => {
      const enPlaceholders = (enValue.match(/\{[^}]+\}/g) || []).sort();
      const locValue = translations[locale]?.[key] || '';
      const locPlaceholders = (locValue.match(/\{[^}]+\}/g) || []).sort();
      if (JSON.stringify(enPlaceholders) !== JSON.stringify(locPlaceholders)) {
        issues.push(key);
      }
    });
    expect(issues).toEqual([]);
  });
});
```

### Review Levels

| Level | Reviewer | When |
|-------|----------|------|
| L1: Automated | CI/CD | Every PR |
| L2: Developer | Engineer | Before merge |
| L3: Linguistic | Native speaker | Before release |
| L4: Professional | Translation agency | Major releases |
| L5: In-market | Local users | Post-release |

### Bug Severity Classification

| Severity | Examples | SLA |
|----------|----------|-----|
| **Critical** | Legal text incorrect, offensive content | Fix immediately |
| **Major** | UI broken, text truncated, missing strings | Fix before release |
| **Minor** | Typo, awkward phrasing | Fix in next release |
| **Preferential** | Style choice, wording preference | Consider for future |

---

## Terminology Management

### Glossary Pattern

```typescript
const GLOSSARY = {
  en: {
    assessment: 'Assessment',
    dashboard: 'Dashboard',
    settings: 'Settings',
  },
  'pt-BR': {
    assessment: 'Avaliação',      // NOT "Teste" or "Exame"
    dashboard: 'Painel',          // NOT "Dashboard" (avoid anglicisms)
    settings: 'Configurações',
  },
  es: {
    assessment: 'Evaluación',     // NOT "Examen"
    dashboard: 'Panel',
    settings: 'Configuración',
  },
};

// Terms to KEEP in English (brand names, technical terms)
const DO_NOT_TRANSLATE = [
  'Microsoft',
  'Azure',
  'Copilot',
  'AIRS',          // Brand name
  'AIRS-16',       // Research instrument
  'PDF',
  'API',
];
```

---

## Recommended Libraries

| Package | Purpose | Size |
|---------|---------|------|
| `next-intl` | Next.js App Router i18n | ~8KB |
| `@formatjs/intl-localematcher` | BCP 47 locale matching | ~2KB |
| `negotiator` | Accept-Language parsing | ~3KB |
| `intl-messageformat` | ICU MessageFormat (plurals) | ~15KB |
| `rtl-detect` | Detect RTL languages | ~1KB |
| `tailwindcss-rtl` | Tailwind RTL utilities | Dev only |

---

## File Structure

```
src/
├── i18n/
│   ├── config.ts           # Supported locales, defaults
│   ├── request.ts          # next-intl request config
│   ├── detect-language.ts  # Detection utilities
│   ├── formatters.ts       # Date/number/currency formatters
│   └── rtl.ts              # RTL utilities
├── messages/
│   ├── en.json             # English (base)
│   ├── en-GB.json          # British English
│   ├── es.json             # Spanish
│   ├── pt-BR.json          # Portuguese (Brazil)
│   ├── fr.json             # French
│   ├── de.json             # German
│   ├── ja.json             # Japanese
│   ├── ko.json             # Korean
│   ├── zh-Hans.json        # Chinese (Simplified)
│   └── zh-Hant.json        # Chinese (Traditional)
└── lib/
    └── pdf/
        ├── fonts.ts        # Font registration
        └── translations.ts # PDF-specific translations
```

---

## Quick Reference

### Language Switcher UX

✅ **Do:**
- Show native language names ("Deutsch" not "German")
- Use flag + name (flags alone are problematic)
- Group by region for long lists
- Make switcher visible in header
- Instant switch (no page reload)

❌ **Don't:**
- Hide in footer or settings
- Use flags alone (languages ≠ countries)
- Auto-switch without confirmation
- Use English names for languages

### Privacy Considerations

All detection methods should be GDPR/privacy compliant:
- ✅ User selection (explicit consent)
- ✅ Accept-Language header (browser setting, not PII)
- ✅ Organization default (no personal data)
- ❌ IP-based geolocation (PII, avoid)

---

## Synapses

See [synapses.json](./synapses.json) for connection mapping.

**High Affinity:**
- `testing-strategies` — Localization testing, pseudo-loc
- `architecture` — i18n architecture patterns

**Medium Affinity:**
- `vscode-extension-patterns` — Extension localization
- `writing-publication` — Multilingual content

**Low Affinity:**
- `graphic-design` — RTL layouts, typography
- `cognitive-load` — Minimize language-switching friction
