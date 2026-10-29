import React, { useRef, useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Sparkles, 
  Code2, 
  Copy, 
  Check, 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  List, 
  Undo2,
  Redo2,
  Terminal,
  Settings2
} from 'lucide-react';
import { setupMonacoLatex } from '../../utils/monacoLatex';

export default function LatexEditor({
  code,
  onChange,
  onRecompile,
  onOpenAiPrompt,
  diagnostics = [],
  fontSize = 14,
  projectFiles = [],
  activeFileName = ''
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [lineCount, setLineCount] = useState(1);
  const [copied, setCopied] = useState(false);

  // Keep references to files and active file for Monaco autocompletion
  const filesRef = useRef(projectFiles);
  filesRef.current = projectFiles;
  const activeFileNameRef = useRef(activeFileName);
  activeFileNameRef.current = activeFileName;

  // Handle Monaco Initialization and Mounting
  const handleEditorWillMount = (monaco) => {
    monacoRef.current = monaco;
    setupMonacoLatex(
      monaco,
      () => filesRef.current,
      () => activeFileNameRef.current
    );
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Track Cursor Position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column
      });
    });

    // Track Line Count
    editor.onDidChangeModelContent(() => {
      setLineCount(editor.getModel()?.getLineCount() || 1);
    });

    setLineCount(editor.getModel()?.getLineCount() || 1);

    // Keybindings:
    // 1. Ctrl+S / Cmd+S -> Save & Recompile
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onRecompile?.();
    });

    // 2. Ctrl+Enter / Cmd+Enter -> Recompile
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRecompile?.();
    });

    // 3. Ctrl+K / Cmd+K -> Prism AI Copilot
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      onOpenAiPrompt?.();
    });

    // 4. Ctrl+B / Cmd+B -> Bold
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      applyWrap('\\textbf{', '}');
    });

    // 5. Ctrl+I / Cmd+I -> Italic
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => {
      applyWrap('\\textit{', '}');
    });

    editor.focus();
  };

  // Sync Diagnostics with VS Code Red/Yellow Error Squigglies
  useEffect(() => {
    if (!monacoRef.current || !editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    const markers = diagnostics.map(d => ({
      severity: d.type === 'error' 
        ? monacoRef.current.MarkerSeverity.Error 
        : monacoRef.current.MarkerSeverity.Warning,
      startLineNumber: d.line || 1,
      startColumn: 1,
      endLineNumber: d.line || 1,
      endColumn: model.getLineMaxColumn(d.line || 1),
      message: d.message
    }));

    monacoRef.current.editor.setModelMarkers(model, 'latex-diagnostics', markers);
  }, [diagnostics]);

  // Toolbar Formatting Helpers using Monaco Edit Operations
  const applyWrap = (before, after, placeholder = '') => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!model || !selection) return;

    const selectedText = model.getValueInRange(selection);

    let replacement = '';
    if (selectedText) {
      replacement = before + selectedText + after;
    } else {
      replacement = before + placeholder + after;
    }

    editor.executeEdits('toolbar-wrap', [
      {
        range: selection,
        text: replacement,
        forceMoveMarkers: true
      }
    ]);

    // Position cursor inside if placeholder or empty
    if (!selectedText) {
      const newPos = {
        lineNumber: selection.startLineNumber,
        column: selection.startColumn + before.length
      };
      editor.setPosition(newPos);
    }

    editor.focus();
  };

  const toggleComment = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.getAction('editor.action.commentLine')?.run();
    editor.focus();
  };

  const handleUndo = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.trigger('toolbar', 'undo', null);
    editor.focus();
  };

  const handleRedo = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.trigger('toolbar', 'redo', null);
    editor.focus();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 overflow-hidden relative font-mono select-none">
      {/* Sub-Header Toolbar */}
      <div className="h-10 bg-slate-950/95 border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400 select-none z-10 shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          {/* Active File Badge */}
          <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-slate-200 text-xs font-semibold shrink-0">
            <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate max-w-[140px]">{activeFileName || 'LaTeX Source'}</span>
          </div>

          {/* Cursor Position Badge */}
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap shrink-0 hidden sm:inline-block">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>

          <span className="w-[1px] h-4 bg-slate-800 hidden sm:inline-block" />

          {/* Quick Undo / Redo & Formatting Toolbar */}
          <div className="flex items-center space-x-0.5 bg-slate-900/90 rounded-md p-0.5 border border-slate-800 shrink-0">
            {/* Undo */}
            <button
              onClick={handleUndo}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>

            {/* Redo */}
            <button
              onClick={handleRedo}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors"
              title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>

            <span className="w-[1px] h-3.5 bg-slate-800 my-auto mx-0.5" />

            {/* Formatting */}
            <button
              onClick={() => applyWrap('\\textbf{', '}')}
              className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors text-slate-400 font-bold"
              title="Bold (\textbf{...}) - Ctrl+B"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => applyWrap('\\textit{', '}')}
              className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors text-slate-400 italic"
              title="Italic (\textit{...}) - Ctrl+I"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => applyWrap('\\underline{', '}')}
              className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors text-slate-400"
              title="Underline (\underline{...})"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => applyWrap('\\texttt{', '}')}
              className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors text-slate-400"
              title="Code / Monospace (\texttt{...})"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleComment}
              className="px-2 py-0.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors text-slate-400 text-xs font-bold"
              title="Toggle Comment (%) - Ctrl+/"
            >
              %
            </button>
            <button
              onClick={() => applyWrap('\\section{', '}')}
              className="px-2 py-0.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors text-slate-400 text-xs font-bold"
              title="Insert Section (\section{...})"
            >
              §
            </button>
            <button
              onClick={() => applyWrap('\\item ', '')}
              className="p-1.5 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors text-slate-400"
              title="Insert List Item (\item)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Action Icons: AI Prompt + Copy */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenAiPrompt}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/30 transition-colors shadow-xs"
            title="Prism AI Inline Prompt (Ctrl+K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">AI Edit</span>
            <span className="text-[10px] text-indigo-400/80 font-mono hidden xl:inline">Ctrl+K</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Copy LaTeX Source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* VS Code Monaco Editor Engine Viewport */}
      <div className="flex-1 w-full h-full overflow-hidden relative">
        <Editor
          height="100%"
          defaultLanguage="latex"
          language="latex"
          theme="prism-vscode-dark"
          value={code}
          onChange={(newVal) => onChange?.(newVal || '')}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
              <span>Loading VS Code Engine...</span>
            </div>
          }
          options={{
            fontSize: fontSize || 14,
            fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            suggestOnTriggerCharacters: true,
            quickSuggestions: { other: true, comments: false, strings: true },
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            snippetSuggestions: 'top',
            smoothScrolling: true,
            padding: { top: 10, bottom: 10 },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true
          }}
        />
      </div>

      {/* VS Code Status Bar */}
      <div className="h-7 bg-slate-950/95 border-t border-slate-900 px-3 flex items-center justify-between text-[11px] text-slate-400 select-none shrink-0 whitespace-nowrap overflow-hidden">
        <div className="flex items-center space-x-3 overflow-x-auto scrollbar-none py-0.5">
          <span className="shrink-0"><kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300 font-mono">Ctrl+S</kbd> Compile</span>
          <span className="shrink-0"><kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300 font-mono">Ctrl+Space</kbd> IntelliSense</span>
          <span className="shrink-0"><kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300 font-mono">Ctrl+F</kbd> Find</span>
          <span className="shrink-0"><kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300 font-mono">Alt+Click</kbd> Multi-Cursor</span>
          <span className="shrink-0"><kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300 font-mono">Ctrl+/</kbd> Comment</span>
        </div>
        <div className="shrink-0 hidden md:flex items-center space-x-2 text-slate-500 font-mono text-[10px]">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>&bull;</span>
          <span>Spaces: 2</span>
          <span>&bull;</span>
          <span className="text-indigo-400">VS Code &bull; LaTeX</span>
        </div>
      </div>
    </div>
  );
}
