import React, { useState } from 'react';
import { BookOpen, X, Check, FileCode, FileText, Sparkles } from 'lucide-react';
import { TEMPLATES } from '../../services/templatesData';

export default function TemplatesDrawer({
  isOpen,
  onClose,
  onSelectTemplate
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Academic Papers', 'Resumes & CVs', 'DOCX / Visual', 'Letters'];

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100 text-sm">Templates Gallery (Overleaf + DOCX)</h2>
              <p className="text-[11px] text-slate-400">Every template includes both LaTeX source code and DOCX visual format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between transition-all group hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-400 font-mono">
                    {tpl.category}
                  </span>
                  {tpl.badge && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">
                      {tpl.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-100 text-sm mb-1.5 group-hover:text-indigo-300 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {tpl.description}
                </p>

                {/* Included Formats Tags */}
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-4">
                  <span className="flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400">
                    <FileCode className="w-3 h-3" />
                    <span>LaTeX (.tex)</span>
                  </span>
                  <span className="flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-blue-400">
                    <FileText className="w-3 h-3" />
                    <span>Word DOCX</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectTemplate(tpl);
                  onClose();
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use This Template</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
