import Replicate from 'replicate';
import fs from 'fs-extra';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Persona configurations with brand colors and themes
const PERSONAS = [
  {
    filename: 'ALEX-DEVELOPER.png',
    title: 'CODE',
    subtitle: 'Ship Faster, Debug Less',
    color: '#0078d4', // Azure blue
  },
  {
    filename: 'ALEX-ACADEMIC.png',
    title: 'THESIS',
    subtitle: 'Research to Publication',
    color: '#7c3aed', // Deep purple
  },
  {
    filename: 'ALEX-STUDENT.png',
    title: 'LEARNING',
    subtitle: 'Master Concepts, Not Memorize',
    color: '#14b8a6', // Electric teal
  },
  {
    filename: 'ALEX-RESEARCHER.png',
    title: 'RESEARCH',
    subtitle: 'Hypothesis to Discovery',
    color: '#0078d4', // Azure blue
  },
  {
    filename: 'ALEX-TECHNICAL-WRITER.png',
    title: 'DOCS',
    subtitle: 'Documentation Excellence',
    color: '#7c3aed', // Deep purple
  },
  {
    filename: 'ALEX-DATA-ENGINEER.png',
    title: 'DATA',
    subtitle: 'Raw to Refined Intelligence',
    color: '#14b8a6', // Electric teal
  },
  {
    filename: 'ALEX-BUSINESS-ANALYST.png',
    title: 'INSIGHTS',
    subtitle: 'Stakeholder Alignment',
    color: '#0078d4', // Azure blue
  },
  {
    filename: 'ALEX-CREATIVE-WRITER.png',
    title: 'STORIES',
    subtitle: 'Narrative Excellence',
    color: '#7c3aed', // Deep purple
  }
];

/**
 * Generate structured prompt for Ideogram v2
 * CONSISTENT TEMPLATE - only title, subtitle, and color vary
 */
function buildPrompt(persona) {
  return `
Professional technology banner with perfect typography (1:1 square format, 1024x1024).

CRITICAL: Text must be EXACTLY as specified with NO errors or artifacts.

TITLE TEXT (MAIN FOCUS - HUGE):
"${persona.title}"
Massive bold sans-serif, all caps
Centered horizontally
Positioned in upper-center area
Color: ${persona.color} with bright glow effect
Perfect crisp letters, zero artifacts
Crystal clear edges, highly legible

SUBTITLE TEXT (secondary):
"${persona.subtitle}"
Clean modern sans-serif
Positioned below title, centered
White (#ffffff) with soft glow
Smaller but readable, elegant

VISUAL LAYOUT (CONSISTENT ACROSS ALL):
- Center-left: Sleek modern rocket
- Rocket angle: 30° upward diagonal  
- Rocket color: ${persona.color} metallic finish
- Thrust flame: Bright orange-yellow (#ff6b35)
- Small "CX" logo on rocket body, subtle
- Rocket size: Prominent but not overwhelming

BACKGROUND (IDENTICAL TEMPLATE):
- Deep space gradient (top: #0a0e1a, bottom: #050810)
- Scattered small white stars (minimal, tasteful)
- Large radial glow behind rocket matching ${persona.color}
- Soft particle effects in thrust trail
- Clean, professional, not cluttered

LIGHTING (STANDARD SETUP):
- Soft rim lighting on rocket
- Bright glow from thrust flame
- Ambient space lighting
- ${persona.color} glow illuminating nearby area
- Professional product photography quality

COLOR PALETTE:
- Rocket: ${persona.color} metallic
- Flame: Orange-yellow gradient (#ffc857 → #ff6b35)
- Background: Deep space blacks and dark blues
- Title text: ${persona.color} with glow
- Subtitle: White with soft glow
- Stars: White pinpoints

STYLE (CONSISTENT):
- Photorealistic 3D rendering
- Blender/Cinema4D quality
- Professional product photography
- Sharp focus, cinematic
- Modern tech aesthetic
- Premium corporate quality

TEXT QUALITY CRITICAL:
- PERFECT letter rendering for "${persona.title}"
- Zero distortion, blur, or artifacts
- Professional typography hierarchy
- Spacing and alignment flawless
- This is the PRIMARY element - must be perfect

COMPOSITION RULES:
- Rocket positioned consistently (center-left, 30° angle)
- Text positioned consistently (upper-center)
- Background depth consistent
- Lighting setup identical
- Only variables: title, subtitle, primary color

MOOD: Inspiring, empowering, professional, upward trajectory
`.trim();
}

/**
 * Generate image using Ideogram v2
 */
async function generateImage(persona) {
  console.log(`\n🚀 Generating: ${persona.filename}`);
  console.log(`   Title: "${persona.title}" | Subtitle: "${persona.subtitle}"`);
  console.log(`   Color: ${persona.color}`);
  
  const prompt = buildPrompt(persona);
  
  try {
    const input = {
      prompt: prompt,
      aspect_ratio: '1:1',
      magic_prompt_option: 'On',
      style_type: 'Realistic',
      resolution: '1024x1024',
      output_format: 'png',
    };

    console.log('   ⏳ Calling Ideogram v2 API...');
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
      console.error('   Debug - Output structure:', JSON.stringify(output, null, 2));
      throw new Error('Failed to extract image URL from Ideogram response');
    }

    console.log(`   ✓ Generated: ${imageUrl.substring(0, 60)}...`);
    return imageUrl;
  } catch (error) {
    console.error(`   ✗ Generation failed: ${error.message}`);
    throw error;
  }
}

/**
 * Download image from URL
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`   ✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Alex Persona Welcome Image Generator');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Personas to generate: ${PERSONAS.length}`);
  console.log(`Cost estimate: $${(PERSONAS.length * 0.08).toFixed(2)} (Ideogram v2 @ $0.08/image)`);
  console.log('Aspect ratio: 1:1 (1024x1024 square)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const outputDir = path.join(__dirname, '..', 'alex_docs', 'alex2');
  await fs.ensureDir(outputDir);

  const results = [];
  const startTime = Date.now();

  for (const persona of PERSONAS) {
    try {
      // Generate image
      const imageUrl = await generateImage(persona);
      
      // Download image
      const filepath = path.join(outputDir, persona.filename);
      await downloadImage(imageUrl, filepath);
      
      results.push({
        persona: persona.filename,
        title: persona.title,
        subtitle: persona.subtitle,
        url: imageUrl,
        filepath: filepath,
        status: 'success',
        cost: 0.08
      });

      // Rate limiting: 2 second delay between generations
      if (PERSONAS.indexOf(persona) < PERSONAS.length - 1) {
        console.log('   ⏳ Rate limiting: 2 second delay...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      results.push({
        persona: persona.filename,
        status: 'failed',
        error: error.message
      });
    }
  }

  // Generate metadata report
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const successCount = results.filter(r => r.status === 'success').length;
  const totalCost = successCount * 0.08;

  const report = {
    generated: new Date().toISOString(),
    duration: `${duration}s`,
    personas: PERSONAS.length,
    successful: successCount,
    failed: results.filter(r => r.status === 'failed').length,
    totalCost: `$${totalCost.toFixed(2)}`,
    costPerImage: '$0.08',
    model: 'ideogram-ai/ideogram-v2',
    aspectRatio: '1:1',
    resolution: '1024x1024',
    results: results
  };

  const reportPath = path.join(outputDir, 'generation-report.json');
  await fs.writeJSON(reportPath, report, { spaces: 2 });

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Successful: ${successCount}/${PERSONAS.length}`);
  console.log(`✗ Failed: ${report.failed}`);
  console.log(`⏱  Duration: ${duration}s`);
  console.log(`💰 Total Cost: $${totalCost.toFixed(2)}`);
  console.log(`📊 Report: ${reportPath}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
