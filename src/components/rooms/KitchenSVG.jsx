import React from 'react';

export default function KitchenSVG({ colors }) {
  const t = { transition: 'fill 400ms ease' };
  const ts = { transition: 'stroke 400ms ease' };
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto rounded-xl overflow-hidden">
      <defs>
        <linearGradient id="ki-floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ki-counter-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="ki-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
        </filter>
        <filter id="ki-shadow-sm">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* === ROOM SHELL === */}
      <rect width="800" height="60" fill={colors.ceiling} style={t} />
      <rect y="60" width="800" height="340" fill={colors.walls} style={t} />
      <rect y="400" width="800" height="100" fill={colors.floor} style={t} />
      <rect y="400" width="800" height="16" fill="url(#ki-floor-grad)" />
      {/* Crown molding */}
      <rect y="56" width="800" height="7" fill={colors.trim} style={t} opacity="0.85" />

      {/* === UPPER CABINETS === */}
      <g filter="url(#ki-shadow-sm)">
        {/* Cabinet boxes */}
        {[30, 145, 480, 595, 710].map((x, i) => (
          <g key={i}>
            <rect x={x} y="75" width="100" height="120" rx="4" fill={colors.feature} style={t} />
            <rect x={x} y="75" width="100" height="8" rx="3" fill="#fff" opacity="0.05" />
            {/* Cabinet door line */}
            <line x1={x + 50} y1="80" x2={x + 50} y2="190" stroke="#000" strokeWidth="0.5" opacity="0.06" />
            {/* Handle */}
            <rect x={x + 44} y="135" width="12" height="3" rx="1" fill={colors.accents} style={t} opacity="0.6" />
          </g>
        ))}
      </g>

      {/* === RANGE HOOD === */}
      <g filter="url(#ki-shadow-sm)">
        <path d="M310 75 L310 140 Q310 150 320 150 L460 150 Q470 150 470 140 L470 75 Z" fill={colors.trim} style={t} opacity="0.5" />
        <rect x="320" y="150" width="140" height="6" rx="2" fill={colors.trim} style={t} opacity="0.4" />
        {/* Vent lines */}
        <line x1="340" y1="100" x2="440" y2="100" stroke="#000" strokeWidth="0.5" opacity="0.04" />
        <line x1="340" y1="115" x2="440" y2="115" stroke="#000" strokeWidth="0.5" opacity="0.04" />
        <line x1="340" y1="130" x2="440" y2="130" stroke="#000" strokeWidth="0.5" opacity="0.04" />
      </g>

      {/* === BACKSPLASH === */}
      <rect x="25" y="200" width="750" height="60" fill={colors.trim} style={t} opacity="0.3" />
      {/* Subtle tile pattern */}
      {Array.from({ length: 25 }).map((_, i) => (
        <line key={`bv${i}`} x1={25 + i * 30} y1="200" x2={25 + i * 30} y2="260" stroke="#fff" strokeWidth="0.5" opacity="0.15" />
      ))}
      {[220, 240].map(y => (
        <line key={y} x1="25" y1={y} x2="775" y2={y} stroke="#fff" strokeWidth="0.5" opacity="0.15" />
      ))}

      {/* === COUNTERTOP === */}
      <rect x="20" y="258" width="760" height="14" rx="2" fill={colors.trim} style={t} />
      <rect x="20" y="258" width="760" height="6" rx="2" fill="url(#ki-counter-shine)" />

      {/* === LOWER CABINETS === */}
      <g filter="url(#ki-shadow)">
        {[30, 145, 310, 480, 595, 710].map((x, i) => (
          <g key={i}>
            <rect x={x} y="272" width="100" height="120" rx="4" fill={colors.textiles} style={t} />
            {/* Door line */}
            <line x1={x + 50} y1="277" x2={x + 50} y2="387" stroke="#000" strokeWidth="0.5" opacity="0.05" />
            {/* Handle */}
            <rect x={x + 44} y="330" width="12" height="3" rx="1" fill={colors.accents} style={t} opacity="0.55" />
          </g>
        ))}
        {/* Toe kick */}
        <rect x="25" y="392" width="755" height="8" rx="1" fill="#000" opacity="0.08" />
      </g>

      {/* === STOVE/RANGE === */}
      <g filter="url(#ki-shadow-sm)">
        <rect x="320" y="272" width="140" height="120" rx="4" fill={colors.feature} style={t} opacity="0.85" />
        <rect x="320" y="272" width="140" height="120" rx="4" fill="#000" opacity="0.05" />
        {/* Burner grates */}
        <circle cx="365" cy="300" r="14" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.12" />
        <circle cx="415" cy="300" r="14" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.12" />
        <circle cx="365" cy="340" r="10" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.1" />
        <circle cx="415" cy="340" r="10" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.1" />
        {/* Oven door handle */}
        <rect x="350" y="360" width="80" height="3" rx="1" fill={colors.accents} style={t} opacity="0.5" />
      </g>

      {/* === WINDOW === */}
      <rect x="280" y="80" width="220" height="110" rx="3" fill="#C8DEF0" opacity="0.4" />
      <rect x="280" y="80" width="220" height="110" rx="3" fill="none" stroke={colors.trim} strokeWidth="5" style={ts} />
      <line x1="390" y1="80" x2="390" y2="190" stroke={colors.trim} strokeWidth="2" style={ts} />

      {/* === ITEMS ON COUNTER === */}
      {/* Cutting board */}
      <rect x="60" y="238" width="50" height="20" rx="3" fill={colors.feature} style={t} opacity="0.35" />
      {/* Knife block */}
      <rect x="160" y="228" width="20" height="30" rx="3" fill={colors.feature} style={t} opacity="0.4" />
      <rect x="163" y="218" width="2" height="12" fill={colors.accents} style={t} opacity="0.3" />
      <rect x="168" y="220" width="2" height="10" fill={colors.accents} style={t} opacity="0.3" />
      <rect x="173" y="222" width="2" height="8" fill={colors.accents} style={t} opacity="0.3" />

      {/* Coffee maker area */}
      <rect x="540" y="230" width="35" height="28" rx="3" fill={colors.feature} style={t} opacity="0.4" />
      <rect x="540" y="225" width="35" height="8" rx="2" fill={colors.feature} style={t} opacity="0.3" />

      {/* Bowl of fruit */}
      <ellipse cx="660" cy="248" rx="22" ry="10" fill={colors.trim} style={t} opacity="0.3" />
      <circle cx="653" cy="242" r="7" fill={colors.accents} style={t} opacity="0.4" />
      <circle cx="667" cy="240" r="6" fill="#6B9E6B" opacity="0.3" />
      <circle cx="660" cy="237" r="5" fill={colors.feature} style={t} opacity="0.3" />

      {/* === PENDANT LIGHTS === */}
      <line x1="300" y1="0" x2="300" y2="45" stroke={colors.accents} strokeWidth="1.5" style={ts} opacity="0.4" />
      <ellipse cx="300" cy="50" rx="16" ry="10" fill={colors.accents} style={t} opacity="0.35" />
      <line x1="500" y1="0" x2="500" y2="45" stroke={colors.accents} strokeWidth="1.5" style={ts} opacity="0.4" />
      <ellipse cx="500" cy="50" rx="16" ry="10" fill={colors.accents} style={t} opacity="0.35" />

      {/* === FLOOR TILES (subtle) === */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`ft${i}`} x1={i * 80} y1="400" x2={i * 80} y2="500" stroke={colors.trim} strokeWidth="0.5" opacity="0.1" style={ts} />
      ))}
      <line x1="0" y1="450" x2="800" y2="450" stroke={colors.trim} strokeWidth="0.5" opacity="0.1" style={ts} />
    </svg>
  );
}
