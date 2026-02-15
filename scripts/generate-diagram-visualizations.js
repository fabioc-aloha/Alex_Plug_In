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

// Diagram configurations
const DIAGRAMS = [
  {
    filename: 'cross-platform-strategy.png',
    title: 'Cross-Platform Deployment Strategy',
    mermaid: `flowchart TD
    M["Master Alex<br/><i>.github/</i>"] --> VS["💻 VS Code<br/>Full deployment"]
    M --> CS["☁️ Codespaces<br/>VS Code in the cloud"]
    M --> CC["🤖 Claude Code<br/>Hooks + auto-memory"]
    M --> CU["⚡ Cursor<br/>Rules + agents"]
    M --> WS["🌊 Windsurf<br/>Rules + auto-memory"]
    M --> CX["⌨️ Codex CLI<br/>Instructions + reasoning"]

    classDef core fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    classDef prod fill:#d3f5db,color:#1a7f37,stroke:#6fdd8b
    classDef planned fill:#d8b9ff,color:#6639ba,stroke:#bf8aff
    class M core
    class VS,CS prod
    class CC,CU,WS,CX planned
    linkStyle default stroke:#57606a,stroke-width:1.5px`,
    description: `Professional technical diagram showing Master Alex architecture at center,
branching out to 6 development platforms: VS Code (full deployment, green), Codespaces (cloud, green),
Claude Code (purple, planned), Cursor (purple, planned), Windsurf (purple, planned), and Codex CLI (purple, planned).
Use flowchart layout with clear directional arrows from center to platforms.
Color code: Core (light blue #ddf4ff), Production (light green #d3f5db), Planned (light purple #d8b9ff).
Clean modern tech diagram style with icons for each platform.`,
  },
  {
    filename: 'memory-architecture.png',
    title: 'Memory Architecture Mapping',
    mermaid: `flowchart LR
    subgraph VSCode["VS Code Copilot Native Features"]
        CI[copilot-instructions.md] -->|maps to| DM[Declarative Memory]
        INS[.instructions.md files] -->|maps to| PM[Procedural Memory]
        PR[.prompt.md files] -->|maps to| EM[Episodic Memory]
        AG[.agent.md files] -->|maps to| SA[Specialized Agents]
        SK[.github/skills/] -->|maps to| DE[Domain Expertise]
        SY[synapses.json] -->|maps to| NC[Neural Connectivity]
    end

    classDef source fill:#eaeef2,color:#24292f,stroke:#afb8c1
    classDef mapped fill:#d3f5db,color:#1a7f37,stroke:#6fdd8b
    classDef alexonly fill:#ffebe9,color:#cf222e,stroke:#f5a3a3
    class CI,INS,PR,AG,SK,SY source
    class DM,PM,EM,SA,DE mapped
    class NC alexonly
    style VSCode fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    linkStyle default stroke:#57606a,stroke-width:1.5px`,
    description: `Technical system diagram showing VS Code features mapping to cognitive memory systems.
Left side: VS Code features (copilot-instructions.md, .instructions.md, .prompt.md, .agent.md, skills/, synapses.json).
Right side: Memory types (Declarative, Procedural, Episodic, Agents, Domain Expertise, Neural Connectivity).
Arrows labeled "maps to" connecting left to right.
Color scheme: Source files (light gray #eaeef2), Mapped memory (light green #d3f5db), Alex-only (light red #ffebe9).
Professional flowchart style with clear left-to-right information flow.`,
  },
  {
    filename: 'system-architecture.png',
    title: 'High-Level System Architecture',
    mermaid: `flowchart TB
    subgraph VSCODE["💻 VS Code Extension"]
        direction TB

        subgraph INTERFACE["User Interface Layer"]
            direction LR
            CHAT["💬 Chat Participant<br/>@alex"]
            LMT["🔧 Language Model Tools<br/>alex_status, alex_search"]
        end

        subgraph MEM_LAYER["Memory Management Layer"]
            direction LR
            LOADER["📥 Loader<br/>file → memory"]
            INDEX["🔍 Indexer<br/>search"]
            SYNC["☁️ Syncer<br/>cloud sync"]
        end

        CHAT --> MEM_LAYER
        LMT --> MEM_LAYER
    end

    subgraph STORAGE["💾 File System"]
        direction LR
        LOCAL["📁 .github/<br/>Project Memory"]
        GLOBAL["🌐 ~/.alex/<br/>Global Memory"]
    end

    MEM_LAYER --> LOCAL
    MEM_LAYER --> GLOBAL

    style VSCODE fill:#f5f5f5,stroke:#424242
    style INTERFACE fill:#e8f5e9,stroke:#2e7d32
    style MEM_LAYER fill:#e3f2fd,stroke:#1565c0
    style STORAGE fill:#fff3e0,stroke:#ef6c00`,
    description: `Layered architecture diagram for VS Code extension.
Top layer: User Interface (Chat Participant @alex, Language Model Tools).
Middle layer: Memory Management (Loader, Indexer, Syncer).
Bottom layer: File System Storage (Project .github/, Global ~/.alex/).
Show vertical flow with arrows from UI through management to storage.
Color code: UI layer (light green #e8f5e9), Memory layer (light blue #e3f2fd), Storage (light orange #fff3e0).
Professional enterprise architecture diagram style with clear layering.`,
  },
  {
    filename: 'learning-pipeline.png',
    title: 'Cognitive Learning Pipeline',
    mermaid: `flowchart LR
    subgraph INPUT["📥 Input"]
        CONV[User Conversation]
        CODE[Code Context]
        DOC[Documentation]
    end

    subgraph PROCESS["🧠 Processing"]
        OBS[Observe Patterns]
        EXT[Extract Insights]
        VAL[Validate Learning]
    end

    subgraph CONSOLIDATE["🧘 Consolidation"]
        MED[Meditation Session]
        SYN[Synapse Formation]
        MEM[Memory Creation]
    end

    subgraph OUTPUT["💾 Long-Term Memory"]
        SKILL[Skills Library]
        INST[Instructions]
        PROM[Prompts]
    end

    INPUT --> PROCESS --> CONSOLIDATE --> OUTPUT
    OUTPUT -.->|Inform Future| PROCESS

    classDef input fill:#e3f2fd,stroke:#1976d2,color:#0d47a1
    classDef process fill:#f3e5f5,stroke:#7b1fa2,color:#4a148c
    classDef consolidate fill:#fff3e0,stroke:#f57c00,color:#e65100
    classDef output fill:#e8f5e9,stroke:#388e3c,color:#1b5e20

    class CONV,CODE,DOC input
    class OBS,EXT,VAL process
    class MED,SYN,MEM consolidate
    class SKILL,INST,PROM output`,
    description: `Left-to-right process flow diagram showing AI learning stages.
Stage 1 Input (blue): User Conversation, Code Context, Documentation boxes.
Stage 2 Processing (purple): Observe Patterns, Extract Insights, Validate Learning boxes.
Stage 3 Consolidation (orange): Meditation Session, Synapse Formation, Memory Creation boxes.
Stage 4 Output (green): Skills Library, Instructions, Prompts boxes.
Dotted feedback arrow from Output back to Processing labeled "Inform Future".
Clean horizontal flow with 4 distinct stages, each stage has 3 boxes stacked vertically.
Modern process diagram style with pastel colors.`,
  },
  {
    filename: 'skill-network.png',
    title: 'Skill Activation Network',
    mermaid: `graph TB
    subgraph CORE["Core Skills"]
        CODE[Code Review]
        TEST[Testing Strategies]
        DOC[Documentation]
    end

    subgraph SPECIALIZED["Specialized Skills"]
        API[API Design]
        SEC[Security Audit]
        PERF[Performance]
    end

    subgraph DOMAIN["Domain Skills"]
        AZURE[Azure Patterns]
        ML[Machine Learning]
        WEB[Web Development]
    end

    CODE -->|requires quality| TEST
    CODE -->|produces| DOC
    API -->|needs| CODE
    API -->|uses| DOC
    SEC -->|validates| CODE
    SEC -->|checks| API
    PERF -->|analyzes| CODE
    AZURE -->|implements| API
    WEB -->|uses| API
    ML -->|applies| PERF

    classDef core fill:#ddf4ff,stroke:#0969da,color:#0550ae,stroke-width:3px
    classDef specialized fill:#fff8c5,stroke:#bf8700,color:#7d4e00,stroke-width:2px
    classDef domain fill:#d3f5db,stroke:#1a7f37,color:#0a3c14,stroke-width:2px

    class CODE,TEST,DOC core
    class API,SEC,PERF specialized
    class AZURE,ML,WEB domain`,
    description: `Network graph showing interconnected skills with labeled relationships.
Center cluster "Core Skills": Code Review, Testing Strategies, Documentation (thick blue borders).
Mid cluster "Specialized Skills": API Design, Security Audit, Performance (yellow borders).
Outer cluster "Domain Skills": Azure Patterns, Machine Learning, Web Development (green borders).
Multiple arrows connecting skills with labels like "requires quality", "produces", "validates", "uses".
Graph layout showing skill dependencies and relationships flowing outward from core.
Network diagram style with nodes and labeled edges, professional tech aesthetic.`,
  },
  {
    filename: 'release-workflow.png',
    title: 'Release Management Workflow',
    mermaid: `flowchart TD
    START([Start Release]) --> VER[Update Version]
    VER --> CHANGE[Update Changelog]
    CHANGE --> AUDIT{Quality Audit}

    AUDIT -->|Pass| BUILD[Build Package]
    AUDIT -->|Fail| FIX[Fix Issues]
    FIX --> AUDIT

    BUILD --> TEST{Test Package}
    TEST -->|Pass| TAG[Git Tag]
    TEST -->|Fail| DEBUG[Debug Build]
    DEBUG --> BUILD

    TAG --> PUSH[Push to Registry]
    PUSH --> VERIFY{Verify Deployment}

    VERIFY -->|Success| DOCS[Update Docs]
    VERIFY -->|Fail| ROLLBACK[Rollback]
    ROLLBACK --> FIX

    DOCS --> ANNOUNCE[Announce Release]
    ANNOUNCE --> END([Complete])

    classDef success fill:#d3f5db,stroke:#1a7f37,color:#0a3c14
    classDef check fill:#fff8c5,stroke:#bf8700,color:#7d4e00
    classDef action fill:#ddf4ff,stroke:#0969da,color:#0550ae
    classDef error fill:#ffebe9,stroke:#d1242f,color:#82071e

    class BUILD,TAG,PUSH,DOCS,ANNOUNCE action
    class AUDIT,TEST,VERIFY check
    class START,END success
    class FIX,DEBUG,ROLLBACK error`,
    description: `Top-to-bottom workflow diagram showing release process with decision points.
Start (green oval) → Update Version → Update Changelog → Quality Audit (diamond).
If Pass: Build Package → Test Package (diamond).
If Fail: Fix Issues → back to Quality Audit.
From Test: If Pass → Git Tag → Push to Registry → Verify Deployment (diamond).
If Test Fail: Debug Build → back to Build.
If Verify Success: Update Docs → Announce Release → Complete (green oval).
If Verify Fail: Rollback → back to Fix Issues.
Color code: Actions (blue rectangles), Checks (yellow diamonds), Success (green ovals), Errors (red rectangles).
Professional workflow diagram with clear decision paths and loops.`,
  }
];

/**
 * Parse Mermaid code to extract clean descriptions without syntax characters
 */
function parseMermaidToDescription(mermaid) {
  // Remove Mermaid syntax and extract meaningful content
  let description = mermaid
    // Remove HTML tags
    .replace(/<br\/>/g, ' ')
    .replace(/<\/?i>/g, '')
    // Remove emoji and special formatting
    .replace(/💻|☁️|🤖|⚡|🌊|⌨️|📥|🧠|🧘|💾|📊|📁|🌐|💬|🔧|🔍/g, '')
    // Extract node labels from brackets
    .replace(/\["([^"]+)"\]/g, '$1')
    .replace(/\[([^\]]+)\]/g, '$1')
    // Convert arrows to connections
    .replace(/-->/g, ' connects to ')
    .replace(/\|([^|]+)\|/g, '"$1"')
    // Remove classDef and styling commands
    .replace(/classDef\s+\w+\s+[^\n]+/g, '')
    .replace(/class\s+[^\n]+/g, '')
    .replace(/style\s+[^\n]+/g, '')
    .replace(/linkStyle\s+[^\n]+/g, '')
    // Remove subgraph syntax
    .replace(/subgraph\s+\w+\[?"?([^"\]]+)"?\]?/g, 'Section: $1')
    .replace(/end\b/g, '')
    .replace(/direction\s+\w+/g, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return description;
}

/**
 * Build Ideogram prompt for technical diagram visualization
 */
function buildPrompt(diagram) {
  const mermaidDescription = parseMermaidToDescription(diagram.mermaid);
  
  return `
ULTRA-WIDE TECHNICAL DIAGRAM (3:1 aspect ratio, 1536x512)

DIAGRAM TITLE (top-left):
"${diagram.title}"
Clean sans-serif, medium size
Dark gray color (#24292f)
Professional technical documentation style

STRUCTURE FROM DIAGRAM:
${mermaidDescription}

VISUAL REQUIREMENTS:
${diagram.description}

CRITICAL REQUIREMENTS:
- Crystal clear boxes, arrows, and labels
- Perfect text legibility in all elements
- Professional technical diagram aesthetic
- Clean white or light gray background (#f6f8fa)
- Subtle shadows and depth for clarity
- Modern minimalist design
- No decorative elements, focus on information
- Arrows and connections clearly visible
- Color coding consistent and meaningful

LAYOUT:
- Ultra-wide 3:1 format (1536x512)
- Title prominent in top-left
- Diagram fills remaining space efficiently
- Balanced composition with white space
- Clear visual hierarchy

STYLE:
- Technical documentation quality
- Enterprise architecture diagram aesthetic
- Similar to Lucidchart, draw.io, or Mermaid rendering
- Crisp lines and shapes
- Professional color palette (subtle, not flashy)
- High contrast for readability

TEXT RENDERING (CRITICAL):
- All labels must be perfectly legible
- Clean sans-serif font throughout
- Sufficient size for readability
- High contrast against backgrounds
- No text distortion or artifacts

MOOD:
Professional, technical, clear, informative
Enterprise documentation quality
`.trim();
}

/**
 * Generate diagram image using Ideogram v2
 */
async function generateDiagram(diagram) {
  console.log(`\n📊 Generating: ${diagram.filename}`);
  console.log(`   Title: "${diagram.title}"`);
  
  const prompt = buildPrompt(diagram);
  
  try {
    const input = {
      prompt: prompt,
      aspect_ratio: '3:1',
      magic_prompt_option: 'On',
      style_type: 'Design',  // Better for technical diagrams
      resolution: '1536x512',
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
  console.log('Mermaid Diagram Visualization Generator');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Diagrams to generate: ${DIAGRAMS.length}`);
  console.log(`Cost estimate: $${(DIAGRAMS.length * 0.08).toFixed(2)} (Ideogram v2 @ $0.08/image)`);
  console.log('Aspect ratio: 3:1 (1536x512 ultra-wide)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const outputDir = path.join(__dirname, '..', 'alex_docs', 'diagram-visualization');
  await fs.ensureDir(outputDir);

  const results = [];
  const startTime = Date.now();

  for (const diagram of DIAGRAMS) {
    try {
      // Generate image
      const imageUrl = await generateDiagram(diagram);
      
      // Download image
      const filepath = path.join(outputDir, diagram.filename);
      await downloadImage(imageUrl, filepath);
      
      results.push({
        diagram: diagram.filename,
        title: diagram.title,
        url: imageUrl,
        filepath: filepath,
        status: 'success',
        cost: 0.08
      });

      // Rate limiting: 15 second delay between generations (for low-credit accounts)
      if (DIAGRAMS.indexOf(diagram) < DIAGRAMS.length - 1) {
        console.log('   ⏳ Rate limiting: 15 second delay...\n');
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    } catch (error) {
      results.push({
        diagram: diagram.filename,
        title: diagram.title,
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
    diagrams: DIAGRAMS.length,
    successful: successCount,
    failed: results.filter(r => r.status === 'failed').length,
    totalCost: `$${totalCost.toFixed(2)}`,
    costPerImage: '$0.08',
    model: 'ideogram-ai/ideogram-v2',
    aspectRatio: '3:1',
    resolution: '1536x512',
    results: results
  };

  const reportPath = path.join(outputDir, 'generation-report.json');
  await fs.writeJSON(reportPath, report, { spaces: 2 });

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✓ Successful: ${successCount}/${DIAGRAMS.length}`);
  console.log(`✗ Failed: ${report.failed}`);
  console.log(`⏱  Duration: ${duration}s`);
  console.log(`💰 Total Cost: $${totalCost.toFixed(2)}`);
  console.log(`📊 Report: ${reportPath}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
