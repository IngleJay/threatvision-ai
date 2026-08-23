document.addEventListener("DOMContentLoaded", async () => {
    const totalScans = document.getElementById("totalScans");
    const threatsDetected = document.getElementById("threatsDetected");
    const riskScore = document.getElementById("riskScore");
    const riskProgress = document.getElementById("riskProgress");
    const alerts = document.getElementById("alerts");
    const barLow = document.getElementById("barLow");
    const barMed = document.getElementById("barMed");
    const barHigh = document.getElementById("barHigh");
    const barCrit = document.getElementById("barCrit");

    async function loadData() {
        try {
            const [statsRes, alertsRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/alerts')
            ]);

            let scans = Number(localStorage.getItem("scans") || 0);
            let threats = Number(localStorage.getItem("threats") || 0);
            let currentRisk = "LOW";
            let counts = { low: 0, medium: 0, high: 0, critical: 0 };

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                if (statsData.success && statsData.data) {
                    scans = statsData.data.totalScans;
                    threats = statsData.data.threatsDetected;
                    currentRisk = statsData.data.currentRisk;
                    counts = statsData.data.severityDistribution || counts;
                }
            }

            if (totalScans) totalScans.innerText = scans;
            if (threatsDetected) threatsDetected.innerText = threats;
            if (riskScore) {
                riskScore.innerText = currentRisk;
                if (currentRisk === "CRITICAL") riskScore.style.color = "#ff3158";
                else if (currentRisk === "HIGH") riskScore.style.color = "#ff841f";
                else if (currentRisk === "MEDIUM") riskScore.style.color = "#ffd000";
                else riskScore.style.color = "#00ff9d";
            }

            if (riskProgress) {
                riskProgress.style.width = currentRisk === "CRITICAL" ? "100%" : currentRisk === "HIGH" ? "75%" : currentRisk === "MEDIUM" ? "45%" : "20%";
                riskProgress.style.background = currentRisk === "CRITICAL" ? "#ff3158" : currentRisk === "HIGH" ? "#ff841f" : currentRisk === "MEDIUM" ? "#ffd000" : "#00ff9d";
            }

            // Update bars
            const max = Math.max(1, counts.low, counts.medium, counts.high, counts.critical);
            if (barLow) barLow.style.height = `${Math.max(20, Math.min(180, (counts.low / max) * 160))}px`;
            if (barMed) barMed.style.height = `${Math.max(20, Math.min(180, (counts.medium / max) * 160))}px`;
            if (barHigh) barHigh.style.height = `${Math.max(20, Math.min(180, (counts.high / max) * 160))}px`;
            if (barCrit) barCrit.style.height = `${Math.max(20, Math.min(180, (counts.critical / max) * 160))}px`;

            if (alertsRes.ok) {
                const alertsData = await alertsRes.json();
                if (alertsData.success && alertsData.alerts && alertsData.alerts.length > 0) {
                    alerts.innerHTML = alertsData.alerts.map(a => `
                        <li style="display:flex; align-items:center; gap:12px; margin-top:10px; padding:12px; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);">
                            <span style="color:${a.severity === 'CRITICAL' || a.severity === 'HIGH' ? '#ff3158' : '#00ff9d'}; font-size:16px;">
                                ${a.severity === 'CRITICAL' || a.severity === 'HIGH' ? '⚠️' : '✓'}
                            </span>
                            <div style="flex:1;">
                                <strong style="display:block; font-size:11px; color:#fff;">${a.title}</strong>
                                <span style="display:block; font-size:9px; color:#7189a3; margin-top:2px;">${a.description}</span>
                            </div>
                            <small style="color:${a.severity === 'CRITICAL' || a.severity === 'HIGH' ? '#ff3158' : '#00ff9d'}; font-size:8px; font-weight:bold;">
                                ${a.severity}
                            </small>
                        </li>
                    `).join("");
                }
            }
        } catch (err) {
            console.warn("Telemetry sync notice:", err);
        }
    }

    loadData();
    setInterval(loadData, 5000);
});
