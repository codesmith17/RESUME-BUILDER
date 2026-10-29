import React, { useState, useEffect } from 'react';
import { Settings, X, Key, Cpu, Zap, ExternalLink, Check, ShieldCheck } from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  getSelectedProvider, 
  setSelectedProvider,
  AI_PROVIDERS 
} from '../../services/aiService';

export default function SettingsModal({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  autoCompileDelay,
  setAutoCompileDelay
}) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('auto');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setProvider(getSelectedProvider());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setSelectedProvider(provider);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100 text-sm">Studio Settings & Free AI Engine</h2>
              <p className="text-[11px] text-slate-400">100% Free AI copilot configuration (0 Rupees spent)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
          {/* Free AI Engine Section */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>AI Engine Provider</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                100% Free Tier
              </span>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              PrismTeX utilizes a multi-tier free model pipeline. Even without an API key, the built-in Pollinations AI and offline heuristic engine will assist you with zero costs.
            </p>

            {/* Provider Selector */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setProvider('auto')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  provider === 'auto'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-slate-200">Auto (Recommended)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Gemini Free &rarr; Pollinations &rarr; Offline</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider(AI_PROVIDERS.POLLINATIONS)}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  provider === AI_PROVIDERS.POLLINATIONS
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-slate-200">Pollinations AI</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zero-key &middot; Mistral / Llama 3</div>
              </button>
            </div>

            {/* Optional Gemini Key */}
            <div className="pt-2">
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Google Gemini API Key (Optional Free Key):</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center space-x-1 text-[11px]"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="password"
                  placeholder="Paste Gemini API key (or leave blank to use free fallback)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 pl-8 pr-3 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Editor Preferences */}
          <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="font-semibold text-slate-300">Editor & Compilation Preferences</h3>

            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">LaTeX Font Size:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-28 accent-indigo-500"
                />
                <span className="font-mono text-slate-300 w-8 text-right">{fontSize}px</span>
              </div>
            </div>

            {/* Auto Compile */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Live Recompile Debounce:</span>
              <select
                value={autoCompileDelay}
                onChange={(e) => setAutoCompileDelay(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
              >
                <option value="300">Fast (300ms)</option>
                <option value="600">Balanced (600ms)</option>
                <option value="1500">Relaxed (1500ms)</option>
                <option value="0">Manual Only (Ctrl+Enter)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center space-x-1.5 shadow-md transition-colors"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
