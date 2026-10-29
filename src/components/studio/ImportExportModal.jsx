import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  X, 
  FileCode, 
  FileText, 
  Quote, 
  FileArchive, 
  CheckCircle2, 
  AlertCircle,
  FileUp,
  Sparkles
} from 'lucide-react';
import { parsePdfFile } from '../../services/pdfConverter';
import { parseDocxFile, htmlToLatex } from '../../services/docxConverter';

export default function ImportExportModal({
  isOpen,
  onClose,
  onImportData,
  onExportPdf,
  onExportDocx,
  onExportLatex,
  onExportZip,
  projectName = 'document'
}) {
  const [activeTab, setActiveTab] = useState('import'); // 'import' | 'export'
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsProcessing(true);
    setStatusMessage(`Reading ${file.name}...`);

    try {
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === 'pdf') {
        setStatusMessage('Extracting PDF text and synthesizing dual LaTeX + DOCX formats...');
        const result = await parsePdfFile(file);
        onImportData({
          type: 'pdf',
          fileName: file.name,
          title: result.title,
          latexCode: result.latexCode,
          docxHtml: result.docxHtml
        });
        setStatusMessage('Successfully converted PDF to LaTeX and DOCX!');
        setTimeout(onClose, 800);
      } else if (ext === 'docx') {
        setStatusMessage('Extracting Word DOCX formatting...');
        const docxResult = await parseDocxFile(file);
        const generatedLatex = htmlToLatex(docxResult.html, file.name);
        onImportData({
          type: 'docx',
          fileName: file.name,
          docxHtml: docxResult.html,
          latexCode: generatedLatex
        });
        setStatusMessage('Successfully imported DOCX and generated LaTeX!');
        setTimeout(onClose, 800);
      } else if (ext === 'tex') {
        setStatusMessage('Importing LaTeX source file...');
        const text = await file.text();
        onImportData({
          type: 'tex',
          fileName: file.name,
          latexCode: text
        });
        setStatusMessage('Imported LaTeX successfully!');
        setTimeout(onClose, 800);
      } else if (ext === 'bib') {
        setStatusMessage('Importing BibTeX bibliography...');
        const text = await file.text();
        onImportData({
          type: 'bib',
          fileName: file.name,
          bibtexContent: text
        });
        setStatusMessage('Imported BibTeX citations!');
        setTimeout(onClose, 800);
      } else {
        // Plain text / markdown
        const text = await file.text();
        onImportData({
          type: 'txt',
          fileName: file.name,
          rawText: text
        });
        setStatusMessage('Imported text file!');
        setTimeout(onClose, 800);
      }
    } catch (err) {
      console.error('Import error:', err);
      setStatusMessage(`Error importing file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100 text-sm">Import & Export Data</h2>
              <p className="text-[11px] text-slate-400">Import PDF, DOCX, LaTeX or export complete publication bundles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-2 text-xs">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'import'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import (PDF / DOCX / TeX)</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'export'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Downloads</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-950/40'
                }`}
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-indigo-400 animate-bounce" />
                <h3 className="font-semibold text-slate-100 text-sm mb-1">
                  Drag and drop your file here
                </h3>
                <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  Supports <strong>.pdf</strong> (auto-generates LaTeX & DOCX), <strong>.docx</strong> (Word), <strong>.tex</strong>, <strong>.bib</strong>, or <strong>.txt</strong>.
                </p>

                <label className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md transition-colors">
                  <FileUp className="w-4 h-4" />
                  <span>Browse From Computer</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.tex,.bib,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>

              {/* Status Indicator */}
              {statusMessage && (
                <div className="flex items-center space-x-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-indigo-300 font-mono">
                  {isProcessing ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          ) : (
            /* Export Tab */
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  onExportPdf();
                  onClose();
                }}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-xl flex flex-col items-center text-center space-y-2 hover:bg-slate-800/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
                  PDF
                </div>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-rose-300">
                    Compiled PDF
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Vector quality print format
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onExportDocx();
                  onClose();
                }}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl flex flex-col items-center text-center space-y-2 hover:bg-slate-800/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                  DOCX
                </div>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-blue-300">
                    Microsoft Word (.docx)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Editable office document
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onExportLatex();
                  onClose();
                }}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl flex flex-col items-center text-center space-y-2 hover:bg-slate-800/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  TEX
                </div>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-emerald-300">
                    LaTeX Source (.tex)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Pure TeX markup file
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onExportZip();
                  onClose();
                }}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl flex flex-col items-center text-center space-y-2 hover:bg-slate-800/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                  <FileArchive className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-amber-300">
                    Project Archive (.zip)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    All TeX, DOCX & bib files
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
