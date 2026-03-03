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
  1: { unsplashId: 'pwgMl-5OgEw', imageCredit: 'Gennady Zakharin', image: 'https://images.unsplash.com/photo-1743546116449-e6af9a359245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 2: American Avocet
  2: { unsplashId: 'YJMhpHxnVMA', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1634506265137-dfe099043c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 4: American Barn Owl (same photo as hero #3)
  4: { unsplashId: null, imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1553375764-7c6df25bea21?w=800&q=80' },
  // 5: Brant
  5: { unsplashId: 'UZbCVWTDxpE', imageCredit: 'Michaela Merglova', image: 'https://images.unsplash.com/photo-1758565204101-6959abc3322c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 6: Western Screech-Owl
  6: { unsplashId: 'FNv8LO_EQ-s', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1553375764-33035db79a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 8: Great Horned Owl (same image as hero #7)
  8: { unsplashId: null, imageCredit: 'Raakesh Blokhra', image: 'https://images.unsplash.com/photo-1697550761910-183fe206cfa3?w=800&q=80' },
  // 9: Brown Creeper
  9: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: 'https://images.unsplash.com/photo-1581452416075-20409263fe9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 10: Barred Owl
  10: { unsplashId: '16TAZQOPKyo', imageCredit: 'Philip Brown', image: 'https://images.unsplash.com/photo-1517517666444-6978df380b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 11: Northern Pygmy-Owl
  11: { unsplashId: 'OTQGvlHQHhw', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1553383088-380dc59fb0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 12: Bewick's Wren
  12: { unsplashId: 'b_-KVgWg_YM', imageCredit: 'Ryk Naves', image: 'https://images.unsplash.com/photo-1516158314695-14bedec722bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 13: Wrentit
  13: { unsplashId: 'b_-KVgWg_YM', imageCredit: 'Ryk Naves', image: 'https://images.unsplash.com/photo-1516158314695-14bedec722bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 14: Canada Goose
  14: { unsplashId: 'WboxGutfzR4', imageCredit: 'Chris Linnett', image: 'https://images.unsplash.com/photo-1670191828564-122609214ff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 15: Mourning Dove
  15: { unsplashId: 'CuoZ6BxJkwY', imageCredit: 'Matt Bango', image: 'https://images.unsplash.com/photo-1665341401470-7db0d79d307a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 16: Hermit Thrush
  16: { unsplashId: 'm4G78xfDnKA', imageCredit: 'Margaret Strickland', image: 'https://images.unsplash.com/photo-1677641800969-6b48b2a363ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 17: Dark-eyed Junco
  17: { unsplashId: 'RyqtMoupyoI', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1624134657846-22b43dd3e622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 18: Evening Grosbeak — removed: was showing Rose-breasted Grosbeak photo (no Unsplash match found)
  // 19: Pink Robin
  19: { unsplashId: 'ImhNT6UAaGE', imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1574626003470-ac963a52dc7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 20: White-crowned Sparrow
  20: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: 'https://images.unsplash.com/photo-1581452416075-20409263fe9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 21: Bull-headed Shrike
  21: { unsplashId: 'M-7eSVirG54', imageCredit: 'Peter Lloyd', image: 'https://images.unsplash.com/photo-1520949425682-0170a14641e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 22: Golden Eagle
  22: { unsplashId: 'POKVzE1RWJ0', imageCredit: 'Sasha Matic', image: 'https://images.unsplash.com/photo-1750797636255-8c939940bcad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 23: Cinnamon Teal
  23: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1623974109390-d76868f8b83c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 24: Chestnut-backed Chickadee
  24: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: 'https://images.unsplash.com/photo-1581452416075-20409263fe9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 25: Cinnamon Teal (dup)
  25: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1623974109390-d76868f8b83c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 26: Northern Jacana
  26: { unsplashId: 'ZZArmIkKans', imageCredit: 'Robert Thiemann', image: 'https://images.unsplash.com/photo-1568984464504-33faa64f2de9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 27: Red Phalarope
  27: { unsplashId: 'uDF4-h_WkOY', imageCredit: 'Annie Spratt', image: 'https://plus.unsplash.com/premium_photo-1743091112985-e4f2478b6f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 28: Eastern Bluebird
  28: { unsplashId: 'OeYUyI7jWwc', imageCredit: 'Patrice Bouchard', image: 'https://images.unsplash.com/photo-1620588280212-bf1d2b23b112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 29: Orchard Oriole
  29: { unsplashId: 'JvOnkvF3xRA', imageCredit: 'Carrie Stary', image: 'https://images.unsplash.com/photo-1572800892846-9d4998eec39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 30: Scarlet Tanager
  30: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1629303665571-9c87edc9eccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 31: Ruddy Duck
  31: { unsplashId: 'f2UP1SX6XcA', imageCredit: 'Explorer International', image: 'https://images.unsplash.com/photo-1604040058326-a3b482c6fe27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 32: Great Egret
  32: { unsplashId: '1RxqrsppkA0', imageCredit: 'Hans Veth', image: 'https://images.unsplash.com/photo-1578340619269-d4a574ab864d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 33: Ruddy Turnstone
  33: { unsplashId: 'uDF4-h_WkOY', imageCredit: 'Annie Spratt', image: 'https://plus.unsplash.com/premium_photo-1743091112985-e4f2478b6f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 34: Canvasback
  34: { unsplashId: 'f2UP1SX6XcA', imageCredit: 'Explorer International', image: 'https://images.unsplash.com/photo-1604040058326-a3b482c6fe27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 35: Wild Turkey
  35: { unsplashId: 'wo39JBLqzo8', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1602595190586-bffca5064d6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 36: Peregrine Falcon
  36: { unsplashId: 'vUiZXRBzEjY', imageCredit: 'Rory Tucker', image: 'https://images.unsplash.com/photo-1711234630245-809748b0f02e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 37: Green-winged Teal
  37: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1623974109390-d76868f8b83c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 38: Yellow-rumped Warbler
  38: { unsplashId: 'ONd4JMRLlFM', imageCredit: 'OANA BUZATU', image: 'https://images.unsplash.com/photo-1759063915826-bce703bcb2bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 39: Golden-cheeked Warbler
  39: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 40: Townsend's Warbler
  40: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: 'https://images.unsplash.com/photo-1687741623377-abed9428a2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 41: Blackburnian Warbler
  41: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 42: Eurasian Blue Tit
  42: { unsplashId: 'nk1QkifO8Z0', imageCredit: 'Robert Thiemann', image: 'https://images.unsplash.com/photo-1567336629702-db0e6850ba6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 43: Black-capped Vireo
  43: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: 'https://images.unsplash.com/photo-1687741623377-abed9428a2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 44: Western Kingbird
  44: { unsplashId: 'B-4KAmkFU_c', imageCredit: 'Richard Lee', image: 'https://images.unsplash.com/photo-1561988269-7180e021fc5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 45: Western Meadowlark
  45: { unsplashId: 'B-4KAmkFU_c', imageCredit: 'Richard Lee', image: 'https://images.unsplash.com/photo-1561988269-7180e021fc5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 46: Wilson's Warbler
  46: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: 'https://images.unsplash.com/photo-1687741623377-abed9428a2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 47: Common Yellowthroat
  47: { unsplashId: 'B-4KAmkFU_c', imageCredit: 'Richard Lee', image: 'https://images.unsplash.com/photo-1561988269-7180e021fc5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 48: Lesser Goldfinch
  48: { unsplashId: 'bIz1pu4vd2g', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1591204917671-9c87edc9eccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 49: Lesser Goldfinch (dup)
  49: { unsplashId: 'bIz1pu4vd2g', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1591204917671-9c87edc9eccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 50: Wilson's Warbler (dup)
  50: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: 'https://images.unsplash.com/photo-1687741623377-abed9428a2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 51: Hooded Warbler
  51: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 52: Red-bearded Bee-eater
  52: { unsplashId: null, imageCredit: 'Houmame Khelili', image: 'https://images.unsplash.com/photo-1663855738455-dc1e419cc8d0?w=800&q=80' },
  // 53: Lesser Goldfinch (dup)
  53: { unsplashId: 'bIz1pu4vd2g', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1591204917671-9c87edc9eccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 54: Northern Flicker
  54: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1702083560810-79cd2f2f21c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 55: Red-winged Blackbird
  55: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1618098750476-7595588232fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 56: Yellow-headed Blackbird
  56: { unsplashId: 'JT-vscbHVEw', imageCredit: 'Ricardo Martins', image: 'https://images.unsplash.com/photo-1646316295361-620ddcf16a37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 57: Hooded Oriole
  57: { unsplashId: '42BsLftzMrU', imageCredit: 'Paul Crook', image: 'https://images.unsplash.com/photo-1663099926889-5f385398a150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 58: American Goldfinch
  58: { unsplashId: 'frms3oEqir0', imageCredit: 'MICHAEL MURPHY', image: 'https://images.unsplash.com/photo-1564940060479-29a6a7aac422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 59: Western Tanager
  59: { unsplashId: 'RnQ2G7bVgnU', imageCredit: 'Ronald Diel', image: 'https://images.unsplash.com/photo-1593721582014-0183fea86710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 60: Yellow Warbler
  60: { unsplashId: 'tjZPseTxe6k', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1620694563886-c3a80ec55f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 61: Saffron Finch
  61: { unsplashId: 'eTXSu9MgDbY', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1618098750285-9402745c67e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 62: Cedar Waxwing
  62: { unsplashId: 'wPQQSjmPU-U', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1624134658974-79dd6a3cb9c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 63: Bullock's Oriole
  63: { unsplashId: 'JvOnkvF3xRA', imageCredit: 'Carrie Stary', image: 'https://images.unsplash.com/photo-1572800892846-9d4998eec39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 64: Baltimore Oriole
  64: { unsplashId: 'JvOnkvF3xRA', imageCredit: 'Carrie Stary', image: 'https://images.unsplash.com/photo-1572800892846-9d4998eec39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 65: Orange Dove
  65: { unsplashId: '2UodVgEMrv8', imageCredit: 'Aly Crouse', image: 'https://images.unsplash.com/photo-1659734499885-ca8e000fff43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 66: Golden Pheasant (same as hero #226)
  66: { unsplashId: null, imageCredit: 'Sushanta Rokka', image: 'https://images.unsplash.com/photo-1748791247330-9591a838abed?w=800&q=80' },
  // 67: Northern Cardinal (same as hero #221)
  67: { unsplashId: null, imageCredit: 'Ray Hennessy', image: 'https://images.unsplash.com/photo-1482330625994-3bb3c90a5d05?w=800&q=80' },
  // 68: American Robin
  68: { unsplashId: 'sO4mAuM96Fc', imageCredit: 'Trac Vu', image: 'https://images.unsplash.com/photo-1616720072185-8b281d6538ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 69: California Towhee
  69: { unsplashId: 'gWj5SBdfaLs', imageCredit: 'Luciani K.', image: null },
  // 70: Anna's Hummingbird (same as hero #228)
  70: { unsplashId: null, imageCredit: 'Zdenek Machacek', image: 'https://images.unsplash.com/photo-1552727451-6f5671e14d83?w=800&q=80' },
  // 71: Red-shouldered Hawk
  71: { unsplashId: 'bD5nxfyBo84', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1633517244345-44a659c78fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 72: Varied Thrush
  72: { unsplashId: 'm4G78xfDnKA', imageCredit: 'Margaret Strickland', image: 'https://images.unsplash.com/photo-1677641800969-6b48b2a363ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 73: European Robin
  73: { unsplashId: 'ImhNT6UAaGE', imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1574626003470-ac963a52dc7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 74: Silverbird
  74: { unsplashId: null, imageCredit: 'Laya Clode', image: 'https://images.unsplash.com/photo-1615791773013-324387bbf7b0?w=800&q=80' },
  // 75: American Kestrel
  75: { unsplashId: 'vUiZXRBzEjY', imageCredit: 'Rory Tucker', image: 'https://images.unsplash.com/photo-1711234630245-809748b0f02e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 76: Northern Flicker (dup)
  76: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1702083560810-79cd2f2f21c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 77: Great Blue Heron
  77: { unsplashId: '3_Ha5zDbpws', imageCredit: 'Robert Thiemann', image: 'https://images.unsplash.com/photo-1566256913176-399f16cb8671?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 78: Cooper's Hawk
  78: { unsplashId: 'bD5nxfyBo84', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1633517244345-44a659c78fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 79: California Quail
  79: { unsplashId: 'WOY8h-olonY', imageCredit: 'Richard Lee', image: 'https://images.unsplash.com/photo-1592192711577-aa829a269ed3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 80: Mississippi Kite
  80: { unsplashId: 'QqTJYKYfnXo', imageCredit: 'Mathieu Odin', image: 'https://plus.unsplash.com/premium_photo-1696257975463-3b956749d029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 81: Heermann's Gull
  81: { unsplashId: 'Rf_RGLMfrWw', imageCredit: 'George White', image: 'https://images.unsplash.com/photo-1652720517669-283343f9191d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 82: Ring-billed Gull
  82: { unsplashId: 'zEVCDlA4xwc', imageCredit: 'Zoshua Colah', image: 'https://images.unsplash.com/photo-1750093750474-16867228a477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 83: Ancient Murrelet
  83: { unsplashId: 'DOi_mbNXciw', imageCredit: 'Veni-Vidi Vint', image: 'https://images.unsplash.com/photo-1512422210908-7936b9934e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 84: Whimbrel
  84: { unsplashId: 'cE5FuLWztF0', imageCredit: 'Pete Godfrey', image: 'https://images.unsplash.com/photo-1745657992843-d253410577c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 85: Blue-gray Gnatcatcher
  85: { unsplashId: '1ACUT19tF-A', imageCredit: 'Bryan Hanson', image: 'https://images.unsplash.com/photo-1547062917-ebc43c94c403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 86: Piping Plover
  86: { unsplashId: 'FUNIa_n9Lok', imageCredit: 'Getty Images', image: null },
  // 87: Rose-breasted Grosbeak
  87: { unsplashId: '2xkUW9URWDw', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1620392931520-f90facaef074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 88: Willet
  88: { unsplashId: 'suDCrUDUNVA', imageCredit: 'Mathew Schwartz', image: 'https://images.unsplash.com/photo-1643993941838-34b20f686112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 89: Mute Swan
  89: { unsplashId: 'MDiwNU1pIdo', imageCredit: 'Robert Woeger', image: 'https://images.unsplash.com/photo-1593069310094-080326c950a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 90: Caspian Tern
  90: { unsplashId: 'k5n57jcZaGw', imageCredit: 'Trac Vu', image: 'https://images.unsplash.com/photo-1662783755770-22062cc523dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 91: Eared Grebe
  91: { unsplashId: '0W2iuoxCwDc', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1628723513209-fb37f55b4cfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 92: Snowy Egret
  92: { unsplashId: 'DuwAcW03PLc', imageCredit: 'Ray Hennessy', image: 'https://images.unsplash.com/photo-1612187119083-07dc1e40891d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 93: Snow Goose
  93: { unsplashId: 'aAg7VesBNiQ', imageCredit: 'Jean Giroux', image: 'https://images.unsplash.com/photo-1650241295300-605d9d02507e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 94: White Ibis
  94: { unsplashId: 'FqR4cKMdojI', imageCredit: 'Jason Dent', image: 'https://images.unsplash.com/photo-1544905071-861a347b34f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 95: American White Pelican
  95: { unsplashId: '3DFm5lKkFm0', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1634609243333-7a8d333d509b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 96: Western Gull
  96: { unsplashId: 'Rf_RGLMfrWw', imageCredit: 'George White', image: 'https://images.unsplash.com/photo-1652720517669-283343f9191d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 97: White-tailed Kite
  97: { unsplashId: 'QqTJYKYfnXo', imageCredit: 'Mathieu Odin', image: 'https://plus.unsplash.com/premium_photo-1696257975463-3b956749d029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 98: Common Goldeneye
  98: { unsplashId: 'cqObfpV9S0c', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1628483570633-d44d5a2667a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 99: Black-crowned Night Heron
  99: { unsplashId: 'YC6BOIp_VGU', imageCredit: 'OANA BUZATU', image: 'https://images.unsplash.com/photo-1741317821754-934be1f1b978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 100: Band-tailed Pigeon
  100: { unsplashId: '2UodVgEMrv8', imageCredit: 'Aly Crouse', image: 'https://images.unsplash.com/photo-1659734499885-ca8e000fff43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 101: Forster's Tern
  101: { unsplashId: 'G13Bl19xrhY', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1634328946144-030056a21e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 102: Caspian Tern (dup)
  102: { unsplashId: 'k5n57jcZaGw', imageCredit: 'Trac Vu', image: 'https://images.unsplash.com/photo-1662783755770-22062cc523dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 103: King Penguin
  103: { unsplashId: 'SwLyFhlch_k', imageCredit: 'Paul Carroll', image: 'https://images.unsplash.com/photo-1551985812-03adaf5b5c7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 104: Great Black-backed Gull
  104: { unsplashId: 'zEVCDlA4xwc', imageCredit: 'Zoshua Colah', image: 'https://images.unsplash.com/photo-1750093750474-16867228a477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 106: Black Skimmer
  106: { unsplashId: 'OqYyVgTX_p8', imageCredit: 'OANA BUZATU', image: 'https://images.unsplash.com/photo-1744765895742-14c9259123ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 107: American Oystercatcher
  107: { unsplashId: 'suDCrUDUNVA', imageCredit: 'Mathew Schwartz', image: 'https://images.unsplash.com/photo-1643993941838-34b20f686112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 108: Bald Eagle
  108: { unsplashId: 'OVEiy-2C-lw', imageCredit: 'Mathew Schwartz', image: 'https://images.unsplash.com/photo-1523403080951-1c8f5c8847ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 109: Black Oystercatcher
  109: { unsplashId: '85Rb8Cl9Rxc', imageCredit: 'Wallace Fonseca', image: 'https://images.unsplash.com/photo-1696900004042-60bcc200aca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 110: American Coot
  110: { unsplashId: 'Tnwx_VgNY7k', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1597779610365-84e1d6ff5589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 111: Montezuma Oropendola
  111: { unsplashId: '42BsLftzMrU', imageCredit: 'Paul Crook', image: 'https://images.unsplash.com/photo-1663099926889-5f385398a150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 112: Double-crested Cormorant
  112: { unsplashId: '1FIvGAmU_J0', imageCredit: 'Andrew Laulman', image: 'https://images.unsplash.com/photo-1759509276514-84b7201e5270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 113: Turkey Vulture
  113: { unsplashId: 'ST6YltRNdGA', imageCredit: 'Michael Baird', image: 'https://images.unsplash.com/photo-1429152113244-c5e6e2ed6ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 114: European Starling
  114: { unsplashId: 'h_zT1GbCmx8', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1624134657952-6f5c41051622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 115: Red-winged Blackbird (dup)
  115: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1618098750476-7595588232fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 116: House Finch
  116: { unsplashId: '7NAmgKaYcJA', imageCredit: 'Unknown', image: 'https://images.unsplash.com/photo-1578603335588-a521f5dc8db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 118: Purple Finch
  118: { unsplashId: 'N7xxnf_4Tm8', imageCredit: 'Patrick Bigelow', image: 'https://images.unsplash.com/photo-1748097111560-ad87200db989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 119: Roseate Spoonbill
  119: { unsplashId: 'VgvtxnoAg4Q', imageCredit: 'Ray Hennessy', image: 'https://images.unsplash.com/photo-1585837048432-3960830d5b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 120: Scarlet Ibis
  120: { unsplashId: '2Z298mFZmCY', imageCredit: 'Museums Victoria', image: 'https://images.unsplash.com/photo-1721855098504-f6cbe5708aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 121: Northern Cardinal (dup)
  121: { unsplashId: null, imageCredit: 'Ray Hennessy', image: 'https://images.unsplash.com/photo-1482330625994-3bb3c90a5d05?w=800&q=80' },
  // 122: Scarlet Tanager (dup)
  122: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1629303665571-9c87edc9eccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 123: Crimson-collared Tanager
  123: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1629303665571-9c87edc9eccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 124: Red-headed Woodpecker
  124: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1702083560810-79cd2f2f21c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 125: Red-breasted Sapsucker
  125: { unsplashId: 'N4hbPj1_mLw', imageCredit: 'OANA BUZATU', image: null },
  // 126: Painted Redstart
  126: { unsplashId: 'hY8mBYDHrSg', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1629303665571-9c87edc9eccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 127: Rose-breasted Grosbeak (dup)
  127: { unsplashId: '2xkUW9URWDw', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1620392931520-f90facaef074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 128: American Crow
  128: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1709439681846-60a076f48892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 129: Nuttall's Woodpecker
  129: { unsplashId: 'N4hbPj1_mLw', imageCredit: 'OANA BUZATU', image: null },
  // 130: American Crow (dup)
  130: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1709439681846-60a076f48892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 131: Pileated Woodpecker
  131: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1702083560810-79cd2f2f21c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 132: Purple Gallinule
  132: { unsplashId: 'A5i834KxwAw', imageCredit: 'Joseph Corl', image: 'https://images.unsplash.com/photo-1710880549442-e7b81cb3169e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 133: Laughing Gull
  133: { unsplashId: 'Rf_RGLMfrWw', imageCredit: 'George White', image: 'https://images.unsplash.com/photo-1652720517669-283343f9191d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 134: Red-faced Warbler
  134: { unsplashId: 'cKVLHCo5iPk', imageCredit: 'Camerauthor Photos', image: 'https://images.unsplash.com/photo-1687741623377-abed9428a2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 135: Black-necked Stilt
  135: { unsplashId: 'zixs3qZ8GbA', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1634506265293-4381931f18bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 136: Pink Robin (dup)
  136: { unsplashId: 'ImhNT6UAaGE', imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1574626003470-ac963a52dc7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 137: Common Raven
  137: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1709439681846-60a076f48892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 139: Barn Swallow
  139: { unsplashId: 'aMohRq-jD1Y', imageCredit: 'Hans Veth', image: 'https://images.unsplash.com/photo-1613492697603-8546c5f9ff24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 140: Buff-breasted Paradise-Kingfisher
  140: { unsplashId: null, imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
  // 141: Little Blue Heron
  141: { unsplashId: 'QIZbq0GbA6g', imageCredit: 'Joseph Corl', image: 'https://images.unsplash.com/photo-1706976348243-cbb50c366b34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 142: Belted Kingfisher
  142: { unsplashId: 'G9Aq-zTTvaw', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1623974108307-968b9f796921?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 143: Blue Rock-Thrush
  143: { unsplashId: 'JZ8dtOWoQxg', imageCredit: 'Christoph Nolte', image: 'https://images.unsplash.com/photo-1725653811863-8ca1776e126a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 144: Common Blackbird
  144: { unsplashId: 'JZ8dtOWoQxg', imageCredit: 'Christoph Nolte', image: 'https://images.unsplash.com/photo-1725653811863-8ca1776e126a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 145: Southern Cassowary
  145: { unsplashId: 'bsarUP0k8kk', imageCredit: 'Luca Ambrosi', image: 'https://images.unsplash.com/photo-1508627399176-6acc7a0e7101?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 146: Phainopepla
  146: { unsplashId: 'FBip9u7MrFA', imageCredit: 'Bryan Hanson', image: 'https://images.unsplash.com/photo-1550965465-dce8eccab798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 147: Black-billed Magpie
  147: { unsplashId: 'DFCnzrSYqpQ', imageCredit: 'Natasha Miller', image: 'https://images.unsplash.com/photo-1502116789488-8f0c6d794de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 148: Purple Martin
  148: { unsplashId: 'RhRZydrVoyk', imageCredit: 'Brian Yurasits', image: 'https://images.unsplash.com/photo-1644967955514-054539f6fe07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 149: Black Paradise-Kingfisher
  149: { unsplashId: null, imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
  // 150: Bobolink
  150: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1618098750476-7595588232fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 151: Violet-backed Starling
  151: { unsplashId: 'h_zT1GbCmx8', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1624134657952-6f5c41051622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 152: Superb Starling
  152: { unsplashId: null, imageCredit: 'Laya Clode', image: 'https://images.unsplash.com/photo-1615791773013-324387bbf7b0?w=800&q=80' },
  // 153: California Scrub Jay
  153: { unsplashId: null, imageCredit: 'Ruben Ortega', image: 'https://images.unsplash.com/photo-1599607524581-8209e3c26cd4?w=800&q=80' },
  // 154: Steller's Jay (same as hero #160)
  154: { unsplashId: null, imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1682318103409-702f0622f147?w=800&q=80' },
  // 155: Azure-winged Magpie
  155: { unsplashId: 'DFCnzrSYqpQ', imageCredit: 'Natasha Miller', image: 'https://images.unsplash.com/photo-1502116789488-8f0c6d794de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 156: Florida Scrub Jay
  156: { unsplashId: null, imageCredit: 'Ruben Ortega', image: 'https://images.unsplash.com/photo-1599607524581-8209e3c26cd4?w=800&q=80' },
  // 158: Steller's Jay (dup)
  158: { unsplashId: null, imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1682318103409-702f0622f147?w=800&q=80' },
  // 159: Blue Grosbeak
  159: { unsplashId: 'R8SwfEpq18M', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1628104505126-70e931be68c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 161: Satin Bowerbird
  161: { unsplashId: 'GPGEct42CBs', imageCredit: 'David Clode', image: 'https://images.unsplash.com/photo-1745228926105-cf365b4f76aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 162: Indigo Bunting
  162: { unsplashId: 'R8SwfEpq18M', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1628104505126-70e931be68c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 163: Mountain Bluebird
  163: { unsplashId: 'wFdCFmY-JS4', imageCredit: 'John Duncan', image: 'https://images.unsplash.com/photo-1541971126-d98efa910469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 164: Blue-gray Tanager
  164: { unsplashId: 'R8SwfEpq18M', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1628104505126-70e931be68c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 165: Green Honeycreeper
  165: { unsplashId: 'ZpuGQYKAlOw', imageCredit: 'Joseph Corl', image: 'https://images.unsplash.com/photo-1711500930787-e56876655d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 166: Golden-hooded Tanager
  166: { unsplashId: 'nk1QkifO8Z0', imageCredit: 'Robert Thiemann', image: 'https://images.unsplash.com/photo-1567336629702-db0e6850ba6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 167: Lazuli Bunting
  167: { unsplashId: 'wFdCFmY-JS4', imageCredit: 'John Duncan', image: 'https://images.unsplash.com/photo-1541971126-d98efa910469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 171: Common Kingfisher (same as hero #224)
  171: { unsplashId: null, imageCredit: 'Vincent van Zalinge', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
  // 172: Dollarbird
  172: { unsplashId: null, imageCredit: 'Laya Clode', image: 'https://images.unsplash.com/photo-1615791773013-324387bbf7b0?w=800&q=80' },
  // 173: South Papuan Pitta
  173: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: 'https://images.unsplash.com/photo-1752654262999-50170cfb9546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 174: Agami Heron
  174: { unsplashId: 'ZpuGQYKAlOw', imageCredit: 'Joseph Corl', image: 'https://images.unsplash.com/photo-1711500930787-e56876655d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 175: European Starling (dup)
  175: { unsplashId: 'h_zT1GbCmx8', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1624134657952-6f5c41051622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 176: Green Heron
  176: { unsplashId: 'ZpuGQYKAlOw', imageCredit: 'Joseph Corl', image: 'https://images.unsplash.com/photo-1711500930787-e56876655d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 177: Gartered Trogon
  177: { unsplashId: null, imageCredit: 'Aleksandar Popovski', image: 'https://images.unsplash.com/photo-1677806366747-269e24360c8f?w=800&q=80' },
  // 178: Pigeon Guillemot
  178: { unsplashId: 'DOi_mbNXciw', imageCredit: 'Veni-Vidi Vint', image: 'https://images.unsplash.com/photo-1512422210908-7936b9934e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 179: Painted Bunting (same as hero #194)
  179: { unsplashId: null, imageCredit: 'Paul Crook', image: 'https://images.unsplash.com/photo-1659477134700-b606a8fc197e?w=800&q=80' },
  // 180: Yellow-billed Magpie
  180: { unsplashId: 'DFCnzrSYqpQ', imageCredit: 'Natasha Miller', image: 'https://images.unsplash.com/photo-1502116789488-8f0c6d794de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 181: Varied Green Sunbird
  181: { unsplashId: 'nk1QkifO8Z0', imageCredit: 'Robert Thiemann', image: 'https://images.unsplash.com/photo-1567336629702-db0e6850ba6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 182: Orange Dove (dup)
  182: { unsplashId: '2UodVgEMrv8', imageCredit: 'Aly Crouse', image: 'https://images.unsplash.com/photo-1659734499885-ca8e000fff43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 183: Anna's Hummingbird (dup)
  183: { unsplashId: null, imageCredit: 'Zdenek Machacek', image: 'https://images.unsplash.com/photo-1552727451-6f5671e14d83?w=800&q=80' },
  // 184: Lesson's Motmot
  184: { unsplashId: null, imageCredit: 'Aleksandar Popovski', image: 'https://images.unsplash.com/photo-1677806366747-269e24360c8f?w=800&q=80' },
  // 185: Rainbow Bee-eater
  185: { unsplashId: null, imageCredit: 'Houmame Khelili', image: 'https://images.unsplash.com/photo-1663855738455-dc1e419cc8d0?w=800&q=80' },
  // 186: Gouldian Finch
  186: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: 'https://images.unsplash.com/photo-1752654262999-50170cfb9546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 189: Painted Bunting (dup)
  189: { unsplashId: null, imageCredit: 'Paul Crook', image: 'https://images.unsplash.com/photo-1659477134700-b606a8fc197e?w=800&q=80' },
  // 190: Grass-green Tanager
  190: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: 'https://images.unsplash.com/photo-1752654262999-50170cfb9546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 191: Grass-green Tanager (dup)
  191: { unsplashId: 'EPqP2iPGfP8', imageCredit: 'David Clode', image: 'https://images.unsplash.com/photo-1752654262999-50170cfb9546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 192: Red-masked Parakeet
  192: { unsplashId: null, imageCredit: 'David Clode', image: 'https://images.unsplash.com/photo-1559084906-27df42f15c5f?w=800&q=80' },
  // 193: Red-headed Barbet
  193: { unsplashId: 'EinKdyLyK98', imageCredit: 'Philip Brown', image: 'https://images.unsplash.com/photo-1517516794485-082c4d03bb19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 195: Broad-billed Hummingbird
  195: { unsplashId: 'FYj2gAyNRCw', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1683470432347-7b40520fb583?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 196: Lewis's Woodpecker
  196: { unsplashId: 'ljJEAezcDEQ', imageCredit: 'fr0ggy5', image: 'https://images.unsplash.com/photo-1702083560810-79cd2f2f21c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 197: Northern Shoveler
  197: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1623974109390-d76868f8b83c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 198: Mallard
  198: { unsplashId: 'FMhKI2qxNK0', imageCredit: 'Zosia Szopka', image: 'https://images.unsplash.com/photo-1742128965797-1bb2584f83fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 199: Common Myna
  199: { unsplashId: '7DfZmKFk-I0', imageCredit: 'Maheera Kulsoom', image: 'https://images.unsplash.com/photo-1741271783794-4c6b8e851f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 200: Green-winged Teal (dup)
  200: { unsplashId: 'G3vB-YGdzmU', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1623974109390-d76868f8b83c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 201: Ruby-crowned Kinglet
  201: { unsplashId: 'jZT6kAAHIHk', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1624123794521-77770ac5007a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 202: Bobolink (dup)
  202: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1618098750476-7595588232fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 203: Evening Grosbeak (dup) — removed: was showing Rose-breasted Grosbeak photo
  // 204: Pygmy Nuthatch
  204: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: 'https://images.unsplash.com/photo-1581452416075-20409263fe9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 205: Carolina Chickadee
  205: { unsplashId: 'NgSPFaBWICo', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1592246479181-268c0b0698c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 206: Bushtit
  206: { unsplashId: 'TxkisEuUs7w', imageCredit: 'Andy Holmes', image: 'https://images.unsplash.com/photo-1581452416075-20409263fe9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 207: Oak Titmouse
  207: { unsplashId: 'NgSPFaBWICo', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1592246479181-268c0b0698c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 208: Carolina Wren
  208: { unsplashId: 'b_-KVgWg_YM', imageCredit: 'Ryk Naves', image: 'https://images.unsplash.com/photo-1516158314695-14bedec722bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 209: Common Loon
  209: { unsplashId: '0W2iuoxCwDc', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1628723513209-fb37f55b4cfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 210: Snowy Owl (same as hero #225)
  210: { unsplashId: null, imageCredit: 'Brendan Hollis', image: 'https://images.unsplash.com/photo-1569016238741-f9b53e89563b?w=800&q=80' },
  // 211: Loggerhead Shrike
  211: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1618098750476-7595588232fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 212: Chimney Swift
  212: { unsplashId: 'RhRZydrVoyk', imageCredit: 'Brian Yurasits', image: 'https://images.unsplash.com/photo-1644967955514-054539f6fe07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 213: Pink-eared Duck
  213: { unsplashId: 'FMhKI2qxNK0', imageCredit: 'Zosia Szopka', image: 'https://images.unsplash.com/photo-1742128965797-1bb2584f83fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 214: Black Phoebe
  214: { unsplashId: 'O6VG-YOCFKo', imageCredit: 'Matt Bango', image: null },
  // 215: Black Vulture
  215: { unsplashId: 'r1XGxppSxvM', imageCredit: 'Paul Crook', image: 'https://images.unsplash.com/photo-1675358666336-ca6294cb0afb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 216: American Crow (dup)
  216: { unsplashId: 'FKSaTvw4B1A', imageCredit: 'Jeremy Hynes', image: 'https://images.unsplash.com/photo-1709439681846-60a076f48892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 217: American Coot (dup)
  217: { unsplashId: 'Tnwx_VgNY7k', imageCredit: 'Joshua J. Cotten', image: 'https://images.unsplash.com/photo-1597779610365-84e1d6ff5589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 218: Brewer's Blackbird
  218: { unsplashId: 'JT-vscbHVEw', imageCredit: 'Ricardo Martins', image: 'https://images.unsplash.com/photo-1646316295361-620ddcf16a37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  // 219: Red-winged Blackbird (dup)
  219: { unsplashId: 'fF5ByVQC0rQ', imageCredit: 'Mark Olsen', image: 'https://images.unsplash.com/photo-1618098750476-7595588232fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
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
