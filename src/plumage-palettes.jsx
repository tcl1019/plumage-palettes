import React, { useState, useMemo } from 'react';
import {
  ChevronDown, ChevronUp, Copy, Check, Heart,
  Sun, Snowflake, Palette, Home, Paintbrush,
  Lightbulb, Layers, Sparkles, BookOpen, Star,
  Leaf, Info, ArrowRight, Eye
} from 'lucide-react';

// ============================================================
// COLOR UTILITY FUNCTIONS
// ============================================================

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
};

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
};

const getUndertone = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'neutral';
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (s < 10) return 'neutral';
  if ((h >= 0 && h <= 70) || h >= 330) return 'warm';
  if (h >= 150 && h <= 290) return 'cool';
  return 'neutral';
};

const generateTints = (hex, steps = 4) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  return Array.from({ length: steps }, (_, i) => {
    const factor = (i + 1) / (steps + 1);
    const r = Math.round(rgb.r + (255 - rgb.r) * factor);
    const g = Math.round(rgb.g + (255 - rgb.g) * factor);
    const b = Math.round(rgb.b + (255 - rgb.b) * factor);
    return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  });
};

const generateShades = (hex, steps = 4) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  return Array.from({ length: steps }, (_, i) => {
    const factor = (i + 1) / (steps + 1);
    const r = Math.round(rgb.r * (1 - factor));
    const g = Math.round(rgb.g * (1 - factor));
    const b = Math.round(rgb.b * (1 - factor));
    return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  });
};

const getRelativeLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getTextColor = (bgHex) =>
  getRelativeLuminance(bgHex) > 0.179 ? '#1A1A1A' : '#FFFFFF';

// ============================================================
// DESIGN CONSTANTS
// ============================================================

const DESIGN_STYLES = [
  { id: 'mid-century', label: 'Mid-Century Modern', description: 'Clean lines, organic curves, warm woods, muted earth tones with pops of color' },
  { id: 'coastal', label: 'Coastal', description: 'Ocean-inspired blues, sandy neutrals, natural textures, light and airy' },
  { id: 'bohemian', label: 'Bohemian', description: 'Rich jewel tones, global patterns, layered textures, eclectic mixing' },
  { id: 'scandinavian', label: 'Scandinavian', description: 'Light woods, whites, subtle color, functional simplicity' },
  { id: 'contemporary', label: 'Contemporary', description: 'Current trends, neutral base, bold accent colors, clean surfaces' },
  { id: 'traditional', label: 'Traditional', description: 'Rich colors, classic patterns, dark woods, formal balance' },
  { id: 'art-deco', label: 'Art Deco', description: 'Bold geometrics, rich colors, metallics, glamorous contrasts' },
  { id: 'farmhouse', label: 'Modern Farmhouse', description: 'Warm whites, natural wood, muted colors, rustic-meets-refined' },
  { id: 'eclectic', label: 'Eclectic', description: 'Mixed eras and styles, unexpected color combinations, personal expression' },
  { id: 'tropical', label: 'Tropical', description: 'Bold greens, warm brights, natural materials, lush and vibrant' },
];

const FINISH_GUIDE = {
  dominant: { finish: 'Matte / Eggshell', reason: 'Hides wall imperfections; soft, sophisticated look for large surfaces' },
  secondary: { finish: 'Satin', reason: 'Durable for high-touch surfaces; subtle sheen complements textiles' },
  accent: { finish: 'Semi-Gloss', reason: 'Draws the eye to focal points; easy to clean on smaller surfaces' },
  neutral: { finish: 'Semi-Gloss', reason: 'Crisp on trim and molding; provides definition against matte walls' },
  highlight: { finish: 'Semi-Gloss / High-Gloss', reason: 'Creates drama on doors and architectural features' },
};

const ROLE_LABELS = {
  dominant: { label: '60% Walls', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  secondary: { label: '30% Textiles', bg: 'bg-blue-100', text: 'text-blue-700' },
  accent: { label: '10% Accents', bg: 'bg-amber-100', text: 'text-amber-700' },
  neutral: { label: 'Trim', bg: 'bg-gray-100', text: 'text-gray-600' },
  highlight: { label: 'Feature', bg: 'bg-purple-100', text: 'text-purple-700' },
};

const HARMONY_COLORS = {
  analogous: { bg: 'bg-green-100', text: 'text-green-700' },
  complementary: { bg: 'bg-rose-100', text: 'text-rose-700' },
  triadic: { bg: 'bg-purple-100', text: 'text-purple-700' },
  'split-complementary': { bg: 'bg-teal-100', text: 'text-teal-700' },
  monochromatic: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

const SEASON_STYLES = {
  'spring-summer': { bg: 'bg-green-100', text: 'text-green-700', label: 'Spring / Summer' },
  'fall-winter': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Fall / Winter' },
  'year-round': { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Year-Round' },
};

// ============================================================
// BIRD DATA
// ============================================================

const birds = [
  {
    id: 1,
    name: 'Superb Fairy-wren',
    scientific: 'Malurus cyaneus',
    description: 'One of Australia\'s most vibrant native birds, the male Superb Fairy-wren is famous for its brilliant blue plumage and energetic behavior. These tiny birds are social and often found in small groups.',
    status: 'Least Concern',
    conservation: 'While currently stable, habitat loss in Australia threatens many regional populations. Conservation efforts focus on native vegetation restoration.',
    colors: [
      { hex: '#4F7CA8', name: 'Fairy-wren Azure', role: 'accent', finish: 'Semi-Gloss', application: 'Statement throw pillows, ceramic vases, or artwork frames', lightingNote: 'Reads as a confident mid-blue in daylight; softens to a dusty denim under warm bulbs' },
      { hex: '#2B3A4E', name: 'Midnight Mask', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a dramatic bookshelf, or fireplace surround', lightingNote: 'A sophisticated dark blue-charcoal that reveals navy undertones in bright light' },
      { hex: '#93B5CF', name: 'Dawn Perch', role: 'dominant', finish: 'Eggshell', application: 'Primary wall color on all four walls for a calming envelope', lightingNote: 'A livable powder blue in daylight; takes on a gentle lavender cast under warm bulbs' },
      { hex: '#9B8B72', name: "Wren's Wing", role: 'secondary', finish: 'Satin', application: 'Linen sofa upholstery, woven curtains, or a jute area rug', lightingNote: 'A warm taupe that grounds the blues; reads slightly golden under incandescent' },
      { hex: '#E8E4DE', name: 'Breast Feather', role: 'neutral', finish: 'Semi-Gloss', application: 'Crown molding, baseboards, window casings, and ceiling', lightingNote: 'A warm off-white with barely-there warmth; never reads yellow or pink' },
    ],
    harmony: { type: 'analogous', explanation: 'Muted blues flow from soft powder to deep navy, creating a serene, collected palette. The warm taupe grounds everything and keeps the blues from feeling clinical.' },
    neutrals: {
      trim: { hex: '#F0EBE4', name: 'Feather White' },
      ceiling: { hex: '#F7F5F2', name: 'Cloud Ceiling' },
      floor: { hex: '#8B7D6B', name: 'Driftwood Oak' },
    },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'Dawn Perch is a perfect bedroom blue — gentle enough for rest, sophisticated enough for adults.' },
      { room: 'Living Room', rating: 3, reason: 'Works in south-facing rooms with ample warmth; north-facing rooms may feel too cool.' },
      { room: 'Dining Room', rating: 2, reason: 'Cool blues rarely stimulate appetite; better suited to calmer spaces.' },
      { room: 'Kitchen', rating: 2, reason: 'Can feel sterile without enough warm wood tones to balance.' },
      { room: 'Bathroom', rating: 5, reason: 'These muted blues feel inherently natural in bathrooms. Pair with white fixtures and brass hardware.' },
    ],
    styles: ['coastal', 'scandinavian', 'contemporary'],
    season: 'year-round',
    seasonNote: 'These muted blues feel refreshing in summer and crisp in winter. The warm taupe keeps it from reading too cold in darker months.',
  },
  {
    id: 2,
    name: 'Resplendent Quetzal',
    scientific: 'Pharomachrus mocinno',
    description: 'Sacred to the Aztecs, the Resplendent Quetzal is one of the most strikingly beautiful birds in the Americas. Its emerald plumage and trailing tail feathers are legendary.',
    status: 'Near Threatened',
    conservation: 'Cloud forest habitat loss is the primary threat. The bird requires high-altitude pristine forests in Central America, making it vulnerable to deforestation and climate change.',
    colors: [
      { hex: '#4E8B6A', name: 'Quetzal Emerald', role: 'dominant', finish: 'Eggshell', application: 'Feature wall or full-room color in a living or dining space', lightingNote: 'A sophisticated sage-emerald that feels jewel-like under warm light and fresh under daylight' },
      { hex: '#A63D40', name: 'Sacred Crimson', role: 'accent', finish: 'Semi-Gloss', application: 'A tufted accent chair, patterned throw pillows, or lacquered tray', lightingNote: 'Deep cranberry warmth under incandescent; reads slightly cooler and more berry under daylight' },
      { hex: '#3E7A98', name: 'Cloud Forest Blue', role: 'secondary', finish: 'Satin', application: 'Velvet curtains, a large area rug, or upholstered dining chairs', lightingNote: 'A muted teal-blue that deepens under warm light and brightens under cool LED' },
      { hex: '#5A7F5E', name: 'Canopy Green', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a painted cabinet, or stair risers', lightingNote: 'Reads more yellow-green under warm light; most true under natural daylight' },
      { hex: '#F0EBE0', name: 'Quetzal Mist', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceiling, and built-in shelving to let rich colors breathe', lightingNote: 'A warm ivory that feels creamy under incandescent and crisp under daylight' },
    ],
    harmony: { type: 'triadic', explanation: 'Green, red, and blue form a classic triadic harmony — richly balanced at muted intensities. The warm cream provides essential breathing room between the deep players.' },
    neutrals: {
      trim: { hex: '#F0EBE0', name: 'Misty Cream' },
      ceiling: { hex: '#F8F6F1', name: 'Cloud Forest White' },
      floor: { hex: '#5C4033', name: 'Mahogany Trail' },
    },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Quetzal Emerald makes a rich, cocooning bedroom wall when kept to one feature wall.' },
      { room: 'Living Room', rating: 5, reason: 'This muted emerald makes a stunning living room — sophisticated without being overwhelming.' },
      { room: 'Dining Room', rating: 5, reason: 'Muted emerald is a classic dining room color — dramatic, elegant, and appetite-friendly.' },
      { room: 'Kitchen', rating: 3, reason: 'Works well on a kitchen island or lower cabinets; full walls may overwhelm smaller kitchens.' },
      { room: 'Bathroom', rating: 3, reason: 'A powder room in Quetzal Emerald with brass fixtures feels luxe and unexpected.' },
    ],
    styles: ['tropical', 'bohemian', 'eclectic'],
    season: 'year-round',
    seasonNote: 'Rich muted greens and deep reds feel festive in winter and lush in summer. This palette transcends seasons with its depth.',
  },
  {
    id: 3,
    name: 'Mallard',
    scientific: 'Anas platyrhynchos',
    description: 'The iconic male Mallard with its iridescent green head is one of the most recognizable ducks worldwide. They are adaptable and found across the Northern Hemisphere.',
    status: 'Least Concern',
    conservation: 'Mallards are fortunately abundant and widespread. However, wetland preservation remains crucial for all duck species and their habitats.',
    colors: [
      { hex: '#2E5E4E', name: "Drake's Head", role: 'highlight', finish: 'Semi-Gloss', application: 'A dramatic front door, built-in bookshelves, or a freestanding cabinet', lightingNote: 'A deep forest green that reveals gorgeous teal undertones in bright settings' },
      { hex: '#7A5C42', name: 'Chestnut Breast', role: 'secondary', finish: 'Satin', application: 'Leather sofa, wool curtains, or a large woven area rug', lightingNote: 'A rich saddle brown that feels warm and enveloping under any light source' },
      { hex: '#4A6FA5', name: 'Speculum Blue', role: 'accent', finish: 'Semi-Gloss', application: 'Decorative ceramics, a patterned accent pillow, or a painted side table', lightingNote: 'A handsome dusty blue that reads deeper in evening light and brighter in daylight' },
      { hex: '#909B96', name: 'Pond Stone', role: 'dominant', finish: 'Matte', application: 'All four walls — a sophisticated green-gray that works in any room', lightingNote: 'Shifts subtly between green and gray depending on light; beautifully neutral' },
      { hex: '#E8DCC8', name: 'Wheat Field', role: 'neutral', finish: 'Semi-Gloss', application: 'Warm trim, wainscoting, or an accent ceiling for earthy warmth', lightingNote: 'A natural warm cream that glows golden under warm light and reads clean under cool LED' },
    ],
    harmony: { type: 'split-complementary', explanation: 'The green-gray base splits between warm chestnut and cool blue accents, creating visual interest without clashing. Wheat Field ties the warm and cool sides together.' },
    neutrals: {
      trim: { hex: '#EDE8DF', name: 'Reed White' },
      ceiling: { hex: '#F5F3EE', name: 'Pond Mist' },
      floor: { hex: '#6B5B4A', name: 'Weathered Pier' },
    },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Pond Stone is calming enough for sleep, but the palette is at its best in living spaces.' },
      { room: 'Living Room', rating: 5, reason: 'The quintessential living room palette — Pond Stone walls, leather sofa, and blue accents.' },
      { room: 'Dining Room', rating: 4, reason: 'Drake\'s Head on a feature wall creates a handsome, traditional dining atmosphere.' },
      { room: 'Kitchen', rating: 3, reason: 'Pond Stone works on kitchen cabinets; pair with brass hardware and butcher block counters.' },
      { room: 'Bathroom', rating: 3, reason: 'The earthy tones suit a spa-inspired bathroom with natural stone tile.' },
    ],
    styles: ['traditional', 'farmhouse', 'mid-century'],
    season: 'fall-winter',
    seasonNote: 'Muted greens, warm browns, and soft grays evoke autumn wetlands. This palette feels most at home during cooler months.',
  },
  {
    id: 4,
    name: 'Eastern Bluebird',
    scientific: 'Sialia sialis',
    description: 'A symbol of happiness and spring in North America, the Eastern Bluebird displays striking azure plumage. Once declining due to habitat loss, they\'ve made a remarkable comeback.',
    status: 'Least Concern',
    conservation: 'Conservation efforts including nest box programs have been highly successful in restoring populations across their range.',
    colors: [
      { hex: '#5478B0', name: 'Bluebird Royal', role: 'accent', finish: 'Semi-Gloss', application: 'A painted accent chair, decorative ceramics, or a gallery wall frame', lightingNote: 'A confident medium blue that reads richer under warm bulbs and cleaner in daylight' },
      { hex: '#C87D6B', name: 'Sunrise Breast', role: 'highlight', finish: 'Semi-Gloss', application: 'An interior door, the inside of a bookshelf, or a painted dresser', lightingNote: 'A warm terracotta that glows beautifully under any light; most vivid in morning sun' },
      { hex: '#F8F6F2', name: 'Winter Belly', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceiling, and cabinetry for a clean, fresh foundation', lightingNote: 'A soft warm white that feels clean without being sterile; picks up surrounding warmth' },
      { hex: '#9FC1D6', name: 'Sky Song', role: 'dominant', finish: 'Eggshell', application: 'Primary wall color — airy and uplifting without being overwhelming', lightingNote: 'A livable soft blue that reads lighter in bright daylight and gains depth in evening light' },
      { hex: '#BFA88A', name: 'Nest Box Oak', role: 'secondary', finish: 'Satin', application: 'Woven linen curtains, a natural fiber rug, or upholstered headboard', lightingNote: 'Warm and grounding in all lighting; prevents the blues from feeling cold' },
    ],
    harmony: { type: 'complementary', explanation: 'The warm terracotta of Sunrise Breast sits opposite the cool blues on the color wheel, creating an energetic but livable contrast. Nest Box Oak bridges the two temperatures.' },
    neutrals: {
      trim: { hex: '#F8F6F2', name: 'Crisp White' },
      ceiling: { hex: '#FAFBFF', name: 'Bluebird Sky' },
      floor: { hex: '#B8A088', name: 'Birdhouse Pine' },
    },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'Sky Song is the ideal bedroom blue — gentle, calming, and paired with warm oak tones for coziness.' },
      { room: 'Living Room', rating: 4, reason: 'Fresh and cheerful. The terracotta accent adds personality without overwhelming a family space.' },
      { room: 'Dining Room', rating: 3, reason: 'A bit casual for formal dining, but perfect for a bright breakfast nook.' },
      { room: 'Kitchen', rating: 4, reason: 'Sky Song on upper cabinets with white lowers and oak counters is classic cottage style.' },
      { room: 'Bathroom', rating: 5, reason: 'A spa-like bathroom with terracotta towels for warmth.' },
    ],
    styles: ['coastal', 'farmhouse', 'contemporary'],
    season: 'spring-summer',
    seasonNote: 'This palette captures the optimism of spring — soft blues, warm terracotta, and sunny oak. It brightens even the grayest winter day.',
  },
  {
    id: 5,
    name: 'Florida Scrub-Jay',
    scientific: 'Aphelocoma coerulescens',
    description: 'Endemic to Florida, this electric blue jay is found nowhere else on Earth. It requires specialized scrubland habitat and is a fascinating study in endemic species conservation.',
    status: 'Threatened',
    conservation: 'Habitat fragmentation and urban sprawl threaten this species. It is federally protected and dependent on restoration of Florida\'s native scrub habitat.',
    colors: [
      { hex: '#5B7FA6', name: 'Scrub-Jay Blue', role: 'accent', finish: 'Semi-Gloss', application: 'Statement lamp base, decorative bowls, or a painted vanity', lightingNote: 'A muted periwinkle that deepens to a soft cobalt under evening light' },
      { hex: '#9DBCD4', name: 'Florida Sky', role: 'dominant', finish: 'Eggshell', application: 'A tranquil wall color for any room needing a sense of openness', lightingNote: 'Light and airy in bright rooms; can gain a slight gray cast in dim interiors' },
      { hex: '#A3A39F', name: 'Palmetto Ash', role: 'secondary', finish: 'Satin', application: 'Upholstered sectional, linen curtains, or a large area rug', lightingNote: 'A warm gray in daylight; takes on a subtle blue undertone near the palette\'s blues' },
      { hex: '#F0EDEA', name: 'Sand Dollar', role: 'neutral', finish: 'Semi-Gloss', application: 'Clean, warm trim that pairs effortlessly with the soft blues', lightingNote: 'A barely-there warm white that reads clean in all conditions' },
      { hex: '#6E8E6A', name: 'Scrub Pine', role: 'highlight', finish: 'Semi-Gloss', application: 'A painted front door, planters, or the interior of a glass cabinet', lightingNote: 'A muted sage that reads greener under natural light and grayer under incandescent' },
    ],
    harmony: { type: 'analogous', explanation: 'Muted blues and grays sit close together on the wheel, creating effortless harmony. The sage green adds a natural earth element without disrupting the cool serenity.' },
    neutrals: {
      trim: { hex: '#F0EDEA', name: 'Sand Dollar White' },
      ceiling: { hex: '#F5F4F2', name: 'Open Sky' },
      floor: { hex: '#C4B5A0', name: 'Sandy Shore' },
    },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'Florida Sky makes a serene, spa-like bedroom. Layer warm gray textiles for depth.' },
      { room: 'Living Room', rating: 3, reason: 'Can feel too cool for gathering spaces; warm it up with natural wood and sandy floors.' },
      { room: 'Dining Room', rating: 2, reason: 'The palette is too subdued for a dining room. Best in restful spaces.' },
      { room: 'Kitchen', rating: 3, reason: 'A fresh, clean kitchen palette when paired with white countertops and brushed nickel hardware.' },
      { room: 'Bathroom', rating: 5, reason: 'The ultimate spa bathroom — Florida Sky walls, gray stone tile, and white fixtures.' },
    ],
    styles: ['coastal', 'scandinavian'],
    season: 'spring-summer',
    seasonNote: 'Light, airy, and cool — this palette captures endless Florida skies. Best suited to bright, sun-drenched spaces.',
  },
  {
    id: 6,
    name: 'Scarlet Macaw',
    scientific: 'Ara macao',
    description: 'One of the largest flying parrots, the Scarlet Macaw\'s brilliant red, yellow, and blue plumage makes it unmistakable. They mate for life and can live up to 50 years.',
    status: 'Least Concern',
    conservation: 'While populations are stable, habitat loss and illegal pet trade remain ongoing concerns. Forest protection in Central and South America is essential.',
    colors: [
      { hex: '#BF4E4E', name: 'Macaw Scarlet', role: 'accent', finish: 'Semi-Gloss', application: 'A single accent wall, statement art, or lacquered console table', lightingNote: 'A sophisticated brick-red that warms under incandescent and reads slightly cooler in daylight' },
      { hex: '#D4A94B', name: 'Tropical Gold', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, decorative hardware, or a painted bar cart', lightingNote: 'A warm ochre-gold that reads rich under warm light and slightly more yellow under cool LED' },
      { hex: '#3A6B8A', name: 'Flight Feather Blue', role: 'secondary', finish: 'Satin', application: 'Velvet sofa upholstery, floor-length curtains, or a large patterned rug', lightingNote: 'A dusty steel blue that deepens under warm light and brightens under daylight' },
      { hex: '#F5F1EB', name: 'Bare Face White', role: 'neutral', finish: 'Semi-Gloss', application: 'Generous warm white trim and ceiling to give bold colors room to breathe', lightingNote: 'A warm ivory white that balances the palette without competing' },
      { hex: '#C09B5F', name: 'Jungle Gilded', role: 'dominant', finish: 'Eggshell', application: 'A warm, honeyed wall color that sets the stage for bolder accents', lightingNote: 'A livable warm gold that glows under incandescent and reads more neutral under cool LED' },
    ],
    harmony: { type: 'triadic', explanation: 'Muted red, warm gold, and dusty blue — the primary triad interpreted through a designer lens. The warm white is essential breathing room between the rich tones.' },
    neutrals: {
      trim: { hex: '#F5F1EB', name: 'Tropical Cream' },
      ceiling: { hex: '#F8F6F2', name: 'Canopy Light' },
      floor: { hex: '#6B4E36', name: 'Jungle Teak' },
    },
    rooms: [
      { room: 'Bedroom', rating: 2, reason: 'Still energizing for sleep. Reserve for a guest room or a daring maximalist bedroom.' },
      { room: 'Living Room', rating: 4, reason: 'A show-stopping entertaining space. Anchor with blue sofa, golden walls, and red accents.' },
      { room: 'Dining Room', rating: 5, reason: 'This palette was born for dining rooms — warm, celebratory, and conversation-starting.' },
      { room: 'Kitchen', rating: 3, reason: 'Golden walls with blue tile backsplash and red accessories make an energetic kitchen.' },
      { room: 'Bathroom', rating: 2, reason: 'Can overwhelm small spaces. Use as powder room accents only.' },
    ],
    styles: ['tropical', 'art-deco', 'bohemian'],
    season: 'year-round',
    seasonNote: 'Warm, muted primaries feel festive in winter and tropical in summer. Confidence is the only requirement for this palette.',
  },
  {
    id: 7,
    name: 'Mandarin Duck',
    scientific: 'Aix galericulata',
    description: 'Perhaps the world\'s most ornate duck, the male Mandarin Duck features intricate patterns and colors with spectacular breeding plumage. Found in Asian wetland habitats, they are known for their elaborate and colorful display.',
    status: 'Least Concern',
    conservation: 'Asian wetland degradation affects this species, though populations remain relatively stable. Wetland restoration projects in China and Japan are critical.',
    colors: [
      { hex: '#A64253', name: 'Mandarin Crimson', role: 'accent', finish: 'Semi-Gloss', application: 'Decorative throw pillows, a painted accent piece, or an ornate vase', lightingNote: 'A dusty raspberry that reads warmer under incandescent and slightly cooler under daylight' },
      { hex: '#8B7BAD', name: 'Imperial Purple', role: 'secondary', finish: 'Satin', application: 'Velvet curtains, an upholstered wing chair, or a patterned area rug', lightingNote: 'A muted plum that shows more blue under cool LED and more warmth under incandescent' },
      { hex: '#B58B5E', name: 'Silk Sail Orange', role: 'dominant', finish: 'Eggshell', application: 'A warm, coppery-tan wall color that envelops a room in richness', lightingNote: 'A sophisticated warm caramel that glows under incandescent and reads more neutral in daylight' },
      { hex: '#4E7A52', name: 'Jade Crown', role: 'highlight', finish: 'Semi-Gloss', application: 'A painted credenza, interior door, or window box planter', lightingNote: 'A muted forest green that deepens under warm light and freshens under daylight' },
      { hex: '#EDE8DA', name: 'Rice Paper', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceiling, and wainscoting to temper the rich palette', lightingNote: 'A warm cream that softens all transitions between the bold colors' },
    ],
    harmony: { type: 'split-complementary', explanation: 'Warm caramel base splits to muted purple and forest green complements, creating a richly layered palette. The dusty crimson accent intensifies without competing.' },
    neutrals: {
      trim: { hex: '#EDE8DA', name: 'Silk White' },
      ceiling: { hex: '#F5F2EC', name: 'Paper Lantern' },
      floor: { hex: '#5C3D2E', name: 'Rosewood' },
    },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Silk Sail works as a cozy, cocooning bedroom wall balanced with cream and plum textiles.' },
      { room: 'Living Room', rating: 4, reason: 'Opulent and inviting. Purple velvet on a sofa, caramel walls, and green accents.' },
      { room: 'Dining Room', rating: 5, reason: 'The crown jewel of this palette — warm, dramatic, and perfect for candlelit dinners.' },
      { room: 'Kitchen', rating: 2, reason: 'Too ornate for most kitchens. Reserve the copper-caramel for a backsplash accent only.' },
      { room: 'Bathroom', rating: 3, reason: 'A powder room in these muted jewel tones with brass fixtures feels like a hidden gem.' },
    ],
    styles: ['art-deco', 'eclectic', 'bohemian'],
    season: 'fall-winter',
    seasonNote: 'Warm caramels, muted purples, and dusty crimson feel most at home when leaves are turning and evenings are long.',
  },
  {
    id: 8,
    name: 'Painted Bunting',
    scientific: 'Passerina ciris',
    description: 'Called "painted" for good reason, the male Painted Bunting is impossibly colorful with blue, green, red, and yellow plumage. It\'s North America\'s most colorful songbird.',
    status: 'Least Concern',
    conservation: 'Habitat loss along migration routes is a concern. These birds are unfortunately popular in the wild bird trade. Protected areas and habitat connectivity are vital.',
    colors: [
      { hex: '#1E3348', name: 'Bunting Midnight', role: 'secondary', finish: 'Satin', application: 'Navy velvet curtains, a deep upholstered sofa, or a large woven rug', lightingNote: 'A rich dark navy that reveals blue depth in well-lit spaces and reads near-black in dim rooms' },
      { hex: '#4A7A50', name: 'Nonpareil Green', role: 'dominant', finish: 'Eggshell', application: 'A lush forest-sage wall color that grounds the palette', lightingNote: 'A livable green that reads deeper under warm light and more vibrant under natural daylight' },
      { hex: '#BF4545', name: 'Painted Scarlet', role: 'accent', finish: 'Semi-Gloss', application: 'A single statement chair, decorative art, or lacquered tray', lightingNote: 'A muted brick-red that feels warm and inviting rather than aggressive' },
      { hex: '#7E6DA0', name: 'Bunting Violet', role: 'highlight', finish: 'Semi-Gloss', application: 'Painted interior doors, a feature bookshelf back, or lamp bases', lightingNote: 'A dusty purple that shows more blue under cool LED and more warmth under incandescent' },
      { hex: '#C9A84E', name: 'Louisiana Gold', role: 'neutral', finish: 'Satin', application: 'Gold-toned hardware, mirror frames, and light fixture finishes', lightingNote: 'A warm antique gold that catches light beautifully under warm bulbs' },
    ],
    harmony: { type: 'complementary', explanation: 'Muted green and brick-red sit opposite on the color wheel, creating rich contrast without clashing. Navy and violet deepen the palette while gold adds metallic warmth.' },
    neutrals: {
      trim: { hex: '#F0EBE2', name: 'Parchment' },
      ceiling: { hex: '#F5F2EC', name: 'Soft Linen' },
      floor: { hex: '#4A3728', name: 'Dark Walnut' },
    },
    rooms: [
      { room: 'Bedroom', rating: 2, reason: 'Still bold for a bedroom. Use only if you want a dramatic, maximalist retreat.' },
      { room: 'Living Room', rating: 4, reason: 'Personality-driven. Green walls, navy sofa, and red accents make an unforgettable space.' },
      { room: 'Dining Room', rating: 5, reason: 'Forest green walls with gold accents and red details create a lush, celebratory dining room.' },
      { room: 'Kitchen', rating: 3, reason: 'Green cabinets with gold hardware is trending and works beautifully here.' },
      { room: 'Bathroom', rating: 2, reason: 'Too many bold colors for small wet rooms. Use green as a single accent wall.' },
    ],
    styles: ['bohemian', 'eclectic', 'tropical'],
    season: 'year-round',
    seasonNote: 'Rich, layered palettes transcend seasons — this feels festive in December and lush in June.',
  },
  {
    id: 9,
    name: 'Indigo Bunting',
    scientific: 'Passerina cyanea',
    description: 'A stunning deep blue songbird that arrives in spring across eastern North America. Males sing from exposed perches to defend territories and attract mates.',
    status: 'Least Concern',
    conservation: 'Grassland and shrubland habitat preservation is essential for this migratory species. They face threats on both breeding and wintering grounds in Central America.',
    colors: [
      { hex: '#5AA8C8', name: 'Cerulean Flight', role: 'accent', finish: 'Semi-Gloss', application: 'Accent pillows, a ceramic table lamp, or decorative glass', lightingNote: 'A lively teal-blue that softens to a more muted tone under warm light' },
      { hex: '#3E2A60', name: 'True Indigo', role: 'highlight', finish: 'Semi-Gloss', application: 'A dramatic feature wall, painted ceiling medallion, or accent furniture', lightingNote: 'A deep eggplant-navy that reveals purple depth in bright settings' },
      { hex: '#2E4A6B', name: 'Twilight Wing', role: 'secondary', finish: 'Satin', application: 'Rich navy upholstery, floor-length curtains, or a large tufted headboard', lightingNote: 'A sophisticated dark blue-gray that reads lighter in daylight and darker in evening' },
      { hex: '#9FC5D8', name: 'Summer Sky', role: 'dominant', finish: 'Eggshell', application: 'A gentle, airy wall color that opens up any room', lightingNote: 'A livable soft blue that reads calm and composed in all lighting conditions' },
      { hex: '#8A7560', name: 'Autumn Molt', role: 'neutral', finish: 'Satin', application: 'Warm wood tones for floors, furniture frames, and woven baskets', lightingNote: 'A warm taupe-brown that grounds the blue palette and prevents it from feeling cold' },
    ],
    harmony: { type: 'monochromatic', explanation: 'A graduated range of blues from soft sky to deep indigo creates effortless sophistication. The warm taupe grounds it all and keeps the monochrome from feeling flat.' },
    neutrals: {
      trim: { hex: '#EDEEF2', name: 'Morning Frost' },
      ceiling: { hex: '#F5F5F8', name: 'Dawn Haze' },
      floor: { hex: '#7D6B5A', name: 'Worn Driftwood' },
    },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'The ultimate serene bedroom — layers of muted blue from soft walls to deep navy bedding.' },
      { room: 'Living Room', rating: 3, reason: 'Works beautifully in a reading nook or study corner within a larger living space.' },
      { room: 'Dining Room', rating: 3, reason: 'Navy dining rooms work but need significant warm lighting and metallic accents.' },
      { room: 'Kitchen', rating: 2, reason: 'Monochrome blues can feel clinical in kitchens. Add warm wood generously.' },
      { room: 'Bathroom', rating: 5, reason: 'Layered blues in a bathroom feel like a seaside retreat. Add warm brass fixtures.' },
    ],
    styles: ['contemporary', 'scandinavian', 'mid-century'],
    season: 'year-round',
    seasonNote: 'Monochromatic blues adapt beautifully — cool and fresh in summer, cozy and layered with textiles in winter.',
  },
  {
    id: 10,
    name: 'Red-necked Tanager',
    scientific: 'Tangara cyanocephala',
    description: 'A jewel of South American rainforests, the Red-necked Tanager displays striking contrasts of blue, red, and yellow. These fruit-eating specialists are found in humid forests.',
    status: 'Least Concern',
    conservation: 'Rainforest loss in Brazil, Paraguay, and Argentina threatens this species. Protection of Atlantic Forest reserves is crucial for its survival.',
    colors: [
      { hex: '#3E6FA0', name: 'Tanager Crown', role: 'secondary', finish: 'Satin', application: 'A rich blue sofa, woven curtains, or an accent area rug', lightingNote: 'A muted cobalt that reads confidently under daylight and gains warmth under incandescent' },
      { hex: '#C45454', name: 'Throat Fire', role: 'accent', finish: 'Semi-Gloss', application: 'Bold throw pillows, a painted picture rail, or ceramic accessories', lightingNote: 'A warm terra-red that feels inviting rather than alarming under all lighting' },
      { hex: '#A8AD4A', name: 'Canopy Lime', role: 'highlight', finish: 'Semi-Gloss', application: 'A painted plant shelf, interior shutters, or a fun accent door', lightingNote: 'A muted olive-chartreuse that reads fresh under daylight and more yellow under warm light' },
      { hex: '#4A7A4E', name: 'Rainforest Floor', role: 'dominant', finish: 'Eggshell', application: 'A deep, enveloping green wall color that feels like a forest retreat', lightingNote: 'A livable forest green that deepens under warm light and livens under daylight' },
      { hex: '#D08B8B', name: 'Cheek Blush', role: 'neutral', finish: 'Satin', application: 'Softened rose for textile accents, cushion piping, or small accessories', lightingNote: 'A dusty rose that adds warmth and softness to the bold greens and blues' },
    ],
    harmony: { type: 'triadic', explanation: 'Muted green, dusty blue, and warm red form a softened triadic scheme. The olive-chartreuse highlight and dusty rose add complexity without visual chaos.' },
    neutrals: {
      trim: { hex: '#F0EBE2', name: 'Linen White' },
      ceiling: { hex: '#F5F2EB', name: 'Canopy Light' },
      floor: { hex: '#5C4033', name: 'Tropical Hardwood' },
    },
    rooms: [
      { room: 'Bedroom', rating: 2, reason: 'Still energizing. Best reserved for adventurous sleepers or a guest room with character.' },
      { room: 'Living Room', rating: 4, reason: 'A tropical living room with green walls, blue sofa, and rose accents feels like a vacation.' },
      { room: 'Dining Room', rating: 4, reason: 'The lush green and warm reds create an inviting atmosphere for meals.' },
      { room: 'Kitchen', rating: 3, reason: 'Green lower cabinets with open shelving and colorful dishware look fantastic.' },
      { room: 'Bathroom', rating: 3, reason: 'A tropical powder room with Rainforest Floor walls and brass fixtures is a bold move.' },
    ],
    styles: ['tropical', 'eclectic', 'bohemian'],
    season: 'spring-summer',
    seasonNote: 'Muted tropical tones feel most vibrant when paired with natural light and warm weather energy.',
  },
  {
    id: 11,
    name: 'Victoria Crowned Pigeon',
    scientific: 'Goura victoria',
    description: 'The largest pigeon species, the Victoria Crowned Pigeon sports an elaborate lace-like crest. Found only in New Guinea, it is a ground feeder in lowland forests.',
    status: 'Near Threatened',
    conservation: 'Logging and habitat loss in New Guinea are primary threats. This striking pigeon requires large tracts of undisturbed lowland forest to survive.',
    colors: [
      { hex: '#5A7F9F', name: 'Crowned Blue', role: 'dominant', finish: 'Eggshell', application: 'A stately, dusty blue wall color with depth and sophistication', lightingNote: 'A livable steel-blue that reads warmer under incandescent and cleaner under daylight' },
      { hex: '#9CB8CC', name: 'Lace Crest', role: 'secondary', finish: 'Satin', application: 'Light blue linen curtains, accent pillows, or an upholstered ottoman', lightingNote: 'A soft powder blue that adds airiness to the deeper tones in the palette' },
      { hex: '#6E2B40', name: 'Royal Maroon', role: 'accent', finish: 'Semi-Gloss', application: 'A tufted velvet accent chair, decorative bookends, or candle holders', lightingNote: 'A deep plum-maroon that feels luxurious under warm light and more berry under cool LED' },
      { hex: '#B5B5B3', name: 'Dove Silver', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, radiator covers, and built-in shelving for a refined foundation', lightingNote: 'A true warm gray that complements both the cool blues and warm maroon beautifully' },
      { hex: '#A63E4E', name: "Pigeon's Eye", role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a painted fireplace mantel, or a statement mirror frame', lightingNote: 'A muted ruby that draws attention without shouting; warmer under incandescent' },
    ],
    harmony: { type: 'complementary', explanation: 'Dusty blue and deep maroon oppose each other beautifully, creating regal contrast at muted intensities. The warm gray and powder blue soften the drama into elegance.' },
    neutrals: {
      trim: { hex: '#E8E8E6', name: 'Silver Mist' },
      ceiling: { hex: '#F2F2F0', name: 'Crown White' },
      floor: { hex: '#6B5E5A', name: 'Slate Plum' },
    },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'Crowned Blue walls with maroon velvet bedding and silver accents feel regal and restful.' },
      { room: 'Living Room', rating: 5, reason: 'A distinguished living room — dusty blue walls, silver trim, and touches of deep plum.' },
      { room: 'Dining Room', rating: 5, reason: 'Formal and dramatic. This is the palette for candlelit dinner parties.' },
      { room: 'Kitchen', rating: 2, reason: 'The formal palette feels out of place in casual kitchens. Use Dove Silver on cabinets if desired.' },
      { room: 'Bathroom', rating: 3, reason: 'A master bath in Crowned Blue with silver fixtures and maroon towels is quietly luxurious.' },
    ],
    styles: ['traditional', 'art-deco', 'eclectic'],
    season: 'fall-winter',
    seasonNote: 'Deep dusty blues and rich maroons feel most regal during the cooler months. Silver accents catch winter light beautifully.',
  },
  {
    id: 12,
    name: 'Greater Bird-of-Paradise',
    scientific: 'Paradisaea apoda',
    description: 'Legendary for its complex courtship displays, the Greater Bird-of-Paradise features emerald, gold, and chestnut plumage with ornate feathers. Native to New Guinea.',
    status: 'Least Concern',
    conservation: 'While currently stable, rainforest loss in Indonesia and Papua New Guinea is an ongoing threat. These birds require large undisturbed forest territories.',
    colors: [
      { hex: '#4E8B5E', name: 'Paradise Green', role: 'secondary', finish: 'Satin', application: 'Rich emerald curtains, a tufted sofa, or an accent area rug', lightingNote: 'A muted emerald that feels lush under warm light and fresh under daylight' },
      { hex: '#C9A44E', name: 'Display Gold', role: 'accent', finish: 'Semi-Gloss', application: 'Gilded picture frames, metallic throw pillows, or a painted accent shelf', lightingNote: 'A warm antique gold that catches light beautifully; most metallic under incandescent' },
      { hex: '#6E4B32', name: 'New Guinea Mahogany', role: 'dominant', finish: 'Matte', application: 'Rich, warm brown wall color that feels like a handsome study or library', lightingNote: 'A livable chocolate-brown that reveals warm red undertones in daylight' },
      { hex: '#B8923E', name: 'Plume Amber', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a statement headboard, or the inside of display cabinets', lightingNote: 'A warm amber that glows under incandescent and reads more neutral under cool LED' },
      { hex: '#F5F2EC', name: 'Cloud Dancer', role: 'neutral', finish: 'Semi-Gloss', application: 'Clean warm white trim and ceiling to brighten the rich, dark palette', lightingNote: 'Essential warm white for preventing the palette from feeling too heavy' },
    ],
    harmony: { type: 'analogous', explanation: 'Warm greens, golds, and browns flow naturally like a rainforest canopy at golden hour. The analogous warmth creates a cocooning, luxurious atmosphere.' },
    neutrals: {
      trim: { hex: '#F5F2EC', name: 'Ivory Bark' },
      ceiling: { hex: '#F8F6F1', name: 'Canopy Filter' },
      floor: { hex: '#3D2B1F', name: 'Dark Ironwood' },
    },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'New Guinea Mahogany can make a cozy, cocooning bedroom with gold and green textile layers.' },
      { room: 'Living Room', rating: 4, reason: 'Rich and inviting — mahogany walls with emerald sofa and gold accents feel world-traveled.' },
      { room: 'Dining Room', rating: 5, reason: 'The quintessential formal dining room. Dark walls, gold lighting, and green arrangements.' },
      { room: 'Kitchen', rating: 2, reason: 'Dark brown walls can make kitchens feel small. Use mahogany on an island or lower cabinets.' },
      { room: 'Bathroom', rating: 2, reason: 'Dark palette needs significant lighting in windowless bathrooms. Best for large master baths.' },
    ],
    styles: ['mid-century', 'art-deco', 'traditional'],
    season: 'fall-winter',
    seasonNote: 'Warm mahogany, gold, and emerald evoke autumnal richness. This palette makes cold evenings feel like a fireside retreat.',
  },
  {
    id: 13,
    name: 'Double-crested Cormorant',
    scientific: 'Phalacrocorax auritus',
    description: 'These diving waterbirds are expert swimmers with dark plumage and striking stunning turquoise-blue eyes. They can be found on coastal and inland waters across North America.',
    status: 'Least Concern',
    conservation: 'Once nearly eliminated by pesticides and persecution, these birds have made an impressive recovery. They continue to thrive across North America.',
    colors: [
      { hex: '#2A2A2A', name: 'Cormorant Black', role: 'highlight', finish: 'High-Gloss', application: 'Interior doors, a bold accent wall, or sleek furniture hardware', lightingNote: 'A soft black that avoids the harshness of pure black; high-gloss finish adds dimension' },
      { hex: '#5E6E45', name: 'Bronze Sheen', role: 'secondary', finish: 'Satin', application: 'Olive linen sofa, woven grass curtains, or a textured area rug', lightingNote: 'A warm olive-drab that feels earthy under incandescent and reveals green under daylight' },
      { hex: '#3E6BA8', name: 'Sapphire Eye', role: 'accent', finish: 'Semi-Gloss', application: 'A striking decorative vase, art print, or painted accent detail', lightingNote: 'A muted sapphire that provides a cool focal point against the warm earthiness' },
      { hex: '#C8823E', name: 'Throat Glow', role: 'highlight', finish: 'Semi-Gloss', application: 'A painted bookshelf interior, decorative bowl, or pendant light detail', lightingNote: 'A warm burnt-sienna amber that energizes the dark palette under all lighting' },
      { hex: '#3E5555', name: 'Deep Dive', role: 'dominant', finish: 'Matte', application: 'A moody, sophisticated wall color for rooms that crave drama', lightingNote: 'A livable dark teal that shifts between green and charcoal depending on light' },
    ],
    harmony: { type: 'complementary', explanation: 'Dark teal walls with warm amber accents create a sophisticated complementary contrast. Olive textiles bridge the cool and warm, while muted sapphire adds depth.' },
    neutrals: {
      trim: { hex: '#E5E3DF', name: 'Coastal Fog' },
      ceiling: { hex: '#F0EFEC', name: 'Morning Overcast' },
      floor: { hex: '#3D3D3D', name: 'River Stone' },
    },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Deep Dive makes a moody, cocoon-like bedroom. Use warm textiles and keep lighting layered.' },
      { room: 'Living Room', rating: 4, reason: 'Dark walls with olive textiles and pops of amber and blue create a sophisticated den.' },
      { room: 'Dining Room', rating: 4, reason: 'Dramatic and intimate. Best for evening dining with warm candlelight.' },
      { room: 'Kitchen', rating: 2, reason: 'Too dark for most kitchens unless very well-lit with large windows.' },
      { room: 'Bathroom', rating: 3, reason: 'A spa-like bathroom if paired with natural stone and warm metals.' },
    ],
    styles: ['contemporary', 'mid-century', 'scandinavian'],
    season: 'fall-winter',
    seasonNote: 'This moody, dramatic palette thrives in the low light of shorter days. The warm amber and blue accents glow against dark walls.',
  },
];

// ============================================================
// FLOCK PAIRINGS
// ============================================================

const FLOCK_PAIRINGS = [
  {
    id: 'fp-1',
    name: 'Coastal Morning',
    birdIds: [1, 3],
    description: 'Fairy-wren blues meet mallard greens for a palette that feels like a misty morning walk along a fog-draped shoreline. Cool, collected, and deeply calming.',
    moodBoard: {
      vibe: 'Serene, natural, grounded',
      materials: 'Linen, weathered wood, sea glass, brushed nickel',
      rooms: ['Living Room', 'Bedroom', 'Sunroom'],
    },
    pairedColors: [
      { fromBird: 1, hex: '#93B5CF', toBird: 3, hex2: '#909B96', note: 'Soft powder blue walls transition naturally into green-gray in an open floor plan' },
      { fromBird: 1, hex: '#9B8B72', toBird: 3, hex2: '#7A5C42', note: 'Warm taupe and rich chestnut from both palettes unify as shared textile and flooring tones' },
      { fromBird: 1, hex: '#E8E4DE', toBird: 3, hex2: '#E8DCC8', note: 'Cool and warm off-whites alternate between rooms for subtle tonal variation' },
    ],
  },
  {
    id: 'fp-2',
    name: 'Tropical Sunset',
    birdIds: [6, 8],
    description: 'Scarlet macaw warmth collide with painted bunting jewel tones for a fearlessly colorful home. This is maximalism at its most joyful — every room a celebration.',
    moodBoard: {
      vibe: 'Bold, joyful, maximalist',
      materials: 'Velvet, hammered brass, tropical hardwood, hand-painted tile',
      rooms: ['Dining Room', 'Living Room', 'Entryway'],
    },
    pairedColors: [
      { fromBird: 6, hex: '#BF4E4E', toBird: 8, hex2: '#BF4545', note: 'Two brick-reds — macaw\'s warmer scarlet for soft furnishings, bunting\'s deeper tone for small accents' },
      { fromBird: 6, hex: '#3A6B8A', toBird: 8, hex2: '#1E3348', note: 'Dusty steel blue ranges into deep midnight navy for layered depth' },
      { fromBird: 6, hex: '#D4A94B', toBird: 8, hex2: '#C9A84E', note: 'Warm ochre-gold tones from both birds create a unified metallic thread throughout' },
    ],
  },
  {
    id: 'fp-3',
    name: 'Forest Canopy',
    birdIds: [2, 12],
    description: 'Quetzal emeralds layer with bird-of-paradise golds and mahogany for a palette that captures the dappled light of an old-growth rainforest.',
    moodBoard: {
      vibe: 'Lush, warm, enveloping',
      materials: 'Dark wood, brass, green marble, woven rattan',
      rooms: ['Study', 'Dining Room', 'Living Room'],
    },
    pairedColors: [
      { fromBird: 2, hex: '#4E8B6A', toBird: 12, hex2: '#4E8B5E', note: 'Muted sage-emeralds from both palettes create the unifying canopy color' },
      { fromBird: 2, hex: '#A63D40', toBird: 12, hex2: '#C9A44E', note: 'Deep cranberry crimson + antique gold create a rich warm accent pairing' },
      { fromBird: 2, hex: '#F0EBE0', toBird: 12, hex2: '#F5F2EC', note: 'Warm cream and ivory neutrals keep the richness from overwhelming' },
    ],
  },
  {
    id: 'fp-4',
    name: 'Twilight Garden',
    birdIds: [9, 11],
    description: 'Indigo bunting\'s blue spectrum meets the crowned pigeon\'s regal maroon for a palette that captures the magic hour when garden flowers glow against a deepening sky.',
    moodBoard: {
      vibe: 'Romantic, regal, layered',
      materials: 'Velvet, mercury glass, aged silver, fresh flowers',
      rooms: ['Bedroom', 'Living Room', 'Dining Room'],
    },
    pairedColors: [
      { fromBird: 9, hex: '#9FC5D8', toBird: 11, hex2: '#5A7F9F', note: 'Soft sky blue flows into deeper crowned blue across connected spaces' },
      { fromBird: 9, hex: '#3E2A60', toBird: 11, hex2: '#6E2B40', note: 'Deep eggplant indigo beside plum maroon creates a luxuriously dark accent pairing' },
      { fromBird: 9, hex: '#8A7560', toBird: 11, hex2: '#B5B5B3', note: 'Warm taupe and cool dove silver alternate as wood and metallic accents' },
    ],
  },
  {
    id: 'fp-5',
    name: 'Autumn Woodland',
    birdIds: [3, 13],
    description: 'Mallard\'s earthy greens and warm browns blend with the cormorant\'s dark, moody teal for a palette that captures late autumn by the water\'s edge.',
    moodBoard: {
      vibe: 'Moody, earthy, contemplative',
      materials: 'Worn leather, dark stained oak, iron hardware, wool plaid',
      rooms: ['Study', 'Living Room', 'Dining Room'],
    },
    pairedColors: [
      { fromBird: 3, hex: '#2E5E4E', toBird: 13, hex2: '#3E5555', note: 'Two deep greens — drake\'s warmer forest for features, cormorant\'s moody teal for walls' },
      { fromBird: 3, hex: '#7A5C42', toBird: 13, hex2: '#5E6E45', note: 'Saddle brown and earthy olive create a rich textile palette' },
      { fromBird: 3, hex: '#4A6FA5', toBird: 13, hex2: '#3E6BA8', note: 'Dusty blues from both birds add cool accent pops against the dark earthiness' },
    ],
  },
  {
    id: 'fp-6',
    name: 'Imperial Garden',
    birdIds: [7, 10],
    description: 'Mandarin duck\'s ornate jewel tones meet the tanager\'s tropical vibrancy for an eclectic palette inspired by botanical gardens and silk trade routes.',
    moodBoard: {
      vibe: 'Eclectic, vibrant, world-traveled',
      materials: 'Silk, lacquered wood, hand-painted ceramics, carved stone',
      rooms: ['Living Room', 'Dining Room', 'Entryway'],
    },
    pairedColors: [
      { fromBird: 7, hex: '#A64253', toBird: 10, hex2: '#C45454', note: 'Dusty raspberry and warm terra-red create a warm accent gradient from deep to bright' },
      { fromBird: 7, hex: '#4E7A52', toBird: 10, hex2: '#4A7A4E', note: 'Muted forest greens provide a grounding connection between the palettes' },
      { fromBird: 7, hex: '#8B7BAD', toBird: 10, hex2: '#3E6FA0', note: 'Muted plum and dusty cobalt create a cool counterpoint to all the warm reds and greens' },
    ],
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

const PlumagePalettes = () => {
  const [expandedBird, setExpandedBird] = useState(null);
  const [viewMode, setViewMode] = useState('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [conservationFilter, setConservationFilter] = useState('all');
  const [copiedHex, setCopiedHex] = useState(null);
  const [activeTab, setActiveTab] = useState('palettes');
  const [cardTab, setCardTab] = useState('colors');
  const [styleFilter, setStyleFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [selectedPairing, setSelectedPairing] = useState(null);
  const [guideSection, setGuideSection] = useState(null);

  const toggleBird = (id) => {
    setExpandedBird(expandedBird === id ? null : id);
    setCardTab('colors');
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex).catch((err) => console.error('Copy failed:', err));
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const filteredBirds = useMemo(() => {
    return birds.filter(bird => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        bird.name.toLowerCase().includes(searchLower) ||
        bird.scientific.toLowerCase().includes(searchLower) ||
        bird.description.toLowerCase().includes(searchLower) ||
        bird.colors.some(c => c.name.toLowerCase().includes(searchLower));
      const matchesStatus = conservationFilter === 'all' || bird.status === conservationFilter;
      const matchesStyle = styleFilter === 'all' || bird.styles.includes(styleFilter);
      const matchesSeason = seasonFilter === 'all' || bird.season === seasonFilter || bird.season === 'year-round';
      return matchesSearch && matchesStatus && matchesStyle && matchesSeason;
    });
  }, [searchTerm, conservationFilter, styleFilter, seasonFilter]);

  const valueScale = useMemo(() => {
    if (!expandedBird) return {};
    const bird = birds.find(b => b.id === expandedBird);
    if (!bird) return {};
    return Object.fromEntries(
      bird.colors.map(c => [
        c.hex,
        { tints: generateTints(c.hex), shades: generateShades(c.hex) }
      ])
    );
  }, [expandedBird]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Least Concern': return 'bg-green-100 text-green-800 border-green-300';
      case 'Near Threatened': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Threatened': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // ---- Render helpers ----

  const renderUndertone = (hex) => {
    const ut = getUndertone(hex);
    const dotColor = ut === 'warm' ? 'bg-orange-400' : ut === 'cool' ? 'bg-blue-400' : 'bg-gray-400';
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {ut}
      </span>
    );
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const renderColorSwatch = (hex, size = 'w-10 h-10', clickable = true) => (
    <div
      className={`${size} rounded-lg shadow-md border-2 border-gray-200 ${clickable ? 'cursor-pointer hover:border-gray-400' : ''} transition-all flex-shrink-0`}
      style={{ backgroundColor: hex }}
      onClick={clickable ? (e) => { e.stopPropagation(); copyToClipboard(hex); } : undefined}
      title={clickable ? `Click to copy ${hex}` : hex}
    >
      {copiedHex === hex && (
        <div className="w-full h-full flex items-center justify-center">
          <Check className="w-4 h-4" style={{ color: getTextColor(hex) }} />
        </div>
      )}
    </div>
  );

  // ---- Card Internal Tabs ----

  const renderCardColors = (bird) => (
    <div>
      <div className="space-y-3 mb-6">
        {bird.colors.map((color, idx) => (
          <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex">
              {/* Color swatch block */}
              <div
                className="w-20 min-h-[5rem] flex-shrink-0 cursor-pointer flex items-center justify-center relative"
                style={{ backgroundColor: color.hex }}
                onClick={(e) => { e.stopPropagation(); copyToClipboard(color.hex); }}
              >
                {copiedHex === color.hex && <Check className="w-5 h-5" style={{ color: getTextColor(color.hex) }} />}
              </div>
              {/* Color info */}
              <div className="flex-1 min-w-0 px-3 py-2.5">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-gray-800">{color.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${ROLE_LABELS[color.role].bg} ${ROLE_LABELS[color.role].text}`}>
                    {ROLE_LABELS[color.role].label}
                  </span>
                  {renderUndertone(color.hex)}
                </div>
                <p className="text-xs text-gray-400 font-mono mb-1">{color.hex} · {color.finish}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{color.application}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); copyToClipboard(color.hex); }}
                className="flex-shrink-0 px-3 self-center hover:bg-gray-50 rounded-lg transition-colors"
                title="Copy hex code"
              >
                {copiedHex === color.hex ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300 hover:text-gray-500" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coordinating Neutrals */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Coordinating Neutrals</p>
        <div className="flex gap-4">
          {[
            { ...bird.neutrals.trim, label: 'Trim' },
            { ...bird.neutrals.ceiling, label: 'Ceiling' },
            { ...bird.neutrals.floor, label: 'Floor' },
          ].map((n, i) => (
            <div key={i} className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(n.hex); }}>
              <div className="w-8 h-8 rounded border-2 border-gray-200 shadow-sm" style={{ backgroundColor: n.hex }} />
              <div>
                <p className="text-xs font-medium text-gray-700">{n.label}</p>
                <p className="text-[10px] text-gray-400 font-mono">{n.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCardDesignTips = (bird) => (
    <div className="space-y-5">
      {/* Harmony */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Color Harmony</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${HARMONY_COLORS[bird.harmony.type]?.bg || 'bg-gray-100'} ${HARMONY_COLORS[bird.harmony.type]?.text || 'text-gray-700'}`}>
            {bird.harmony.type}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{bird.harmony.explanation}</p>
      </div>

      {/* Room Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Best Rooms</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {bird.rooms.sort((a, b) => b.rating - a.rating).map((r, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700">{r.room}</span>
                {renderStars(r.rating)}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{r.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design Styles */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Design Styles</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {bird.styles.map(s => {
            const style = DESIGN_STYLES.find(ds => ds.id === s);
            return style ? (
              <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {style.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Season */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Season</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${SEASON_STYLES[bird.season]?.bg} ${SEASON_STYLES[bird.season]?.text}`}>
            {SEASON_STYLES[bird.season]?.label}
          </span>
        </div>
        <p className="text-sm text-gray-600">{bird.seasonNote}</p>
      </div>

      {/* Lighting Notes */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Lighting Notes</span>
        </div>
        <div className="space-y-2">
          {bird.colors.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded flex-shrink-0 mt-0.5 border border-gray-200" style={{ backgroundColor: c.hex }} />
              <div>
                <span className="text-xs font-medium text-gray-700">{c.name}: </span>
                <span className="text-xs text-gray-500">{c.lightingNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCardValueScale = (bird) => (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Info className="w-3 h-3" />
        Click any swatch to copy its hex code. Center swatch is the original color.
      </p>
      {bird.colors.map((color, idx) => {
        const scale = valueScale[color.hex];
        if (!scale) return null;
        const allColors = [...scale.tints.slice().reverse(), color.hex, ...scale.shades];
        const centerIdx = scale.tints.length;
        return (
          <div key={idx}>
            <p className="text-xs font-semibold text-gray-700 mb-2">{color.name}</p>
            <div className="flex rounded-lg overflow-hidden shadow-md">
              {allColors.map((hex, i) => (
                <div
                  key={i}
                  className={`flex-1 h-10 cursor-pointer transition-all hover:scale-y-110 ${i === centerIdx ? 'ring-2 ring-gray-800 ring-inset z-10' : ''}`}
                  style={{ backgroundColor: hex }}
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(hex); }}
                  title={hex}
                >
                  {copiedHex === hex && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="w-3 h-3" style={{ color: getTextColor(hex) }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex mt-1">
              {allColors.map((hex, i) => (
                <p key={i} className={`flex-1 text-center text-[9px] font-mono ${i === centerIdx ? 'font-bold text-gray-700' : 'text-gray-400'}`}>
                  {hex}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ---- Flock Pairings ----

  const renderFlockPairings = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Flock Pairings</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Curated combinations of two bird palettes that work beautifully together. Mix and match across species for richer, more layered interior design schemes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {FLOCK_PAIRINGS.map(pairing => {
          const bird1 = birds.find(b => b.id === pairing.birdIds[0]);
          const bird2 = birds.find(b => b.id === pairing.birdIds[1]);
          if (!bird1 || !bird2) return null;
          const isExpanded = selectedPairing === pairing.id;

          return (
            <div key={pairing.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-800">{pairing.name}</h3>
                </div>

                {/* Bird names */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">{bird1.name}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{bird2.name}</span>
                </div>

                {/* Combined color strips */}
                <div className="flex mb-4 rounded-lg overflow-hidden shadow-md">
                  {bird1.colors.map((c, i) => (
                    <div
                      key={`a${i}`}
                      className="flex-1 h-10 cursor-pointer hover:h-12 transition-all"
                      style={{ backgroundColor: c.hex }}
                      title={`${bird1.name}: ${c.name} (${c.hex})`}
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(c.hex); }}
                    />
                  ))}
                  <div className="w-0.5 bg-white/60" />
                  {bird2.colors.map((c, i) => (
                    <div
                      key={`b${i}`}
                      className="flex-1 h-10 cursor-pointer hover:h-12 transition-all"
                      style={{ backgroundColor: c.hex }}
                      title={`${bird2.name}: ${c.name} (${c.hex})`}
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(c.hex); }}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">{pairing.description}</p>

                {/* Mood Board */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-4">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Mood Board</p>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-700"><span className="font-medium">Vibe:</span> {pairing.moodBoard.vibe}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Materials:</span> {pairing.moodBoard.materials}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Best in:</span> {pairing.moodBoard.rooms.join(', ')}</p>
                  </div>
                </div>

                {/* Expandable paired colors */}
                <button
                  onClick={() => setSelectedPairing(isExpanded ? null : pairing.id)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isExpanded ? 'Hide' : 'View'} Paired Color Details
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    {pairing.pairedColors.map((pc, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                        <div
                          className="w-10 h-10 rounded-md shadow-sm flex-shrink-0 cursor-pointer border border-gray-200/60 hover:shadow-md transition-shadow"
                          style={{ backgroundColor: pc.hex }}
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(pc.hex); }}
                          title={`Click to copy ${pc.hex}`}
                        />
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-3" />
                        <div
                          className="w-10 h-10 rounded-md shadow-sm flex-shrink-0 cursor-pointer border border-gray-200/60 hover:shadow-md transition-shadow"
                          style={{ backgroundColor: pc.hex2 }}
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(pc.hex2); }}
                          title={`Click to copy ${pc.hex2}`}
                        />
                        <p className="text-xs text-gray-600 flex-1 leading-relaxed pt-0.5">{pc.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ---- Design Guide ----

  const renderDesignGuide = () => {
    const sections = [
      {
        id: 'rule',
        icon: <Layers className="w-5 h-5" />,
        title: 'The 60-30-10 Rule',
        content: (
          <div>
            <p className="text-sm text-gray-600 mb-4">The foundation of balanced interior color schemes. This ratio ensures visual harmony without monotony.</p>
            <div className="flex gap-3 mb-4 h-32">
              <div className="flex-[6] bg-emerald-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-800">60%</p>
                  <p className="text-xs text-emerald-700 font-medium">Dominant</p>
                  <p className="text-[10px] text-emerald-600">Walls, large surfaces</p>
                </div>
              </div>
              <div className="flex-[3] bg-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-800">30%</p>
                  <p className="text-xs text-blue-700 font-medium">Secondary</p>
                  <p className="text-[10px] text-blue-600">Textiles, upholstery</p>
                </div>
              </div>
              <div className="flex-[1] bg-amber-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-800">10%</p>
                  <p className="text-[10px] text-amber-700 font-medium">Accent</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Each Plumage Palette has pre-assigned roles so you can apply this rule immediately. Look for the <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">60% Walls</span>, <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">30% Textiles</span>, and <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">10% Accents</span> badges on each color.</p>
          </div>
        ),
      },
      {
        id: 'finishes',
        icon: <Paintbrush className="w-5 h-5" />,
        title: 'Paint Finish Guide',
        content: (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">Finish</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">Sheen Level</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-semibold">Best For</th>
                  <th className="text-left py-2 text-gray-600 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Matte</td><td className="py-2 pr-4">None</td><td className="py-2 pr-4">Ceilings, low-traffic walls</td><td className="py-2">Hides imperfections; harder to clean</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Eggshell</td><td className="py-2 pr-4">Slight</td><td className="py-2 pr-4">Living rooms, bedrooms</td><td className="py-2">Best all-around wall finish; soft look, washable</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Satin</td><td className="py-2 pr-4">Moderate</td><td className="py-2 pr-4">Kitchens, baths, textiles</td><td className="py-2">Durable and moisture-resistant; shows some imperfections</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Semi-Gloss</td><td className="py-2 pr-4">Notable</td><td className="py-2 pr-4">Trim, doors, cabinets</td><td className="py-2">Easy to clean; provides definition against matte walls</td></tr>
                <tr><td className="py-2 pr-4 font-medium">High-Gloss</td><td className="py-2 pr-4">Maximum</td><td className="py-2 pr-4">Accent pieces, front doors</td><td className="py-2">Dramatic and reflective; shows every flaw, so prep well</td></tr>
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: 'lighting',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Lighting & Color',
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Paint color is only as good as the light it lives in. The same color can look dramatically different depending on your light source.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-bold text-amber-800">Warm Light</p>
                </div>
                <p className="text-xs text-amber-700">Incandescent and warm LED (2700K). Enhances reds, oranges, and yellows. Can make blues and greens appear dull or muddy.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-bold text-blue-800">Cool Light</p>
                </div>
                <p className="text-xs text-blue-700">Cool LED and fluorescent (4000K+). Enhances blues and greens. Can make warm colors feel washed out or pink.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-bold text-green-800">Natural Daylight</p>
                </div>
                <p className="text-xs text-green-700">Shows the truest color. North-facing rooms get cooler light; south-facing rooms get warmer light. Always test paint in your room.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Pro Tip</p>
              <p className="text-sm text-gray-600">Always paint a large swatch (at least 12" x 12") and observe it at morning, noon, and evening before committing. Each Plumage color includes specific lighting notes to help you anticipate shifts.</p>
            </div>
          </div>
        ),
      },
      {
        id: 'styles',
        icon: <BookOpen className="w-5 h-5" />,
        title: 'Style Directory',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">Each Plumage Palette is tagged with design styles it naturally complements. Use this directory to find the perfect palette for your aesthetic.</p>
            {DESIGN_STYLES.map(style => {
              const matchingBirds = birds.filter(b => b.styles.includes(style.id));
              return (
                <div key={style.id} className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{style.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{style.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {matchingBirds.map(b => (
                      <button
                        key={b.id}
                        onClick={() => { setActiveTab('palettes'); setStyleFilter(style.id); }}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-100 transition-colors"
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ),
      },
    ];

    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Interior Design Guide</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Everything you need to confidently apply Plumage Palettes in your home. From color theory to practical finish recommendations.
          </p>
        </div>
        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setGuideSection(guideSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600">{section.icon}</span>
                  <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                </div>
                {guideSection === section.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {guideSection === section.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-900 text-white py-16 md:py-24 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 flex justify-center">
            <Heart className="w-12 h-12 text-rose-300" fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Plumage Palettes
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-3 font-light">
            Your Interior Design Companion Inspired by Nature
          </p>
          <p className="text-base text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Expert color palettes drawn from the world's most spectacular birds. Complete with the 60-30-10 rule, room recommendations, finish guides, and curated palette pairings.
          </p>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm md:text-base text-emerald-50 flex items-center justify-center gap-2">
              <span className="text-rose-300">&#9830;</span> A portion of proceeds supports bird conservation through the National Audubon Society <span className="text-rose-300">&#9830;</span>
            </p>
          </div>
        </div>
      </div>

      {/* Top-Level Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-1 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 max-w-lg mx-auto">
          {[
            { id: 'palettes', label: 'Palettes', icon: <Palette className="w-4 h-4" /> },
            { id: 'pairings', label: 'Flock Pairings', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'guide', label: 'Design Guide', icon: <BookOpen className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ---- PALETTES TAB ---- */}
        {activeTab === 'palettes' && (
          <>
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Search</label>
                <input
                  type="text"
                  placeholder="Find a bird or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Conservation</label>
                <select
                  value={conservationFilter}
                  onChange={(e) => setConservationFilter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white text-sm"
                >
                  <option value="all">All Species</option>
                  <option value="Least Concern">Least Concern</option>
                  <option value="Near Threatened">Near Threatened</option>
                  <option value="Threatened">Threatened</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Design Style</label>
                <select
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white text-sm"
                >
                  <option value="all">All Styles</option>
                  {DESIGN_STYLES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Season</label>
                <select
                  value={seasonFilter}
                  onChange={(e) => setSeasonFilter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white text-sm"
                >
                  <option value="all">All Seasons</option>
                  <option value="spring-summer">Spring / Summer</option>
                  <option value="fall-winter">Fall / Winter</option>
                  <option value="year-round">Year-Round</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">View</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode('gallery')}
                    className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      viewMode === 'gallery'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border-2 border-amber-200 text-gray-600 hover:border-emerald-400'
                    }`}
                  >
                    Gallery
                  </button>
                  <button
                    onClick={() => setViewMode('palette')}
                    className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      viewMode === 'palette'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border-2 border-amber-200 text-gray-600 hover:border-emerald-400'
                    }`}
                  >
                    Palette
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery View */}
            {viewMode === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBirds.map((bird) => (
                  <div
                    key={bird.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-6 cursor-pointer" onClick={() => toggleBird(bird.id)}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{bird.name}</h3>
                          <p className="text-sm text-gray-500 italic">{bird.scientific}</p>
                        </div>
                        {expandedBird === bird.id ? (
                          <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>

                      {/* Badges row */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(bird.status)}`}>
                          {bird.status}
                        </span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${HARMONY_COLORS[bird.harmony.type]?.bg} ${HARMONY_COLORS[bird.harmony.type]?.text}`}>
                          {bird.harmony.type}
                        </span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${SEASON_STYLES[bird.season]?.bg} ${SEASON_STYLES[bird.season]?.text}`}>
                          {SEASON_STYLES[bird.season]?.label}
                        </span>
                      </div>

                      {/* Color Swatches Preview — paint chip style */}
                      <div className="flex gap-2 mb-4">
                        {bird.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col cursor-pointer group"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(color.hex); }}
                            title={`${color.name} — ${color.hex}\n${ROLE_LABELS[color.role].label}`}
                          >
                            {/* Paint chip body */}
                            <div className="rounded-t-md shadow-md overflow-hidden border border-gray-200/60 group-hover:shadow-lg transition-shadow">
                              <div className="w-full" style={{ backgroundColor: color.hex, paddingBottom: '120%' }} />
                              <div className="bg-white px-1.5 py-1.5 border-t border-gray-100">
                                <p className="text-[9px] font-semibold text-gray-700 leading-tight truncate">{color.name}</p>
                                <p className="text-[8px] text-gray-400 font-mono">{color.hex}</p>
                              </div>
                            </div>
                            <span className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold self-center ${ROLE_LABELS[color.role].bg} ${ROLE_LABELS[color.role].text}`}>
                              {color.role === 'dominant' ? '60%' : color.role === 'secondary' ? '30%' : color.role === 'accent' ? '10%' : color.role === 'neutral' ? 'T' : 'F'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Style tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {bird.styles.map(s => {
                          const style = DESIGN_STYLES.find(ds => ds.id === s);
                          return style ? (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">{style.label}</span>
                          ) : null;
                        })}
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{bird.description}</p>
                    </div>

                    {/* Expanded Content */}
                    {expandedBird === bird.id && (
                      <div className="border-t-2 border-amber-100">
                        {/* Internal tab bar */}
                        <div className="flex border-b border-gray-200 px-6 pt-3">
                          {[
                            { id: 'colors', label: 'Colors', icon: <Palette className="w-3.5 h-3.5" /> },
                            { id: 'tips', label: 'Design Tips', icon: <Lightbulb className="w-3.5 h-3.5" /> },
                            { id: 'scale', label: 'Value Scale', icon: <Layers className="w-3.5 h-3.5" /> },
                          ].map(tab => (
                            <button
                              key={tab.id}
                              onClick={(e) => { e.stopPropagation(); setCardTab(tab.id); }}
                              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                                cardTab === tab.id
                                  ? 'border-emerald-600 text-emerald-700'
                                  : 'border-transparent text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {tab.icon}
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        <div className="px-6 py-6 bg-gradient-to-b from-orange-50 to-amber-50">
                          {cardTab === 'colors' && renderCardColors(bird)}
                          {cardTab === 'tips' && renderCardDesignTips(bird)}
                          {cardTab === 'scale' && renderCardValueScale(bird)}

                          {/* Conservation Note */}
                          <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500 mt-6">
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Conservation</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{bird.conservation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Palette View */}
            {viewMode === 'palette' && (
              <div className="space-y-8">
                {filteredBirds.map((bird) => (
                  <div key={bird.id} className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{bird.name}</h3>
                        <p className="text-sm text-gray-500 italic">{bird.scientific}</p>
                      </div>
                      <div className="flex gap-2">
                        {bird.styles.map(s => {
                          const style = DESIGN_STYLES.find(ds => ds.id === s);
                          return style ? (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hidden sm:inline">{style.label}</span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">{bird.harmony.explanation}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                      {bird.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="cursor-pointer group"
                          onClick={() => copyToClipboard(color.hex)}
                        >
                          {/* Large paint chip */}
                          <div className="rounded-lg shadow-md overflow-hidden border border-gray-200/60 group-hover:shadow-xl group-hover:border-emerald-300 transition-all">
                            <div className="relative" style={{ backgroundColor: color.hex, paddingBottom: '100%' }}>
                              {copiedHex === color.hex && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Check className="w-6 h-6" style={{ color: getTextColor(color.hex) }} />
                                </div>
                              )}
                            </div>
                            <div className="bg-white px-3 py-2.5 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-gray-800 truncate">{color.name}</p>
                                {renderUndertone(color.hex)}
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 font-mono group-hover:text-emerald-600 transition-colors">{color.hex}</p>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${ROLE_LABELS[color.role].bg} ${ROLE_LABELS[color.role].text}`}>
                                  {ROLE_LABELS[color.role].label}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                <Paintbrush className="w-2.5 h-2.5" />
                                {color.finish}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coordinating neutrals inline */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Neutrals:</span>
                      {[
                        { ...bird.neutrals.trim, label: 'Trim' },
                        { ...bird.neutrals.ceiling, label: 'Ceiling' },
                        { ...bird.neutrals.floor, label: 'Floor' },
                      ].map((n, i) => (
                        <div key={i} className="flex items-center gap-2 cursor-pointer" onClick={() => copyToClipboard(n.hex)}>
                          <div className="w-6 h-6 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: n.hex }} />
                          <span className="text-xs text-gray-500">{n.label} <span className="font-mono">{n.hex}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredBirds.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No birds found matching your criteria.</p>
                <button
                  onClick={() => { setSearchTerm(''); setConservationFilter('all'); setStyleFilter('all'); setSeasonFilter('all'); }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* ---- FLOCK PAIRINGS TAB ---- */}
        {activeTab === 'pairings' && renderFlockPairings()}

        {/* ---- DESIGN GUIDE TAB ---- */}
        {activeTab === 'guide' && renderDesignGuide()}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-16 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-700">
            <div>
              <h4 className="text-xl font-bold mb-4 text-amber-300">Plumage Palettes</h4>
              <p className="text-slate-300 leading-relaxed mb-4">
                Where Nature Meets Design — Transform your spaces with expertly curated color palettes inspired by the world's most spectacular birds. Complete with interior design guidance, room recommendations, and professional finish advice.
              </p>
              <p className="text-sm text-slate-400 italic">
                Many of the world's most beautiful birds are also the most endangered. Bird poaching remains a serious global problem, even in first-world countries.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-amber-300">Conservation Partnership</h4>
              <p className="text-slate-300 leading-relaxed mb-4">
                A portion of proceeds supports bird conservation through the National Audubon Society.
              </p>
              <a
                href="https://www.audubon.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold transition-colors"
              >
                Learn More at Audubon
              </a>
            </div>
          </div>
          <div className="text-center text-slate-400 text-sm">
            <p>&copy; 2026 Plumage Palettes. Celebrating the beauty and fragility of our planet's avian species.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlumagePalettes;
