import React, { useState } from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  optional?: boolean;
  onClear?: () => void;
}

function isValidHex(str: string): boolean {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str.trim());
}

function normalizeHex(str: string): string {
  const clean = str.trim().replace('#', '');
  if (clean.length === 3) {
    return '#' + clean.split('').map(c => c + c).join('');
  }
  return '#' + clean;
}

export default function ColorInput({ label, value, onChange, optional, onClear }: ColorInputProps) {
  const [text, setText] = useState(value);
  const [error, setError] = useState(false);

  // Keep text in sync when value changes externally (e.g. color picker)
  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setText(hex);
    setError(false);
    onChange(hex);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    if (raw === '' && optional) {
      setError(false);
      return;
    }
    const withHash = raw.startsWith('#') ? raw : '#' + raw;
    if (isValidHex(withHash)) {
      setError(false);
      onChange(normalizeHex(withHash));
    } else {
      setError(true);
    }
  };

  const handleTextBlur = () => {
    if (text === '' && optional) return;
    const withHash = text.startsWith('#') ? text : '#' + text;
    if (isValidHex(withHash)) {
      const norm = normalizeHex(withHash);
      setText(norm);
      setError(false);
      onChange(norm);
    } else {
      setError(true);
    }
  };

  // Keep text input in sync when value changes externally
  React.useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
          {label}
          {optional && <span className="ml-1 text-neutral-500 font-normal normal-case">(optional)</span>}
        </label>
        {optional && onClear && value && (
          <button
            onClick={onClear}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* Color swatch / picker trigger */}
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-lg border-2 border-white/10 shadow-md overflow-hidden cursor-pointer"
            style={{ backgroundColor: value || '#888888' }}
          >
            <input
              type="color"
              value={value || '#888888'}
              onChange={handlePickerChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Pick color"
            />
          </div>
        </div>
        {/* Hex text input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            placeholder={optional ? '#optional' : '#000000'}
            maxLength={7}
            className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-neutral-600 
              focus:outline-none focus:ring-2 transition-all
              ${error
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500/20'
              }`}
          />
          {error && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 text-xs">
              Invalid
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
