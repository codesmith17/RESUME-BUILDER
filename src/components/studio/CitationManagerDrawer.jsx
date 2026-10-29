import React, { useState } from 'react';
import { Quote, X, Plus, Search, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { parseBibtex, formatBibtexEntry } from '../../services/bibtexService';

export default function CitationManagerDrawer({
  isOpen,
  onClose,
  bibtexContent = '',
  onInsertCitation,
  onAddBibtexEntry
}) {
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'article',
    key: '',
    title: '',
    author: '',
    year: '2026',
    journal: ''
  });

  if (!isOpen) return null;

  const entries = parseBibtex(bibtexContent);
  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.author.toLowerCase().includes(search.toLowerCase()) ||
    e.key.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyCite = (key) => {
    onInsertCitation(`\\cite{${key}}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.key.trim() || !newEntry.title.trim()) return;
    const bibtexSnippet = formatBibtexEntry(newEntry);
    onAddBibtexEntry(bibtexSnippet);
    setIsAdding(false);
    setNewEntry({
      type: 'article',
      key: '',
      title: '',
      author: '',
      year: '2026',
      journal: ''
    });
  };

  return (
    <div className="w-88 h-full bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-20 shadow-2xl select-none">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2">
          <Quote className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-100 text-sm">BibTeX Citations</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
            {entries.length} items
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            title="Add Citation"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add New Citation Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-3 border-b border-slate-800 bg-slate-950/60 space-y-2 text-xs">
          <div className="font-semibold text-slate-200 flex items-center justify-between">
            <span>New Reference Entry</span>
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-[11px] rounded px-1.5 py-0.5 text-slate-300"
            >
              <option value="article">@article</option>
              <option value="inproceedings">@inproceedings</option>
              <option value="book">@book</option>
              <option value="misc">@misc</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Citation Key (e.g., chen2026adaptive)"
            value={newEntry.key}
            onChange={(e) => setNewEntry({ ...newEntry, key: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
            required
          />

          <input
            type="text"
            placeholder="Paper / Book Title"
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            required
          />

          <input
            type="text"
            placeholder="Authors (e.g., Smith, Alex and Doe, Jane)"
            value={newEntry.author}
            onChange={(e) => setNewEntry({ ...newEntry, author: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            required
          />

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Journal / Venue"
              value={newEntry.journal}
              onChange={(e) => setNewEntry({ ...newEntry, journal: e.target.value })}
              className="flex-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
            <input
              type="text"
              placeholder="Year"
              value={newEntry.year}
              onChange={(e) => setNewEntry({ ...newEntry, year: e.target.value })}
              className="w-20 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
            >
              Add to .bib
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search references by title, author, key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-900 border border-slate-700 pl-8 pr-3 py-1.5 rounded-lg text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Citations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            <Quote className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
            <p>No citations found in references.bib.</p>
            <p className="text-[11px] text-slate-400 mt-1">Click the + button above to add a citation or import a .bib file!</p>
          </div>
        ) : (
          filteredEntries.map((entry, idx) => {
            const isJustCopied = copiedKey === entry.key;
            return (
              <div
                key={idx}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-xs space-y-1.5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-indigo-400 font-semibold bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    @{entry.key}
                  </span>
                  <button
                    onClick={() => handleCopyCite(entry.key)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors text-[11px]"
                    title="Insert \cite into editor"
                  >
                    {isJustCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Inserted!</span>
                      </>
                    ) : (
                      <>
                        <Quote className="w-3 h-3" />
                        <span>Insert \cite</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="font-medium text-slate-200 leading-snug">
                  {entry.title}
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  {entry.author} &middot; {entry.year}
                </div>

                {entry.journal && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    {entry.journal}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-800 text-[11px] text-slate-400 text-center font-mono">
        Click "Insert \cite" to insert \cite&#123;key&#125; at cursor
      </div>
    </div>
  );
}
