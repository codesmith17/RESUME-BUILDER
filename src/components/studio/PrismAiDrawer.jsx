import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Check, 
  RotateCcw, 
  Bot, 
  User, 
  Wand2, 
  Copy,
  Maximize2,
  Minimize2,
  ArrowRight,
  Code2,
  Cpu,
  ChevronDown,
  Key
} from 'lucide-react';
import { 
  executeAiTask, 
  offlineSmartAi,
  getSelectedProvider,
  setSelectedProvider,
  AI_PROVIDERS,
  AI_PROVIDER_CONFIGS
} from '../../services/aiService';

// Component to render chat messages with formatted code blocks and "Apply to Code" actions
function MessageBubble({ msg, onApplySnippet }) {
  const isBot = msg.role === 'assistant';
  const content = msg.content || '';

  // Parse markdown code blocks ```lang\ncode```
  const parts = [];
  const regex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: content.substring(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'latex',
      code: match[2].trim()
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', text: content.substring(lastIndex) });
  }

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`flex items-start space-x-2.5 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      {/* Avatar */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-xs ${
          isBot
            ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
            : 'bg-slate-700 text-slate-200'
        }`}
      >
        {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble Content */}
      <div
        className={`rounded-xl p-3 max-w-[92%] leading-relaxed text-xs ${
          isBot
            ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60 shadow-xs'
            : 'bg-indigo-600 text-white shadow-xs'
        }`}
      >
        <div className="space-y-2">
          {parts.map((part, pIdx) => {
            if (part.type === 'text') {
              return (
                <div key={pIdx} className="whitespace-pre-wrap font-sans">
                  {part.text}
                </div>
              );
            }

            // Interactive Code Block with "Apply to Code" Button
            return (
              <div 
                key={pIdx} 
                className="my-2 rounded-lg border border-indigo-500/40 bg-slate-950 overflow-hidden font-mono shadow-md"
              >
                {/* Code Header Toolbar */}
                <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between select-none">
                  <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Code2 className="w-3 h-3" />
                    <span>{part.lang || 'LaTeX Code'}</span>
                  </span>

                  <div className="flex items-center space-x-1.5">
                    {/* Primary Apply Button */}
                    <button
                      onClick={() => onApplySnippet(part.code)}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded font-medium text-[11px] shadow-xs transition-all"
                      title="Apply this LaTeX code directly into your document and recompile"
                    >
                      <Check className="w-3 h-3" />
                      <span>Apply to Code</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(part.code, pIdx)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Copy Code"
                    >
                      {copiedIndex === pIdx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Code Preview */}
                <pre className="p-3 text-[11px] text-slate-200 overflow-x-auto max-h-60 leading-5 scrollbar-thin font-mono bg-slate-950">
                  <code>{part.code}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PrismAiDrawer({
  isOpen,
  onClose,
  currentCode = '',
  onApplyCode,
  mode,
  diagnostics = [],
  activeFileName,
  isAiDisabled = false,
  onOpenSettings
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hello! I am **Prism AI**, your LaTeX document engineer.\n\nI can directly edit your LaTeX document. Tell me what you'd like to change:\n• *"Update my role at YugabyteDB"* \n• *"Add a Certifications section with AWS and CKA"* \n• *"Rewrite bullet points using Google's XYZ formula"* \n• *"Fix line 35 syntax error"* \n\nClick any quick prompt below or type your instruction!`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [proposedCode, setProposedCode] = useState(null);
  const [diffExplanation, setDiffExplanation] = useState('');
  const [currentProvider, setCurrentProvider] = useState(getSelectedProvider());

  useEffect(() => {
    setCurrentProvider(getSelectedProvider());
  }, [isOpen]);

  const handleProviderChange = (e) => {
    const newProv = e.target.value;
    setCurrentProvider(newProv);
    setSelectedProvider(newProv);
  };

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    { label: '⚡ Google XYZ Bullets', action: 'resume_star', prompt: 'Rewrite the bullet points using Google\'s XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].' },
    { label: '🛠️ Auto-Fix Errors', action: 'fix_latex', prompt: 'Check all LaTeX environments, unescaped characters, and math delimiters, and auto-fix any syntax errors.' },
    { label: '📜 Add Certifications', action: 'general', prompt: 'Add an ATS-friendly Certifications section with AWS Solutions Architect and CKA.' },
    { label: '🚀 Add Portfolio Project', action: 'general', prompt: 'Add a new high-impact portfolio project heading with Rust, gRPC, and vector database bullet points.' },
    { label: '✨ Polish Tone', action: 'polish_academic', prompt: 'Polish the active section with formal academic phrasing and strong technical terminology.' },
    { label: '∑ Insert Formula', action: 'general', prompt: 'Add a clean LaTeX equation block with regularized loss function.' }
  ];

  // Core Smart Merge & Apply Engine
  const handleApplySnippet = (snippetToApply) => {
    if (!snippetToApply || !snippetToApply.trim()) return;

    const trimmed = snippetToApply.trim();
    let updatedCode = currentCode;

    // Case 1: Full Document Replacement (contains \documentclass or \begin{document} ... \end{document})
    if (trimmed.includes('\\documentclass') || (trimmed.includes('\\begin{document}') && trimmed.includes('\\end{document}'))) {
      updatedCode = trimmed;
    }
    // Case 2: Specific Section (e.g. \section{Certifications} or \section{Technical Skills})
    else if (trimmed.startsWith('\\section{')) {
      const sectionMatch = trimmed.match(/\\section\{([^}]+)\}/);
      if (sectionMatch) {
        const sectionTitle = sectionMatch[1].trim();
        // Escape special regex characters
        const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match existing section up to next \section or \end{document}
        const sectionRegex = new RegExp(`\\\\section\\{${escaped}\\}[\\s\\S]*?(?=\\\\section|\\\\end\\{document\\}|$)`, 'i');

        if (sectionRegex.test(updatedCode)) {
          // Replace existing section with updated section
          updatedCode = updatedCode.replace(sectionRegex, `${trimmed}\n\n`);
        } else if (updatedCode.includes('\\end{document}')) {
          // Append new section right before \end{document}
          updatedCode = updatedCode.replace('\\end{document}', `${trimmed}\n\n\\end{document}`);
        } else {
          updatedCode = `${updatedCode}\n\n${trimmed}`;
        }
      }
    }
    // Case 3: Resume Project or Bullet Item Snippet
    else if (trimmed.includes('\\resumeProjectHeading') || trimmed.includes('\\resumeItem')) {
      if (updatedCode.includes('\\section{Projects}')) {
        // Insert under Projects section
        updatedCode = updatedCode.replace(/(\\section\{Projects\}[\s\S]*?\\resumeSubHeadingListStart)/, `$1\n    ${trimmed}`);
      } else if (updatedCode.includes('\\end{document}')) {
        updatedCode = updatedCode.replace('\\end{document}', `${trimmed}\n\n\\end{document}`);
      } else {
        updatedCode = `${updatedCode}\n\n${trimmed}`;
      }
    }
    // Case 4: General Snippet -> Insert before \end{document} or append
    else {
      if (updatedCode.includes('\\end{document}')) {
        updatedCode = updatedCode.replace('\\end{document}', `${trimmed}\n\n\\end{document}`);
      } else {
        updatedCode = `${updatedCode}\n\n${trimmed}`;
      }
    }

    // Apply directly to parent editor state
    onApplyCode(updatedCode);
    setProposedCode(null);
    setDiffExplanation('');

    // Confirmation message in chat
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: '✅ **Applied changes directly to your LaTeX code & compiled preview!**'
      }
    ]);
  };

  const handleSend = async (userPromptText = inputPrompt, actionType = 'general') => {
    const textToSend = userPromptText.trim();
    if (!textToSend || loading) return;

    // Append user message
    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const systemInstruction = `You are Prism AI, an expert LaTeX document engineer and academic copilot.
Active file: ${activeFileName || 'resume.tex'}.

CURRENT DOCUMENT CODE:
\`\`\`latex
${currentCode.slice(0, 5000)}
\`\`\`

USER INSTRUCTION:
${textToSend}

DIAGNOSTICS/ERRORS:
${JSON.stringify(diagnostics.slice(0, 5))}

CRITICAL RULES:
1. Provide the revised or newly generated LaTeX code inside a fenced code block:
\`\`\`latex
... code here ...
\`\`\`
2. If modifying a section (e.g. Technical Skills, Projects, Certifications), provide the full clean \\section block so the user can click "Apply to Code" with 1-click.
3. If requested to rewrite bullets or fix syntax, output the clean valid LaTeX code.
4. Keep syntax standard, compilable with pdfLaTeX and XeLaTeX, and explain what you changed in 1 brief sentence.`;

      const aiResponseText = await executeAiTask({
        prompt: textToSend,
        systemInstruction,
        action: actionType,
        documentText: currentCode,
        context: { fileName: activeFileName, diagnostics }
      });

      // Extract code block for top banner if present
      const codeMatch = aiResponseText.match(/```(?:latex|tex)?\n([\s\S]*?)```/i);
      if (codeMatch && codeMatch[1].trim().length > 15) {
        setProposedCode(codeMatch[1].trim());
        setDiffExplanation(`Prism AI prepared changes based on: "${textToSend}"`);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseText }]);
    } catch (err) {
      console.error('Prism AI error:', err);
      const offlineFallback = offlineSmartAi(actionType, currentCode, { prompt: textToSend });
      setMessages(prev => [...prev, { role: 'assistant', content: offlineFallback }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${isExpanded ? 'w-[520px]' : 'w-96'} h-full bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 z-30 shadow-2xl select-none transition-all duration-200`}>
      {/* Drawer Header */}
      <div className="h-11 px-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-100 text-xs">Prism AI Copilot</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Quick Provider Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px]">
            <Cpu className="w-2.5 h-2.5 text-indigo-400" />
            <select
              value={currentProvider}
              onChange={handleProviderChange}
              className="bg-transparent text-slate-300 font-medium outline-none cursor-pointer text-[10px]"
              title="Change active AI engine"
            >
              <option value={AI_PROVIDERS.AUTO} className="bg-slate-900 text-slate-100">Auto (Cascade)</option>
              <option value={AI_PROVIDERS.GROQ} className="bg-slate-900 text-slate-100">Groq (Llama 3.3 / Qwen)</option>
              <option value={AI_PROVIDERS.CEREBRAS} className="bg-slate-900 text-slate-100">Cerebras (1M/day)</option>
              <option value={AI_PROVIDERS.GEMINI} className="bg-slate-900 text-slate-100">Google Gemini 1.5</option>
              <option value={AI_PROVIDERS.OPENROUTER} className="bg-slate-900 text-slate-100">OpenRouter (Free)</option>
              <option value={AI_PROVIDERS.GITHUB} className="bg-slate-900 text-slate-100">GitHub Models</option>
              <option value={AI_PROVIDERS.POLLINATIONS} className="bg-slate-900 text-slate-100">Pollinations (Zero-Key)</option>
              <option value={AI_PROVIDERS.CUSTOM_OPENAI} className="bg-slate-900 text-slate-100">Custom OpenAI / Ollama</option>
              <option value={AI_PROVIDERS.OFFLINE} className="bg-slate-900 text-slate-100">Offline Regex Engine</option>
            </select>
          </div>

          {/* Expand / Minimize Width */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title={isExpanded ? 'Collapse width' : 'Expand width for code diffs'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title="Close AI Copilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Disabled Notification Banner */}
      {isAiDisabled && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 p-3 text-xs">
          <div className="flex items-start space-x-2.5">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
              <Key className="w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-200 text-xs">AI Assistant is Disabled</p>
              <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                You skipped adding an API key during setup. You can still use the complete LaTeX Editor, Live Native Compiler, Citations, and Export features.
              </p>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="mt-2 text-[11px] px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-medium border border-amber-500/40 transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Add Key & Enable AI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Proposed Revision Banner */}
      {proposedCode && (
        <div className="bg-indigo-950/90 border-b border-indigo-500/50 p-3 text-xs shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-indigo-200 flex items-center space-x-1">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ready to Update Document</span>
            </span>
          </div>
          <p className="text-slate-300 text-[11px] mb-2">{diffExplanation}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleApplySnippet(proposedCode)}
              className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Code & Compile</span>
            </button>
            <button
              onClick={() => {
                setProposedCode(null);
                setDiffExplanation('');
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 select-text text-xs">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            msg={msg}
            onApplySnippet={handleApplySnippet}
          />
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-indigo-400 text-xs py-2 bg-slate-950/40 p-2.5 rounded-lg border border-indigo-500/20">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="font-medium">Prism AI is thinking and generating LaTeX code...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/60 flex flex-wrap gap-1.5 select-none">
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.prompt, chip.action)}
            disabled={loading}
            className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/90 hover:bg-indigo-900/60 hover:text-indigo-200 hover:border-indigo-500/50 text-slate-300 border border-slate-700/80 transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Prompt Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask AI to edit, add, or rewrite LaTeX..."
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 px-3 py-2 rounded-lg outline-none placeholder:text-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center justify-center shadow-xs"
          title="Send to Prism AI"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
