/**
 * chart-recommend.cjs -- Story-intent chart advisor
 * Version: 1.0.0
 *
 * Given a story intent, data shape, and audience, returns the best chart type
 * with configuration and rationale. Uses story intent as the primary axis
 * (not data shape) -- matching the data-visualization skill methodology.
 *
 * Usage:
 *   node chart-recommend.cjs --intent compare --shape categorical-vs-numeric --audience executive
 *   node chart-recommend.cjs --message "rank states by population"
 *   node chart-recommend.cjs --json '{"storyIntent":"trend","dataShape":"time-series","columns":[...]}'
 *   cat profile.json | node chart-recommend.cjs --stdin --intent compare
 */
'use strict';

// -----------------------------------------------------------------------------
// CHART SELECTION MATRIX
// -----------------------------------------------------------------------------

const CHART_MATRIX = {
  compare: {
    primary: [
      { type: 'bar', maxItems: 15, label: 'Vertical bar for up to 15 items' },
      { type: 'horizontalBar', maxItems: 50, label: 'Horizontal bar for many items or long labels' },
      { type: 'groupedBar', series: true, label: 'Grouped for multi-series comparison' },
      { type: 'radar', maxItems: 8, label: 'Radar for multi-dimensional comparison' }
    ],
    advanced: ['beeswarm', 'parallelCoordinates']
  },
  trend: {
    primary: [
      { type: 'line', label: 'Line for continuous time series' },
      { type: 'area', label: 'Area for volume over time' },
      { type: 'stackedArea', series: true, label: 'Stacked area for composition over time' }
    ],
    advanced: ['streamgraph', 'ridgeline']
  },
  'part-to-whole': {
    primary: [
      { type: 'donut', maxItems: 7, label: 'Donut for 2-7 segments' },
      { type: 'stackedBar', label: 'Stacked bar for part-to-whole across categories' },
      { type: 'pie', maxItems: 5, label: 'Pie for 2-5 segments (use sparingly)' }
    ],
    advanced: ['waffle', 'sunburst', 'treemap']
  },
  distribution: {
    primary: [
      { type: 'histogram', label: 'Histogram for single variable distribution' },
      { type: 'scatter', label: 'Scatter for bivariate distribution' }
    ],
    advanced: ['violin', 'beeswarm', 'ridgeline']
  },
  relationship: {
    primary: [
      { type: 'scatter', label: 'Scatter for two numeric variables' },
      { type: 'bubble', label: 'Bubble for three numeric dimensions' }
    ],
    advanced: ['chord', 'networkGraph', 'parallelCoordinates']
  },
  flow: {
    primary: [
      { type: 'horizontalBar', label: 'Horizontal bar for stage comparison' }
    ],
    advanced: ['sankey', 'chord']
  },
  hierarchy: {
    primary: [
      { type: 'treemap', label: 'Treemap for hierarchical proportions' }
    ],
    advanced: ['sunburst']
  },
  spatial: {
    primary: [
      { type: 'heatmap', label: 'Heatmap for two-dimensional patterns' }
    ],
    advanced: ['networkGraph']
  },
  deviation: {
    primary: [
      { type: 'bar', label: 'Diverging bar for above/below baseline' },
      { type: 'line', label: 'Line with reference line for target deviation' }
    ],
    advanced: ['beeswarm']
  }
};

// -----------------------------------------------------------------------------
// INTENT INFERENCE FROM MESSAGE
// -----------------------------------------------------------------------------

const INTENT_SIGNALS = [
  { intent: 'compare', patterns: /\b(rank|versus|vs|top|best|worst|differ|compare|which|highest|lowest|most|least)\b/i },
  { intent: 'trend', patterns: /\b(trend|growth|decline|over time|monthly|quarterly|yearly|evolve|history|forecast)\b/i },
  { intent: 'part-to-whole', patterns: /\b(share|proportion|breakdown|percent|percentage|mix|composition|segment)\b/i },
  { intent: 'distribution', patterns: /\b(spread|range|outlier|distribution|histogram|normal|skew|variance)\b/i },
  { intent: 'relationship', patterns: /\b(correlat|affect|predict|connect|scatter|relationship|association|regression)\b/i },
  { intent: 'flow', patterns: /\b(flow|path|from.to|conversion|funnel|journey|pipeline|stages)\b/i },
  { intent: 'hierarchy', patterns: /\b(drill.down|parent|child|levels|hierarchy|nested|tree)\b/i },
  { intent: 'spatial', patterns: /\b(where|hotspot|concentration|geographic|location|map|region)\b/i },
  { intent: 'deviation', patterns: /\b(deviation|variance|above|below|target|gap|baseline|budget|actual)\b/i }
];

function inferIntent(message) {
  if (!message) return null;
  const matches = [];
  for (const { intent, patterns } of INTENT_SIGNALS) {
    const m = message.match(patterns);
    if (m) matches.push({ intent, matchCount: m.length });
  }
  matches.sort((a, b) => b.matchCount - a.matchCount);
  return matches.length > 0 ? matches[0].intent : null;
}

// -----------------------------------------------------------------------------
// DATA SHAPE INFERENCE
// -----------------------------------------------------------------------------

const SHAPE_DEFAULTS = {
  'time-series': 'trend',
  'categorical-vs-numeric': 'compare',
  'two-numeric': 'relationship',
  'network': 'relationship',
  'hierarchical': 'hierarchy',
  'flow-matrix': 'flow'
};

// -----------------------------------------------------------------------------
// AUDIENCE FILTER
// -----------------------------------------------------------------------------

function filterByAudience(candidates, audience) {
  if (audience === 'executive') {
    // Executives get the simplest chart
    return candidates.filter(c => !c.series).slice(0, 1);
  }
  return candidates;
}

// -----------------------------------------------------------------------------
// RECOMMEND
// -----------------------------------------------------------------------------

function recommend(input) {
  let { storyIntent, dataShape, columns, audience, message } = input;
  audience = audience || 'analyst';
  const inferenceNotes = [];

  // Step 1: Resolve intent
  if (!storyIntent && message) {
    storyIntent = inferIntent(message);
    if (storyIntent) inferenceNotes.push(`Inferred "${storyIntent}" from message: "${message}"`);
  }
  if (!storyIntent && dataShape && SHAPE_DEFAULTS[dataShape]) {
    storyIntent = SHAPE_DEFAULTS[dataShape];
    inferenceNotes.push(`Fell back to "${storyIntent}" from data shape "${dataShape}"`);
  }
  if (!storyIntent) {
    storyIntent = 'compare';
    inferenceNotes.push('No intent detected -- defaulted to "compare"');
  }

  // Step 2: Look up chart candidates
  const entry = CHART_MATRIX[storyIntent];
  if (!entry) {
    return { error: `Unknown story intent: ${storyIntent}`, validIntents: Object.keys(CHART_MATRIX) };
  }

  const candidates = filterByAudience(entry.primary, audience);
  const primary = candidates[0];
  const alternative = candidates[1] || (entry.primary.length > 1 ? entry.primary[1] : null);

  // Step 3: Build config hints
  const config = { sortBy: storyIntent === 'compare' ? 'value-desc' : undefined };
  if (columns) {
    const numCols = columns.filter(c => c.type === 'number');
    const catCols = columns.filter(c => c.type === 'string');
    if (catCols.length > 0) config.labelField = catCols[0].name;
    if (numCols.length > 0) config.valueField = numCols[0].name;
    if (catCols.length > 0 && catCols[0].uniqueCount > 15 && primary.type === 'bar') {
      // Auto-switch to horizontal bar for many categories
      primary.type = 'horizontalBar';
      inferenceNotes.push(`Switched to horizontalBar: ${catCols[0].uniqueCount} categories > 15`);
    }
  }

  return {
    primary: { chartType: primary.type, config, rationale: primary.label },
    alternative: alternative ? { chartType: alternative.type, rationale: alternative.label } : null,
    advancedOptions: entry.advanced,
    storyIntentUsed: storyIntent,
    audience,
    inferenceNotes
  };
}

// -----------------------------------------------------------------------------
// CLI
// -----------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
chart-recommend.cjs -- Story-intent chart advisor

Usage:
  node chart-recommend.cjs --intent compare --shape categorical-vs-numeric --audience executive
  node chart-recommend.cjs --message "rank states by population"
  node chart-recommend.cjs --json '{"storyIntent":"trend","dataShape":"time-series"}'

Intents: compare, trend, part-to-whole, distribution, relationship, flow, hierarchy, spatial, deviation
Shapes:  categorical-vs-numeric, two-numeric, time-series, network, hierarchical, flow-matrix
Audience: executive, manager, analyst, general
    `.trim());
    process.exit(0);
  }

  let input = {};
  const jsonIdx = args.indexOf('--json');
  if (jsonIdx !== -1) {
    input = JSON.parse(args[jsonIdx + 1]);
  } else {
    const intentIdx = args.indexOf('--intent');
    if (intentIdx !== -1) input.storyIntent = args[intentIdx + 1];
    const shapeIdx = args.indexOf('--shape');
    if (shapeIdx !== -1) input.dataShape = args[shapeIdx + 1];
    const audIdx = args.indexOf('--audience');
    if (audIdx !== -1) input.audience = args[audIdx + 1];
    const msgIdx = args.indexOf('--message');
    if (msgIdx !== -1) input.message = args[msgIdx + 1];
  }

  const result = recommend(input);
  console.log(JSON.stringify(result, null, 2));
}

main();

module.exports = { recommend, inferIntent, CHART_MATRIX };
