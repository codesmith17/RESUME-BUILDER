import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Printer, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  RefreshCw, 
  Copy, 
  Trash2,
  FileText,
  Loader2,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { 
  initWasmEngine, 
  compileProjectWithWasm, 
  isEngineCached 
} from '../../services/wasmTexEngine';
import { texLogger } from '../../services/texLogger';
import PdfJsViewer from './PdfJsViewer';

export default function CompiledPdfPreview({
  rawLatexCode = '',
  projectName = 'document',
  onDownloadPdf,
  projectFiles = [],
  activeFile = null,
  activeFileId = null,
  recompileTrigger = 0
}) {
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1440) {
      return 85;
    }
    return 100;
  });
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [links, setLinks] = useState([]);
  const [viewerMode, setViewerMode] = useState('canvas'); // 'canvas' | 'native'
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState(null);
  const [compileErrors, setCompileErrors] = useState([]);
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const [lastCompiledAt, setLastCompiledAt] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCopied, setIsCopied] = useState(false);

  const previewContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const logsEndRef = useRef(null);

  // Subscribe to real-time texLogger stream
  useEffect(() => {
    setLogs(texLogger.getLogs());
    const unsubscribe = texLogger.subscribe((updatedLogs) => {
      setLogs([...updatedLogs]);
    });
    return unsubscribe;
  }, []);

  // Auto-scroll logs drawer to bottom
  useEffect(() => {
    if (showLogDrawer && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, showLogDrawer]);

  // Core Multi-File Native TeX Compilation
  const executeCompile = useCallback(async (codeToCompile) => {
    const code = codeToCompile !== undefined ? codeToCompile : rawLatexCode;
    if (!code || !code.trim()) return;

    setIsCompiling(true);
    setCompileError(null);
    const startTime = performance.now();

    try {
      let mainFileName = 'resume.tex';
      let codeToRun = code;

      // Check if current active file is a standalone document (contains \documentclass)
      const activeContent = activeFile?.content || code;
      const isActiveStandalone = activeFile && (
        activeContent.includes('\\documentclass') ||
        activeContent.includes('\\begin{document}')
      );

      if (isActiveStandalone && activeFile) {
        mainFileName = activeFile.name;
        codeToRun = code;
      } else {
        // Active file is an auxiliary section (e.g. education.tex, skills.tex)
        // Find main project document
        const mainCandidate = projectFiles.find(f => 
          f.isMain || 
          (f.name && (f.name === 'resume.tex' || f.name === 'main.tex' || f.name === 'cv-llt.tex'))
        ) || projectFiles.find(f => f.name.endsWith('.tex'));

        if (mainCandidate) {
          mainFileName = mainCandidate.name;
          codeToRun = mainCandidate.id === activeFileId ? code : mainCandidate.content;
        }
      }

      // Ensure projectFiles list contains latest edits for the active file
      const updatedFiles = projectFiles.map(f => {
        if (activeFile && f.id === activeFile.id) {
          return { ...f, content: code };
        }
        return f;
      });

      texLogger.info('COMPILE', `Compiling LaTeX project (Main: ${mainFileName})...`);

      const result = await compileProjectWithWasm({
        mainFile: mainFileName,
        mainCode: codeToRun,
        projectFiles: updatedFiles
      });

      const durationMs = Math.round(performance.now() - startTime);

      if (result.success && result.pdfBlob) {
        setPdfBlob(result.pdfBlob);
        setPdfUrl(result.pdfUrl);
        setLinks(result.links || []);
        setLastCompiledAt(new Date().toLocaleTimeString());
        setCompileError(null);
        setCompileErrors([]);
        texLogger.success('COMPILE', `Generated genuine vector PDF (${result.pdfBytes?.byteLength || result.pdfBlob.size} bytes) in ${durationMs}ms.`);
      } else {
        setCompileError(result.error || 'Compilation failed');
        setCompileErrors(result.errors || []);
      }
    } catch (err) {
      texLogger.error('COMPILE', 'Compilation error: ' + err.message);
      setCompileError(err.message);
      setCompileErrors([]);
    } finally {
      setIsCompiling(false);
    }
  }, [rawLatexCode, projectFiles, activeFile, activeFileId]);

  // Initial compile on mount
  useEffect(() => {
    executeCompile();
  }, []);

  // When activeFileId changes (user switches to a new tex file in the explorer)
  // immediately start loading on the PDF side and update according to the tex
  useEffect(() => {
    if (!activeFileId) return;
    setIsCompiling(true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    executeCompile(rawLatexCode);
  }, [activeFileId]);

  // Auto-compile debounced on code edits
  useEffect(() => {
    if (!rawLatexCode) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeCompile(rawLatexCode);
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [rawLatexCode, executeCompile]);

  // Immediate recompile on recompileTrigger (from Ctrl+S, Ctrl+Enter, or StudioNavbar button)
  useEffect(() => {
    if (recompileTrigger > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      executeCompile(rawLatexCode);
    }
  }, [recompileTrigger]);

  // Keyboard shortcut: Ctrl+S / Cmd+S or Ctrl+Enter / Cmd+Enter to recompile immediately
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        executeCompile(rawLatexCode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeCompile, rawLatexCode]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 40));
  const handleZoomReset = () => setZoom(100);

  // Auto calculate Fit Width zoom based on container width
  const handleZoomFitWidth = useCallback(() => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.clientWidth;
      // 814px is standard US Letter width at 100% (612pt * 1.33)
      // Allow 48px padding (24px each side)
      const availableWidth = Math.max(300, containerWidth - 48);
      const calculatedZoom = Math.round((availableWidth / 814) * 100);
      setZoom(Math.max(40, Math.min(160, calculatedZoom)));
    } else {
      setZoom(85);
    }
  }, []);

  // Print or Download PDF
  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
      } else {
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else if (onDownloadPdf) {
      onDownloadPdf();
    }
  };

  // Copy logs to clipboard
  const handleCopyLogs = () => {
    const formatted = logs.map(l => `[${l.time}] [${l.category}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(formatted);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const filteredLogs = selectedCategory === 'ALL'
    ? logs
    : logs.filter(l => l.category === selectedCategory);

  const categories = ['ALL', 'COMPILE', 'WASM', 'CACHE'];

  return (
    <div 
      ref={previewContainerRef}
      className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-100 overflow-hidden font-sans relative"
    >
      {/* Sleek Unified Compilation & Control Toolbar */}
      <div className="h-10 bg-slate-950/90 border-b border-slate-800 px-3 flex items-center justify-between z-10 shadow-xs shrink-0 select-none">
        
        {/* Left: Recompile, Logs, and Local Status */}
        <div className="flex items-center space-x-2">
          {/* Recompile Button */}
          <button
            onClick={() => executeCompile()}
            disabled={isCompiling}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-md font-semibold text-xs shadow-xs transition-all"
            title="Recompile LaTeX (Ctrl+S / Ctrl+Enter)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'Compiling...' : 'Recompile'}</span>
          </button>

          {/* Compiler Log Drawer Toggle */}
          <button
            onClick={() => setShowLogDrawer(prev => !prev)}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs border transition-colors ${
              showLogDrawer
                ? 'bg-indigo-900/60 text-indigo-200 border-indigo-500/50'
                : compileError 
                ? 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse' 
                : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
            }`}
            title="View Compiler Logs & Diagnostics"
          >
            <Terminal className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Logs</span>
            <span className="px-1.5 py-0.2 bg-slate-700 text-slate-300 rounded text-[10px] font-mono">
              {logs.length}
            </span>
            {compileError && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-0.5" />}
          </button>

          {/* Engine Status Dot */}
          <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-slate-400 pl-1.5 border-l border-slate-800">
            <span className={`w-2 h-2 rounded-full ${isCompiling ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="truncate max-w-[140px]">
              {isCompiling ? 'Typesetting...' : 'Offline TeX Ready'}
            </span>
          </div>
        </div>

        {/* Right: View Mode Toggle, Zoom Controls, Fit Width, and PDF Download */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Viewer Mode Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-md p-0.5 border border-slate-700/60 text-[11px] font-medium mr-1">
            <button
              onClick={() => setViewerMode('canvas')}
              className={`px-2 py-0.5 rounded transition-all ${
                viewerMode === 'canvas' 
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Interactive Canvas Viewport"
            >
              Canvas
            </button>
            <button
              onClick={() => setViewerMode('native')}
              className={`px-2 py-0.5 rounded transition-all ${
                viewerMode === 'native' 
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Native Browser PDF Viewport"
            >
              Native PDF
            </button>
          </div>

          <span className="text-slate-800 hidden sm:inline">|</span>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          {/* Zoom percentage button (Click resets / fits) */}
          <button
            onClick={handleZoomFitWidth}
            className="text-[11px] font-mono text-slate-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
            title="Click to Fit Width"
          >
            {zoom}%
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Fit Width */}
          <button
            onClick={handleZoomFitWidth}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors hidden sm:inline-block"
            title="Fit to Width"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <span className="text-slate-800 hidden sm:inline">|</span>

          {/* Download PDF Button */}
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-xs font-medium border border-slate-700/80 transition-colors shadow-xs"
            title="Download Vector PDF"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors hidden xl:inline-block"
            title="Print Document"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Compiler Log Drawer */}
      {showLogDrawer && (
        <div className="bg-slate-950 border-b border-slate-800 max-h-64 flex flex-col p-3 text-[11px] font-mono text-slate-300 z-20 shrink-0">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-slate-200">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Local WebAssembly TeX Logs</span>
              </span>
              
              {/* Filter pills */}
              <div className="flex items-center space-x-1 ml-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLogs}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center space-x-1 border border-slate-700"
                title="Copy all logs"
              >
                <Copy className="w-3 h-3" />
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={() => texLogger.clear()}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center space-x-1 border border-slate-700"
                title="Clear logs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
              <button
                onClick={() => setShowLogDrawer(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable log list */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-[11px] max-h-48">
            {filteredLogs.length === 0 ? (
              <div className="text-slate-500 italic py-2">No log entries recorded for category '{selectedCategory}'.</div>
            ) : (
              filteredLogs.map((item) => (
                <div key={item.id} className="flex items-start space-x-2 leading-relaxed hover:bg-slate-900/60 px-1 py-0.5 rounded">
                  <span className="text-slate-500 shrink-0 text-[10px]">{item.time}</span>
                  <span className={`px-1 py-0.2 rounded text-[9px] font-bold shrink-0 uppercase ${
                    item.category === 'WASM' ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/50' :
                    item.category === 'COMPILE' ? 'bg-amber-950 text-amber-300 border border-amber-700/50' :
                    item.category === 'CACHE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50' :
                    'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.category}
                  </span>
                  <span className={`break-words ${
                    item.level === 'error' ? 'text-rose-400 font-semibold' :
                    item.level === 'warn' ? 'text-amber-400' :
                    item.level === 'success' ? 'text-emerald-400' :
                    'text-slate-300'
                  }`}>
                    {item.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* 5. Main Viewport: The Genuine Vector PDF Rendered via PDF.js with Clickable Links */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950 flex flex-col items-center">
        {compileError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-300 max-w-xl mx-auto overflow-y-auto">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 shrink-0 shadow-lg shadow-rose-950/50">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-rose-300 mb-1">
              LaTeX Compilation Error
            </h3>
            <p className="text-xs text-slate-400 mb-4 text-center">
              The TeX engine encountered syntax or package issues while compiling this document.
            </p>

            {/* Structured error cards if line errors are detected */}
            {compileErrors && compileErrors.length > 0 ? (
              <div className="w-full space-y-2 mb-4">
                {compileErrors.map((err, idx) => (
                  <div key={idx} className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-3 text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      {err.line && (
                        <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-mono font-bold">
                          Line {err.line}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-rose-200">
                        {err.message}
                      </span>
                    </div>
                    {err.context && (
                      <pre className="mt-1.5 p-2 bg-slate-950/80 rounded border border-rose-900/40 text-[11px] font-mono text-amber-200/90 whitespace-pre-wrap break-all">
                        {err.context}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-slate-950/80 border border-rose-900/50 rounded-lg p-3.5 mb-4 text-left">
                <pre className="text-xs font-mono text-rose-300 whitespace-pre-wrap break-all leading-relaxed">
                  {compileError}
                </pre>
              </div>
            )}

            {/* Quick Diagnostic Tips */}
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-left text-xs text-slate-400 space-y-1 mb-4">
              <div className="font-semibold text-slate-300 flex items-center space-x-1.5 mb-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Common LaTeX Fixes:</span>
              </div>
              <p>• Unclosed braces: check matching <code className="text-amber-300">{"{ ... }"}</code> pairs.</p>
              <p>• Special characters: escape <code className="text-amber-300">_ & % # $</code> with backslashes (e.g. <code className="text-amber-300">\_</code>).</p>
              <p>• Section files: ensure they are included via <code className="text-amber-300">\input&#123;...&#125;</code> in the main file.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLogDrawer(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium shadow-sm transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Open Full Compiler Logs</span>
              </button>
              <button
                onClick={() => executeCompile()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs border border-slate-700 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Compile</span>
              </button>
            </div>
          </div>
        ) : pdfBlob || pdfUrl ? (
          viewerMode === 'native' ? (
            <div className="w-full h-full p-4 flex flex-col items-center overflow-hidden">
              <object
                data={`${pdfUrl}#navpanes=0`}
                type="application/pdf"
                className="w-full h-full max-w-4xl min-h-[900px] rounded shadow-2xl bg-white border border-slate-700"
              >
                <iframe 
                  src={pdfUrl} 
                  className="w-full h-full border-none rounded" 
                  title="Compiled Vector PDF" 
                />
              </object>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto p-4 flex flex-col items-center">
              <PdfJsViewer
                pdfBlob={pdfBlob}
                pdfUrl={pdfUrl}
                links={links}
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
                projectName={projectName}
              />
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <div className="text-sm font-medium">Typesetting document with WebAssembly...</div>
            <div className="text-xs text-slate-500">100% In-Browser • Clickable Hyperlinks • Vector Output</div>
          </div>
        )}
      </div>
    </div>
  );
}
