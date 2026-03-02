import { birds as BIRDS } from '../src/data/birds.js';
import { FLOCK_PAIRINGS } from '../src/data/flockPairings.js';

console.log('=== Data Verification ===');
console.log('Total birds:', BIRDS.length);
console.log('First bird:', BIRDS[0].name, '(id:', BIRDS[0].id + ')');
console.log('Last bird:', BIRDS[BIRDS.length - 1].name, '(id:', BIRDS[BIRDS.length - 1].id + ')');

// Check key birds
const scarlet = BIRDS.find(b => b.name.includes('Scarlet Macaw'));
const bluebird = BIRDS.find(b => b.name.includes('Mountain Bluebird'));
console.log('\nScarlet Macaw id:', scarlet?.id, 'colors:', scarlet?.colors?.length);
console.log('Mountain Bluebird id:', bluebird?.id, 'colors:', bluebird?.colors?.length);

// Check all birds have required fields
let fieldIssues = 0;
const requiredFields = ['id', 'name', 'scientific', 'description', 'colors', 'harmony', 'neutrals', 'rooms', 'styles', 'season', 'tagline', 'moods'];
for (const bird of BIRDS) {
  for (const field of requiredFields) {
    if (!bird[field]) {
      console.log('MISSING', field, 'on bird', bird.id, bird.name);
      fieldIssues++;
    }
  }
  if (bird.colors && bird.colors.length < 3) {
    console.log('Only', bird.colors.length, 'colors for', bird.name);
  }
}
if (fieldIssues === 0) console.log('\nAll birds have all required fields!');
else console.log('\n' + fieldIssues + ' field issues found');

// Check flock pairings
console.log('\nFlock pairings:', FLOCK_PAIRINGS.length);
let allFound = true;
for (const p of FLOCK_PAIRINGS) {
  for (const bid of p.birdIds) {
    const found = BIRDS.find(b => b.id === bid);
    if (!found) {
      console.log('MISSING bird id', bid, 'in pairing', p.name);
      allFound = false;
    }
  }
}
if (allFound) console.log('All flock pairing bird IDs found in birds data!');

// Check pairedColors hex values exist in bird palettes
let colorIssues = 0;
for (const p of FLOCK_PAIRINGS) {
  for (const pc of p.pairedColors) {
    const fromBird = BIRDS.find(b => b.id === pc.fromBird);
    const toBird = BIRDS.find(b => b.id === pc.toBird);
    const fromHexes = fromBird?.colors?.map(c => c.hex.toUpperCase()) || [];
    const toHexes = toBird?.colors?.map(c => c.hex.toUpperCase()) || [];
    if (!fromHexes.includes(pc.hex.toUpperCase())) {
      console.log('Color', pc.hex, 'not in', fromBird?.name, 'palette. Available:', fromHexes.join(', '));
      colorIssues++;
    }
    if (!toHexes.includes(pc.hex2.toUpperCase())) {
      console.log('Color', pc.hex2, 'not in', toBird?.name, 'palette. Available:', toHexes.join(', '));
      colorIssues++;
    }
  }
}
if (colorIssues === 0) console.log('All pairedColors hex values match bird palettes!');
else console.log(colorIssues + ' color mismatches found');

console.log('\n=== Verification Complete ===');
