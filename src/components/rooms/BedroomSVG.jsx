import React from 'react';

export default function BedroomSVG({ colors }) {
  const t = { transition: 'fill 400ms ease' };
  const ts = { transition: 'stroke 400ms ease' };
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto rounded-xl overflow-hidden">
      <defs>
        <linearGradient id="br-floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="br-wall-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.04" />
        </linearGradient>
        <filter id="br-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.12" />
        </filter>
        <filter id="br-shadow-sm">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* === ROOM SHELL === */}
      <rect width="800" height="60" fill={colors.ceiling} style={t} />
      <rect y="60" width="800" height="340" fill={colors.walls} style={t} />
      <rect y="60" width="800" height="340" fill="url(#br-wall-depth)" />
      <rect y="400" width="800" height="100" fill={colors.floor} style={t} />
      <rect y="400" width="800" height="20" fill="url(#br-floor-grad)" />
      <rect y="56" width="800" height="8" fill={colors.trim} style={t} opacity="0.85" />
      <rect y="394" width="800" height="10" fill={colors.trim} style={t} opacity="0.7" />

      {/* === HEADBOARD === */}
      <g filter="url(#br-shadow)">
        <rect x="180" y="140" width="380" height="130" rx="8" fill={colors.feature} style={t} />
        <rect x="180" y="140" width="380" height="130" rx="8" fill="#fff" opacity="0.04" />
        {/* Headboard tufting/detail lines */}
        <line x1="275" y1="150" x2="275" y2="260" stroke="#000" strokeWidth="0.5" opacity="0.06" />
        <line x1="370" y1="150" x2="370" y2="260" stroke="#000" strokeWidth="0.5" opacity="0.06" />
        <line x1="465" y1="150" x2="465" y2="260" stroke="#000" strokeWidth="0.5" opacity="0.06" />
      </g>

      {/* === BED === */}
      <g filter="url(#br-shadow)">
        {/* Mattress */}
        <rect x="165" y="265" width="410" height="110" rx="8" fill={colors.textiles} style={t} />
        {/* Duvet/comforter */}
        <rect x="170" y="280" width="400" height="85" rx="6" fill={colors.textiles} style={t} />
        <rect x="170" y="280" width="400" height="85" rx="6" fill="#fff" opacity="0.06" />
        {/* Duvet fold line */}
        <path d="M170 310 Q370 300 570 310" fill="none" stroke="#000" strokeWidth="0.8" opacity="0.05" />
        {/* Bed frame foot */}
        <rect x="160" y="365" width="420" height="14" rx="4" fill={colors.feature} style={t} opacity="0.7" />
        {/* Bed legs */}
        <rect x="175" y="379" width="8" height="18" rx="2" fill={colors.feature} style={t} opacity="0.5" />
        <rect x="557" y="379" width="8" height="18" rx="2" fill={colors.feature} style={t} opacity="0.5" />
      </g>

      {/* === PILLOWS === */}
      <g filter="url(#br-shadow-sm)">
        {/* Back pillows (larger, against headboard) */}
        <rect x="210" y="245" width="100" height="40" rx="12" fill={colors.trim} style={t} opacity="0.9" />
        <rect x="210" y="245" width="100" height="40" rx="12" fill="#fff" opacity="0.06" />
        <rect x="430" y="245" width="100" height="40" rx="12" fill={colors.trim} style={t} opacity="0.9" />
        {/* Front pillows (accent) */}
        <rect x="230" y="268" width="80" height="30" rx="10" fill={colors.accents} style={t} opacity="0.85" />
        <rect x="430" y="268" width="80" height="30" rx="10" fill={colors.accents} style={t} opacity="0.85" />
        {/* Center decorative pillow */}
        <rect x="340" y="272" width="60" height="26" rx="8" fill={colors.feature} style={t} opacity="0.5" />
      </g>

      {/* === THROW BLANKET === */}
      <path d="M300 330 Q370 320 440 335 L440 365 Q370 355 300 365 Z" fill={colors.accents} style={t} opacity="0.4" />

      {/* === NIGHTSTAND LEFT === */}
      <g filter="url(#br-shadow-sm)">
        <rect x="60" y="295" width="75" height="95" rx="6" fill={colors.feature} style={t} opacity="0.8" />
        <rect x="60" y="295" width="75" height="8" rx="4" fill="#fff" opacity="0.06" />
        {/* Drawer line */}
        <line x1="70" y1="340" x2="125" y2="340" stroke="#000" strokeWidth="0.5" opacity="0.08" />
        {/* Handle */}
        <rect x="90" y="350" width="16" height="3" rx="1" fill={colors.accents} style={t} opacity="0.5" />
        {/* Nightstand legs */}
        <rect x="68" y="390" width="4" height="8" rx="1" fill={colors.feature} style={t} opacity="0.4" />
        <rect x="123" y="390" width="4" height="8" rx="1" fill={colors.feature} style={t} opacity="0.4" />
      </g>

      {/* === LAMP LEFT === */}
      <g filter="url(#br-shadow-sm)">
        <rect x="90" y="255" width="8" height="40" rx="3" fill={colors.trim} style={t} opacity="0.7" />
        {/* Lamp shade */}
        <path d="M72 255 Q94 240 116 255 Z" fill={colors.textiles} style={t} opacity="0.45" />
        <ellipse cx="94" cy="255" rx="24" ry="6" fill={colors.textiles} style={t} opacity="0.3" />
        {/* Lamp glow */}
        <ellipse cx="94" cy="255" rx="30" ry="12" fill={colors.accents} style={t} opacity="0.05" />
      </g>

      {/* === NIGHTSTAND RIGHT === */}
      <g filter="url(#br-shadow-sm)">
        <rect x="605" y="295" width="75" height="95" rx="6" fill={colors.feature} style={t} opacity="0.8" />
        <rect x="605" y="295" width="75" height="8" rx="4" fill="#fff" opacity="0.06" />
        <line x1="615" y1="340" x2="670" y2="340" stroke="#000" strokeWidth="0.5" opacity="0.08" />
        <rect x="635" y="350" width="16" height="3" rx="1" fill={colors.accents} style={t} opacity="0.5" />
        <rect x="613" y="390" width="4" height="8" rx="1" fill={colors.feature} style={t} opacity="0.4" />
        <rect x="668" y="390" width="4" height="8" rx="1" fill={colors.feature} style={t} opacity="0.4" />
      </g>

      {/* === BOOKS + PLANT on right nightstand === */}
      <rect x="620" y="283" width="28" height="12" rx="1" fill={colors.accents} style={t} opacity="0.4" />
      <rect x="650" y="278" width="16" height="17" rx="5" fill="#5C8C5C" opacity="0.4" />
      <circle cx="658" cy="273" r="8" fill="#6B9E6B" opacity="0.35" />

      {/* === WINDOW WITH CURTAINS === */}
      <rect x="600" y="80" width="120" height="170" rx="3" fill="#C8DEF0" opacity="0.45" />
      <rect x="600" y="80" width="120" height="170" rx="3" fill="none" stroke={colors.trim} strokeWidth="5" style={ts} />
      <line x1="660" y1="80" x2="660" y2="250" stroke={colors.trim} strokeWidth="2" style={ts} />
      <line x1="600" y1="165" x2="720" y2="165" stroke={colors.trim} strokeWidth="2" style={ts} />
      {/* Curtain rod */}
      <rect x="580" y="72" width="160" height="4" rx="2" fill={colors.accents} style={t} opacity="0.5" />
      {/* Curtains */}
      <path d="M585 76 Q595 200 590 394 L578 394 Q573 200 580 76 Z" fill={colors.textiles} style={t} opacity="0.25" />
      <path d="M735 76 Q725 200 730 394 L742 394 Q747 200 740 76 Z" fill={colors.textiles} style={t} opacity="0.25" />

      {/* === WALL ART === */}
      <g filter="url(#br-shadow-sm)">
        <rect x="280" y="80" width="60" height="50" rx="2" fill={colors.accents} style={t} opacity="0.45" />
        <rect x="280" y="80" width="60" height="50" rx="2" fill="none" stroke={colors.trim} strokeWidth="2" style={ts} opacity="0.4" />
        <rect x="355" y="85" width="50" height="40" rx="2" fill={colors.feature} style={t} opacity="0.35" />
        <rect x="355" y="85" width="50" height="40" rx="2" fill="none" stroke={colors.trim} strokeWidth="2" style={ts} opacity="0.4" />
        <rect x="420" y="82" width="55" height="45" rx="2" fill={colors.accents} style={t} opacity="0.3" />
        <rect x="420" y="82" width="55" height="45" rx="2" fill="none" stroke={colors.trim} strokeWidth="2" style={ts} opacity="0.4" />
      </g>

      {/* === RUG === */}
      <rect x="150" y="420" width="440" height="50" rx="8" fill={colors.textiles} style={t} opacity="0.2" />
      <rect x="170" y="425" width="400" height="40" rx="5" fill={colors.accents} style={t} opacity="0.08" />
    </svg>
  );
}
