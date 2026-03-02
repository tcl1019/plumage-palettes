export const DESIGN_STYLES = [
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

export const FINISH_GUIDE = {
  dominant: { finish: 'Matte / Eggshell', reason: 'Hides wall imperfections; soft, sophisticated look for large surfaces' },
  secondary: { finish: 'Satin', reason: 'Durable for high-touch surfaces; subtle sheen complements textiles' },
  accent: { finish: 'Semi-Gloss', reason: 'Draws the eye to focal points; easy to clean on smaller surfaces' },
  neutral: { finish: 'Semi-Gloss', reason: 'Crisp on trim and molding; provides definition against matte walls' },
  highlight: { finish: 'Semi-Gloss / High-Gloss', reason: 'Creates drama on doors and architectural features' },
};

export const ROLE_LABELS = {
  dominant: { label: '60% Walls', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  secondary: { label: '30% Textiles', bg: 'bg-blue-100', text: 'text-blue-700' },
  accent: { label: '10% Accents', bg: 'bg-amber-100', text: 'text-amber-700' },
  neutral: { label: 'Trim', bg: 'bg-gray-100', text: 'text-gray-600' },
  highlight: { label: 'Feature', bg: 'bg-purple-100', text: 'text-purple-700' },
};

export const HARMONY_COLORS = {
  analogous: { bg: 'bg-green-100', text: 'text-green-700' },
  complementary: { bg: 'bg-rose-100', text: 'text-rose-700' },
  triadic: { bg: 'bg-purple-100', text: 'text-purple-700' },
  'split-complementary': { bg: 'bg-teal-100', text: 'text-teal-700' },
  monochromatic: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export const SEASON_STYLES = {
  'spring-summer': { bg: 'bg-green-100', text: 'text-green-700', label: 'Spring / Summer' },
  'fall-winter': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Fall / Winter' },
  'year-round': { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Year-Round' },
};

export const ROOM_TYPES = [
  { id: 'bedroom', label: 'Bedroom', icon: 'bed' },
  { id: 'living-room', label: 'Living Room', icon: 'sofa' },
  { id: 'kitchen', label: 'Kitchen', icon: 'chef-hat' },
  { id: 'bathroom', label: 'Bathroom', icon: 'bath' },
  { id: 'dining-room', label: 'Dining Room', icon: 'utensils' },
];

export const MOODS = [
  { id: 'calm', label: 'Calm & Serene', gradient: 'from-blue-200 to-green-200', harmonies: ['analogous', 'monochromatic'], undertones: ['cool'] },
  { id: 'warm', label: 'Warm & Cozy', gradient: 'from-amber-200 to-orange-200', harmonies: ['analogous', 'monochromatic'], undertones: ['warm'] },
  { id: 'bold', label: 'Bold & Dramatic', gradient: 'from-purple-300 to-rose-300', harmonies: ['triadic', 'complementary', 'split-complementary'], undertones: ['warm', 'cool'] },
  { id: 'fresh', label: 'Fresh & Airy', gradient: 'from-sky-200 to-emerald-100', harmonies: ['analogous'], undertones: ['cool', 'neutral'] },
  { id: 'eclectic', label: 'Eclectic & Fun', gradient: 'from-fuchsia-200 to-yellow-200', harmonies: ['triadic', 'split-complementary', 'complementary'], undertones: ['warm', 'cool'] },
];
