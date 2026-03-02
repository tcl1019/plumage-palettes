export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
};

export const rgbToHsl = (r, g, b) => {
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

export const getUndertone = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'neutral';
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (s < 10) return 'neutral';
  if ((h >= 0 && h <= 70) || h >= 330) return 'warm';
  if (h >= 150 && h <= 290) return 'cool';
  return 'neutral';
};

export const generateTints = (hex, steps = 4) => {
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

export const generateShades = (hex, steps = 4) => {
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

export const getRelativeLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const getTextColor = (bgHex) =>
  getRelativeLuminance(bgHex) > 0.179 ? '#1A1A1A' : '#FFFFFF';
