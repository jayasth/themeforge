import type { GeneratedTheme } from '../lib/types';

interface DashboardPreviewProps {
  theme: GeneratedTheme;
  compact?: boolean;
}

export default function DashboardPreview({ theme, compact = false }: DashboardPreviewProps) {
  const t = theme.tokens;
  const cfg = theme.config;

  const stats = [
    { label: 'Active Users', value: '12.4k', change: '+12%', trend: 'up' },
    { label: 'Revenue', value: '$45,200', change: '+8.4%', trend: 'up' },
    { label: 'Avg. Session', value: '4m 32s', change: '-2%', trend: 'down' },
  ];

  const recentActivity = [
    { user: 'Alex Rivera', action: 'upgraded to Pro', time: '2m ago', color: t.success },
    { user: 'Sarah Chen', action: 'created new project', time: '15m ago', color: t.brand },
    { user: 'Mike Ross', action: 'requested payout', time: '1h ago', color: t.warning },
  ];

  return (
    <div
      className="rounded-sm overflow-hidden border shadow-2xl text-[13px] flex h-[600px]"
      style={{
        fontFamily: cfg.fontFamily,
        backgroundColor: t.background,
        borderColor: t.border,
      }}
    >
      {!compact && (
        <aside
          className="w-52 border-r flex flex-col"
          style={{ backgroundColor: t['background-elevated'], borderColor: t.border }}
        >
          <div className="p-6 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center font-bold" style={{ backgroundColor: t.brand, color: t['text-inverse'], borderRadius: cfg.radius }}>
              F
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: t.text }}>ForgeCloud</span>
          </div>

          <nav className="px-3 space-y-1 flex-1">
            {['Dashboard', 'Analytics', 'Team', 'Settings'].map((item, i) => (
              <div
                key={item}
                className="px-3 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                style={{
                  backgroundColor: i === 0 ? t.surface : 'transparent',
                  color: i === 0 ? t.brand : t['text-muted'],
                }}
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t" style={{ borderColor: t.border }}>
            <div className="p-3 rounded-sm flex items-center gap-3" style={{ backgroundColor: t.surface, borderRadius: cfg.radius }}>
              <div className="w-7 h-7 rounded-full" style={{ backgroundColor: t['surface-2'] }} />
              <div className="min-w-0">
                <p className="font-bold truncate text-[11px]" style={{ color: t.text }}>Jay S.</p>
                <p className="text-[9px] opacity-50 truncate" style={{ color: t['text-muted'] }}>Admin</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6" style={{ borderColor: t.border, backgroundColor: t['background-elevated'] }}>
          <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: t.text, fontFamily: cfg.headingFont }}>Dashboard</h2>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
              style={{ backgroundColor: t.cta, color: t['cta-text'], borderRadius: cfg.radius }}
            >
              Invite
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="p-4 border shadow-sm"
                style={{ backgroundColor: t.surface, borderColor: t.border, borderRadius: cfg.radius }}
              >
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-50" style={{ color: t['text-muted'] }}>{stat.label}</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold" style={{ color: t.text }}>{stat.value}</h3>
                  <span className="text-[10px] font-bold" style={{ color: stat.trend === 'up' ? t.success : t.error }}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3 border p-5" style={{ backgroundColor: t.surface, borderColor: t.border, borderRadius: cfg.radius }}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: t.text }}>Performance</h4>
              <div className="space-y-4">
                {[80, 45, 92, 63].map((val, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase opacity-50" style={{ color: t['text-muted'] }}>
                      <span>Node 0{i+1}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-1 w-full bg-black/10 rounded-full overflow-hidden" style={{ backgroundColor: t['surface-2'] }}>
                      <div className="h-full" style={{ width: `${val}%`, backgroundColor: i === 2 ? t.error : t.brand }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 border p-5" style={{ backgroundColor: t.surface, borderColor: t.border, borderRadius: cfg.radius }}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: t.text }}>Recent</h4>
              <div className="space-y-4">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: act.color }} />
                    <div className="min-w-0">
                      <p className="font-bold text-[11px] truncate" style={{ color: t.text }}>{act.user}</p>
                      <p className="text-[10px] opacity-50" style={{ color: t['text-muted'] }}>{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-12 border border-dashed flex flex-col items-center justify-center text-center gap-2" style={{ borderColor: t.border, borderRadius: cfg.radius }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: t.text }}>Ready to deploy?</p>
            <button
              className="mt-2 px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-transform active:scale-95 shadow-xl"
              style={{ backgroundColor: t.brand, color: t['text-inverse'], borderRadius: cfg.radius }}
            >
              Production Build
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
