#!/usr/bin/env node
/**
 * Replicate API Integration Test
 * Tests basic image generation workflow
 * 
 * Usage: node TESTE/test-replicate.js [--generate]
 */

import Replicate from "replicate";
import { writeFile, mkdir } from "node:fs/promises";
import path from "path";

const MODELS = {
  "flux-schnell": { id: "black-forest-labs/flux-schnell", cost: 0.003 },
  "flux-pro": { id: "black-forest-labs/flux-1.1-pro", cost: 0.04 },
  "ideogram": { id: "ideogram-ai/ideogram-v2", cost: 0.08 },
  "nano-banana": { id: "google/nano-banana-pro", cost: 0.025 },
};

async function testAuth() {
  console.log("🔐 Testing authentication...");
  
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("❌ REPLICATE_API_TOKEN not set");
    console.log("   Run: $env:REPLICATE_API_TOKEN = 'r8_your_token'");
    return false;
  }
  
  try {
    const response = await fetch("https://api.replicate.com/v1/account", {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Authenticated as: ${data.username || data.name}`);
      return true;
    } else {
      console.error(`❌ Auth failed: ${response.status}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Auth error: ${err.message}`);
    return false;
  }
}

async function testModelSearch() {
  console.log("\n🔍 Testing model search API...");
  
  try {
    const response = await fetch(
      "https://api.replicate.com/v1/models?query=flux",
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    const data = await response.json();
    const count = data.results?.length || 0;
    
    if (count > 0) {
      console.log(`✅ Search works: found ${count} models for "flux"`);
      return true;
    } else {
      console.log("⚠️ Search returned no results");
      return false;
    }
  } catch (err) {
    console.error(`❌ Search error: ${err.message}`);
    return false;
  }
}

async function testModelAvailability() {
  console.log("\n📦 Testing model availability...");
  
  const results = [];
  for (const [name, model] of Object.entries(MODELS)) {
    const [owner, modelName] = model.id.split("/");
    try {
      const response = await fetch(
        `https://api.replicate.com/v1/models/${owner}/${modelName}`,
        { headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        const runs = (data.run_count / 1000000).toFixed(1) + "M";
        console.log(`✅ ${name}: ${model.id} (${runs} runs)`);
        results.push({ name, available: true });
      } else {
        console.log(`❌ ${name}: ${model.id} (not found)`);
        results.push({ name, available: false });
      }
    } catch (err) {
      console.log(`❌ ${name}: ${err.message}`);
      results.push({ name, available: false });
    }
  }
  
  return results.every((r) => r.available);
}

async function testGeneration() {
  console.log("\n🎨 Testing image generation (flux-schnell, $0.003)...");
  
  const replicate = new Replicate();
  
  try {
    console.log("   Generating test image...");
    const startTime = Date.now();
    
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: "A simple test: blue square with white circle in center, flat design",
        aspect_ratio: "1:1",
        output_format: "png",
      },
    });
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Handle output variations
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    // Download
    const response = await fetch(imageUrl.toString());
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Save
    const outDir = "./TESTE/output";
    await mkdir(outDir, { recursive: true });
    const filename = `test-${Date.now()}.png`;
    await writeFile(path.join(outDir, filename), buffer);
    
    console.log(`✅ Generated in ${elapsed}s: ${outDir}/${filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return true;
  } catch (err) {
    console.error(`❌ Generation error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Replicate API Integration Test");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const args = process.argv.slice(2);
  const shouldGenerate = args.includes("--generate");
  
  // Test 1: Authentication
  const authOk = await testAuth();
  if (!authOk) {
    console.log("\n💀 Cannot continue without authentication");
    process.exit(1);
  }
  
  // Test 2: Search API
  await testModelSearch();
  
  // Test 3: Model availability
  const modelsOk = await testModelAvailability();
  
  // Test 4: Generation (only if --generate flag)
  if (shouldGenerate) {
    const genOk = await testGeneration();
    if (!genOk) {
      console.log("\n⚠️ Generation test failed");
    }
  } else {
    console.log("\n💡 Skipping generation test (use --generate to enable, costs $0.003)");
  }
  
  // Summary
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  Test Summary");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  Auth:   ${authOk ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`  Models: ${modelsOk ? "✅ PASS" : "⚠️ PARTIAL"}`);
  console.log(`  Ready:  ${authOk && modelsOk ? "✅ YES" : "❌ NO"}`);
  console.log("═══════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
