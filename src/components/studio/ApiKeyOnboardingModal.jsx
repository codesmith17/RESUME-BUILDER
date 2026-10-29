import React, { useState } from 'react';
import { Sparkles, Key, ExternalLink, ArrowRight, ShieldCheck, Zap, Info, Check } from 'lucide-react';
import { 
  setProviderKey, 
  setSelectedProvider, 
  AI_PROVIDERS, 
  AI_PROVIDER_CONFIGS 
} from '../../services/aiService';

export default function ApiKeyOnboardingModal({ isOpen, onComplete }) {
  const [selectedProvider, setProvider] = useState(AI_PROVIDERS.GROQ);
  const [apiKey, setApiKey] = useState('');
  const [step, setStep] = useState('prompt'); // 'prompt' | 'disabled_notice'

  if (!isOpen) return null;

  const currentCfg = AI_PROVIDER_CONFIGS[selectedProvider] || AI_PROVIDER_CONFIGS[AI_PROVIDERS.GROQ];

  const handleSaveKey = (e) => {
    e?.preventDefault();
    if (apiKey.trim()) {
      setProviderKey(selectedProvider, apiKey.trim());
      setSelectedProvider(selectedProvider);
      localStorage.setItem('prism_ai_disabled', 'false');
      localStorage.setItem('prism_ai_onboarding_done', 'true');
      onComplete({ disabled: false, provider: selectedProvider });
    } else {
      // User clicked save without entering a key -> show disabled confirmation
      handleSkipAndDisable();
    }
  };

  const handleSkipAndDisable = () => {
    localStorage.setItem('prism_ai_disabled', 'true');
    localStorage.setItem('prism_ai_onboarding_done', 'true');
    setStep('disabled_notice');
  };

  const handleFinishDisabled = () => {
    onComplete({ disabled: true });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md select-none p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {step === 'prompt' ? (
          <>
            {/* Header Icon */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Connect Free AI Copilot (Optional)
                </h2>
                <p className="text-xs text-slate-400">
                  Enter a free API key to enable instant LaTeX auto-fixing & resume bullet rewrites
                </p>
              </div>
            </div>

            {/* Provider Chooser */}
            <div className="space-y-3 mb-5">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Select Your Free Provider:
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* Groq */}
                <button
                  type="button"
                  onClick={() => { setProvider(AI_PROVIDERS.GROQ); setApiKey(''); }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedProvider === AI_PROVIDERS.GROQ
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-semibold text-slate-200 text-xs">Groq Cloud</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">Recommended</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">350 tok/s &bull; Llama 3.3</div>
                </button>

                {/* Gemini */}
                <button
                  type="button"
                  onClick={() => { setProvider(AI_PROVIDERS.GEMINI); setApiKey(''); }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedProvider === AI_PROVIDERS.GEMINI
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-semibold text-slate-200 text-xs">Google Gemini</div>
                  <div className="text-[10px] text-blue-400 font-mono mt-0.5">1M Window</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">1,500 req/day free</div>
                </button>

                {/* Cerebras */}
                <button
                  type="button"
                  onClick={() => { setProvider(AI_PROVIDERS.CEREBRAS); setApiKey(''); }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedProvider === AI_PROVIDERS.CEREBRAS
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-semibold text-slate-200 text-xs">Cerebras</div>
                  <div className="text-[10px] text-purple-400 font-mono mt-0.5">1M tok/day</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">1,800 tok/s free</div>
                </button>
              </div>

              {/* API Key Input */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Paste {currentCfg.name} Key:</span>
                  </span>
                  {currentCfg.keyDocUrl && (
                    <a
                      href={currentCfg.keyDocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline flex items-center space-x-1 text-[11px]"
                    >
                      <span>Get free key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <input
                  type="password"
                  placeholder={`Paste ${currentCfg.name} API key (${currentCfg.keyPlaceholder || 'key'})...`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 px-3 py-2 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              {/* Informational Callout */}
              <div className="flex items-start space-x-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  Don't have a key? You can <strong>skip for now</strong>. The AI features will simply be disabled, and you can freely use the full LaTeX editor, live compilation, and PDF export without restrictions.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSkipAndDisable}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Skip & Disable AI
              </button>

              <button
                type="button"
                onClick={handleSaveKey}
                disabled={!apiKey.trim()}
                className={`px-5 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all shadow-md ${
                  apiKey.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Save Key & Enable AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Notice When User Skips */
          <div className="text-center py-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Info className="w-6 h-6 text-indigo-400" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              AI Assistant is Disabled
            </h3>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed max-w-sm mx-auto">
              No problem! You can use the full <strong>LaTeX Code Editor</strong>, <strong>Live Vector PDF Compiler</strong>, <strong>Project Explorer</strong>, <strong>Templates</strong>, and <strong>PDF/DOCX Exporters</strong> with zero limitations.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-6 text-left space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span className="font-semibold text-slate-200">What works 100% free offline:</span>
              </div>
              <p className="pl-5 text-slate-400">• Real TeX Engine typesetting (no network calls)</p>
              <p className="pl-5 text-slate-400">• VS Code Monaco LaTeX syntax highlighter & completions</p>
              <p className="pl-5 text-slate-400">• One-click PDF download & DOCX conversion</p>
              <p className="pl-5 text-indigo-400 mt-2 font-medium">💡 You can add an API key anytime by clicking the Settings (⚙️) icon.</p>
            </div>

            <button
              type="button"
              onClick={handleFinishDisabled}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-xl text-xs transition-all shadow-md"
            >
              Start Using LaTeX Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
