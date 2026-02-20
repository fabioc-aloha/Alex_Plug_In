/**
 * Replicate Model Search Utility
 * 
 * Searches and lists Replicate models by query string.
 * 
 * Usage:
 *   $env:REPLICATE_API_TOKEN = "r8_..."
 *   node scripts/search-replicate-models.js "face age progression"
 *   node scripts/search-replicate-models.js "gemini"
 *   node scripts/search-replicate-models.js "flux pulid"
 *   node scripts/search-replicate-models.js --owner=fofr
 */

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function searchModels(query) {
  console.log(`\n🔍 Searching Replicate for: "${query}"\n`);
  console.log('─'.repeat(80));
  
  try {
    // Use the collections.get to browse popular models, or search via API
    const response = await fetch(`https://api.replicate.com/v1/models?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    if (results.length === 0) {
      console.log('No models found matching query.');
      return;
    }
    
    for (const model of results.slice(0, 20)) {
      const runs = model.run_count ? `⭐ ${(model.run_count / 1000).toFixed(1)}k runs` : '';
      console.log(`\n📦 ${model.owner}/${model.name}`);
      console.log(`   ${model.description?.slice(0, 100) || 'No description'}${model.description?.length > 100 ? '...' : ''}`);
      console.log(`   ${runs} | https://replicate.com/${model.owner}/${model.name}`);
    }
    
    console.log('\n' + '─'.repeat(80));
    console.log(`Found ${Math.min(results.length, 20)} model(s)\n`);
  } catch (err) {
    console.error('Search error:', err.message);
  }
}

async function listByOwner(owner) {
  console.log(`\n📋 Models by owner: ${owner}\n`);
  console.log('─'.repeat(80));
  
  try {
    const response = await fetch(`https://api.replicate.com/v1/models?owner=${encodeURIComponent(owner)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    if (results.length === 0) {
      console.log(`No models found for owner: ${owner}`);
      return;
    }
    
    for (const model of results) {
      console.log(`  ${model.name.padEnd(35)} ${(model.description || '').slice(0, 50)}`);
    }
    
    console.log('\n' + '─'.repeat(80));
    console.log(`Found ${results.length} model(s) by ${owner}\n`);
  } catch (err) {
    console.error('List error:', err.message);
  }
}

async function main() {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('ERROR: REPLICATE_API_TOKEN not set.');
    console.error('Run: $env:REPLICATE_API_TOKEN = "r8_..."');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage:
  node scripts/search-replicate-models.js <query>
  node scripts/search-replicate-models.js --owner=<username>

Examples:
  node scripts/search-replicate-models.js "face swap"
  node scripts/search-replicate-models.js "flux"
  node scripts/search-replicate-models.js "age progression"
  node scripts/search-replicate-models.js --owner=fofr
  node scripts/search-replicate-models.js --owner=black-forest-labs
`);
    process.exit(0);
  }

  const ownerArg = args.find(a => a.startsWith('--owner='));
  if (ownerArg) {
    const owner = ownerArg.split('=')[1];
    await listByOwner(owner);
  } else {
    const query = args.join(' ');
    await searchModels(query);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
