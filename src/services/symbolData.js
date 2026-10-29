// Overleaf Symbol Palette & LaTeX Quick-Insert Library

export const SYMBOL_CATEGORIES = [
  {
    category: 'Greek Letters',
    symbols: [
      { name: 'alpha', latex: '\\alpha', label: 'α' },
      { name: 'beta', latex: '\\beta', label: 'β' },
      { name: 'gamma', latex: '\\gamma', label: 'γ' },
      { name: 'delta', latex: '\\delta', label: 'δ' },
      { name: 'epsilon', latex: '\\epsilon', label: 'ϵ' },
      { name: 'zeta', latex: '\\zeta', label: 'ζ' },
      { name: 'eta', latex: '\\eta', label: 'η' },
      { name: 'theta', latex: '\\theta', label: 'θ' },
      { name: 'lambda', latex: '\\lambda', label: 'λ' },
      { name: 'mu', latex: '\\mu', label: 'μ' },
      { name: 'pi', latex: '\\pi', label: 'π' },
      { name: 'sigma', latex: '\\sigma', label: 'σ' },
      { name: 'tau', latex: '\\tau', label: 'τ' },
      { name: 'phi', latex: '\\phi', label: 'ϕ' },
      { name: 'omega', latex: '\\omega', label: 'ω' },
      { name: 'Gamma', latex: '\\Gamma', label: 'Γ' },
      { name: 'Delta', latex: '\\Delta', label: 'Δ' },
      { name: 'Theta', latex: '\\Theta', label: 'Θ' },
      { name: 'Lambda', latex: '\\Lambda', label: 'Λ' },
      { name: 'Sigma', latex: '\\Sigma', label: 'Σ' },
      { name: 'Omega', latex: '\\Omega', label: 'Ω' }
    ]
  },
  {
    category: 'Operators & Calculus',
    symbols: [
      { name: 'Fraction', latex: '\\frac{a}{b}', label: 'a/b' },
      { name: 'Square Root', latex: '\\sqrt{x}', label: '√x' },
      { name: 'Nth Root', latex: '\\sqrt[n]{x}', label: 'ⁿ√x' },
      { name: 'Summation', latex: '\\sum_{i=1}^{n} ', label: '∑' },
      { name: 'Integral', latex: '\\int_{a}^{b} ', label: '∫' },
      { name: 'Double Integral', latex: '\\iint ', label: '∬' },
      { name: 'Product', latex: '\\prod_{i=1}^{n} ', label: '∏' },
      { name: 'Partial', latex: '\\partial ', label: '∂' },
      { name: 'Nabla/Del', latex: '\\nabla ', label: '∇' },
      { name: 'Infinity', latex: '\\infty', label: '∞' },
      { name: 'Times', latex: '\\times ', label: '×' },
      { name: 'Divide', latex: '\\div ', label: '÷' },
      { name: 'Plus-Minus', latex: '\\pm ', label: '±' }
    ]
  },
  {
    category: 'Relations & Arrows',
    symbols: [
      { name: 'Less or Equal', latex: '\\le ', label: '≤' },
      { name: 'Greater or Equal', latex: '\\ge ', label: '≥' },
      { name: 'Not Equal', latex: '\\ne ', label: '≠' },
      { name: 'Approximate', latex: '\\approx ', label: '≈' },
      { name: 'Equivalent', latex: '\\equiv ', label: '≡' },
      { name: 'Right Arrow', latex: '\\rightarrow ', label: '→' },
      { name: 'Implies', latex: '\\implies ', label: '⟹' },
      { name: 'If and only if', latex: '\\iff ', label: '⟺' },
      { name: 'Element of', latex: '\\in ', label: '∈' },
      { name: 'Subset of', latex: '\\subset ', label: '⊂' },
      { name: 'For all', latex: '\\forall ', label: '∀' },
      { name: 'Exists', latex: '\\exists ', label: '∃' }
    ]
  },
  {
    category: 'Environments & Layout',
    symbols: [
      { 
        name: 'Equation Block', 
        latex: '\\begin{equation}\n  E = mc^2\n\\end{equation}\n', 
        label: 'Equation' 
      },
      { 
        name: 'Itemize List', 
        latex: '\\begin{itemize}\n  \\item First item\n  \\item Second item\n\\end{itemize}\n', 
        label: 'Bullet List' 
      },
      { 
        name: 'Enumerate List', 
        latex: '\\begin{enumerate}\n  \\item Step one\n  \\item Step two\n\\end{enumerate}\n', 
        label: 'Numbered List' 
      },
      { 
        name: 'Matrix (Parentheses)', 
        latex: '\\begin{pmatrix}\n  a & b \\\\\n  c & d\n\\end{pmatrix}', 
        label: 'Matrix' 
      },
      { 
        name: '2x2 Table', 
        latex: '\\begin{table}[h]\n\\centering\n\\begin{tabular}{|l|c|}\n\\hline\nItem & Value \\\\ \\hline\nA & 100 \\\\ \\hline\n\\end{tabular}\n\\end{table}\n', 
        label: 'Table' 
      },
      { 
        name: 'Figure', 
        latex: '\\begin{figure}[h]\n\\centering\n% \\includegraphics[width=0.8\\linewidth]{image.png}\n\\caption{Figure description}\n\\label{fig:example}\n\\end{figure}\n', 
        label: 'Figure' 
      }
    ]
  },
  {
    category: 'Formatting & Citations',
    symbols: [
      { name: 'Bold Text', latex: '\\textbf{text}', label: 'Bold' },
      { name: 'Italic Text', latex: '\\textit{text}', label: 'Italic' },
      { name: 'Code Font', latex: '\\texttt{code}', label: 'Monospace' },
      { name: 'Underline', latex: '\\underline{text}', label: 'Underline' },
      { name: 'Citation', latex: '\\cite{reference_key}', label: '\\cite' },
      { name: 'Reference', latex: '\\ref{fig:label}', label: '\\ref' },
      { name: 'Footnote', latex: '\\footnote{note content}', label: 'Footnote' }
    ]
  }
];
