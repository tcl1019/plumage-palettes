import { rawBirdColors } from '../src/data/raw-bird-colors.js';

const entries = Object.entries(rawBirdColors);
for (const [abbr, data] of entries) {
  if (!data || !data.colors) {
    console.log(abbr, ': NO COLORS DATA');
    continue;
  }
  if (data.colors.length <= 2) {
    console.log(abbr, ':', data.colors.length, 'colors -', JSON.stringify(data.colors));
  }
}
console.log('Total entries:', entries.length);
