#!/usr/bin/env node
// Generates birds.js from raw-bird-colors.js data
// Analyzes color properties to algorithmically assign interior design metadata

import { rawBirdColors, birdNameMap } from '../src/data/raw-bird-colors.js';

// ── Color analysis utilities ──────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function analyzeColor(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const isWarm = (hsl.h >= 0 && hsl.h <= 60) || hsl.h >= 300;
  const isCool = hsl.h >= 150 && hsl.h <= 270;
  const isNeutral = hsl.s < 15;
  const isLight = hsl.l > 70;
  const isDark = hsl.l < 25;
  const isMuted = hsl.s < 40 && hsl.l > 25 && hsl.l < 70;
  const isVivid = hsl.s > 60;
  return { hex, rgb, hsl, isWarm, isCool, isNeutral, isLight, isDark, isMuted, isVivid };
}

// ── Color naming ──────────────────────────────────────────────────
function getHueName(h) {
  if (h < 15) return 'Red';
  if (h < 30) return 'Vermilion';
  if (h < 45) return 'Orange';
  if (h < 60) return 'Amber';
  if (h < 75) return 'Gold';
  if (h < 90) return 'Yellow';
  if (h < 110) return 'Chartreuse';
  if (h < 140) return 'Green';
  if (h < 170) return 'Teal';
  if (h < 195) return 'Cyan';
  if (h < 220) return 'Azure';
  if (h < 250) return 'Blue';
  if (h < 275) return 'Indigo';
  if (h < 300) return 'Violet';
  if (h < 330) return 'Magenta';
  return 'Rose';
}

function getLightnessPrefix(l) {
  if (l < 15) return 'Deep';
  if (l < 25) return 'Dark';
  if (l < 40) return 'Rich';
  if (l < 55) return '';
  if (l < 70) return 'Soft';
  if (l < 82) return 'Light';
  if (l < 92) return 'Pale';
  return 'Whisper';
}

function getSaturationMod(s, l) {
  if (s < 8) {
    if (l < 20) return 'Charcoal';
    if (l < 40) return 'Slate';
    if (l < 55) return 'Ash';
    if (l < 70) return 'Stone';
    if (l < 85) return 'Mist';
    return 'Frost';
  }
  if (s < 20) return 'Dusty';
  if (s < 35) return 'Muted';
  return '';
}

function generateColorName(hex, birdName, role, index) {
  const a = analyzeColor(hex);
  const { h, s, l } = a.hsl;

  // Special names for very dark or very light
  if (l < 10) return `${birdName.split(' ')[0]} Night`;
  if (l > 92 && s < 10) return `${birdName.split(' ')[0]} White`;

  // Neutral colors
  if (s < 8) {
    const neutralName = getSaturationMod(s, l);
    const birdWord = birdName.split(' ')[0];
    const suffixes = ['', ' Wash', ' Tone', ' Ground'];
    return `${birdWord} ${neutralName}${suffixes[index % suffixes.length]}`.trim();
  }

  const prefix = getLightnessPrefix(l);
  const hueName = getHueName(h);
  const satMod = s < 35 && s >= 8 ? 'Muted ' : '';
  const birdWord = birdName.split(' ')[0];

  return `${birdWord} ${prefix} ${satMod}${hueName}`.replace(/\s+/g, ' ').trim();
}

// ── Role assignment ──────────────────────────────────────────────
function assignRoles(colors, analyzed) {
  // Sort by percentage descending
  const sorted = colors.map((c, i) => ({ ...c, idx: i, a: analyzed[i] }))
    .sort((a, b) => b.pct - a.pct);

  const roles = new Array(colors.length).fill('accent');

  // Find the best neutral (lightest, least saturated)
  const neutralCandidate = sorted.find(c => c.a.isLight && c.a.hsl.s < 20);
  if (neutralCandidate) roles[neutralCandidate.idx] = 'neutral';

  // Dominant: highest percentage non-neutral color
  const dominantCandidate = sorted.find(c => roles[c.idx] !== 'neutral');
  if (dominantCandidate) roles[dominantCandidate.idx] = 'dominant';

  // Secondary: second highest non-neutral, non-dominant
  const secondaryCandidate = sorted.find(c => roles[c.idx] === 'accent' && c.idx !== dominantCandidate?.idx);
  if (secondaryCandidate) roles[secondaryCandidate.idx] = 'secondary';

  // Highlight: most saturated remaining color
  const remaining = sorted.filter(c => roles[c.idx] === 'accent');
  if (remaining.length > 0) {
    const mostSaturated = remaining.sort((a, b) => b.a.hsl.s - a.a.hsl.s)[0];
    roles[mostSaturated.idx] = 'highlight';
  }

  return roles;
}

// ── Finish assignment ──────────────────────────────────────────────
function getFinish(role) {
  switch (role) {
    case 'dominant': return 'Eggshell';
    case 'secondary': return 'Satin';
    case 'accent': return 'Semi-Gloss';
    case 'highlight': return 'Semi-Gloss';
    case 'neutral': return 'Semi-Gloss';
    default: return 'Eggshell';
  }
}

// ── Application text ──────────────────────────────────────────────
function getApplication(role, a) {
  const apps = {
    dominant: [
      'Primary wall color for a cohesive room envelope',
      'All four walls for a grounding, immersive effect',
      'Main wall color in living or bedroom spaces',
    ],
    secondary: [
      'Upholstered sofa, curtains, or a large area rug',
      'Linen drapery, woven throw blankets, or side chairs',
      'A sectional sofa, Roman shades, or a textured rug',
    ],
    accent: [
      'Statement throw pillows, ceramic vases, or artwork',
      'A painted accent chair, decorative objects, or lampshade',
      'Decorative ceramics, a patterned pillow, or art frames',
    ],
    highlight: [
      'Interior doors, a painted bookshelf, or fireplace surround',
      'A lacquered side table, painted cabinet, or stair risers',
      'A feature wall, painted vanity, or built-in shelving',
    ],
    neutral: [
      'Trim, ceiling, baseboards, and window casings',
      'Crown molding, wainscoting, and cabinetry',
      'Clean trim and ceiling to let bold colors breathe',
    ],
  };
  const options = apps[role] || apps.accent;
  return options[Math.floor(Math.random() * options.length)];
}

// ── Lighting note ──────────────────────────────────────────────
function getLightingNote(a) {
  const { h, s, l } = a.hsl;
  if (s < 10) {
    if (l < 30) return 'A sophisticated dark neutral that anchors the palette in any light';
    if (l > 80) return 'A clean near-white that feels warm under incandescent and crisp under daylight';
    return 'A versatile neutral that shifts subtly between warm and cool depending on light source';
  }
  if (a.isWarm) {
    if (l < 35) return 'Deep and enveloping; reveals warm undertones in bright light';
    if (s > 60) return 'Vivid and energetic under daylight; softens to a warm glow under incandescent';
    return 'Warm and inviting in all lighting; gains richness under incandescent bulbs';
  }
  if (a.isCool) {
    if (l < 35) return 'A dramatic dark tone that reads richer under warm bulbs';
    if (s > 60) return 'Reads true in daylight; takes on a softer cast under warm light';
    return 'A calming tone that brightens in natural light and deepens in evening settings';
  }
  return 'A balanced mid-tone that adapts gracefully to both warm and cool light sources';
}

// ── Harmony detection ──────────────────────────────────────────────
function detectHarmony(analyzed) {
  const chromatic = analyzed.filter(a => a.hsl.s > 15);
  if (chromatic.length < 2) return { type: 'monochromatic', explanation: 'A single dominant hue creates a focused, unified palette with depth through tonal variation.' };

  const hues = chromatic.map(a => a.hsl.h);
  const hueSpread = Math.max(...hues) - Math.min(...hues);

  // Check for complementary (opposite hues ~180 apart)
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = Math.abs(hues[i] - hues[j]);
      const adjustedDiff = diff > 180 ? 360 - diff : diff;
      if (adjustedDiff > 150 && adjustedDiff < 210) {
        return { type: 'complementary', explanation: 'Opposite colors on the wheel create vibrant, energetic contrast — balanced by shared neutrals for livability.' };
      }
    }
  }

  // Check for triadic (three hues ~120 apart)
  if (chromatic.length >= 3) {
    const sorted = [...hues].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 2; i++) {
      const d1 = sorted[i + 1] - sorted[i];
      const d2 = sorted[i + 2] - sorted[i + 1];
      if (d1 > 80 && d1 < 160 && d2 > 80 && d2 < 160) {
        return { type: 'triadic', explanation: 'Three equidistant hues on the color wheel create a richly balanced palette with natural variety.' };
      }
    }
  }

  // Check for split-complementary
  if (hueSpread > 120 && hueSpread < 240) {
    return { type: 'split-complementary', explanation: 'A base hue paired with two colors adjacent to its complement — offering contrast with more nuance than direct complements.' };
  }

  // Check for analogous (hues within 60 degrees)
  if (hueSpread < 90 || (360 - hueSpread) < 90) {
    return { type: 'analogous', explanation: 'Neighboring hues create a serene, cohesive palette that flows naturally — unified yet subtly varied.' };
  }

  return { type: 'analogous', explanation: 'A palette of harmonious, related tones that creates visual cohesion with gentle variation.' };
}

// ── Neutrals generation ──────────────────────────────────────────────
function generateNeutrals(analyzed, birdName) {
  // Find warmest light color for trim
  const lightColors = analyzed.filter(a => a.hsl.l > 80);
  const warmLight = lightColors.length > 0
    ? lightColors.sort((a, b) => a.hsl.s - b.hsl.s)[0]
    : { hsl: { h: 30, s: 5, l: 93 } };

  // Derive trim from lightest palette color
  const trimL = Math.min(95, Math.max(90, warmLight.hsl.l + 5));
  const trimH = warmLight.hsl.h || 30;
  const trimS = Math.min(8, warmLight.hsl.s);

  // Ceiling: even lighter
  const ceilL = Math.min(97, trimL + 3);

  // Floor: warm mid-dark
  const warmDark = analyzed.filter(a => a.hsl.l > 25 && a.hsl.l < 55 && a.hsl.s < 40);
  const floorColor = warmDark.length > 0
    ? warmDark.sort((a, b) => b.hsl.l - a.hsl.l)[0]
    : { hsl: { h: 30, s: 15, l: 40 } };

  const firstName = birdName.split(' ')[0];

  return {
    trim: { hex: hslToHex(trimH, trimS, trimL), name: `${firstName} White` },
    ceiling: { hex: hslToHex(trimH, Math.max(2, trimS - 2), ceilL), name: `${firstName} Ceiling` },
    floor: { hex: hslToHex(floorColor.hsl.h, Math.min(25, floorColor.hsl.s + 5), Math.max(35, Math.min(50, floorColor.hsl.l))), name: `${firstName} Floor` },
  };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// ── Room scoring ──────────────────────────────────────────────
function scoreRooms(analyzed) {
  const avgSat = analyzed.reduce((s, a) => s + a.hsl.s, 0) / analyzed.length;
  const avgLight = analyzed.reduce((s, a) => s + a.hsl.l, 0) / analyzed.length;
  const warmCount = analyzed.filter(a => a.isWarm).length;
  const coolCount = analyzed.filter(a => a.isCool).length;
  const vividCount = analyzed.filter(a => a.isVivid).length;
  const isCalm = avgSat < 35 && vividCount === 0;
  const isBold = avgSat > 50 || vividCount >= 2;
  const isWarmPalette = warmCount > coolCount;

  const rooms = [
    {
      room: 'Bedroom',
      rating: isCalm ? 5 : avgSat < 45 ? 4 : isBold ? 2 : 3,
      reason: isCalm ? 'Gentle, muted tones create a restful retreat perfect for sleep.'
        : avgSat < 45 ? 'Soft enough for a calming bedroom when paired with warm textiles.'
        : isBold ? 'Bold palette works best as a feature wall rather than a full room bedroom.'
        : 'A versatile palette that works in bedrooms with the right balance of warm accents.',
    },
    {
      room: 'Living Room',
      rating: isBold ? 4 : isCalm ? 3 : avgSat > 30 ? 5 : 3,
      reason: isBold ? 'The vivid accents make a stunning living room statement with confident personality.'
        : isCalm ? 'A serene living space; add warm textures to prevent it from feeling too quiet.'
        : avgSat > 30 ? 'A well-balanced palette that creates an inviting, layered living room.'
        : 'Subtle and sophisticated for a living room that values restraint.',
    },
    {
      room: 'Dining Room',
      rating: isWarmPalette && avgSat > 30 ? 5 : isWarmPalette ? 4 : isBold ? 4 : 2,
      reason: isWarmPalette && avgSat > 30 ? 'Warm, rich tones create an inviting dining atmosphere that stimulates appetite and conversation.'
        : isWarmPalette ? 'Warm undertones work well for dining; the palette sets a welcoming table.'
        : isBold ? 'Bold colors create dramatic dining energy — ideal for entertaining.'
        : 'Cool tones can feel formal in dining spaces; best warmed with wood and candlelight.',
    },
    {
      room: 'Kitchen',
      rating: avgLight > 55 ? 4 : isWarmPalette ? 3 : avgSat < 30 ? 3 : 2,
      reason: avgLight > 55 ? 'Light, airy tones keep a kitchen feeling fresh and open.'
        : isWarmPalette ? 'Warm palette works on kitchen cabinetry or an island; pair with brass hardware.'
        : avgSat < 30 ? 'Clean and understated for a modern kitchen approach.'
        : 'Strong colors work best on a kitchen island or accent wall rather than full cabinetry.',
    },
    {
      room: 'Bathroom',
      rating: isCalm ? 5 : coolCount > warmCount ? 4 : avgSat > 50 ? 3 : 3,
      reason: isCalm ? 'The muted palette creates an instant spa atmosphere with natural serenity.'
        : coolCount > warmCount ? 'Cool tones feel naturally at home in bathrooms; pair with white fixtures.'
        : avgSat > 50 ? 'Bold enough for a dramatic powder room statement.'
        : 'A versatile bathroom palette; pair with natural stone and warm metals.',
    },
  ];

  return rooms;
}

// ── Style assignment ──────────────────────────────────────────────
const ALL_STYLES = ['coastal','scandinavian','contemporary','traditional','farmhouse','mid-century','bohemian','tropical','eclectic','minimalist','industrial','art-deco','japandi','mediterranean'];

function assignStyles(analyzed) {
  const avgSat = analyzed.reduce((s, a) => s + a.hsl.s, 0) / analyzed.length;
  const avgLight = analyzed.reduce((s, a) => s + a.hsl.l, 0) / analyzed.length;
  const warmCount = analyzed.filter(a => a.isWarm).length;
  const coolCount = analyzed.filter(a => a.isCool).length;
  const vividCount = analyzed.filter(a => a.isVivid).length;
  const earthyCount = analyzed.filter(a => a.hsl.h > 15 && a.hsl.h < 50 && a.hsl.s < 50).length;
  const blueCount = analyzed.filter(a => a.hsl.h > 180 && a.hsl.h < 260).length;
  const greenCount = analyzed.filter(a => a.hsl.h > 80 && a.hsl.h < 170).length;

  const styles = [];

  if (avgSat < 25 && avgLight > 60) styles.push('scandinavian', 'minimalist');
  else if (avgSat < 30 && avgLight < 45) styles.push('industrial', 'contemporary');

  if (blueCount >= 2 && avgLight > 50) styles.push('coastal');
  if (warmCount > coolCount && earthyCount >= 2) styles.push('farmhouse', 'traditional');
  if (vividCount >= 3) styles.push('bohemian', 'eclectic');
  if (vividCount >= 2 && greenCount >= 1) styles.push('tropical');
  if (avgSat > 50 && vividCount >= 1) styles.push('art-deco');
  if (greenCount >= 2 && avgSat < 50) styles.push('japandi');
  if (warmCount > 0 && earthyCount >= 1 && avgSat > 30) styles.push('mediterranean');
  if (avgSat > 25 && avgSat < 55) styles.push('mid-century');
  if (styles.length === 0) styles.push('contemporary');

  // Deduplicate and limit to 3
  return [...new Set(styles)].slice(0, 3);
}

// ── Season assignment ──────────────────────────────────────────────
function assignSeason(analyzed) {
  const avgSat = analyzed.reduce((s, a) => s + a.hsl.s, 0) / analyzed.length;
  const avgLight = analyzed.reduce((s, a) => s + a.hsl.l, 0) / analyzed.length;
  const warmCount = analyzed.filter(a => a.isWarm).length;
  const coolCount = analyzed.filter(a => a.isCool).length;

  if (avgLight > 65 && coolCount > warmCount) return 'spring-summer';
  if (warmCount > coolCount && avgSat > 35) return 'fall-winter';
  if (avgSat < 25) return 'year-round';
  if (avgLight > 55) return 'spring-summer';
  if (avgLight < 40) return 'fall-winter';
  return 'year-round';
}

function getSeasonNote(season, analyzed) {
  const notes = {
    'spring-summer': 'Light, airy tones that feel fresh and energizing in warm-weather light.',
    'fall-winter': 'Rich, grounding colors that feel cozy and enveloping during cooler months.',
    'year-round': 'A balanced palette that adapts gracefully across all seasons.',
  };
  return notes[season] || notes['year-round'];
}

// ── Mood assignment ──────────────────────────────────────────────
function assignMoods(analyzed) {
  const avgSat = analyzed.reduce((s, a) => s + a.hsl.s, 0) / analyzed.length;
  const avgLight = analyzed.reduce((s, a) => s + a.hsl.l, 0) / analyzed.length;
  const vividCount = analyzed.filter(a => a.isVivid).length;
  const warmCount = analyzed.filter(a => a.isWarm).length;

  const moods = [];
  if (avgSat < 30) moods.push('calm');
  if (avgLight > 60) moods.push('fresh');
  if (warmCount > analyzed.length / 2 && avgSat > 25) moods.push('warm');
  if (vividCount >= 2) moods.push('bold');
  if (vividCount >= 3) moods.push('eclectic');
  if (avgSat > 20 && avgSat < 45 && avgLight > 40 && avgLight < 65) moods.push('balanced');

  if (moods.length === 0) moods.push('sophisticated');
  return [...new Set(moods)].slice(0, 2);
}

// ── Tagline generation ──────────────────────────────────────────────
function generateTagline(birdName, analyzed, harmony) {
  const sorted = [...analyzed].sort((a, b) => b.pct - a.pct);
  const chromatic = sorted.filter(a => a.hsl.s > 20);
  const avgSat = sorted.reduce((s, a) => s + a.hsl.s, 0) / sorted.length;
  const avgLight = sorted.reduce((s, a) => s + a.hsl.l, 0) / sorted.length;
  const warmCount = sorted.filter(a => a.isWarm).length;
  const coolCount = sorted.filter(a => a.isCool).length;
  const darkCount = sorted.filter(a => a.isDark).length;
  const lightCount = sorted.filter(a => a.isLight).length;
  const mutedCount = sorted.filter(a => a.isMuted).length;

  // Deterministic "random" based on bird name for template selection
  const nameHash = birdName.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const pick = (arr) => arr[Math.abs(nameHash) % arr.length];

  // Get distinct color names (avoid "vermilion and vermilion")
  const color1 = chromatic.length > 0 ? getHueName(chromatic[0].hsl.h).toLowerCase() : '';
  let color2 = '';
  if (chromatic.length > 1) {
    // Find the first chromatic color with a DIFFERENT hue name
    for (let i = 1; i < chromatic.length; i++) {
      const name = getHueName(chromatic[i].hsl.h).toLowerCase();
      if (name !== color1) { color2 = name; break; }
    }
  }
  const Color1 = color1.charAt(0).toUpperCase() + color1.slice(1);
  const hasTwoColors = color1 && color2;
  const harmonyType = harmony?.type || 'analogous';

  // ── Near-neutral / very low saturation palettes ──
  if (avgSat < 15) {
    return pick([
      `Whisper-soft neutrals drawn from the ${birdName}. Let the textures do the talking.`,
      `The ${birdName} proves color isn't everything — these quiet tones let materials and light shine.`,
      `A study in restraint. The ${birdName}'s muted plumage translates to serene, textural interiors.`,
      `Nearly colorless, entirely captivating. The ${birdName}'s palette is pure atmosphere.`,
    ]);
  }

  // ── Monochromatic / single chromatic color ──
  if (chromatic.length <= 1) {
    const tone = color1 || 'neutral';
    return pick([
      `One hue, many moods. The ${birdName}'s plumage unfolds in layered ${tone} tones.`,
      `A tonal study in ${tone}, distilled from the ${birdName}'s understated plumage.`,
      `The ${birdName} keeps it simple — a single ${tone} thread running through every shade.`,
      `All ${tone}, no filler. The ${birdName}'s focused palette creates rooms that feel immediately whole.`,
    ]);
  }

  // ── Single dominant color (two chromas share same hue name) ──
  if (!hasTwoColors) {
    return pick([
      `Layer upon layer of ${color1} — the ${birdName} builds depth from a single hue family.`,
      `The ${birdName} works the full ${color1} spectrum, from shadow to highlight.`,
      `${Color1} in every register. The ${birdName}'s palette is tonal richness made simple.`,
      `A masterclass in ${color1} — the ${birdName} shows how one hue can fill an entire room.`,
    ]);
  }

  // ── High saturation / vivid palettes ──
  if (avgSat > 55) {
    return pick([
      `Unapologetically vivid. The ${birdName} pairs ${color1} with ${color2} — and dares you to look away.`,
      `${Color1} meets ${color2} at full volume. This is the ${birdName}'s palette, and it doesn't whisper.`,
      `Bold ${color1} and ${color2} straight from the ${birdName}'s plumage — for rooms that make an entrance.`,
      `The ${birdName} brings the drama: saturated ${color1} and ${color2} that own any space.`,
    ]);
  }

  // ── Dark / moody palettes ──
  if (avgLight < 35 || darkCount >= 3) {
    return pick([
      `Moody ${color1} and deep ${color2} from the ${birdName}. Rooms that feel like a warm embrace.`,
      `The ${birdName}'s dark plumage yields a palette built for candlelight and quiet evenings.`,
      `Rich, enveloping tones of ${color1} and ${color2} — the ${birdName}'s gift to cozy interiors.`,
      `Deep ${color1} anchored by ${color2}. The ${birdName}'s palette wraps a room in warmth.`,
    ]);
  }

  // ── Light / airy palettes ──
  if (avgLight > 65 || lightCount >= 3) {
    return pick([
      `Breezy ${color1} and soft ${color2} — the ${birdName}'s palette fills a room with light.`,
      `The ${birdName}'s sun-washed plumage becomes airy ${color1} and gentle ${color2} for open spaces.`,
      `Light, lifted, livable. The ${birdName}'s ${color1}-and-${color2} palette breathes.`,
      `Pale ${color1} drifting into ${color2}. The ${birdName}'s palette is morning light in paint form.`,
    ]);
  }

  // ── Warm-dominant palettes ──
  if (warmCount > coolCount + 1) {
    return pick([
      `Warm ${color1} and ${color2} from the ${birdName} — a palette that makes every room feel like home.`,
      `The ${birdName} runs warm: ${color1} and ${color2} tones for spaces that radiate comfort.`,
      `Sun-soaked ${color1} paired with ${color2}. The ${birdName}'s palette is all golden-hour warmth.`,
      `${Color1} and ${color2}, both from the warm side of the wheel. The ${birdName} knows what cozy looks like.`,
    ]);
  }

  // ── Cool-dominant palettes ──
  if (coolCount > warmCount + 1) {
    return pick([
      `Cool ${color1} and ${color2} from the ${birdName} — for rooms that feel calm from the moment you walk in.`,
      `The ${birdName}'s palette runs cool: ${color1} and ${color2} that bring stillness to any space.`,
      `Collected and composed. The ${birdName} pairs ${color1} with ${color2} for effortless tranquility.`,
      `${Color1} and ${color2}, cool and considered. The ${birdName}'s palette is a deep breath.`,
    ]);
  }

  // ── Muted / soft palettes ──
  if (mutedCount >= 3) {
    return pick([
      `Softly spoken ${color1} and ${color2} — the ${birdName}'s palette doesn't shout, it invites.`,
      `The ${birdName} favors the middle ground: muted ${color1} and gentle ${color2} for lived-in spaces.`,
      `Neither loud nor quiet. The ${birdName}'s ${color1}-and-${color2} palette hits the sweet spot.`,
      `Dusty ${color1} meets faded ${color2}. The ${birdName}'s palette feels like it's always been there.`,
    ]);
  }

  // ── Complementary harmony ──
  if (harmonyType === 'complementary') {
    return pick([
      `${Color1} and ${color2} in perfect tension. The ${birdName} proves opposites attract.`,
      `A complementary clash of ${color1} and ${color2} — the ${birdName}'s palette is high contrast, high reward.`,
      `The ${birdName} plays ${color1} against ${color2} — opposites on the wheel, partners in a room.`,
    ]);
  }

  // ── Triadic harmony ──
  if (harmonyType === 'triadic') {
    return pick([
      `The ${birdName} balances ${color1} and ${color2} with the ease of a natural colorist.`,
      `Three-way color harmony from the ${birdName}: ${color1}, ${color2}, and everything in between.`,
      `A richly balanced mix anchored by ${color1} and ${color2}. The ${birdName}'s plumage does the math.`,
    ]);
  }

  // ── General / catch-all with variety ──
  return pick([
    `${Color1} grounded by ${color2}. The ${birdName}'s palette is ready for real rooms.`,
    `The ${birdName} brings ${color1} and ${color2} together — a pairing that just works.`,
    `From feather to finish: the ${birdName}'s ${color1}-and-${color2} palette, translated for interiors.`,
    `${Color1} leads, ${color2} follows. A natural rhythm borrowed from the ${birdName}.`,
    `What the ${birdName} wears, your room can wear. ${Color1} and ${color2}, balanced by nature.`,
    `The ${birdName} nails it: ${color1} and ${color2} in proportions that feel effortless.`,
  ]);
}

// ── Scientific names (lookup) ──────────────────────────────────────
const scientificNames = {
  'Killdeer': 'Charadrius vociferus',
  'American Avocet': 'Recurvirostra americana',
  'Ferruginous Hawk': 'Buteo regalis',
  'American Barn Owl': 'Tyto furcata',
  'Brant': 'Branta bernicla',
  'Western Screech-Owl': 'Megascops kennicottii',
  'Northern Pintail': 'Anas acuta',
  'Great Horned Owl': 'Bubo virginianus',
  'Brown Creeper': 'Certhia americana',
  'Barred Owl': 'Strix varia',
  'Northern Pygmy-Owl': 'Glaucidium gnoma',
  "Bewick's Wren": 'Thryomanes bewickii',
  'Wrentit': 'Chamaea fasciata',
  'Canada Goose': 'Branta canadensis',
  'Mourning Dove': 'Zenaida macroura',
  'Hermit Thrush': 'Catharus guttatus',
  'Dark-eyed Junco': 'Junco hyemalis',
  'Evening Grosbeak': 'Coccothraustes vespertinus',
  'Pink Robin': 'Petroica rodinogaster',
  'White-crowned Sparrow': 'Zonotrichia leucophrys',
  'Bull-headed Shrike': 'Lanius bucephalus',
  'Golden Eagle': 'Aquila chrysaetos',
  'Cinnamon Teal': 'Spatula cyanoptera',
  'Chestnut-backed Chickadee': 'Poecile rufescens',
  'Northern Jacana': 'Jacana spinosa',
  'Red Phalarope': 'Phalaropus fulicarius',
  'Eastern Bluebird': 'Sialia sialis',
  'Orchard Oriole': 'Icterus spurius',
  'Scarlet Tanager': 'Piranga olivacea',
  'Ruddy Duck': 'Oxyura jamaicensis',
  'Great Egret': 'Ardea alba',
  'Ruddy Turnstone': 'Arenaria interpres',
  'Canvasback': 'Aythya valisineria',
  'Wild Turkey': 'Meleagris gallopavo',
  'Peregrine Falcon': 'Falco peregrinus',
  'Green-winged Teal': 'Anas crecca',
  'Yellow-rumped Warbler': 'Setophaga coronata',
  'Golden-cheeked Warbler': 'Setophaga chrysoparia',
  "Townsend's Warbler": 'Setophaga townsendi',
  'Blackburnian Warbler': 'Setophaga fusca',
  'Eurasian Blue Tit': 'Cyanistes caeruleus',
  'Black-capped Vireo': 'Vireo atricapilla',
  'Western Kingbird': 'Tyrannus verticalis',
  'Western Meadowlark': 'Sturnella neglecta',
  "Wilson's Warbler": 'Cardellina pusilla',
  'Common Yellowthroat': 'Geothlypis trichas',
  'Lesser Goldfinch': 'Spinus psaltria',
  'Hooded Warbler': 'Setophaga citrina',
  'Red-bearded Bee-eater': 'Nyctyornis amictus',
  'Northern Flicker': 'Colaptes auratus',
  'Red-winged Blackbird': 'Agelaius phoeniceus',
  'Yellow-headed Blackbird': 'Xanthocephalus xanthocephalus',
  'Hooded Oriole': 'Icterus cucullatus',
  'American Goldfinch': 'Spinus tristis',
  'Western Tanager': 'Piranga ludoviciana',
  'Yellow Warbler': 'Setophaga petechia',
  'Saffron Finch': 'Sicalis flaveola',
  'Cedar Waxwing': 'Bombycilla cedrorum',
  "Bullock's Oriole": 'Icterus bullockii',
  'Baltimore Oriole': 'Icterus galbula',
  'Orange Dove': 'Ptilinopus victor',
  'Golden Pheasant': 'Chrysolophus pictus',
  'Northern Cardinal': 'Cardinalis cardinalis',
  'American Robin': 'Turdus migratorius',
  'California Towhee': 'Melozone crissalis',
  "Anna's Hummingbird": 'Calypte anna',
  'Red-shouldered Hawk': 'Buteo lineatus',
  'Varied Thrush': 'Ixoreus naevius',
  'European Robin': 'Erithacus rubecula',
  'Silverbird': 'Empidornis semipartitus',
  'American Kestrel': 'Falco sparverius',
  'Great Blue Heron': 'Ardea herodias',
  "Cooper's Hawk": 'Accipiter cooperii',
  'California Quail': 'Callipepla californica',
  'Mississippi Kite': 'Ictinia mississippiensis',
  "Heermann's Gull": 'Larus heermanni',
  'Ring-billed Gull': 'Larus delawarensis',
  'Ancient Murrelet': 'Synthliboramphus antiquus',
  'Whimbrel': 'Numenius phaeopus',
  'Blue-gray Gnatcatcher': 'Polioptila caerulea',
  'Piping Plover': 'Charadrius melodus',
  'Rose-breasted Grosbeak': 'Pheucticus ludovicianus',
  'Willet': 'Tringa semipalmata',
  'Mute Swan': 'Cygnus olor',
  'Caspian Tern': 'Hydroprogne caspia',
  'Eared Grebe': 'Podiceps nigricollis',
  'Snowy Egret': 'Egretta thula',
  'Snow Goose': 'Anser caerulescens',
  'White Ibis': 'Eudocimus albus',
  'American White Pelican': 'Pelecanus erythrorhynchos',
  'Western Gull': 'Larus occidentalis',
  'White-tailed Kite': 'Elanus leucurus',
  'Common Goldeneye': 'Bucephala clangula',
  'Black-crowned Night Heron': 'Nycticorax nycticorax',
  'Band-tailed Pigeon': 'Patagioenas fasciata',
  "Forster's Tern": 'Sterna forsteri',
  'King Penguin': 'Aptenodytes patagonicus',
  'Great Black-backed Gull': 'Larus marinus',
  'Horned Puffin': 'Fratercula corniculata',
  'Black Skimmer': 'Rynchops niger',
  'American Oystercatcher': 'Haematopus palliatus',
  'Bald Eagle': 'Haliaeetus leucocephalus',
  'Black Oystercatcher': 'Haematopus bachmani',
  'American Coot': 'Fulica americana',
  'Montezuma Oropendola': 'Psarocolius montezuma',
  'Double-crested Cormorant': 'Nannopterum auritum',
  'Turkey Vulture': 'Cathartes aura',
  'European Starling': 'Sturnus vulgaris',
  'House Finch': 'Haemorhous mexicanus',
  'American Flamingo': 'Phoenicopterus ruber',
  'Purple Finch': 'Haemorhous purpureus',
  'Roseate Spoonbill': 'Platalea ajaja',
  'Scarlet Ibis': 'Eudocimus ruber',
  'Crimson-collared Tanager': 'Ramphocelus sanguinolentus',
  'Red-headed Woodpecker': 'Melanerpes erythrocephalus',
  'Red-breasted Sapsucker': 'Sphyrapicus ruber',
  'Painted Redstart': 'Myioborus pictus',
  'American Crow': 'Corvus brachyrhynchos',
  "Nuttall's Woodpecker": 'Dryobates nuttallii',
  'Pileated Woodpecker': 'Dryocopus pileatus',
  'Purple Gallinule': 'Porphyrio martinica',
  'Laughing Gull': 'Leucophaeus atricilla',
  'Red-faced Warbler': 'Cardellina rubrifrons',
  'Black-necked Stilt': 'Himantopus mexicanus',
  'Common Raven': 'Corvus corax',
  'Scarlet Macaw': 'Ara macao',
  'Barn Swallow': 'Hirundo rustica',
  'Buff-breasted Paradise-Kingfisher': 'Tanysiptera sylvia',
  'Little Blue Heron': 'Egretta caerulea',
  'Belted Kingfisher': 'Megaceryle alcyon',
  'Blue Rock-Thrush': 'Monticola solitarius',
  'Common Blackbird': 'Turdus merula',
  'Southern Cassowary': 'Casuarius casuarius',
  'Phainopepla': 'Phainopepla nitens',
  'Black-billed Magpie': 'Pica hudsonia',
  'Purple Martin': 'Progne subis',
  'Black Paradise-Kingfisher': 'Tanysiptera nigriceps',
  'Bobolink': 'Dolichonyx oryzivorus',
  'Violet-backed Starling': 'Cinnyricinclus leucogaster',
  'Superb Starling': 'Lamprotornis superbus',
  'California Scrub Jay': 'Aphelocoma californica',
  "Steller's Jay": 'Cyanocitta stelleri',
  'Azure-winged Magpie': 'Cyanopica cyanus',
  'Florida Scrub Jay': 'Aphelocoma coerulescens',
  'Blue Jay': 'Cyanocitta cristata',
  'Blue Grosbeak': 'Passerina caerulea',
  'Western Bluebird': 'Sialia mexicana',
  'Satin Bowerbird': 'Ptilonorhynchus violaceus',
  'Indigo Bunting': 'Passerina cyanea',
  'Mountain Bluebird': 'Sialia currucoides',
  'Blue-gray Tanager': 'Thraupis episcopus',
  'Green Honeycreeper': 'Chlorophanes spiza',
  'Golden-hooded Tanager': 'Stilpnia larvata',
  'Lazuli Bunting': 'Passerina amoena',
  'Paradise Tanager': 'Tangara chilensis',
  'Lilac-breasted Roller': 'Coracias caudatus',
  'European Bee-eater': 'Merops apiaster',
  'Common Kingfisher': 'Alcedo atthis',
  'Dollarbird': 'Eurystomus orientalis',
  'South Papuan Pitta': 'Erythropitta macklotii',
  'Agami Heron': 'Agamia agami',
  'Green Heron': 'Butorides virescens',
  'Gartered Trogon': 'Trogon caligatus',
  'Pigeon Guillemot': 'Cepphus columba',
  'Painted Bunting': 'Passerina ciris',
  'Yellow-billed Magpie': 'Pica nuttalli',
  'Varied Green Sunbird': 'Cinnyris venustus',
  "Lesson's Motmot": 'Momotus lessonii',
  'Rainbow Bee-eater': 'Merops ornatus',
  'Gouldian Finch': 'Chloebia gouldiae',
  'Rainbow Lorikeet': 'Trichoglossus moluccanus',
  'Green Jay': 'Cyanocorax yncas',
  'Grass-green Tanager': 'Chlorornis riefferii',
  'Red-masked Parakeet': 'Psittacara erythrogenys',
  'Red-headed Barbet': 'Eubucco bourcierii',
  'Broad-billed Hummingbird': 'Cynanthus latirostris',
  "Lewis's Woodpecker": 'Melanerpes lewis',
  'Northern Shoveler': 'Spatula clypeata',
  'Mallard': 'Anas platyrhynchos',
  'Common Myna': 'Acridotheres tristis',
  'Ruby-crowned Kinglet': 'Corthylio calendula',
  'Pygmy Nuthatch': 'Sitta pygmaea',
  'Carolina Chickadee': 'Poecile carolinensis',
  'Bushtit': 'Psaltriparus minimus',
  'Oak Titmouse': 'Baeolophus inornatus',
  'Carolina Wren': 'Thryothorus ludovicianus',
  'Common Loon': 'Gavia immer',
  'Snowy Owl': 'Bubo scandiacus',
  'Loggerhead Shrike': 'Lanius ludovicianus',
  'Chimney Swift': 'Chaetura pelagica',
  'Pink-eared Duck': 'Malacorhynchus membranaceus',
  'Black Phoebe': 'Sayornis nigricans',
  'Black Vulture': 'Coragyps atratus',
  "Brewer's Blackbird": 'Euphagus cyanocephalus',
  'Narcissus Flycatcher': 'Ficedula narcissina',
};

// ── Main generation ──────────────────────────────────────────────
function generateBirds() {
  const entries = Object.entries(rawBirdColors);
  const birds = [];

  // Seed random for consistency
  let seed = 42;
  const seededRandom = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  // Override Math.random temporarily
  const origRandom = Math.random;
  Math.random = seededRandom;

  entries.forEach(([abbrev, colors], index) => {
    const meta = birdNameMap[abbrev];
    if (!meta) {
      console.warn(`No name mapping for: ${abbrev}`);
      return;
    }

    const baseName = meta.name;
    const sexLabel = meta.sex === 'male' ? ' (Male)' : meta.sex === 'female' ? ' (Female)' : '';
    const noteLabel = meta.note ? ` — ${meta.note}` : '';
    const displayName = `${baseName}${sexLabel}${noteLabel}`;

    // Analyze all colors
    const analyzed = colors.map(c => ({ ...analyzeColor(c.hex), pct: c.pct }));

    // Assign roles
    const roles = assignRoles(colors, analyzed);

    // Build color objects
    const colorObjects = colors.map((c, i) => ({
      hex: c.hex.toUpperCase(),
      name: generateColorName(c.hex, baseName, roles[i], i),
      role: roles[i],
      finish: getFinish(roles[i]),
      application: getApplication(roles[i], analyzed[i]),
      lightingNote: getLightingNote(analyzed[i]),
    }));

    // Detect harmony
    const harmony = detectHarmony(analyzed);

    // Generate neutrals
    const neutrals = generateNeutrals(analyzed, baseName);

    // Score rooms
    const rooms = scoreRooms(analyzed);

    // Assign styles
    const styles = assignStyles(analyzed);

    // Assign season
    const season = assignSeason(analyzed);
    const seasonNote = getSeasonNote(season, analyzed);

    // Assign moods
    const moods = assignMoods(analyzed);

    // Generate tagline
    const tagline = generateTagline(displayName, analyzed.sort((a, b) => b.pct - a.pct), harmony);

    // Scientific name
    const scientific = scientificNames[baseName] || 'Species data pending';

    birds.push({
      id: index + 1,
      name: displayName,
      scientific,
      description: `Color palette extracted from Christopher Reiger's Field Guide series, capturing the ${baseName}'s natural plumage colors as an interior design palette.`,
      status: 'Least Concern',
      conservation: `Part of Christopher Reiger's Field Guide art project documenting bird plumage as color studies.`,
      colors: colorObjects,
      harmony,
      neutrals,
      rooms,
      styles,
      season,
      seasonNote,
      tagline,
      moods,
    });
  });

  Math.random = origRandom;
  return birds;
}

// ── Output ──────────────────────────────────────────────────
const birds = generateBirds();

const output = `// Generated from Christopher Reiger's Field Guide series
// ${birds.length} bird palettes with interior design metadata
// Source: https://www.christopherreiger.art/field-guide

export const birds = ${JSON.stringify(birds, null, 2)};
`;

// Write to stdout
process.stdout.write(output);
console.error(`Generated ${birds.length} bird entries`);
