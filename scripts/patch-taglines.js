#!/usr/bin/env node
// Patches only the taglines in birds.js using improved generator logic
// Preserves all other data (nature objects, extra birds, etc.)

import { readFileSync, writeFileSync } from 'fs';

// ── Color utilities (copied from generate-birds.js) ──
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

function analyzeHex(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return {
    hex, hsl,
    isWarm: (hsl.h >= 0 && hsl.h <= 60) || hsl.h >= 300,
    isCool: hsl.h >= 150 && hsl.h <= 270,
    isLight: hsl.l > 70,
    isDark: hsl.l < 25,
    isMuted: hsl.s < 40 && hsl.l > 25 && hsl.l < 70,
    isVivid: hsl.s > 60,
  };
}

// ── New tagline generator ──
function generateTagline(birdName, analyzed, harmony) {
  const sorted = [...analyzed].sort((a, b) => (b.pct || 0) - (a.pct || 0));
  const chromatic = sorted.filter(a => a.hsl.s > 20);
  const avgSat = sorted.reduce((s, a) => s + a.hsl.s, 0) / sorted.length;
  const avgLight = sorted.reduce((s, a) => s + a.hsl.l, 0) / sorted.length;
  const warmCount = sorted.filter(a => a.isWarm).length;
  const coolCount = sorted.filter(a => a.isCool).length;
  const darkCount = sorted.filter(a => a.isDark).length;
  const lightCount = sorted.filter(a => a.isLight).length;
  const mutedCount = sorted.filter(a => a.isMuted).length;

  const nameHash = birdName.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const pick = (arr) => arr[Math.abs(nameHash) % arr.length];

  const color1 = chromatic.length > 0 ? getHueName(chromatic[0].hsl.h).toLowerCase() : '';
  let color2 = '';
  if (chromatic.length > 1) {
    for (let i = 1; i < chromatic.length; i++) {
      const name = getHueName(chromatic[i].hsl.h).toLowerCase();
      if (name !== color1) { color2 = name; break; }
    }
  }
  const Color1 = color1.charAt(0).toUpperCase() + color1.slice(1);
  const hasTwoColors = color1 && color2;
  const harmonyType = harmony || 'analogous';

  if (avgSat < 15) {
    return pick([
      `Whisper-soft neutrals drawn from the ${birdName}. Let the textures do the talking.`,
      `The ${birdName} proves color isn't everything — these quiet tones let materials and light shine.`,
      `A study in restraint. The ${birdName}'s muted plumage translates to serene, textural interiors.`,
      `Nearly colorless, entirely captivating. The ${birdName}'s palette is pure atmosphere.`,
    ]);
  }

  if (chromatic.length <= 1) {
    const tone = color1 || 'neutral';
    return pick([
      `One hue, many moods. The ${birdName}'s plumage unfolds in layered ${tone} tones.`,
      `A tonal study in ${tone}, distilled from the ${birdName}'s understated plumage.`,
      `The ${birdName} keeps it simple — a single ${tone} thread running through every shade.`,
      `All ${tone}, no filler. The ${birdName}'s focused palette creates rooms that feel immediately whole.`,
    ]);
  }

  if (!hasTwoColors) {
    return pick([
      `Layer upon layer of ${color1} — the ${birdName} builds depth from a single hue family.`,
      `The ${birdName} works the full ${color1} spectrum, from shadow to highlight.`,
      `${Color1} in every register. The ${birdName}'s palette is tonal richness made simple.`,
      `A masterclass in ${color1} — the ${birdName} shows how one hue can fill an entire room.`,
    ]);
  }

  if (avgSat > 55) {
    return pick([
      `Unapologetically vivid. The ${birdName} pairs ${color1} with ${color2} — and dares you to look away.`,
      `${Color1} meets ${color2} at full volume. This is the ${birdName}'s palette, and it doesn't whisper.`,
      `Bold ${color1} and ${color2} straight from the ${birdName}'s plumage — for rooms that make an entrance.`,
      `The ${birdName} brings the drama: saturated ${color1} and ${color2} that own any space.`,
    ]);
  }

  if (avgLight < 35 || darkCount >= 3) {
    return pick([
      `Moody ${color1} and deep ${color2} from the ${birdName}. Rooms that feel like a warm embrace.`,
      `The ${birdName}'s dark plumage yields a palette built for candlelight and quiet evenings.`,
      `Rich, enveloping tones of ${color1} and ${color2} — the ${birdName}'s gift to cozy interiors.`,
      `Deep ${color1} anchored by ${color2}. The ${birdName}'s palette wraps a room in warmth.`,
    ]);
  }

  if (avgLight > 65 || lightCount >= 3) {
    return pick([
      `Breezy ${color1} and soft ${color2} — the ${birdName}'s palette fills a room with light.`,
      `The ${birdName}'s sun-washed plumage becomes airy ${color1} and gentle ${color2} for open spaces.`,
      `Light, lifted, livable. The ${birdName}'s ${color1}-and-${color2} palette breathes.`,
      `Pale ${color1} drifting into ${color2}. The ${birdName}'s palette is morning light in paint form.`,
    ]);
  }

  if (warmCount > coolCount + 1) {
    return pick([
      `Warm ${color1} and ${color2} from the ${birdName} — a palette that makes every room feel like home.`,
      `The ${birdName} runs warm: ${color1} and ${color2} tones for spaces that radiate comfort.`,
      `Sun-soaked ${color1} paired with ${color2}. The ${birdName}'s palette is all golden-hour warmth.`,
      `${Color1} and ${color2}, both from the warm side of the wheel. The ${birdName} knows what cozy looks like.`,
    ]);
  }

  if (coolCount > warmCount + 1) {
    return pick([
      `Cool ${color1} and ${color2} from the ${birdName} — for rooms that feel calm from the moment you walk in.`,
      `The ${birdName}'s palette runs cool: ${color1} and ${color2} that bring stillness to any space.`,
      `Collected and composed. The ${birdName} pairs ${color1} with ${color2} for effortless tranquility.`,
      `${Color1} and ${color2}, cool and considered. The ${birdName}'s palette is a deep breath.`,
    ]);
  }

  if (mutedCount >= 3) {
    return pick([
      `Softly spoken ${color1} and ${color2} — the ${birdName}'s palette doesn't shout, it invites.`,
      `The ${birdName} favors the middle ground: muted ${color1} and gentle ${color2} for lived-in spaces.`,
      `Neither loud nor quiet. The ${birdName}'s ${color1}-and-${color2} palette hits the sweet spot.`,
      `Dusty ${color1} meets faded ${color2}. The ${birdName}'s palette feels like it's always been there.`,
    ]);
  }

  if (harmonyType === 'complementary') {
    return pick([
      `${Color1} and ${color2} in perfect tension. The ${birdName} proves opposites attract.`,
      `A complementary clash of ${color1} and ${color2} — the ${birdName}'s palette is high contrast, high reward.`,
      `The ${birdName} plays ${color1} against ${color2} — opposites on the wheel, partners in a room.`,
    ]);
  }

  if (harmonyType === 'triadic') {
    return pick([
      `The ${birdName} balances ${color1} and ${color2} with the ease of a natural colorist.`,
      `Three-way color harmony from the ${birdName}: ${color1}, ${color2}, and everything in between.`,
      `A richly balanced mix anchored by ${color1} and ${color2}. The ${birdName}'s plumage does the math.`,
    ]);
  }

  return pick([
    `${Color1} grounded by ${color2}. The ${birdName}'s palette is ready for real rooms.`,
    `The ${birdName} brings ${color1} and ${color2} together — a pairing that just works.`,
    `From feather to finish: the ${birdName}'s ${color1}-and-${color2} palette, translated for interiors.`,
    `${Color1} leads, ${color2} follows. A natural rhythm borrowed from the ${birdName}.`,
    `What the ${birdName} wears, your room can wear. ${Color1} and ${color2}, balanced by nature.`,
    `The ${birdName} nails it: ${color1} and ${color2} in proportions that feel effortless.`,
  ]);
}

// ── Main: read birds.js, patch taglines, write back ──
const birdsPath = new URL('../src/data/birds.js', import.meta.url).pathname;
const { birds } = await import(`file://${birdsPath}`);

let fileContent = readFileSync(birdsPath, 'utf8');
let patchCount = 0;

for (const bird of birds) {
  // Analyze the bird's colors
  const analyzed = bird.colors.map(c => {
    const a = analyzeHex(c.hex);
    a.pct = c.percentage || 0;
    return a;
  }).sort((a, b) => b.pct - a.pct);

  const harmonyType = bird.harmony?.type || bird.harmony || 'analogous';
  const newTagline = generateTagline(bird.name, analyzed, harmonyType);

  if (newTagline !== bird.tagline) {
    // Escape special regex characters in the old tagline
    const escaped = bird.tagline.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`"tagline":\\s*"${escaped}"`);
    const replacement = `"tagline": "${newTagline.replace(/"/g, '\\"')}"`;

    if (regex.test(fileContent)) {
      fileContent = fileContent.replace(regex, replacement);
      patchCount++;
    } else {
      console.error(`Could not find tagline for bird ${bird.id} (${bird.name})`);
    }
  }
}

writeFileSync(birdsPath, fileContent, 'utf8');
console.error(`Patched ${patchCount} taglines out of ${birds.length} birds`);
