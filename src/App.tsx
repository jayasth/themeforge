import { useState, useCallback, useEffect, useRef } from 'react';
import type { ThemeInputs, StyleMode, ColorMode, ThemeResult, RadiusMode, FontPreset } from './lib/types';
import { buildThemeResult } from './lib/engine';
import ColorInput from './components/ColorInput';
import StorePreview from './components/StorePreview';
import DashboardPreview from './components/DashboardPreview';
import ThemeCard from './components/ThemeCard';
import TokenPanel from './components/TokenPanel';
import ExportPanel from './components/ExportPanel';

const PRESETS: { label: string; primary: string; secondary: string; style: StyleMode; font: FontPreset; radius: RadiusMode }[] = [
  { label: 'dark mode', primary: '#1a1a1a', secondary: '#ffffff', style: 'minimal', font: 'tight-inter', radius: 'none' },
  { label: 'gold & black', primary: '#d4af37', secondary: '#0a0a0a', style: 'luxury', font: 'modern-sans', radius: 'sm' },
  { label: 'electric', primary: '#ff00ff', secondary: '#00ffff', style: 'playful', font: 'technical-mono', radius: 'md' },
  { label: 'deep forest', primary: '#004225', secondary: '#f5f5dc', style: 'tech', font: 'elegant-serif', radius: 'sm' },
  { label: 'clean ice', primary: '#f0f4f8', secondary: '#102a43', style: 'wellness', font: 'soft-rounded', radius: 'full' },
];

const RADIUS_OPTIONS: { id: RadiusMode; label: string }[] = [
  { id: 'none', label: 'none' }, { id: 'sm', label: 'small' },
  { id: 'md', label: 'medium' }, { id: 'lg', label: 'large' },
  { id: 'full', label: 'pill' },
];

const FONT_OPTIONS: { id: FontPreset; label: string }[] = [
  { id: 'modern-sans', label: 'modern' },
  { id: 'tight-inter', label: 'inter' },
  { id: 'elegant-serif', label: 'serif' },
  { id: 'technical-mono', label: 'mono' },
  { id: 'soft-rounded', label: 'rounded' },
];

const DEFAULT_INPUTS: ThemeInputs = {
  primary: '#2563eb',
  secondary: '',
  styleMode: 'minimal',
  colorMode: 'light',
  radius: 'md',
  fontPreset: 'modern-sans',
};

export default function App() {
  const [inputs, setInputs] = useState<ThemeInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<ThemeResult>(() => buildThemeResult(DEFAULT_INPUTS));
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [previewType, setPreviewType] = useState<'ecommerce' | 'dashboard'>('ecommerce');
  const [rightTab, setRightTab] = useState<'themes' | 'export' | 'tokens'>('themes');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newResult = buildThemeResult(inputs);
      setResult(newResult);
      if (!selectedThemeId) setSelectedThemeId(newResult.best.id);
    }, 50);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputs]);

  const allThemes = result ? [result.best, ...result.alternatives] : [];
  const selectedTheme = allThemes.find(t => t.id === selectedThemeId) ?? result?.best;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setInputs({
      primary: preset.primary,
      secondary: preset.secondary,
      styleMode: preset.style,
      fontPreset: preset.font,
      radius: preset.radius,
      colorMode: preset.primary.startsWith('#f') ? 'light' : 'dark'
    });
  };

  const randomize = () => {
    const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const fonts: FontPreset[] = ['modern-sans', 'tight-inter', 'elegant-serif', 'technical-mono', 'soft-rounded'];
    const radii: RadiusMode[] = ['none', 'sm', 'md', 'lg', 'full'];
    const styles: StyleMode[] = ['minimal', 'luxury', 'tech', 'wellness', 'playful'];
    
    setInputs({
      primary: randomHex(),
      secondary: Math.random() > 0.5 ? randomHex() : '',
      styleMode: styles[Math.floor(Math.random() * styles.length)],
      fontPreset: fonts[Math.floor(Math.random() * fonts.length)],
      radius: radii[Math.floor(Math.random() * radii.length)],
      colorMode: Math.random() > 0.5 ? 'light' : 'dark'
    });
  };

  if (!result || !selectedTheme) return null;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] text-neutral-400 overflow-hidden font-sans select-none">
      
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a] shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">TF</div>
          <h1 className="text-xs font-bold tracking-tight text-white">themeforge</h1>
        </div>

        <div className="flex bg-neutral-900 p-1 rounded-sm border border-white/5">
          {(['ecommerce', 'dashboard'] as const).map(type => (
            <button
              key={type}
              onClick={() => setPreviewType(type)}
              className={`px-6 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all
                ${previewType === type ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-400'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <button 
          onClick={randomize}
          className="px-5 py-2 btn-primary rounded-sm text-[10px] font-bold uppercase tracking-widest"
        >
          randomize
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        
        <aside className="w-72 border-r border-white/5 flex flex-col bg-[#0a0a0a] overflow-y-auto">
          <div className="p-6 space-y-10">
            
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">presets</h3>
              <div className="grid grid-cols-1 gap-1">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className="h-10 rounded-sm border border-transparent bg-white/2 flex items-center px-3 transition-all hover:bg-white/5 hover:border-white/5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full mr-3" style={{ backgroundColor: p.primary }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{p.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">tuning</h3>
              
              <div className="space-y-4">
                <ColorInput label="main color" value={inputs.primary} onChange={(val) => setInputs(i => ({...i, primary: val}))} />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {(['light', 'dark'] as ColorMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => setInputs(i => ({...i, colorMode: m}))}
                      className={`py-2 rounded-sm text-[10px] font-bold uppercase border transition-all
                        ${inputs.colorMode === m ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold uppercase opacity-40">font family</label>
                <div className="grid grid-cols-1 gap-1">
                  {FONT_OPTIONS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setInputs(i => ({...i, fontPreset: f.id}))}
                      className={`text-left px-3 py-1.5 rounded-sm text-[10px] font-bold border transition-all
                        ${inputs.fontPreset === f.id ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold uppercase opacity-40">border radius</label>
                <div className="grid grid-cols-5 gap-1">
                  {RADIUS_OPTIONS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setInputs(i => ({...i, radius: r.id}))}
                      className={`h-8 rounded-sm border transition-all flex items-center justify-center
                        ${inputs.radius === r.id ? 'bg-neutral-800 border-white/20 text-white' : 'border-white/5 text-neutral-700 hover:text-neutral-500'}`}
                    >
                      <div className={`w-3 h-3 border-t-2 border-l-2 border-current rounded-${r.id === 'full' ? 'full' : r.id === 'none' ? 'none' : r.id}`} />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </aside>

        <main className="flex-1 bg-[#050505] canvas-bg relative overflow-y-auto p-12 flex items-start justify-center">
          <div className="w-full max-w-5xl shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-sm overflow-hidden border border-white/5 relative bg-black">
            <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/80 border border-white/5 text-[9px] font-bold text-white/50 uppercase tracking-widest">
              {selectedTheme.label}
            </div>
            
            {previewType === 'ecommerce' ? (
              <StorePreview theme={selectedTheme} />
            ) : (
              <DashboardPreview theme={selectedTheme} />
            )}
          </div>

          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-10 px-8 py-2.5 bg-black border border-white/5 rounded-sm text-[9px] font-bold uppercase tracking-widest text-neutral-500 z-50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedTheme.tokens.brand }} />
              <span>{selectedTheme.tokens.brand}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-30">contrast</span>
              <span className={result.analysis.contrastOnWhite >= 4.5 ? 'text-green-500' : 'text-red-500'}>
                {result.analysis.contrastOnWhite.toFixed(2)}:1
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="opacity-30">theme</span>
              <span>{selectedTheme.label}</span>
            </div>
          </div>
        </main>

        <aside className="w-80 border-l border-white/5 flex flex-col bg-[#0a0a0a]">
          <div className="flex border-b border-white/5">
            {(['themes', 'export', 'tokens'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-all
                  ${rightTab === tab ? 'text-white border-b border-white' : 'text-neutral-500 hover:text-neutral-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {rightTab === 'themes' && (
              <div className="space-y-2">
                {allThemes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThemeId(t.id)}
                    className={`w-full p-4 rounded-sm border text-left transition-all group
                      ${selectedThemeId === t.id 
                        ? 'bg-white/5 border-white/20' 
                        : 'bg-transparent border-transparent hover:bg-white/5'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedThemeId === t.id ? 'text-white' : 'text-neutral-500'}`}>
                        {t.label}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-700">{(t.scores.total * 10).toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-neutral-600">
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
            {rightTab === 'tokens' && <TokenPanel theme={selectedTheme} />}
            {rightTab === 'export' && <ExportPanel theme={selectedTheme} />}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/40">
            <div className="h-0.5 w-full bg-neutral-900 rounded-full overflow-hidden">
              <div className="h-full bg-white/20" style={{ width: `${selectedTheme.scores.total * 10}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between opacity-20">
              <span className="text-[10px] font-bold">themeforge</span>
              <span className="text-[9px] font-mono">1.0.0</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
