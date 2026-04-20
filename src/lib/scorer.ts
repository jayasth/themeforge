import type { GeneratedTheme, ThemeScores, StyleMode } from './types';
import { getContrastRatio, hexToRgb, rgbToHsl } from './colorAnalysis';

interface ScoringWeights {
  textReadability: number;
  wcagCompliance: number;
  ctaProminence: number;
  visualHierarchy: number;
  surfaceSeparation: number;
  ecommerceSuitability: number;
  restraint: number;
  consistency: number;
}

function getWeights(styleMode?: StyleMode): ScoringWeights {
  const base: ScoringWeights = {
    textReadability: 2.0,
    wcagCompliance: 2.2,
    ctaProminence: 1.8,
    visualHierarchy: 1.5,
    surfaceSeparation: 1.4,
    ecommerceSuitability: 1.6,
    restraint: 1.0,
    consistency: 1.2,
  };

  switch (styleMode) {
    case 'minimal':
      return { ...base, restraint: 2.0, visualHierarchy: 1.8, surfaceSeparation: 1.8, ecommerceSuitability: 1.4 };
    case 'luxury':
      return { ...base, restraint: 2.2, consistency: 1.8, ctaProminence: 1.4, surfaceSeparation: 1.6 };
    case 'tech':
      return { ...base, wcagCompliance: 2.4, ctaProminence: 2.0, visualHierarchy: 1.8, restraint: 0.9 };
    case 'wellness':
      return { ...base, restraint: 1.8, textReadability: 2.2, surfaceSeparation: 1.2, ecommerceSuitability: 1.4 };
    case 'playful':
      return { ...base, ctaProminence: 2.2, ecommerceSuitability: 1.8, restraint: 0.7 };
    default:
      return base;
  }
}

function scoreTextReadability(theme: GeneratedTheme): number {
  const { tokens } = theme;
  const pairs = [
    [tokens.text, tokens.background],
    [tokens.text, tokens.surface],
    [tokens['text-muted'], tokens.background],
    [tokens['text-muted'], tokens.surface],
    [tokens['footer-text'], tokens['footer-background']],
  ];
  const ratios = pairs.map(([fg, bg]) => getContrastRatio(fg, bg));
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  return Math.min(10, Math.max(0, (avg - 2) / 7 * 10));
}

function scoreWcagCompliance(theme: GeneratedTheme): number {
  const { tokens } = theme;
  const criticalPairs = [
    [tokens.text, tokens.background],
    [tokens.text, tokens.surface],
    [tokens['cta-text'], tokens.cta],
    [tokens['text-inverse'], tokens['footer-background']],
  ];
  const largePairs = [
    [tokens['text-muted'], tokens.background],
    [tokens['text-muted'], tokens.surface],
  ];

  let passes = 0;
  let total = criticalPairs.length + largePairs.length;

  criticalPairs.forEach(([fg, bg]) => {
    if (getContrastRatio(fg, bg) >= 4.5) passes++;
  });
  largePairs.forEach(([fg, bg]) => {
    if (getContrastRatio(fg, bg) >= 3.0) passes++;
  });

  return (passes / total) * 10;
}

function scoreCtaProminence(theme: GeneratedTheme): number {
  const { tokens } = theme;
  const ctaVsSurface = getContrastRatio(tokens.cta, tokens.surface);
  const ctaVsBg = getContrastRatio(tokens.cta, tokens.background);
  const ctaTextVsCta = getContrastRatio(tokens['cta-text'], tokens.cta);

  const textScore = Math.min(10, (ctaTextVsCta / 4.5) * 10);
  const bgScore = Math.min(10, ((Math.max(ctaVsSurface, ctaVsBg) - 1.5) / 4) * 10);

  return (textScore * 0.5 + bgScore * 0.5);
}

function scoreVisualHierarchy(theme: GeneratedTheme): number {
  const { tokens } = theme;
  const textVsSurface = getContrastRatio(tokens.text, tokens.surface);
  const surfaceVsBg = getContrastRatio(tokens.surface, tokens.background);
  const borderVsBg = getContrastRatio(tokens.border, tokens.background);

  const score = (
    Math.min(10, (textVsSurface - 1) / 8 * 10) * 0.5 +
    Math.min(10, Math.max(0, (surfaceVsBg - 1) / 1.5 * 10)) * 0.25 +
    Math.min(10, Math.max(0, (borderVsBg - 1) / 1.5 * 10)) * 0.25
  );
  return Math.min(10, score);
}

function scoreSurfaceSeparation(theme: GeneratedTheme): number {
  const { tokens } = theme;
  const pairs = [
    getContrastRatio(tokens.background, tokens.surface),
    getContrastRatio(tokens.surface, tokens['surface-2']),
    getContrastRatio(tokens['surface-2'], tokens.border),
  ];
  const scores: number[] = pairs.map(r => {
    if (r < 1.02) return 0;
    if (r < 1.04) return 3;
    if (r < 1.08) return 7;
    if (r < 1.5) return 10;
    if (r < 2.5) return 8;
    return 5;
  });
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function scoreEcommerceSuitability(theme: GeneratedTheme): number {
  const { tokens } = theme;
  let score = 8;

  const { r: bgR, g: bgG, b: bgB } = hexToRgb(tokens.background);
  const { s: bgS } = rgbToHsl(bgR, bgG, bgB);
  if (bgS > 20) score -= 3;
  else if (bgS < 8) score += 1;

  const badgeVsBrand = getContrastRatio(tokens['sale-badge'], tokens.brand);
  if (badgeVsBrand > 2) score += 1;
  else score -= 1;

  const { r: sR, g: sG, b: sB } = hexToRgb(tokens.surface);
  const { s: sS } = rgbToHsl(sR, sG, sB);
  if (sS < 10) score += 0.5;

  return Math.min(10, Math.max(0, score));
}

function scoreRestraint(theme: GeneratedTheme): number {
  const { tokens } = theme;
  const hues = [
    tokens.brand, tokens.accent, tokens['brand-secondary'],
    tokens.cta, tokens.success, tokens.warning, tokens.error,
  ].map(hex => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b).h;
  });

  let distinctFamilies = 1;
  const sorted = [...hues].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.abs(sorted[i] - sorted[i - 1]);
    const wrapped = Math.min(diff, 360 - diff);
    if (wrapped > 30) distinctFamilies++;
  }

  const restraintScore = Math.max(0, 10 - (distinctFamilies - 2) * 2);
  return restraintScore;
}

function scoreConsistency(theme: GeneratedTheme): number {
  const { tokens } = theme;
  const { r: bR, g: bG, b: bB } = hexToRgb(tokens.brand);
  const { h: brandH } = rgbToHsl(bR, bG, bB);

  const related = [tokens.cta, tokens['brand-hover'], tokens['brand-secondary']].map(hex => {
    const { r, g, b } = hexToRgb(hex);
    const { h } = rgbToHsl(r, g, b);
    const diff = Math.abs(h - brandH);
    return Math.min(diff, 360 - diff);
  });

  const avgDiff = related.reduce((a, b) => a + b, 0) / related.length;
  return Math.max(0, 10 - avgDiff / 18);
}

export function scoreTheme(theme: GeneratedTheme, styleMode?: StyleMode): ThemeScores {
  const weights = getWeights(styleMode);

  const raw = {
    textReadability: scoreTextReadability(theme),
    wcagCompliance: scoreWcagCompliance(theme),
    ctaProminence: scoreCtaProminence(theme),
    visualHierarchy: scoreVisualHierarchy(theme),
    surfaceSeparation: scoreSurfaceSeparation(theme),
    ecommerceSuitability: scoreEcommerceSuitability(theme),
    restraint: scoreRestraint(theme),
    consistency: scoreConsistency(theme),
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const weighted =
    raw.textReadability * weights.textReadability +
    raw.wcagCompliance * weights.wcagCompliance +
    raw.ctaProminence * weights.ctaProminence +
    raw.visualHierarchy * weights.visualHierarchy +
    raw.surfaceSeparation * weights.surfaceSeparation +
    raw.ecommerceSuitability * weights.ecommerceSuitability +
    raw.restraint * weights.restraint +
    raw.consistency * weights.consistency;

  return {
    ...raw,
    total: Math.round((weighted / totalWeight) * 10) / 10,
  };
}

export function scoreAndRank(
  themes: GeneratedTheme[],
  styleMode?: StyleMode
): GeneratedTheme[] {
  const scored = themes.map(t => ({
    ...t,
    scores: scoreTheme(t, styleMode),
  }));
  return scored.sort((a, b) => b.scores.total - a.scores.total);
}
