#!/usr/bin/env node
/**
 * @muscle visual-memory
 * @description Manage visual memory - add subjects, prepare photos, encode base64, build indexes
 * @version 1.0.0
 * @skill visual-memory
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node (ImageMagick optional for prepare-photos)
 *
 * Visual Memory Muscle
 * ====================
 * Automates the visual memory workflow for face-consistent AI image generation:
 * - Prepare photos (resize to 512px, 85% JPEG quality)
 * - Convert photos to base64 data URIs
 * - Build/update visual-memory.json and index.json
 * - Show inventory status
 *
 * Usage:
 *   node visual-memory.cjs status [--skill <skill-name>]
 *   node visual-memory.cjs add-subject <name> --photos <folder> [--skill <skill-name>]
 *   node visual-memory.cjs encode-photos <folder> [--output <file>]
 *   node visual-memory.cjs verify [--skill <skill-name>]
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const GITHUB_DIR = path.join(__dirname, "..");
const DEFAULT_SKILL = "visual-memory";
const TARGET_SIZE = 512;
const JPEG_QUALITY = 85;
const SCHEMA_VERSION = "visual-memory-v1";

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Print colored output (cross-platform)
 */
function log(message, type = "info") {
  const prefix = {
    info: "[INFO]",
    ok: "[OK]",
    warn: "[WARN]",
    error: "[ERROR]",
  };
  console.log(`${prefix[type] || "[INFO]"} ${message}`);
}

/**
 * Get the visual-memory directory for a skill
 */
function getVisualMemoryDir(skillName) {
  return path.join(GITHUB_DIR, "skills", skillName, "visual-memory");
}

/**
 * Check if ImageMagick is available
 */
function hasImageMagick() {
  try {
    execSync("magick --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert image file to base64 data URI
 */
function toDataUri(imagePath) {
  try {
    const buffer = fs.readFileSync(imagePath);
    const ext = imagePath.toLowerCase();
    let mimeType = "image/jpeg";
    if (ext.endsWith(".png")) mimeType = "image/png";
    else if (ext.endsWith(".webp")) mimeType = "image/webp";
    else if (ext.endsWith(".gif")) mimeType = "image/gif";

    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch (err) {
    log(`Failed to encode ${imagePath}: ${err.message}`, "error");
    return null;
  }
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024);
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────────────────────

/**
 * STATUS: Show current visual memory inventory
 */
function cmdStatus(skillName = DEFAULT_SKILL) {
  const vmDir = getVisualMemoryDir(skillName);
  const vmPath = path.join(vmDir, "visual-memory.json");

  if (!fs.existsSync(vmPath)) {
    log(`No visual-memory.json found for skill: ${skillName}`, "warn");
    console.log(`  Expected at: ${vmPath}`);
    return;
  }

  try {
    const vm = JSON.parse(fs.readFileSync(vmPath, "utf8"));
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log(`  Visual Memory Status: ${skillName}`);
    console.log("═══════════════════════════════════════════════════════════\n");

    // Subjects (photos)
    const subjects = vm.subjects || {};
    const subjectCount = Object.keys(subjects).filter(
      (k) => !k.startsWith("_")
    ).length;
    console.log(`📸 Subjects (Face References): ${subjectCount}`);
    for (const [name, subject] of Object.entries(subjects)) {
      if (name.startsWith("_")) continue;
      const imageCount = subject.images?.length || 0;
      const totalSize = (subject.images || []).reduce((sum, img) => {
        return sum + (img.dataUri?.length || 0);
      }, 0);
      const sizeKB = Math.round(totalSize / 1024);
      console.log(`   └─ ${name}: ${imageCount} photos (~${sizeKB}KB encoded)`);
    }

    // Voices
    const voices = vm.voices || {};
    const voiceCount = Object.keys(voices).filter(
      (k) => !k.startsWith("_")
    ).length;
    if (voiceCount > 0) {
      console.log(`\n🎤 Voice Samples: ${voiceCount}`);
      for (const [name, voice] of Object.entries(voices)) {
        if (name.startsWith("_")) continue;
        console.log(`   └─ ${name}: ${voice.duration || "?"} (${voice.model || "unspecified"})`);
      }
    }

    // Video styles
    const videoStyles = vm.videoStyles || {};
    const videoCount = Object.keys(videoStyles).filter(
      (k) => !k.startsWith("_")
    ).length;
    if (videoCount > 0) {
      console.log(`\n🎬 Video Style Templates: ${videoCount}`);
      for (const [name, style] of Object.entries(videoStyles)) {
        if (name.startsWith("_")) continue;
        console.log(`   └─ ${name}: ${style.model || "?"} (${style.defaultDuration || "?"}s)`);
      }
    }

    console.log("\n═══════════════════════════════════════════════════════════\n");
  } catch (err) {
    log(`Failed to parse visual-memory.json: ${err.message}`, "error");
  }
}

/**
 * ENCODE-PHOTOS: Convert a folder of photos to base64 JSON
 */
function cmdEncodePhotos(folder, outputFile = null) {
  if (!fs.existsSync(folder)) {
    log(`Folder not found: ${folder}`, "error");
    process.exit(1);
  }

  const imageExts = [".jpg", ".jpeg", ".png", ".webp"];
  const files = fs
    .readdirSync(folder)
    .filter((f) => imageExts.includes(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    log(`No image files found in ${folder}`, "warn");
    return;
  }

  console.log(`\nEncoding ${files.length} images from ${folder}...`);
  const images = [];

  for (const file of files) {
    const filePath = path.join(folder, file);
    const sizeKB = getFileSizeKB(filePath);
    const dataUri = toDataUri(filePath);

    if (dataUri) {
      images.push({
        filename: file,
        dataUri,
        notes: "",
      });
      console.log(`  ✓ ${file} (${sizeKB}KB → ${Math.round(dataUri.length / 1024)}KB encoded)`);
    }
  }

  const output = { images };

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    log(`Wrote ${images.length} images to ${outputFile}`, "ok");
  } else {
    console.log("\n--- JSON Output ---");
    console.log(JSON.stringify(output, null, 2));
  }
}

/**
 * ADD-SUBJECT: Add a new subject with photos
 */
function cmdAddSubject(name, photosFolder, skillName = DEFAULT_SKILL) {
  if (!name) {
    log("Subject name is required", "error");
    process.exit(1);
  }

  if (!photosFolder || !fs.existsSync(photosFolder)) {
    log(`Photos folder not found: ${photosFolder}`, "error");
    process.exit(1);
  }

  const vmDir = getVisualMemoryDir(skillName);
  const vmPath = path.join(vmDir, "visual-memory.json");
  const indexPath = path.join(vmDir, "index.json");

  // Ensure directory exists
  if (!fs.existsSync(vmDir)) {
    fs.mkdirSync(vmDir, { recursive: true });
    log(`Created visual-memory directory: ${vmDir}`, "info");
  }

  // Load or create visual-memory.json
  let vm = { schema: SCHEMA_VERSION, generated: new Date().toISOString().slice(0, 10), subjects: {} };
  if (fs.existsSync(vmPath)) {
    try {
      vm = JSON.parse(fs.readFileSync(vmPath, "utf8"));
    } catch (err) {
      log(`Failed to parse existing visual-memory.json: ${err.message}`, "warn");
    }
  }

  // Load or create index.json
  let index = { version: "1.0", generated: new Date().toISOString().slice(0, 10), targetSize: TARGET_SIZE, subjects: {} };
  if (fs.existsSync(indexPath)) {
    try {
      index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    } catch {
      // Use default
    }
  }

  // Find and encode images
  const imageExts = [".jpg", ".jpeg", ".png", ".webp"];
  const files = fs
    .readdirSync(photosFolder)
    .filter((f) => imageExts.includes(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    log(`No image files found in ${photosFolder}`, "error");
    process.exit(1);
  }

  console.log(`\nAdding subject "${name}" with ${files.length} photos...`);

  const images = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(photosFolder, file);
    const sizeKB = getFileSizeKB(filePath);

    // Warn if photo is large
    if (sizeKB > 150) {
      log(`${file} is ${sizeKB}KB - consider resizing to 512px`, "warn");
    }

    const dataUri = toDataUri(filePath);
    if (dataUri) {
      images.push({
        filename: file,
        dataUri,
        notes: `Reference photo ${i + 1}`,
      });
      console.log(`  ✓ ${file} (${sizeKB}KB)`);
    }
  }

  // Build subject entry
  const subjectEntry = {
    description: `Visual reference for ${name}`,
    ageInfo: {
      referenceAge: 0,
      photoDate: new Date().toISOString().slice(0, 7),
    },
    images,
  };

  // Check for existing subject
  if (vm.subjects && vm.subjects[name]) {
    log(`Subject "${name}" already exists - will be overwritten`, "warn");
  }

  // Update visual-memory.json
  if (!vm.subjects) vm.subjects = {};
  vm.subjects[name] = subjectEntry;
  vm.generated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(vmPath, JSON.stringify(vm, null, 2));
  log(`Updated visual-memory.json with subject "${name}"`, "ok");

  // Update index.json
  if (!index.subjects) index.subjects = {};
  index.subjects[name] = {
    count: files.length,
    files: files,
  };
  index.generated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  log(`Updated index.json with ${files.length} files`, "ok");

  // Summary
  const totalSize = images.reduce((sum, img) => sum + (img.dataUri?.length || 0), 0);
  console.log(`\n✅ Subject "${name}" added successfully`);
  console.log(`   Photos: ${images.length}`);
  console.log(`   Total encoded size: ~${Math.round(totalSize / 1024)}KB`);
}

/**
 * VERIFY: Check visual memory integrity
 */
function cmdVerify(skillName = DEFAULT_SKILL) {
  const vmDir = getVisualMemoryDir(skillName);
  const vmPath = path.join(vmDir, "visual-memory.json");
  const indexPath = path.join(vmDir, "index.json");

  console.log(`\nVerifying visual memory for skill: ${skillName}`);
  console.log("─".repeat(50));

  let hasErrors = false;

  // Check visual-memory.json
  if (!fs.existsSync(vmPath)) {
    log(`visual-memory.json not found`, "error");
    hasErrors = true;
  } else {
    try {
      const vm = JSON.parse(fs.readFileSync(vmPath, "utf8"));

      // Check schema
      if (!vm.schema) {
        log(`Missing schema version`, "warn");
      } else if (vm.schema !== SCHEMA_VERSION) {
        log(`Schema version mismatch: ${vm.schema} (expected ${SCHEMA_VERSION})`, "warn");
      } else {
        log(`Schema: ${vm.schema}`, "ok");
      }

      // Check subjects
      const subjects = vm.subjects || {};
      const subjectNames = Object.keys(subjects).filter((k) => !k.startsWith("_"));
      log(`Found ${subjectNames.length} subjects`, "ok");

      for (const name of subjectNames) {
        const subject = subjects[name];
        const images = subject.images || [];

        // Validate each image has dataUri
        let validCount = 0;
        for (const img of images) {
          if (img.dataUri && img.dataUri.startsWith("data:image/")) {
            validCount++;
          }
        }

        if (validCount === images.length) {
          log(`  ${name}: ${validCount}/${images.length} valid data URIs`, "ok");
        } else {
          log(`  ${name}: ${validCount}/${images.length} valid (${images.length - validCount} invalid)`, "warn");
          hasErrors = true;
        }
      }
    } catch (err) {
      log(`Failed to parse visual-memory.json: ${err.message}`, "error");
      hasErrors = true;
    }
  }

  // Check index.json
  if (!fs.existsSync(indexPath)) {
    log(`index.json not found (optional but recommended)`, "warn");
  } else {
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
      log(`index.json valid`, "ok");
    } catch (err) {
      log(`Failed to parse index.json: ${err.message}`, "warn");
    }
  }

  console.log("─".repeat(50));
  if (hasErrors) {
    log("Visual memory has issues - see warnings above", "warn");
    process.exit(1);
  } else {
    log("Visual memory verified successfully", "ok");
  }
}

/**
 * PREPARE-PHOTOS: Resize photos using ImageMagick (if available)
 */
function cmdPreparePhotos(folder, outputFolder = null) {
  if (!fs.existsSync(folder)) {
    log(`Folder not found: ${folder}`, "error");
    process.exit(1);
  }

  if (!hasImageMagick()) {
    log("ImageMagick not found - please install it first", "error");
    console.log("\n  Installation:");
    console.log("    macOS:   brew install imagemagick");
    console.log("    Windows: winget install ImageMagick.ImageMagick");
    console.log("    Linux:   apt install imagemagick");
    process.exit(1);
  }

  const outDir = outputFolder || path.join(folder, "resized");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const imageExts = [".jpg", ".jpeg", ".png"];
  const files = fs
    .readdirSync(folder)
    .filter((f) => imageExts.includes(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    log(`No image files found in ${folder}`, "warn");
    return;
  }

  console.log(`\nPreparing ${files.length} photos for visual memory...`);
  console.log(`Target: ${TARGET_SIZE}px @ ${JPEG_QUALITY}% JPEG`);
  console.log(`Output: ${outDir}\n`);

  let processed = 0;
  for (const file of files) {
    const inputPath = path.join(folder, file);
    const outputPath = path.join(outDir, path.basename(file, path.extname(file)) + ".jpg");

    try {
      const beforeSize = getFileSizeKB(inputPath);
      execSync(
        `magick "${inputPath}" -resize "${TARGET_SIZE}x${TARGET_SIZE}>" -quality ${JPEG_QUALITY} "${outputPath}"`,
        { stdio: "ignore" }
      );
      const afterSize = getFileSizeKB(outputPath);
      console.log(`  ✓ ${file}: ${beforeSize}KB → ${afterSize}KB`);
      processed++;
    } catch (err) {
      log(`Failed to process ${file}: ${err.message}`, "error");
    }
  }

  console.log(`\n✅ Processed ${processed}/${files.length} photos`);
  console.log(`   Output folder: ${outDir}`);
  console.log(`\nNext step: node visual-memory.cjs add-subject <name> --photos ${outDir}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main CLI
// ─────────────────────────────────────────────────────────────────────────────

function printUsage() {
  console.log(`
Visual Memory Muscle
====================
Manage visual memory for face-consistent AI image generation.

Usage:
  node visual-memory.cjs <command> [options]

Commands:
  status [--skill <name>]              Show current visual memory inventory
  add-subject <name> --photos <dir>    Add a new subject with reference photos
  encode-photos <dir> [--output <file>] Convert photos to base64 JSON
  prepare-photos <dir> [--output <dir>] Resize photos using ImageMagick
  verify [--skill <name>]              Check visual memory integrity

Options:
  --skill <name>    Target skill folder (default: visual-memory)
  --photos <dir>    Folder containing photos to add
  --output <path>   Output file or folder

Examples:
  node visual-memory.cjs status
  node visual-memory.cjs prepare-photos ./raw-photos
  node visual-memory.cjs add-subject alex --photos ./raw-photos/resized
  node visual-memory.cjs verify --skill visual-memory
`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    process.exit(0);
  }

  const command = args[0];

  // Parse options
  const options = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      options[key] = args[i + 1] || true;
      i++;
    } else if (!options._positional) {
      options._positional = args[i];
    }
  }

  const skillName = options.skill || DEFAULT_SKILL;

  try {
    switch (command) {
      case "status":
        cmdStatus(skillName);
        break;

      case "add-subject":
        if (!options._positional) {
          log("Subject name is required", "error");
          console.log("Usage: node visual-memory.cjs add-subject <name> --photos <folder>");
          process.exit(1);
        }
        if (!options.photos) {
          log("--photos <folder> is required", "error");
          process.exit(1);
        }
        cmdAddSubject(options._positional, options.photos, skillName);
        break;

      case "encode-photos":
        if (!options._positional) {
          log("Folder path is required", "error");
          process.exit(1);
        }
        cmdEncodePhotos(options._positional, options.output || null);
        break;

      case "prepare-photos":
        if (!options._positional) {
          log("Folder path is required", "error");
          process.exit(1);
        }
        cmdPreparePhotos(options._positional, options.output || null);
        break;

      case "verify":
        cmdVerify(skillName);
        break;

      default:
        log(`Unknown command: ${command}`, "error");
        printUsage();
        process.exit(1);
    }
  } catch (err) {
    log(`Unexpected error: ${err.message}`, "error");
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

main();
