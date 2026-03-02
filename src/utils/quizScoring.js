import { getUndertone, hexToRgb, rgbToHsl } from './colorUtils';

// Map moods to harmony types and undertone preferences
const MOOD_MAP = {
  calm: { harmonies: ['analogous', 'monochromatic'], undertones: ['cool', 'neutral'], seasonBias: null },
  warm: { harmonies: ['analogous', 'monochromatic', 'complementary'], undertones: ['warm'], seasonBias: 'fall-winter' },
  bold: { harmonies: ['triadic', 'complementary', 'split-complementary'], undertones: ['warm', 'cool'], seasonBias: null },
  fresh: { harmonies: ['analogous', 'triadic'], undertones: ['cool', 'neutral'], seasonBias: 'spring-summer' },
  eclectic: { harmonies: ['triadic', 'split-complementary', 'complementary'], undertones: ['warm', 'cool'], seasonBias: null },
};

// Map room names to bird room field names
const ROOM_NAME_MAP = {
  'bedroom': 'Bedroom',
  'living-room': 'Living Room',
  'kitchen': 'Kitchen',
  'bathroom': 'Bathroom',
  'dining-room': 'Dining Room',
};

// Color families for the "existing colors" step
export const COLOR_FAMILIES = [
  { id: 'warm-neutrals', label: 'Warm Neutrals', hex: '#C9B99A', hueRange: [30, 60], satRange: [5, 40] },
  { id: 'cool-neutrals', label: 'Cool Neutrals', hex: '#9CA3AF', hueRange: [200, 240], satRange: [0, 20] },
  { id: 'blues', label: 'Blues', hex: '#5B8DB8', hueRange: [200, 250], satRange: [30, 100] },
  { id: 'greens', label: 'Greens', hex: '#6B8E6B', hueRange: [100, 170], satRange: [20, 100] },
  { id: 'reds-pinks', label: 'Reds & Pinks', hex: '#C07070', hueRange: [340, 370], satRange: [25, 100] },
  { id: 'yellows-golds', label: 'Yellows & Golds', hex: '#C9A84C', hueRange: [40, 65], satRange: [40, 100] },
  { id: 'purples', label: 'Purples', hex: '#8B7BAD', hueRange: [260, 310], satRange: [20, 100] },
  { id: 'dark-wood', label: 'Dark Wood', hex: '#5C4033', hueRange: [15, 35], satRange: [20, 50] },
  { id: 'light-wood', label: 'Light Wood', hex: '#C4A87C', hueRange: [30, 50], satRange: [30, 60] },
  { id: 'white-bright', label: 'White & Bright', hex: '#F5F0E8', hueRange: [0, 360], satRange: [0, 10] },
];

function getAverageUndertone(bird) {
  let warm = 0, cool = 0, neutral = 0;
  for (const c of bird.colors) {
    const ut = getUndertone(c.hex);
    if (ut === 'warm') warm++;
    else if (ut === 'cool') cool++;
    else neutral++;
  }
  if (warm > cool && warm > neutral) return 'warm';
  if (cool > warm && cool > neutral) return 'cool';
  return 'neutral';
}

function isUndertoneCompatible(birdUndertone, familyId) {
  const family = COLOR_FAMILIES.find(f => f.id === familyId);
  if (!family) return true;
  const familyUndertone = getUndertone(family.hex);
  if (birdUndertone === 'neutral' || familyUndertone === 'neutral') return true;
  return birdUndertone === familyUndertone;
}

export function scoreBird(bird, answers) {
  let score = 0;

  // Room rating (0-5, weight 3)
  if (answers.room) {
    const roomName = ROOM_NAME_MAP[answers.room] || answers.room;
    const roomEntry = bird.rooms?.find(r => r.room === roomName);
    score += (roomEntry?.rating || 2) * 3;
  }

  // Mood match (weight 2)
  if (answers.mood && MOOD_MAP[answers.mood]) {
    const moodConfig = MOOD_MAP[answers.mood];
    if (moodConfig.harmonies.includes(bird.harmony?.type)) score += 4;
    const birdUndertone = getAverageUndertone(bird);
    if (moodConfig.undertones.includes(birdUndertone)) score += 3;
    if (moodConfig.seasonBias && bird.season === moodConfig.seasonBias) score += 1;
  }

  // Style match (weight 2)
  if (answers.styles?.length > 0) {
    const overlap = bird.styles?.filter(s => answers.styles.includes(s)).length || 0;
    score += overlap * 3;
  }

  // Undertone compatibility with existing colors (weight 1)
  if (answers.existingColors?.length > 0) {
    const birdUndertone = getAverageUndertone(bird);
    const compatible = answers.existingColors.filter(cId => isUndertoneCompatible(birdUndertone, cId));
    score += (compatible.length / answers.existingColors.length) * 3;
  }

  return score;
}

export function getQuizResults(birds, answers, count = 5) {
  const scored = birds.map(bird => ({
    bird,
    score: scoreBird(bird, answers),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map(({ bird, score }) => ({
    bird,
    score,
    reason: buildReason(bird, answers),
  }));
}

function buildReason(bird, answers) {
  const parts = [];
  if (answers.room) {
    const roomName = ROOM_NAME_MAP[answers.room] || answers.room;
    const roomEntry = bird.rooms?.find(r => r.room === roomName);
    if (roomEntry?.rating >= 4) parts.push(`Top-rated for ${roomEntry.room.toLowerCase()}s`);
  }
  if (answers.mood && MOOD_MAP[answers.mood]) {
    const moodConfig = MOOD_MAP[answers.mood];
    if (moodConfig.harmonies.includes(bird.harmony?.type)) {
      parts.push(`${bird.harmony.type} harmony creates the ${answers.mood} mood you want`);
    }
  }
  if (answers.styles?.length > 0) {
    const matches = bird.styles?.filter(s => answers.styles.includes(s)) || [];
    if (matches.length > 0) parts.push(`matches your ${matches.join(' & ')} style`);
  }
  return parts.length > 0 ? parts.join('. ') + '.' : 'A versatile palette that works across many spaces.';
}
