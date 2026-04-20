import type { GeneratedTheme } from '../lib/types';

interface TokenPanelProps {
  theme: GeneratedTheme;
}

export default function TokenPanel({ theme }: TokenPanelProps) {
  const t = theme.tokens;
  const cfg = theme.config;

  const categories = [
    {
      title: 'brand',
      tokens: [
        { label: 'main', value: t.brand },
        { label: 'hover', value: t['brand-hover'] },
        { label: 'active', value: t['brand-active'] },
        { label: 'sec', value: t['brand-secondary'] },
      ]
    },
    {
      title: 'surfaces',
      tokens: [
        { label: 'bg', value: t.background },
        { label: 'elev', value: t['background-elevated'] },
        { label: 'surf', value: t.surface },
        { label: 'surf2', value: t['surface-2'] },
      ]
    },
    {
      title: 'interactive',
      tokens: [
        { label: 'cta', value: t.cta },
        { label: 'text', value: t['cta-text'] },
        { label: 'hover', value: t['accent-hover'] },
      ]
    },
    {
      title: 'status',
      tokens: [
        { label: 'ok', value: t.success },
        { label: 'warn', value: t.warning },
        { label: 'err', value: t.error },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {categories.map(cat => (
        <div key={cat.title} className="space-y-3">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">{cat.title}</h4>
          <div className="grid grid-cols-2 gap-2">
            {cat.tokens.map(token => (
              <div key={token.label} className="p-2 rounded-sm bg-white/2 border border-white/5 flex items-center gap-3">
                <div className="w-4 h-4 rounded-sm shadow-inner border border-white/10" style={{ backgroundColor: token.value }} />
                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase opacity-40 leading-none mb-1">{token.label}</p>
                  <p className="text-[10px] font-mono text-neutral-500 truncate">{token.value.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-3 pt-2">
        <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">config</h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="p-3 rounded-sm bg-white/2 border border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">radius</span>
            <span className="text-[10px] font-mono text-white opacity-60">{cfg.radius}</span>
          </div>
          <div className="p-3 rounded-sm bg-white/2 border border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">font</span>
            <span className="text-[10px] font-mono text-white opacity-60 truncate ml-4">{cfg.fontFamily.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
