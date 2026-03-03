/**
 * Color flow check between adjacent rooms.
 * Compares neutral tones (trim, ceiling, floor) and dominant wall colors
 * using deltaE to rate how well palettes transition between spaces.
 */
import { hexToLab, deltaE } from './colorUtils';
import { mapBirdToRoomColors } from './paletteHelpers';
import { birds } from '../data/birds';

/**
 * Rating scale for color transitions
 */
const FLOW_RATINGS = [
  { max: 5, label: 'Seamless', color: 'text-emerald-600', bg: 'bg-emerald-50', description: 'Colors flow perfectly between rooms' },
  { max: 10, label: 'Smooth', color: 'text-emerald-500', bg: 'bg-emerald-50', description: 'Natural, comfortable transition' },
  { max: 18, label: 'Noticeable', color: 'text-amber-500', bg: 'bg-amber-50', description: 'Visible shift — works with good trim' },
  { max: 30, label: 'Contrasting', color: 'text-orange-500', bg: 'bg-orange-50', description: 'Strong contrast — use a transition color' },
  { max: Infinity, label: 'Jarring', color: 'text-red-500', bg: 'bg-red-50', description: 'Consider a buffer room or shared neutrals' },
];

function getFlowRating(dE) {
  return FLOW_RATINGS.find(r => dE < r.max) || FLOW_RATINGS[FLOW_RATINGS.length - 1];
}

/**
 * Compare two rooms' palettes. Returns detailed comparison.
 */
export function compareRoomPalettes(paletteIdA, paletteIdB) {
  const birdA = birds.find(b => b.id === paletteIdA);
  const birdB = birds.find(b => b.id === paletteIdB);
  if (!birdA || !birdB) return null;

  const colorsA = mapBirdToRoomColors(birdA);
  const colorsB = mapBirdToRoomColors(birdB);

  // Compare key surfaces
  const comparisons = [
    { surface: 'Walls', hexA: colorsA.walls, hexB: colorsB.walls, weight: 3 },
    { surface: 'Trim', hexA: birdA.neutrals.trim.hex, hexB: birdB.neutrals.trim.hex, weight: 2 },
    { surface: 'Ceiling', hexA: birdA.neutrals.ceiling.hex, hexB: birdB.neutrals.ceiling.hex, weight: 1.5 },
    { surface: 'Floor', hexA: birdA.neutrals.floor.hex, hexB: birdB.neutrals.floor.hex, weight: 1.5 },
  ];

  let totalWeightedDeltaE = 0;
  let totalWeight = 0;

  const details = comparisons.map(({ surface, hexA, hexB, weight }) => {
    const labA = hexToLab(hexA);
    const labB = hexToLab(hexB);
    const dE = labA && labB ? deltaE(labA, labB) : 50;
    totalWeightedDeltaE += dE * weight;
    totalWeight += weight;
    return { surface, hexA, hexB, deltaE: Math.round(dE * 10) / 10, rating: getFlowRating(dE) };
  });

  const avgDeltaE = totalWeightedDeltaE / totalWeight;
  const overallRating = getFlowRating(avgDeltaE);

  return {
    birdA,
    birdB,
    details,
    avgDeltaE: Math.round(avgDeltaE * 10) / 10,
    overallRating,
  };
}

/**
 * Run flow check on an entire house plan.
 * Returns per-pair results + overall score.
 */
export function checkHouseFlow(plan) {
  if (!plan?.rooms || plan.rooms.length < 2) return { pairs: [], overallScore: null };

  const pairs = [];
  const seen = new Set();

  for (const room of plan.rooms) {
    if (!room.paletteId || !room.adjacentTo) continue;
    for (const adjId of room.adjacentTo) {
      const adjRoom = plan.rooms.find(r => r.id === adjId);
      if (!adjRoom?.paletteId) continue;

      // Avoid duplicate pairs
      const pairKey = [room.id, adjId].sort().join('-');
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      const comparison = compareRoomPalettes(room.paletteId, adjRoom.paletteId);
      if (comparison) {
        pairs.push({
          roomA: room,
          roomB: adjRoom,
          ...comparison,
        });
      }
    }
  }

  const overallScore = pairs.length > 0
    ? Math.round(pairs.reduce((sum, p) => sum + p.avgDeltaE, 0) / pairs.length * 10) / 10
    : null;

  return {
    pairs,
    overallScore,
    overallRating: overallScore !== null ? getFlowRating(overallScore) : null,
  };
}
