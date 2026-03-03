import React from 'react';

export default function BathroomSVG({ colors }) {
  const t = { transition: 'fill 400ms ease' };
  const ts = { transition: 'stroke 400ms ease' };
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto rounded-xl overflow-hidden">
      <defs>
        <linearGradient id="ba-floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ba-mirror-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8D4E8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D4E6F1" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="ba-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
        <filter id="ba-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.12" />
        </filter>
        <filter id="ba-shadow-sm">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* === ROOM SHELL === */}
      <rect width="800" height="60" fill={colors.ceiling} style={t} />
      {/* Upper wall */}
      <rect y="60" width="800" height="150" fill={colors.walls} style={t} />
      {/* Tile wainscot area (lower wall) */}
      <rect y="210" width="800" height="190" fill={colors.trim} style={t} opacity="0.2" />
      {/* Tile grid */}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`wv${i}`} x1={i * 60} y1="210" x2={i * 60} y2="400" stroke="#fff" strokeWidth="0.8" opacity="0.2" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`wh${i}`} x1="0" y1={210 + i * 30} x2="800" y2={210 + i * 30} stroke="#fff" strokeWidth="0.8" opacity="0.2" />
      ))}
      {/* Tile border strip */}
      <rect y="206" width="800" height="6" fill={colors.accents} style={t} opacity="0.25" />
      {/* Floor */}
      <rect y="400" width="800" height="100" fill={colors.floor} style={t} />
      <rect y="400" width="800" height="16" fill="url(#ba-floor-grad)" />
      {/* Floor tile grid */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`fv${i}`} x1={i * 80} y1="400" x2={i * 80} y2="500" stroke={colors.trim} strokeWidth="0.5" opacity="0.1" style={ts} />
      ))}
      <line x1="0" y1="450" x2="800" y2="450" stroke={colors.trim} strokeWidth="0.5" opacity="0.1" style={ts} />
      {/* Crown molding */}
      <rect y="56" width="800" height="7" fill={colors.trim} style={t} opacity="0.85" />

      {/* === VANITY === */}
      <g filter="url(#ba-shadow)">
        {/* Vanity cabinet */}
        <rect x="60" y="260" width="250" height="130" rx="6" fill={colors.feature} style={t} />
        <rect x="60" y="260" width="250" height="8" rx="4" fill="#fff" opacity="0.05" />
        {/* Door lines */}
        <line x1="185" y1="268" x2="185" y2="385" stroke="#000" strokeWidth="0.5" opacity="0.06" />
        {/* Handles */}
        <rect x="155" y="320" width="14" height="3" rx="1" fill={colors.accents} style={t} opacity="0.5" />
        <rect x="200" y="320" width="14" height="3" rx="1" fill={colors.accents} style={t} opacity="0.5" />
        {/* Vanity legs/toe kick */}
        <rect x="65" y="390" width="240" height="6" rx="1" fill="#000" opacity="0.06" />
      </g>

      {/* === COUNTERTOP + SINK === */}
      <g filter="url(#ba-shadow-sm)">
        {/* Counter */}
        <rect x="55" y="252" width="260" height="14" rx="3" fill={colors.trim} style={t} />
        <rect x="55" y="252" width="260" height="6" rx="3" fill="#fff" opacity="0.1" />
        {/* Sink basin */}
        <ellipse cx="185" cy="262" rx="40" ry="8" fill={colors.walls} style={t} opacity="0.4" />
        <ellipse cx="185" cy="262" rx="35" ry="6" fill="#000" opacity="0.04" />
        {/* Faucet */}
        <rect x="182" y="235" width="6" height="20" rx="2" fill={colors.accents} style={t} opacity="0.6" />
        <path d="M178 235 Q185 225 192 235" fill="none" stroke={colors.accents} strokeWidth="3" style={ts} opacity="0.6" />
      </g>

      {/* === MIRROR === */}
      <g filter="url(#ba-shadow-sm)">
        <rect x="100" y="80" width="170" height="120" rx="6" fill="url(#ba-mirror-grad)" />
        <rect x="100" y="80" width="170" height="120" rx="6" fill="none" stroke={colors.trim} strokeWidth="4" style={ts} />
        {/* Mirror highlight */}
        <rect x="110" y="90" width="30" height="60" rx="3" fill="#fff" opacity="0.08" />
      </g>

      {/* === COUNTER ITEMS === */}
      {/* Soap dispenser */}
      <rect x="90" y="236" width="14" height="18" rx="4" fill={colors.accents} style={t} opacity="0.5" />
      <rect x="94" y="230" width="6" height="8" rx="2" fill={colors.accents} style={t} opacity="0.4" />
      {/* Small plant */}
      <rect x="265" y="237" width="16" height="16" rx="4" fill={colors.feature} style={t} opacity="0.5" />
      <circle cx="273" cy="232" r="10" fill="#6B9E6B" opacity="0.35" />
      <circle cx="268" cy="228" r="6" fill="#5C8C5C" opacity="0.3" />

      {/* === SHOWER AREA === */}
      <g>
        {/* Glass panel frame */}
        <rect x="500" y="60" width="6" height="340" fill={colors.trim} style={t} opacity="0.3" />
        {/* Glass panel */}
        <rect x="506" y="60" width="290" height="340" fill="url(#ba-glass)" />
        <rect x="506" y="60" width="290" height="340" fill="none" stroke={colors.trim} strokeWidth="1" style={ts} opacity="0.15" />

        {/* Shower interior - slightly different wall tone */}
        <rect x="510" y="60" width="286" height="340" fill={colors.walls} style={t} opacity="0.15" />

        {/* Shower tiles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`sv${i}`} x1={510 + i * 60} y1="60" x2={510 + i * 60} y2="400" stroke="#fff" strokeWidth="0.5" opacity="0.1" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`sh${i}`} x1="510" y1={60 + i * 30} x2="796" y2={60 + i * 30} stroke="#fff" strokeWidth="0.5" opacity="0.1" />
        ))}

        {/* Shower head (rain) */}
        <rect x="620" y="72" width="60" height="6" rx="3" fill={colors.accents} style={t} opacity="0.5" />
        <rect x="647" y="60" width="6" height="14" fill={colors.accents} style={t} opacity="0.4" />
        {/* Water dots (decorative) */}
        {[640, 650, 660, 670, 635, 655, 645, 665, 675].map((x, i) => (
          <circle key={i} cx={x} cy={85 + (i % 3) * 6} r="1" fill={colors.accents} opacity="0.15" />
        ))}

        {/* Shower shelf with bottles */}
        <rect x="720" y="180" width="60" height="4" rx="1" fill={colors.trim} style={t} opacity="0.3" />
        <rect x="730" y="160" width="14" height="20" rx="3" fill={colors.accents} style={t} opacity="0.3" />
        <rect x="750" y="165" width="12" height="15" rx="3" fill={colors.feature} style={t} opacity="0.3" />
        <rect x="766" y="162" width="10" height="18" rx="3" fill={colors.textiles} style={t} opacity="0.3" />

        {/* Drain */}
        <ellipse cx="650" cy="395" rx="15" ry="4" fill="#000" opacity="0.06" />
      </g>

      {/* === TOWEL RACK === */}
      <g filter="url(#ba-shadow-sm)">
        <rect x="370" y="220" width="80" height="4" rx="2" fill={colors.accents} style={t} opacity="0.5" />
        {/* Towels hanging */}
        <rect x="375" y="224" width="30" height="70" rx="3" fill={colors.textiles} style={t} opacity="0.6" />
        <rect x="375" y="224" width="30" height="10" rx="3" fill="#fff" opacity="0.05" />
        <rect x="412" y="224" width="30" height="60" rx="3" fill={colors.accents} style={t} opacity="0.4" />
      </g>

      {/* === TOILET (subtle, partial view) === */}
      <g filter="url(#ba-shadow-sm)" opacity="0.7">
        <ellipse cx="430" cy="375" rx="28" ry="20" fill={colors.trim} style={t} opacity="0.6" />
        <rect x="408" y="340" width="44" height="20" rx="4" fill={colors.trim} style={t} opacity="0.5" />
        <rect x="415" y="325" width="30" height="18" rx="4" fill={colors.trim} style={t} opacity="0.4" />
      </g>

      {/* === PENDANT LIGHT === */}
      <line x1="185" y1="0" x2="185" y2="50" stroke={colors.accents} strokeWidth="1.5" style={ts} opacity="0.4" />
      <ellipse cx="185" cy="55" rx="14" ry="10" fill={colors.accents} style={t} opacity="0.3" />

      {/* === BATH MAT === */}
      <rect x="140" y="415" width="100" height="45" rx="6" fill={colors.textiles} style={t} opacity="0.25" />
    </svg>
  );
}
