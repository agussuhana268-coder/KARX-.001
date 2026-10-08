"use client";

import { useTrace } from "@/context/trace-context";

interface NetworkMapProps {
  className?: string;
}

export function NetworkMap({ className }: NetworkMapProps) {
  const { status, targetIP, intelligenceData } = useTrace();
  const data = intelligenceData;

  const lat = data?.geolocation.latitude ?? 37.4056;
  const lon = data?.geolocation.longitude ?? -122.0775;

  // Project geographic latitude and longitude into 800x500 canvas coordinates
  const tx = Math.max(90, Math.min(710, Math.round(400 + (lon / 180) * 310)));
  const ty = Math.max(70, Math.min(430, Math.round(250 - (lat / 90) * 175)));

  const latTick = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  const lonTick = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;

  // Keep target annotation box safely within viewport bounds
  const boxX = Math.max(16, Math.min(620, tx - 80));
  const boxY = ty > 370 ? ty - 46 : ty + 24;

  // Regional peering points and autonomous routing nodes
  const nodes = [
    { id: "SJC-IX", label: "SJC-IX", x: 328, y: 262, dist: "48 KM" },
    { id: "LAX-CORE", label: "LAX-CORE", x: 350, y: 310, dist: "510 KM" },
    { id: "SEA-NODE", label: "SEA-NODE", x: 295, y: 140, dist: "1,140 KM" },
    { id: "DEN-PEER", label: "DEN-PEER", x: 440, y: 235, dist: "1,520 KM" },
    { id: "ORD-HUB", label: "ORD-HUB", x: 570, y: 210, dist: "2,980 KM" },
    { id: "DFW-GATE", label: "DFW-GATE", x: 480, y: 320, dist: "2,350 KM" },
  ];

  return (
    <div className={`rounded border border-line bg-surface/90 flex flex-col overflow-hidden shadow-sm ${className || ""}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-line/60 px-4 py-3 bg-surface">
        <div className="flex items-center gap-2">
          <svg className="size-3.5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-9-9h18" />
          </svg>
          <h2 className="font-sans text-xs font-semibold tracking-wider uppercase text-muted">
            NETWORK VISUALIZATION
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent hidden sm:inline-block">
            {data?.geolocation.coordinatesDisplay || `${latTick}, ${lonTick}`}
          </span>
          <span className="font-sans text-[10px] uppercase tracking-wider text-dim bg-bg px-2 py-0.5 rounded border border-line">
            WGS84 PROJECTION
          </span>
        </div>
      </div>

      {/* Analytical Map Canvas */}
      <div className="relative min-h-[380px] sm:min-h-[440px] flex-1 bg-[#050608] overflow-hidden select-none">
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
        >
          <defs>
            {/* Fine coordinate grid pattern */}
            <pattern id="net-grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#0B1612" strokeWidth="0.5" />
            </pattern>
            <pattern id="net-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#net-grid-minor)" />
              <path d="M100 0H0V100" fill="none" stroke="#10201A" strokeWidth="0.75" />
            </pattern>

            {/* Subtle reticle glow filter */}
            <filter id="reticle-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid base */}
          <rect width="800" height="500" fill="url(#net-grid-major)" />

          {/* Stylized continental vector outlines for North American landmass context */}
          <g fill="none" stroke="#162921" strokeWidth="1" opacity="0.65">
            {/* Pacific coastline, West Coast down to Baja */}
            <path d="M 270 40 L 285 90 L 290 145 L 305 210 L 312 255 L 340 320 L 360 360 L 390 420" />
            {/* Gulf of Mexico / Southern border */}
            <path d="M 390 420 L 460 390 L 520 375 L 560 395 L 610 390 L 630 350" />
            {/* East Coast / Atlantic */}
            <path d="M 630 350 L 640 310 L 680 250 L 710 190 L 700 130 L 730 80" />
            {/* Canada / Northern boundary */}
            <path d="M 270 40 L 360 50 L 460 65 L 560 70 L 660 75 L 730 80" />
            {/* Great Lakes outline indication */}
            <path d="M 580 150 Q 610 140 635 155 Q 610 180 580 150" strokeDasharray="2 3" opacity="0.4" />
          </g>

          {/* Geographic parallel lines (Latitude arcs) */}
          <g stroke="#14261F" strokeWidth="0.75" strokeDasharray="3 4">
            <line x1="0" y1="120" x2="800" y2="120" />
            <line x1="0" y1="200" x2="800" y2="200" />
            <line x1="0" y1="280" x2="800" y2="280" />
            <line x1="0" y1="360" x2="800" y2="360" />
            <line x1="0" y1="440" x2="800" y2="440" />
          </g>

          {/* Latitude labels */}
          <text x="6" y="118" fill="#52635B" fontSize="8" fontFamily="monospace">45°N</text>
          <text x="6" y="198" fill="#52635B" fontSize="8" fontFamily="monospace">40°N</text>
          <text x="6" y="278" fill="#52635B" fontSize="8" fontFamily="monospace">35°N</text>
          <text x="6" y="358" fill="#52635B" fontSize="8" fontFamily="monospace">30°N</text>

          {/* Geographic meridian lines (Longitude) */}
          <g stroke="#14261F" strokeWidth="0.75" strokeDasharray="3 4">
            <line x1="180" y1="0" x2="180" y2="500" />
            <line x1="300" y1="0" x2="300" y2="500" />
            <line x1="420" y1="0" x2="420" y2="500" />
            <line x1="540" y1="0" x2="540" y2="500" />
            <line x1="660" y1="0" x2="660" y2="500" />
          </g>

          {/* Longitude labels */}
          <text x="184" y="14" fill="#52635B" fontSize="8" fontFamily="monospace">130°W</text>
          <text x="304" y="14" fill="#52635B" fontSize="8" fontFamily="monospace">120°W</text>
          <text x="424" y="14" fill="#52635B" fontSize="8" fontFamily="monospace">105°W</text>
          <text x="544" y="14" fill="#52635B" fontSize="8" fontFamily="monospace">90°W</text>

          {/* Concentric Range Rings from Target */}
          <g stroke="#1A3328" strokeWidth="0.75" fill="none">
            <circle cx={tx} cy={ty} r="75" strokeDasharray="4 4" opacity="0.65" />
            <text x={tx + 78} y={ty - 4} fill="#52635B" fontSize="8" fontFamily="monospace">
              500 KM
            </text>

            <circle cx={tx} cy={ty} r="150" strokeDasharray="4 4" opacity="0.5" />
            <text x={tx + 153} y={ty - 4} fill="#52635B" fontSize="8" fontFamily="monospace">
              1,000 KM
            </text>

            <circle cx={tx} cy={ty} r="240" strokeDasharray="4 4" opacity="0.35" />
            <text x={tx + 243} y={ty - 4} fill="#52635B" fontSize="8" fontFamily="monospace">
              2,000 KM
            </text>
          </g>

          {/* Coordinate Crosshairs aligned to Target */}
          <g stroke="#1F3D30" strokeWidth="0.75" opacity="0.8">
            <line x1="0" y1={ty} x2={tx - 35} y2={ty} />
            <line x1={tx + 35} y1={ty} x2="800" y2={ty} />
            <line x1={tx} y1="0" x2={tx} y2={ty - 35} />
            <line x1={tx} y1={ty + 35} x2={tx} y2="500" />
          </g>

          {/* Peering Route Vectors in CYBER CYAN */}
          <g stroke="#00D9FF" strokeWidth="0.9" opacity="0.5" strokeDasharray="3 4">
            {nodes.map((n) => (
              <line key={`line-${n.id}`} x1={tx} y1={ty} x2={n.x} y2={n.y} />
            ))}
          </g>

          {/* Peering Nodes in CYBER CYAN */}
          {nodes.map((n) => (
            <g key={`node-${n.id}`}>
              <rect
                x={n.x - 3}
                y={n.y - 3}
                width="6"
                height="6"
                fill="#080D0C"
                stroke="#00D9FF"
                strokeWidth="1.2"
              />
              <circle cx={n.x} cy={n.y} r="1" fill="#00D9FF" />
              <text
                x={n.x + 7}
                y={n.y + 3}
                fill="#8A9992"
                fontSize="9"
                fontFamily="monospace"
              >
                {n.label}
              </text>
            </g>
          ))}

          {/* Primary Target Node Marker in TERMINAL GREEN with subtle glow */}
          {/* Subtle pulse ring */}
          <circle
            cx={tx}
            cy={ty}
            r="16"
            fill="none"
            stroke={status === "SCANNING" ? "#00D9FF" : "#39FF88"}
            strokeWidth={status === "SCANNING" ? "1.5" : "1"}
            opacity={status === "SCANNING" ? "0.75" : "0.35"}
          />
          {/* Target crosshair reticle brackets */}
          <path
            d={`M ${tx - 18} ${ty - 6} V ${ty - 18} H ${tx - 6} M ${tx + 6} ${ty - 18} H ${tx + 18} V ${ty - 6} M ${tx + 18} ${ty + 6} V ${ty + 18} H ${tx + 6} M ${tx - 6} ${ty + 18} H ${tx - 18} V ${ty + 6}`}
            fill="none"
            stroke="#39FF88"
            strokeWidth="1.5"
            filter="url(#reticle-glow)"
          />
          {/* Target core dot */}
          <circle cx={tx} cy={ty} r="5" fill="#050608" stroke="#39FF88" strokeWidth="1.5" />
          <circle cx={tx} cy={ty} r="2.2" fill="#39FF88" />

          {/* Target Annotations Box */}
          <g transform={`translate(${boxX}, ${boxY})`}>
            <rect
              width="160"
              height="38"
              fill="#080D0C"
              stroke="#1A2923"
              strokeWidth="0.75"
              rx="2"
            />
            <text x="8" y="15" fill="#39FF88" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {`TARGET: ${targetIP}`}
            </text>
            <text x="8" y="28" fill="#8A9992" fontSize="8" fontFamily="sans-serif">
              {status === "SCANNING"
                ? "RESOLVING AUTONOMOUS ROUTE..."
                : `${(data?.geolocation.city || "UNKNOWN").toUpperCase()}, ${data?.geolocation.countryCode || "—"} [LIVE TELEMETRY]`}
            </text>
          </g>
        </svg>

        {/* Ambient edge vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#050608_100%)]"
        />

        {/* Top-left Telemetry Overlay */}
        <div className="pointer-events-none absolute left-4 top-3 font-mono text-[9px] uppercase tracking-wider text-dim space-y-0.5">
          <div>PROJECTION: <span className="text-muted">GEO-CYLINDRICAL</span></div>
          <div>DATUM: <span className="text-muted">WGS-84</span></div>
          <div>ANYCAST SCOPE: <span className="text-accent">GLOBAL / MULTI-POP</span></div>
        </div>

        {/* Top-right Latitude/Longitude ticks */}
        <div className="pointer-events-none absolute right-4 top-3 font-mono text-[9px] text-dim text-right space-y-0.5">
          <div>LAT: <span className="text-ink">{latTick}</span></div>
          <div>LON: <span className="text-ink">{lonTick}</span></div>
        </div>

        {/* Bottom Legend */}
        <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between text-[10px] font-sans text-dim">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="size-2 rounded-full bg-accent inline-block shadow-[0_0_5px_rgba(57,255,136,0.6)]" />
              Target Anycast Node
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span className="size-2 border border-cyan bg-cyan/20 inline-block" />
              Peering / IX Exchange
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-dim">
              <span className="w-3 border-t border-dashed border-cyan inline-block" />
              BGP Path
            </span>
          </div>

          <span className="font-mono text-[9px] text-dim">
            ZOOM: 1.0X
          </span>
        </div>
      </div>
    </div>
  );
}
