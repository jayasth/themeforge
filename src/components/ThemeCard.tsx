import type { GeneratedTheme } from '../lib/types';

interface ThemeCardProps {
  theme: GeneratedTheme;
  isSelected: boolean;
  isBest?: boolean;
  onSelect: () => void;
}

const SCORE_LABELS: Record<string, string> = {
  textReadability: 'Readability',
  wcagCompliance: 'WCAG',
  ctaProminence: 'CTA',
  visualHierarchy: 'Hierarchy',
  surfaceSeparation: 'Surfaces',
  ecommerceSuitability: 'Ecommerce',
  restraint: 'Restraint',
  consistency: 'Consistency',
};

function ScoreBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 10);
  const color = value >= 8 ? '#4ade80' : value >= 6 ? '#facc15' : '#f87171';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-neutral-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-mono text-neutral-400 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

function SwatchRow({ tokens }: { tokens: GeneratedTheme['tokens'] }) {
  const swatches = [
    { key: 'brand', label: 'Brand' },
    { key: 'accent', label: 'Accent' },
    { key: 'cta', label: 'CTA' },
    { key: 'background', label: 'BG' },
    { key: 'surface', label: 'Surface' },
    { key: 'text', label: 'Text' },
    { key: 'success', label: 'Success' },
    { key: 'error', label: 'Error' },
  ] as const;

  return (
    <div className="flex gap-1.5 flex-wrap">
      {swatches.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center gap-0.5">
          <div
            className="w-6 h-6 rounded border border-white/10 shadow-sm"
            style={{ backgroundColor: tokens[key] }}
            title={`${label}: ${tokens[key]}`}
          />
          <span className="text-[8px] text-neutral-600">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ThemeCard({ theme, isSelected, isBest, onSelect }: ThemeCardProps) {
  const { scores } = theme;

  const directionColors: Record<string, string> = {
    'safe-conversion': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'brand-expressive': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    'premium-minimal': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'bold-contrast': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    'soft-neutral': 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  };

  const badgeClass = directionColors[theme.direction] ?? 'text-neutral-400 bg-neutral-700 border-neutral-600';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border-2 transition-all duration-200 overflow-hidden
        ${isSelected
          ? 'border-white/40 shadow-lg shadow-white/5'
          : 'border-white/5 hover:border-white/20'
        }`}
    >
      {/* Card header */}
      <div className="bg-neutral-900 px-4 pt-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-sm text-white">{theme.label}</h3>
              {isBest && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                  BEST MATCH
                </span>
              )}
            </div>
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeClass}`}>
              {theme.direction.replace(/-/g, ' ').toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-bold tabular-nums leading-none"
              style={{
                color: scores.total >= 8 ? '#4ade80' : scores.total >= 6 ? '#facc15' : '#f87171'
              }}
            >
              {scores.total.toFixed(1)}
            </div>
            <div className="text-[10px] text-neutral-500">/ 10</div>
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">{theme.description}</p>

        {/* Color swatches */}
        <SwatchRow tokens={theme.tokens} />
      </div>

      {/* Score bars */}
      <div className="bg-neutral-950/50 px-4 py-3 border-t border-white/5 space-y-1.5">
        {Object.entries(scores)
          .filter(([k]) => k !== 'total')
          .map(([key, val]) => (
            <ScoreBar key={key} value={val as number} label={SCORE_LABELS[key] ?? key} />
          ))
        }
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="bg-white/5 px-4 py-2 border-t border-white/10 text-center">
          <span className="text-[11px] text-white font-semibold tracking-wide">PREVIEWING ↑</span>
        </div>
      )}
    </button>
  );
}
