#!/usr/bin/env node
/**
 * lint-unused.cjs — wrapper around ts-unused-exports that works cross-shell and supports a JSON allowlist.
 *
 * - Reads ts-unused-exports.json (ignoreFiles/ignoreExports)
 * - Builds a regex for --ignoreFiles to skip dynamic modules
 * - Runs ts-unused-exports and filters output against allowlisted exports
 * - Exits 1 if any unallowlisted unused exports remain
 */

const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'ts-unused-exports.json');
const TSCONFIG = path.join(ROOT, 'tsconfig.json');

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return { ignoreFiles: [], ignoreExports: {} };
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    console.error('[lint-unused] Failed to parse ts-unused-exports.json:', err.message);
    return { ignoreFiles: [], ignoreExports: {} };
  }
}

function globToRegex(globPattern) {
  // Convert a minimal glob (/**, *, ., /) to a regex string
  return globPattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape regex specials
    .replace(/\*\*\//g, '(.*/)?') // **/ -> optional nested dirs
    .replace(/\*\*/g, '.*') // ** -> any depth
    .replace(/\*/g, '[^/]*'); // * -> single segment
}

function buildIgnoreRegex(ignoreFiles) {
  const patterns = (ignoreFiles && ignoreFiles.length > 0)
    ? ignoreFiles
    : [];
  if (patterns.length === 0) {
    return undefined;
  }
  const regexParts = patterns.map(globToRegex);
  return `(${regexParts.join('|')})`;
}

function resolveBin(binName) {
  const binPath = path.join(ROOT, 'node_modules', '.bin', binName + (process.platform === 'win32' ? '.cmd' : ''));
  return fs.existsSync(binPath) ? binPath : binName;
}

function runTsUnused(ignoreRegex) {
  const bin = resolveBin('ts-unused-exports');
  const args = [TSCONFIG, '--showLineNumber', '--exitWithCount'];
  if (ignoreRegex) {
    args.push(`--ignoreFiles=${ignoreRegex}`);
  }
  const result = spawnSync(bin, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
  });
  return result;
}

function parseOutput(stdout, ignoreExports) {
  // ts-unused-exports prints lines like:
  // path/to/file.ts: ExportName
  const allowed = new Set();
  // Flatten ignoreExports map into strings of `file:export`
  Object.entries(ignoreExports || {}).forEach(([file, exports]) => {
    exports.forEach((exp) => allowed.add(`${normalizePath(file)}:${exp}`));
  });

  const lines = stdout.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const unexpected = [];

  for (const line of lines) {
    // Example line: src/commands/readAloud.ts: readAloud, saveAsAudio
    const [filePart, rest] = line.split(':');
    if (!rest) continue; // skip headers
    const file = normalizePath(filePart);
    const exports = rest.split(',').map((s) => s.trim());
    for (const exp of exports) {
      const key = `${file}:${exp}`;
      if (!allowed.has(key)) {
        unexpected.push({ file, exp, raw: line });
      }
    }
  }
  return unexpected;
}

function normalizePath(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

function main() {
  const cfg = loadConfig();
  const ignoreRegex = buildIgnoreRegex(cfg.ignoreFiles || []);
  const result = runTsUnused(ignoreRegex);
  const stdout = (result.stdout || '').toString();
  const stderr = (result.stderr || '').toString();

  if (stderr.trim().length > 0) {
    console.warn('[lint-unused] stderr:', stderr.trim());
  }

  const unexpected = parseOutput(stdout, cfg.ignoreExports || {});
  if (unexpected.length > 0) {
    console.error('[lint-unused] ❌ Unexpected unused exports detected:');
    unexpected.forEach(({ raw }) => console.error(`  • ${raw}`));
    console.error('\nTo allowlist, add entries to ts-unused-exports.json -> ignoreExports.');
    process.exit(1);
  }

  if (stdout.trim().length > 0) {
    console.log('[lint-unused] ✅ No unallowlisted unused exports. (ts-unused-exports output follows for review)');
    console.log(stdout.trim());
  } else {
    console.log('[lint-unused] ✅ No unused exports reported.');
  }
  process.exit(0);
}

main();
