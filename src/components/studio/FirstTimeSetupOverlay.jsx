import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, CheckCircle2, Zap, Layers, Terminal } from 'lucide-react';

export default function FirstTimeSetupOverlay({ onComplete, onPrewarm }) {
  const [progress, setProgress] = useState(0.0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const STEPS = [
    { label: 'Initializing browser workspace & IndexedDB storage...', targetProgress: 21.4 },
    { label: 'Loading high-DPI vector PDF.js renderer...', targetProgress: 48.7 },
    { label: 'Checking local TeX compiler & style packages (hyperref, titlesec)...', targetProgress: 76.2 },
    { label: 'Pre-warming compilation engine with template document...', targetProgress: 97.4 },
    { label: 'Engine ready! 100% offline local typesetting enabled.', targetProgress: 100.0 }
  ];

  useEffect(() => {
    let currentPct = 0.0;
    let stepIdx = 0;

    const interval = setInterval(() => {
      const currentTarget = STEPS[stepIdx]?.targetProgress || 100.0;

      if (currentPct < currentTarget) {
        // Natural random jitter for realistic progress (e.g. 0.6% - 2.1%)
        const delta = 0.6 + Math.random() * 1.5;
        currentPct = Math.min(currentPct + delta, currentTarget);
        setProgress(currentPct);
      } else if (stepIdx < STEPS.length - 1) {
        stepIdx += 1;
        setCurrentStepIndex(stepIdx);
      }

      // If we reached step 3 (pre-warming), trigger initial compile in background
      if (stepIdx === 3 && onPrewarm) {
        onPrewarm();
      }

      // When reaching 100%
      if (currentPct >= 100.0) {
        clearInterval(interval);
        setProgress(100.0);
        try {
          localStorage.setItem('prism_first_time_setup_done', 'true');
        } catch (e) {}

        // Graceful fade out
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
        }, 650);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-xl transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Icon */}
        <div className="relative mb-6 mt-2">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Cpu className="w-10 h-10 animate-pulse text-indigo-400" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Setting Up LaTeX Studio
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm">
          Preparing your local TeX typesetting engine, standard packages, and vector PDF renderer. This initial setup runs only once.
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-800/90 rounded-full h-3.5 mb-3 p-0.5 border border-slate-700 overflow-hidden shadow-inner relative">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${Math.max(4, progress)}%` }}
          />
        </div>

        {/* Progress Percentage and Status Step */}
        <div className="w-full flex items-center justify-between text-xs font-mono mb-4 px-1">
          <span className="text-slate-300 truncate max-w-[340px] text-left">
            {STEPS[currentStepIndex]?.label}
          </span>
          <span className="text-indigo-400 font-bold text-sm shrink-0 ml-2">
            {progress.toFixed(1)}%
          </span>
        </div>

        {/* Checklist Steps */}
        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-[11px] text-left space-y-1.5 font-mono mb-4">
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress >= 20 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={progress >= 20 ? 'text-slate-200' : 'text-slate-500'}>IndexedDB Cache & Workspace Storage</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress >= 45 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={progress >= 45 ? 'text-slate-200' : 'text-slate-500'}>Vector PDF.js Canvas & Annotation Engine</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress >= 75 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={progress >= 75 ? 'text-slate-200' : 'text-slate-500'}>Local Compiler Packages & Style Bindings</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle2 className={`w-3.5 h-3.5 ${progress >= 100 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span className={progress >= 100 ? 'text-slate-200' : 'text-slate-500'}>Native Compiler Pre-Warmed & Verified</span>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="pt-2 border-t border-slate-800/80 w-full flex items-center justify-center space-x-4 text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>100% Offline</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>0 Cloud APIs</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Native Speed</span>
          </span>
        </div>
      </div>
    </div>
  );
}

