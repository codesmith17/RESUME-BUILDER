import React, { useState } from 'react';
import { Sigma, X, Search, Check } from 'lucide-react';
import { SYMBOL_CATEGORIES } from '../../services/symbolData';

export default function SymbolPaletteDrawer({
  isOpen,
  onClose,
  onInsertSymbol
}) {
  const [search, setSearch] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState(null);

  if (!isOpen) return null;

  const handleSelect = (sym) => {
    onInsertSymbol(sym.latex);
    setCopiedSymbol(sym.name);
    setTimeout(() => setCopiedSymbol(null), 1500);
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-20 shadow-2xl select-none">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2">
          <Sigma className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-100 text-sm">LaTeX Symbols & Palette</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search Greek, operators, arrows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-900 border border-slate-700 pl-8 pr-3 py-1.5 rounded-lg text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Symbol Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {SYMBOL_CATEGORIES.map((cat, idx) => {
          const filtered = cat.symbols.filter(s => 
            s.name.toLowerCase().includes(search.toLowerCase()) || 
            s.latex.toLowerCase().includes(search.toLowerCase())
          );

          if (filtered.length === 0) return null;

          return (
            <div key={idx}>
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                {cat.category}
              </h3>

              <div className="grid grid-cols-4 gap-1.5">
                {filtered.map((sym, sIdx) => {
                  const isJustClicked = copiedSymbol === sym.name;
                  return (
                    <button
                      key={sIdx}
                      onClick={() => handleSelect(sym)}
                      className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center transition-all ${
                        isJustClicked
                          ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-slate-200'
                      }`}
                      title={`${sym.name}: ${sym.latex} (Click to insert)`}
                    >
                      <span className="font-serif text-sm font-semibold mb-0.5">
                        {sym.label}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono truncate max-w-full">
                        {sym.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-800 text-[11px] text-slate-400 text-center font-mono">
        Click any symbol to insert at editor cursor
      </div>
    </div>
  );
}
