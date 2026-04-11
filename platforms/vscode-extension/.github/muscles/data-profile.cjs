/**
 * data-profile.cjs -- Quick data profiler
 * Version: 1.0.0
 *
 * Produces a comprehensive profile report for any dataset: column types, nulls,
 * distributions, correlations, anomalies, quality score, and cleaning suggestions.
 * Accepts output from data-ingest.cjs or a direct file path (auto-ingests first).
 *
 * Usage:
 *   node data-profile.cjs <path>                # Profile a file (auto-ingest)
 *   node data-profile.cjs --json <ingest.json>  # Profile pre-ingested JSON
 *   node data-profile.cjs <path> --format json   # Output as JSON (default: text)
 *   node data-profile.cjs <path> --output report.md  # Write to file
 */
'use strict';

const fs = require('fs');
const path = require('path');

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function mean(arr) { return arr.length === 0 ? 0 : arr.reduce((s, v) => s + v, 0) / arr.length; }
function median(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function stddev(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}
function percentile(sorted, p) {
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const frac = idx - lower;
  return sorted[lower] + (frac * ((sorted[lower + 1] || sorted[lower]) - sorted[lower]));
}
function skewness(arr) {
  const m = mean(arr);
  const s = stddev(arr);
  if (s === 0) return 0;
  return arr.reduce((sum, v) => sum + ((v - m) / s) ** 3, 0) / arr.length;
}

// -----------------------------------------------------------------------------
// COLUMN PROFILING
// -----------------------------------------------------------------------------

function profileNumericColumn(name, values) {
  const sorted = [...values].sort((a, b) => a - b);
  const m = mean(values);
  const med = median(values);
  const s = stddev(values);
  const sk = skewness(values);
  const p25 = percentile(sorted, 25);
  const p75 = percentile(sorted, 75);
  const iqr = p75 - p25;
  const lowerFence = p25 - 1.5 * iqr;
  const upperFence = p75 + 1.5 * iqr;
  const outliers = values.filter(v => v < lowerFence || v > upperFence);

  let shape = 'normal';
  if (Math.abs(sk) > 1) shape = sk > 0 ? 'right-skewed' : 'left-skewed';
  else if (Math.abs(sk) > 0.5) shape = sk > 0 ? 'moderately right-skewed' : 'moderately left-skewed';

  return {
    name,
    type: 'number',
    count: values.length,
    mean: Math.round(m * 100) / 100,
    median: Math.round(med * 100) / 100,
    stddev: Math.round(s * 100) / 100,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    p25: Math.round(p25 * 100) / 100,
    p75: Math.round(p75 * 100) / 100,
    skewness: Math.round(sk * 100) / 100,
    shape,
    outlierCount: outliers.length,
    outlierPct: Math.round((outliers.length / values.length) * 10000) / 100
  };
}

function profileCategoricalColumn(name, values) {
  const freq = {};
  for (const v of values) { freq[v] = (freq[v] || 0) + 1; }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return {
    name,
    type: 'string',
    count: values.length,
    uniqueCount: sorted.length,
    top5: sorted.slice(0, 5).map(([val, cnt]) => ({ value: val, count: cnt, pct: Math.round((cnt / values.length) * 10000) / 100 })),
    isLikelyId: sorted.length > values.length * 0.95
  };
}

// -----------------------------------------------------------------------------
// CORRELATION
// -----------------------------------------------------------------------------

function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;
  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : Math.round((num / denom) * 1000) / 1000;
}

// -----------------------------------------------------------------------------
// QUALITY SCORE
// -----------------------------------------------------------------------------

function computeQualityScore(columns, totalRows) {
  let completeness = 0;
  let consistency = 0;
  for (const col of columns) {
    const nullPct = (col.nullCount || 0) / totalRows;
    if (nullPct < 0.05) completeness++;
    consistency++; // type inference always resolves
  }
  const compScore = columns.length > 0 ? (completeness / columns.length) * 100 : 100;
  return Math.round(compScore);
}

// -----------------------------------------------------------------------------
// MAIN PROFILER
// -----------------------------------------------------------------------------

async function profile(data) {
  const { metadata, columns: colMeta, rows } = data;

  // Per-column detailed profile
  const profiles = [];
  const numericArrays = {};

  for (let ci = 0; ci < colMeta.length; ci++) {
    const col = colMeta[ci];
    const values = rows.map(r => r[ci]).filter(v => v !== null && v !== undefined);

    if (col.type === 'number') {
      const nums = values.map(v => parseFloat(String(v).replace(/,/g, ''))).filter(n => !isNaN(n));
      numericArrays[col.name] = nums;
      profiles.push(profileNumericColumn(col.name, nums));
    } else {
      profiles.push(profileCategoricalColumn(col.name, values.map(String)));
    }
  }

  // Correlation matrix for numeric pairs
  const numCols = Object.keys(numericArrays);
  const correlations = [];
  for (let i = 0; i < numCols.length; i++) {
    for (let j = i + 1; j < numCols.length; j++) {
      const r = pearsonCorrelation(numericArrays[numCols[i]], numericArrays[numCols[j]]);
      if (Math.abs(r) > 0.4) {
        const strength = Math.abs(r) >= 0.7 ? 'strong' : 'moderate';
        correlations.push({ col1: numCols[i], col2: numCols[j], r, strength });
      }
    }
  }
  correlations.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));

  // Quality score
  const qualityScore = computeQualityScore(colMeta, metadata.rowCount);

  // Suggestions
  const suggestions = [];
  for (const col of colMeta) {
    const nullPct = Math.round((col.nullCount / metadata.rowCount) * 100);
    if (nullPct > 20) suggestions.push(`Column "${col.name}" has ${nullPct}% nulls -- consider imputation or exclusion`);
    else if (nullPct > 5) suggestions.push(`Column "${col.name}" has ${nullPct}% nulls -- review before analysis`);
  }
  for (const p of profiles) {
    if (p.isLikelyId) suggestions.push(`Column "${p.name}" appears to be an ID (${p.uniqueCount} unique of ${p.count}) -- skip in analysis`);
    if (p.outlierPct > 5) suggestions.push(`Column "${p.name}" has ${p.outlierPct}% outliers -- investigate before aggregating`);
  }

  return {
    metadata: { ...metadata, qualityScore },
    profiles,
    topCorrelations: correlations.slice(0, 10),
    suggestions
  };
}

// -----------------------------------------------------------------------------
// TEXT FORMAT
// -----------------------------------------------------------------------------

function formatText(result) {
  const lines = [];
  const m = result.metadata;
  lines.push(`# Data Profile: ${m.source}`);
  lines.push(`Rows: ${m.rowCount} | Columns: ${m.columnCount} | Quality: ${m.qualityScore}/100`);
  lines.push('');

  lines.push('## Columns');
  for (const p of result.profiles) {
    if (p.type === 'number') {
      lines.push(`  ${p.name}: number | mean=${p.mean} median=${p.median} std=${p.stddev} | min=${p.min} max=${p.max} | shape=${p.shape} | outliers=${p.outlierCount} (${p.outlierPct}%)`);
    } else {
      const top = p.top5.map(t => `${t.value}(${t.pct}%)`).join(', ');
      lines.push(`  ${p.name}: string | ${p.uniqueCount} unique${p.isLikelyId ? ' [LIKELY ID]' : ''} | top: ${top}`);
    }
  }
  lines.push('');

  if (result.topCorrelations.length > 0) {
    lines.push('## Top Correlations');
    for (const c of result.topCorrelations) {
      lines.push(`  ${c.col1}  ${c.col2}: r=${c.r} (${c.strength})`);
    }
    lines.push('');
  }

  if (result.suggestions.length > 0) {
    lines.push('## Suggestions');
    for (const s of result.suggestions) lines.push(`  - ${s}`);
  }

  return lines.join('\n');
}

// -----------------------------------------------------------------------------
// CLI
// -----------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
data-profile.cjs -- Quick data profiler

Usage:
  node data-profile.cjs <path>                  # Profile a file
  node data-profile.cjs --json <ingest.json>    # Profile pre-ingested JSON
  node data-profile.cjs <path> --format json    # Output JSON
  node data-profile.cjs <path> --output report.md
    `.trim());
    process.exit(0);
  }

  const jsonIdx = args.indexOf('--json');
  let data;

  if (jsonIdx !== -1) {
    const jsonPath = args[jsonIdx + 1];
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } else {
    // Auto-ingest using data-ingest.cjs
    const { ingest } = require('./data-ingest.cjs');
    const source = args.find(a => !a.startsWith('--'));
    if (!source) { console.error('Error: No source specified'); process.exit(1); }
    data = await ingest(source);
  }

  const result = await profile(data);
  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
  const output = format === 'json' ? JSON.stringify(result, null, 2) : formatText(result);

  const outIdx = args.indexOf('--output');
  if (outIdx !== -1) {
    fs.writeFileSync(args[outIdx + 1], output, 'utf-8');
    console.log(`Profile written to ${args[outIdx + 1]}`);
  } else {
    console.log(output);
  }
}

main();

module.exports = { profile, pearsonCorrelation, profileNumericColumn, profileCategoricalColumn };
