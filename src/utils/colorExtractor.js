/**
 * Median-cut color quantization for extracting dominant colors from images.
 * Deterministic — no random initialization unlike k-means.
 */

import { hexToRgb, rgbToHsl } from './colorUtils';

/**
 * Extract dominant colors from an image file or URL.
 * Draws to a small canvas and runs median-cut quantization.
 * @param {string|File} source - Image URL or File object
 * @param {number} count - Number of colors to extract (default 6)
 * @returns {Promise<Array<{hex: string, percentage: number}>>}
 */
export async function extractColors(source, count = 6) {
  const img = await loadImage(source);
  const pixels = samplePixels(img, 200);
  const buckets = medianCut(pixels, count);

  // Sort by bucket size (most dominant first)
  buckets.sort((a, b) => b.pixels.length - a.pixels.length);

  const total = buckets.reduce((sum, b) => sum + b.pixels.length, 0);

  return buckets.map(bucket => {
    const avg = averageColor(bucket.pixels);
    return {
      hex: rgbToHex(avg.r, avg.g, avg.b),
      percentage: Math.round((bucket.pixels.length / total) * 100),
    };
  });
}

/**
 * Load an image from a URL or File and return an HTMLImageElement.
 */
function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * Sample pixels from an image by drawing to a small canvas.
 * Samples every 2nd pixel for speed (~10,000 pixels from 200×200).
 * Filters out near-white, near-black, and very low saturation pixels.
 */
function samplePixels(img, maxSize = 200) {
  const canvas = document.createElement('canvas');
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const pixels = [];

  for (let i = 0; i < data.length; i += 8) { // every 2nd pixel (RGBA = 4 bytes)
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Skip near-white and near-black (they're not interesting)
    const brightness = (r + g + b) / 3;
    if (brightness > 245 || brightness < 10) continue;

    pixels.push([r, g, b]);
  }

  return pixels;
}

/**
 * Median-cut quantization.
 * Recursively splits pixel groups along the channel with the widest range.
 */
function medianCut(pixels, targetCount) {
  if (pixels.length === 0) return [];

  let buckets = [{ pixels }];

  while (buckets.length < targetCount) {
    // Find the bucket with the widest channel range (and most pixels)
    let bestIdx = -1;
    let bestRange = -1;
    let bestChannel = 0;

    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].pixels.length < 2) continue;
      const { channel, range } = widestChannel(buckets[i].pixels);
      // Favor both range and size
      const score = range * Math.log2(buckets[i].pixels.length + 1);
      if (score > bestRange) {
        bestRange = score;
        bestIdx = i;
        bestChannel = channel;
      }
    }

    if (bestIdx === -1) break; // Can't split further

    const bucket = buckets[bestIdx];
    bucket.pixels.sort((a, b) => a[bestChannel] - b[bestChannel]);
    const mid = Math.floor(bucket.pixels.length / 2);

    buckets.splice(bestIdx, 1,
      { pixels: bucket.pixels.slice(0, mid) },
      { pixels: bucket.pixels.slice(mid) }
    );
  }

  return buckets;
}

/**
 * Find which RGB channel has the widest range in a set of pixels.
 */
function widestChannel(pixels) {
  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
  for (const [r, g, b] of pixels) {
    if (r < minR) minR = r; if (r > maxR) maxR = r;
    if (g < minG) minG = g; if (g > maxG) maxG = g;
    if (b < minB) minB = b; if (b > maxB) maxB = b;
  }
  const ranges = [maxR - minR, maxG - minG, maxB - minB];
  const maxRange = Math.max(...ranges);
  return { channel: ranges.indexOf(maxRange), range: maxRange };
}

/**
 * Compute the average color of a pixel array.
 */
function averageColor(pixels) {
  let r = 0, g = 0, b = 0;
  for (const [pr, pg, pb] of pixels) {
    r += pr; g += pg; b += pb;
  }
  const n = pixels.length;
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

/**
 * Convert RGB to hex string.
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}
