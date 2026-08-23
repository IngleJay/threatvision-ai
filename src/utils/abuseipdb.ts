// AbuseIPDB Category Definitions and Country Utilities

export interface CategoryInfo {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const ABUSE_CATEGORIES: Record<number, CategoryInfo> = {
  1: { id: 1, name: "DNS Compromise", description: "Altering DNS records or poisoning DNS caches", color: "bg-red-500/20 text-red-300 border-red-500/40", icon: "🌐" },
  2: { id: 2, name: "DNS Poisoning", description: "DNS spoofing or poisoning attack probe", color: "bg-red-500/20 text-red-300 border-red-500/40", icon: "⚠️" },
  3: { id: 3, name: "Fraud Orders", description: "Fraudulent orders / stolen credit card charge attempts", color: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: "💳" },
  4: { id: 4, name: "DDoS Attack", description: "Participating in distributed denial-of-service or amplification floods", color: "bg-rose-600/20 text-rose-300 border-rose-500/40", icon: "💥" },
  5: { id: 5, name: "FTP Brute-Force", description: "Automated brute-force attacks against FTP servers", color: "bg-orange-500/20 text-orange-300 border-orange-500/40", icon: "📁" },
  6: { id: 6, name: "Ping of Death", description: "Oversized or malformed ICMP packet floods", color: "bg-purple-500/20 text-purple-300 border-purple-500/40", icon: "📡" },
  7: { id: 7, name: "Phishing", description: "Hosting phishing pages or credential harvesting portals", color: "bg-rose-500/20 text-rose-300 border-rose-500/40", icon: "🎣" },
  8: { id: 8, name: "Fraud VoIP", description: "Fraudulent VoIP traffic, SIP brute-force or toll fraud", color: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: "📞" },
  9: { id: 9, name: "Open Proxy", description: "Open HTTP/SOCKS proxy or relay node", color: "bg-sky-500/20 text-sky-300 border-sky-500/40", icon: "🔄" },
  10: { id: 10, name: "Web Spam", description: "Comment spam, forum spam, referer spam", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40", icon: "💬" },
  11: { id: 11, name: "Email Spam", description: "Sending bulk unsolicited email or spam", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40", icon: "✉️" },
  12: { id: 12, name: "Blog Spam", description: "Automated blog/CMS comment spam submissions", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40", icon: "📝" },
  13: { id: 13, name: "VPN IP", description: "Known commercial or proxy VPN exit gateway", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40", icon: "🛡️" },
  14: { id: 14, name: "Port Scan", description: "Scanning vulnerable open TCP/UDP ports or banners", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40", icon: "🔍" },
  15: { id: 15, name: "Hacking", description: "Active system intrusion attempts, vulnerability exploitation probes", color: "bg-rose-500/20 text-rose-300 border-rose-500/40", icon: "⚡" },
  16: { id: 16, name: "SQL Injection", description: "SQL injection probes or automated sqlmap attack attempts", color: "bg-red-500/20 text-red-300 border-red-500/40", icon: "💉" },
  17: { id: 17, name: "Spoofing", description: "Email address or IP header spoofing", color: "bg-purple-500/20 text-purple-300 border-purple-500/40", icon: "🎭" },
  18: { id: 18, name: "Brute-Force", description: "Credential stuffing or password guessing attacks", color: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: "🔐" },
  19: { id: 19, name: "Bad Web Bot", description: "Malicious web scrapers, crawler abuse, or aggressive bots", color: "bg-orange-500/20 text-orange-300 border-orange-500/40", icon: "🤖" },
  20: { id: 20, name: "Exploited Host", description: "Host infected with malware or functioning as botnet zombie/C2", color: "bg-red-600/20 text-red-300 border-red-600/40", icon: "☣️" },
  21: { id: 21, name: "Web App Attack", description: "Attempts to probe or exploit web application vulnerabilities (XSS, LFI, RFI)", color: "bg-orange-500/20 text-orange-300 border-orange-500/40", icon: "🌐" },
  22: { id: 22, name: "SSH", description: "SSH brute-force or unauthorized connection attempts", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: "💻" },
  23: { id: 23, name: "IoT Targeted", description: "Attacks targeted at Internet of Things devices (Telnet/UPnP brute force)", color: "bg-teal-500/20 text-teal-300 border-teal-500/40", icon: "📡" }
};

export function getCategoryInfo(categoryId: number): CategoryInfo {
  return ABUSE_CATEGORIES[categoryId] || {
    id: categoryId,
    name: `Category ${categoryId}`,
    description: "Unclassified Security Incident",
    color: "bg-slate-700/50 text-slate-300 border-slate-600",
    icon: "⚠️"
  };
}

export function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function formatTimeAgo(isoDateString?: string): string {
  if (!isoDateString) return "N/A";
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 86400 * 30) return `${Math.floor(diffSeconds / 86400)} days ago`;
    if (diffSeconds < 86400 * 365) return `${Math.floor(diffSeconds / (86400 * 30))} months ago`;
    return `${Math.floor(diffSeconds / (86400 * 365))} years ago`;
  } catch {
    return isoDateString;
  }
}

export function formatExactUTC(isoDateString?: string): string {
  if (!isoDateString) return "N/A";
  try {
    const d = new Date(isoDateString);
    return d.toUTCString().replace("GMT", "UTC");
  } catch {
    return isoDateString;
  }
}
