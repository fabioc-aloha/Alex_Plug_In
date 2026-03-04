---
name: "generate-age-progression"
description: "Generate a complete character age progression series using nano-banana-pro"
---

# Generate Character Age Progression

Creates a full 13-stage life-span series from a reference photo.

## Prerequisites

- `REPLICATE_API_TOKEN` set in your environment
- 1–3 reference images of the character (anchor age, clear face, good lighting)
- Node.js with `replicate` and `fs-extra` packages

## Steps

### 1. Gather Reference Images

Collect 1–3 reference photos of the character at their canonical "anchor age" (e.g., 25 or 30):
- Front-facing or 3/4 view preferred
- Clear, well-lit face
- Save to `assets/reference/` as `character-name-ref-01.jpg`, etc.

### 2. Define Character Identity Tags

Write an identity anchor once and reuse across all ages:
```javascript
const IDENTITY = `Alex Finch, male, European features, bright blue eyes,
warm brown hair, defined cheekbones, friendly expression,
photorealistic portrait, maintaining exact facial identity`;
```

### 3. Define Life Stages

```javascript
const AGES = [
  { age: 3,  descriptor: 'toddler, rounded baby face, large eyes' },
  { age: 7,  descriptor: 'young child, slightly grown, playful energy' },
  { age: 13, descriptor: 'preteen, early adolescent features' },
  { age: 15, descriptor: 'teenager, developing adult features' },
  { age: 18, descriptor: 'young adult, college-age confidence' },
  { age: 21, descriptor: 'young adult in early twenties' },
  { age: 25, descriptor: 'mid-twenties, confident and fully mature' },
  { age: 30, descriptor: 'early thirties, calm authority' },
  { age: 42, descriptor: 'early forties, slight age lines, achieved look' },
  { age: 55, descriptor: 'mid-fifties, silver temples, distinguished' },
  { age: 62, descriptor: 'early sixties, deeper lines, warm expression' },
  { age: 68, descriptor: 'late sixties, white hair beginning' },
  { age: 75, descriptor: 'mid-seventies, elder dignity, wise eyes' },
];
```

### 4. Write the Generation Script

```javascript
import Replicate from 'replicate';
import fs from 'fs-extra';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const OUTPUT_DIR = 'assets/age-progression';
const REPORT = [];

async function toDataURI(filePath) {
  const buf = await fs.readFile(filePath);
  const ext = filePath.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

async function generateAge(refDataURI, identity, ageEntry) {
  const prompt = `${identity}, aged ${ageEntry.age} years, ${ageEntry.descriptor},
professional studio lighting, maintaining exact facial structure from reference`;

  console.log(`Generating age ${ageEntry.age}...`);
  const output = await replicate.run('google/nano-banana-pro', {
    input: {
      prompt,
      image_input: [refDataURI],  // ← CRITICAL: array, not single string
      aspect_ratio: '1:1',
      output_format: 'png',
    }
  });

  let url;
  if (output && typeof output.url === 'function') { url = output.url().toString(); }
  else if (Array.isArray(output)) { url = output[0]; }
  else { url = String(output); }

  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = `character-age-${String(ageEntry.age).padStart(2,'0')}.png`;
  await fs.outputFile(`${OUTPUT_DIR}/${filename}`, buffer);

  REPORT.push({ age: ageEntry.age, filename, url, generatedAt: new Date().toISOString() });
  console.log(`  ✅ Saved: ${filename}`);
}

async function main() {
  await fs.ensureDir(OUTPUT_DIR);
  const refDataURI = await toDataURI('assets/reference/character-ref-01.jpg');
  const identity = '<your identity string here>';

  // Validate first with 2 ages
  const VALIDATE = AGES.filter(a => a.age === 21 || a.age === 55);
  for (const entry of VALIDATE) {
    await generateAge(refDataURI, identity, entry);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n⚠️  Review validation outputs before continuing!');
  console.log('Press Ctrl+C to abort, or wait 10s to continue...\n');
  await new Promise(r => setTimeout(r, 10000));

  // Full run
  const REMAINING = AGES.filter(a => a.age !== 21 && a.age !== 55);
  for (const entry of REMAINING) {
    await generateAge(refDataURI, identity, entry);
    await new Promise(r => setTimeout(r, 2000));
  }

  await fs.outputJSON(`${OUTPUT_DIR}/generation-report.json`, {
    model: 'google/nano-banana-pro',
    totalImages: REPORT.length,
    estimatedCost: `$${(REPORT.length * 0.025).toFixed(2)}`,
    generatedAt: new Date().toISOString(),
    images: REPORT,
  }, { spaces: 2 });
  console.log('\n✅ Complete! Report saved to generation-report.json');
}

main().catch(console.error);
```

### 5. Run Validation First

```bash
node generate-ages.js
# Review: assets/age-progression/character-age-21.png
#          assets/age-progression/character-age-55.png
# Confirm identity is preserved and age difference is clearly visible
```

### 6. Review Output

Check each image for:
- [ ] Facial identity matches reference (eyes, bone structure, nose)
- [ ] Age-appropriate appearance (hair color, skin texture, age lines)
- [ ] Consistent background and lighting style
- [ ] No artifacts or face distortions

### 7. Faster Alternative (nano-banana-2)

For faster generation (same API, 3× faster):
```javascript
// Replace model ID only — all other params identical
await replicate.run('google/nano-banana-2', { input: { ... } });
// Cost: ~$0.067/1K output pixels vs $0.025/img flat rate
```

## Reference

- Full model docs: `.github/skills/character-aging-progression/SKILL.md`
- Image API patterns: `.github/skills/image-handling/SKILL.md`
- Critical: `image_input` MUST be an array `[dataURI]` — single string will silently fail face consistency
