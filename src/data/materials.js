import { getUndertone, hexToRgb, rgbToHsl } from '../utils/colorUtils';

// ── Style → Material pairings ──────────────────────────────────────────

const STYLE_MATERIALS = {
  'mid-century': {
    flooring: ['Walnut hardwood', 'Terrazzo tile', 'Cork planks'],
    hardware: ['Brushed brass', 'Satin gold', 'Oil-rubbed bronze'],
    stone: ['White quartz', 'Soapstone', 'Concrete composite'],
    textiles: ['Boucle upholstery', 'Linen curtains', 'Wool area rugs'],
  },
  coastal: {
    flooring: ['White oak planks', 'Bleached pine', 'Limestone tile'],
    hardware: ['Brushed nickel', 'Polished chrome', 'Weathered brass'],
    stone: ['Carrara marble', 'Sea-glass mosaic', 'Tumbled travertine'],
    textiles: ['Linen slipcovers', 'Cotton canvas', 'Sisal rugs'],
  },
  bohemian: {
    flooring: ['Reclaimed wood', 'Patterned encaustic tile', 'Jute layered rugs'],
    hardware: ['Hammered brass', 'Antiqued copper', 'Ceramic knobs'],
    stone: ['Hand-glazed zellige', 'Raw-edge marble', 'Terracotta'],
    textiles: ['Kilim rugs', 'Macrame wall hangings', 'Velvet cushions'],
  },
  scandinavian: {
    flooring: ['Pale ash hardwood', 'White-washed oak', 'Light birch'],
    hardware: ['Matte black steel', 'Brushed stainless', 'Pale oak pulls'],
    stone: ['Honed white marble', 'Light concrete', 'Pale granite'],
    textiles: ['Sheepskin throws', 'Wool-blend blankets', 'Cotton canvas'],
  },
  contemporary: {
    flooring: ['Engineered gray oak', 'Large-format porcelain', 'Polished concrete'],
    hardware: ['Matte black', 'Brushed steel', 'Gunmetal'],
    stone: ['Quartz composite', 'Nero marquina marble', 'Sintered stone'],
    textiles: ['Performance velvet', 'Structured linen', 'Flat-weave rugs'],
  },
  traditional: {
    flooring: ['Cherry hardwood', 'Herringbone parquet', 'Marble mosaic'],
    hardware: ['Polished brass', 'Antique bronze', 'Crystal knobs'],
    stone: ['Calacatta marble', 'Honed granite', 'Slate'],
    textiles: ['Damask drapery', 'Silk pillows', 'Persian rugs'],
  },
  'art-deco': {
    flooring: ['Black-and-white checkerboard', 'High-gloss ebony', 'Geometric marble inlay'],
    hardware: ['Polished gold', 'Chrome', 'Mirrored accents'],
    stone: ['Noir St. Laurent marble', 'Onyx', 'Green marble'],
    textiles: ['Velvet upholstery', 'Satin drapes', 'Faux fur throws'],
  },
  farmhouse: {
    flooring: ['Wide-plank pine', 'Distressed oak', 'Brick pavers'],
    hardware: ['Matte black iron', 'Aged pewter', 'Cup pulls in bronze'],
    stone: ['Butcher block', 'Soapstone', 'Tumbled limestone'],
    textiles: ['Ticking stripe', 'Grain sack fabric', 'Chunky knit throws'],
  },
  eclectic: {
    flooring: ['Patterned tile mix', 'Stained concrete', 'Layered vintage rugs'],
    hardware: ['Mixed metals', 'Vintage glass knobs', 'Leather-wrapped pulls'],
    stone: ['Terrazzo', 'Colorful mosaic', 'Reclaimed marble'],
    textiles: ['Suzani embroidery', 'Block-print linen', 'Patchwork quilts'],
  },
  tropical: {
    flooring: ['Bamboo', 'Teak planks', 'Terracotta hexagons'],
    hardware: ['Aged brass', 'Rattan-wrapped pulls', 'Matte gold'],
    stone: ['Coral stone', 'Lava stone', 'Green marble'],
    textiles: ['Rattan seating', 'Banana-leaf weave', 'Indoor-outdoor fabric'],
  },
  minimalist: {
    flooring: ['Pale concrete', 'White oak planks', 'Large-format stone tile'],
    hardware: ['Integrated pulls', 'Touch-latch', 'Matte aluminum'],
    stone: ['Ultra-thin porcelain', 'White Corian', 'Pale limestone'],
    textiles: ['Linen bedding', 'Merino wool throws', 'Low-pile wool rugs'],
  },
  japandi: {
    flooring: ['Light maple', 'Tatami-inspired tile', 'Pale bamboo'],
    hardware: ['Blackened steel', 'Natural wood pegs', 'Brushed brass bars'],
    stone: ['Honed basalt', 'Wabi-sabi cement', 'Pale porcelain'],
    textiles: ['Linen-cotton blend', 'Woven jute', 'Indigo-dyed fabric'],
  },
  industrial: {
    flooring: ['Polished concrete', 'Raw steel plate', 'Distressed hardwood'],
    hardware: ['Iron pipe fittings', 'Raw steel', 'Galvanized metal'],
    stone: ['Concrete countertops', 'Zinc', 'Blackened slate'],
    textiles: ['Canvas drop cloth', 'Waxed cotton', 'Leather hides'],
  },
  mediterranean: {
    flooring: ['Terracotta tiles', 'Hand-painted majolica', 'Tumbled stone'],
    hardware: ['Wrought iron', 'Aged copper', 'Ceramic pulls'],
    stone: ['Travertine', 'Hand-cut limestone', 'Marble mosaic'],
    textiles: ['Linen sheers', 'Cotton tasseled throws', 'Woven straw'],
  },
};

// ── Mood → texture feel ──────────────────────────────────────────────

const MOOD_TEXTURES = {
  calm: { textures: ['matte finishes', 'soft draping', 'smooth stone'], feel: 'Tactile surfaces should feel hushed — low contrast, gentle to the touch' },
  warm: { textures: ['nubby weaves', 'brushed metals', 'waxed wood'], feel: 'Layer organic textures that invite touch and catch warm light' },
  bold: { textures: ['high-gloss lacquer', 'polished metal', 'sculptural form'], feel: 'Mix reflective and matte surfaces for dramatic tension' },
  fresh: { textures: ['crisp cotton', 'smooth ceramic', 'polished glass'], feel: 'Keep textures clean and simple — think laundered linen in morning light' },
  eclectic: { textures: ['mixed patterns', 'beaded fringe', 'patina metals'], feel: 'Embrace variety — the unifying thread is your palette, not the material' },
};

// ── Undertone → metal + stone affinities ─────────────────────────────

const UNDERTONE_PAIRINGS = {
  warm: { metals: ['Brass', 'Gold', 'Copper'], stones: ['Travertine', 'Honey onyx', 'Warm quartz'] },
  cool: { metals: ['Chrome', 'Nickel', 'Stainless steel'], stones: ['Carrara marble', 'Slate', 'Blue pearl granite'] },
  neutral: { metals: ['Brushed nickel', 'Matte black', 'Pewter'], stones: ['White quartz', 'Limestone', 'Concrete'] },
};

// ── Main export ───────────────────────────────────────────────────────

export function getMaterialSuggestions(bird) {
  // Get primary style (first listed)
  const primaryStyle = bird.styles?.[0] || 'contemporary';
  const styleMats = STYLE_MATERIALS[primaryStyle] || STYLE_MATERIALS.contemporary;

  // Determine dominant undertone from the bird's colors
  const dominantColor = bird.colors.find(c => c.role === 'dominant');
  const undertone = dominantColor ? getUndertone(dominantColor.hex) : 'neutral';
  const uPairings = UNDERTONE_PAIRINGS[undertone] || UNDERTONE_PAIRINGS.neutral;

  // Get mood texture notes
  const primaryMood = bird.moods?.[0] || 'calm';
  const moodData = MOOD_TEXTURES[primaryMood] || MOOD_TEXTURES.calm;

  return {
    style: primaryStyle,
    undertone,
    flooring: styleMats.flooring,
    hardware: styleMats.hardware,
    stone: styleMats.stone,
    textiles: styleMats.textiles,
    metals: uPairings.metals,
    stones: uPairings.stones,
    textureTip: moodData.feel,
    textures: moodData.textures,
  };
}
