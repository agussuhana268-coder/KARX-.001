export type ThreatLevel = "NOMINAL" | "ELEVATED" | "HIGH";

export interface IpIntelligenceData {
  ip: string;
  version: "ipv4" | "ipv6";
  source: string; // e.g. "IP-API Real-Time Telemetry"
  timestamp: string;

  geolocation: {
    continent?: string | null; // e.g. "North America"
    continentCode?: string | null; // e.g. "NA"
    country: string; // e.g. "United States"
    countryCode: string; // e.g. "US"
    region: string; // e.g. "Virginia"
    city: string; // e.g. "Ashburn"
    district?: string | null; // e.g. "North Berkeley"
    postalCode?: string | null; // e.g. "20149"
    latitude: number;
    longitude: number;
    timezone?: string | null; // e.g. "America/New_York"
    utcOffset?: string | null; // e.g. "UTC-04:00"
    currency?: string | null; // e.g. "USD"
    coordinatesFormatted: string; // e.g. "39.0300, -77.5000"
    coordinatesDisplay: string; // e.g. "39.0300° N, 77.5000° W"
  };

  network: {
    asn: string; // e.g. "AS15169"
    asName?: string | null; // e.g. "GOOGLE"
    organization: string; // e.g. "Google LLC"
    isp: string; // e.g. "Google LLC"
    prefix: string; // e.g. "8.8.8.0/24"
    reverseDns: string; // e.g. "dns.google"
    networkType: string; // e.g. "DATACENTER / CLOUD HOST", "ANYCAST DNS / RESOLVER"
  };

  analysis: {
    threatLevel: ThreatLevel;
    riskScore: number; // 0-100 deterministic indicator score
    riskScoreFormatted: string; // e.g. "00 / 100"
    classification: string; // e.g. "PUBLIC ANYCAST RESOLVER", "DATACENTER / CLOUD HOSTING"
    reputation: string; // e.g. "VERIFIED BENIGN", "ELEVATED RISK"
    isHosting: boolean;
    isProxy: boolean;
    isMobile: boolean;
    isTor: boolean;
  };

  security: {
    abuseContact: string | null; // null if unprovided by upstream provider
    routeStatus: string; // e.g. "BGP ANNOUNCED"
    dataSource: string; // e.g. "IP-API Real-Time Telemetry"
  };
}

export interface TraceApiResponse {
  success: boolean;
  data?: IpIntelligenceData;
  error?: string;
}
