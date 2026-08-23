import React from 'react';
import { Shield, Activity, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'scanner';
  onSelectTab: (tab: 'landing' | 'dashboard' | 'scanner') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <nav className="sticky top-0 z-40 h-16 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-slate-800 bg-[#0F172A]/85 backdrop-blur-xl transition-colors">
      {/* Brand */}
      <div 
        onClick={() => onSelectTab('landing')}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)] group-hover:scale-105 group-hover:border-indigo-400 transition-all duration-200">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-1">
            ThreatVision <span className="text-indigo-400 font-extrabold">SOC</span>
          </div>
          <div className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase hidden sm:block">
            Cybersecurity Threat Intelligence
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onSelectTab('landing')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 ${
            currentTab === 'landing'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 ${
            currentTab === 'dashboard'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Dashboard
        </button>

        <button
          onClick={() => onSelectTab('scanner')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 ${
            currentTab === 'scanner'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Threat Scanner
        </button>
      </div>

      {/* Right: Operational Status & Fast Action */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-850/80 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
          <div className="text-left">
            <span className="block text-[9px] font-semibold tracking-wider text-slate-400">ENGINE</span>
            <span className="block text-[10px] font-bold text-emerald-400 leading-none">OPERATIONAL</span>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('scanner')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_2px_10px_rgba(99,102,241,0.25)] transition-all duration-150"
        >
          <Sparkles className="w-3.5 h-3.5" /> Scan Target
        </button>
      </div>
    </nav>
  );
};


