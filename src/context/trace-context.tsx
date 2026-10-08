"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { validateIP, type IPVersion } from "@/lib/ip-validation";
import type { StatusTone } from "@/components/ui/status-dot";
import type { IpIntelligenceData, TraceApiResponse } from "@/types/ip-intelligence";

export type TraceStatus = "IDLE" | "SCANNING" | "COMPLETE" | "ERROR";

export interface TerminalEntry {
  id: string;
  prefix?: string;
  text: string;
  highlight?: string;
  tone?: "default" | "cyan" | "green" | "warn" | "critical";
  isSuccess?: boolean;
}

export interface TelemetryStateItem {
  label: string;
  value: string;
  tone: StatusTone;
  valueColor: string;
}

interface TraceContextValue {
  status: TraceStatus;
  targetIP: string;
  inputIP: string;
  ipVersion: IPVersion;
  errorMessage: string | null;
  intelligenceData: IpIntelligenceData | null;
  terminalLines: TerminalEntry[];
  telemetryItems: TelemetryStateItem[];
  setInputIP: (value: string) => void;
  startTrace: (overrideIP?: string) => void;
  resetTrace: () => void;
}

export const INITIAL_INTELLIGENCE: IpIntelligenceData = {
  ip: "8.8.8.8",
  version: "ipv4",
  source: "IP-API Real-Time Telemetry",
  timestamp: new Date().toISOString(),
  geolocation: {
    continent: "North America",
    continentCode: "NA",
    country: "United States",
    countryCode: "US",
    region: "Virginia",
    city: "Ashburn",
    district: null,
    postalCode: "20149",
    latitude: 39.03,
    longitude: -77.5,
    timezone: "America/New_York",
    utcOffset: "UTC-04:00",
    currency: "USD",
    coordinatesFormatted: "39.0300, -77.5000",
    coordinatesDisplay: "39.0300° N, 77.5000° W",
  },
  network: {
    asn: "AS15169",
    asName: "GOOGLE",
    organization: "Google Public DNS",
    isp: "Google LLC",
    prefix: "8.8.8.0/24",
    reverseDns: "dns.google",
    networkType: "ANYCAST DNS / RESOLVER",
  },
  analysis: {
    threatLevel: "NOMINAL",
    riskScore: 0,
    riskScoreFormatted: "00 / 100",
    classification: "PUBLIC ANYCAST RESOLVER",
    reputation: "VERIFIED BENIGN",
    isHosting: true,
    isProxy: false,
    isMobile: false,
    isTor: false,
  },
  security: {
    abuseContact: null,
    routeStatus: "BGP ANNOUNCED",
    dataSource: "IP-API Real-Time Telemetry",
  },
};

const IDLE_TERMINAL_LINES: TerminalEntry[] = [
  { id: "idle-1", text: "trace engine ready", tone: "default" },
  { id: "idle-2", text: "awaiting target", tone: "default" },
];

function getErrorTerminalLines(message: string): TerminalEntry[] {
  return [
    { id: "err-1", text: "trace rejected", tone: "warn" },
    { id: "err-2", text: message, tone: "warn" },
    { id: "err-3", text: "awaiting valid target", tone: "default" },
  ];
}

function getCompleteTerminalLines(ip: string, data?: IpIntelligenceData): TerminalEntry[] {
  return [
    { id: "comp-1", text: "target accepted: ", highlight: ip, tone: "cyan" },
    { id: "comp-2", text: "address validated", tone: "default" },
    { id: "comp-3", text: "network metadata resolved", tone: "default" },
    {
      id: "comp-4",
      text: "ASN query complete: ",
      highlight: data?.network.asn ? `${data.network.asn} (${data.network.organization})` : "OK",
      tone: "default",
    },
    {
      id: "comp-5",
      text: "geolocation query complete: ",
      highlight: data?.geolocation ? `${data.geolocation.city}, ${data.geolocation.countryCode}` : "OK",
      tone: "default",
    },
    { id: "comp-6", text: "intelligence profile ready", tone: "green", isSuccess: true },
  ];
}

function getTelemetryItems(status: TraceStatus): TelemetryStateItem[] {
  switch (status) {
    case "SCANNING":
      return [
        { label: "TARGET", value: "LOCKED", tone: "ready", valueColor: "text-accent" },
        { label: "TRACE ENGINE", value: "SCANNING", tone: "standby", valueColor: "text-cyan" },
        { label: "DATABASE", value: "CONNECTING", tone: "standby", valueColor: "text-cyan" },
        { label: "SYSTEM", value: "ONLINE", tone: "online", valueColor: "text-accent" },
      ];
    case "COMPLETE":
      return [
        { label: "TARGET", value: "ANALYZED", tone: "online", valueColor: "text-accent" },
        { label: "TRACE ENGINE", value: "COMPLETE", tone: "online", valueColor: "text-accent" },
        { label: "DATABASE", value: "IP-API LIVE", tone: "online", valueColor: "text-accent" },
        { label: "SYSTEM", value: "ONLINE", tone: "online", valueColor: "text-accent" },
      ];
    case "ERROR":
      return [
        { label: "TARGET", value: "INVALID", tone: "warn", valueColor: "text-warn" },
        { label: "TRACE ENGINE", value: "ERROR", tone: "critical", valueColor: "text-critical" },
        { label: "DATABASE", value: "OFFLINE", tone: "critical", valueColor: "text-critical" },
        { label: "SYSTEM", value: "ONLINE", tone: "online", valueColor: "text-accent" },
      ];
    case "IDLE":
    default:
      return [
        { label: "TARGET", value: "READY", tone: "ready", valueColor: "text-accent" },
        { label: "TRACE ENGINE", value: "STANDBY", tone: "standby", valueColor: "text-cyan" },
        { label: "DATABASE", value: "IP-API", tone: "ready", valueColor: "text-accent" },
        { label: "SYSTEM", value: "ONLINE", tone: "online", valueColor: "text-accent" },
      ];
  }
}

const TraceContext = createContext<TraceContextValue | null>(null);

export function TraceProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<TraceStatus>("IDLE");
  const [targetIP, setTargetIP] = useState<string>("8.8.8.8");
  const [inputIP, setInputIP] = useState<string>("8.8.8.8");
  const [ipVersion, setIpVersion] = useState<IPVersion>("ipv4");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [intelligenceData, setIntelligenceData] = useState<IpIntelligenceData | null>(INITIAL_INTELLIGENCE);
  const [terminalLines, setTerminalLines] = useState<TerminalEntry[]>(IDLE_TERMINAL_LINES);

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const traceCounterRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const abortCurrentFetch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      abortCurrentFetch();
    };
  }, [clearTimers, abortCurrentFetch]);

  const startTrace = useCallback(
    (overrideIP?: string) => {
      // Clean up previous runs to support clean repeated trace
      clearTimers();
      abortCurrentFetch();
      const traceId = ++traceCounterRef.current;

      const rawInput = typeof overrideIP === "string" ? overrideIP : inputIP;
      const validation = validateIP(rawInput);

      if (!validation.isValid) {
        setStatus("ERROR");
        const err = validation.error || "Invalid target IP address.";
        setErrorMessage(err);
        setTerminalLines(getErrorTerminalLines(err));
        return;
      }

      // Valid target accepted
      const validatedIP = validation.cleaned;
      const validatedVersion = validation.version || "ipv4";

      setStatus("SCANNING");
      setTargetIP(validatedIP);
      setIpVersion(validatedVersion);
      setErrorMessage(null);

      // Sequence timeline:
      // 0ms: Target accepted
      setTerminalLines([
        { id: "scan-0", text: "target accepted: ", highlight: validatedIP, tone: "cyan" },
      ]);

      // 400ms: Validating address
      const t1 = setTimeout(() => {
        if (traceCounterRef.current !== traceId) return;
        setTerminalLines((prev) => [
          ...prev,
          { id: "scan-400", text: "validating address", tone: "default" },
        ]);
      }, 400);
      timersRef.current.push(t1);

      // 800ms: Resolving network metadata
      const t2 = setTimeout(() => {
        if (traceCounterRef.current !== traceId) return;
        setTerminalLines((prev) => [
          ...prev,
          { id: "scan-800", text: "resolving network metadata", tone: "default" },
        ]);
      }, 800);
      timersRef.current.push(t2);

      // 1200ms: Querying ASN
      const t3 = setTimeout(() => {
        if (traceCounterRef.current !== traceId) return;
        setTerminalLines((prev) => [
          ...prev,
          { id: "scan-1200", text: "querying ASN", tone: "default" },
        ]);
      }, 1200);
      timersRef.current.push(t3);

      // 1600ms: Querying geolocation source
      const t4 = setTimeout(() => {
        if (traceCounterRef.current !== traceId) return;
        setTerminalLines((prev) => [
          ...prev,
          { id: "scan-1600", text: "querying geolocation source", tone: "default" },
        ]);
      }, 1600);
      timersRef.current.push(t4);

      // 2000ms: Assembling intelligence profile
      const t5 = setTimeout(() => {
        if (traceCounterRef.current !== traceId) return;
        setTerminalLines((prev) => [
          ...prev,
          { id: "scan-2000", text: "assembling intelligence profile", tone: "default" },
        ]);
      }, 2000);
      timersRef.current.push(t5);

      // 2400ms: Analysis in progress / final staging
      const t6 = setTimeout(() => {
        if (traceCounterRef.current !== traceId) return;
        setTerminalLines((prev) => [
          ...prev,
          { id: "scan-2400", text: "analysis in progress...", tone: "cyan" },
        ]);
      }, 2400);
      timersRef.current.push(t6);

      // Parallel Real IP Intelligence fetch
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const fetchPromise = fetch(`/api/trace?ip=${encodeURIComponent(validatedIP)}`, {
        signal: controller.signal,
      }).then(async (res) => {
        const json = (await res.json()) as TraceApiResponse;
        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.error || `Trace lookup failed (HTTP ${res.status})`);
        }
        return json.data;
      });

      const minDelayPromise = new Promise((resolve) => {
        const tDelay = setTimeout(resolve, 2500);
        timersRef.current.push(tDelay);
      });

      Promise.all([fetchPromise, minDelayPromise])
        .then(([data]) => {
          if (traceCounterRef.current !== traceId) return;
          setIntelligenceData(data);
          setStatus("COMPLETE");
          setTerminalLines(getCompleteTerminalLines(validatedIP, data));
        })
        .catch((err: unknown) => {
          if (traceCounterRef.current !== traceId) return;
          if (err instanceof Error && err.name === "AbortError") return;
          const msg = err instanceof Error ? err.message : "Target intelligence resolution error.";
          setStatus("ERROR");
          setErrorMessage(msg);
          setTerminalLines(getErrorTerminalLines(msg));
        });
    },
    [clearTimers, abortCurrentFetch, inputIP],
  );

  const resetTrace = useCallback(() => {
    clearTimers();
    abortCurrentFetch();
    traceCounterRef.current += 1;
    setStatus("IDLE");
    setErrorMessage(null);
    setTerminalLines(IDLE_TERMINAL_LINES);
  }, [clearTimers, abortCurrentFetch]);

  const telemetryItems = getTelemetryItems(status);

  return (
    <TraceContext.Provider
      value={{
        status,
        targetIP,
        inputIP,
        ipVersion,
        errorMessage,
        intelligenceData,
        terminalLines,
        telemetryItems,
        setInputIP,
        startTrace,
        resetTrace,
      }}
    >
      {children}
    </TraceContext.Provider>
  );
}

export function useTrace() {
  const context = useContext(TraceContext);
  if (!context) {
    throw new Error("useTrace must be used within a TraceProvider");
  }
  return context;
}
