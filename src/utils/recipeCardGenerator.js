/**
 * Generate shareable Instagram-story-sized (1080×1920) recipe card PNG
 * using the native Canvas API.
 */
import { loadPaintData, findNearestPaints } from './paintMatcher';
import { getTextColor } from './colorUtils';
import { DESIGN_STYLES, FINISH_GUIDE } from '../data/constants';
import { getSmartBird } from './paletteHelpers';

const W = 1080;
const H = 1920;
const PAD = 72;

async function ensureFonts() {
  await Promise.all([
    document.fonts.load('700 64px "DM Serif Display"'),
    document.fonts.load('400 28px "Inter"'),
    document.fonts.load('600 28px "Inter"'),
    document.fonts.load('700 22px "Inter"'),
  ]);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function generateRecipeCard(originalBird) {
  const bird = getSmartBird(originalBird);
  await ensureFonts();

  const { sw } = await loadPaintData();

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#FAFAF8';
  ctx.fillRect(0, 0, W, H);

  // Top accent bar — dominant color
  const dominant = bird.colors.find(c => c.role === 'dominant') || bird.colors[0];
  ctx.fillStyle = dominant.hex;
  ctx.fillRect(0, 0, W, 8);

  let y = PAD + 20;

  // Bird name
  ctx.fillStyle = '#1A1A1A';
  ctx.font = '700 64px "DM Serif Display"';
  ctx.fillText(bird.name, PAD, y + 64);
  y += 80;

  // Scientific name
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 24px "Inter"';
  ctx.fillText(bird.scientific, PAD, y + 24);
  y += 52;

  // Palette strip
  const stripH = 80;
  const stripW = W - PAD * 2;
  const colorW = stripW / bird.colors.length;
  roundRect(ctx, PAD, y, stripW, stripH, 16);
  ctx.save();
  ctx.clip();
  bird.colors.forEach((c, i) => {
    ctx.fillStyle = c.hex;
    ctx.fillRect(PAD + i * colorW, y, colorW + 1, stripH);
  });
  ctx.restore();
  y += stripH + 40;

  // Color rows
  for (const color of bird.colors) {
    const swMatch = findNearestPaints(color.hex, sw, 1)[0];
    const finish = FINISH_GUIDE[color.role]?.finish || 'Eggshell';

    // Swatch
    roundRect(ctx, PAD, y, 56, 56, 12);
    ctx.fillStyle = color.hex;
    ctx.fill();

    // Color name
    ctx.fillStyle = '#374151';
    ctx.font = '600 28px "Inter"';
    ctx.fillText(color.name, PAD + 76, y + 22);

    // Hex + finish
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '400 22px "Inter"';
    ctx.fillText(`${color.hex}  ·  ${finish}`, PAD + 76, y + 48);

    // SW code on right
    if (swMatch) {
      ctx.fillStyle = '#6B7280';
      ctx.font = '600 22px "Inter"';
      const swText = swMatch.code;
      const swWidth = ctx.measureText(swText).width;
      ctx.fillText(swText, W - PAD - swWidth, y + 22);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '400 20px "Inter"';
      const nameWidth = ctx.measureText(swMatch.name).width;
      const maxNameW = 260;
      const displayName = nameWidth > maxNameW
        ? swMatch.name.substring(0, Math.floor(swMatch.name.length * maxNameW / nameWidth)) + '...'
        : swMatch.name;
      const dnw = ctx.measureText(displayName).width;
      ctx.fillText(displayName, W - PAD - dnw, y + 48);
    }

    y += 76;
  }

  y += 16;

  // Divider
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(PAD, y, W - PAD * 2, 1);
  y += 28;

  // Neutrals
  ctx.fillStyle = '#6B7280';
  ctx.font = '700 22px "Inter"';
  ctx.fillText('COORDINATING NEUTRALS', PAD, y + 22);
  y += 44;

  const neutrals = [
    { ...bird.neutrals.trim, label: 'Trim' },
    { ...bird.neutrals.ceiling, label: 'Ceiling' },
    { ...bird.neutrals.floor, label: 'Floor' },
  ];
  neutrals.forEach((n) => {
    roundRect(ctx, PAD, y, 40, 40, 8);
    ctx.fillStyle = n.hex;
    ctx.fill();

    ctx.fillStyle = '#374151';
    ctx.font = '600 24px "Inter"';
    ctx.fillText(`${n.label}: ${n.name}`, PAD + 56, y + 17);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '400 20px "Inter"';
    ctx.fillText(n.hex, PAD + 56, y + 38);

    y += 56;
  });

  y += 16;

  // Divider
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(PAD, y, W - PAD * 2, 1);
  y += 28;

  // Styles
  ctx.fillStyle = '#6B7280';
  ctx.font = '700 22px "Inter"';
  ctx.fillText('DESIGN STYLES', PAD, y + 22);
  y += 40;

  const styleLabels = bird.styles
    .map(s => DESIGN_STYLES.find(ds => ds.id === s)?.label)
    .filter(Boolean);
  ctx.fillStyle = '#374151';
  ctx.font = '400 24px "Inter"';
  ctx.fillText(styleLabels.join('  ·  '), PAD, y + 24);
  y += 44;

  // Harmony
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 22px "Inter"';
  ctx.fillText(`${bird.harmony.type} harmony  ·  ${bird.season?.replace('-', '/')}`, PAD, y + 22);

  // Watermark at bottom
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '400 20px "Inter"';
  const wm = 'Made with Ploom  ·  ploom.app';
  const wmW = ctx.measureText(wm).width;
  ctx.fillText(wm, (W - wmW) / 2, H - 48);

  // Bottom accent bar
  ctx.fillStyle = dominant.hex;
  ctx.fillRect(0, H - 8, W, 8);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
