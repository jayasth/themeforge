import type { GeneratedTheme } from '../lib/types';
import { getContrastRatio } from '../lib/colorAnalysis';

interface StorePreviewProps {
  theme: GeneratedTheme;
  compact?: boolean;
}

export default function StorePreview({ theme, compact = false }: StorePreviewProps) {
  const t = theme.tokens;
  const cfg = theme.config;

  const textBgContrast = getContrastRatio(t.text, t.background).toFixed(1);
  const ctaTextContrast = getContrastRatio(t['cta-text'], t.cta).toFixed(1);

  const products = [
    { name: 'Ceramic Mug', price: '$28.00', compare: '$42.00', sale: true, img: '☕' },
    { name: 'Linen Tote', price: '$54.00', compare: null, sale: false, img: '👜' },
    { name: 'Glass Jar Set', price: '$36.00', compare: '$52.00', sale: true, img: '🫙' },
    { name: 'Oak Tray', price: '$68.00', compare: null, sale: false, img: '🪵' },
  ];

  return (
    <div className="rounded-sm overflow-hidden border border-white/5 shadow-2xl text-[13px] select-none" style={{ fontFamily: cfg.fontFamily, backgroundColor: t.background }}>
      <div
        className="text-center py-2 px-4 text-[10px] font-bold uppercase tracking-widest"
        style={{ backgroundColor: t.brand, color: t['text-inverse'] }}
      >
        Free shipping over $75 | Code: WELCOME10
      </div>

      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ backgroundColor: t['background-elevated'], borderColor: t.border }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: t.brand, color: t['text-inverse'], borderRadius: cfg.radius }}
          >
            S
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: t.text, fontFamily: cfg.headingFont }}>
            Studio <span style={{ color: t.brand }}>Co.</span>
          </span>
        </div>

        {!compact && (
          <nav className="hidden md:flex items-center gap-6">
            {['Shop', 'Collections', 'About'].map(item => (
              <a key={item} className="text-[11px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity cursor-pointer" style={{ color: t['text-muted'] }}>
                {item}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <button className="text-xs px-3 py-1.5 font-medium border" style={{ borderColor: t.border, color: t.text, backgroundColor: t.surface, borderRadius: cfg.radius }}>
            Account
          </button>
          <button className="text-xs px-3 py-1.5 font-bold flex items-center gap-1" style={{ backgroundColor: t.brand, color: t['text-inverse'], borderRadius: cfg.radius }}>
            <span>Cart</span>
            <span className="text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ backgroundColor: t.cta, color: t['cta-text'] }}>2</span>
          </button>
        </div>
      </header>

      <main style={{ backgroundColor: t.background }}>
        <div className="px-6 py-12 border-b" style={{ backgroundColor: t.surface, borderColor: t.border }}>
          <div className="max-w-lg">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: t.brand }}>New Collection</p>
            <h1 className="text-3xl font-bold leading-tight mb-4" style={{ color: t.text, fontFamily: cfg.headingFont }}>Everyday Objects,<br />Beautifully Made</h1>
            <p className="text-sm leading-relaxed mb-6 opacity-70" style={{ color: t['text-muted'] }}>Curated goods for the considered home. Designed for longevity and quiet beauty.</p>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90" style={{ backgroundColor: t.cta, color: t['cta-text'], borderRadius: cfg.radius }}>Shop All</button>
              <button className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition-all hover:bg-white/5" style={{ borderColor: t['border-strong'], color: t.text, borderRadius: cfg.radius }}>Our Story</button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: t.text, fontFamily: cfg.headingFont }}>Featured Products</h2>
          </div>

          <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {products.map((p, i) => (
              <div key={i} className="border transition-all hover:shadow-xl" style={{ backgroundColor: t['background-elevated'], borderColor: t.border, borderRadius: cfg.radius }}>
                <div className="aspect-square flex items-center justify-center text-4xl relative" style={{ backgroundColor: t['surface-2'] }}>
                  <span>{p.img}</span>
                  {p.sale && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5" style={{ backgroundColor: t['sale-badge'], color: '#ffffff' }}>SALE</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-bold mb-1" style={{ color: t.text }}>{p.name}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-bold" style={{ color: t.text }}>{p.price}</span>
                    {p.compare && <span className="text-[10px] line-through opacity-40" style={{ color: t['text-muted'] }}>{p.compare}</span>}
                  </div>
                  <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest transition-all" style={{ backgroundColor: t.cta, color: t['cta-text'], borderRadius: cfg.radius }}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!compact && (
          <div className="mx-6 mb-6 p-8 border" style={{ backgroundColor: t.surface, borderColor: t.border, borderRadius: cfg.radius }}>
            <div className="max-w-md">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: t.brand }}>Newsletter</p>
              <h3 className="text-xl font-bold mb-2" style={{ color: t.text, fontFamily: cfg.headingFont }}>Early access & member pricing</h3>
              <p className="text-xs mb-6 opacity-60" style={{ color: t['text-muted'] }}>Join 12,000+ members. No spam, ever.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="flex-1 text-xs px-4 py-2.5 border outline-none bg-transparent" style={{ borderColor: t.border, color: t.text, borderRadius: cfg.radius }} />
                <button className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: t.cta, color: t['cta-text'], borderRadius: cfg.radius }}>Subscribe</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="px-6 py-8 border-t" style={{ backgroundColor: t['footer-background'], borderColor: t.border }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="font-bold text-sm mb-2" style={{ color: t['footer-text'] }}>Studio Co.</div>
            <p className="text-[11px] leading-relaxed max-w-[200px] opacity-50" style={{ color: t['footer-text'] }}>Handcrafted goods for everyday living.</p>
          </div>
          <div className="text-[10px] opacity-30 uppercase tracking-widest" style={{ color: t['footer-text'] }}>© 2025 Studio Co.</div>
        </div>
      </footer>
    </div>
  );
}
