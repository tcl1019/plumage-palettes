import { getUndertone } from './colorUtils';

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
