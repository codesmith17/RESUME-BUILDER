import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X, Sparkles, ArrowRight } from 'lucide-react';

export default function DiagnosticsDrawer({
  isOpen,
  onClose,
  diagnostics = [],
  onFixWithAi,
  onJumpToLine
}) {
  if (!isOpen) return null;

  const errors = diagnostics.filter(d => d.type === 'error');
  const warnings = diagnostics.filter(d => d.type === 'warning');

  return (
    <div className="w-88 h-full bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-20 shadow-2xl select-none">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-100 text-sm">Compilation Logs & Diagnostics</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Counts */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-4 text-xs font-mono">
        <span className="flex items-center space-x-1 text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          <span>{errors.length} Errors</span>
        </span>
        <span className="flex items-center space-x-1 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          <span>{warnings.length} Warnings</span>
        </span>
        {diagnostics.length === 0 && (
          <span className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clean Build</span>
          </span>
        )}
      </div>

      {/* Diagnostics List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 select-text">
        {diagnostics.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/80 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">0 Errors &middot; 0 Warnings</p>
            <p className="text-[11px] text-slate-400 mt-1">Your document syntax is clean and ready to publish.</p>
          </div>
        ) : (
          diagnostics.map((diag, idx) => {
            const isErr = diag.type === 'error';
            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-2 ${
                  isErr
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-[10px]">
                    {isErr ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-rose-400">Error &middot; Line {diag.line}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Warning &middot; Line {diag.line}</span>
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => onJumpToLine?.(diag.line)}
                    className="text-[10px] text-indigo-400 hover:underline flex items-center space-x-0.5"
                  >
                    <span>Jump to line</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>

                <p className="font-mono text-[11px] leading-relaxed">
                  {diag.message}
                </p>

                {/* 1-Click Fix with AI Button */}
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onFixWithAi?.(diag)}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Fix with AI</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
