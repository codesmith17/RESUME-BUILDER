// VS Code-grade LaTeX Language Definition for Monaco Editor
// Includes Monarch Syntax Tokenizer, Language Configuration, and IntelliSense Snippets

export function setupMonacoLatex(monaco, getProjectFiles = () => [], getActiveFileName = () => '') {
  // Check if latex is already registered
  const languages = monaco.languages.getLanguages();
  const hasLatex = languages.some(lang => lang.id === 'latex');

  if (!hasLatex) {
    monaco.languages.register({ id: 'latex', extensions: ['.tex', '.sty', '.cls', '.bib'] });
  }

  // 1. Language Configuration (Comments, auto-closing brackets, word definitions)
  monaco.languages.setLanguageConfiguration('latex', {
    comments: {
      lineComment: '%'
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '$', close: '$' },
      { open: '"', close: '"' }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '$', close: '$' }
    ],
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
  });

  // 2. Monarch Syntax Tokenizer (VS Code Dark+ syntax colors)
  monaco.languages.setMonarchTokensProvider('latex', {
    defaultToken: '',
    tokenPostfix: '.latex',

    keywords: [
      'documentclass', 'usepackage', 'begin', 'end', 'section', 'subsection',
      'subsubsection', 'paragraph', 'textbf', 'textit', 'underline', 'texttt',
      'textsc', 'emph', 'href', 'url', 'item', 'cite', 'citep', 'citet', 'ref',
      'pageref', 'label', 'input', 'include', 'bibliography', 'bibliographystyle',
      'newpage', 'clearpage', 'vspace', 'hspace', 'hfill', 'centering', 'noindent',
      'resumeItem', 'resumeSubheading', 'resumeProjectHeading',
      'resumeSubHeadingListStart', 'resumeSubHeadingListEnd',
      'resumeItemListStart', 'resumeItemListEnd', 'newcommand', 'renewcommand'
    ],

    tokenizer: {
      root: [
        // Comments
        [/%(.*)$/, 'comment'],

        // Math Mode: Inline $...$ or $$...$$
        [/\$\$[\s\S]*?\$\$/, 'string.math'],
        [/\$([^\$]|\\\$)*\$/, 'string.math'],

        // LaTeX Control Commands e.g. \documentclass, \section, \textbf
        [/\\([a-zA-Z*@]+)/, {
          cases: {
            '@keywords': 'keyword.command',
            '@default': 'type.command'
          }
        }],

        // Special characters escaped e.g. \%, \&, \$, \_
        [/\\([%$&_#{}\\])/, 'constant.character.escape'],

        // Arguments inside curly braces: e.g. {article}, {amsmath}
        [/[{}]/, 'delimiter.curly'],
        [/[\[\]]/, 'delimiter.square'],

        // Numbers & Dimensions (10pt, 1em, 2cm)
        [/\b\d+(\.\d+)?(pt|mm|cm|in|ex|em)?\b/, 'number'],

        // Whitespace
        { include: '@whitespace' }
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white']
      ]
    }
  });

  // 3. VS Code Dark Theme definition with exact VS Code syntax tokens
  monaco.editor.defineTheme('prism-vscode-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword.command', foreground: 'C586C0', fontStyle: 'bold' }, // Purple
      { token: 'type.command', foreground: '569CD6' }, // Blue
      { token: 'string.math', foreground: 'D7BA7D' }, // Amber/Yellow
      { token: 'delimiter.curly', foreground: '4EC9B0' }, // Teal
      { token: 'delimiter.square', foreground: 'CE9178' }, // Orange
      { token: 'number', foreground: 'B5CEA8' }, // Light Green
      { token: 'constant.character.escape', foreground: 'DCDCAA' }
    ],
    colors: {
      'editor.background': '#0f172a', // Tailwind slate-900 / dark modern
      'editor.foreground': '#e2e8f0',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#818cf8',
      'editorCursor.foreground': '#818cf8',
      'editor.lineHighlightBackground': '#1e293b50',
      'editor.selectionBackground': '#4338ca50',
      'editor.inactiveSelectionBackground': '#312e8130',
      'editorSuggestWidget.background': '#0f172a',
      'editorSuggestWidget.border': '#334155',
      'editorSuggestWidget.foreground': '#cbd5e1',
      'editorSuggestWidget.selectedBackground': '#312e81',
      'editorSuggestWidget.highlightForeground': '#a5b4fc',
      'editorWidget.background': '#0f172a',
      'editorWidget.border': '#334155'
    }
  });

  // 4. VS Code IntelliSense Autocomplete Completion Provider
  monaco.languages.registerCompletionItemProvider('latex', {
    triggerCharacters: ['\\', '{', '['],
    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [];

      // A. Check if inside \cite{...}
      const citeMatch = textUntilPosition.match(/\\cite[pt]?\{([^}]*)$/);
      if (citeMatch) {
        const projectFiles = getProjectFiles();
        const bibFiles = projectFiles.filter(f => f.name && f.name.endsWith('.bib') && typeof f.content === 'string');
        
        bibFiles.forEach(file => {
          const regex = /@([a-zA-Z]+)\s*\{\s*([^,]+),([^@]*)/g;
          let match;
          while ((match = regex.exec(file.content)) !== null) {
            const key = match[2].trim();
            const body = match[3] || '';
            const titleMatch = body.match(/title\s*=\s*[\{"]([^"\}]+)[\}"]/i);
            const title = titleMatch ? titleMatch[1].trim() : '';

            suggestions.push({
              label: key,
              kind: monaco.languages.CompletionItemKind.Reference,
              insertText: key,
              detail: `BibTeX Reference: ${file.name}`,
              documentation: title || key,
              range
            });
          }
        });

        return { suggestions };
      }

      // B. Check if inside \input{...} or \include{...}
      const inputMatch = textUntilPosition.match(/\\(?:input|include)\{([^}]*)$/);
      if (inputMatch) {
        const projectFiles = getProjectFiles();
        const activeName = getActiveFileName();
        
        projectFiles
          .filter(f => f.name && f.name.endsWith('.tex') && f.name !== activeName && !f.isMain)
          .forEach(f => {
            const path = f.folder ? `${f.folder}/${f.name.replace(/\.tex$/, '')}` : f.name.replace(/\.tex$/, '');
            suggestions.push({
              label: path,
              kind: monaco.languages.CompletionItemKind.File,
              insertText: path,
              detail: `Project Sub-file (${f.name})`,
              range
            });
          });

        return { suggestions };
      }

      // C. Check if inside \begin{...}
      const envMatch = textUntilPosition.match(/\\(?:begin|end)\{([^}]*)$/);
      if (envMatch) {
        const environments = [
          { name: 'itemize', detail: 'Bulleted list environment' },
          { name: 'enumerate', detail: 'Numbered list environment' },
          { name: 'tabular', detail: 'Tabular columns environment' },
          { name: 'center', detail: 'Centered block alignment' },
          { name: 'figure', detail: 'Floating figure container' },
          { name: 'minipage', detail: 'Inline column minipage' },
          { name: 'equation', detail: 'Numbered math equation' },
          { name: 'align*', detail: 'Multi-line aligned math' },
          { name: 'document', detail: 'Main document body' }
        ];

        environments.forEach(env => {
          suggestions.push({
            label: env.name,
            kind: monaco.languages.CompletionItemKind.Enum,
            insertText: env.name,
            detail: env.detail,
            range
          });
        });

        return { suggestions };
      }

      // D. Standard VS Code LaTeX Commands & Snippets
      const snippets = [
        {
          label: '\\section',
          insertText: '\\section{${1:Section Title}}\n${0}',
          detail: 'Section heading',
          doc: 'Create a numbered or unnumbered section header'
        },
        {
          label: '\\subsection',
          insertText: '\\subsection{${1:Subsection Title}}\n${0}',
          detail: 'Subsection heading'
        },
        {
          label: '\\subsubsection',
          insertText: '\\subsubsection{${1:Sub-subsection Title}}\n${0}',
          detail: 'Sub-subsection heading'
        },
        {
          label: '\\textbf',
          insertText: '\\textbf{${1:bold text}}${0}',
          detail: 'Bold text formatting'
        },
        {
          label: '\\textit',
          insertText: '\\textit{${1:italic text}}${0}',
          detail: 'Italic text formatting'
        },
        {
          label: '\\underline',
          insertText: '\\underline{${1:underlined text}}${0}',
          detail: 'Underlined text formatting'
        },
        {
          label: '\\texttt',
          insertText: '\\texttt{${1:monospace text}}${0}',
          detail: 'Typewriter / code monospace font'
        },
        {
          label: '\\href',
          insertText: '\\href{${1:https://url}}{${2:link text}}${0}',
          detail: 'Clickable hyperlink'
        },
        {
          label: '\\url',
          insertText: '\\url{${1:https://url}}${0}',
          detail: 'Verbatim web URL'
        },
        {
          label: '\\item',
          insertText: '\\item ${1:item text}',
          detail: 'List bullet item'
        },
        {
          label: '\\begin{itemize}',
          insertText: '\\begin{itemize}\n\t\\item ${1:First item}\n\\end{itemize}${0}',
          detail: 'Bulleted list'
        },
        {
          label: '\\begin{enumerate}',
          insertText: '\\begin{enumerate}\n\t\\item ${1:First item}\n\\end{enumerate}${0}',
          detail: 'Numbered list'
        },
        {
          label: '\\begin{tabular}',
          insertText: '\\begin{tabular}{${1:l c r}}\n\t${2:col1} & ${3:col2} & ${4:col3} \\\\\n\\end{tabular}${0}',
          detail: 'Tabular columns'
        },
        {
          label: '\\begin{minipage}',
          insertText: '\\begin{minipage}{${1:\\linewidth}}\n\t${0}\n\\end{minipage}',
          detail: 'Minipage inline block'
        },
        {
          label: '\\begin{equation}',
          insertText: '\\begin{equation}\n\t${1:E = mc^2}\n\\end{equation}${0}',
          detail: 'Numbered math equation'
        },
        {
          label: '\\resumeItem',
          insertText: '\\resumeItem{${1:Accomplished [X] as measured by [Y], by doing [Z].}}${0}',
          detail: 'Google XYZ Resume bullet point'
        },
        {
          label: '\\resumeSubheading',
          insertText: '\\resumeSubheading\n\t{${1:Software Engineer Intern}}{${2:May 2026 -- Aug 2026}}\n\t{${3:Company Name}}{${4:City, ST}}${0}',
          detail: 'Role / School subheading block'
        },
        {
          label: '\\resumeProjectHeading',
          insertText: '\\resumeProjectHeading\n\t{\\textbf{${1:Project Name}} $|$ \\emph{${2:Tech Stack}}}{${3:Jan 2026}}\n\t\\resumeItemListStart\n\t\t\\resumeItem{${4:Accomplishment}}\n\t\\resumeItemListEnd${0}',
          detail: 'Portfolio project entry'
        },
        {
          label: '\\resumeItemListStart',
          insertText: '\\resumeItemListStart\n\t\\resumeItem{${1}}\n\\resumeItemListEnd${0}',
          detail: 'Wrap resume bullet points'
        },
        {
          label: '\\cite',
          insertText: '\\cite{${1:key}}${0}',
          detail: 'BibTeX citation reference'
        },
        {
          label: '\\input',
          insertText: '\\input{${1:sections/filename}}${0}',
          detail: 'Include external TeX sub-file'
        },
        {
          label: '\\usepackage',
          insertText: '\\usepackage{${1:package}}${0}',
          detail: 'Load package'
        },
        {
          label: '\\documentclass',
          insertText: '\\documentclass[${1:letterpaper,10pt}]{${2:article}}\n${0}',
          detail: 'Document class header'
        },
        {
          label: '\\frac',
          insertText: '\\frac{${1:numerator}}{${2:denominator}}${0}',
          detail: 'Math fraction'
        },
        {
          label: '\\sum',
          insertText: '\\sum_{${1:i=1}}^{${2:n}}${0}',
          detail: 'Math summation'
        },
        {
          label: '\\newpage',
          insertText: '\\newpage\n${0}',
          detail: 'Page break'
        }
      ];

      snippets.forEach(snip => {
        suggestions.push({
          label: snip.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snip.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: snip.detail,
          documentation: snip.doc || snip.detail,
          range
        });
      });

      return { suggestions };
    }
  });
}

