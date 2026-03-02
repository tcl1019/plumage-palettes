import React from 'react';

export default function BedroomSVG({ colors }) {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto rounded-xl overflow-hidden">
      {/* Ceiling */}
      <rect x="0" y="0" width="400" height="40" fill={colors.ceiling} style={{ transition: 'fill 400ms ease' }} />
      {/* Walls */}
      <rect x="0" y="40" width="400" height="180" fill={colors.walls} style={{ transition: 'fill 400ms ease' }} />
      {/* Floor */}
      <rect x="0" y="220" width="400" height="60" fill={colors.floor} style={{ transition: 'fill 400ms ease' }} />

      {/* Crown molding */}
      <rect x="0" y="38" width="400" height="6" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />
      {/* Baseboard */}
      <rect x="0" y="216" width="400" height="8" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />

      {/* Headboard */}
      <rect x="80" y="100" width="180" height="80" rx="6" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />

      {/* Bed */}
      <rect x="70" y="170" width="200" height="50" rx="4" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} />
      {/* Pillows */}
      <ellipse cx="125" cy="165" rx="30" ry="16" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} opacity="0.9" />
      <ellipse cx="215" cy="165" rx="30" ry="16" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} opacity="0.9" />
      {/* Accent throw */}
      <rect x="120" y="185" width="100" height="20" rx="3" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} opacity="0.8" />

      {/* Nightstand left */}
      <rect x="30" y="170" width="30" height="45" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} opacity="0.7" />
      {/* Lamp */}
      <rect x="40" y="152" width="8" height="18" rx="2" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />
      <circle cx="44" cy="148" r="10" fill={colors.accents} opacity="0.5" style={{ transition: 'fill 400ms ease' }} />

      {/* Nightstand right */}
      <rect x="280" y="170" width="30" height="45" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} opacity="0.7" />

      {/* Window with curtains */}
      <rect x="300" y="55" width="60" height="90" rx="2" fill="#D4E6F1" opacity="0.6" />
      <rect x="300" y="55" width="60" height="90" rx="2" fill="none" stroke={colors.trim} strokeWidth="3" style={{ transition: 'stroke 400ms ease' }} />
      {/* Curtains */}
      <rect x="290" y="50" width="18" height="110" rx="2" fill={colors.textiles} opacity="0.5" style={{ transition: 'fill 400ms ease' }} />
      <rect x="352" y="50" width="18" height="110" rx="2" fill={colors.textiles} opacity="0.5" style={{ transition: 'fill 400ms ease' }} />

      {/* Rug */}
      <ellipse cx="170" cy="248" rx="100" ry="18" fill={colors.textiles} opacity="0.4" style={{ transition: 'fill 400ms ease' }} />

      {/* Wall art */}
      <rect x="30" y="65" width="35" height="45" rx="2" fill={colors.accents} opacity="0.6" style={{ transition: 'fill 400ms ease' }} />
      <rect x="30" y="65" width="35" height="45" rx="2" fill="none" stroke={colors.trim} strokeWidth="2" style={{ transition: 'stroke 400ms ease' }} />
    </svg>
  );
}
