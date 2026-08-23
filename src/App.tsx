import React, { useState, useEffect } from 'react';
import { CyberBackground } from './components/CyberBackground';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { ScannerView } from './components/ScannerView';
import { SecurityStats, ThreatAlert } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'scanner'>('landing');

  const [stats, setStats] = useState<SecurityStats>({
    totalScans: 0,
    threatsDetected: 0,
    currentRisk: 'LOW',
    detectionAccuracy: 99.2,
    protectedSystems: 542,
    uptime: "99.98%",
    severityDistribution: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }
  });

  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);

  // Fetch stats and alerts from server
  const fetchTelemetry = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/alerts')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        if (alertsData.success && alertsData.alerts) {
          setAlerts(alertsData.alerts);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch telemetry:", err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClearAlerts = async () => {
    try {
      await fetch('/api/alerts/clear', { method: 'POST' });
      setAlerts([]);
    } catch (err) {
      console.warn("Failed to clear alerts:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-slate-200 relative selection:bg-indigo-500 selection:text-white">
      <CyberBackground />

      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'landing' && (
          <LandingView
            onNavigate={(tab) => setCurrentTab(tab)}
            stats={stats}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            alerts={alerts}
            onNavigate={(tab) => setCurrentTab(tab)}
            onRefresh={fetchTelemetry}
            onClearAlerts={handleClearAlerts}
          />
        )}

        {currentTab === 'scanner' && (
          <ScannerView
            onScanCompleted={fetchTelemetry}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 py-8 px-4 sm:px-8 mt-auto backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <span className="text-indigo-400">🛡️</span> ThreatVision SOC
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-normal">Cybersecurity Threat Detection Platform</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            <span>SYSTEM ENGINES OPERATIONAL</span>
          </div>

          <div>
            © 2026 ThreatVision. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

