import React, { useState } from 'react';
import { 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Terminal, 
  Download, 
  Filter, 
  Search, 
  Lock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { IPCheckResponse } from '../types';
import { getCategoryInfo, getCountryFlag, formatTimeAgo, formatExactUTC } from '../utils/abuseipdb';

interface AbuseIPDBReportProps {
  result: IPCheckResponse;
  onInvestigateTarget?: (target: string) => void;
}

export const AbuseIPDBReport: React.FC<AbuseIPDBReportProps> = ({ result, onInvestigateTarget }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [reportFilter, setReportFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, searchedInput, resolvedIP, reportWindow, intelligenceAssessment, aiAnalysis } = result;
  const assessment = intelligenceAssessment || aiAnalysis;
  const score = data.abuseConfidenceScore || 0;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const exportReport = (format: 'json' | 'txt') => {
    let content = '';
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (format === 'json') {
      content = JSON.stringify(result, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else {
      content = `=====================================================
ABUSEIPDB THREAT REPUTATION REPORT
Target: ${searchedInput} (Resolved IP: ${resolvedIP})
Date: ${new Date().toISOString()}
=====================================================

CONFIDENCE OF ABUSE SCORE: ${score}%
Risk Verdict: ${score >= 75 ? 'CRITICAL - HIGH CONFIDENCE MALICIOUS' : score >= 50 ? 'HIGH - SUSPICIOUS' : score >= 25 ? 'MEDIUM RISK' : 'CLEAN / BENIGN'}

TECHNICAL SPECIFICATIONS:
- IP Address: ${data.ipAddress}
- Hostname: ${data.domain || 'N/A'}
- ISP / Network: ${data.isp || 'N/A'}
- Usage Type: ${data.usageType || 'N/A'}
- Country: ${data.countryName || data.countryCode || 'N/A'} (${data.countryCode || ''})
- Tor Exit Node: ${data.isTor ? 'YES' : 'NO'}
- Total Reports: ${data.totalReports || 0}
- Distinct Reporters: ${data.numDistinctUsers || 0}
- Last Reported At: ${data.lastReportedAt ? formatExactUTC(data.lastReportedAt) : 'Never'}

ABUSE REPORTS HISTORY (${data.reports?.length || 0} recent entries):
${(data.reports || []).map((r, i) => `
[Report #${i + 1}]
- Date: ${formatExactUTC(r.reportedAt)} (${formatTimeAgo(r.reportedAt)})
- Reporter: Reporter #${r.reporterId || 'Anonymous'} (${r.reporterCountryName || r.reporterCountryCode || 'Unknown'})
- Categories: ${r.categories.map(c => getCategoryInfo(c).name).join(', ')}
- Log / Cause: ${r.comment || 'No comment provided'}
`).join('\n')}

INTELLIGENCE & SECOPS ACTIONS:
- Summary: ${assessment?.summary || 'N/A'}
- Threat Profile: ${assessment?.threatActorProfile || 'N/A'}
- MITRE ATT&CK: ${(assessment?.mitreTechniques || []).join(', ')}
- Recommended Action: ${assessment?.recommendedAction || 'N/A'}
`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abuseipdb_report_${resolvedIP}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Color mapping based on AbuseIPDB score
  const getScoreTheme = (val: number) => {
    if (val >= 75) {
      return {
        bg: 'from-rose-950/40 via-red-950/20 to-slate-900',
        border: 'border-rose-500/40',
        text: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        progressBg: 'bg-rose-500',
        verdict: 'Very High Confidence of Malicious Activity',
        icon: '🚨'
      };
    }
    if (val >= 50) {
      return {
        bg: 'from-orange-950/40 via-amber-950/20 to-slate-900',
        border: 'border-orange-500/40',
        text: 'text-orange-400',
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        progressBg: 'bg-orange-500',
        verdict: 'High Confidence of Abuse / Scanning Activity',
        icon: '⚠️'
      };
    }
    if (val >= 25) {
      return {
        bg: 'from-amber-950/40 via-yellow-950/20 to-slate-900',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        progressBg: 'bg-amber-500',
        verdict: 'Elevated Abuse History / Moderate Risk',
        icon: '⚡'
      };
    }
    return {
      bg: 'from-emerald-950/40 via-teal-950/20 to-slate-900',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      progressBg: 'bg-emerald-500',
      verdict: 'Clean / Whitelisted - No Significant Abuse Reports',
      icon: '✅'
    };
  };

  const theme = getScoreTheme(score);
  const reports = data.reports || [];

  // Filter reports
  const filteredReports = reports.filter(rep => {
    if (reportFilter !== 'ALL') {
      const catId = Number(reportFilter);
      if (!rep.categories.includes(catId)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComment = rep.comment?.toLowerCase().includes(q);
      const matchReporter = String(rep.reporterId).includes(q) || rep.reporterCountryName?.toLowerCase().includes(q);
      if (!matchComment && !matchReporter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">{searchedInput}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300 border border-slate-700">
                Resolved: {resolvedIP}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Investigation Window: {reportWindow} Days</span>
              <span>•</span>
              <span>Observed Reports: {data.totalReports || 0}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(resolvedIP, 'ip')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Copy IP Address"
          >
            {copiedField === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedField === 'ip' ? 'Copied' : 'Copy IP'}</span>
          </button>

          <button
            onClick={() => exportReport('txt')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Export full investigation as text"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export TXT</span>
          </button>

          <button
            onClick={() => exportReport('json')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Export full JSON telemetry"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          ABUSEIPDB CONFIDENCE SCORE GAUGE BANNER
      ========================================================= */}
      <div className={`p-6 sm:p-7 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} space-y-5 shadow-2xl`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Main Headline & Statement */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-sm backdrop-blur-md" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
              <span>{theme.icon}</span>
              <span className={theme.text}>ABUSEIPDB REPUTATION ASSESSMENT</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {score === 0 ? (
                <>This IP address has not been reported <span className="text-emerald-400 font-mono">(0% Confidence of Abuse)</span></>
              ) : (
                <>
                  This IP was reported <span className="text-white underline font-mono">{data.totalReports || reports.length}</span> times. Confidence of Abuse is <span className={`${theme.text} font-mono`}>{score}%</span>:
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {score >= 75
                ? 'High frequency malicious telemetry logged across multiple verified security sentinels. Immediate perimeter firewall blocking is strongly recommended.'
                : score >= 50
                ? 'Repeated suspicious connection attempts, port sweeps, or brute-force activities recorded in recent observation period.'
                : score > 0
                ? 'Low-to-moderate background reconnaissance or scanning activity observed. Maintain surveillance.'
                : 'No malicious complaints or abusive activities have been submitted for this IP address in the selected reporting timeframe.'}
            </p>
          </div>

          {/* Large Confidence Meter */}
          <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shrink-0">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight" style={{ color: score >= 75 ? '#F43F5E' : score >= 50 ? '#FB923C' : score >= 25 ? '#F59E0B' : '#10B981' }}>
                {score}%
              </div>
              <div className="text-[9px] font-mono uppercase font-bold text-slate-400 mt-1">
                Abuse Score
              </div>
            </div>

            <div className="w-24 space-y-1.5">
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${theme.progressBg}`} 
                  style={{ width: `${Math.max(score, 4)}%` }} 
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-400">
                <span>0% Clean</span>
                <span>100% Bad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Attribute Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${theme.badge}`}>
            Verdict: {theme.verdict}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
            Version: IPv{data.ipVersion || 4}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
            Public: {data.isPublic !== false ? 'Yes' : 'No'}
          </span>
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono border ${data.isTor ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
            Tor Node: {data.isTor ? 'YES (Exit Gateway)' : 'No'}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
            Distinct Reporters: {data.numDistinctUsers || 0}
          </span>
        </div>
      </div>

      {/* =========================================================
          TECHNICAL SPECIFICATIONS / DETAILS GRID
      ========================================================= */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              AbuseIPDB IP Technical Specifications
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Autonomous System & Geolocation Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono text-xs">
          
          {/* IP Address */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">IP Address</span>
            <div className="flex items-center justify-between">
              <strong className="text-indigo-300 text-sm">{data.ipAddress}</strong>
              <button 
                onClick={() => handleCopy(data.ipAddress, 'ip2')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Copy IP"
              >
                {copiedField === 'ip2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Reverse DNS / Hostnames */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Hostname / Reverse DNS</span>
            <div className="text-white text-xs truncate font-semibold" title={data.domain || 'None'}>
              {data.domain || data.hostnames?.[0] || 'No PTR Record'}
            </div>
          </div>

          {/* ISP & Autonomous System */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">ISP / Network Provider</span>
            <div className="text-white text-xs truncate font-semibold" title={data.isp || 'N/A'}>
              {data.isp || 'Unknown ISP'}
            </div>
          </div>

          {/* Usage Type */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Usage Type</span>
            <div className="text-slate-200 text-xs font-semibold">
              {data.usageType || 'Data Center / Web Hosting'}
            </div>
          </div>

          {/* Country / Location */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Country / Geolocation</span>
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <span className="text-base">{getCountryFlag(data.countryCode)}</span>
              <span>{data.countryName || 'Global'} ({data.countryCode || 'N/A'})</span>
            </div>
          </div>

          {/* Last Reported Time */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Last Reported At</span>
            <div className="text-xs font-semibold">
              {data.lastReportedAt || reports[0]?.reportedAt ? (
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span title={formatExactUTC(data.lastReportedAt || reports[0]?.reportedAt)}>
                    {formatTimeAgo(data.lastReportedAt || reports[0]?.reportedAt)}
                  </span>
                </div>
              ) : (
                <span className="text-emerald-400">Never Reported</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================
          THREAT INTELLIGENCE & MITRE ATT&CK INSIGHTS
      ========================================================= */}
      {assessment && (
        <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Cyber Threat Intelligence & SOC Profile</span>
            </div>
            {assessment.threatActorProfile && (
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-indigo-300">
                {assessment.threatActorProfile}
              </span>
            )}
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {assessment.summary}
          </p>

          {/* MITRE Techniques */}
          {assessment.mitreTechniques && assessment.mitreTechniques.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono uppercase font-semibold text-slate-400">
                Observed MITRE ATT&CK Techniques:
              </div>
              <div className="flex flex-wrap gap-2">
                {assessment.mitreTechniques.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] flex items-center gap-1.5">
                    <span className="text-indigo-400 font-bold">🛡️</span>
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended SecOps Action */}
          {assessment.recommendedAction && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-400 block uppercase text-[10px] mb-0.5">Recommended Containment Action:</strong>
                <span>{assessment.recommendedAction}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          ABUSE REPORTS HISTORY FEED (ABUSEIPDB STYLE)
      ========================================================= */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                Recent Abuse Complaints & Attack Logs
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Showing {filteredReports.length} of {reports.length} verified security sentinel reports in the past {reportWindow} days.
            </p>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs/reporters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>

            <select
              value={reportFilter}
              onChange={(e) => setReportFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-400"
            >
              <option value="ALL">All Categories</option>
              <option value="18">18: Brute-Force</option>
              <option value="22">22: SSH</option>
              <option value="14">14: Port Scan</option>
              <option value="15">15: Hacking</option>
              <option value="16">16: SQL Injection</option>
              <option value="4">4: DDoS Attack</option>
              <option value="7">7: Phishing</option>
              <option value="21">21: Web App Attack</option>
            </select>
          </div>
        </div>

        {/* Report List */}
        {filteredReports.length > 0 ? (
          <div className="space-y-3.5">
            {filteredReports.map((report, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 space-y-3 transition-all"
              >
                {/* Report Header: Reporter + Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300">
                      👤
                    </span>
                    <span className="font-bold text-slate-200">
                      Reporter #{report.reporterId || `ID-${idx + 1042}`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                      <span>{getCountryFlag(report.reporterCountryCode)}</span>
                      <span>{report.reporterCountryName || report.reporterCountryCode || 'Global'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-800/60 text-indigo-300 font-bold">
                      {formatTimeAgo(report.reportedAt)}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]" title="Exact UTC timestamp">
                      {formatExactUTC(report.reportedAt)}
                    </span>
                  </div>
                </div>

                {/* Categories Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {report.categories.map((catId) => {
                    const catInfo = getCategoryInfo(catId);
                    return (
                      <span 
                        key={catId} 
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border flex items-center gap-1 ${catInfo.color}`}
                        title={catInfo.description}
                      >
                        <span>{catInfo.icon}</span>
                        <span>{catInfo.id}: {catInfo.name}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Reason / Attack Log Cause Box */}
                {report.comment && (
                  <div className="relative group">
                    <div className="p-3 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap border-l-4 border-l-indigo-500">
                      {report.comment}
                    </div>
                    <button
                      onClick={() => handleCopy(report.comment || '', `rep-${idx}`)}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-mono flex items-center gap-1"
                      title="Copy attack log line"
                    >
                      {copiedField === `rep-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === `rep-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h5 className="text-sm font-bold text-white">No Matching Abuse Reports</h5>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {searchQuery || reportFilter !== 'ALL' 
                ? 'No complaints match the active category filter or keyword.' 
                : 'No malicious complaints or abusive activity has been reported for this host in the selected time window.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
