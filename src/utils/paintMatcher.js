import { hexToRgb, rgbToLab, deltaE } from './colorUtils';

// Cache for lazy-loaded paint data
let swData = null;
let bmData = null;

// Pre-computed LAB values cache (computed once on first use)
let swLab = null;
let bmLab = null;

function precomputeLab(colors) {
  return colors.map(([code, name, hex]) => {
    const rgb = hexToRgb(hex);
    const lab = rgb ? rgbToLab(rgb.r, rgb.g, rgb.b) : { L: 0, a: 0, b: 0 };
    return { code, name, hex, lab };
  });
}

export async function loadPaintData() {
  if (!swData || !bmData) {
    const [sw, bm] = await Promise.all([
      import('../data/paints/sherwinWilliams.js'),
      import('../data/paints/benjaminMoore.js'),
    ]);
    swData = sw.SW_COLORS;
    bmData = bm.BM_COLORS;
    swLab = precomputeLab(swData);
    bmLab = precomputeLab(bmData);
  }
  return { sw: swLab, bm: bmLab };
}

export function findNearestPaints(hex, brandLab, count = 2) {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const targetLab = rgbToLab(rgb.r, rgb.g, rgb.b);

  // Linear scan — fast enough for ~2000 colors (<1ms)
  const results = [];
  for (let i = 0; i < brandLab.length; i++) {
    const dist = deltaE(targetLab, brandLab[i].lab);
    if (results.length < count) {
      results.push({ ...brandLab[i], deltaE: dist });
      results.sort((a, b) => a.deltaE - b.deltaE);
    } else if (dist < results[results.length - 1].deltaE) {
      results[results.length - 1] = { ...brandLab[i], deltaE: dist };
      results.sort((a, b) => a.deltaE - b.deltaE);
    }
  }
  return results;
}

export function getMatchQuality(dE) {
  if (dE < 1) return { label: 'Exact', color: 'text-emerald-600' };
  if (dE < 3) return { label: 'Excellent', color: 'text-emerald-500' };
  if (dE < 6) return { label: 'Close', color: 'text-amber-500' };
  if (dE < 10) return { label: 'Approximate', color: 'text-orange-500' };
  return { label: 'Distant', color: 'text-gray-400' };
}
