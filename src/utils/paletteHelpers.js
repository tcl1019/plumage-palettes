import { getUndertone, hexToRgb, rgbToHsl, hexToLab, deltaE } from './colorUtils';
import { FINISH_GUIDE } from '../data/constants';

/**
 * Score how suitable a color is for walls (60% coverage).
 * Higher = more suitable. Considers saturation, lightness, and mutedness.
 * Ideal wall colors: muted (low-medium saturation), moderate lightness.
 */
function wallSuitability(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const { s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  let score = 100;

  // Penalize high saturation — vivid colors overwhelm at 60%
  if (s > 50) score -= (s - 50) * 1.8;
  else if (s > 35) score -= (s - 35) * 0.5;

  // Penalize extreme lightness — too dark or too washed-out
  if (l < 15) score -= (15 - l) * 4;
  else if (l < 25) score -= (25 - l) * 1.5;
  if (l > 85) score -= (l - 85) * 2;

  // Slight preference for the sweet spot: 30-70% lightness, 8-30% saturation
  if (l >= 30 && l <= 70 && s >= 8 && s <= 30) score += 10;

  return score;
}

/**
 * Score how suitable a color is as an accent (10% pop of interest).
 * Vivid, saturated, or very dark/light colors make good accents.
 */
function accentSuitability(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const { s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  let score = 50;
  // Reward high saturation
  if (s > 50) score += (s - 50) * 1.2;
  // Reward extreme lightness (very light or very dark = contrast)
  if (l < 15 || l > 85) score += 15;
  return score;
}

const ROLE_FINISHES = {
  dominant: 'Eggshell',
  secondary: 'Satin',
  accent: 'Semi-Gloss',
  highlight: 'Semi-Gloss',
};

const ROLE_APPLICATIONS = {
  dominant: [
    'Primary wall color for a cohesive, livable room',
    'Main wall color — soft enough to live with every day',
    'All four walls for a grounding, enveloping effect',
  ],
  secondary: [
    'Linen drapery, upholstered seating, or woven throw blankets',
    'Sofa fabric, area rug, or curtain panels',
    'Textiles and soft furnishings that anchor the room',
  ],
  accent: [
    'Decorative ceramics, a patterned pillow, or art frames',
    'Statement throw pillows, vases, or a painted accent chair',
    'A single feature wall, artwork, or decorative objects',
  ],
  highlight: [
    'Interior doors, a painted bookshelf, or fireplace surround',
    'A single bold object — lamp, side table, or art piece',
    'Small pops: candles, book spines, or a single shelf accent',
  ],
};

/**
 * Reassign color roles for a bird palette based on color properties.
 * Returns a new colors array with smarter role assignments.
 */
export function reassignRoles(bird) {
  const colors = bird.colors;
  if (!colors || colors.length === 0) return colors;

  // Score each color for wall vs accent suitability
  const scored = colors.map((c, i) => ({
    index: i,
    color: c,
    wallScore: wallSuitability(c.hex),
    accentScore: accentSuitability(c.hex),
  }));

  // Sort by wall suitability (best wall candidate first)
  const byWall = [...scored].sort((a, b) => b.wallScore - a.wallScore);
  // Sort by accent suitability (best accent candidate first)
  const byAccent = [...scored].sort((a, b) => b.accentScore - a.accentScore);

  const assigned = new Map();
  const usedIndices = new Set();

  // 1. Pick the best wall color (dominant)
  const wallPick = byWall[0];
  assigned.set(wallPick.index, 'dominant');
  usedIndices.add(wallPick.index);

  // 2. Pick the best accent (most vivid remaining)
  const accentPick = byAccent.find(s => !usedIndices.has(s.index));
  if (accentPick) {
    assigned.set(accentPick.index, 'accent');
    usedIndices.add(accentPick.index);
  }

  // 3. Pick secondary — next best wall-suitable color (for textiles)
  const secondaryPick = byWall.find(s => !usedIndices.has(s.index));
  if (secondaryPick) {
    assigned.set(secondaryPick.index, 'secondary');
    usedIndices.add(secondaryPick.index);
  }

  // 4. Remaining colors become highlight or additional accents
  const remaining = scored.filter(s => !usedIndices.has(s.index));
  if (remaining.length > 0) {
    // First remaining → highlight (feature)
    assigned.set(remaining[0].index, 'highlight');
  }
  for (let i = 1; i < remaining.length; i++) {
    assigned.set(remaining[i].index, 'accent');
  }

  // Build new colors array preserving original order
  return colors.map((c, i) => {
    const newRole = assigned.get(i) || c.role;
    const appOptions = ROLE_APPLICATIONS[newRole] || ROLE_APPLICATIONS.accent;
    return {
      ...c,
      role: newRole,
      finish: ROLE_FINISHES[newRole] || c.finish,
      application: appOptions[i % appOptions.length],
    };
  });
}

/**
 * Get a bird with smart role assignments applied.
 * Caches results so we don't recompute on every render.
 */
const _smartCache = new Map();
export function getSmartBird(bird) {
  if (_smartCache.has(bird.id)) return _smartCache.get(bird.id);
  const smartBird = { ...bird, colors: reassignRoles(bird) };
  _smartCache.set(bird.id, smartBird);
  return smartBird;
}

export function mapBirdToRoomColors(bird) {
  const smartBird = getSmartBird(bird);
  const byRole = {};
  for (const c of smartBird.colors) {
    if (!byRole[c.role]) byRole[c.role] = c.hex;
  }
  return {
    walls: byRole.dominant || smartBird.colors[0]?.hex || '#E5E5E5',
    textiles: byRole.secondary || smartBird.colors[1]?.hex || '#CCCCCC',
    accents: byRole.accent || smartBird.colors[2]?.hex || '#999999',
    trim: byRole.neutral || bird.neutrals?.trim?.hex || '#F5F5F5',
    feature: byRole.highlight || smartBird.colors[3]?.hex || '#666666',
    floor: bird.neutrals?.floor?.hex || '#8B7D6B',
    ceiling: bird.neutrals?.ceiling?.hex || '#F7F5F2',
  };
}

export function findSimilarPalettes(bird, allBirds, count = 3) {
  const scored = allBirds
    .filter(b => b.id !== bird.id)
    .map(b => {
      let score = 0;
      // Style overlap
      const styleOverlap = bird.styles.filter(s => b.styles.includes(s)).length;
      score += styleOverlap * 3;
      // Same harmony type
      if (bird.harmony.type === b.harmony.type) score += 2;
      // Same season
      if (bird.season === b.season) score += 1;
      // Similar undertone mix
      const birdUT = bird.colors.map(c => getUndertone(c.hex));
      const otherUT = b.colors.map(c => getUndertone(c.hex));
      const warmMatch = Math.abs(birdUT.filter(u => u === 'warm').length - otherUT.filter(u => u === 'warm').length);
      score += Math.max(0, 3 - warmMatch);
      return { bird: b, score };
    });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map(s => s.bird);
}

export function generateShareUrl(bird) {
  const data = {
    id: bird.id,
    n: bird.name,
    c: bird.colors.map(c => c.hex),
  };
  const encoded = btoa(JSON.stringify(data));
  return `${window.location.origin}${window.location.pathname}?palette=${encoded}`;
}

export function parseShareUrl() {
  const params = new URLSearchParams(window.location.search);
  const paletteParam = params.get('palette');
  if (!paletteParam) return null;
  try {
    return JSON.parse(atob(paletteParam));
  } catch {
    return null;
  }
}

/**
 * Match bird palettes against a set of input colors.
 * For each bird, compute the minimum deltaE from each input color to any bird color,
 * then sum the minimums. Lower total = better match.
 *
 * @param {Array<string>} inputHexes - Array of hex colors to match against
 * @param {Array} allBirds - All bird palette objects
 * @param {number} count - Number of results to return
 * @param {string} mode - 'match' (find palettes containing these colors) or 'rescue' (find palettes that bridge clashing colors)
 * @returns {Array<{bird: object, score: number, matchedColors: Array}>}
 */
export function matchPalettesByColors(inputHexes, allBirds, count = 5, mode = 'match') {
  const inputLabs = inputHexes.map(hex => ({ hex, lab: hexToLab(hex) })).filter(c => c.lab);
  if (inputLabs.length === 0) return [];

  const results = allBirds.map(bird => {
    const birdLabs = bird.colors.map(c => ({ hex: c.hex, name: c.name, role: c.role, lab: hexToLab(c.hex) })).filter(c => c.lab);
    if (birdLabs.length === 0) return { bird, score: Infinity, matchedColors: [] };

    const matchedColors = [];
    let totalScore = 0;

    for (const input of inputLabs) {
      let bestDist = Infinity;
      let bestMatch = null;
      for (const bc of birdLabs) {
        const dist = deltaE(input.lab, bc.lab);
        if (dist < bestDist) {
          bestDist = dist;
          bestMatch = bc;
        }
      }
      matchedColors.push({
        inputHex: input.hex,
        matchHex: bestMatch.hex,
        matchName: bestMatch.name,
        matchRole: bestMatch.role,
        deltaE: bestDist,
      });
      totalScore += bestDist;
    }

    // For rescue mode, also reward palette diversity (more spread = better bridge)
    if (mode === 'rescue') {
      const uniqueMatches = new Set(matchedColors.map(m => m.matchHex));
      // Bonus for matching to different bird colors (bridges the gap)
      if (uniqueMatches.size > 1) {
        totalScore *= 0.7; // 30% bonus for palettes that map inputs to different colors
      }
    }

    return { bird, score: totalScore, matchedColors };
  });

  results.sort((a, b) => a.score - b.score);
  return results.slice(0, count);
}

/**
 * Generate a human-readable explanation of why a palette matches.
 */
export function getMatchExplanation(matchResult) {
  const { bird, matchedColors } = matchResult;
  const avgDeltaE = matchedColors.reduce((sum, m) => sum + m.deltaE, 0) / matchedColors.length;

  if (avgDeltaE < 3) {
    return `${bird.name} contains near-exact matches for your colors — this palette was practically made for your space.`;
  }
  if (avgDeltaE < 8) {
    const roles = [...new Set(matchedColors.map(m => m.matchRole))];
    return `Your colors align with ${bird.name}'s ${roles.join(' and ')} tones. A natural, harmonious fit.`;
  }
  if (avgDeltaE < 15) {
    return `${bird.name} offers a complementary range that bridges your existing colors with ${bird.harmony.type} harmony.`;
  }
  return `${bird.name} provides a fresh direction while nodding to your current palette's undertones.`;
}

export function getBirdHighestRatedRoom(bird) {
  if (!bird.rooms || bird.rooms.length === 0) return 'living-room';
  const best = bird.rooms.reduce((a, b) => a.rating >= b.rating ? a : b);
  const roomMap = {
    'Bedroom': 'bedroom',
    'Living Room': 'living-room',
    'Kitchen': 'kitchen',
    'Bathroom': 'bathroom',
    'Dining Room': 'dining-room',
  };
  return roomMap[best.room] || 'living-room';
}
