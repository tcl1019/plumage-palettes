/**
 * Generate product page URLs for Sherwin-Williams and Benjamin Moore paint colors.
 */

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getShopUrl(code, name, brand) {
  if (brand === 'sw') {
    // SW URL pattern: /en-us/color/color-family/all-colors/SW{code}-{name-slug}
    const slug = `${code.toLowerCase()}-${slugify(name)}`;
    return `https://www.sherwin-williams.com/en-us/color/color-family/all-colors/${slug}`;
  }
  if (brand === 'bm') {
    // BM URL pattern: /en-us/paint-colors/color/{code}/{name-slug}
    const slug = slugify(name);
    return `https://www.benjaminmoore.com/en-us/paint-colors/color/${code.toLowerCase()}/${slug}`;
  }
  return null;
}
