import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Key, 
  Cpu, 
  Zap, 
  ExternalLink, 
  Check, 
  Sparkles,
  Server,
  Layers
} from 'lucide-react';
import { 
  getSelectedProvider, 
  setSelectedProvider,
  getProviderKey,
  setProviderKey,
  getCustomEndpointConfig,
  setCustomEndpointConfig,
  AI_PROVIDERS,
  AI_PROVIDER_CONFIGS
} from '../../services/aiService';

export default function SettingsModal({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  autoCompileDelay,
  setAutoCompileDelay
}) {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'editor'
  const [provider, setProvider] = useState('auto');
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [cerebrasKey, setCerebrasKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [customConfig, setCustomConfig] = useState({
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3',
    apiKey: ''
  });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProvider(getSelectedProvider());
      setGeminiKey(getProviderKey(AI_PROVIDERS.GEMINI));
      setGroqKey(getProviderKey(AI_PROVIDERS.GROQ));
      setCerebrasKey(getProviderKey(AI_PROVIDERS.CEREBRAS));
      setOpenrouterKey(getProviderKey(AI_PROVIDERS.OPENROUTER));
      setGithubToken(getProviderKey(AI_PROVIDERS.GITHUB));
      setCustomConfig(getCustomEndpointConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSelectedProvider(provider);
    setProviderKey(AI_PROVIDERS.GEMINI, geminiKey);
    setProviderKey(AI_PROVIDERS.GROQ, groqKey);
    setProviderKey(AI_PROVIDERS.CEREBRAS, cerebrasKey);
    setProviderKey(AI_PROVIDERS.OPENROUTER, openrouterKey);
    setProviderKey(AI_PROVIDERS.GITHUB, githubToken);
    setCustomEndpointConfig(customConfig);

    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100 text-sm">Studio Settings & Multi-AI Config</h2>
              <p className="text-[11px] text-slate-400">Configure free AI providers, keys, and editor behavior</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'ai'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Providers & Keys</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'editor'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Editor & Compiler</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {activeTab === 'ai' && (
            <div className="space-y-4">
              {/* Active Provider Selector */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Active AI Provider</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Auto Fallback Enabled
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.AUTO)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.AUTO
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Auto Cascade</span>
                      <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1 rounded">Smart</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">Groq &rarr; Cerebras &rarr; Gemini &rarr; Free</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.GROQ)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.GROQ
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Groq Cloud</span>
                      <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1 rounded">Ultra-Fast</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Llama 3.3 / Qwen (350 tok/s)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.CEREBRAS)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.CEREBRAS
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Cerebras</span>
                      <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1 rounded">1M tok/day</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Llama 3.3 (1,800 tok/s)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.GEMINI)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.GEMINI
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Google Gemini</span>
                      <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1 rounded">1M Window</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Gemini 1.5 Flash (1500 req/day)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.OPENROUTER)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.OPENROUTER
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>OpenRouter</span>
                      <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1 rounded">Free Tags</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">DeepSeek & Qwen Coder</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.POLLINATIONS)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.POLLINATIONS
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Pollinations</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">Zero-Key</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">100% Free Public Endpoint</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.CUSTOM_OPENAI)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.CUSTOM_OPENAI
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Custom OpenAI</span>
                      <span className="text-[9px] text-slate-400 bg-slate-800 px-1 rounded">Ollama</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Self-hosted / Any Endpoint</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.GITHUB)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.GITHUB
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>GitHub Models</span>
                      <span className="text-[9px] text-violet-400 bg-violet-500/10 px-1 rounded">PAT</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">GPT-4o via Personal Token</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider(AI_PROVIDERS.OFFLINE)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      provider === AI_PROVIDERS.OFFLINE
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Offline Engine</span>
                      <span className="text-[9px] text-slate-400 bg-slate-800 px-1 rounded">0ms</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Regex & STAR rules (no net)</div>
                  </button>
                </div>
              </div>

              {/* Free API Keys Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Free Provider Keys (Optional)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Stored locally in your browser</span>
                </div>

                {/* Groq Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">Groq API Key (Llama 3.3 70B & Qwen Coder)</span>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                  />
                </div>

                {/* Cerebras Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">Cerebras API Key (1,000,000 tokens/day Free)</span>
                    <a
                      href="https://cloud.cerebras.ai"
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="csk_..."
                    value={cerebrasKey}
                    onChange={(e) => setCerebrasKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                  />
                </div>

                {/* Google Gemini Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">Google Gemini Key (1,500 requests/day Free)</span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                  />
                </div>

                {/* OpenRouter Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">OpenRouter Key (Free Models Catalog)</span>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="sk-or-v1-..."
                    value={openrouterKey}
                    onChange={(e) => setOpenrouterKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                  />
                </div>

                {/* GitHub Personal Access Token */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">GitHub Token (Free GPT-4o & Llama via GitHub Models)</span>
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Create Token</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Custom OpenAI / Ollama Endpoint Configuration */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                    <Server className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Custom OpenAI / Local Ollama Endpoint</span>
                  </span>
                  <span className="text-[10px] text-slate-400">OpenAI compatible</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="text-slate-400 block mb-1">Base URL:</label>
                    <input
                      type="text"
                      placeholder="http://localhost:11434/v1"
                      value={customConfig.baseUrl}
                      onChange={(e) => setCustomConfig({ ...customConfig, baseUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Model Name:</label>
                    <input
                      type="text"
                      placeholder="llama3 or mistral"
                      value={customConfig.model}
                      onChange={(e) => setCustomConfig({ ...customConfig, model: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Custom API Key (Optional for local):</label>
                  <input
                    type="password"
                    placeholder="Leave empty if local Ollama does not require auth"
                    value={customConfig.apiKey}
                    onChange={(e) => setCustomConfig({ ...customConfig, apiKey: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="font-semibold text-slate-200">Editor & Live Recompile Preferences</h3>

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
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                >
                  <option value="300">Fast (300ms)</option>
                  <option value="600">Balanced (600ms)</option>
                  <option value="1500">Relaxed (1500ms)</option>
                  <option value="0">Manual Only (Ctrl+Enter / Save)</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
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
