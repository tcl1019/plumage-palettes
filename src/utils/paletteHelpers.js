import { getUndertone, hexToLab, deltaE } from './colorUtils';

export function mapBirdToRoomColors(bird) {
  const byRole = {};
  for (const c of bird.colors) {
    byRole[c.role] = c.hex;
  }
  return {
    walls: byRole.dominant || bird.colors[0]?.hex || '#E5E5E5',
    textiles: byRole.secondary || bird.colors[1]?.hex || '#CCCCCC',
    accents: byRole.accent || bird.colors[2]?.hex || '#999999',
    trim: byRole.neutral || bird.neutrals?.trim?.hex || '#F5F5F5',
    feature: byRole.highlight || bird.colors[3]?.hex || '#666666',
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
