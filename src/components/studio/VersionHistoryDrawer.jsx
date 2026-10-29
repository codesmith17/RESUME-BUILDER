import React, { useState } from 'react';
import { History, X, Clock, Tag, RotateCcw, Eye, ArrowLeftRight } from 'lucide-react';

export default function VersionHistoryDrawer({
  isOpen,
  onClose,
  history = [],
  currentCode = '',
  onRestoreVersion,
  onLabelVersion
}) {
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [showLabelForm, setShowLabelForm] = useState(false);

  if (!isOpen) return null;

  const activeSnapshot = selectedSnapshot || (history.length > 0 ? history[0] : null);

  // Simple line-by-line diff computation
  const getDiffLines = () => {
    if (!activeSnapshot) return [];
    const pastLines = activeSnapshot.code.split('\n');
    const currLines = currentCode.split('\n');

    const diffs = [];
    const maxLen = Math.max(pastLines.length, currLines.length);

    for (let i = 0; i < maxLen; i++) {
      const past = pastLines[i];
      const curr = currLines[i];

      if (past === curr) {
        diffs.push({ type: 'same', text: curr || '', line: i + 1 });
      } else {
        if (past !== undefined) {
          diffs.push({ type: 'removed', text: past, line: i + 1 });
        }
        if (curr !== undefined) {
          diffs.push({ type: 'added', text: curr, line: i + 1 });
        }
      }
    }
    return diffs;
  };

  const handleCreateLabel = (e) => {
    e.preventDefault();
    if (!labelInput.trim()) return;
    onLabelVersion(labelInput.trim());
    setLabelInput('');
    setShowLabelForm(false);
  };

  return (
    <div className="w-[520px] h-full bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-20 shadow-2xl select-none">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-100 text-sm">Version History & Diff</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30">
            Overleaf Pro
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Label Current Version Button / Form */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40">
        {showLabelForm ? (
          <form onSubmit={handleCreateLabel} className="space-y-2">
            <input
              type="text"
              placeholder="e.g., Draft 1, Pre-submission, Review round 2"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              autoFocus
              className="w-full text-xs bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowLabelForm(false)}
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
              >
                Save Named Version
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowLabelForm(true)}
            className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Label Current Version Snapshot</span>
          </button>
        )}
      </div>

      {/* Main Split: Snapshots List (Top) & Diff View (Bottom) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Timeline Snapshots */}
        <div className="h-44 overflow-y-auto border-b border-slate-800 p-2 space-y-1">
          {history.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No previous versions saved yet. Versions are created automatically as you type or when you label them!
            </div>
          ) : (
            history.map((snap) => {
              const isSelected = activeSnapshot?.id === snap.id;
              return (
                <div
                  key={snap.id}
                  onClick={() => setSelectedSnapshot(snap)}
                  className={`p-2 rounded-lg cursor-pointer text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-slate-100'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-200 flex items-center space-x-1.5">
                        <span>{snap.label || 'Automatic Snapshot'}</span>
                        {snap.isLabeled && (
                          <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1 rounded">
                            Named
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} &middot; {snap.wordCount} words
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Restore version from ${new Date(snap.timestamp).toLocaleTimeString()}?`)) {
                        onRestoreVersion(snap.code);
                      }
                    }}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-emerald-400"
                    title="Restore This Version"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Diff View Header */}
        <div className="h-8 px-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1 font-mono text-[11px]">
            <ArrowLeftRight className="w-3 h-3 text-indigo-400" />
            <span>Comparing Selected Snapshot vs Current</span>
          </span>
          {activeSnapshot && (
            <button
              onClick={() => onRestoreVersion(activeSnapshot.code)}
              className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore</span>
            </button>
          )}
        </div>

        {/* Visual Red/Green Diff Viewer */}
        <div className="flex-1 overflow-auto p-3 font-mono text-xs bg-slate-950 select-text leading-5">
          {getDiffLines().map((diff, idx) => {
            if (diff.type === 'removed') {
              return (
                <div key={idx} className="bg-rose-950/40 text-rose-300 px-2 py-0.5 border-l-2 border-rose-500 flex items-start space-x-2">
                  <span className="text-rose-500 select-none">-</span>
                  <span className="whitespace-pre-wrap">{diff.text}</span>
                </div>
              );
            }
            if (diff.type === 'added') {
              return (
                <div key={idx} className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 border-l-2 border-emerald-500 flex items-start space-x-2">
                  <span className="text-emerald-500 select-none">+</span>
                  <span className="whitespace-pre-wrap">{diff.text}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="text-slate-400 px-2 py-0.5 flex items-start space-x-2">
                <span className="text-slate-400 select-none">&nbsp;</span>
                <span className="whitespace-pre-wrap">{diff.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
