import React from 'react';

export default function KitchenSVG({ colors }) {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto rounded-xl overflow-hidden">
      {/* Ceiling */}
      <rect x="0" y="0" width="400" height="40" fill={colors.ceiling} style={{ transition: 'fill 400ms ease' }} />
      {/* Walls */}
      <rect x="0" y="40" width="400" height="180" fill={colors.walls} style={{ transition: 'fill 400ms ease' }} />
      {/* Floor */}
      <rect x="0" y="220" width="400" height="60" fill={colors.floor} style={{ transition: 'fill 400ms ease' }} />

      {/* Crown molding */}
      <rect x="0" y="38" width="400" height="5" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />

      {/* Upper cabinets */}
      <rect x="20" y="50" width="70" height="70" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />
      <rect x="100" y="50" width="70" height="70" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />
      <rect x="230" y="50" width="70" height="70" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />
      <rect x="310" y="50" width="70" height="70" rx="3" fill={colors.feature} style={{ transition: 'fill 400ms ease' }} />
      {/* Cabinet handles */}
      <rect x="50" y="80" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <rect x="130" y="80" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <rect x="260" y="80" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <rect x="340" y="80" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />

      {/* Backsplash */}
      <rect x="15" y="125" width="370" height="30" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} opacity="0.8" />

      {/* Counter */}
      <rect x="15" y="155" width="370" height="10" rx="1" fill={colors.trim} style={{ transition: 'fill 400ms ease' }} />

      {/* Lower cabinets */}
      <rect x="20" y="165" width="80" height="55" rx="3" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} />
      <rect x="110" y="165" width="80" height="55" rx="3" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} />
      <rect x="210" y="165" width="80" height="55" rx="3" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} />
      <rect x="300" y="165" width="80" height="55" rx="3" fill={colors.textiles} style={{ transition: 'fill 400ms ease' }} />
      {/* Lower handles */}
      <rect x="55" y="190" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <rect x="145" y="190" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <rect x="245" y="190" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />
      <rect x="335" y="190" width="10" height="3" rx="1" fill={colors.accents} style={{ transition: 'fill 400ms ease' }} />

      {/* Window */}
      <rect x="180" y="52" width="40" height="65" rx="2" fill="#D4E6F1" opacity="0.6" />
      <rect x="180" y="52" width="40" height="65" rx="2" fill="none" stroke={colors.trim} strokeWidth="3" style={{ transition: 'stroke 400ms ease' }} />
    </svg>
  );
}
