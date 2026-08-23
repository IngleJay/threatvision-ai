const fileInput = document.getElementById("fileInput");
const selectedFile = document.getElementById("selectedFile");
const scanBtn = document.getElementById("scanBtn");
const resultBox = document.getElementById("resultBox");
const ipInput = document.getElementById("ipInput");
const ageInput = document.getElementById("ageInput");
const ipCheckBtn = document.getElementById("ipCheckBtn");
const ipResultBox = document.getElementById("ipResultBox");

// Update file selection UI
if (fileInput) {
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            selectedFile.innerHTML = `<span class="file-status-dot"></span> Selected: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
        } else {
            selectedFile.innerHTML = `<span class="file-status-dot"></span> No file selected`;
        }
    });
}

// Handle File Scan
if (scanBtn) {
    scanBtn.addEventListener("click", async () => {
        if (!fileInput.files.length) {
            alert("Please select a file to scan.");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);

        scanBtn.innerText = "Scanning File...";
        scanBtn.disabled = true;
        resultBox.style.display = "block";
        resultBox.innerHTML = "<p>Analyzing heuristics, checksums, and AI threat profiles...</p>";

        try {
            const res = await fetch("/scan", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (!data.success) {
                resultBox.innerHTML = `<p class="danger-message">Error: ${data.message || 'Scan failed'}</p>`;
                return;
            }

            const isThreat = data.threatDetected;
            let findingsHtml = "";
            if (data.findings && data.findings.length > 0) {
                findingsHtml = data.findings.map(f => `
                    <div style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 6px;">
                        <strong style="color: #00d9ff;">${f.rule}</strong> - <span style="color: #ff3158;">${f.severity}</span>
                        <p style="color: #8ca5bd; font-size: 11px; margin-top: 3px;">${f.description}</p>
                    </div>
                `).join("");
            }

            resultBox.innerHTML = `
                <div class="${isThreat ? 'danger-message' : 'success-message'}" style="font-size: 16px; margin-bottom: 10px;">
                    ${isThreat ? '⚠ Threat Detected' : '✓ File Safe'} (Risk: ${data.riskLevel} - ${data.riskScore}%)
                </div>
                <p><strong>File:</strong> ${data.file}</p>
                <p><strong>MD5:</strong> <code style="color: #00d9ff;">${data.fileHash.md5}</code></p>
                <p><strong>SHA256:</strong> <code style="color: #00d9ff;">${data.fileHash.sha256}</code></p>
                ${findingsHtml}
                ${data.aiAnalysis ? `
                    <div style="margin-top: 12px; padding: 10px; background: rgba(0, 217, 255, 0.08); border-radius: 8px;">
                        <strong style="color: #00d9ff;">AI Threat Summary:</strong>
                        <p style="color: #dcecff; font-size: 12px; margin-top: 4px;">${data.aiAnalysis.executiveSummary}</p>
                    </div>
                ` : ''}
            `;
        } catch (err) {
            resultBox.innerHTML = `<p class="danger-message">Network error: ${err.message}</p>`;
        } finally {
            scanBtn.innerHTML = '<span class="button-icon">⌁</span> Scan File <span class="button-arrow">→</span>';
            scanBtn.disabled = false;
        }
    });
}

// Handle IP / URL Check
if (ipCheckBtn) {
    ipCheckBtn.addEventListener("click", async () => {
        const target = ipInput.value.trim();
        if (!target) {
            alert("Please enter an IP address or URL.");
            return;
        }

        const maxAgeInDays = ageInput ? ageInput.value : 30;

        ipCheckBtn.innerText = "Querying Feeds...";
        ipCheckBtn.disabled = true;
        ipResultBox.style.display = "block";
        ipResultBox.innerHTML = "<p>Querying threat intelligence databases...</p>";

        try {
            const res = await fetch("/check-ip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target, maxAgeInDays })
            });

            const result = await res.json();
            if (!result.success) {
                ipResultBox.innerHTML = `<p class="danger-message">Error: ${result.message || 'Investigation failed'}</p>`;
                return;
            }

            const data = result.data;
            const score = data.abuseConfidenceScore || 0;
            let scoreClass = "score-low";
            if (score > 75) scoreClass = "score-critical";
            else if (score > 50) scoreClass = "score-high";
            else if (score > 25) scoreClass = "score-medium";

            ipResultBox.innerHTML = `
                <div class="score-container">
                    <div class="score ${scoreClass}">${score}%</div>
                    <div class="score-label">Abuse Confidence Score</div>
                </div>
                <div class="info-grid">
                    <div class="info-card">
                        <small>TARGET IP</small>
                        <strong>${result.resolvedIP}</strong>
                    </div>
                    <div class="info-card">
                        <small>COUNTRY</small>
                        <strong>${data.countryName || data.countryCode || 'N/A'}</strong>
                    </div>
                    <div class="info-card">
                        <small>ISP / NETWORK</small>
                        <strong>${data.isp || 'N/A'}</strong>
                    </div>
                    <div class="info-card">
                        <small>TOR EXIT NODE</small>
                        <strong style="color: ${data.isTor ? '#ff3158' : '#00e59b'}">${data.isTor ? 'YES' : 'NO'}</strong>
                    </div>
                </div>
                ${result.aiAnalysis ? `
                    <div style="margin-top: 14px; padding: 10px; background: rgba(0, 217, 255, 0.08); border-radius: 8px;">
                        <strong style="color: #00d9ff;">AI Threat Profile:</strong>
                        <p style="color: #dcecff; font-size: 12px; margin-top: 4px;">${result.aiAnalysis.summary}</p>
                    </div>
                ` : ''}
            `;
        } catch (err) {
            ipResultBox.innerHTML = `<p class="danger-message">Network error: ${err.message}</p>`;
        } finally {
            ipCheckBtn.innerHTML = '<span class="button-icon">◉</span> Check IP / URL <span class="button-arrow">→</span>';
            ipCheckBtn.disabled = false;
        }
    });
}
