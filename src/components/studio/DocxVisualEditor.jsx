import React, { useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Table, 
  Code, 
  Sigma, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  ArrowRightLeft,
  Download,
  Sparkles
} from 'lucide-react';
import { exportToDocx } from '../../services/docxConverter';

export default function DocxVisualEditor({
  htmlContent,
  onChange,
  onSyncToLatex,
  onOpenAiPrompt
}) {
  const editorRef = useRef(null);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width:100%; border-collapse: collapse; margin: 12px 0;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">Header 1</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">Header 2</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 6px;">Row 1 Item</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px;">Value</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px;">Detail</td>
          </tr>
        </tbody>
      </table><p><br></p>`;
    executeCommand('insertHTML', tableHtml);
  };

  const insertFormula = () => {
    const formula = prompt('Enter LaTeX Math formula (e.g. E = mc^2 or \\sum_{i=1}^n x_i):', 'E = mc^2');
    if (formula) {
      const formulaHtml = `<span style="font-family: monospace; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: 500;">$${formula}$</span>&nbsp;`;
      executeCommand('insertHTML', formulaHtml);
    }
  };

  const insertCallout = () => {
    const calloutHtml = `
      <blockquote style="border-left: 4px solid #6366f1; background: #f8fafc; padding: 10px 14px; margin: 12px 0; color: #334155; font-style: italic;">
        <strong>Key Insight:</strong> Enter important summary or takeaway message here.
      </blockquote><p><br></p>`;
    executeCommand('insertHTML', calloutHtml);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Visual Editor Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap items-center gap-1 text-slate-300 text-xs select-none">
        {/* Headings */}
        <div className="flex items-center space-x-0.5 bg-slate-950 p-1 rounded border border-slate-800">
          <button
            onClick={() => executeCommand('formatBlock', '<h1>')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Heading 1 (Section)"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Heading 2 (Subsection)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Heading 3 (Subsubsection)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<p>')}
            className="px-1.5 py-0.5 hover:bg-slate-800 hover:text-white rounded text-[11px]"
            title="Paragraph"
          >
            ¶ Normal
          </button>
        </div>

        {/* Text Formats */}
        <div className="flex items-center space-x-0.5 bg-slate-950 p-1 rounded border border-slate-800">
          <button
            onClick={() => executeCommand('bold')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded italic"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded underline"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('strikeThrough')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center space-x-0.5 bg-slate-950 p-1 rounded border border-slate-800">
          <button
            onClick={() => executeCommand('justifyLeft')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('justifyCenter')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('justifyRight')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('justifyFull')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Inserts */}
        <div className="flex items-center space-x-0.5 bg-slate-950 p-1 rounded border border-slate-800">
          <button
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Bulleted List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={insertTable}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Insert Table"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={insertCallout}
            className="p-1 hover:bg-slate-800 hover:text-white rounded"
            title="Insert Quote / Callout Block"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={insertFormula}
            className="p-1 hover:bg-slate-800 hover:text-white rounded text-indigo-400 font-serif"
            title="Insert Math Formula ($...$)"
          >
            <Sigma className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sync & AI Action Buttons */}
        <div className="ml-auto flex items-center space-x-1.5">
          <button
            onClick={onSyncToLatex}
            className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded text-xs font-medium transition-colors"
            title="Sync changes into LaTeX source code"
          >
            <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
            <span>Sync to LaTeX</span>
          </button>

          <button
            onClick={() => exportToDocx(htmlContent || editorRef.current?.innerHTML || '')}
            className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Download formatted .docx file"
          >
            <Download className="w-3 h-3" />
            <span>Export DOCX</span>
          </button>

          <button
            onClick={onOpenAiPrompt}
            className="flex items-center space-x-1 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded text-xs font-medium shadow-sm transition-all"
            title="Open Prism AI Copilot"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Assist</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Paper (Like Microsoft Word & Google Docs Canvas) */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6 flex justify-center">
        <div className="w-full max-w-3xl min-h-[900px] bg-white text-slate-900 rounded-lg shadow-2xl p-10 sm:p-14 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="min-h-[800px] outline-none font-serif text-[15px] leading-relaxed prose prose-slate max-w-none text-slate-900 selection:bg-indigo-500/20"
            style={{
              fontFamily: "'Newsreader', 'Crimson Pro', Georgia, serif"
            }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="h-6 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <span>DOCX Visual Editor &middot; WYSIWYG Mode for all users</span>
        <span>Changes sync automatically to live PDF preview</span>
      </div>
    </div>
  );
}
