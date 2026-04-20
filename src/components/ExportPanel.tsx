import { useState } from 'react';
import type { GeneratedTheme, ExportFormat } from '../lib/types';
import { formatExport } from '../lib/exportFormatter';

interface ExportPanelProps {
  theme: GeneratedTheme;
}

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'css', label: 'CSS Variables' },
  { id: 'tailwind', label: 'Tailwind Config' },
  { id: 'json', label: 'JSON Tokens' },
];

export default function ExportPanel({ theme }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('tailwind');
  const [copied, setCopied] = useState(false);

  const output = formatExport(theme, activeFormat);

  const handleCopy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {FORMATS.map(fmt => (
          <button
            key={fmt.id}
            onClick={() => setActiveFormat(fmt.id)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all
              ${activeFormat === fmt.id ? 'bg-white/10 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      <div className="relative group">
        <pre className="bg-black/40 border border-white/5 rounded-2xl p-4 text-[10px] font-mono text-neutral-400 overflow-auto leading-relaxed max-h-64">
          {output}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all active:scale-95"
        >
          {copied ? '✓ Copied' : 'Copy Code'}
        </button>
      </div>

      <p className="text-[10px] text-neutral-600 px-1 leading-relaxed">
        Ready for production. Includes semantic tokens, tonal scales, and typography primitives for {activeFormat === 'tailwind' ? 'Tailwind v3/v4' : 'modern CSS systems'}.
      </p>
    </div>
  );
}
