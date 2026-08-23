import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Radio, 
  RefreshCw, 
  Trash2, 
  Download, 
  FileText, 
  Search,
  Cpu,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import { SecurityStats, ThreatAlert, ThreatSeverity } from '../types';

interface DashboardViewProps {
  stats: SecurityStats;
  alerts: ThreatAlert[];
  onNavigate: (tab: 'scanner') => void;
  onRefresh: () => void;
  onClearAlerts: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  alerts,
  onNavigate,
  onRefresh,
  onClearAlerts
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | ThreatSeverity>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const getRiskColor = (risk: ThreatSeverity) => {
    switch (risk) {
      case 'CRITICAL': return '#F43F5E';
      case 'HIGH': return '#FB923C';
      case 'MEDIUM': return '#F59E0B';
      case 'LOW': default: return '#10B981';
    }
  };

  const getRiskBg = (risk: ThreatSeverity) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'LOW': default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const getSeverityHeight = (count: number) => {
    const max = Math.max(1, stats.severityDistribution.low, stats.severityDistribution.medium, stats.severityDistribution.high, stats.severityDistribution.critical);
    return Math.max(15, Math.min(100, Math.round((count / max) * 100)));
  };

  const handleExportReport = () => {
    const reportData = {
      platform: "ThreatVision AI Cybersecurity Report",
      generatedAt: new Date().toISOString(),
      systemStatus: {
        totalScans: stats.totalScans,
        threatsDetected: stats.threatsDetected,
        currentRisk: stats.currentRisk,
        accuracy: stats.detectionAccuracy
      },
      severityDistribution: stats.severityDistribution,
      alertsHistory: alerts
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ThreatVision_Security_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-semibold tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SECURITY COMMAND CENTER
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Security Intelligence <span className="text-indigo-400">Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs flex items-center gap-2 transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline font-semibold">Sync Data</span>
          </button>

          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_2px_12px_rgba(99,102,241,0.25)]"
          >
            <Download className="w-4 h-4" />
            Export SecOps Report
          </button>
        </div>
      </div>

      {/* =========================================
          KEY STATS CARDS
      ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Scans */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Total Scans
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
              ◉
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-4 font-mono">
            {stats.totalScans}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Security analyses performed
          </div>
        </div>

        {/* Threats Detected */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Threats Detected
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
              ⚠
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 mt-4 font-mono">
            {stats.threatsDetected}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Threat indicators identified
          </div>
        </div>

        {/* Current Risk */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Current Risk
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              ◈
            </div>
          </div>
          <div 
            className="text-3xl sm:text-4xl font-extrabold mt-4 font-mono"
            style={{ color: getRiskColor(stats.currentRisk) }}
          >
            {stats.currentRisk}
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: stats.currentRisk === 'CRITICAL' ? '100%' : stats.currentRisk === 'HIGH' ? '75%' : stats.currentRisk === 'MEDIUM' ? '45%' : '15%',
                backgroundColor: getRiskColor(stats.currentRisk),
                boxShadow: `0 0 10px ${getRiskColor(stats.currentRisk)}`
              }}
            />
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
              System Protection
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              ✓
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-4 font-mono">
            Secure
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            All monitoring services active
          </div>
        </div>
      </div>

      {/* =========================================
          ANALYTICS & PROTECTION SECTION
      ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Activity Bar Chart */}
        <div className="lg:col-span-7 p-7 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-semibold tracking-widest text-slate-400 uppercase">
                Threat Analytics
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Threat Severity Activity
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </div>
          </div>

          {/* Bar Distribution Graphic */}
          <div className="h-56 relative flex items-end justify-center gap-8 md:gap-14 pt-6 pb-2 border-b border-slate-800">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
            </div>

            {/* Low Bar */}
            <div className="flex flex-col items-center gap-2 group z-10">
              <div className="text-[10px] font-mono font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {stats.severityDistribution.low}
              </div>
              <div 
                className="w-10 rounded-t-md bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:brightness-125 transition-all duration-500"
                style={{ height: `${getSeverityHeight(stats.severityDistribution.low)}px` }}
              />
              <span className="text-[10px] font-mono font-semibold text-slate-400 mt-1">LOW</span>
            </div>

            {/* Medium Bar */}
            <div className="flex flex-col items-center gap-2 group z-10">
              <div className="text-[10px] font-mono font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {stats.severityDistribution.medium}
              </div>
              <div 
                className="w-10 rounded-t-md bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] group-hover:brightness-125 transition-all duration-500"
                style={{ height: `${getSeverityHeight(stats.severityDistribution.medium)}px` }}
              />
              <span className="text-[10px] font-mono font-semibold text-slate-400 mt-1">MED</span>
            </div>

            {/* High Bar */}
            <div className="flex flex-col items-center gap-2 group z-10">
              <div className="text-[10px] font-mono font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {stats.severityDistribution.high}
              </div>
              <div 
                className="w-10 rounded-t-md bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)] group-hover:brightness-125 transition-all duration-500"
                style={{ height: `${getSeverityHeight(stats.severityDistribution.high)}px` }}
              />
              <span className="text-[10px] font-mono font-semibold text-slate-400 mt-1">HIGH</span>
            </div>

            {/* Critical Bar */}
            <div className="flex flex-col items-center gap-2 group z-10">
              <div className="text-[10px] font-mono font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {stats.severityDistribution.critical}
              </div>
              <div 
                className="w-10 rounded-t-md bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.3)] group-hover:brightness-125 transition-all duration-500"
                style={{ height: `${getSeverityHeight(stats.severityDistribution.critical)}px` }}
              />
              <span className="text-[10px] font-mono font-semibold text-slate-400 mt-1">CRIT</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Threat severity distribution spectrum</span>
            <span className="text-emerald-400 font-semibold">● Continuous Telemetry</span>
          </div>
        </div>

        {/* Security Overview Gauge */}
        <div className="lg:col-span-5 p-7 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-semibold tracking-widest text-slate-400 uppercase">
              Security Overview
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              System Defense Status
            </h3>
          </div>

          {/* Radial Ring */}
          <div className="flex justify-center py-4">
            <div className="relative w-36 h-36 rounded-full flex items-center justify-center bg-slate-950/70 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
              <div className="absolute inset-2 rounded-full border border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="text-center">
                <div className="text-base font-extrabold text-emerald-400 tracking-wider font-mono">
                  SECURE
                </div>
                <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 font-mono">
                  ACTIVE 100%
                </div>
              </div>
            </div>
          </div>

          {/* Checklist items */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Threat surveillance
              </span>
              <strong className="text-emerald-400 font-mono text-[10px]">Active</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Heuristic analysis engine
              </span>
              <strong className="text-emerald-400 font-mono text-[10px]">Ready</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Threat intelligence feed
              </span>
              <strong className="text-emerald-400 font-mono text-[10px]">Connected</strong>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          RECENT SECURITY ALERTS LOG
      ========================================= */}
      <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-[10px] font-mono font-semibold tracking-widest text-slate-400 uppercase">
              Security Monitor
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Recent Security Alerts
            </h3>
          </div>

          {/* Severity Filters & Clear Button */}
          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                  filterSeverity === sev
                    ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}

            {alerts.length > 0 && (
              <button
                onClick={onClearAlerts}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-2"
                title="Clear alerts log"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? (
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                        ⚠
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-white font-semibold">
                        {alert.title}
                      </strong>
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold border ${getRiskBg(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                    {alert.target && (
                      <div className="text-[10px] font-mono text-indigo-400 mt-1.5">
                        Target: {alert.target}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono shrink-0 sm:self-center">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">No security alerts matching criteria</div>
              <p className="text-xs text-slate-400">
                ThreatVision AI is actively monitoring your security environment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          QUICK SCAN ACTION BANNER
      ========================================= */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-semibold tracking-widest text-indigo-400 uppercase">
              Security Analysis
            </div>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              Ready to investigate a threat?
            </h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xl">
              Scan a suspicious file, analyze binary entropy, or investigate an IP address and URL using threat intelligence feeds.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('scanner')}
          className="px-6 py-3.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.3)] transition-all flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          Start Security Scan <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

