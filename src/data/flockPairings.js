export const FLOCK_PAIRINGS = [
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
