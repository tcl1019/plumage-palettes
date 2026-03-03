import React from 'react';

export default function LivingRoomSVG({ colors }) {
  const t = { transition: 'fill 400ms ease' };
  const ts = { transition: 'stroke 400ms ease' };
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto rounded-xl overflow-hidden">
      <defs>
        <linearGradient id="lr-floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lr-wall-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.04" />
        </linearGradient>
        <filter id="lr-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.12" />
        </filter>
        <filter id="lr-shadow-sm">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* === ROOM SHELL === */}
      {/* Ceiling */}
      <rect width="800" height="60" fill={colors.ceiling} style={t} />
      {/* Wall */}
      <rect y="60" width="800" height="340" fill={colors.walls} style={t} />
      <rect y="60" width="800" height="340" fill="url(#lr-wall-depth)" />
      {/* Floor */}
      <rect y="400" width="800" height="100" fill={colors.floor} style={t} />
      <rect y="400" width="800" height="20" fill="url(#lr-floor-grad)" />
      {/* Crown molding */}
      <rect y="56" width="800" height="8" fill={colors.trim} style={t} opacity="0.85" />
      {/* Baseboard */}
      <rect y="394" width="800" height="10" fill={colors.trim} style={t} opacity="0.7" />

      {/* === WINDOW === */}
      <rect x="290" y="90" width="220" height="180" rx="3" fill="#C8DEF0" opacity="0.5" />
      <rect x="290" y="90" width="220" height="180" rx="3" fill="none" stroke={colors.trim} strokeWidth="6" style={ts} />
      {/* Window panes */}
      <line x1="400" y1="90" x2="400" y2="270" stroke={colors.trim} strokeWidth="3" style={ts} />
      <line x1="290" y1="180" x2="510" y2="180" stroke={colors.trim} strokeWidth="3" style={ts} />
      {/* Curtain rod */}
      <rect x="265" y="82" width="270" height="4" rx="2" fill={colors.accents} style={t} opacity="0.6" />
      {/* Curtains */}
      <path d="M270 86 Q280 200 275 390 L265 390 Q260 200 265 86 Z" fill={colors.textiles} style={t} opacity="0.3" />
      <path d="M530 86 Q520 200 525 390 L535 390 Q540 200 535 86 Z" fill={colors.textiles} style={t} opacity="0.3" />

      {/* === SOFA === */}
      <g filter="url(#lr-shadow)">
        {/* Sofa back */}
        <rect x="120" y="255" width="340" height="80" rx="12" fill={colors.textiles} style={t} />
        {/* Sofa seat */}
        <rect x="115" y="310" width="350" height="60" rx="10" fill={colors.textiles} style={t} />
        {/* Seat shadow/crease */}
        <rect x="130" y="315" width="320" height="4" rx="2" fill="#000" opacity="0.06" />
        {/* Left arm */}
        <rect x="108" y="260" width="30" height="115" rx="10" fill={colors.textiles} style={t} />
        <rect x="108" y="260" width="30" height="115" rx="10" fill="#000" opacity="0.04" />
        {/* Right arm */}
        <rect x="442" y="260" width="30" height="115" rx="10" fill={colors.textiles} style={t} />
        <rect x="442" y="260" width="30" height="115" rx="10" fill="#fff" opacity="0.04" />
        {/* Sofa legs */}
        <rect x="135" y="370" width="6" height="20" rx="2" fill={colors.floor} style={t} opacity="0.6" />
        <rect x="440" y="370" width="6" height="20" rx="2" fill={colors.floor} style={t} opacity="0.6" />
      </g>

      {/* Accent pillows */}
      <g filter="url(#lr-shadow-sm)">
        <ellipse cx="175" cy="295" rx="28" ry="22" fill={colors.accents} style={t} />
        <ellipse cx="175" cy="295" rx="28" ry="22" fill="#fff" opacity="0.08" />
        <ellipse cx="405" cy="295" rx="28" ry="22" fill={colors.accents} style={t} />
        <ellipse cx="405" cy="295" rx="28" ry="22" fill="#000" opacity="0.05" />
        {/* Third pillow different shade */}
        <ellipse cx="290" cy="290" rx="24" ry="18" fill={colors.feature} style={t} opacity="0.7" />
      </g>

      {/* === COFFEE TABLE === */}
      <g filter="url(#lr-shadow-sm)">
        {/* Table top */}
        <rect x="200" y="380" width="180" height="14" rx="3" fill={colors.feature} style={t} />
        <rect x="200" y="380" width="180" height="6" rx="3" fill="#fff" opacity="0.08" />
        {/* Table legs */}
        <rect x="215" y="394" width="4" height="16" fill={colors.feature} style={t} opacity="0.7" />
        <rect x="361" y="394" width="4" height="16" fill={colors.feature} style={t} opacity="0.7" />
        {/* Books on table */}
        <rect x="250" y="373" width="40" height="7" rx="1" fill={colors.accents} style={t} opacity="0.6" />
        <rect x="255" y="367" width="30" height="6" rx="1" fill={colors.walls} style={t} opacity="0.5" />
        {/* Small vase */}
        <rect x="310" y="365" width="12" height="15" rx="4" fill={colors.accents} style={t} opacity="0.7" />
        <circle cx="312" cy="360" r="4" fill="#7A9E7A" opacity="0.5" />
        <circle cx="318" cy="358" r="3" fill="#6B8E6B" opacity="0.4" />
      </g>

      {/* === SIDE TABLE + LAMP (right) === */}
      <g filter="url(#lr-shadow-sm)">
        <rect x="530" y="310" width="60" height="80" rx="5" fill={colors.feature} style={t} />
        <rect x="530" y="310" width="60" height="6" rx="3" fill="#fff" opacity="0.06" />
        {/* Lamp */}
        <rect x="554" y="260" width="12" height="50" rx="3" fill={colors.trim} style={t} opacity="0.8" />
        <path d="M540 260 Q560 240 580 260 Z" fill={colors.accents} style={t} opacity="0.55" />
        {/* Lamp shade */}
        <ellipse cx="560" cy="260" rx="24" ry="8" fill={colors.textiles} style={t} opacity="0.4" />
      </g>

      {/* === FLOOR LAMP (left) === */}
      <g filter="url(#lr-shadow-sm)">
        <rect x="62" y="180" width="5" height="210" rx="2" fill={colors.accents} style={t} opacity="0.5" />
        <circle cx="65" cy="178" r="16" fill={colors.textiles} style={t} opacity="0.35" />
        <circle cx="65" cy="178" r="10" fill={colors.textiles} style={t} opacity="0.2" />
        {/* Lamp base */}
        <ellipse cx="65" cy="390" rx="12" ry="4" fill={colors.accents} style={t} opacity="0.4" />
      </g>

      {/* === WALL ART (left) === */}
      <g filter="url(#lr-shadow-sm)">
        <rect x="60" y="110" width="90" height="110" rx="3" fill={colors.feature} style={t} />
        <rect x="60" y="110" width="90" height="110" rx="3" fill="none" stroke={colors.trim} strokeWidth="3" style={ts} opacity="0.5" />
        {/* Art inner abstract shape */}
        <circle cx="105" cy="155" r="25" fill={colors.accents} style={t} opacity="0.3" />
        <rect x="80" y="145" width="50" height="30" rx="2" fill={colors.walls} style={t} opacity="0.15" />
      </g>

      {/* === WALL ART (right) === */}
      <g filter="url(#lr-shadow-sm)">
        <rect x="620" y="120" width="70" height="90" rx="3" fill={colors.accents} style={t} opacity="0.5" />
        <rect x="620" y="120" width="70" height="90" rx="3" fill="none" stroke={colors.trim} strokeWidth="2" style={ts} opacity="0.4" />
      </g>

      {/* === PLANT === */}
      <g filter="url(#lr-shadow-sm)">
        <rect x="680" y="330" width="40" height="58" rx="8" fill={colors.feature} style={t} opacity="0.6" />
        <ellipse cx="700" cy="320" rx="30" ry="28" fill="#5C8C5C" opacity="0.45" />
        <ellipse cx="690" cy="310" rx="18" ry="20" fill="#6B9E6B" opacity="0.35" />
        <ellipse cx="712" cy="315" rx="15" ry="16" fill="#4A7A4A" opacity="0.3" />
      </g>

      {/* === RUG === */}
      <ellipse cx="290" cy="440" rx="220" ry="35" fill={colors.textiles} style={t} opacity="0.25" />
      <ellipse cx="290" cy="440" rx="200" ry="28" fill={colors.accents} style={t} opacity="0.1" />
    </svg>
  );
}
