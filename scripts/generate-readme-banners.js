#!/usr/bin/env node

/**
 * Generate 3 typography banners for Alex README
 * Uses Ideogram v2 for crystal-clear text rendering
 */

import Replicate from 'replicate';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const OUTPUT_DIR = path.join(__dirname, '..', 'assets');

// Alex brand colors: Professional blues, purples, modern tech aesthetic
const ALEX_BRAND = {
  colors: 'Deep blue (#0078d4), vibrant purple (#7c3aed), electric teal accents',
  style: 'Modern tech aesthetic, clean lines, professional gradient backgrounds',
  mood: 'Inspiring, intelligent, trustworthy, forward-thinking'
};

const BANNERS = [
  {
    id: 'rocket-code',
    filename: 'banner-rocket-code.png',
    title: 'CODE',
    subtitle: 'Strap a Rocket to Your Back',
    prompt: `Professional technology banner (3:1 ultra-wide format).

TITLE TEXT (large, centered):
"STRAP A ROCKET TO YOUR BACK"
- Bold modern sans-serif, uppercase
- White with subtle blue glow
- Crystal clear, perfectly legible
- Split into two lines if needed

SUBTITLE TEXT (below title):
"Take Your CODE to New Heights"
- Clean font, white text
- Smaller size, readable

ROCKET VISUAL:
- Large sleek rocket flying diagonally upward from bottom-left
- Azure blue metallic body (#0078d4)
- Prominent "A" letter cutout (negative space) on rocket body
- Glowing vibrant orange/golden flame trail
- Modern aerodynamic design
- Photorealistic 3D rendering

BOTTOM LEFT CORNER:
- Small "CX" logo mark in blue
- "CorreaX" text nearby in gray

BACKGROUND COMPOSITION:
- Deep space gradient (#080810 → #0d1520)
- Scattered white stars (minimal, elegant)
- Large radial blue glow behind rocket
- Particle effects in rocket trail
- Clean professional composition

LIGHTING:
- Soft ambient space lighting
- Bright glow from rocket flame
- Radiant halo around rocket
- Modern cinematic quality

COLOR PALETTE:
- Background: Deep space blacks and dark blues
- Rocket: Azure blue (#0078d4) metallic
- Flame: Golden orange (#ffc857 → #ff6b35)
- Text: White with blue glow
- Logo: Blue and gray

STYLE:
- Photorealistic 3D rendering
- Modern tech aesthetic
- Inspiring upward motion
- Professional corporate quality
- Sharp detail, cinematic

TEXT QUALITY CRITICAL:
- Crystal clear text rendering
- No distortion or blur
- Perfect spacing and alignment
- Professional typography

MOOD: Inspiring, powerful, upward trajectory, achievement`,
  },
  {
    id: 'rocket-learning',
    filename: 'banner-rocket-learning.png',
    title: 'LEARNING',
    subtitle: 'Strap a Rocket to Your Back',
    prompt: `Inspirational technology banner (3:1 ultra-wide format).

TITLE TEXT (centered below rocket):
"STRAP A ROCKET TO YOUR BACK"
- Bold uppercase, gradient blue to purple
- Crystal clear sharp lettering
- Professional typography

SUBTITLE TEXT:
"Take Your LEARNING to New Heights"
- Clean white text
- Readable professional font

ROCKET VISUAL:
- Large centered rocket pointing upward
- Azure blue body with vibrant purple accents
- Prominent "A" cutout on rocket body
- Glowing golden flame beneath rocket
- Centered hero composition
- Photorealistic 3D rendering

BOTTOM RIGHT CORNER:
- "CX" logo in purple
- "CorreaX" text in gray

BACKGROUND COMPOSITION:
- Dark gradient (#0d1520 → #1a1f35)
- Scattered stars throughout
- Purple and blue radial glow behind rocket
- Particle effects rising from flame
- Elegant centered layout

LIGHTING:
- Dramatic uplighting from flame
- Purple/blue ambient glow
- Volumetric light rays
- Modern cinematic lighting

COLOR PALETTE:
- Background: Dark blue to purple gradient
- Rocket: Blue (#0078d4) with purple (#7c3aed)
- Flame: Bright golden orange
- Text: White with gradient glow
- Logo: Purple tones

STYLE:
- Photorealistic hero shot
- Centered powerful composition
- Modern inspiring design
- Sharp professional rendering
- High-quality cinematic

TEXT QUALITY CRITICAL:
- Perfectly legible text
- Sharp clear letterforms
- Gradient smoothly applied
- Professional hierarchy

MOOD: Learning, growth, inspiration, upward momentum`,
  },
  {
    id: 'rocket-career',
    filename: 'banner-rocket-career.png',
    title: 'CAREER',
    subtitle: 'Strap a Rocket to Your Back',
    prompt: `Professional career banner (3:1 ultra-wide format).

TITLE TEXT (left side):
"STRAP A ROCKET TO YOUR BACK"
- Bold uppercase letters
- "TO YOUR BACK" in teal gradient (#14b8a6)
- Rest in white
- Crystal clear typography
- Left-aligned composition

SUBTITLE TEXT:
"Take Your CAREER to New Heights"
- Clean white text
- Professional readable font

ROCKET VISUAL:
- Large sleek rocket on right side
- Flying upward and to the right
- Azure blue with teal accents
- Prominent "A" cutout negative space
- Bright flame trail
- Photorealistic 3D rendering

BOTTOM CENTER:
- "CX" logo in teal
- "CorreaX" text in gray

BACKGROUND COMPOSITION:
- Deep space gradient (#0a1628 → #0d1f35 → #0a1a2e)
- Scattered white stars
- Teal and blue radial glow around rocket
- Particle trails following rocket
- Professional balanced layout

LIGHTING:
- Teal ambient lighting
- Bright flame glow
- Radiant halo effects
- Modern professional lighting

COLOR PALETTE:
- Background: Deep teals and dark blues
- Rocket: Blue (#0078d4) with teal (#14b8a6)
- Flame: Golden orange gradient
- Text: White with teal accents
- Logo: Teal theme

STYLE:
- Photorealistic rendering
- Professional corporate aesthetic
- Dynamic composition
- Sharp cinematic quality
- Modern inspiring design

TEXT QUALITY CRITICAL:
- Crystal clear text
- Perfect teal gradient
- Professional alignment
- Sharp readable letters

MOOD: Career advancement, professional growth, success, achievement`,
  }
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateBanner(banner) {
  console.log(`\n🎨 Generating: ${banner.title}`);
  console.log(`📝 Subtitle: ${banner.subtitle}`);
  
  try {
    const input = {
      prompt: banner.prompt,
      aspect_ratio: '3:1',
      magic_prompt_option: 'On',
      style_type: 'Realistic',
      resolution: '1536x512',
      output_format: 'png',
    };

    console.log('⏳ Calling Ideogram v2 API...');
    const output = await replicate.run('ideogram-ai/ideogram-v2', { input });

    // Handle Ideogram's URL getter function quirk
    let imageUrl;
    if (output && typeof output.url === 'function') {
      imageUrl = output.url().toString();
    } else if (Array.isArray(output)) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else if (output && output.url) {
      imageUrl = output.url;
    }

    // Additional safety for object URLs
    if (typeof imageUrl === 'object' && imageUrl.href) {
      imageUrl = imageUrl.href;
    }

    if (!imageUrl) {
      throw new Error('Failed to extract image URL from Ideogram response');
    }

    console.log(`📥 Downloading from: ${imageUrl.substring(0, 50)}...`);
    
    const filepath = path.join(OUTPUT_DIR, banner.filename);
    await downloadImage(imageUrl, filepath);
    
    console.log(`✅ Saved: ${banner.filename}`);
    
    return {
      id: banner.id,
      filename: banner.filename,
      title: banner.title,
      subtitle: banner.subtitle,
      url: imageUrl,
      cost: 0.08
    };

  } catch (error) {
    console.error(`❌ Error generating ${banner.title}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Alex README Banner Generator');
  console.log('================================\n');
  console.log(`Using: Ideogram v2 (3:1 aspect ratio, 1536x512)`);
  console.log(`Cost: $0.08 per banner × 3 = $0.24 total`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Ensure output directory exists
  await fs.ensureDir(OUTPUT_DIR);

  const results = [];
  
  for (const banner of BANNERS) {
    try {
      const result = await generateBanner(banner);
      results.push(result);
      
      // Rate limiting: wait 2 seconds between requests
      if (BANNERS.indexOf(banner) < BANNERS.length - 1) {
        console.log('⏸️  Waiting 2s to avoid rate limits...');
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (error) {
      console.error(`Failed to generate ${banner.id}`);
      results.push({ id: banner.id, error: error.message });
    }
  }

  console.log('\n================================');
  console.log('📊 Generation Report\n');
  
  const successful = results.filter(r => !r.error);
  const failed = results.filter(r => r.error);
  
  console.log(`✅ Successful: ${successful.length}/${BANNERS.length}`);
  console.log(`❌ Failed: ${failed.length}/${BANNERS.length}`);
  console.log(`💰 Total cost: $${(successful.length * 0.08).toFixed(2)}`);
  
  if (successful.length > 0) {
    console.log('\n📁 Generated files:');
    successful.forEach(r => {
      console.log(`   - ${r.filename} (${r.title})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n⚠️  Failed:');
    failed.forEach(r => {
      console.log(`   - ${r.id}: ${r.error}`);
    });
  }

  console.log('\n🔍 Next steps:');
  console.log('1. Review generated banners in assets/');
  console.log('2. Update README.md to include new banners');
  console.log('3. Commit to repository');
  
  // Write generation metadata
  const metadata = {
    generatedAt: new Date().toISOString(),
    model: 'ideogram-ai/ideogram-v2',
    results: results,
    totalCost: successful.length * 0.08
  };
  
  await fs.writeJson(
    path.join(OUTPUT_DIR, 'banner-generation-report.json'),
    metadata,
    { spaces: 2 }
  );
  
  console.log('\n📝 Metadata saved to: banner-generation-report.json');
}

main().catch(console.error);
