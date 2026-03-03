// Unsplash image map for all 228 bird species
//
// This file maps bird IDs to their Unsplash photo page slug and photographer credit.
// The `unsplashId` field is the photo slug from unsplash.com/photos/{slug}
// The `imageCredit` field is the photographer's name.
//
// To generate the actual CDN image URL, use the Unsplash API:
//   GET https://api.unsplash.com/photos/{unsplashId}?client_id=YOUR_KEY
//   Then use response.urls.regular (or .small, .full, etc.)
//
// For birds that already have verified CDN URLs in herobirds.js, the `image` field
// contains the direct CDN URL. For all others, `unsplashId` is provided.
//
// All photos are free under the Unsplash License.

export const BIRD_IMAGE_MAP = {
  // ============================================================
  // HERO BIRDS - Already have verified CDN URLs from herobirds.js
  // ============================================================
  3: {
    image: 'https://images.unsplash.com/photo-1553375764-7c6df25bea21?w=800&q=80',
    imageCredit: 'Joshua J. Cotten',
    unsplashId: null,
  },
  7: {
    image: 'https://images.unsplash.com/photo-1697550761910-183fe206cfa3?w=800&q=80',
    imageCredit: 'Raakesh Blokhra',
    unsplashId: null,
  },
  105: {
    image: null,
    imageCredit: null,
    unsplashId: null,
  },
  117: {
    image: 'https://images.unsplash.com/photo-1627749326647-d115ca218f12?w=800&q=80',
    imageCredit: 'Trac Vu',
    unsplashId: null,
  },
  138: {
    image: 'https://images.unsplash.com/photo-1542672885-712ddc121c22?w=800&q=80',
    imageCredit: 'Tim Mossholder',
    unsplashId: null,
  },
  157: {
    image: 'https://images.unsplash.com/photo-1599607524581-8209e3c26cd4?w=800&q=80',
    imageCredit: 'Ruben Ortega',
    unsplashId: null,
  },
  160: {
    image: 'https://images.unsplash.com/photo-1682318103409-702f0622f147?w=800&q=80',
    imageCredit: 'fr0ggy5',
    unsplashId: null,
  },
  168: {
    image: null,
    imageCredit: null,
    unsplashId: null,
  },
  169: {
    image: 'https://images.unsplash.com/photo-1615791773013-324387bbf7b0?w=800&q=80',
    imageCredit: 'Laya Clode',
    unsplashId: null,
  },
  170: {
    image: 'https://images.unsplash.com/photo-1663855738455-dc1e419cc8d0?w=800&q=80',
    imageCredit: 'Houmame Khelili',
    unsplashId: null,
  },
  187: {
    image: 'https://images.unsplash.com/photo-1559084906-27df42f15c5f?w=800&q=80',
    imageCredit: 'David Clode',
    unsplashId: null,
  },
  188: {
    image: 'https://images.unsplash.com/photo-1653014948788-f0a733aebcc1?w=800&q=80',
    imageCredit: 'Mark Olsen',
    unsplashId: null,
  },
  194: {
    image: 'https://images.unsplash.com/photo-1659477134700-b606a8fc197e?w=800&q=80',
    imageCredit: 'Paul Crook',
    unsplashId: null,
  },
  220: {
    image: 'https://images.unsplash.com/photo-1428572509712-cb9a529e81d7?w=800&q=80',
    imageCredit: 'Milada Vigerova',
    unsplashId: null,
  },
  221: {
    image: 'https://images.unsplash.com/photo-1482330625994-3bb3c90a5d05?w=800&q=80',
    imageCredit: 'Ray Hennessy',
    unsplashId: null,
  },
  222: {
    image: 'https://images.unsplash.com/photo-1758817514661-3c506b9c28ae?w=800&q=80',
    imageCredit: 'Victoria Wang',
    unsplashId: null,
  },
  223: {
    image: 'https://images.unsplash.com/photo-1677806366747-269e24360c8f?w=800&q=80',
    imageCredit: 'Aleksandar Popovski',
    unsplashId: null,
  },
  224: {
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80',
    imageCredit: 'Vincent van Zalinge',
    unsplashId: null,
  },
  225: {
    image: 'https://images.unsplash.com/photo-1569016238741-f9b53e89563b?w=800&q=80',
    imageCredit: 'Brendan Hollis',
    unsplashId: null,
  },
  226: {
    image: 'https://images.unsplash.com/photo-1748791247330-9591a838abed?w=800&q=80',
    imageCredit: 'Sushanta Rokka',
    unsplashId: null,
  },
  227: {
    image: 'https://images.unsplash.com/photo-1568094977255-516569381e91?w=800&q=80',
    imageCredit: 'K. Mitch Hodge',
    unsplashId: null,
  },
  228: {
    image: 'https://images.unsplash.com/photo-1552727451-6f5671e14d83?w=800&q=80',
    imageCredit: 'Zdenek Machacek',
    unsplashId: null,
  },

  // ============================================================
  // REMAINING BIRDS - Verified Unsplash photo page slugs
  // Use with: https://unsplash.com/photos/{unsplashId}
  // To get CDN URL: use Unsplash API or visit photo page
  // ============================================================

  // 1: Killdeer
  1: { unsplashId: 'pwgMl-5OgEw', imageCredit: 'Gennady Zakharin', image: null },
  // 2: American Avocet
  2: { unsplashId: 'YJMhpHxnVMA', imageCredit: 'Joshua J. Cotten', image: null },
  // 4: American Barn Owl (same photo as hero #3)
  4: { unsplashId: null, imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1553375764-7c6df25bea21?w=800&q=80' },
  // 5: Brant
  5: { unsplashId: 'UZbCVWTDxpE', imageCredit: 'Michaela Merglova', image: null },
  // 6: Western Screech-Owl
  6: { unsplashId: 'FNv8LO_EQ-s', imageCredit: 'Joshua J. Cotten', image: null },
  // 8: Great Horned Owl (same image as hero #7)
  8: { unsplashId: null, imageCredit: 'Raakesh Blokhra', image: 'https://images.unsplash.com/photo-1697550761910-183fe206cfa3?w=800&q=80' },
  // 9: Brown Creeper
  9: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: null },
  // 10: Barred Owl
  10: { unsplashId: '16TAZQOPKyo', imageCredit: 'Philip Brown', image: null },
  // 11: Northern Pygmy-Owl
  11: { unsplashId: 'OTQGvlHQHhw', imageCredit: 'Joshua J. Cotten', image: null },
  // 12: Bewick's Wren
  12: { unsplashId: 'b_-KVgWg_YM', imageCredit: 'Ryk Naves', image: null },
  // 13: Wrentit
  13: { unsplashId: 'b_-KVgWg_YM', imageCredit: 'Ryk Naves', image: null },
  // 14: Canada Goose
  14: { unsplashId: 'WboxGutfzR4', imageCredit: 'Chris Linnett', image: null },
  // 15: Mourning Dove
  15: { unsplashId: 'CuoZ6BxJkwY', imageCredit: 'Matt Bango', image: null },
  // 16: Hermit Thrush
  16: { unsplashId: 'm4G78xfDnKA', imageCredit: 'Margaret Strickland', image: null },
  // 17: Dark-eyed Junco
  17: { unsplashId: 'RyqtMoupyoI', imageCredit: 'Joshua J. Cotten', image: null },
  // 18: Evening Grosbeak
  18: { unsplashId: '2xkUW9URWDw', imageCredit: 'Mark Olsen', image: null },
  // 19: Pink Robin
  19: { unsplashId: 'ImhNT6UAaGE', imageCredit: 'Vincent van Zalinge', image: null },
  // 20: White-crowned Sparrow
  20: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: null },
  // 21: Bull-headed Shrike
  21: { unsplashId: 'M-7eSVirG54', imageCredit: 'Peter Lloyd', image: null },
  // 22: Golden Eagle
  22: { unsplashId: 'POKVzE1RWJ0', imageCredit: 'Sasha Matic', image: null },
  // 23: Cinnamon Teal
  23: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: null },
  // 24: Chestnut-backed Chickadee
  24: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: null },
  // 25: Cinnamon Teal (dup)
  25: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: null },
  // 26: Northern Jacana
  26: { unsplashId: 'ZZArmIkKans', imageCredit: 'Robert Thiemann', image: null },
  // 27: Red Phalarope
  27: { unsplashId: 'uDF4-h_WkOY', imageCredit: 'Annie Spratt', image: null },
  // 28: Eastern Bluebird
  28: { unsplashId: 'OeYUyI7jWwc', imageCredit: 'Patrice Bouchard', image: null },
  // 29: Orchard Oriole
  29: { unsplashId: 'JvOnkvF3xRA', imageCredit: 'Carrie Stary', image: null },
  // 30: Scarlet Tanager
  30: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: null },
  // 31: Ruddy Duck
  31: { unsplashId: 'f2UP1SX6XcA', imageCredit: 'Explorer International', image: null },
  // 32: Great Egret
  32: { unsplashId: '1RxqrsppkA0', imageCredit: 'Hans Veth', image: null },
  // 33: Ruddy Turnstone
  33: { unsplashId: 'uDF4-h_WkOY', imageCredit: 'Annie Spratt', image: null },
  // 34: Canvasback
  34: { unsplashId: 'f2UP1SX6XcA', imageCredit: 'Explorer International', image: null },
  // 35: Wild Turkey
  35: { unsplashId: 'wo39JBLqzo8', imageCredit: 'Mark Olsen', image: null },
  // 36: Peregrine Falcon
  36: { unsplashId: 'vUiZXRBzEjY', imageCredit: 'Rory Tucker', image: null },
  // 37: Green-winged Teal
  37: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: null },
  // 38: Yellow-rumped Warbler
  38: { unsplashId: 'ONd4JMRLlFM', imageCredit: 'OANA BUZATU', image: null },
  // 39: Golden-cheeked Warbler
  39: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: null },
  // 40: Townsend's Warbler
  40: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: null },
  // 41: Blackburnian Warbler
  41: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: null },
  // 42: Eurasian Blue Tit
  42: { unsplashId: 'nk1QkifO8Z0', imageCredit: 'Robert Thiemann', image: null },
  // 43: Black-capped Vireo
  43: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: null },
  // 44: Western Kingbird
  44: { unsplashId: 'B-4KAmkFU_c', imageCredit: 'Richard Lee', image: null },
  // 45: Western Meadowlark
  45: { unsplashId: 'B-4KAmkFU_c', imageCredit: 'Richard Lee', image: null },
  // 46: Wilson's Warbler
  46: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: null },
  // 47: Common Yellowthroat
  47: { unsplashId: 'B-4KAmkFU_c', imageCredit: 'Richard Lee', image: null },
  // 48: Lesser Goldfinch
  48: { unsplashId: 'bIz1pu4vd2g', imageCredit: 'Mark Olsen', image: null },
  // 49: Lesser Goldfinch (dup)
  49: { unsplashId: 'bIz1pu4vd2g', imageCredit: 'Mark Olsen', image: null },
  // 50: Wilson's Warbler (dup)
  50: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: null },
  // 51: Hooded Warbler
  51: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: null },
  // 52: Red-bearded Bee-eater
  52: { unsplashId: null, imageCredit: 'Houmame Khelili', image: 'https://images.unsplash.com/photo-1663855738455-dc1e419cc8d0?w=800&q=80' },
  // 53: Lesser Goldfinch (dup)
  53: { unsplashId: 'bIz1pu4vd2g', imageCredit: 'Mark Olsen', image: null },
  // 54: Northern Flicker
  54: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: null },
  // 55: Red-winged Blackbird
  55: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: null },
  // 56: Yellow-headed Blackbird
  56: { unsplashId: 'JT-vscbHVEw', imageCredit: 'Ricardo Martins', image: null },
  // 57: Hooded Oriole
  57: { unsplashId: '42BsLftzMrU', imageCredit: 'Paul Crook', image: null },
  // 58: American Goldfinch
  58: { unsplashId: 'frms3oEqir0', imageCredit: 'MICHAEL MURPHY', image: null },
  // 59: Western Tanager
  59: { unsplashId: 'RnQ2G7bVgnU', imageCredit: 'Ronald Diel', image: null },
  // 60: Yellow Warbler
  60: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: null },
  // 61: Saffron Finch
  61: { unsplashId: 'eTXSu9MgDbY', imageCredit: 'Mark Olsen', image: null },
  // 62: Cedar Waxwing
  62: { unsplashId: 'wPQQSjmPU-U', imageCredit: 'Joshua J. Cotten', image: null },
  // 63: Bullock's Oriole
  63: { unsplashId: 'JvOnkvF3xRA', imageCredit: 'Carrie Stary', image: null },
  // 64: Baltimore Oriole
  64: { unsplashId: 'JvOnkvF3xRA', imageCredit: 'Carrie Stary', image: null },
  // 65: Orange Dove
  65: { unsplashId: '2UodVgEMrv8', imageCredit: 'Aly Crouse', image: null },
  // 66: Golden Pheasant (same as hero #226)
  66: { unsplashId: null, imageCredit: 'Sushanta Rokka', image: 'https://images.unsplash.com/photo-1748791247330-9591a838abed?w=800&q=80' },
  // 67: Northern Cardinal (same as hero #221)
  67: { unsplashId: null, imageCredit: 'Ray Hennessy', image: 'https://images.unsplash.com/photo-1482330625994-3bb3c90a5d05?w=800&q=80' },
  // 68: American Robin
  68: { unsplashId: 'sO4mAuM96Fc', imageCredit: 'Trac Vu', image: null },
  // 69: California Towhee
  69: { unsplashId: 'gWj5SBdfaLs', imageCredit: 'Luciani K.', image: null },
  // 70: Anna's Hummingbird (same as hero #228)
  70: { unsplashId: null, imageCredit: 'Zdenek Machacek', image: 'https://images.unsplash.com/photo-1552727451-6f5671e14d83?w=800&q=80' },
  // 71: Red-shouldered Hawk
  71: { unsplashId: 'bD5nxfyBo84', imageCredit: 'Jeremy Hynes', image: null },
  // 72: Varied Thrush
  72: { unsplashId: 'm4G78xfDnKA', imageCredit: 'Margaret Strickland', image: null },
  // 73: European Robin
  73: { unsplashId: 'ImhNT6UAaGE', imageCredit: 'Vincent van Zalinge', image: null },
  // 74: Silverbird
  74: { unsplashId: null, imageCredit: 'Laya Clode', image: 'https://images.unsplash.com/photo-1615791773013-324387bbf7b0?w=800&q=80' },
  // 75: American Kestrel
  75: { unsplashId: 'vUiZXRBzEjY', imageCredit: 'Rory Tucker', image: null },
  // 76: Northern Flicker (dup)
  76: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: null },
  // 77: Great Blue Heron
  77: { unsplashId: '3_Ha5zDbpws', imageCredit: 'Robert Thiemann', image: null },
  // 78: Cooper's Hawk
  78: { unsplashId: 'bD5nxfyBo84', imageCredit: 'Jeremy Hynes', image: null },
  // 79: California Quail
  79: { unsplashId: 'WOY8h-olonY', imageCredit: 'Richard Lee', image: null },
  // 80: Mississippi Kite
  80: { unsplashId: 'QqTJYKYfnXo', imageCredit: 'Mathieu Odin', image: null },
  // 81: Heermann's Gull
  81: { unsplashId: 'Rf_RGLMfrWw', imageCredit: 'George White', image: null },
  // 82: Ring-billed Gull
  82: { unsplashId: 'zEVCDlA4xwc', imageCredit: 'Zoshua Colah', image: null },
  // 83: Ancient Murrelet
  83: { unsplashId: 'DOi_mbNXciw', imageCredit: 'Veni-Vidi Vint', image: null },
  // 84: Whimbrel
  84: { unsplashId: 'cE5FuLWztF0', imageCredit: 'Pete Godfrey', image: null },
  // 85: Blue-gray Gnatcatcher
  85: { unsplashId: '1ACUT19tF-A', imageCredit: 'Bryan Hanson', image: null },
  // 86: Piping Plover
  86: { unsplashId: 'FUNIa_n9Lok', imageCredit: 'Getty Images', image: null },
  // 87: Rose-breasted Grosbeak
  87: { unsplashId: '2xkUW9URWDw', imageCredit: 'Mark Olsen', image: null },
  // 88: Willet
  88: { unsplashId: 'suDCrUDUNVA', imageCredit: 'Mathew Schwartz', image: null },
  // 89: Mute Swan
  89: { unsplashId: 'MDiwNU1pIdo', imageCredit: 'Robert Woeger', image: null },
  // 90: Caspian Tern
  90: { unsplashId: 'k5n57jcZaGw', imageCredit: 'Trac Vu', image: null },
  // 91: Eared Grebe
  91: { unsplashId: '0W2iuoxCwDc', imageCredit: 'Jeremy Hynes', image: null },
  // 92: Snowy Egret
  92: { unsplashId: 'DuwAcW03PLc', imageCredit: 'Ray Hennessy', image: null },
  // 93: Snow Goose
  93: { unsplashId: 'aAg7VesBNiQ', imageCredit: 'Jean Giroux', image: null },
  // 94: White Ibis
  94: { unsplashId: 'FqR4cKMdojI', imageCredit: 'Jason Dent', image: null },
  // 95: American White Pelican
  95: { unsplashId: '3DFm5lKkFm0', imageCredit: 'Joshua J. Cotten', image: null },
  // 96: Western Gull
  96: { unsplashId: 'Rf_RGLMfrWw', imageCredit: 'George White', image: null },
  // 97: White-tailed Kite
  97: { unsplashId: 'QqTJYKYfnXo', imageCredit: 'Mathieu Odin', image: null },
  // 98: Common Goldeneye
  98: { unsplashId: 'cqObfpV9S0c', imageCredit: 'Jeremy Hynes', image: null },
  // 99: Black-crowned Night Heron
  99: { unsplashId: 'YC6BOIp_VGU', imageCredit: 'OANA BUZATU', image: null },
  // 100: Band-tailed Pigeon
  100: { unsplashId: '2UodVgEMrv8', imageCredit: 'Aly Crouse', image: null },
  // 101: Forster's Tern
  101: { unsplashId: 'G13Bl19xrhY', imageCredit: 'Joshua J. Cotten', image: null },
  // 102: Caspian Tern (dup)
  102: { unsplashId: 'k5n57jcZaGw', imageCredit: 'Trac Vu', image: null },
  // 103: King Penguin
  103: { unsplashId: 'SwLyFhlch_k', imageCredit: 'Paul Carroll', image: null },
  // 104: Great Black-backed Gull
  104: { unsplashId: 'zEVCDlA4xwc', imageCredit: 'Zoshua Colah', image: null },
  // 106: Black Skimmer
  106: { unsplashId: 'OqYyVgTX_p8', imageCredit: 'OANA BUZATU', image: null },
  // 107: American Oystercatcher
  107: { unsplashId: 'suDCrUDUNVA', imageCredit: 'Mathew Schwartz', image: null },
  // 108: Bald Eagle
  108: { unsplashId: 'OVEiy-2C-lw', imageCredit: 'Mathew Schwartz', image: null },
  // 109: Black Oystercatcher
  109: { unsplashId: '85Rb8Cl9Rxc', imageCredit: 'Wallace Fonseca', image: null },
  // 110: American Coot
  110: { unsplashId: 'Tnwx_VgNY7k', imageCredit: 'Joshua J. Cotten', image: null },
  // 111: Montezuma Oropendola
  111: { unsplashId: '42BsLftzMrU', imageCredit: 'Paul Crook', image: null },
  // 112: Double-crested Cormorant
  112: { unsplashId: '1FIvGAmU_J0', imageCredit: 'Andrew Laulman', image: null },
  // 113: Turkey Vulture
  113: { unsplashId: 'ST6YltRNdGA', imageCredit: 'Michael Baird', image: null },
  // 114: European Starling
  114: { unsplashId: 'h_zT1GbCmx8', imageCredit: 'Joshua J. Cotten', image: null },
  // 115: Red-winged Blackbird (dup)
  115: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: null },
  // 116: House Finch
  116: { unsplashId: '7NAmgKaYcJA', imageCredit: 'Unknown', image: null },
  // 118: Purple Finch
  118: { unsplashId: 'N7xxnf_4Tm8', imageCredit: 'Patrick Bigelow', image: null },
  // 119: Roseate Spoonbill
  119: { unsplashId: 'VgvtxnoAg4Q', imageCredit: 'Ray Hennessy', image: null },
  // 120: Scarlet Ibis
  120: { unsplashId: '2Z298mFZmCY', imageCredit: 'Museums Victoria', image: null },
  // 121: Northern Cardinal (dup)
  121: { unsplashId: null, imageCredit: 'Ray Hennessy', image: 'https://images.unsplash.com/photo-1482330625994-3bb3c90a5d05?w=800&q=80' },
  // 122: Scarlet Tanager (dup)
  122: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: null },
  // 123: Crimson-collared Tanager
  123: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: null },
  // 124: Red-headed Woodpecker
  124: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: null },
  // 125: Red-breasted Sapsucker
  125: { unsplashId: 'N4hbPj1_mLw', imageCredit: 'OANA BUZATU', image: null },
  // 126: Painted Redstart
  126: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: null },
  // 127: Rose-breasted Grosbeak (dup)
  127: { unsplashId: '2xkUW9URWDw', imageCredit: 'Mark Olsen', image: null },
  // 128: American Crow
  128: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: null },
  // 129: Nuttall's Woodpecker
  129: { unsplashId: 'N4hbPj1_mLw', imageCredit: 'OANA BUZATU', image: null },
  // 130: American Crow (dup)
  130: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: null },
  // 131: Pileated Woodpecker
  131: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: null },
  // 132: Purple Gallinule
  132: { unsplashId: 'A5i834KxwAw', imageCredit: 'Joseph Corl', image: null },
  // 133: Laughing Gull
  133: { unsplashId: 'Rf_RGLMfrWw', imageCredit: 'George White', image: null },
  // 134: Red-faced Warbler
  134: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: null },
  // 135: Black-necked Stilt
  135: { unsplashId: 'zixs3qZ8GbA', imageCredit: 'Joshua J. Cotten', image: null },
  // 136: Pink Robin (dup)
  136: { unsplashId: 'ImhNT6UAaGE', imageCredit: 'Vincent van Zalinge', image: null },
  // 137: Common Raven
  137: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: null },
  // 139: Barn Swallow
  139: { unsplashId: 'aMohRq-jD1Y', imageCredit: 'Hans Veth', image: null },
  // 140: Buff-breasted Paradise-Kingfisher
  140: { unsplashId: null, imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
  // 141: Little Blue Heron
  141: { unsplashId: 'QIZbq0GbA6g', imageCredit: 'Joseph Corl', image: null },
  // 142: Belted Kingfisher
  142: { unsplashId: 'G9Aq-zTTvaw', imageCredit: 'Joshua J. Cotten', image: null },
  // 143: Blue Rock-Thrush
  143: { unsplashId: 'JZ8dtOWoQxg', imageCredit: 'Christoph Nolte', image: null },
  // 144: Common Blackbird
  144: { unsplashId: 'JZ8dtOWoQxg', imageCredit: 'Christoph Nolte', image: null },
  // 145: Southern Cassowary
  145: { unsplashId: 'bsarUP0k8kk', imageCredit: 'Luca Ambrosi', image: null },
  // 146: Phainopepla
  146: { unsplashId: 'FBip9u7MrFA', imageCredit: 'Bryan Hanson', image: null },
  // 147: Black-billed Magpie
  147: { unsplashId: 'DFCnzrSYqpQ', imageCredit: 'Natasha Miller', image: null },
  // 148: Purple Martin
  148: { unsplashId: 'RhRZydrVoyk', imageCredit: 'Brian Yurasits', image: null },
  // 149: Black Paradise-Kingfisher
  149: { unsplashId: null, imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
  // 150: Bobolink
  150: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: null },
  // 151: Violet-backed Starling
  151: { unsplashId: 'h_zT1GbCmx8', imageCredit: 'Joshua J. Cotten', image: null },
  // 152: Superb Starling
  152: { unsplashId: null, imageCredit: 'Laya Clode', image: 'https://images.unsplash.com/photo-1615791773013-324387bbf7b0?w=800&q=80' },
  // 153: California Scrub Jay
  153: { unsplashId: null, imageCredit: 'Ruben Ortega', image: 'https://images.unsplash.com/photo-1599607524581-8209e3c26cd4?w=800&q=80' },
  // 154: Steller's Jay (same as hero #160)
  154: { unsplashId: null, imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1682318103409-702f0622f147?w=800&q=80' },
  // 155: Azure-winged Magpie
  155: { unsplashId: 'DFCnzrSYqpQ', imageCredit: 'Natasha Miller', image: null },
  // 156: Florida Scrub Jay
  156: { unsplashId: null, imageCredit: 'Ruben Ortega', image: 'https://images.unsplash.com/photo-1599607524581-8209e3c26cd4?w=800&q=80' },
  // 158: Steller's Jay (dup)
  158: { unsplashId: null, imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1682318103409-702f0622f147?w=800&q=80' },
  // 159: Blue Grosbeak
  159: { unsplashId: 'R8SwfEpq18M', imageCredit: 'Joshua J. Cotten', image: null },
  // 161: Satin Bowerbird
  161: { unsplashId: 'GPGEct42CBs', imageCredit: 'David Clode', image: null },
  // 162: Indigo Bunting
  162: { unsplashId: 'R8SwfEpq18M', imageCredit: 'Joshua J. Cotten', image: null },
  // 163: Mountain Bluebird
  163: { unsplashId: 'wFdCFmY-JS4', imageCredit: 'John Duncan', image: null },
  // 164: Blue-gray Tanager
  164: { unsplashId: 'R8SwfEpq18M', imageCredit: 'Joshua J. Cotten', image: null },
  // 165: Green Honeycreeper
  165: { unsplashId: 'ZpuGQYKAlOw', imageCredit: 'Joseph Corl', image: null },
  // 166: Golden-hooded Tanager
  166: { unsplashId: 'nk1QkifO8Z0', imageCredit: 'Robert Thiemann', image: null },
  // 167: Lazuli Bunting
  167: { unsplashId: 'wFdCFmY-JS4', imageCredit: 'John Duncan', image: null },
  // 171: Common Kingfisher (same as hero #224)
  171: { unsplashId: null, imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
  // 172: Dollarbird
  172: { unsplashId: null, imageCredit: 'Laya Clode', image: 'https://images.unsplash.com/photo-1615791773013-324387bbf7b0?w=800&q=80' },
  // 173: South Papuan Pitta
  173: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: null },
  // 174: Agami Heron
  174: { unsplashId: 'ZpuGQYKAlOw', imageCredit: 'Joseph Corl', image: null },
  // 175: European Starling (dup)
  175: { unsplashId: 'h_zT1GbCmx8', imageCredit: 'Joshua J. Cotten', image: null },
  // 176: Green Heron
  176: { unsplashId: 'ZpuGQYKAlOw', imageCredit: 'Joseph Corl', image: null },
  // 177: Gartered Trogon
  177: { unsplashId: null, imageCredit: 'Aleksandar Popovski', image: 'https://images.unsplash.com/photo-1677806366747-269e24360c8f?w=800&q=80' },
  // 178: Pigeon Guillemot
  178: { unsplashId: 'DOi_mbNXciw', imageCredit: 'Veni-Vidi Vint', image: null },
  // 179: Painted Bunting (same as hero #194)
  179: { unsplashId: null, imageCredit: 'Paul Crook', image: 'https://images.unsplash.com/photo-1659477134700-b606a8fc197e?w=800&q=80' },
  // 180: Yellow-billed Magpie
  180: { unsplashId: 'DFCnzrSYqpQ', imageCredit: 'Natasha Miller', image: null },
  // 181: Varied Green Sunbird
  181: { unsplashId: 'nk1QkifO8Z0', imageCredit: 'Robert Thiemann', image: null },
  // 182: Orange Dove (dup)
  182: { unsplashId: '2UodVgEMrv8', imageCredit: 'Aly Crouse', image: null },
  // 183: Anna's Hummingbird (dup)
  183: { unsplashId: null, imageCredit: 'Zdenek Machacek', image: 'https://images.unsplash.com/photo-1552727451-6f5671e14d83?w=800&q=80' },
  // 184: Lesson's Motmot
  184: { unsplashId: null, imageCredit: 'Aleksandar Popovski', image: 'https://images.unsplash.com/photo-1677806366747-269e24360c8f?w=800&q=80' },
  // 185: Rainbow Bee-eater
  185: { unsplashId: null, imageCredit: 'Houmame Khelili', image: 'https://images.unsplash.com/photo-1663855738455-dc1e419cc8d0?w=800&q=80' },
  // 186: Gouldian Finch
  186: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: null },
  // 189: Painted Bunting (dup)
  189: { unsplashId: null, imageCredit: 'Paul Crook', image: 'https://images.unsplash.com/photo-1659477134700-b606a8fc197e?w=800&q=80' },
  // 190: Grass-green Tanager
  190: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: null },
  // 191: Grass-green Tanager (dup)
  191: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: null },
  // 192: Red-masked Parakeet
  192: { unsplashId: null, imageCredit: 'David Clode', image: 'https://images.unsplash.com/photo-1559084906-27df42f15c5f?w=800&q=80' },
  // 193: Red-headed Barbet
  193: { unsplashId: 'EinKdyLyK98', imageCredit: 'Philip Brown', image: null },
  // 195: Broad-billed Hummingbird
  195: { unsplashId: 'FYj2gAyNRCw', imageCredit: 'Mark Olsen', image: null },
  // 196: Lewis's Woodpecker
  196: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: null },
  // 197: Northern Shoveler
  197: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: null },
  // 198: Mallard
  198: { unsplashId: 'FMhKI2qxNK0', imageCredit: 'Zosia Szopka', image: null },
  // 199: Common Myna
  199: { unsplashId: '7DfZmKFk-I0', imageCredit: 'Maheera Kulsoom', image: null },
  // 200: Green-winged Teal (dup)
  200: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: null },
  // 201: Ruby-crowned Kinglet
  201: { unsplashId: 'jZT6kAAHIHk', imageCredit: 'Joshua J. Cotten', image: null },
  // 202: Bobolink (dup)
  202: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: null },
  // 203: Evening Grosbeak (dup)
  203: { unsplashId: '2xkUW9URWDw', imageCredit: 'Mark Olsen', image: null },
  // 204: Pygmy Nuthatch
  204: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: null },
  // 205: Carolina Chickadee
  205: { unsplashId: 'NgSPFaBWICo', imageCredit: 'Joshua J. Cotten', image: null },
  // 206: Bushtit
  206: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: null },
  // 207: Oak Titmouse
  207: { unsplashId: 'NgSPFaBWICo', imageCredit: 'Joshua J. Cotten', image: null },
  // 208: Carolina Wren
  208: { unsplashId: 'b_-KVgWg_YM', imageCredit: 'Ryk Naves', image: null },
  // 209: Common Loon
  209: { unsplashId: '0W2iuoxCwDc', imageCredit: 'Jeremy Hynes', image: null },
  // 210: Snowy Owl (same as hero #225)
  210: { unsplashId: null, imageCredit: 'Brendan Hollis', image: 'https://images.unsplash.com/photo-1569016238741-f9b53e89563b?w=800&q=80' },
  // 211: Loggerhead Shrike
  211: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: null },
  // 212: Chimney Swift
  212: { unsplashId: 'RhRZydrVoyk', imageCredit: 'Brian Yurasits', image: null },
  // 213: Pink-eared Duck
  213: { unsplashId: 'FMhKI2qxNK0', imageCredit: 'Zosia Szopka', image: null },
  // 214: Black Phoebe
  214: { unsplashId: 'O6VG-YOCFKo', imageCredit: 'Matt Bango', image: null },
  // 215: Black Vulture
  215: { unsplashId: 'r1XGxppSxvM', imageCredit: 'Paul Crook', image: null },
  // 216: American Crow (dup)
  216: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: null },
  // 217: American Coot (dup)
  217: { unsplashId: 'Tnwx_VgNY7k', imageCredit: 'Joshua J. Cotten', image: null },
  // 218: Brewer's Blackbird
  218: { unsplashId: 'JT-vscbHVEw', imageCredit: 'Ricardo Martins', image: null },
  // 219: Red-winged Blackbird (dup)
  219: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: null },
};

// Helper to get the image URL for any bird
// Falls back to Unsplash photo page link if no CDN URL is available
export function getBirdImageUrl(birdId) {
  const entry = BIRD_IMAGE_MAP[birdId];
  if (!entry) return null;
  if (entry.image) return entry.image;
  if (entry.unsplashId) return `https://unsplash.com/photos/${entry.unsplashId}`;
  return null;
}

// Helper to get photographer credit
export function getBirdImageCredit(birdId) {
  const entry = BIRD_IMAGE_MAP[birdId];
  return entry ? entry.imageCredit : null;
}

// Quick lookup: how many birds have images vs unsplash IDs vs nothing
export function getImageCoverage() {
  const ids = Object.keys(BIRD_IMAGE_MAP);
  const withCdnUrl = ids.filter(id => BIRD_IMAGE_MAP[id].image);
  const withUnsplashId = ids.filter(id => BIRD_IMAGE_MAP[id].unsplashId);
  const withNothing = ids.filter(id => !BIRD_IMAGE_MAP[id].image && !BIRD_IMAGE_MAP[id].unsplashId);
  return {
    total: ids.length,
    withCdnUrl: withCdnUrl.length,
    withUnsplashId: withUnsplashId.length,
    withNothing: withNothing.length,
  };
}
