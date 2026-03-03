#!/usr/bin/env node
/**
 * One-time script to resolve Unsplash photo page slugs to CDN image URLs.
 *
 * Usage:
 *   1. Get a free Unsplash API access key at https://unsplash.com/developers
 *   2. Run: UNSPLASH_ACCESS_KEY=your_key node scripts/resolve-unsplash-urls.js
 *
 * This will:
 *   - Read all entries from birdImageMap.js that have an unsplashId but no image URL
 *   - Fetch each photo's CDN URL from the Unsplash API
 *   - Output a patched version of the map with real CDN URLs
 *
 * Rate limit: Unsplash allows 50 requests/hour for demo apps.
 * This script fetches one at a time with delays to stay within limits.
 */

const https = require('https');

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  console.error('Error: Set UNSPLASH_ACCESS_KEY environment variable');
  console.error('Get a free key at https://unsplash.com/developers');
  process.exit(1);
}

// All unsplash IDs from birdImageMap.js that need resolution
const BIRDS_NEEDING_URLS = {
  1: 'pwgMl-5OgEw',
  2: 'YJMhpHxnVMA',
  5: 'UZbCVWTDxpE',
  6: 'FNv8LO_EQ-s',
  9: 'TxkisEuUs7w',
  10: '16TAZQOPKyo',
  11: 'OTQGvlHQHhw',
  12: 'b_-KVgWg_YM',
  13: 'b_-KVgWg_YM',
  14: 'WboxGutfzR4',
  15: 'CuoZ6BxJkwY',
  16: 'm4G78xfDnKA',
  17: 'RyqtMoupyoI',
  18: '2xkUW9URWDw',
  19: 'ImhNT6UAaGE',
  20: 'TxkisEuUs7w',
  21: 'M-7eSVirG54',
  22: 'POKVzE1RWJ0',
  23: 'G3vB-YGdzmU',
  24: 'TxkisEuUs7w',
  25: 'G3vB-YGdzmU',
  26: 'ZZArmIkKans',
  27: 'uDF4-h_WkOY',
  28: 'OeYUyI7jWwc',
  29: 'JvOnkvF3xRA',
  30: 'hY8mBYDHrSg',
  31: 'f2UP1SX6XcA',
  32: '1RxqrsppkA0',
  33: 'uDF4-h_WkOY',
  34: 'f2UP1SX6XcA',
  35: 'wo39JBLqzo8',
  36: 'vUiZXRBzEjY',
  37: 'G3vB-YGdzmU',
  38: 'ONd4JMRLlFM',
  39: 'tjZPseTxe6k',
  40: 'cKVLHCo5iPk',
  41: 'tjZPseTxe6k',
  42: 'nk1QkifO8Z0',
  43: 'cKVLHCo5iPk',
  44: 'B-4KAmkFU_c',
  45: 'B-4KAmkFU_c',
  46: 'cKVLHCo5iPk',
  47: 'B-4KAmkFU_c',
  48: 'bIz1pu4vd2g',
  49: 'bIz1pu4vd2g',
  50: 'cKVLHCo5iPk',
  51: 'tjZPseTxe6k',
  53: 'bIz1pu4vd2g',
  54: 'ljJEAezcDEQ',
  55: 'fF5ByVQC0rQ',
  56: 'JT-vscbHVEw',
  57: '42BsLftzMrU',
  58: 'frms3oEqir0',
  59: 'RnQ2G7bVgnU',
  60: 'tjZPseTxe6k',
  61: 'eTXSu9MgDbY',
  62: 'wPQQSjmPU-U',
  63: 'JvOnkvF3xRA',
  64: 'JvOnkvF3xRA',
  65: '2UodVgEMrv8',
  68: 'sO4mAuM96Fc',
  69: 'gWj5SBdfaLs',
  71: 'bD5nxfyBo84',
  72: 'm4G78xfDnKA',
  73: 'ImhNT6UAaGE',
  75: 'vUiZXRBzEjY',
  76: 'ljJEAezcDEQ',
  77: '3_Ha5zDbpws',
  78: 'bD5nxfyBo84',
  79: 'WOY8h-olonY',
  80: 'QqTJYKYfnXo',
  81: 'Rf_RGLMfrWw',
  82: 'zEVCDlA4xwc',
  83: 'DOi_mbNXciw',
  84: 'cE5FuLWztF0',
  85: '1ACUT19tF-A',
  86: 'FUNIa_n9Lok',
  87: '2xkUW9URWDw',
  88: 'suDCrUDUNVA',
  89: 'MDiwNU1pIdo',
  90: 'k5n57jcZaGw',
  91: '0W2iuoxCwDc',
  92: 'DuwAcW03PLc',
  93: 'aAg7VesBNiQ',
  94: 'FqR4cKMdojI',
  95: '3DFm5lKkFm0',
  96: 'Rf_RGLMfrWw',
  97: 'QqTJYKYfnXo',
  98: 'cqObfpV9S0c',
  99: 'YC6BOIp_VGU',
  100: '2UodVgEMrv8',
  101: 'G13Bl19xrhY',
  102: 'k5n57jcZaGw',
  103: 'SwLyFhlch_k',
  104: 'zEVCDlA4xwc',
  106: 'OqYyVgTX_p8',
  107: 'suDCrUDUNVA',
  108: 'OVEiy-2C-lw',
  109: '85Rb8Cl9Rxc',
  110: 'Tnwx_VgNY7k',
  111: '42BsLftzMrU',
  112: '1FIvGAmU_J0',
  113: 'ST6YltRNdGA',
  114: 'h_zT1GbCmx8',
  115: 'fF5ByVQC0rQ',
  116: '7NAmgKaYcJA',
  118: 'N7xxnf_4Tm8',
  119: 'VgvtxnoAg4Q',
  120: '2Z298mFZmCY',
  122: 'hY8mBYDHrSg',
  123: 'hY8mBYDHrSg',
  124: 'ljJEAezcDEQ',
  125: 'N4hbPj1_mLw',
  126: 'hY8mBYDHrSg',
  127: '2xkUW9URWDw',
  128: 'FKSaTvw4B1A',
  129: 'N4hbPj1_mLw',
  130: 'FKSaTvw4B1A',
  131: 'ljJEAezcDEQ',
  132: 'A5i834KxwAw',
  133: 'Rf_RGLMfrWw',
  134: 'cKVLHCo5iPk',
  135: 'zixs3qZ8GbA',
  136: 'ImhNT6UAaGE',
  137: 'FKSaTvw4B1A',
  139: 'aMohRq-jD1Y',
  141: 'QIZbq0GbA6g',
  142: 'G9Aq-zTTvaw',
  143: 'JZ8dtOWoQxg',
  144: 'JZ8dtOWoQxg',
  145: 'bsarUP0k8kk',
  146: 'FBip9u7MrFA',
  147: 'DFCnzrSYqpQ',
  148: 'RhRZydrVoyk',
  150: 'fF5ByVQC0rQ',
  151: 'h_zT1GbCmx8',
  155: 'DFCnzrSYqpQ',
  159: 'R8SwfEpq18M',
  161: 'GPGEct42CBs',
  162: 'R8SwfEpq18M',
  163: 'wFdCFmY-JS4',
  164: 'R8SwfEpq18M',
  165: 'ZpuGQYKAlOw',
  166: 'nk1QkifO8Z0',
  167: 'wFdCFmY-JS4',
  173: 'EPqP2iPGfP8',
  174: 'ZpuGQYKAlOw',
  175: 'h_zT1GbCmx8',
  176: 'ZpuGQYKAlOw',
  178: 'DOi_mbNXciw',
  180: 'DFCnzrSYqpQ',
  181: 'nk1QkifO8Z0',
  182: '2UodVgEMrv8',
  186: 'EPqP2iPGfP8',
  190: 'EPqP2iPGfP8',
  191: 'EPqP2iPGfP8',
  193: 'EinKdyLyK98',
  195: 'FYj2gAyNRCw',
  196: 'ljJEAezcDEQ',
  197: 'G3vB-YGdzmU',
  198: 'FMhKI2qxNK0',
  199: '7DfZmKFk-I0',
  200: 'G3vB-YGdzmU',
  201: 'jZT6kAAHIHk',
  202: 'fF5ByVQC0rQ',
  203: '2xkUW9URWDw',
  204: 'TxkisEuUs7w',
  205: 'NgSPFaBWICo',
  206: 'TxkisEuUs7w',
  207: 'NgSPFaBWICo',
  208: 'b_-KVgWg_YM',
  209: '0W2iuoxCwDc',
  211: 'fF5ByVQC0rQ',
  212: 'RhRZydrVoyk',
  213: 'FMhKI2qxNK0',
  214: 'O6VG-YOCFKo',
  215: 'r1XGxppSxvM',
  216: 'FKSaTvw4B1A',
  217: 'Tnwx_VgNY7k',
  218: 'JT-vscbHVEw',
  219: 'fF5ByVQC0rQ',
};

function fetchPhoto(photoId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.unsplash.com/photos/${photoId}?client_id=${ACCESS_KEY}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({
              id: photoId,
              cdnUrl: json.urls.raw.split('?')[0],
              photographer: json.user.name,
            });
          } catch (e) {
            reject(new Error(`Failed to parse response for ${photoId}: ${e.message}`));
          }
        } else if (res.statusCode === 404) {
          console.warn(`  Photo ${photoId} not found (404). Skipping.`);
          resolve(null);
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${photoId}: ${data.substring(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // Deduplicate unsplash IDs
  const uniqueIds = [...new Set(Object.values(BIRDS_NEEDING_URLS))];
  console.log(`Resolving ${uniqueIds.length} unique Unsplash photo IDs...`);
  console.log(`(Total bird entries: ${Object.keys(BIRDS_NEEDING_URLS).length})`);
  console.log('');

  const results = {};
  let resolved = 0;
  let failed = 0;

  for (const photoId of uniqueIds) {
    try {
      const result = await fetchPhoto(photoId);
      if (result) {
        results[photoId] = result;
        resolved++;
        console.log(`  [${resolved}/${uniqueIds.length}] ${photoId} => ${result.cdnUrl.split('/').pop()} (${result.photographer})`);
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      failed++;
      // If rate limited, wait longer
      if (err.message.includes('403') || err.message.includes('429')) {
        console.log('  Rate limited. Waiting 60 seconds...');
        await sleep(60000);
      }
    }
    // 1.5 second delay between requests to stay within rate limits
    await sleep(1500);
  }

  console.log('');
  console.log(`Resolved: ${resolved}, Failed: ${failed}`);
  console.log('');

  // Output the mapping for birdImageMap.js
  console.log('// ====== PASTE INTO birdImageMap.js ======');
  console.log('// Replace entries that have unsplashId with these image URLs:');
  console.log('');

  for (const [birdId, unsplashId] of Object.entries(BIRDS_NEEDING_URLS)) {
    const result = results[unsplashId];
    if (result) {
      console.log(`  ${birdId}: { image: '${result.cdnUrl}?w=800&q=80', imageCredit: '${result.photographer}', unsplashId: '${unsplashId}' },`);
    }
  }
}

main().catch(console.error);
