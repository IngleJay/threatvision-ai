import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Search, 
  Terminal as TerminalIcon, 
  Globe, 
  FileSearch, 
  BarChart3, 
  Radio, 
  Server, 
  Sparkles, 
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';
import { SecurityStats } from '../types';

interface LandingViewProps {
  onNavigate: (tab: 'dashboard' | 'scanner') => void;
  stats: SecurityStats;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, stats }) => {
  const [animatedThreatCount, setAnimatedThreatCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = stats.threatsDetected > 0 ? stats.threatsDetected : 12845;
    const duration = 1500;
    const increment = Math.ceil(end / (duration / 25));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedThreatCount(end);
        clearInterval(timer);
      } else {
        setAnimatedThreatCount(start);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [stats.threatsDetected]);

  return (
    <div className="space-y-24 pb-20">
      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="pt-8 md:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            SECURITY DETECTION ENGINE ONLINE
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-sky-400">
              Cybersecurity
            </span>
            <br />
            Threat Detection Platform
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Detect suspicious activities, investigate security threats, analyze binary files & system logs, and query real-time threat intelligence with ThreatVision.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('scanner')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)] transition-all duration-200 flex items-center gap-2.5 group"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" /> Start Threat Scan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 hover:border-slate-600 transition-all duration-200 flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-indigo-400" />
              View Live Dashboard
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Heuristic File & Log Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>AbuseIPDB Threat Intelligence</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Anomaly Triage</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: Terminal & Radar */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-float">
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366F1]" />
                <span className="text-slate-300 font-semibold tracking-wide">THREATVISION CORE ENGINE</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </div>
            </div>

            {/* Terminal Lines */}
            <div className="space-y-2 font-mono text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span><span className="text-indigo-400">&gt;</span> Initializing heuristics...</span>
                <span className="text-emerald-400 font-semibold">OK</span>
              </div>
              <div className="flex items-center justify-between">
                <span><span className="text-indigo-400">&gt;</span> AbuseIPDB feeds link...</span>
                <span className="text-emerald-400 font-semibold">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span><span className="text-indigo-400">&gt;</span> IOC extraction engine...</span>
                <span className="text-indigo-400 font-semibold">ARMED</span>
              </div>
            </div>

            {/* Radar Visual Center */}
            <div className="my-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-44 h-44 rounded-full border border-indigo-500/20 flex items-center justify-center">
                <div className="absolute inset-4 rounded-full border border-indigo-500/15" />
                <div className="absolute inset-10 rounded-full border border-indigo-500/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-indigo-500/15" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-px bg-indigo-500/15" />
                </div>
                {/* Radar Sweep Line */}
                <div className="absolute w-1/2 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent top-1/2 left-1/2 origin-left animate-radar" />
                
                {/* Center Node */}
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  SOC
                </div>

                {/* Blips */}
                <div className="absolute top-8 right-10 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#F43F5E] animate-ping" />
                <div className="absolute bottom-10 left-8 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
                <div className="absolute top-16 left-12 w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
            </div>

            {/* Mini Metrics in Terminal */}
            <div className="grid grid-cols-2 gap-2.5 font-mono">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">DETECTION RATE</div>
                <div className="text-sm font-bold text-emerald-400">99.2%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">SYSTEM RISK</div>
                <div className="text-sm font-bold text-indigo-400">{stats.currentRisk}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          STATS GRID COUNTERS
      ========================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold tracking-wider">TOTAL DETECTIONS</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center text-xs font-bold">
              ⚠
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">
            {animatedThreatCount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Indicators & threats captured
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold tracking-wider">ACCURACY RATE</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold">
              🎯
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-300 mt-3 font-mono">
            {stats.detectionAccuracy}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Precision benchmark
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold tracking-wider">PROTECTED NODES</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
              🛡️
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">
            {stats.protectedSystems}+
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Enterprise endpoints protected
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold tracking-wider">CONTINUOUS OPS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold">
              ⏱️
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-3 font-mono">
            24/7/365
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Active surveillance & triage
          </div>
        </div>
      </section>

      {/* =========================================
          SECURITY CAPABILITIES
      ========================================= */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono font-semibold tracking-widest text-indigo-400 uppercase">
            Security Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Modern <span className="text-indigo-400">Cyber Defense</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            High-performance security tools engineered to investigate, analyze and neutralize potential cyber threats with accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500">01</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Heuristic Threat Scanner
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Deterministic rule matching identifying suspicious activity patterns, webshells, exploit payloads, and IOCs.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('scanner')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Launch Scanner <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500">02</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                Security Analytics
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Visualize security activity through interactive severity distribution charts, risk scores, and alert logs.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileSearch className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500">03</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Log & Payload Analysis
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Inspect raw server logs, script payloads, webshells, and binaries for heuristic threats with instant reports.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('scanner')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Upload Logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500">04</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                IP & URL Intelligence
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Lookup suspicious IP addresses, Tor nodes, malicious domains, and ASN data backed by AbuseIPDB feeds.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('scanner')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Check Targets <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          WORKFLOW SECTION
      ========================================= */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono font-semibold tracking-widest text-indigo-400 uppercase">
            Security Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Detect. <span className="text-indigo-400">Analyze.</span> Respond.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            ThreatVision seamlessly transforms suspicious inputs into actionable threat intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
            <div className="font-mono text-xs text-slate-500 font-semibold">STEP 01</div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center text-base font-bold">
              ↑
            </div>
            <h4 className="text-base font-bold text-white">Upload Data</h4>
            <p className="text-slate-400 text-xs">Upload system logs, binaries or enter an IP address/URL target.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
            <div className="font-mono text-xs text-slate-500 font-semibold">STEP 02</div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center text-base font-bold">
              ⚡
            </div>
            <h4 className="text-base font-bold text-white">Analyze</h4>
            <p className="text-slate-400 text-xs">Process inputs against threat signatures, heuristic rules, and intelligence feeds.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
            <div className="font-mono text-xs text-slate-500 font-semibold">STEP 03</div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center text-base font-bold">
              🔍
            </div>
            <h4 className="text-base font-bold text-white">Detect Threats</h4>
            <p className="text-slate-400 text-xs">Isolate Indicators of Compromise and calculate abuse confidence risk ratings.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
            <div className="font-mono text-xs text-slate-500 font-semibold">STEP 04</div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center text-base font-bold">
              🛡️
            </div>
            <h4 className="text-base font-bold text-white">Mitigate</h4>
            <p className="text-slate-400 text-xs">Review MITRE ATT&CK mappings, incident summaries, and firewall rules.</p>
          </div>
        </div>
      </section>

      {/* =========================================
          TECH STACK BADGES
      ========================================= */}
      <section className="space-y-8 border-t border-slate-800 pt-16">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-semibold tracking-widest text-indigo-400 uppercase">Engine Architecture</span>
          <h3 className="text-2xl font-bold text-white">Powered by Modern Security Architecture</h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto font-mono text-xs">
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-400" /> Heuristic Engine
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" /> AbuseIPDB Threat Feeds
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" /> Node.js & Express SOC Backend
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> React 19 & Vite
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> SHA-256 Hasher
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" /> MITRE ATT&CK Framework
          </div>
        </div>
      </section>

      {/* =========================================
          CTA BANNER
      ========================================= */}
      <section className="relative p-10 md:p-14 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(99,102,241,0.2)]">
          🛡️
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold tracking-widest text-indigo-400 uppercase">Ready to detect cyber threats?</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Start Your Threat Investigation
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Scan files, inspect URLs, and investigate anomalous network activity with real-time cybersecurity intelligence.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('scanner')}
            className="px-8 py-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2"
          >
            Launch Scanner Now <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-indigo-400" />
            View Live Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};


