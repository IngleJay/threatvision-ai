import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  ExternalLink, 
  Terminal, 
  Lock, 
  Hash,
  Flame,
  ArrowRight
} from 'lucide-react';
import { FileScanResponse, ThreatSeverity } from '../types';

interface FileScanReportProps {
  result: FileScanResponse;
  onInvestigateIP: (ip: string) => void;
}

export const FileScanReport: React.FC<FileScanReportProps> = ({ result, onInvestigateIP }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { file, fileSize, fileType, fileHash, riskLevel, riskScore, threatDetected, findings, extractedIOCs, intelligenceAssessment, aiAnalysis } = result;
  const assessment = intelligenceAssessment || aiAnalysis;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getSeverityBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOW': default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
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
THREATVISION FILE & PAYLOAD SECURITY REPORT
File: ${file} (${fileSize} bytes)
Type: ${fileType}
Timestamp: ${new Date().toISOString()}
=====================================================

RISK ASSESSMENT: ${riskLevel} (${riskScore}/100)
Verdict: ${threatDetected ? 'MALICIOUS / SUSPICIOUS INDICATORS IDENTIFIED' : 'CLEAN / NO ANOMALIES DETECTED'}

CRYPTOGRAPHIC HASHES:
- MD5: ${fileHash.md5}
- SHA-256: ${fileHash.sha256}

HEURISTIC FINDINGS (${findings.length}):
${findings.map((f, i) => `[Finding #${i + 1}] Rule: ${f.rule} [${f.severity}]\nDescription: ${f.description}\nMatched: ${f.matchedString || 'N/A'}`).join('\n\n')}

EXTRACTED INDICATORS OF COMPROMISE (IOCs):
- IP Addresses: ${extractedIOCs.ips.join(', ') || 'None'}
- URLs / Domains: ${extractedIOCs.urls.join(', ') || 'None'}
- CVE References: ${extractedIOCs.cves.join(', ') || 'None'}
- Email Addresses: ${extractedIOCs.emails.join(', ') || 'None'}

INTELLIGENCE & SECOPS REMEDIATION:
- Executive Summary: ${assessment?.executiveSummary || 'N/A'}
- Malware Hypothesis: ${assessment?.malwareFamilyHypothesis || 'N/A'}
- Remediation Steps:
${(assessment?.remediationSteps || []).map((s, i) => `  ${i + 1}. ${s}`).join('\n')}
`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file_scan_report_${file.replace(/[^a-zA-Z0-9_.-]/g, '_')}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border ${threatDetected ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'}`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">{file}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300 border border-slate-700">
                {(fileSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>File Format: {fileType || 'Text/Binary'}</span>
              <span>•</span>
              <span>Matched Heuristics: {findings.length}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport('txt')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export TXT</span>
          </button>

          <button
            onClick={() => exportReport('json')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Verdict & Score Banner */}
      <div className={`p-6 rounded-2xl border space-y-4 shadow-xl ${
        riskLevel === 'CRITICAL' 
          ? 'bg-gradient-to-br from-rose-950/40 via-red-950/20 to-slate-900 border-rose-500/40'
          : riskLevel === 'HIGH'
          ? 'bg-gradient-to-br from-orange-950/40 via-amber-950/20 to-slate-900 border-orange-500/40'
          : riskLevel === 'MEDIUM'
          ? 'bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-slate-900 border-amber-500/40'
          : 'bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-slate-900 border-emerald-500/40'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getSeverityBadge(riskLevel)}`}>
                {riskLevel} RISK VERDICT
              </span>
              {threatDetected ? (
                <span className="text-xs font-mono text-rose-300">⚠️ {findings.length} Threat Indicators</span>
              ) : (
                <span className="text-xs font-mono text-emerald-300">✓ Clean / Validated</span>
              )}
            </div>

            <h2 className="text-xl font-extrabold text-white">
              {threatDetected ? 'Suspicious or Malicious Artifacts Detected' : 'File Analysis Completed - Safe'}
            </h2>

            <p className="text-xs text-slate-300 max-w-xl">
              {result.message}
            </p>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
            <div className="text-center">
              <div className="text-3xl font-black font-mono" style={{ color: riskScore >= 75 ? '#F43F5E' : riskScore >= 50 ? '#FB923C' : riskScore >= 25 ? '#F59E0B' : '#10B981' }}>
                {riskScore}%
              </div>
              <div className="text-[9px] font-mono uppercase font-bold text-slate-400 mt-0.5">
                Threat Score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hashes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">MD5 Checksum:</span>
            <span className="text-slate-200 break-all">{fileHash.md5}</span>
          </div>
          <button 
            onClick={() => handleCopy(fileHash.md5, 'md5')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 ml-2 shrink-0 transition-colors"
            title="Copy MD5"
          >
            {copiedField === 'md5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">SHA-256 Checksum:</span>
            <span className="text-slate-200 break-all">{fileHash.sha256}</span>
          </div>
          <button 
            onClick={() => handleCopy(fileHash.sha256, 'sha256')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 ml-2 shrink-0 transition-colors"
            title="Copy SHA256"
          >
            {copiedField === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Heuristic Findings */}
      {findings.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Matched Heuristic Rules ({findings.length})</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Signature Verification</span>
          </div>

          <div className="space-y-3">
            {findings.map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-300 text-xs">{f.rule}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${getSeverityBadge(f.severity)}`}>
                    {f.severity}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{f.description}</p>
                {f.matchedString && (
                  <div className="p-2.5 rounded-lg bg-black/70 font-mono text-[11px] text-amber-300 break-all border-l-2 border-amber-500">
                    <span className="text-slate-500 text-[10px] block mb-0.5">Matched Signature Pattern:</span>
                    {f.matchedString}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted IOCs */}
      {(extractedIOCs.ips.length > 0 || extractedIOCs.urls.length > 0 || extractedIOCs.cves.length > 0) && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Extracted Indicators of Compromise (IOCs)</span>
            </h4>
            <span className="text-[10px] font-mono text-indigo-400">
              Click any IP to investigate in AbuseIPDB Scanner
            </span>
          </div>

          <div className="space-y-3">
            {/* IP Addresses */}
            {extractedIOCs.ips.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">IP Addresses ({extractedIOCs.ips.length}):</span>
                <div className="flex flex-wrap gap-2">
                  {extractedIOCs.ips.map((ip, i) => (
                    <button
                      key={i}
                      onClick={() => onInvestigateIP(ip)}
                      className="px-3 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-700/60 hover:border-indigo-400 text-indigo-200 text-xs font-mono flex items-center gap-2 transition-all shadow-sm group"
                      title="Investigate this IP in AbuseIPDB Checker"
                    >
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-bold">{ip}</span>
                      <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CVEs */}
            {extractedIOCs.cves.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Exploit Vulnerabilities ({extractedIOCs.cves.length}):</span>
                <div className="flex flex-wrap gap-2">
                  {extractedIOCs.cves.map((cve, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono font-bold">
                      🔥 {cve}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* URLs */}
            {extractedIOCs.urls.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Network URLs ({extractedIOCs.urls.length}):</span>
                <div className="flex flex-wrap gap-2">
                  {extractedIOCs.urls.map((u, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono truncate max-w-sm">
                      🔗 {u}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Intelligence & SecOps Remediation */}
      {assessment && (
        <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Threat Intelligence Summary</span>
            </div>
            {assessment.malwareFamilyHypothesis && (
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-indigo-300">
                {assessment.malwareFamilyHypothesis}
              </span>
            )}
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {assessment.executiveSummary}
          </p>

          {assessment.behavioralAnalysis && (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block">Behavioral Analysis:</span>
              <p>{assessment.behavioralAnalysis}</p>
            </div>
          )}

          {assessment.remediationSteps && assessment.remediationSteps.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="text-[10px] font-mono uppercase font-bold text-indigo-400">
                Recommended SecOps Remediation Actions:
              </div>
              <ul className="space-y-1.5">
                {assessment.remediationSteps.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
