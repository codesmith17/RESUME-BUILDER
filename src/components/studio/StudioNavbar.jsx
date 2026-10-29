import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  Sparkles, 
  History, 
  BookOpen, 
  Download, 
  Upload, 
  Settings, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Sigma, 
  Quote, 
  Layers,
  ChevronDown,
  FileArchive,
  Folder
} from 'lucide-react';

export default function StudioNavbar({
  projectName,
  setProjectName,
  mode,
  setMode,
  compileStatus,
  onRecompile,
  onOpenProjects,
  onOpenTemplates,
  onOpenHistory,
  onOpenDiagnostics,
  onOpenSymbols,
  onOpenCitations,
  onOpenImport,
  onOpenSettings,
  isAiDrawerOpen,
  setIsAiDrawerOpen,
  onExportPdf,
  onExportDocx,
  onExportLatex,
  onExportZip,
  diagnosticsCount = 0
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none z-30">
      {/* Left: Branding & Project Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-indigo-400">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <span className="font-serif font-bold text-lg">𝒫</span>
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-base hidden sm:inline">
            Prism<span className="text-indigo-400">TeX</span>
          </span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-indigo-500/30 hidden md:inline">
            AI Studio
          </span>
        </div>

        <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Overleaf-Style Projects Switcher Button */}
        <button
          onClick={onOpenProjects}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-colors shadow-xs"
          title="Open Projects Manager & Switch Projects"
        >
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          <span>Projects</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Project Name Input */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-800 px-2 py-1 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium max-w-[180px] sm:max-w-[260px] truncate"
          title="Click to rename project"
        />

        {/* Compile Status Pill */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
          {compileStatus === 'compiling' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300 text-[11px]">Compiling...</span>
            </>
          ) : diagnosticsCount > 0 ? (
            <button 
              onClick={onOpenDiagnostics}
              className="flex items-center space-x-1 text-amber-400 hover:text-amber-300"
            >
              <AlertCircle className="w-3 h-3" />
              <span className="text-[11px] font-medium">{diagnosticsCount} notices</span>
            </button>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Compiled</span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Mode Switcher (LaTeX Code vs DOCX Visual) */}
      <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
        <button
          onClick={() => setMode('latex')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === 'latex'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="LaTeX Code Editor (with Overleaf features)"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>LaTeX</span>
        </button>
        <button
          onClick={() => setMode('docx')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === 'docx'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="DOCX Visual WYSIWYG Editor (For non-LaTeX users)"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DOCX Visual</span>
        </button>
      </div>

      {/* Right: Primary Compile Action, Overleaf Tools Dock, Export, AI Copilot */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Prominent Compile Button */}
        <button
          onClick={onRecompile}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-xs shadow-emerald-900/40 transition-all"
          title="Compile LaTeX Document (Ctrl+S / Ctrl+Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-current text-white" />
          <span>Compile</span>
          <span className="text-[10px] text-emerald-200/80 font-mono hidden md:inline">Ctrl+S</span>
        </button>

        {/* Overleaf Tools Compact Dock */}
        <div className="hidden lg:flex items-center bg-slate-950/70 p-0.5 rounded-lg border border-slate-800/90 space-x-0.5">
          {/* Templates */}
          <button
            onClick={onOpenTemplates}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
            title="Templates Gallery (Resume, IEEE, ModernCV)"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Symbols Palette */}
          <button
            onClick={onOpenSymbols}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
            title="LaTeX Math Symbols & Greek Letters"
          >
            <Sigma className="w-4 h-4" />
          </button>

          {/* Citations / BibTeX */}
          <button
            onClick={onOpenCitations}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
            title="BibTeX Citations Manager"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Version History */}
          <button
            onClick={onOpenHistory}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
            title="Version History & Diff"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Import Files */}
          <button
            onClick={onOpenImport}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
            title="Import Project Files"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700/80 transition-colors shadow-xs"
            title="Export & Download options"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showExportMenu && (
            <div 
              className="absolute right-0 mt-1.5 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs divide-y divide-slate-800/60"
              onClick={() => setShowExportMenu(false)}
            >
              <div className="py-1">
                <button
                  onClick={onExportPdf}
                  className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1 py-0.5 rounded font-mono font-bold">PDF</span>
                  <span>Download as PDF</span>
                </button>
                <button
                  onClick={onExportDocx}
                  className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded font-mono font-bold">DOC</span>
                  <span>Download as Word (.docx)</span>
                </button>
                <button
                  onClick={onExportLatex}
                  className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-mono font-bold">TEX</span>
                  <span>Download LaTeX (.tex)</span>
                </button>
              </div>
              <div className="pt-1">
                <button
                  onClick={onExportZip}
                  className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-indigo-600 hover:text-white flex items-center space-x-2 transition-colors"
                >
                  <FileArchive className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Project (.zip)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Prism AI Copilot Button */}
        <button
          onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isAiDrawerOpen
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20'
              : 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xs shadow-indigo-900/30'
          }`}
          title="Open Prism AI Copilot (Ctrl+K)"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>Prism AI</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Studio Settings & Config"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
