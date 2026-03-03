// Curated editorial collections — each with a design point of view
// Some collections use hand-picked birdIds, others use runtime filtering

import { birds } from './birds';

export const COLLECTIONS = [
  {
    id: 'the-moody-blues',
    name: 'The Moody Blues',
    tagline: 'For dramatic, intimate spaces',
    description: 'These aren\'t your grandmother\'s blues. They\'re the midnight-after-the-storm palette, the color of a jazz club at 2am, the hue that makes a room feel like a secret. Pair with brass hardware and velvet — always velvet — and watch a room go from "nice" to "don\'t you dare leave."',
    birdIds: [157, 162, 163, 158, 161, 159],
    // Blue Jay, Indigo Bunting, Mountain Bluebird, Steller's Jay, Satin Bowerbird, Blue Grosbeak
    coverColors: ['#1a237e', '#283593', '#5c6bc0'],
    icon: 'Moon',
  },
  {
    id: 'desert-at-dawn',
    name: 'Desert at Dawn',
    tagline: 'Warm earth for southwestern souls',
    description: 'Terra cotta walls. Sand-washed linen. Sage on the windowsill. These palettes come from birds that thrive where the light is golden and the horizon is wide. If your dream room has a Navajo rug and smells like piñon, start here.',
    birdIds: [1, 3, 13, 69, 15, 22],
    // Killdeer, Ferruginous Hawk, Wrentit, California Towhee, Mourning Dove, Golden Eagle
    coverColors: ['#bf6e3e', '#d4a574', '#c4a882'],
    icon: 'Sun',
  },
  {
    id: 'the-nursery-edit',
    name: 'The Nursery Edit',
    tagline: 'Gentle palettes for restful spaces',
    description: 'Rated 5/5 for bedrooms by our algorithm, but chosen by instinct. These are the palettes that whisper instead of shout — the soft grays that feel like a hug, the muted blues that lower your heart rate, the warm taupes that make a room feel safe. For nurseries, reading nooks, and anywhere you need the world to slow down.',
    // Dynamic: bedroom rating 5 + calm mood — hand-picked best of the set
    birdIds: [4, 19, 89, 220, 205, 207],
    // American Barn Owl, Pink Robin (F), Mute Swan, Mallard (F), Carolina Chickadee, Oak Titmouse
    coverColors: ['#e8e0d4', '#c9bfb2', '#a8b4a0'],
    icon: 'Heart',
  },
  {
    id: 'jewel-box',
    name: 'Jewel Box',
    tagline: 'Saturated maximalism for the fearless',
    description: 'Emerald. Ruby. Sapphire. Amethyst. These palettes don\'t ask permission. They\'re for the dining room where you want guests to gasp, the powder room that\'s basically a nightclub, the library that takes itself seriously. Not for the faint of heart — but you already knew that.',
    birdIds: [138, 132, 186, 194, 168, 187],
    // Scarlet Macaw, Purple Gallinule, Gouldian Finch, Painted Bunting, Paradise Tanager, Rainbow Lorikeet
    coverColors: ['#b71c1c', '#4a148c', '#1b5e20'],
    icon: 'Gem',
  },
  {
    id: 'coastal-morning',
    name: 'Coastal Morning',
    tagline: 'Sea glass and driftwood',
    description: 'That first hour of light on the water, when the fog hasn\'t burned off and everything is silver-blue and salt-white. These palettes bring the coast inside without a single anchor motif or rope accent. Just clean, luminous color that makes a room feel like it has a view — even if it doesn\'t.',
    birdIds: [163, 164, 167, 103, 204, 224],
    // Mountain Bluebird, Blue-gray Tanager, Lazuli Bunting, King Penguin, Pygmy Nuthatch, Common Kingfisher
    coverColors: ['#90caf9', '#b0bec5', '#e0e7e3'],
    icon: 'Waves',
  },
  {
    id: 'warm-minimalist',
    name: 'Warm Minimalist',
    tagline: 'The quiet palette',
    description: 'Scandinavian restraint meets Japanese wabi-sabi. These are palettes where every color earns its place and white space does the heavy lifting. Warm enough to not feel clinical, spare enough to let the room breathe. For people who believe the most beautiful thing in a room is nothing extra.',
    birdIds: [4, 97, 78, 100, 201, 225],
    // American Barn Owl, White-tailed Kite, Cooper's Hawk, Band-tailed Pigeon, Ruby-crowned Kinglet, Snowy Owl
    coverColors: ['#efebe4', '#d7cdc3', '#c5beb6'],
    icon: 'Minus',
  },
  {
    id: 'midnight-garden',
    name: 'Midnight Garden',
    tagline: 'Moody botanicals for the bold',
    description: 'Dark walls. Lush greens. The botanical prints you\'d find in a Victorian greenhouse, but modern. These palettes pull from birds that live where the canopy blocks the sun — deep teals, forest greens, midnight purples. Add copper planters and a statement fern, and you\'ve built a room that feels alive.',
    birdIds: [176, 177, 165, 184, 173, 145],
    // Green Heron, Gartered Trogon, Green Honeycreeper, Lesson's Motmot, South Papuan Pitta, Southern Cassowary
    coverColors: ['#1b3a2d', '#2d5744', '#0d2818'],
    icon: 'Leaf',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    tagline: 'Amber, honey, and copper warmth',
    description: 'The last forty minutes of daylight, when everything looks like a photograph. These palettes live in the warm end of the spectrum — amber, honey, burnt sienna, copper — the colors that make a room glow even when the sun isn\'t streaming in. Perfect for north-facing rooms that need to feel like a south-facing embrace.',
    birdIds: [62, 64, 18, 72, 22, 66],
    // Cedar Waxwing, Baltimore Oriole, Evening Grosbeak, Varied Thrush, Golden Eagle, Golden Pheasant
    coverColors: ['#f59e0b', '#d97706', '#92400e'],
    icon: 'Sunset',
  },
];

// Helper to look up collection by ID
export const COLLECTION_MAP = Object.fromEntries(
  COLLECTIONS.map(c => [c.id, c])
);
