/**
 * Generate contractor-ready spec sheet (2480×3508 px, A4 at 300 DPI)
 * with all paint codes, finishes, neutrals, material pairings, and room ratings.
 */
import { loadPaintData, findNearestPaints } from './paintMatcher';
import { getTextColor } from './colorUtils';
import { DESIGN_STYLES, FINISH_GUIDE } from '../data/constants';
import { getMaterialSuggestions } from '../data/materials';
import { getSmartBird } from './paletteHelpers';

const W = 2480;
const H = 3508;
const PAD = 120;
const COL_W = W - PAD * 2;

async function ensureFonts() {
  await Promise.all([
    document.fonts.load('700 72px "DM Serif Display"'),
    document.fonts.load('400 32px "Inter"'),
    document.fonts.load('600 32px "Inter"'),
    document.fonts.load('700 28px "Inter"'),
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

function drawStars(ctx, x, y, rating, size = 28) {
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i < rating ? '#F59E0B' : '#E5E7EB';
    const cx = x + i * (size + 4) + size / 2;
    const cy = y + size / 2;
    const r = size / 2;
    // 5-point star
    ctx.beginPath();
    for (let j = 0; j < 5; j++) {
      const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}

export async function generateSpecSheet(originalBird) {
  const bird = getSmartBird(originalBird);
  await ensureFonts();

  const { sw, bm } = await loadPaintData();
  const materials = getMaterialSuggestions(bird);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Top accent bar
  const dominant = bird.colors.find(c => c.role === 'dominant') || bird.colors[0];
  ctx.fillStyle = dominant.hex;
  ctx.fillRect(0, 0, W, 12);

  let y = PAD;

  // === HEADER ===
  ctx.fillStyle = '#1A1A1A';
  ctx.font = '700 72px "DM Serif Display"';
  ctx.fillText(bird.name, PAD, y + 72);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 28px "Inter"';
  const headerRight = `${bird.harmony.type} harmony  ·  ${bird.season?.replace('-', '/')}`;
  const hrW = ctx.measureText(headerRight).width;
  ctx.fillText(headerRight, W - PAD - hrW, y + 72);

  y += 96;
  ctx.fillStyle = '#6B7280';
  ctx.font = '400 28px "Inter"';
  ctx.fillText(bird.scientific, PAD, y + 28);
  y += 48;

  // Palette strip
  const stripH = 80;
  roundRect(ctx, PAD, y, COL_W, stripH, 16);
  ctx.save();
  ctx.clip();
  const cw = COL_W / bird.colors.length;
  bird.colors.forEach((c, i) => {
    ctx.fillStyle = c.hex;
    ctx.fillRect(PAD + i * cw, y, cw + 1, stripH);
  });
  ctx.restore();
  y += stripH + 48;

  // === COLOR SPEC TABLE ===
  ctx.fillStyle = '#374151';
  ctx.font = '700 28px "Inter"';
  ctx.fillText('COLOR SPECIFICATIONS', PAD, y + 28);
  y += 52;

  // Table header
  ctx.fillStyle = '#F3F4F6';
  ctx.fillRect(PAD, y, COL_W, 44);
  ctx.fillStyle = '#6B7280';
  ctx.font = '700 22px "Inter"';
  const headers = ['SWATCH', 'COLOR', 'ROLE', 'FINISH', 'SHERWIN-WILLIAMS', 'BENJAMIN MOORE'];
  const colXs = [PAD + 12, PAD + 80, PAD + 400, PAD + 600, PAD + 900, PAD + 1400];
  headers.forEach((h, i) => ctx.fillText(h, colXs[i], y + 30));
  y += 52;

  for (const color of bird.colors) {
    const swMatch = findNearestPaints(color.hex, sw, 1)[0];
    const bmMatch = findNearestPaints(color.hex, bm, 1)[0];
    const finish = FINISH_GUIDE[color.role]?.finish || 'Eggshell';
    const roleLabel = color.role.charAt(0).toUpperCase() + color.role.slice(1);

    // Swatch
    roundRect(ctx, colXs[0], y + 4, 48, 48, 8);
    ctx.fillStyle = color.hex;
    ctx.fill();

    // Color name + hex
    ctx.fillStyle = '#374151';
    ctx.font = '600 26px "Inter"';
    ctx.fillText(color.name, colXs[1], y + 24);
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '400 22px "Inter"';
    ctx.fillText(color.hex, colXs[1], y + 48);

    // Role
    ctx.fillStyle = '#6B7280';
    ctx.font = '400 24px "Inter"';
    ctx.fillText(roleLabel, colXs[2], y + 32);

    // Finish
    ctx.fillText(finish, colXs[3], y + 32);

    // SW
    if (swMatch) {
      ctx.fillStyle = '#374151';
      ctx.font = '600 24px "Inter"';
      ctx.fillText(swMatch.code, colXs[4], y + 24);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '400 20px "Inter"';
      ctx.fillText(swMatch.name.substring(0, 28), colXs[4], y + 48);
    }

    // BM
    if (bmMatch) {
      ctx.fillStyle = '#374151';
      ctx.font = '600 24px "Inter"';
      ctx.fillText(bmMatch.code, colXs[5], y + 24);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '400 20px "Inter"';
      ctx.fillText(bmMatch.name.substring(0, 28), colXs[5], y + 48);
    }

    // Row border
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(PAD, y + 60, COL_W, 1);
    y += 68;
  }

  y += 32;

  // === NEUTRALS ===
  ctx.fillStyle = '#374151';
  ctx.font = '700 28px "Inter"';
  ctx.fillText('COORDINATING NEUTRALS', PAD, y + 28);
  y += 52;

  const neutrals = [
    { ...bird.neutrals.trim, label: 'Trim' },
    { ...bird.neutrals.ceiling, label: 'Ceiling' },
    { ...bird.neutrals.floor, label: 'Floor' },
  ];

  neutrals.forEach((n) => {
    const nSwMatch = findNearestPaints(n.hex, sw, 1)[0];
    const nBmMatch = findNearestPaints(n.hex, bm, 1)[0];

    roundRect(ctx, PAD, y, 44, 44, 8);
    ctx.fillStyle = n.hex;
    ctx.fill();

    ctx.fillStyle = '#374151';
    ctx.font = '600 26px "Inter"';
    ctx.fillText(`${n.label}: ${n.name}`, PAD + 60, y + 20);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '400 22px "Inter"';
    const codes = [
      n.hex,
      nSwMatch ? `SW: ${nSwMatch.code}` : '',
      nBmMatch ? `BM: ${nBmMatch.code}` : '',
    ].filter(Boolean).join('  ·  ');
    ctx.fillText(codes, PAD + 60, y + 42);

    y += 60;
  });

  y += 32;

  // === MATERIAL PAIRINGS ===
  ctx.fillStyle = '#374151';
  ctx.font = '700 28px "Inter"';
  ctx.fillText('MATERIAL PAIRINGS', PAD, y + 28);

  const styleLabel = DESIGN_STYLES.find(s => s.id === materials.style)?.label || materials.style;
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 22px "Inter"';
  const mlText = `${styleLabel}  ·  ${materials.undertone} undertone`;
  const mlW = ctx.measureText(mlText).width;
  ctx.fillText(mlText, W - PAD - mlW, y + 28);
  y += 56;

  const matCats = [
    { label: 'Flooring', items: materials.flooring },
    { label: 'Hardware & Metals', items: materials.hardware },
    { label: 'Stone & Counters', items: materials.stone },
    { label: 'Textiles', items: materials.textiles },
  ];

  // 2 columns
  const halfW = (COL_W - 24) / 2;
  matCats.forEach((cat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = PAD + col * (halfW + 24);
    const by = y + row * 80;

    ctx.fillStyle = '#374151';
    ctx.font = '600 24px "Inter"';
    ctx.fillText(cat.label, bx, by + 24);

    ctx.fillStyle = '#6B7280';
    ctx.font = '400 22px "Inter"';
    ctx.fillText(cat.items.join('  ·  '), bx, by + 52);
  });
  y += 176;

  // === ROOM RATINGS ===
  ctx.fillStyle = '#374151';
  ctx.font = '700 28px "Inter"';
  ctx.fillText('ROOM RATINGS', PAD, y + 28);
  y += 56;

  const sortedRooms = [...bird.rooms].sort((a, b) => b.rating - a.rating);
  sortedRooms.forEach((room) => {
    ctx.fillStyle = '#374151';
    ctx.font = '600 24px "Inter"';
    ctx.fillText(room.room, PAD, y + 24);

    // Stars
    drawStars(ctx, PAD + 240, y + 2, room.rating, 24);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '400 20px "Inter"';
    const reason = room.reason.length > 80 ? room.reason.substring(0, 77) + '...' : room.reason;
    ctx.fillText(reason, PAD + 420, y + 24);

    y += 44;
  });

  y += 32;

  // === FOOTER ===
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(PAD, y, COL_W, 1);
  y += 24;

  ctx.fillStyle = '#D1D5DB';
  ctx.font = '400 22px "Inter"';
  const footer = `Generated by Ploom  ·  ${bird.name} Paint Specification  ·  ${new Date().toLocaleDateString()}`;
  ctx.fillText(footer, PAD, y + 22);

  // Bottom accent bar
  ctx.fillStyle = dominant.hex;
  ctx.fillRect(0, H - 12, W, 12);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
