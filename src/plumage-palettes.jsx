import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, Copy, Check, Heart,
  Sun, Snowflake, Palette, Home, Paintbrush,
  Lightbulb, Layers, Sparkles, BookOpen, Star,
  Leaf, Info, ArrowRight, Eye, MessageCircle, X,
  Send, Settings, Loader2
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
  {
    id: 14,
    name: 'Atlantic Puffin',
    scientific: 'Fratercula arctica',
    description: 'With its striking black-and-white plumage and colorful beak, the Atlantic Puffin is one of the most beloved seabirds. These expert divers nest in coastal burrows across the North Atlantic.',
    status: 'Vulnerable',
    conservation: 'Climate change is shifting fish populations away from puffin colonies, causing breeding failures. North Atlantic warming is the primary long-term threat.',
    colors: [
      { hex: '#2F3133', name: 'Puffin Charcoal', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a bold accent wall, or sleek built-in shelving', lightingNote: 'A warm charcoal that reads softer than true black; shows subtle warmth under incandescent' },
      { hex: '#F2EDE6', name: 'Arctic Breast', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceilings, and wainscoting for clean contrast against the darks', lightingNote: 'A warm cream-white that glows gently under warm bulbs' },
      { hex: '#C47A3A', name: 'Beak Orange', role: 'accent', finish: 'Semi-Gloss', application: 'Decorative throw pillows, a painted stool, or ceramic accessories', lightingNote: 'A rich burnt orange that warms any space; most vivid under natural daylight' },
      { hex: '#4A5C6B', name: 'North Sea Slate', role: 'dominant', finish: 'Eggshell', application: 'A sophisticated cool gray-blue wall color that anchors the room', lightingNote: 'Shifts between blue and gray depending on light — always interesting' },
      { hex: '#D4CBC0', name: 'Pebble Shore', role: 'secondary', finish: 'Satin', application: 'Linen curtains, a large woven rug, or upholstered headboard', lightingNote: 'A warm greige that bridges the cool slate and warm orange beautifully' },
    ],
    harmony: { type: 'complementary', explanation: 'Cool slate-blue walls oppose the warm burnt orange accents for a crisp, nautical contrast. The greige and cream keep everything livable.' },
    neutrals: { trim: { hex: '#F2EDE6', name: 'Coastal Cream' }, ceiling: { hex: '#F7F5F2', name: 'Sea Mist' }, floor: { hex: '#6B5E50', name: 'Driftwood' } },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'North Sea Slate makes a calm, collected bedroom. Add orange accents sparingly for warmth.' },
      { room: 'Living Room', rating: 5, reason: 'The quintessential modern coastal living room — slate walls, cream trim, orange pops.' },
      { room: 'Dining Room', rating: 3, reason: 'Works for casual dining. The cool tones need warm lighting to feel inviting.' },
      { room: 'Kitchen', rating: 4, reason: 'Slate lower cabinets with cream uppers and orange hardware is striking.' },
      { room: 'Bathroom', rating: 4, reason: 'A spa bathroom with coastal character. Pair with white subway tile and brass fixtures.' },
    ],
    styles: ['coastal', 'scandinavian', 'contemporary'],
    season: 'year-round',
    seasonNote: 'Cool grays and warm orange work in every season — breezy in summer, cozy in winter with added textiles.',
  },
  {
    id: 15,
    name: 'Lilac-breasted Roller',
    scientific: 'Coracias caudatus',
    description: 'Africa\'s most photographed bird, the Lilac-breasted Roller displays an extraordinary palette of pastel blues, lilacs, and warm earth tones. Found across sub-Saharan Africa.',
    status: 'Least Concern',
    conservation: 'While currently stable, habitat conversion for agriculture threatens savanna species across Africa. Protected areas remain essential.',
    colors: [
      { hex: '#9CAAB8', name: 'Roller Sky', role: 'dominant', finish: 'Eggshell', application: 'A serene, dusty blue-gray wall color that opens up any room', lightingNote: 'Reads bluer in daylight and grayer under warm bulbs — always soft and livable' },
      { hex: '#8E7BA0', name: 'Lilac Wing', role: 'secondary', finish: 'Satin', application: 'Velvet curtains, accent pillows, or an upholstered armchair', lightingNote: 'A muted lavender that shows more warmth under incandescent and more blue under cool LED' },
      { hex: '#5A8F7A', name: 'Savanna Jade', role: 'accent', finish: 'Semi-Gloss', application: 'A painted plant shelf, ceramic vases, or a feature bookcase', lightingNote: 'A sophisticated sage-teal that feels fresh and grounding in any light' },
      { hex: '#B67D5E', name: 'Cinnamon Breast', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a painted console, or decorative wood accents', lightingNote: 'A warm terracotta-tan that adds essential warmth to the cool palette' },
      { hex: '#EDE8E0', name: 'Dust Cloud', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceilings, and built-in details for a warm, clean foundation', lightingNote: 'A barely-warm white that lets the pastels sing without competing' },
    ],
    harmony: { type: 'analogous', explanation: 'Soft blue, lilac, and jade sit in a gentle arc of cool pastels, while cinnamon adds an essential warm counterpoint that keeps the palette from feeling cold.' },
    neutrals: { trim: { hex: '#EDE8E0', name: 'African Dust' }, ceiling: { hex: '#F5F3F0', name: 'Open Savanna' }, floor: { hex: '#8A7868', name: 'Acacia Wood' } },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'A dreamy pastel bedroom — Roller Sky walls with lilac bedding and jade accents.' },
      { room: 'Living Room', rating: 4, reason: 'Soft and sophisticated. Layer the pastels with warm wood and cinnamon textiles.' },
      { room: 'Dining Room', rating: 3, reason: 'Better for brunch than formal dinner — the pastels feel light and casual.' },
      { room: 'Kitchen', rating: 3, reason: 'Roller Sky on cabinets with brass hardware and sage accents feels fresh.' },
      { room: 'Bathroom', rating: 5, reason: 'The ultimate feminine spa bathroom — soft pastels with warm metallic fixtures.' },
    ],
    styles: ['bohemian', 'contemporary', 'scandinavian'],
    season: 'spring-summer',
    seasonNote: 'These soft pastels feel most alive in spring light. Layer warm textiles in winter to keep the palette cozy.',
  },
  {
    id: 16,
    name: 'Golden Pheasant',
    scientific: 'Chrysolophus pictus',
    description: 'One of the most ornate birds in the world, the male Golden Pheasant boasts a golden crest, crimson body, and multi-colored tail. Native to Chinese mountain forests.',
    status: 'Least Concern',
    conservation: 'While stable in captivity, wild populations in China face pressure from habitat loss and hunting. Mountain forest conservation is key.',
    colors: [
      { hex: '#C49A3E', name: 'Pheasant Gold', role: 'dominant', finish: 'Eggshell', application: 'A rich, warm golden wall color that envelops a room in luxury', lightingNote: 'Glows beautifully under warm light; reads more neutral and sophisticated under daylight' },
      { hex: '#8E3A3A', name: 'Crimson Cape', role: 'accent', finish: 'Semi-Gloss', application: 'A tufted velvet armchair, lacquered tray, or statement art frame', lightingNote: 'Deep wine-red that feels rich without being aggressive; warmer under incandescent' },
      { hex: '#2E5A7A', name: 'Tail Sapphire', role: 'secondary', finish: 'Satin', application: 'Rich blue curtains, a large patterned rug, or upholstered sofa', lightingNote: 'A muted navy-teal that deepens under warm light and reads more vibrant under daylight' },
      { hex: '#5A7A3E', name: 'Forest Mantle', role: 'highlight', finish: 'Semi-Gloss', application: 'Painted interior doors, a garden room accent, or a feature cabinet', lightingNote: 'A muted olive that reads greener under daylight and more golden under incandescent' },
      { hex: '#F0EADE', name: 'Plume Ivory', role: 'neutral', finish: 'Semi-Gloss', application: 'Warm trim and ceiling to give these rich colors breathing room', lightingNote: 'A warm cream that glows golden under incandescent and reads clean under daylight' },
    ],
    harmony: { type: 'triadic', explanation: 'Gold, sapphire blue, and crimson red form a rich triadic scheme — each muted enough to coexist luxuriously. Olive green adds earthiness.' },
    neutrals: { trim: { hex: '#F0EADE', name: 'Silk Ivory' }, ceiling: { hex: '#F5F2EB', name: 'Lantern Light' }, floor: { hex: '#5C4033', name: 'Mountain Teak' } },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Golden walls can feel cozy for bold sleepers. Pair with sapphire bedding and cream linens.' },
      { room: 'Living Room', rating: 5, reason: 'A showstopping living room — golden walls, blue sofa, crimson accents. Opulent and warm.' },
      { room: 'Dining Room', rating: 5, reason: 'Born for dining rooms. Warm gold walls with candlelight create an unforgettable atmosphere.' },
      { room: 'Kitchen', rating: 3, reason: 'Use gold on an island or backsplash. Full walls may overwhelm a small kitchen.' },
      { room: 'Bathroom', rating: 2, reason: 'Too warm and ornate for most bathrooms. Reserve for a dramatic powder room.' },
    ],
    styles: ['art-deco', 'traditional', 'eclectic'],
    season: 'fall-winter',
    seasonNote: 'Warm golds and deep reds feel most regal during autumn and the holiday season. This palette glows by firelight.',
  },
  {
    id: 17,
    name: 'Blue Jay',
    scientific: 'Cyanocitta cristata',
    description: 'Bold, intelligent, and unmistakable, the Blue Jay is a backyard icon across eastern North America. Known for its striking blue crest and loud calls.',
    status: 'Least Concern',
    conservation: 'Blue Jays are adaptable and thriving, though they benefit from mature oak forests. Backyard feeding and native plantings support local populations.',
    colors: [
      { hex: '#7A9BB5', name: 'Jay Wing', role: 'dominant', finish: 'Eggshell', application: 'A comfortable mid-blue wall color — confident but not overwhelming', lightingNote: 'Reads as a true mid-blue in daylight; takes on a softer gray-blue under warm bulbs' },
      { hex: '#4A6080', name: 'Crest Blue', role: 'secondary', finish: 'Satin', application: 'A rich blue upholstered sofa, heavy curtains, or a painted accent cabinet', lightingNote: 'A deeper blue that provides layered depth to the lighter wall color' },
      { hex: '#F0EDE8', name: 'Belly White', role: 'neutral', finish: 'Semi-Gloss', application: 'Clean trim, ceiling, and window casings for sharp blue-white contrast', lightingNote: 'A warm white that prevents the blues from feeling clinical' },
      { hex: '#2D3640', name: 'Necklace Band', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior door frames, a fireplace surround, or picture rail', lightingNote: 'A dramatic dark blue-charcoal that anchors the palette with gravitas' },
      { hex: '#C4BAB0', name: 'Branch Gray', role: 'secondary', finish: 'Satin', application: 'A warm gray area rug, linen throw blankets, or a woven bench', lightingNote: 'A warm gray that bridges the cool blues and warm white' },
    ],
    harmony: { type: 'monochromatic', explanation: 'A graduated spectrum from soft blue to deep blue-black, with warm gray and white providing essential tonal breaks. Clean and confident.' },
    neutrals: { trim: { hex: '#F0EDE8', name: 'Snow White' }, ceiling: { hex: '#F5F3F0', name: 'Winter Sky' }, floor: { hex: '#7A6B5E', name: 'Oak Branch' } },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'Jay Wing is a calming bedroom blue. Layer the deeper blues through bedding and curtains.' },
      { room: 'Living Room', rating: 5, reason: 'Classic blue living room — layered blues with warm white and gray create timeless appeal.' },
      { room: 'Dining Room', rating: 3, reason: 'Needs warm lighting and metallic accents to keep the blues from feeling too cool.' },
      { room: 'Kitchen', rating: 4, reason: 'Blue cabinets with white countertops and warm wood island is a perennial favorite.' },
      { room: 'Bathroom', rating: 4, reason: 'A crisp, nautical bathroom with layered blues and white fixtures.' },
    ],
    styles: ['coastal', 'contemporary', 'traditional'],
    season: 'year-round',
    seasonNote: 'True blues are seasonless — fresh in summer, layered and cozy in winter. Add warm textiles in cold months.',
  },
  {
    id: 18,
    name: 'Northern Cardinal',
    scientific: 'Cardinalis cardinalis',
    description: 'Perhaps North America\'s most beloved backyard bird, the male Northern Cardinal\'s vibrant red plumage against winter snow is an iconic image. They sing year-round.',
    status: 'Least Concern',
    conservation: 'Cardinals are thriving and expanding their range northward. Backyard feeders and native berry bushes support healthy populations.',
    colors: [
      { hex: '#A84848', name: 'Cardinal Red', role: 'accent', finish: 'Semi-Gloss', application: 'A statement accent wall, velvet throw pillows, or a painted front door', lightingNote: 'A sophisticated brick-red that glows warmly under incandescent and reads slightly cooler in daylight' },
      { hex: '#8A7568', name: 'Winter Perch', role: 'secondary', finish: 'Satin', application: 'A warm taupe sofa, linen curtains, or a large woven rug', lightingNote: 'A grounding warm taupe that supports the red without competing' },
      { hex: '#C4823A', name: 'Beak Amber', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, lamp bases, or a painted bookshelf interior', lightingNote: 'A warm amber-orange that energizes the earthy palette' },
      { hex: '#3D3538', name: 'Mask Black', role: 'highlight', finish: 'Semi-Gloss', application: 'Window frames, iron hardware, or sleek furniture legs', lightingNote: 'A warm near-black that adds drama without the starkness of pure black' },
      { hex: '#EDE5DA', name: 'Snow Drift', role: 'dominant', finish: 'Eggshell', application: 'Warm off-white walls that provide a serene backdrop for the rich red and taupe accents', lightingNote: 'A warm cream that reads inviting and lets the reds and taupes take center stage' },
    ],
    harmony: { type: 'complementary', explanation: 'Warm red against a soft neutral backdrop creates a classic, timeless look. The taupe and amber add warmth without competing with the star color.' },
    neutrals: { trim: { hex: '#F5F2ED', name: 'First Snow' }, ceiling: { hex: '#FAF8F5', name: 'Winter Morning' }, floor: { hex: '#6B5848', name: 'Frozen Oak' } },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Use Cardinal Red sparingly — a headboard wall or rich bedding against warm cream walls.' },
      { room: 'Living Room', rating: 5, reason: 'Warm white walls with a red accent and taupe textiles — welcoming and classic.' },
      { room: 'Dining Room', rating: 5, reason: 'Red is the ultimate dining room accent. Warm and appetite-stimulating.' },
      { room: 'Kitchen', rating: 3, reason: 'A red-painted island or red accessories against warm white cabinets adds personality.' },
      { room: 'Bathroom', rating: 2, reason: 'Red can be overwhelming in small bathrooms. Use as towel and accessory accents only.' },
    ],
    styles: ['traditional', 'farmhouse', 'eclectic'],
    season: 'fall-winter',
    seasonNote: 'Rich reds against warm whites evoke the quintessential winter scene. This palette feels most magical during the holidays.',
  },
  {
    id: 19,
    name: 'Keel-billed Toucan',
    scientific: 'Ramphastos sulfuratus',
    description: 'Central America\'s national bird of Belize, the Keel-billed Toucan is famous for its oversized rainbow-colored bill. These social birds roost in tree cavities in small flocks.',
    status: 'Least Concern',
    conservation: 'Deforestation in Central America threatens toucan habitat. These birds need mature trees with large cavities for nesting.',
    colors: [
      { hex: '#2B3028', name: 'Jungle Plumage', role: 'highlight', finish: 'Semi-Gloss', application: 'A dramatic front door, bold fireplace wall, or stately built-in shelving', lightingNote: 'A warm near-black with green undertones that reveals depth in bright light' },
      { hex: '#507A4A', name: 'Canopy Perch', role: 'dominant', finish: 'Eggshell', application: 'A lush forest-green wall color that makes a room feel like a tropical retreat', lightingNote: 'Rich green that deepens under warm light and feels vivid under daylight' },
      { hex: '#D4A040', name: 'Beak Gold', role: 'accent', finish: 'Semi-Gloss', application: 'Metallic lamp bases, gilded frames, or a painted accent shelf', lightingNote: 'A warm goldenrod that catches light and adds tropical warmth' },
      { hex: '#BF5A3A', name: 'Beak Ember', role: 'accent', finish: 'Semi-Gloss', application: 'Decorative ceramics, a single throw pillow, or a painted planter', lightingNote: 'A warm terra-orange that pops against the greens without overwhelming' },
      { hex: '#F2EDE4', name: 'Belize Cream', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim and ceiling to prevent the deep greens from becoming too heavy', lightingNote: 'A warm ivory that balances the bold palette with lightness' },
    ],
    harmony: { type: 'split-complementary', explanation: 'Forest green splits to warm gold and terra-orange complements, creating a vibrant tropical palette. The near-black adds drama and the cream provides relief.' },
    neutrals: { trim: { hex: '#F2EDE4', name: 'Tropical White' }, ceiling: { hex: '#F8F5F0', name: 'Cloud Break' }, floor: { hex: '#4A3828', name: 'Hardwood Dark' } },
    rooms: [
      { room: 'Bedroom', rating: 2, reason: 'Too energizing for sleep. Reserve for a daring guest room or a tropical accent wall.' },
      { room: 'Living Room', rating: 4, reason: 'Green walls with gold and orange accents make a stunning tropical living room.' },
      { room: 'Dining Room', rating: 5, reason: 'Lush green with warm metallics creates an unforgettable dining experience.' },
      { room: 'Kitchen', rating: 3, reason: 'Green lower cabinets with cream uppers and gold hardware is bold and beautiful.' },
      { room: 'Bathroom', rating: 3, reason: 'A powder room in Canopy Perch with brass fixtures is a tropical escape.' },
    ],
    styles: ['tropical', 'eclectic', 'bohemian'],
    season: 'year-round',
    seasonNote: 'Tropical greens and warm metallics feel lush in summer and festive in winter. Confidence is the only requirement.',
  },
  {
    id: 20,
    name: 'Greater Flamingo',
    scientific: 'Phoenicopterus roseus',
    description: 'The iconic flamingo, famous for its pink plumage derived from carotenoid pigments in their diet. These graceful waders form massive colonies across Africa, Asia, and Southern Europe.',
    status: 'Least Concern',
    conservation: 'Wetland drainage and pollution threaten flamingo habitats worldwide. Saline lake conservation is critical for breeding colonies.',
    colors: [
      { hex: '#D4A0A0', name: 'Flamingo Blush', role: 'dominant', finish: 'Eggshell', application: 'A soft, warm pink wall color — sophisticated and far from bubblegum', lightingNote: 'Reads as a mature dusty rose in daylight; gains warmth under incandescent' },
      { hex: '#E8C4B8', name: 'Coral Feather', role: 'secondary', finish: 'Satin', application: 'Linen curtains, a large area rug, or upholstered dining chairs', lightingNote: 'A warm peach-pink that feels natural and sun-kissed under all lighting' },
      { hex: '#F5F0EA', name: 'Salt Flat', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceiling, and wainscoting for a clean, warm foundation', lightingNote: 'A warm white with the faintest blush undertone' },
      { hex: '#6B7B7B', name: 'Wetland Slate', role: 'accent', finish: 'Semi-Gloss', application: 'A painted accent table, picture frames, or a feature bookshelf', lightingNote: 'A cool gray-green that grounds the warm pinks and prevents them from feeling saccharine' },
      { hex: '#C48A7A', name: 'Wing Coral', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a painted dresser, or decorative ceramic pieces', lightingNote: 'A warm terracotta-rose that bridges the pink walls and gray accents beautifully' },
    ],
    harmony: { type: 'analogous', explanation: 'Soft pinks and corals flow together in a warm, feminine palette. The gray-green accent provides the essential cool counterpoint that keeps it from feeling one-note.' },
    neutrals: { trim: { hex: '#F5F0EA', name: 'Shell White' }, ceiling: { hex: '#FAF7F3', name: 'Dawn Pink' }, floor: { hex: '#A08878', name: 'Sandy Dune' } },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'Flamingo Blush is the ideal grown-up pink bedroom — soft, warm, and deeply relaxing.' },
      { room: 'Living Room', rating: 4, reason: 'Sophisticated and warm. Pair with gray accents and warm wood for a modern look.' },
      { room: 'Dining Room', rating: 3, reason: 'A soft dining room that works best for brunch and casual entertaining.' },
      { room: 'Kitchen', rating: 3, reason: 'Coral Feather on an island with warm white cabinets feels fresh and inviting.' },
      { room: 'Bathroom', rating: 5, reason: 'The ultimate spa bathroom — blush walls, white marble, and brass fixtures.' },
    ],
    styles: ['contemporary', 'coastal', 'bohemian'],
    season: 'spring-summer',
    seasonNote: 'These warm pinks feel most alive in spring and summer light. Layer warm textiles and metallics for winter coziness.',
  },
  {
    id: 21,
    name: 'Indian Peafowl',
    scientific: 'Pavo cristatus',
    description: 'The peacock\'s iridescent blue-green train, adorned with "eye" feathers, is one of nature\'s most extravagant displays. Revered in South Asian culture for millennia.',
    status: 'Least Concern',
    conservation: 'While the national bird of India thrives in human-modified landscapes, wild populations benefit from protected temple groves and nature reserves.',
    colors: [
      { hex: '#2A6B6B', name: 'Peacock Teal', role: 'dominant', finish: 'Eggshell', application: 'A rich, jewel-like wall color that transforms any room into something extraordinary', lightingNote: 'Reads as a true teal in daylight; deepens to an almost emerald under warm light' },
      { hex: '#C4A83E', name: 'Train Gold', role: 'accent', finish: 'Semi-Gloss', application: 'Gilded mirror frames, decorative hardware, or a painted accent detail', lightingNote: 'A warm antique gold that catches light and adds regal warmth' },
      { hex: '#1E3A4A', name: 'Neck Sapphire', role: 'highlight', finish: 'Semi-Gloss', application: 'A dramatic ceiling treatment, a feature wall, or a painted mantel', lightingNote: 'A deep blue-teal that creates intimacy and drama' },
      { hex: '#5E8060', name: 'Eye Spot Green', role: 'secondary', finish: 'Satin', application: 'Emerald velvet curtains, a patterned area rug, or dining chair upholstery', lightingNote: 'A muted forest green that reads richer under warm light' },
      { hex: '#EDE5D8', name: 'Temple Stone', role: 'neutral', finish: 'Semi-Gloss', application: 'Warm trim and ceiling to let the jewel tones breathe', lightingNote: 'A warm sandstone white that complements the rich colors without yellowing' },
    ],
    harmony: { type: 'analogous', explanation: 'Teals, blues, and greens flow in a cool jewel-toned spectrum, with warm gold providing the essential spark. Temple Stone grounds the opulence.' },
    neutrals: { trim: { hex: '#EDE5D8', name: 'Marble White' }, ceiling: { hex: '#F5F2EB', name: 'Palace Light' }, floor: { hex: '#5C4A38', name: 'Teak Palace' } },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Peacock Teal is bold for a bedroom but makes a stunning feature wall behind the bed.' },
      { room: 'Living Room', rating: 5, reason: 'A jaw-dropping living room. Teal walls, gold accents, emerald velvet — pure luxury.' },
      { room: 'Dining Room', rating: 5, reason: 'Teal and gold is the ultimate formal dining palette. Add candlelight for magic.' },
      { room: 'Kitchen', rating: 2, reason: 'Too jewel-toned for most kitchens. Use teal on a single island or accent wall.' },
      { room: 'Bathroom', rating: 4, reason: 'Peacock Teal with gold fixtures creates a decadent master bathroom.' },
    ],
    styles: ['art-deco', 'eclectic', 'traditional'],
    season: 'fall-winter',
    seasonNote: 'Deep jewel tones thrive in autumn and winter. The gold accents catch candlelight beautifully during shorter days.',
  },
  {
    id: 22,
    name: 'Barn Owl',
    scientific: 'Tyto alba',
    description: 'With its heart-shaped face and ghostly pale plumage, the Barn Owl is a beloved nocturnal hunter found on every continent except Antarctica. They are invaluable for natural rodent control.',
    status: 'Least Concern',
    conservation: 'Loss of old barns and nesting sites threatens local populations. Nest box programs and reduced pesticide use are key conservation strategies.',
    colors: [
      { hex: '#F0E8DA', name: 'Barn Owl White', role: 'dominant', finish: 'Eggshell', application: 'A warm, enveloping cream wall color that makes any room feel inviting', lightingNote: 'A warm cream that glows golden under incandescent and reads clean under daylight' },
      { hex: '#C4A878', name: 'Tawny Wing', role: 'secondary', finish: 'Satin', application: 'A woven jute rug, linen curtains, or an upholstered bench', lightingNote: 'A warm golden-tan that feels like afternoon sunlight on wheat fields' },
      { hex: '#8A7458', name: 'Feather Buff', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, exposed beam stain, or a painted vanity', lightingNote: 'A warm brown with golden undertones; most beautiful under natural light' },
      { hex: '#3D3832', name: 'Midnight Hunt', role: 'accent', finish: 'Semi-Gloss', application: 'Iron hardware, picture frames, or a single dramatic accent piece', lightingNote: 'A warm charcoal-brown that anchors the airy palette with weight' },
      { hex: '#D8CFC2', name: 'Downy Breast', role: 'neutral', finish: 'Satin', application: 'Soft warm gray for secondary walls, wainscoting panels, or a reading nook', lightingNote: 'A warm greige that adds subtle depth without introducing coolness' },
    ],
    harmony: { type: 'monochromatic', explanation: 'A graduated warm neutral palette from cream through golden-tan to warm charcoal. Every shade shares the same warm undertone, creating effortless cohesion.' },
    neutrals: { trim: { hex: '#F5F0E8', name: 'Barn White' }, ceiling: { hex: '#FAF7F2', name: 'Moonlight' }, floor: { hex: '#6B5B48', name: 'Hay Loft' } },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'The ultimate calming bedroom — warm creams and taupes that cocoon you in comfort.' },
      { room: 'Living Room', rating: 5, reason: 'Warm and universally inviting. Layer textures to add interest within the tonal range.' },
      { room: 'Dining Room', rating: 4, reason: 'A warm, intimate dining room that flatters everyone at the table.' },
      { room: 'Kitchen', rating: 5, reason: 'Cream and warm wood is the quintessential farmhouse kitchen — timeless and welcoming.' },
      { room: 'Bathroom', rating: 4, reason: 'A warm spa bathroom with natural stone and warm metal fixtures.' },
    ],
    styles: ['farmhouse', 'scandinavian', 'coastal'],
    season: 'year-round',
    seasonNote: 'Warm neutrals transcend seasons entirely. Add texture in winter, lighten textiles in summer — the palette does the rest.',
  },
  {
    id: 23,
    name: 'European Bee-eater',
    scientific: 'Merops apiaster',
    description: 'One of Europe\'s most colorful birds, the Bee-eater displays a kaleidoscope of warm yellows, greens, and blues. They nest in sandy bank colonies across Southern Europe and Africa.',
    status: 'Least Concern',
    conservation: 'Pesticide use reduces the insect prey base. Sandy riverbank conservation and reduced insecticide use benefit bee-eater colonies.',
    colors: [
      { hex: '#C4A048', name: 'Bee-eater Gold', role: 'dominant', finish: 'Eggshell', application: 'A warm, honeyed wall color that brings Mediterranean sunshine indoors', lightingNote: 'Glows warmly under incandescent; reads more neutral and sophisticated under daylight' },
      { hex: '#3A7A6A', name: 'Throat Teal', role: 'secondary', finish: 'Satin', application: 'Rich teal curtains, a patterned area rug, or velvet accent pillows', lightingNote: 'A muted teal that provides beautiful cool contrast to the warm golds' },
      { hex: '#6B8E4A', name: 'Wing Green', role: 'accent', finish: 'Semi-Gloss', application: 'A painted plant shelf, ceramic pieces, or a garden room accent wall', lightingNote: 'An olive-green that feels fresh under daylight and warm under incandescent' },
      { hex: '#7A4A30', name: 'Chestnut Eye', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, leather furniture accents, or warm metallic hardware', lightingNote: 'A rich brown with red undertones that adds depth and earthiness' },
      { hex: '#F0E8D8', name: 'Sandy Bank', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim and ceiling for a warm, sandy foundation', lightingNote: 'A warm sand-white that enhances the Mediterranean warmth of the palette' },
    ],
    harmony: { type: 'split-complementary', explanation: 'Warm gold splits to cool teal and olive-green complements, creating a vibrant yet earthy Mediterranean palette. Rich chestnut anchors it all.' },
    neutrals: { trim: { hex: '#F0E8D8', name: 'Limestone' }, ceiling: { hex: '#F5F2EA', name: 'Morning Sun' }, floor: { hex: '#6B5840', name: 'Terra Floor' } },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'Golden walls make a warm cocoon. Pair with teal bedding for a Mediterranean escape.' },
      { room: 'Living Room', rating: 5, reason: 'Warm, vibrant, and inviting — a living room that feels like a Mediterranean holiday.' },
      { room: 'Dining Room', rating: 5, reason: 'Golden walls with teal accents create a warm, appetite-stimulating dining room.' },
      { room: 'Kitchen', rating: 4, reason: 'A sunny kitchen with gold walls, green accents, and warm wood counters.' },
      { room: 'Bathroom', rating: 3, reason: 'Use Throat Teal as an accent wall with warm brass fixtures for a fresh look.' },
    ],
    styles: ['bohemian', 'eclectic', 'tropical'],
    season: 'spring-summer',
    seasonNote: 'This Mediterranean palette feels most alive when the sun is high. The warm tones carry a sense of perpetual summer.',
  },
  {
    id: 24,
    name: 'Roseate Spoonbill',
    scientific: 'Platalea ajaja',
    description: 'North America\'s only native pink bird (besides flamingos), the Roseate Spoonbill sweeps its spoon-shaped bill through shallow waters. Found in coastal wetlands of the southern United States and Central America.',
    status: 'Least Concern',
    conservation: 'Nearly hunted to extinction for plume trade, spoonbills have recovered but remain sensitive to wetland loss and water quality changes in the Gulf Coast.',
    colors: [
      { hex: '#C88A8A', name: 'Spoonbill Rose', role: 'accent', finish: 'Semi-Gloss', application: 'Accent pillows, a painted accent chair, or decorative pottery', lightingNote: 'A mature dusty rose that reads warm under incandescent and slightly cooler under daylight' },
      { hex: '#E8D4C8', name: 'Shrimp Pink', role: 'dominant', finish: 'Eggshell', application: 'A whisper-soft blush wall color that warms without overwhelming', lightingNote: 'A sophisticated warm blush that reads nearly neutral — never reads bubblegum' },
      { hex: '#F5F0EA', name: 'Mangrove White', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim and ceilings for a crisp, clean backdrop', lightingNote: 'A warm white that enhances the blush tones without yellowing' },
      { hex: '#5A7A70', name: 'Marsh Sage', role: 'secondary', finish: 'Satin', application: 'Sage upholstery, eucalyptus-toned curtains, or a painted console', lightingNote: 'A muted sage that provides essential cool balance to all the warm pinks' },
      { hex: '#A06050', name: 'Wing Crimson', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a feature bookshelf, or decorative lamp bases', lightingNote: 'A deep dusty rose-brown that adds depth and richness to the soft palette' },
    ],
    harmony: { type: 'complementary', explanation: 'Soft pinks and sage greens sit opposite on the color wheel, creating gentle contrast. The deeper rose adds richness while the neutrals keep it serene.' },
    neutrals: { trim: { hex: '#F5F0EA', name: 'Egret White' }, ceiling: { hex: '#FAF8F4', name: 'Gulf Breeze' }, floor: { hex: '#9A8878', name: 'Sand Flat' } },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'Shrimp Pink walls with sage accents create the most calming, sophisticated bedroom.' },
      { room: 'Living Room', rating: 4, reason: 'Soft and modern. Layer sage textiles and warm metals against the blush backdrop.' },
      { room: 'Dining Room', rating: 3, reason: 'A gentle dining room for intimate gatherings. Add deeper rose accents for warmth.' },
      { room: 'Kitchen', rating: 3, reason: 'Sage cabinets with blush walls is an unexpected and beautiful combination.' },
      { room: 'Bathroom', rating: 5, reason: 'Blush and sage with white marble is the ultimate feminine spa bathroom.' },
    ],
    styles: ['contemporary', 'coastal', 'scandinavian'],
    season: 'spring-summer',
    seasonNote: 'Soft blush and sage feel most alive in spring light. Layer warm textiles and deeper rose in winter for coziness.',
  },
  {
    id: 25,
    name: 'Rainbow Lorikeet',
    scientific: 'Trichoglossus moluccanus',
    description: 'Australia\'s most colorful parrot, the Rainbow Lorikeet is a riot of blue, green, red, and orange. These noisy, social birds are a common sight in gardens across eastern Australia.',
    status: 'Least Concern',
    conservation: 'Thriving in urban environments, lorikeets benefit from native flowering trees. Avoiding feeding lorikeets bread and seed helps maintain healthy populations.',
    colors: [
      { hex: '#3A5A98', name: 'Lorikeet Cobalt', role: 'secondary', finish: 'Satin', application: 'Rich blue curtains, a statement sofa, or a patterned area rug', lightingNote: 'A confident mid-cobalt that reads true under daylight and deepens under warm light' },
      { hex: '#4A8A4E', name: 'Breast Green', role: 'dominant', finish: 'Eggshell', application: 'A fresh, lively green wall color that brings the outdoors in', lightingNote: 'A vivid but livable green that reads most true under natural daylight' },
      { hex: '#C45838', name: 'Beak Vermilion', role: 'accent', finish: 'Semi-Gloss', application: 'A single statement chair, lacquered tray, or decorative art frame', lightingNote: 'A warm red-orange that pops against the greens without being aggressive' },
      { hex: '#D4A040', name: 'Breast Band Gold', role: 'highlight', finish: 'Semi-Gloss', application: 'Metallic accents, gilded frames, or a painted accent shelf', lightingNote: 'A warm gold that bridges the cool blue and warm red beautifully' },
      { hex: '#F0EBE0', name: 'Eucalyptus Cream', role: 'neutral', finish: 'Semi-Gloss', application: 'Generous trim and ceiling to let bold colors breathe', lightingNote: 'A warm cream that balances the vibrancy without competing' },
    ],
    harmony: { type: 'triadic', explanation: 'Green, blue, and red-orange form a vibrant triadic scheme — each muted enough to coexist joyfully. Gold provides metallic warmth throughout.' },
    neutrals: { trim: { hex: '#F0EBE0', name: 'Gum Blossom' }, ceiling: { hex: '#F5F2EB', name: 'Open Canopy' }, floor: { hex: '#5A4838', name: 'Eucalyptus Bark' } },
    rooms: [
      { room: 'Bedroom', rating: 2, reason: 'Too vibrant for sleep. Reserve for a playful kids room or bold guest room.' },
      { room: 'Living Room', rating: 4, reason: 'A joyful living room — green walls, blue sofa, and warm red-orange pops.' },
      { room: 'Dining Room', rating: 4, reason: 'Green walls with blue and gold create an energetic, social dining atmosphere.' },
      { room: 'Kitchen', rating: 4, reason: 'Green cabinets with warm metal hardware and blue tile backsplash is stunning.' },
      { room: 'Bathroom', rating: 2, reason: 'Too many bold colors for small bathrooms. Use as accent art and towels only.' },
    ],
    styles: ['tropical', 'eclectic', 'bohemian'],
    season: 'spring-summer',
    seasonNote: 'This palette radiates tropical energy — most vibrant in sun-drenched spaces and warm months.',
  },
  {
    id: 26,
    name: 'Snowy Owl',
    scientific: 'Bubo scandiacus',
    description: 'The magnificent Snowy Owl hunts across Arctic tundra, its white plumage camouflaging it against snow. These powerful raptors occasionally wander south in winter, delighting birdwatchers.',
    status: 'Vulnerable',
    conservation: 'Climate change is reducing Arctic prey availability. Lemming population cycles directly impact snowy owl breeding success.',
    colors: [
      { hex: '#F0ECE6', name: 'Snowy Plumage', role: 'dominant', finish: 'Eggshell', application: 'A luminous warm white wall color that maximizes light in any room', lightingNote: 'The warmest white in the palette — glows softly under all lighting conditions' },
      { hex: '#D8D2C8', name: 'Barred Feather', role: 'secondary', finish: 'Satin', application: 'A warm gray for linen curtains, a large rug, or an upholstered bed frame', lightingNote: 'A sophisticated warm gray that reads lighter in bright rooms and cozier in dim ones' },
      { hex: '#B8AFA4', name: 'Arctic Lichen', role: 'secondary', finish: 'Satin', application: 'A medium warm gray for an accent wall, wainscoting, or kitchen cabinets', lightingNote: 'A deeper warm gray with the faintest green undertone from lichen' },
      { hex: '#C4A848', name: 'Tundra Gold', role: 'accent', finish: 'Semi-Gloss', application: 'Brass hardware, a gilded mirror, or a warm metallic light fixture', lightingNote: 'A warm gold that adds life and warmth to the cool monochrome' },
      { hex: '#4A4A48', name: 'Talon Dark', role: 'highlight', finish: 'Semi-Gloss', application: 'Sleek iron hardware, picture frames, or a dramatic window frame', lightingNote: 'A warm charcoal that anchors the whites and grays with subtle drama' },
    ],
    harmony: { type: 'monochromatic', explanation: 'A sophisticated gradient from warm white through graduated grays to charcoal. The single gold accent injects warmth and prevents the monochrome from feeling flat.' },
    neutrals: { trim: { hex: '#F5F2EC', name: 'Snow White' }, ceiling: { hex: '#FAFAF7', name: 'Arctic Light' }, floor: { hex: '#7A7068', name: 'Frozen Tundra' } },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'Serene and enveloping. Layer whites and grays for a luxurious cocoon effect.' },
      { room: 'Living Room', rating: 5, reason: 'Minimalist elegance. The gold accents and layered textures add all the interest needed.' },
      { room: 'Dining Room', rating: 3, reason: 'Can feel stark. Add gold lighting and warm textiles to create warmth for dining.' },
      { room: 'Kitchen', rating: 5, reason: 'The quintessential modern white kitchen with warm gray islands and gold hardware.' },
      { room: 'Bathroom', rating: 5, reason: 'Spa-like minimalism — whites, warm grays, and gold fixtures for quiet luxury.' },
    ],
    styles: ['scandinavian', 'contemporary', 'mid-century'],
    season: 'year-round',
    seasonNote: 'This minimal palette works in every season. It\'s a blank canvas that adapts to seasonal decor changes.',
  },
  {
    id: 27,
    name: 'Common Kingfisher',
    scientific: 'Alcedo atthis',
    description: 'A flash of electric blue along a riverbank — the Common Kingfisher is a tiny, jewel-like bird found across Europe and Asia. Their diving skills are legendary.',
    status: 'Least Concern',
    conservation: 'Clean waterways are essential for kingfisher survival. River pollution and bank degradation are the primary threats to this beloved species.',
    colors: [
      { hex: '#2A7AA8', name: 'Kingfisher Blue', role: 'accent', finish: 'Semi-Gloss', application: 'A statement accent wall, decorative ceramics, or painted bookshelves', lightingNote: 'A vivid teal-blue that reads electric under daylight and deeper under warm bulbs' },
      { hex: '#C47A3A', name: 'Breast Copper', role: 'highlight', finish: 'Semi-Gloss', application: 'Interior doors, a painted console, or warm metallic light fixtures', lightingNote: 'A rich burnt-orange copper that glows warmly under incandescent' },
      { hex: '#4A8A7A', name: 'River Teal', role: 'dominant', finish: 'Eggshell', application: 'A sophisticated teal-green wall color that feels fresh and natural', lightingNote: 'Shifts between green and blue depending on light — endlessly interesting' },
      { hex: '#E8E0D4', name: 'River Stone', role: 'neutral', finish: 'Semi-Gloss', application: 'Warm trim and ceiling that enhances the teal without yellowing', lightingNote: 'A warm stone-white that grounds the vibrant blues and oranges' },
      { hex: '#6B5A48', name: 'Perch Branch', role: 'secondary', finish: 'Satin', application: 'Warm brown leather seating, woven baskets, or a wood-toned area rug', lightingNote: 'A warm bark-brown that adds essential earthiness to the cool teal' },
    ],
    harmony: { type: 'complementary', explanation: 'Teal blues and warm copper-orange sit opposite on the color wheel for vibrant, natural contrast. The brown and cream bridge the temperature gap.' },
    neutrals: { trim: { hex: '#E8E0D4', name: 'Pebble White' }, ceiling: { hex: '#F2EFEA', name: 'Stream Light' }, floor: { hex: '#5A4A3A', name: 'River Walnut' } },
    rooms: [
      { room: 'Bedroom', rating: 3, reason: 'River Teal makes a bold bedroom feature wall. Pair with warm copper and cream textiles.' },
      { room: 'Living Room', rating: 5, reason: 'Teal walls with copper and brown accents create a fresh, nature-inspired living room.' },
      { room: 'Dining Room', rating: 4, reason: 'Teal and copper is a stunning dining combination — add warm candlelight.' },
      { room: 'Kitchen', rating: 4, reason: 'Teal cabinets with copper hardware and warm wood counters is magazine-worthy.' },
      { room: 'Bathroom', rating: 5, reason: 'A riverstone-inspired bathroom with teal accents and copper fixtures.' },
    ],
    styles: ['mid-century', 'contemporary', 'coastal'],
    season: 'year-round',
    seasonNote: 'Teal and copper feel fresh in summer and rich in winter. This palette adapts beautifully to seasonal styling.',
  },
  {
    id: 28,
    name: 'Anna\'s Hummingbird',
    scientific: 'Calypte anna',
    description: 'The only hummingbird to winter in the northern United States, Anna\'s Hummingbird displays a spectacular iridescent rose-pink gorget and emerald green body.',
    status: 'Least Concern',
    conservation: 'Urban gardens with native flowering plants support thriving populations. Avoiding pesticides and providing clean feeders are key conservation actions.',
    colors: [
      { hex: '#5A8A68', name: 'Iridescent Green', role: 'dominant', finish: 'Eggshell', application: 'A fresh, lively sage-emerald wall color that brings garden energy indoors', lightingNote: 'A sophisticated green that reads more emerald under warm light and more sage under daylight' },
      { hex: '#A64860', name: 'Gorget Rose', role: 'accent', finish: 'Semi-Gloss', application: 'Velvet accent pillows, a painted side table, or decorative ceramics', lightingNote: 'A deep dusty rose that shimmers between pink and berry depending on light' },
      { hex: '#8A7A68', name: 'Nest Bark', role: 'secondary', finish: 'Satin', application: 'Warm taupe linen curtains, a natural fiber rug, or an upholstered bench', lightingNote: 'A warm bark-taupe that grounds the green without adding coolness' },
      { hex: '#C8B898', name: 'Lichen Gold', role: 'highlight', finish: 'Semi-Gloss', application: 'Warm gold hardware, a painted mirror frame, or decorative accents', lightingNote: 'A soft golden-tan that catches warm light beautifully' },
      { hex: '#EDE8DE', name: 'Feeder Cream', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim and ceiling for a clean, warm backdrop', lightingNote: 'A warm cream that enhances the garden-fresh feel of the palette' },
    ],
    harmony: { type: 'complementary', explanation: 'Green and rose sit opposite on the color wheel — a classic garden palette. The warm taupe and gold add earthiness that keeps it grounded.' },
    neutrals: { trim: { hex: '#EDE8DE', name: 'Petal White' }, ceiling: { hex: '#F5F2EB', name: 'Garden Light' }, floor: { hex: '#6B5A4A', name: 'Garden Path' } },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'Iridescent Green is calming and natural. Rose accents add romantic warmth.' },
      { room: 'Living Room', rating: 5, reason: 'A garden-inspired living room — green walls, rose accents, and warm natural textures.' },
      { room: 'Dining Room', rating: 4, reason: 'Green and rose create a fresh, feminine dining atmosphere perfect for spring gatherings.' },
      { room: 'Kitchen', rating: 4, reason: 'Green cabinets with rose accents and warm brass is a contemporary garden kitchen.' },
      { room: 'Bathroom', rating: 4, reason: 'A garden spa with green walls, rose towels, and warm metallic fixtures.' },
    ],
    styles: ['bohemian', 'contemporary', 'eclectic'],
    season: 'spring-summer',
    seasonNote: 'This garden palette blooms in spring and summer light. Add warm textiles and deeper rose in winter.',
  },
  {
    id: 29,
    name: 'Hoopoe',
    scientific: 'Upupa epops',
    description: 'With its spectacular crest and cinnamon-black-white pattern, the Hoopoe is one of the most distinctive birds in the Old World. Found across Europe, Asia, and Africa.',
    status: 'Least Concern',
    conservation: 'Hoopoes benefit from traditional farming practices. Intensive agriculture and pesticide use reduce the insect prey base they depend on.',
    colors: [
      { hex: '#C08A58', name: 'Hoopoe Cinnamon', role: 'dominant', finish: 'Eggshell', application: 'A warm, spiced wall color that feels like a Moroccan riad', lightingNote: 'Glows warmly under incandescent; reads more neutral and sandy under daylight' },
      { hex: '#2E2A28', name: 'Wing Bar Black', role: 'highlight', finish: 'Semi-Gloss', application: 'A dramatic front door, sleek hardware, or bold picture frames', lightingNote: 'A warm near-black that reads softer than pure black and reveals brown undertones' },
      { hex: '#F0E8DA', name: 'Crest Cream', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceiling, and wainscoting to give the warm tones room to breathe', lightingNote: 'A warm cream that complements the cinnamon beautifully under all lighting' },
      { hex: '#A07848', name: 'Desert Gold', role: 'secondary', finish: 'Satin', application: 'A leather Chesterfield sofa, woven curtains, or a warm metallic rug', lightingNote: 'A warm camel that deepens the tonal palette without adding new hue' },
      { hex: '#7A6A58', name: 'Sahel Stone', role: 'secondary', finish: 'Satin', application: 'A warm brown area rug, carved wood accents, or upholstered dining chairs', lightingNote: 'A warm mid-brown that adds earthiness and texture' },
    ],
    harmony: { type: 'monochromatic', explanation: 'A graduated warm palette from cream through cinnamon to near-black. All shades share warm brown undertones, creating a spiced, enveloping atmosphere.' },
    neutrals: { trim: { hex: '#F0E8DA', name: 'Saharan Cream' }, ceiling: { hex: '#F5F2EA', name: 'Desert Dawn' }, floor: { hex: '#5A4A38', name: 'Hammam Stone' } },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'Warm, cocooning, and deeply relaxing. Layer warm textiles for maximum coziness.' },
      { room: 'Living Room', rating: 5, reason: 'A warm, world-traveled living room. Layer warm browns with textured textiles and brass.' },
      { room: 'Dining Room', rating: 5, reason: 'Warm cinnamon walls with candlelight create the most inviting dining atmosphere.' },
      { room: 'Kitchen', rating: 3, reason: 'Cinnamon on an island or backsplash with cream cabinets feels warm and inviting.' },
      { room: 'Bathroom', rating: 3, reason: 'A warm powder room in cinnamon with brass fixtures and natural stone tile.' },
    ],
    styles: ['bohemian', 'eclectic', 'traditional'],
    season: 'fall-winter',
    seasonNote: 'Warm cinnamons and browns feel most at home during autumn and winter. This palette was made for cozy evenings.',
  },
  {
    id: 30,
    name: 'Gouldian Finch',
    scientific: 'Chloebia gouldiae',
    description: 'One of the most spectacular finches in the world, the Gouldian Finch displays a remarkable combination of purple, green, and yellow. Native to tropical northern Australia.',
    status: 'Near Threatened',
    conservation: 'Altered fire regimes and habitat degradation threaten wild populations. Captive breeding programs help maintain genetic diversity while wild habitats are restored.',
    colors: [
      { hex: '#6A5088', name: 'Gouldian Violet', role: 'accent', finish: 'Semi-Gloss', application: 'A velvet accent chair, decorative art prints, or a painted vanity', lightingNote: 'A muted grape-purple that shows more blue under cool LED and more warmth under incandescent' },
      { hex: '#4A8A58', name: 'Breast Emerald', role: 'dominant', finish: 'Eggshell', application: 'A fresh, vivid green wall color with tropical personality', lightingNote: 'Reads as true emerald under daylight and deeper under warm incandescent' },
      { hex: '#C8A840', name: 'Belly Gold', role: 'highlight', finish: 'Semi-Gloss', application: 'Gilded frames, metallic lamp bases, or a painted interior door', lightingNote: 'A warm antique gold that adds metallic warmth to the cool greens and purples' },
      { hex: '#C45050', name: 'Head Scarlet', role: 'accent', finish: 'Semi-Gloss', application: 'A single bold pillow, a lacquered tray, or decorative ceramics', lightingNote: 'A confident brick-red that reads warm under all lighting conditions' },
      { hex: '#F0EBE0', name: 'Outback Cream', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim and ceiling to provide essential breathing room for the bold palette', lightingNote: 'A warm cream that lets the vivid colors shine without competing' },
    ],
    harmony: { type: 'triadic', explanation: 'Purple, green, and gold form a vibrant triadic harmony at muted intensities. The scarlet accent adds a fourth dimension of warmth.' },
    neutrals: { trim: { hex: '#F0EBE0', name: 'Outback White' }, ceiling: { hex: '#F5F2EA', name: 'Tropical Mist' }, floor: { hex: '#5A4A38', name: 'Red Gum' } },
    rooms: [
      { room: 'Bedroom', rating: 2, reason: 'Too vibrant for sleep. Use emerald on a single feature wall and purple in bedding only.' },
      { room: 'Living Room', rating: 4, reason: 'A bold, artistic living room. Green walls, purple textiles, gold accents — maximum personality.' },
      { room: 'Dining Room', rating: 4, reason: 'Emerald walls with gold and purple create a festive, celebratory dining room.' },
      { room: 'Kitchen', rating: 3, reason: 'Green lower cabinets with gold hardware make a bold statement.' },
      { room: 'Bathroom', rating: 2, reason: 'Too bold for small bathrooms. Use as accent towels and art only.' },
    ],
    styles: ['tropical', 'eclectic', 'bohemian'],
    season: 'year-round',
    seasonNote: 'This bold palette transcends seasons. It feels tropical in summer and jewel-like and festive in winter.',
  },
  {
    id: 31,
    name: 'Wood Duck',
    scientific: 'Aix sponsa',
    description: 'Often called America\'s most beautiful duck, the male Wood Duck displays an iridescent head of green and purple with chestnut and white accents. They nest in tree cavities near waterways.',
    status: 'Least Concern',
    conservation: 'Once heavily hunted, nest box programs and hunting regulations have restored populations. Wetland and mature forest preservation remain essential.',
    colors: [
      { hex: '#2E5A48', name: 'Wood Duck Green', role: 'highlight', finish: 'Semi-Gloss', application: 'A dramatic front door, built-in shelving, or a freestanding cabinet', lightingNote: 'A deep forest green that reveals rich teal undertones in bright settings' },
      { hex: '#5A3A60', name: 'Crest Purple', role: 'accent', finish: 'Semi-Gloss', application: 'Velvet accent pillows, a painted side table, or art mat boards', lightingNote: 'A muted plum that reads richer under incandescent and more blue under cool LED' },
      { hex: '#8A5A3A', name: 'Chestnut Flank', role: 'secondary', finish: 'Satin', application: 'Rich leather seating, warm curtains, or a woven area rug', lightingNote: 'A warm cognac-brown that feels luxurious and inviting under warm light' },
      { hex: '#B8A888', name: 'Pond Wheat', role: 'dominant', finish: 'Eggshell', application: 'A warm, sophisticated tan wall color that grounds the jewel accents', lightingNote: 'A warm golden-tan that glows under incandescent and reads neutral under daylight' },
      { hex: '#F0EBE2', name: 'Breast Stripe', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim and ceiling for crisp contrast with the warm, earthy palette', lightingNote: 'A clean warm white that enhances the warmth without yellowing' },
    ],
    harmony: { type: 'split-complementary', explanation: 'Warm golden-tan splits to deep green and plum complements for a rich, layered palette. Cognac brown adds warmth while cream provides crisp accents.' },
    neutrals: { trim: { hex: '#F0EBE2', name: 'Nest White' }, ceiling: { hex: '#F5F2EB', name: 'Forest Light' }, floor: { hex: '#4A3828', name: 'Oak Hollow' } },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'Pond Wheat walls with plum bedding and green accents create a cozy woodland retreat.' },
      { room: 'Living Room', rating: 5, reason: 'A handsome, layered living room with warm tans, rich leather, and jewel-toned accents.' },
      { room: 'Dining Room', rating: 5, reason: 'Warm and sophisticated — golden-tan walls with candlelight and purple touches.' },
      { room: 'Kitchen', rating: 3, reason: 'Warm tan walls with green-painted lower cabinets and brass hardware is beautiful.' },
      { room: 'Bathroom', rating: 3, reason: 'A warm spa bathroom with golden-tan walls and green accent tile.' },
    ],
    styles: ['traditional', 'mid-century', 'eclectic'],
    season: 'fall-winter',
    seasonNote: 'Warm tans and jewel accents evoke autumn foliage. This palette feels most at home during harvest season.',
  },
  {
    id: 32,
    name: 'Cedar Waxwing',
    scientific: 'Bombycilla cedrorum',
    description: 'Sleek and elegant, the Cedar Waxwing sports a silky fawn plumage with a black mask, yellow-tipped tail, and distinctive waxy red wing tips. They travel in social flocks feeding on berries.',
    status: 'Least Concern',
    conservation: 'Berry-producing native trees and shrubs support healthy waxwing populations. Reducing window strikes is an important conservation action for this species.',
    colors: [
      { hex: '#C4AA88', name: 'Waxwing Fawn', role: 'dominant', finish: 'Eggshell', application: 'A warm, sandy wall color that feels like cashmere — sophisticated and enveloping', lightingNote: 'Glows golden under incandescent and reads as a refined tan under daylight' },
      { hex: '#C4A840', name: 'Tail Tip Yellow', role: 'accent', finish: 'Semi-Gloss', application: 'Decorative ceramics, a painted accent shelf, or metallic gold hardware', lightingNote: 'A warm gold-yellow that adds sunny energy to the muted palette' },
      { hex: '#8A4038', name: 'Wing Wax Red', role: 'highlight', finish: 'Semi-Gloss', application: 'A painted interior door, lacquered tray, or decorative bookends', lightingNote: 'A deep, muted brick-red that adds unexpected depth to the soft palette' },
      { hex: '#3A3838', name: 'Mask Charcoal', role: 'highlight', finish: 'Semi-Gloss', application: 'Iron hardware, sleek picture frames, or a dramatic window frame', lightingNote: 'A warm charcoal that grounds the palette with sophisticated darkness' },
      { hex: '#E8E0D4', name: 'Berry Cream', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim and ceiling for a clean foundation against the warm tones', lightingNote: 'A warm cream that ties the sandy and golden tones together' },
    ],
    harmony: { type: 'analogous', explanation: 'Sandy fawn, warm gold, and muted brick-red flow together in a warm analogous scheme. The charcoal mask provides essential contrast and drama.' },
    neutrals: { trim: { hex: '#E8E0D4', name: 'Silky Cream' }, ceiling: { hex: '#F2EFEA', name: 'Dawn Light' }, floor: { hex: '#6B5A48', name: 'Cedar Wood' } },
    rooms: [
      { room: 'Bedroom', rating: 5, reason: 'Waxwing Fawn is the ultimate bedroom neutral — warm, calming, and endlessly sophisticated.' },
      { room: 'Living Room', rating: 5, reason: 'Universally flattering. Layer gold, charcoal, and warm textures for quiet luxury.' },
      { room: 'Dining Room', rating: 4, reason: 'Warm and intimate. Gold accents and candlelight make this palette glow at dinner.' },
      { room: 'Kitchen', rating: 4, reason: 'A warm, timeless kitchen. Fawn walls with cream cabinets and gold hardware.' },
      { room: 'Bathroom', rating: 4, reason: 'A warm spa bathroom with natural stone and gold fixtures.' },
    ],
    styles: ['farmhouse', 'scandinavian', 'contemporary'],
    season: 'year-round',
    seasonNote: 'These warm neutrals work beautifully in every season — a true foundation palette that adapts to any mood.',
  },
  {
    id: 33,
    name: 'Secretary Bird',
    scientific: 'Sagittarius serpentarius',
    description: 'Standing over 4 feet tall with dramatic black crest feathers and long legs, the Secretary Bird is a raptor that hunts snakes on foot across African grasslands.',
    status: 'Endangered',
    conservation: 'Habitat loss and collision with power lines are critical threats. Grassland conservation across sub-Saharan Africa is essential for this iconic species.',
    colors: [
      { hex: '#B0AAA0', name: 'Plumage Silver', role: 'dominant', finish: 'Eggshell', application: 'A refined warm gray wall color with just enough warmth to feel inviting', lightingNote: 'A sophisticated warm gray that shifts subtly depending on surrounding colors' },
      { hex: '#2E2E30', name: 'Crest Black', role: 'highlight', finish: 'Semi-Gloss', application: 'A bold accent wall, interior doors, or sleek built-in shelving', lightingNote: 'A soft black that avoids harshness; shows subtle warm undertones in bright light' },
      { hex: '#C48040', name: 'Face Blaze', role: 'accent', finish: 'Semi-Gloss', application: 'A painted accent piece, decorative vases, or warm metallic accessories', lightingNote: 'A warm burnt orange that energizes the cool gray palette' },
      { hex: '#E8E2D8', name: 'Grassland White', role: 'neutral', finish: 'Semi-Gloss', application: 'Trim, ceiling, and wainscoting for a clean, professional backdrop', lightingNote: 'A warm off-white that softens the contrast between gray and black' },
      { hex: '#6B6860', name: 'Savanna Shadow', role: 'secondary', finish: 'Satin', application: 'Charcoal linen curtains, a woven rug, or an upholstered sofa', lightingNote: 'A warm mid-gray that bridges the lighter walls and darker accents' },
    ],
    harmony: { type: 'complementary', explanation: 'Cool grays and warm burnt orange create sophisticated contrast. The monochrome gray foundation lets the warm accent sing without competing.' },
    neutrals: { trim: { hex: '#E8E2D8', name: 'Savanna Cream' }, ceiling: { hex: '#F2F0EB', name: 'Open Plain' }, floor: { hex: '#5A5550', name: 'Dry Earth' } },
    rooms: [
      { room: 'Bedroom', rating: 4, reason: 'Plumage Silver makes a calm, sophisticated bedroom. Add orange accents sparingly.' },
      { room: 'Living Room', rating: 5, reason: 'A polished, modern living room. Gray walls, charcoal textiles, and warm orange pops.' },
      { room: 'Dining Room', rating: 4, reason: 'Modern and refined. The warm orange accent keeps the grays from feeling sterile.' },
      { room: 'Kitchen', rating: 4, reason: 'Gray cabinets with warm orange hardware and accents is sleek and contemporary.' },
      { room: 'Bathroom', rating: 4, reason: 'A modern spa bathroom with warm grays, white fixtures, and orange towel accents.' },
    ],
    styles: ['contemporary', 'mid-century', 'scandinavian'],
    season: 'year-round',
    seasonNote: 'Gray and orange is a timeless modern combination that works in any season or setting.',
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
  {
    id: 7,
    name: 'Nordic Fireside',
    birdIds: [14, 18],
    description: 'Atlantic Puffin\'s cool coastal slates meet Northern Cardinal\'s warm berry tones for a cozy Nordic cabin palette — the warmth of a hearth against a winter sea.',
    moodBoard: {
      vibe: 'Cozy, Scandinavian, warm-cool contrast',
      materials: 'Sheepskin throws, dark stained wood, wool textiles, iron fixtures, ceramic mugs',
      rooms: ['Living Room', 'Study', 'Bedroom'],
    },
    pairedColors: [
      { fromBird: 14, hex: '#4A5C6B', toBird: 18, hex2: '#A63B3B', note: 'Cool sea slate walls with warm cranberry accent pieces create striking Nordic warmth' },
      { fromBird: 14, hex: '#2F3133', toBird: 18, hex2: '#5C3A2E', note: 'Puffin charcoal and cardinal bark — two rich darks that anchor without competing' },
      { fromBird: 14, hex: '#D4CBC0', toBird: 18, hex2: '#D4BFA8', note: 'Pebble shore and birch beige blend as a seamless warm neutral foundation' },
    ],
  },
  {
    id: 8,
    name: 'Safari Dawn',
    birdIds: [22, 29],
    description: 'Barn Owl\'s tawny desert palette pairs with Hoopoe\'s earthy cinnamon-and-cream stripes for an African savanna morning — warm, golden, and quietly dramatic.',
    moodBoard: {
      vibe: 'Earthy, warm, globally inspired',
      materials: 'Woven rattan, raw linen, terracotta planters, bleached wood, sisal rugs',
      rooms: ['Living Room', 'Sunroom', 'Dining Room'],
    },
    pairedColors: [
      { fromBird: 22, hex: '#C4A67A', toBird: 29, hex2: '#C49A6A', note: 'Golden tawny and warm cinnamon create a sun-drenched tonal pairing' },
      { fromBird: 22, hex: '#F0E6D4', toBird: 29, hex2: '#F0E4D0', note: 'Two warm creams that read as one continuous warm base — perfect for walls' },
      { fromBird: 22, hex: '#8B7355', toBird: 29, hex2: '#2F2F2F', note: 'Warm sienna grounded by charcoal-black for a striking contrast moment' },
    ],
  },
  {
    id: 9,
    name: 'Jewel Tropics',
    birdIds: [15, 25],
    description: 'Lilac-breasted Roller\'s soft pastels intertwine with Rainbow Lorikeet\'s vivid jewel tones for a layered tropical palette that moves from soft to bold.',
    moodBoard: {
      vibe: 'Tropical, eclectic, colorful yet livable',
      materials: 'Printed textiles, rattan furniture, tropical plants, painted ceramics, woven baskets',
      rooms: ['Living Room', 'Bedroom', 'Covered Patio'],
    },
    pairedColors: [
      { fromBird: 15, hex: '#8A7BA8', toBird: 25, hex2: '#2B6E4F', note: 'Soft lilac and rich rainforest green — unexpected but harmonious cool tones' },
      { fromBird: 15, hex: '#5E9EAD', toBird: 25, hex2: '#2E5FA0', note: 'Aqua teal and cobalt blue build a lush cool-toned depth' },
      { fromBird: 15, hex: '#C4956A', toBird: 25, hex2: '#D4953A', note: 'Warm cinnamon and lorikeet gold tie the cool tones to earth' },
    ],
  },
  {
    id: 10,
    name: 'Winter Palace',
    birdIds: [26, 21],
    description: 'Snowy Owl\'s pristine arctic whites and grays meet Indian Peafowl\'s regal blues and golds — an opulent winter wonderland palette fit for royalty.',
    moodBoard: {
      vibe: 'Regal, serene, luxurious',
      materials: 'Velvet upholstery, mercury glass, white marble, gold leaf accents, crystal',
      rooms: ['Master Bedroom', 'Formal Dining Room', 'Bathroom'],
    },
    pairedColors: [
      { fromBird: 26, hex: '#F5F0E8', toBird: 21, hex2: '#1E5C6B', note: 'Snowy white walls make peacock teal furniture pieces absolutely sing' },
      { fromBird: 26, hex: '#A8A49C', toBird: 21, hex2: '#B89E4A', note: 'Arctic silver-gray and burnished gold — the classic ice-and-metal luxury pairing' },
      { fromBird: 26, hex: '#7A756E', toBird: 21, hex2: '#4A7A5E', note: 'Warm driftwood gray anchors peacock green for a sophisticated two-tone scheme' },
    ],
  },
  {
    id: 11,
    name: 'Harvest Festival',
    birdIds: [16, 32],
    description: 'Golden Pheasant\'s fiery scarlet-and-gold meets Cedar Waxwing\'s soft autumn naturals for a rich harvest palette — think wine country in October.',
    moodBoard: {
      vibe: 'Warm, autumnal, convivial',
      materials: 'Reclaimed barn wood, copper cookware, linen napkins, stoneware, dried botanicals',
      rooms: ['Kitchen', 'Dining Room', 'Family Room'],
    },
    pairedColors: [
      { fromBird: 16, hex: '#B5452A', toBird: 32, hex2: '#8C7A5E', note: 'Cinnabar red and warm khaki — earthy warmth that makes a kitchen feel alive' },
      { fromBird: 16, hex: '#C49A2A', toBird: 32, hex2: '#C4A63A', note: 'Deep gold and waxwing gold sing in unison as a warm metallic accent thread' },
      { fromBird: 16, hex: '#4A6B4A', toBird: 32, hex2: '#6B7B6B', note: 'Forest green and sage create natural depth like looking into an autumn wood' },
    ],
  },
  {
    id: 12,
    name: 'Coral Reef',
    birdIds: [20, 27],
    description: 'Greater Flamingo\'s warm coral pinks blend with Common Kingfisher\'s electric blue-orange for an underwater fantasy palette — vivid, warm, and aquatic.',
    moodBoard: {
      vibe: 'Playful, vibrant, coastal-modern',
      materials: 'Whitewashed wood, sea glass, terrazzo, colored tile, linen and cotton',
      rooms: ['Bathroom', 'Kids Room', 'Beach House Living Room'],
    },
    pairedColors: [
      { fromBird: 20, hex: '#D4917A', toBird: 27, hex2: '#1A6B8A', note: 'Warm coral and deep cerulean — the classic warm-cool complementary pair' },
      { fromBird: 20, hex: '#F0DDD0', toBird: 27, hex2: '#C47A3A', note: 'Blush pink base with kingfisher orange accents for energetic warmth' },
      { fromBird: 20, hex: '#C47A6A', toBird: 27, hex2: '#5E9E8A', note: 'Dusty rose and jade teal create a sophisticated underwater garden feel' },
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

  // AI Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('plumage_api_key') || '' : '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const chatEndRef = useRef(null);

  const toggleBird = (id) => {
    setExpandedBird(expandedBird === id ? null : id);
    setCardTab('colors');
  };

  // AI Chat functions
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('plumage_api_key', key);
    setShowKeyInput(false);
  };

  const buildSystemPrompt = () => {
    const paletteData = birds.map(b =>
      `${b.name} (${b.scientific}): ${b.colors.map(c => `${c.name} ${c.hex} [${c.role}]`).join(', ')}. Harmony: ${b.harmony.type}. Styles: ${b.styles.join(', ')}. Season: ${b.season}. Rooms: ${b.rooms.filter(r => r.rating >= 4).map(r => r.room).join(', ') || 'versatile'}.`
    ).join('\n');

    const pairingData = FLOCK_PAIRINGS.map(p => {
      const b1 = birds.find(b => b.id === p.birdIds[0]);
      const b2 = birds.find(b => b.id === p.birdIds[1]);
      return `${p.name}: ${b1?.name} + ${b2?.name} — ${p.moodBoard.vibe}. Best in: ${p.moodBoard.rooms.join(', ')}.`;
    }).join('\n');

    return `You are the Plumage Palettes AI Color Consultant — an expert interior designer who helps people use bird-inspired color palettes in their homes.

CORE KNOWLEDGE — COLOR THEORY:
- 60-30-10 Rule: 60% dominant (walls), 30% secondary (textiles/furniture), 10% accent (decor/art). This ratio creates visual balance.
- Color Harmonies: Analogous (adjacent hues, serene), Complementary (opposite hues, energetic), Triadic (3 evenly spaced, rich), Split-Complementary (base + 2 adjacent to complement), Monochromatic (one hue, layered values).
- Undertones: Warm (yellow/red base) advance and energize. Cool (blue/green base) recede and calm. Neutral (balanced) bridge both.
- Value & Saturation: Muted/desaturated colors feel sophisticated and livable. High saturation overwhelms in large doses. Dark values create intimacy; light values create openness.
- Lighting Effects: North-facing rooms make colors cooler/grayer. South-facing rooms warm everything. Incandescent light adds warmth. Cool LED shifts colors blue. Always test paint samples at morning, noon, and evening.

CORE KNOWLEDGE — INTERIOR DESIGN:
- Paint Finishes: Matte (walls, hides imperfections), Eggshell (living areas, slight sheen), Satin (kitchens/baths, wipeable), Semi-Gloss (trim/doors, durable), High-Gloss (accents, dramatic).
- Room Psychology: Bedrooms want calming (blues, greens, soft neutrals). Dining rooms want warmth and appetite stimulation (reds, greens, golds). Kitchens want energy (warm whites, blues, greens). Bathrooms want spa-like (blues, greens, warm whites). Living rooms are versatile.
- Small rooms: lighter colors, fewer contrasts. Large rooms: can handle dark/bold colors. Low ceilings: paint ceiling lighter than walls. Long narrow rooms: warm color on short walls to draw them in.

AVAILABLE PALETTES:
${paletteData}

CURATED PAIRINGS (Flock Pairings):
${pairingData}

GUIDELINES:
- Always recommend specific Plumage palette colors by name and hex code.
- Explain WHY a palette works for the user's situation using color theory.
- If mixing palettes, explain which colors from each bird work together and why.
- Give practical advice: which walls, which textiles, which accents.
- Consider the user's lighting, room size, existing furniture, and style preferences.
- Be warm, encouraging, and specific. Avoid vague advice.
- Keep responses concise but helpful — aim for 2-4 short paragraphs.
- When suggesting colors, format hex codes so users can reference them.`;
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    if (!apiKey) { setShowKeyInput(true); return; }

    const userMsg = { role: 'user', content: chatInput.trim() };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: buildSystemPrompt(),
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg = { role: 'assistant', content: data.content[0].text };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}. Check your API key and try again.` }]);
    } finally {
      setChatLoading(false);
    }
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

      {/* AI Chat Panel */}
      {chatOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold">Color Consultant</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowKeyInput(!showKeyInput)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="API Key Settings">
                <Settings className="w-4 h-4" />
              </button>
              <button onClick={() => setChatOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {showKeyInput && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 flex-shrink-0">
              <p className="text-xs text-amber-800 mb-2 font-medium">Enter your Claude API key (stored in your browser only):</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 text-sm px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button onClick={() => saveApiKey(apiKey)} className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Save</button>
              </div>
              <p className="text-[10px] text-amber-600 mt-1">Get a key at console.anthropic.com. Never shared with anyone.</p>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <Palette className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">Ask me anything about color palettes, room styling, or which birds work best for your space.</p>
                <div className="space-y-2">
                  {[
                    'Which palette works for a cozy north-facing bedroom?',
                    'How would I use the Quetzal palette in a small kitchen?',
                    'I have a gray couch — which bird palette matches?',
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setChatInput(q); }}
                      className="block w-full text-left text-xs px-3 py-2 bg-gray-50 hover:bg-emerald-50 rounded-lg text-gray-600 hover:text-emerald-700 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-xl rounded-bl-sm text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder={apiKey ? 'Ask about colors, palettes, rooms...' : 'Set your API key first (gear icon)'}
                disabled={chatLoading}
                className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm font-semibold hidden sm:inline">Color Consultant</span>
        </button>
      )}

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
