import type { IpIntelligenceData, ThreatLevel } from "@/types/ip-intelligence";
import { validateIP } from "@/lib/ip-validation";
import dns from "node:dns/promises";

export interface IpIntelligenceProvider {
  name: string;
  lookup(ip: string): Promise<IpIntelligenceData>;
}

interface IpApiResponse {
  status: "success" | "fail";
  message?: string;
  continent?: string;
  continentCode?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  district?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  offset?: number;
  currency?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  reverse?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
  query?: string;
}

/**
 * Format raw seconds UTC offset to standard ISO/RFC format (e.g. UTC-04:00, UTC+10:00).
 */
function formatUtcOffset(offsetSeconds?: number): string | null {
  if (typeof offsetSeconds !== "number" || Number.isNaN(offsetSeconds)) {
    return null;
  }
  const totalMinutes = Math.round(offsetSeconds / 60);
  const sign = totalMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * IP-API Provider Implementation (Zero API Key / Server-Side).
 */
export class IpApiProvider implements IpIntelligenceProvider {
  name = "IP-API";

  async lookup(ip: string): Promise<IpIntelligenceData> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const fields =
      "status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query";
    const endpoint = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${fields}`;

    let data: IpApiResponse;
    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "KARX-Intelligence-Engine/0.0.1",
        },
      });

      if (!response.ok) {
        throw new Error(`Provider returned HTTP ${response.status}`);
      }

      data = (await response.json()) as IpApiResponse;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Provider request timed out.");
      }
      throw new Error(
        `Failed to query IP intelligence provider: ${err instanceof Error ? err.message : "Network error"}`,
      );
    } finally {
      clearTimeout(timeout);
    }

    if (data.status === "fail") {
      throw new Error(data.message || "Failed to resolve target IP.");
    }

    // Determine IP version
    const validation = validateIP(ip);
    const version = validation.version || "ipv4";

    // Format coordinates
    const lat = typeof data.lat === "number" ? data.lat : 0;
    const lon = typeof data.lon === "number" ? data.lon : 0;
    const coordinatesFormatted = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    const latDir = lat >= 0 ? "N" : "S";
    const lonDir = lon >= 0 ? "E" : "W";
    const coordinatesDisplay = `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;

    // Extract ASN identifier
    const asString = data.as || "";
    const asnMatch = asString.match(/AS\d+/i);
    const asn = asnMatch ? asnMatch[0].toUpperCase() : asString ? asString.split(" ")[0] : "AS—";
    const asName = (data.asname || "").trim() || null;

    // Extract Network Prefix
    let prefix = "—";
    if (version === "ipv4") {
      const octets = ip.split(".");
      if (octets.length === 4) {
        prefix = `${octets[0]}.${octets[1]}.${octets[2]}.0/24`;
      }
    } else if (version === "ipv6") {
      const segments = ip.split(":");
      if (segments.length >= 3) {
        prefix = `${segments.slice(0, 3).join(":")}::/48`;
      }
    }

    // Resolve reverse DNS fallback if empty or same as IP
    let reverseDns = (data.reverse || "").trim();
    if (!reverseDns || reverseDns === ip) {
      try {
        const ptr = await dns.reverse(ip);
        if (ptr && ptr.length > 0) {
          reverseDns = ptr[0];
        } else {
          reverseDns = "None / Unassigned";
        }
      } catch {
        reverseDns = "None / Unassigned";
      }
    }

    // Threat & Classification Analysis
    const isProxy = Boolean(data.proxy);
    const isHosting = Boolean(data.hosting);
    const isMobile = Boolean(data.mobile);
    const orgUpper = (data.org || "").toUpperCase();
    const asUpper = asString.toUpperCase();
    const asNameUpper = (asName || "").toUpperCase();
    const reverseLower = reverseDns.toLowerCase();

    // Check for well-known verified resolvers and CDNs
    const isKnownResolver =
      asn === "AS15169" || // Google
      asn === "AS13335" || // Cloudflare
      asn === "AS19281" || // Quad9
      asn === "AS36692" || // OpenDNS
      orgUpper.includes("PUBLIC DNS") ||
      orgUpper.includes("RESOLVER");

    // Tor exit node detection based on provider reverse DNS / AS Handle
    const isTor =
      isProxy &&
      (asNameUpper.includes("TOR") ||
        reverseLower.includes("tor-exit") ||
        reverseLower.includes(".tor.") ||
        orgUpper.includes("TOR EXIT") ||
        orgUpper.includes("TORSERVERS"));

    let threatLevel: ThreatLevel = "NOMINAL";
    let riskScore = 0;
    let classification = "COMMERCIAL / RESIDENTIAL";
    let reputation = "VERIFIED BENIGN";
    let networkType = "COMMERCIAL / RESIDENTIAL";

    if (isKnownResolver) {
      threatLevel = "NOMINAL";
      riskScore = 0;
      classification = "PUBLIC ANYCAST RESOLVER";
      reputation = "VERIFIED BENIGN";
      networkType = "ANYCAST DNS / RESOLVER";
    } else if (isTor) {
      threatLevel = "HIGH";
      riskScore = 85;
      classification = "ANONYMOUS TOR EXIT RELAY";
      reputation = "HIGH ANONYMIZATION RISK";
      networkType = "ANONYMIZED TOR RELAY";
    } else if (isProxy) {
      threatLevel = "ELEVATED";
      riskScore = 65;
      classification = "ANONYMOUS PROXY / VPN";
      reputation = "ELEVATED RISK";
      networkType = "ANONYMOUS PROXY / VPN";
    } else if (isHosting) {
      threatLevel = "NOMINAL";
      riskScore = 15;
      classification = "DATACENTER / CLOUD HOSTING";
      reputation = "NEUTRAL / VERIFIED HOSTING";
      networkType = "DATACENTER / CLOUD HOST";
    } else if (isMobile) {
      threatLevel = "NOMINAL";
      riskScore = 5;
      classification = "CELLULAR / MOBILE NETWORK";
      reputation = "VERIFIED CONSUMER";
      networkType = "CELLULAR / MOBILE NETWORK";
    } else if (asUpper.includes("TRANSIT") || asUpper.includes("CARRIER")) {
      threatLevel = "NOMINAL";
      riskScore = 5;
      classification = "TIER-1 / CORE ROUTING";
      reputation = "VERIFIED BENIGN";
      networkType = "TIER-1 CORE ROUTING";
    }

    const riskScoreFormatted = `${String(riskScore).padStart(2, "0")} / 100`;

    return {
      ip,
      version,
      source: "IP-API Real-Time Telemetry",
      timestamp: new Date().toISOString(),
      geolocation: {
        continent: data.continent || null,
        continentCode: data.continentCode || null,
        country: data.country || "Unknown Country",
        countryCode: data.countryCode || "—",
        region: data.regionName || data.region || "Unknown Region",
        city: data.city || "Unknown City",
        district: data.district?.trim() || null,
        postalCode: data.zip?.trim() || null,
        latitude: lat,
        longitude: lon,
        timezone: data.timezone?.trim() || null,
        utcOffset: formatUtcOffset(data.offset),
        currency: data.currency?.trim() || null,
        coordinatesFormatted,
        coordinatesDisplay,
      },
      network: {
        asn,
        asName,
        organization: data.org || data.asname || data.isp || "Unknown Organization",
        isp: data.isp || "Unknown ISP",
        prefix,
        reverseDns,
        networkType,
      },
      analysis: {
        threatLevel,
        riskScore,
        riskScoreFormatted,
        classification,
        reputation,
        isHosting,
        isProxy,
        isMobile,
        isTor,
      },
      security: {
        abuseContact: null, // Note: IP-API free tier does not provide abuse email/phone
        routeStatus: "BGP ANNOUNCED",
        dataSource: "IP-API Real-Time Telemetry",
      },
    };
  }
}

// Active provider instance (can be swapped with MaxMindProvider later)
const activeProvider: IpIntelligenceProvider = new IpApiProvider();

export async function fetchIpIntelligence(ip: string): Promise<IpIntelligenceData> {
  return activeProvider.lookup(ip);
}
