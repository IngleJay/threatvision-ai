export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ThreatAlert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  source: string;
  type: 'FILE_SCAN' | 'IP_CHECK' | 'SYSTEM_MONITOR' | 'NETWORK_ANOMALY';
  target?: string;
  iocs?: string[];
}

export interface SecurityStats {
  totalScans: number;
  threatsDetected: number;
  currentRisk: ThreatSeverity;
  detectionAccuracy: number;
  protectedSystems: number;
  uptime: string;
  severityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface AbuseReportItem {
  reportedAt: string;
  comment?: string;
  categories: number[];
  reporterId?: number | string;
  reporterCountryCode?: string;
  reporterCountryName?: string;
}

export interface IPAnalysisData {
  ipAddress: string;
  isPublic?: boolean;
  ipVersion?: number;
  isWhitelisted?: boolean;
  abuseConfidenceScore: number;
  countryCode?: string;
  countryName?: string;
  usageType?: string;
  isp?: string;
  domain?: string;
  hostnames?: string[];
  isTor?: boolean;
  totalReports?: number;
  numDistinctUsers?: number;
  lastReportedAt?: string;
  reports?: AbuseReportItem[];
}

export interface IPCheckResponse {
  success: boolean;
  searchedInput: string;
  resolvedIP: string;
  reportWindow: number;
  data: IPAnalysisData;
  intelligenceAssessment?: {
    summary: string;
    threatActorProfile?: string;
    mitreTechniques?: string[];
    recommendedAction: string;
  };
  aiAnalysis?: {
    summary: string;
    threatActorProfile?: string;
    mitreTechniques?: string[];
    recommendedAction: string;
  };
  message?: string;
}

export interface FileScanFinding {
  rule: string;
  severity: ThreatSeverity;
  description: string;
  matchedString?: string;
  location?: string;
}

export interface FileScanResponse {
  success: boolean;
  threatDetected: boolean;
  file: string;
  fileSize: number;
  fileType: string;
  fileHash: {
    md5: string;
    sha256: string;
  };
  riskLevel: ThreatSeverity;
  riskScore: number; // 0 - 100
  message: string;
  findings: FileScanFinding[];
  extractedIOCs: {
    ips: string[];
    urls: string[];
    emails: string[];
    cves: string[];
  };
  intelligenceAssessment?: {
    executiveSummary: string;
    malwareFamilyHypothesis?: string;
    behavioralAnalysis?: string;
    remediationSteps: string[];
  };
  aiAnalysis?: {
    executiveSummary: string;
    malwareFamilyHypothesis?: string;
    behavioralAnalysis?: string;
    remediationSteps: string[];
  };
}
