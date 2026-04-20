import type { ColorAnalysis, TonalScale } from './types';

// ─── Hex ↔ RGB ────────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

// ─── RGB ↔ HSL ────────────────────────────────────────────────────────────────

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// ─── Luminance & Contrast ─────────────────────────────────────────────────────

export function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);
  return contrastRatio(l1, l2);
}

export function getReadableTextColor(backgroundHex: string): string {
  const { r, g, b } = hexToRgb(backgroundHex);
  const lum = relativeLuminance(r, g, b);
  const onWhite = contrastRatio(lum, 1);
  const onBlack = contrastRatio(lum, 0);
  return onBlack > onWhite ? '#ffffff' : '#0a0a0a';
}

// ─── Color Manipulation ───────────────────────────────────────────────────────

export function adjustHsl(hex: string, dh = 0, ds = 0, dl = 0): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return hslToHex(
    (h + dh + 360) % 360,
    Math.max(0, Math.min(100, s + ds)),
    Math.max(0, Math.min(100, l + dl))
  );
}

export function setHsl(hex: string, h?: number, s?: number, l?: number): string {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  return hslToHex(
    h !== undefined ? h : hsl.h,
    s !== undefined ? s : hsl.s,
    l !== undefined ? l : hsl.l
  );
}

export function mixColors(hex1: string, hex2: string, weight = 0.5): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex(
    Math.round(c1.r * (1 - weight) + c2.r * weight),
    Math.round(c1.g * (1 - weight) + c2.g * weight),
    Math.round(c1.b * (1 - weight) + c2.b * weight)
  );
}

// ─── Complementary & Analogous ────────────────────────────────────────────────

export function getComplementary(hex: string): string {
  return adjustHsl(hex, 180);
}

export function getAnalogous(hex: string, angle = 30): [string, string] {
  return [adjustHsl(hex, angle), adjustHsl(hex, -angle)];
}

export function getTriadic(hex: string): [string, string] {
  return [adjustHsl(hex, 120), adjustHsl(hex, 240)];
}

// ─── Tonal Scale ──────────────────────────────────────────────────────────────

export function buildTonalScale(hex: string, isNeutral = false): TonalScale {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);

  // For neutral scale, heavily desaturate
  const neutralS = isNeutral ? Math.min(s * 0.08, 6) : s;

  // Lightness stops for each scale step
  const stops: Record<string, number> = {
    '50': 97,
    '100': 94,
    '200': 87,
    '300': 76,
    '400': 62,
    '500': 50,
    '600': 40,
    '700': 31,
    '800': 22,
    '900': 14,
    '950': 9,
  };

  const scale: Record<string, string> = {};
  for (const [key, lightness] of Object.entries(stops)) {
    scale[key] = hslToHex(h, neutralS, lightness);
  }
  return scale as unknown as TonalScale;
}

// ─── Full Analysis ────────────────────────────────────────────────────────────

export function analyzeColor(hex: string): ColorAnalysis {
  const clean = hex.startsWith('#') ? hex : '#' + hex;
  const { r, g, b } = hexToRgb(clean);
  const { h, s, l } = rgbToHsl(r, g, b);
  const luminance = relativeLuminance(r, g, b);

  const whiteLum = 1;
  const blackLum = 0;
  const contrastOnWhite = contrastRatio(luminance, whiteLum);
  const contrastOnBlack = contrastRatio(luminance, blackLum);

  return {
    hex: clean,
    r, g, b, h, s, l,
    luminance,
    isVivid: s > 55 && l > 25 && l < 75,
    isMuted: s < 35,
    isDark: l < 35,
    isLight: l > 65,
    isWarm: (h >= 0 && h < 60) || (h >= 300 && h <= 360),
    isCool: h >= 170 && h < 270,
    isNeutral: s < 12,
    contrastOnWhite,
    contrastOnBlack,
  };
}

// ─── WCAG helper ─────────────────────────────────────────────────────────────

export function wcagAA(ratio: number): boolean { return ratio >= 4.5; }
export function wcagAALarge(ratio: number): boolean { return ratio >= 3; }
export function wcagAAA(ratio: number): boolean { return ratio >= 7; }

// ─── Ensure contrast ─────────────────────────────────────────────────────────

/**
 * Nudge a foreground color until it meets target contrast ratio against a bg.
 * Lightens if bg is dark, darkens if bg is light.
 */
export function ensureContrast(
  fg: string,
  bg: string,
  target = 4.5,
  maxSteps = 30
): string {
  let current = fg;
  const { r: bgR, g: bgG, b: bgB } = hexToRgb(bg);
  const bgLum = relativeLuminance(bgR, bgG, bgB);
  const bgIsLight = bgLum > 0.18;

  for (let i = 0; i < maxSteps; i++) {
    const { r, g, b } = hexToRgb(current);
    const ratio = contrastRatio(relativeLuminance(r, g, b), bgLum);
    if (ratio >= target) return current;
    current = adjustHsl(current, 0, 0, bgIsLight ? -4 : 4);
  }
  return current;
}
