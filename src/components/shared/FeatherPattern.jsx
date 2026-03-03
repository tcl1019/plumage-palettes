import React, { useMemo } from 'react';

// Seeded random for consistent patterns per bird
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function FeatherPattern({ colors, seed = 1, className = '', style = {} }) {
  const elements = useMemo(() => {
    const rand = seededRandom(seed);
    const hexColors = colors.map(c => typeof c === 'string' ? c : c.hex);

    // Large soft orbs — the main visual
    const orbs = hexColors.slice(0, 6).map((hex, i) => {
      const cx = 20 + rand() * 60; // cluster toward center
      const cy = 15 + rand() * 70;
      const r = 25 + rand() * 30; // large radii
      const opacity = 0.25 + rand() * 0.2;
      return { cx, cy, r, hex, opacity, key: `orb-${i}` };
    });

    // Subtle feather barb curves
    const barbs = Array.from({ length: 5 }, (_, i) => {
      const startX = 30 + rand() * 40;
      const startY = 10 + rand() * 80;
      const endX = startX + (rand() - 0.5) * 30;
      const endY = startY + 20 + rand() * 30;
      const cpX = startX + (rand() - 0.5) * 40;
      const cpY = (startY + endY) / 2;
      const hex = hexColors[Math.floor(rand() * hexColors.length)];
      const opacity = 0.15 + rand() * 0.15;
      return { startX, startY, endX, endY, cpX, cpY, hex, opacity, key: `barb-${i}` };
    });

    return { orbs, barbs };
  }, [colors, seed]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <defs>
        {elements.orbs.map((orb, i) => (
          <radialGradient key={orb.key} id={`feather-grad-${seed}-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={orb.hex} stopOpacity={orb.opacity * 1.2} />
            <stop offset="70%" stopColor={orb.hex} stopOpacity={orb.opacity * 0.5} />
            <stop offset="100%" stopColor={orb.hex} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Background fill */}
      <rect width="100" height="100" fill="#111111" />

      {/* Large soft color orbs */}
      {elements.orbs.map((orb, i) => (
        <ellipse
          key={orb.key}
          cx={orb.cx}
          cy={orb.cy}
          rx={orb.r}
          ry={orb.r * (0.85 + (i % 3) * 0.1)}
          fill={`url(#feather-grad-${seed}-${i})`}
          style={{ mixBlendMode: 'screen' }}
        />
      ))}

      {/* Feather barb curves */}
      {elements.barbs.map(barb => (
        <path
          key={barb.key}
          d={`M ${barb.startX} ${barb.startY} Q ${barb.cpX} ${barb.cpY} ${barb.endX} ${barb.endY}`}
          fill="none"
          stroke={barb.hex}
          strokeWidth="0.3"
          strokeOpacity={barb.opacity}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
