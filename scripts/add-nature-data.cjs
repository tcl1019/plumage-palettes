#!/usr/bin/env node
/**
 * Adds nature: { colorStory, habitat } to each bird in birds.js
 * Uses each bird's existing metadata (colors, harmony, season, moods, styles)
 * to generate unique, relevant content.
 */

const fs = require('fs');
const path = require('path');

const BIRDS_PATH = path.join(__dirname, '..', 'src', 'data', 'birds.js');

// ── Color name helpers ──────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

function getColorFamily(hex) {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  if (l < 0.12) return 'black';
  if (l > 0.90) return 'white';
  const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1)) / 255;
  if (sat < 0.12) return l > 0.5 ? 'pale gray' : 'charcoal';
  let h = 0;
  if (max === r) h = 60 * ((g - b) / (max - min));
  else if (max === g) h = 60 * (2 + (b - r) / (max - min));
  else h = 60 * (4 + (r - g) / (max - min));
  if (h < 0) h += 360;
  if (h < 15) return l > 0.6 ? 'peach' : 'red';
  if (h < 40) return l > 0.6 ? 'apricot' : 'burnt orange';
  if (h < 55) return l > 0.6 ? 'golden' : 'amber';
  if (h < 70) return l > 0.7 ? 'butter' : 'olive';
  if (h < 160) return l > 0.5 ? 'sage' : 'forest green';
  if (h < 200) return l > 0.5 ? 'sky blue' : 'teal';
  if (h < 250) return l > 0.5 ? 'periwinkle' : 'deep blue';
  if (h < 290) return l > 0.5 ? 'lavender' : 'violet';
  if (h < 330) return l > 0.5 ? 'rose' : 'magenta';
  return l > 0.6 ? 'blush' : 'crimson';
}

function getWarmCool(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (r + g * 0.3) > (b + g * 0.7) ? 'warm' : 'cool';
}

// ── Content generation templates ────────────────────────────────────────

const colorStoryTemplates = {
  analogous: [
    (bird, colors) => `The ${bird}'s ${colors[0]} and ${colors[1]} tones flow seamlessly together, the way neighboring hues on the color wheel always do in nature. This palette evolved for subtle camouflage — blending into bark, soil, or foliage rather than standing out. In a room, that same principle creates effortless cohesion: colors that feel like they belong together because, biologically, they do.`,
    (bird, colors) => `Nature chose a tight color range for the ${bird} — ${colors[0]} bleeding into ${colors[1]} with no jarring transitions. This analogous strategy serves the bird in dappled light, where gradual tonal shifts break up the body's outline. That's exactly why these colors feel so restful on a wall: your eye moves smoothly across the palette without stopping.`,
    (bird, colors) => `Evolution painted the ${bird} in harmonious ${colors[0]} and ${colors[1]} tones — an analogous scheme perfected over millennia. Each feather layer transitions gently to the next, creating depth without contrast. Interior designers call this "tonal layering," but birds invented it millions of years before the first paint chip existed.`,
  ],
  complementary: [
    (bird, colors) => `The ${bird} pairs ${colors[0]} against ${colors[1]} — opposite sides of the color wheel working in dramatic tension. In nature, this high-contrast combination serves as either a bold mating display or a warning signal. In your home, it creates the same dynamic energy: each color intensifies the other, making both appear more vibrant than they would alone.`,
    (bird, colors) => `Nature's boldest move on the ${bird}: setting ${colors[0]} directly against ${colors[1]}. These complementary colors create maximum visual impact, which is exactly the point — whether attracting a mate or commanding attention in a living room. The key is proportion: the bird uses the bolder hue sparingly, just as the 60/30/10 rule suggests.`,
    (bird, colors) => `The ${bird}'s striking ${colors[0]}-to-${colors[1]} contrast is nature's version of complementary color theory. These opposing hues vibrate with energy when placed side by side. The bird deploys this strategically — bold patches at key display areas — teaching us that complementary colors work best as deliberate accents, not equal partners.`,
  ],
  'split-complementary': [
    (bird, colors) => `The ${bird} employs a sophisticated split-complementary scheme: ${colors[0]} paired not with its direct opposite, but with the two colors flanking it — ${colors[1]} and ${colors.slice(2).join(' and ')}. This gives the palette bold contrast with more nuance than a straight complementary pairing. Nature discovered this "cheat code" for vibrant-yet-balanced palettes long before design school existed.`,
    (bird, colors) => `Rather than simple opposition, the ${bird}'s plumage uses a split-complementary strategy — ${colors[0]} anchored by ${colors[1]} tones. This creates visual tension without the harshness of direct complements. It's why the palette feels simultaneously exciting and livable: nature optimized it for maximum attractiveness with minimum visual fatigue.`,
  ],
  triadic: [
    (bird, colors) => `The ${bird} showcases three colors spaced evenly around the color wheel — ${colors[0]}, ${colors[1]}, and ${colors[2] || colors[0]}. This triadic harmony is rare in nature and always striking when it appears. Each hue holds its own while supporting the others, creating a palette with built-in balance and visual richness.`,
    (bird, colors) => `Nature's most ambitious color strategy appears on the ${bird}: a triadic scheme of ${colors[0]}, ${colors[1]}, and ${colors[2] || 'neutral'} tones. Three equidistant hues create a vibrant, balanced palette that feels both playful and deliberate — like a room designed by someone who knows exactly how to make colors sing together.`,
  ],
  monochromatic: [
    (bird, colors) => `The ${bird} proves that a single color family — ${colors[0]} in varying depths — can be extraordinarily sophisticated. This monochromatic strategy relies on texture and tonal variation rather than hue contrast. In a room, this translates to effortless elegance: layers of the same hue in different materials create depth that feels curated, not chaotic.`,
    (bird, colors) => `Every feather on the ${bird} is a variation of ${colors[0]}, from the palest highlights to the deepest shadows. This monochromatic palette is nature's masterclass in restraint. The lesson for interiors: you don't need many colors to create a compelling space — you need many textures and values of one great color.`,
    (bird, colors) => `The ${bird}'s plumage is a study in tonal range — light-to-dark variations of ${colors[0]} creating dimension through value alone. This monochromatic approach in nature works because subtle shifts catch the eye without overwhelming it. That's the same reason a tone-on-tone room feels both serene and deeply layered.`,
  ],
};

const habitatData = {
  // Habitat descriptions based on typical bird environments
  owl: [
    'Dense woodland canopies and twilight-lit clearings — translating to intimate, layered spaces with ambient lighting and rich wood tones.',
    'Ancient forests with dappled light filtering through canopy gaps — evoking moody reading nooks, wood-paneled studies, and warm lamplight.',
  ],
  hawk: [
    'Open grasslands and wide skies above arid plains — inspiring expansive rooms with clean sightlines, natural textures, and warm earth tones.',
    'Rocky bluffs and sun-scorched prairie — translating to rooms with natural stone accents, warm neutrals, and panoramic window views.',
  ],
  water: [
    'Marshlands and glassy lake surfaces at dawn — suggesting serene bathrooms, coastal living rooms, and spaces where light reflects off smooth surfaces.',
    'Shoreline mud flats and tidal pools — evoking rooms with polished stone floors, glass accents, and a curated mix of matte and glossy finishes.',
    'Calm waterways bordered by reeds and overhanging willows — translating to tranquil spaces with flowing textiles, soft colors, and natural fiber rugs.',
  ],
  forest: [
    'Mossy understory and sun-dappled forest floors — inspiring rooms layered with botanical prints, woven textures, and filtered natural light.',
    'Leafy canopies and lichen-covered branches — translating to rooms with green accents, natural wood furniture, and organic textile patterns.',
    'Dense thickets where light barely reaches the ground — evoking intimate dining rooms, cozy libraries, and spaces that feel like a retreat.',
  ],
  garden: [
    'Suburban gardens, flowering hedgerows, and backyard feeders — translating to cheerful kitchens, bright breakfast nooks, and welcoming entryways.',
    'Wildflower meadows and cottage garden borders — suggesting rooms with patterned textiles, mixed bouquets, and eclectic yet harmonious decor.',
  ],
  tropical: [
    'Cloud forest canopies and flower-laden tropical understory — inspiring rooms with lush plants, bold color pops, and natural rattan or bamboo accents.',
    'Humid rainforest layers from floor to canopy — translating to rooms with deep greens, rich textures, and a sense of abundant, layered life.',
  ],
  open: [
    'Wide-open fields and fence-line perches — suggesting minimalist rooms with clean lines, natural light, and carefully curated focal points.',
    'Expansive prairies where the sky dominates — translating to rooms with high ceilings, neutral foundations, and a few bold accent pieces.',
  ],
  coastal: [
    'Rocky coastlines where ocean spray meets wind-sculpted cliffs — evoking rooms with weathered wood, linen textiles, and a cool-to-warm tonal range.',
    'Sandy beaches and salt-bleached driftwood — translating to airy coastal rooms with whitewashed surfaces, sisal rugs, and sea-glass accents.',
  ],
  urban: [
    'City parks, rooftop ledges, and sidewalk trees — translating to modern urban spaces with clean geometries, concrete textures, and purposeful greenery.',
    'Wire perches and brick facades — evoking loft-style living with exposed materials, industrial lighting, and curated color moments.',
  ],
  mountain: [
    'Alpine meadows and rocky outcrops above the treeline — translating to rooms with stone fireplaces, heavy textiles, and cool morning light.',
    'High-elevation forests where mist clings to evergreen boughs — inspiring cabin-style spaces with deep wood tones and cozy layered textiles.',
  ],
};

// Map bird names to likely habitats
function guessHabitat(name, sci) {
  const n = name.toLowerCase();
  const s = (sci || '').toLowerCase();
  if (/owl/.test(n)) return 'owl';
  if (/hawk|eagle|kite|falcon|osprey|vulture/.test(n)) return 'hawk';
  if (/duck|goose|teal|merganser|loon|grebe|pelican|heron|egret|avocet|stilt|plover|sandpiper|killdeer|gull|tern|cormorant|scoter|coot|pintail|shoveler|brant|swan/.test(n)) return 'water';
  if (/wren|creeper|nuthatch|titmouse|chickadee|woodpecker|sapsucker|flicker|thrush|vireo|warbler|kinglet|bushtit|phoebe/.test(n)) return 'forest';
  if (/tanager|parakeet|barbet|hummingbird|quetzal|toucan|manakin|motmot/.test(n)) return 'tropical';
  if (/sparrow|finch|bunting|grosbeak|towhee|junco|cardinal|jay|robin|bluebird|waxwing|dove|pigeon/.test(n)) return 'garden';
  if (/meadowlark|blackbird|bobolink|starling|grackle|cowbird|oriole/.test(n)) return 'open';
  if (/swift|crow|myna|shrike|raven|magpie/.test(n)) return 'urban';
  if (/ptarmigan|rosy-finch|dipper/.test(n)) return 'mountain';
  // Fallback based on scientific name patterns or default
  if (/ocean|marine|pelagic/.test(s)) return 'coastal';
  return 'forest'; // safe default
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNature(bird) {
  const dominantColor = bird.colors.find(c => c.role === 'dominant');
  const secondaryColor = bird.colors.find(c => c.role === 'secondary');
  const accentColor = bird.colors.find(c => c.role === 'accent');

  const colorFamilies = [dominantColor, secondaryColor, accentColor]
    .filter(Boolean)
    .map(c => getColorFamily(c.hex));

  // Deduplicate color families
  const uniqueFamilies = [...new Set(colorFamilies)];

  const harmonyType = bird.harmony?.type || 'analogous';
  const templates = colorStoryTemplates[harmonyType] || colorStoryTemplates.analogous;
  const colorStory = pick(templates)(bird.name, uniqueFamilies);

  const habitatType = guessHabitat(bird.name, bird.scientific);
  const habitatOptions = habitatData[habitatType] || habitatData.forest;
  const habitat = pick(habitatOptions);

  return { colorStory, habitat };
}

// ── Main: read birds.js, inject nature data ─────────────────────────────

function main() {
  let content = fs.readFileSync(BIRDS_PATH, 'utf8');

  // Parse the JS to get bird data for content generation
  // We need to extract bird objects to access their metadata
  const birdsArrayMatch = content.match(/export const birds = (\[[\s\S]*\]);?\s*$/);
  if (!birdsArrayMatch) {
    console.error('Could not parse birds array');
    process.exit(1);
  }

  // Use Function constructor to eval the array (it's just data)
  let birdsData;
  try {
    birdsData = new Function('return ' + birdsArrayMatch[1])();
  } catch(e) {
    console.error('Failed to parse birds data:', e.message);
    process.exit(1);
  }

  console.log(`Found ${birdsData.length} birds`);

  // Generate nature data for each bird
  const natureMap = {};
  birdsData.forEach(bird => {
    natureMap[bird.id] = generateNature(bird);
  });

  // Now inject nature data into the source text
  // Strategy: find each bird's closing "moods" array and add nature after it
  let injected = 0;

  // Match pattern: "moods": [...]\n  } (end of bird object)
  // We'll process bird by bird using their IDs
  birdsData.forEach(bird => {
    const nature = natureMap[bird.id];
    const escaped = JSON.stringify(nature, null, 6)
      .replace(/\n/g, '\n    '); // indent to match birds.js structure

    // Find the moods array for this specific bird
    // Use the bird's unique name to locate the right block
    const nameEscaped = bird.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find this bird's moods closing bracket
    const birdStart = content.indexOf(`"name": "${bird.name}"`);
    if (birdStart === -1) {
      console.warn(`  Could not find bird: ${bird.name}`);
      return;
    }

    // Find the moods array end after this bird's name
    const moodsStart = content.indexOf('"moods":', birdStart);
    if (moodsStart === -1) {
      console.warn(`  Could not find moods for: ${bird.name}`);
      return;
    }

    // Find the closing bracket of moods array
    const moodsArrayStart = content.indexOf('[', moodsStart);
    let depth = 0;
    let moodsEnd = -1;
    for (let i = moodsArrayStart; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') {
        depth--;
        if (depth === 0) { moodsEnd = i; break; }
      }
    }

    if (moodsEnd === -1) {
      console.warn(`  Could not find moods end for: ${bird.name}`);
      return;
    }

    // Check if nature already exists for this bird (skip if so)
    const nextChunk = content.substring(moodsEnd, moodsEnd + 100);
    if (nextChunk.includes('"nature"')) {
      return; // already has nature data
    }

    // Insert nature data after the moods array closing bracket
    const natureStr = `,\n    "nature": {\n      "colorStory": ${JSON.stringify(nature.colorStory)},\n      "habitat": ${JSON.stringify(nature.habitat)}\n    }`;

    content = content.substring(0, moodsEnd + 1) + natureStr + content.substring(moodsEnd + 1);
    injected++;
  });

  fs.writeFileSync(BIRDS_PATH, content, 'utf8');
  console.log(`Injected nature data for ${injected} birds`);
}

// Use fixed seed for reproducibility (simple LCG)
let seed = 42;
Math.random = function() {
  seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF;
  return (seed >>> 0) / 0xFFFFFFFF;
};

main();
