import React from 'react';

export default function BathroomSVG({ colors }) {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto rounded-xl overflow-hidden">
      {/* Ceiling */}
      <rect x="0" y="0" width="400" height="40" fill={colors.ceiling} style={{ transition: 'fill 400ms ease' }} />
      {/* Walls */}
      <rect x="0" y="40" width="400" height="180" fill={colors.walls} style={{ transition: 'fill 400ms ease' }} />
      {/* Tile floor */}
      <rect x="0" y="220" width="400" height="60" fill={colors.floor} style={{ transition: 'fill 400ms ease' }} />
      {/* Floor tile pattern */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={i * 40} y1="220" x2={i * 40} y2="280" stroke={colors.trim} strokeWidth="0.5" opacity="0.3" style={{ transition: 'stroke 400ms ease' }} />
      ))}

      {/* Vanity */}
      <rect x="30" y="140" width="120" height="80" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />
      {/* Countertop */}
      <rect x="28" y="137" width="124" height="8" rx="2" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />
      {/* Sink */}
      <ellipse cx="90" cy="143" rx="20" ry="5" fill={colors.walls} opacity="0.5" style={{ transition: 'fill 400ms ease' }} />
      {/* Vanity handles */}
      <rect x="55" y="180" width="12" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <rect x="115" y="180" width="12" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />

      {/* Mirror */}
      <rect x="50" y="55" width="80" height="75" rx="4" fill="#D4E6F1" opacity="0.4" />
      <rect x="50" y="55" width="80" height="75" rx="4" fill="none" stroke={colors.trim} strokeWidth="3" style={{ transition: 'stroke 400ms ease' }} />

      {/* Towel rack */}
      <rect x="180" y="130" width="40" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      {/* Towels */}
      <rect x="185" y="133" width="15" height="35" rx="2" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} />
      <rect x="202" y="133" width="15" height="30" rx="2" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} opacity="0.7" />

      {/* Bathtub / shower area */}
      <rect x="260" y="100" width="120" height="120" rx="4" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} opacity="0.3" />
      <rect x="265" y="105" width="110" height="110" rx="3" fill={colors.walls} style={{ transition: 'fill 400ms ease' }} opacity="0.5" />
      {/* Shower head */}
      <circle cx="320" cy="60" r="10" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} opacity="0.5" />
      <rect x="318" y="70" width="4" height="35" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} opacity="0.4" />

      {/* Small plant */}
      <rect x="165" y="85" width="12" height="16" rx="3" fill={colors.feature} opacity="0.5" style={{ transition: 'fill 400ms ease' }} />
      <circle cx="171" cy="80" r="10" fill="#6B8E6B" opacity="0.4" />
    </svg>
  );
}
