import React from 'react';

export default function LivingRoomSVG({ colors }) {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto rounded-xl overflow-hidden">
      {/* Ceiling */}
      <rect x="0" y="0" width="400" height="40" fill={colors.ceiling} style={{ transition: 'fill 400ms ease' }} />
      {/* Walls */}
      <rect x="0" y="40" width="400" height="180" fill={colors.walls} style={{ transition: 'fill 400ms ease' }} />
      {/* Floor */}
      <rect x="0" y="220" width="400" height="60" fill={colors.floor} style={{ transition: 'fill 400ms ease' }} />

      {/* Crown molding / trim */}
      <rect x="0" y="38" width="400" height="6" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />
      {/* Baseboard */}
      <rect x="0" y="216" width="400" height="8" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />

      {/* Window */}
      <rect x="155" y="60" width="90" height="100" rx="2" fill="#D4E6F1" opacity="0.6" />
      <rect x="155" y="60" width="90" height="100" rx="2" fill="none" stroke={colors.trim} strokeWidth="4" style={{ transition: 'stroke 400ms ease' }} />
      <line x1="200" y1="60" x2="200" y2="160" stroke={colors.trim} strokeWidth="2" style={{ transition: 'stroke 400ms ease' }} />
      <line x1="155" y1="110" x2="245" y2="110" stroke={colors.trim} strokeWidth="2" style={{ transition: 'stroke 400ms ease' }} />

      {/* Rug */}
      <ellipse cx="200" cy="248" rx="120" ry="20" fill={colors.textiles} opacity="0.7" style={{ transition: 'fill 400ms ease' }} />

      {/* Sofa */}
      <rect x="80" y="160" width="160" height="55" rx="8" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} />
      <rect x="75" y="155" width="170" height="15" rx="6" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} opacity="0.8" />
      {/* Sofa arms */}
      <rect x="75" y="155" width="18" height="60" rx="6" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} opacity="0.85" />
      <rect x="227" y="155" width="18" height="60" rx="6" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} opacity="0.85" />

      {/* Accent pillows */}
      <ellipse cx="110" cy="170" rx="14" ry="11" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <ellipse cx="210" cy="170" rx="14" ry="11" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />

      {/* Side table */}
      <rect x="270" y="175" width="35" height="40" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />
      {/* Lamp on table */}
      <rect x="282" y="155" width="10" height="20" rx="2" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />
      <path d="M275 155 L305 155 L290 140 Z" fill={colors.accents} opacity="0.7" style={{ transition: 'fill 400ms ease' }} />

      {/* Wall art */}
      <rect x="315" y="75" width="50" height="60" rx="2" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />
      <rect x="315" y="75" width="50" height="60" rx="2" fill="none" stroke={colors.trim} strokeWidth="2" style={{ transition: 'stroke 400ms ease' }} />

      {/* Plant */}
      <rect x="40" y="185" width="16" height="28" rx="3" fill={colors.feature} opacity="0.6" style={{ transition: 'fill 400ms ease' }} />
      <circle cx="48" cy="178" r="18" fill="#6B8E6B" opacity="0.5" />
      <circle cx="42" cy="172" r="12" fill="#7A9E7A" opacity="0.4" />
    </svg>
  );
}
