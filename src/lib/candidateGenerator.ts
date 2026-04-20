import type { ColorAnalysis, SemanticTokens, TonalScale, GeneratedTheme, ColorMode, StyleMode, RadiusMode, FontPreset, ThemeConfig } from './types';
import {
  adjustHsl, hslToHex, buildTonalScale, getContrastRatio,
  getReadableTextColor, ensureContrast,
} from './colorAnalysis';

function pickSemantic(
  analysis: ColorAnalysis,
  _brandScale: TonalScale,
  _neutralScale: TonalScale,
  mode: ColorMode,
  variant: 'safe-conversion' | 'brand-expressive' | 'premium-minimal' | 'bold-contrast' | 'soft-neutral',
  secondaryAnalysis?: ColorAnalysis
): SemanticTokens {
  const { h, s } = analysis;
  const isDark = mode === 'dark';

  const brand = analysis.hex;
  const brandHover = adjustHsl(brand, 0, 0, isDark ? 8 : -8);
  const brandActive = adjustHsl(brand, 0, 0, isDark ? 16 : -16);

  let brandSecondary: string;
  if (secondaryAnalysis) {
    brandSecondary = secondaryAnalysis.hex;
  } else {
    brandSecondary = variant === 'brand-expressive'
      ? adjustHsl(brand, 30, -5, 5)
      : adjustHsl(brand, 0, -20, isDark ? 15 : -15);
  }

  let accent: string;
  if (variant === 'premium-minimal') {
    accent = hslToHex(42, Math.min(s * 0.5 + 20, 55), isDark ? 55 : 45);
  } else if (variant === 'bold-contrast') {
    accent = adjustHsl(brand, 165, Math.min(s * 0.3 + 30, 70), isDark ? 10 : -5);
  } else if (variant === 'soft-neutral') {
    accent = adjustHsl(brand, 20, Math.max(s - 30, 10), isDark ? 60 : 45);
  } else {
    accent = hslToHex(h, Math.min(s + 15, 85), isDark ? 55 : 42);
  }
  const accentHover = adjustHsl(accent, 0, 0, isDark ? 8 : -8);

  let background: string;
  let backgroundElevated: string;
  let surface: string;
  let surface2: string;

  if (isDark) {
    switch (variant) {
      case 'premium-minimal':
        background = hslToHex(h, Math.min(s * 0.05, 4), 7);
        backgroundElevated = hslToHex(h, Math.min(s * 0.06, 5), 11);
        surface = hslToHex(h, Math.min(s * 0.07, 6), 15);
        surface2 = hslToHex(h, Math.min(s * 0.08, 7), 20);
        break;
      case 'bold-contrast':
        background = hslToHex(h, Math.min(s * 0.12, 10), 6);
        backgroundElevated = hslToHex(h, Math.min(s * 0.14, 12), 10);
        surface = hslToHex(h, Math.min(s * 0.15, 13), 14);
        surface2 = hslToHex(h, Math.min(s * 0.16, 14), 20);
        break;
      case 'soft-neutral':
        background = hslToHex(h, Math.min(s * 0.07, 5), 9);
        backgroundElevated = hslToHex(h, Math.min(s * 0.08, 6), 13);
        surface = hslToHex(h, Math.min(s * 0.09, 7), 17);
        surface2 = hslToHex(h, Math.min(s * 0.1, 8), 22);
        break;
      default:
        background = hslToHex(h, Math.min(s * 0.08, 7), 8);
        backgroundElevated = hslToHex(h, Math.min(s * 0.09, 8), 12);
        surface = hslToHex(h, Math.min(s * 0.1, 9), 16);
        surface2 = hslToHex(h, Math.min(s * 0.11, 10), 22);
    }
  } else {
    switch (variant) {
      case 'premium-minimal':
        background = hslToHex(h, Math.min(s * 0.04, 3), 98);
        backgroundElevated = '#ffffff';
        surface = hslToHex(h, Math.min(s * 0.05, 4), 96);
        surface2 = hslToHex(h, Math.min(s * 0.07, 5), 92);
        break;
      case 'bold-contrast':
        background = hslToHex(h, Math.min(s * 0.06, 5), 97);
        backgroundElevated = '#ffffff';
        surface = hslToHex(h, Math.min(s * 0.08, 6), 94);
        surface2 = hslToHex(h, Math.min(s * 0.10, 8), 89);
        break;
      case 'soft-neutral':
        background = hslToHex(h, Math.min(s * 0.05, 4), 97.5);
        backgroundElevated = '#ffffff';
        surface = hslToHex(h, Math.min(s * 0.06, 5), 95);
        surface2 = hslToHex(h, Math.min(s * 0.08, 6), 91);
        break;
      default:
        background = hslToHex(h, Math.min(s * 0.05, 4), 97);
        backgroundElevated = '#ffffff';
        surface = hslToHex(h, Math.min(s * 0.07, 5), 94);
        surface2 = hslToHex(h, Math.min(s * 0.09, 7), 90);
    }
  }

  const border = isDark
    ? hslToHex(h, Math.min(s * 0.1, 8), 25)
    : hslToHex(h, Math.min(s * 0.06, 5), 87);
  const borderStrong = isDark
    ? hslToHex(h, Math.min(s * 0.12, 10), 38)
    : hslToHex(h, Math.min(s * 0.08, 7), 72);

  const text = isDark
    ? hslToHex(h, Math.min(s * 0.05, 4), 93)
    : hslToHex(h, Math.min(s * 0.06, 5), 10);
  const textMuted = isDark
    ? hslToHex(h, Math.min(s * 0.06, 5), 60)
    : hslToHex(h, Math.min(s * 0.05, 4), 42);
  const textInverse = isDark ? '#0a0a0a' : '#f8f8f8';

  let cta: string;
  let ctaHover: string;

  if (variant === 'safe-conversion') {
    const ratio = getContrastRatio(brand, surface);
    if (ratio >= 3.5) {
      cta = brand;
    } else {
      cta = ensureContrast(brand, surface, 3.5);
    }
    ctaHover = adjustHsl(cta, 0, 0, isDark ? 8 : -8);
  } else if (variant === 'brand-expressive') {
    cta = hslToHex(h, Math.min(s + 10, 90), isDark ? 58 : 44);
    ctaHover = adjustHsl(cta, 0, 0, isDark ? 8 : -8);
  } else if (variant === 'premium-minimal') {
    cta = isDark
      ? hslToHex(h, Math.min(s * 0.3, 20), 88)
      : hslToHex(h, Math.min(s * 0.3, 20), 12);
    ctaHover = adjustHsl(cta, 0, 0, isDark ? -6 : 6);
  } else if (variant === 'bold-contrast') {
    cta = hslToHex(h, Math.min(s + 20, 95), isDark ? 60 : 40);
    ctaHover = adjustHsl(cta, 0, 5, isDark ? 8 : -8);
  } else {
    cta = hslToHex(h, Math.min(s + 5, 75), isDark ? 56 : 42);
    ctaHover = adjustHsl(cta, 0, 0, isDark ? 6 : -6);
  }

  const ctaText = getReadableTextColor(cta);

  const success = isDark ? '#34d399' : '#059669';
  const warning = isDark ? '#fbbf24' : '#d97706';
  const error = isDark ? '#f87171' : '#dc2626';

  const brandIsRed = h < 20 || h > 340;
  const saleBadge = brandIsRed
    ? (isDark ? '#fb923c' : '#ea580c')
    : (isDark ? '#f87171' : '#dc2626');

  const footerBackground = isDark
    ? hslToHex(h, Math.min(s * 0.08, 6), 4)
    : (variant === 'premium-minimal'
        ? hslToHex(h, Math.min(s * 0.08, 6), 11)
        : hslToHex(h, Math.min(s * 0.12, 10), 15));
  const footerText = isDark
    ? hslToHex(h, Math.min(s * 0.05, 4), 78)
    : hslToHex(h, Math.min(s * 0.04, 3), 82);

  return {
    brand,
    'brand-hover': brandHover,
    'brand-active': brandActive,
    'brand-secondary': brandSecondary,
    accent,
    'accent-hover': accentHover,
    background,
    'background-elevated': backgroundElevated,
    surface,
    'surface-2': surface2,
    border,
    'border-strong': borderStrong,
    text,
    'text-muted': textMuted,
    'text-inverse': textInverse,
    cta,
    'cta-hover': ctaHover,
    'cta-text': ctaText,
    success,
    warning,
    error,
    'sale-badge': saleBadge,
    'footer-background': footerBackground,
    'footer-text': footerText,
  };
}

export function generateCandidates(
  analysis: ColorAnalysis,
  mode: ColorMode,
  _styleMode?: StyleMode,
  secondaryAnalysis?: ColorAnalysis,
  radius: RadiusMode = 'md',
  fontPreset: FontPreset = 'modern-sans'
): GeneratedTheme[] {
  const brandScale = buildTonalScale(analysis.hex);
  const neutralScale = buildTonalScale(analysis.hex, true);

  const radiusMap: Record<RadiusMode, string> = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  };

  const fontMap: Record<FontPreset, { family: string; heading: string }> = {
    'modern-sans': { family: 'system-ui, sans-serif', heading: 'system-ui, sans-serif' },
    'elegant-serif': { family: 'Georgia, serif', heading: 'Georgia, serif' },
    'tight-inter': { family: '"Inter", sans-serif', heading: '"Inter", sans-serif' },
    'technical-mono': { family: 'ui-monospace, monospace', heading: 'system-ui, sans-serif' },
    'soft-rounded': { family: 'ui-rounded, system-ui, sans-serif', heading: 'ui-rounded, system-ui, sans-serif' },
  };

  const config: ThemeConfig = {
    radius: radiusMap[radius],
    fontFamily: fontMap[fontPreset].family,
    headingFont: fontMap[fontPreset].heading,
    baseSize: '16px',
  };

  const directions: Array<{
    id: string;
    label: string;
    description: string;
    direction: GeneratedTheme['direction'];
  }> = [
    {
      id: 'stella-artois',
      label: 'stella artois',
      description: 'Classic build focused on functionality.',
      direction: 'safe-conversion',
    },
    {
      id: 'rotana',
      label: 'rotana',
      description: 'High visibility and presence.',
      direction: 'brand-expressive',
    },
    {
      id: 'pandora',
      label: 'pandora',
      description: 'Restrained surfaces with gold accents.',
      direction: 'premium-minimal',
    },
    {
      id: 'maverick',
      label: 'the maverick',
      description: 'Aggressive contrast and sharp energy.',
      direction: 'bold-contrast',
    },
    {
      id: 'soft-soul',
      label: 'soft soul',
      description: 'Neutral tones for a collected feel.',
      direction: 'soft-neutral',
    },
  ];

  return directions.map(dir => ({
    id: dir.id,
    label: dir.label,
    description: dir.description,
    direction: dir.direction,
    tokens: pickSemantic(analysis, brandScale, neutralScale, mode, dir.direction, secondaryAnalysis),
    brandScale,
    neutralScale,
    scores: { textReadability: 0, wcagCompliance: 0, ctaProminence: 0, visualHierarchy: 0, surfaceSeparation: 0, ecommerceSuitability: 0, restraint: 0, consistency: 0, total: 0 },
    colorMode: mode,
    config,
  }));
}
