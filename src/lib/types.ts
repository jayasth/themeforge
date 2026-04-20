export type StyleMode = 'minimal' | 'luxury' | 'tech' | 'wellness' | 'playful';
export type ColorMode = 'light' | 'dark';
export type RadiusMode = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type FontPreset = 'modern-sans' | 'elegant-serif' | 'tight-inter' | 'technical-mono' | 'soft-rounded';

export interface ThemeInputs {
  primary: string;
  secondary?: string;
  styleMode?: StyleMode;
  colorMode: ColorMode;
  radius: RadiusMode;
  fontPreset: FontPreset;
}

export interface ColorAnalysis {
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  luminance: number; // 0-1 relative luminance
  isVivid: boolean;
  isMuted: boolean;
  isDark: boolean;
  isLight: boolean;
  isWarm: boolean;
  isCool: boolean;
  isNeutral: boolean;
  contrastOnWhite: number;
  contrastOnBlack: number;
}

export interface SemanticTokens {
  brand: string;
  'brand-hover': string;
  'brand-active': string;
  'brand-secondary': string;
  accent: string;
  'accent-hover': string;
  background: string;
  'background-elevated': string;
  surface: string;
  'surface-2': string;
  border: string;
  'border-strong': string;
  text: string;
  'text-muted': string;
  'text-inverse': string;
  cta: string;
  'cta-hover': string;
  'cta-text': string;
  success: string;
  warning: string;
  error: string;
  'sale-badge': string;
  'footer-background': string;
  'footer-text': string;
}

export interface TonalScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ThemeScores {
  textReadability: number;
  wcagCompliance: number;
  ctaProminence: number;
  visualHierarchy: number;
  surfaceSeparation: number;
  ecommerceSuitability: number;
  restraint: number;
  consistency: number;
  total: number;
}

export interface ThemeConfig {
  radius: string;
  fontFamily: string;
  headingFont: string;
  baseSize: string;
}

export interface GeneratedTheme {
  id: string;
  label: string;
  description: string;
  direction: 'safe-conversion' | 'brand-expressive' | 'premium-minimal' | 'bold-contrast' | 'soft-neutral';
  tokens: SemanticTokens;
  brandScale: TonalScale;
  neutralScale: TonalScale;
  scores: ThemeScores;
  colorMode: ColorMode;
  config: ThemeConfig;
}

export interface ThemeResult {
  best: GeneratedTheme;
  alternatives: GeneratedTheme[];
  analysis: ColorAnalysis;
  secondaryAnalysis?: ColorAnalysis;
}

export type ExportFormat = 'css' | 'json' | 'tailwind' | 'shopify';
