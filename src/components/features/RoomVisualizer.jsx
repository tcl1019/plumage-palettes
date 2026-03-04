import React, { useState, useMemo } from 'react';
import { Home, BedDouble, CookingPot, Bath } from 'lucide-react';
import { mapBirdToRoomColors, getBirdHighestRatedRoom } from '../../utils/paletteHelpers';
import { hexToRgb, rgbToHsl } from '../../utils/colorUtils';

const ROOM_OPTIONS = [
  { id: 'living-room', label: 'Living', Icon: Home },
  { id: 'bedroom', label: 'Bedroom', Icon: BedDouble },
  { id: 'kitchen', label: 'Kitchen', Icon: CookingPot },
  { id: 'bathroom', label: 'Bath', Icon: Bath },
];

// Each room "mood" adjusts where and how color layers sit
const ROOM_MOODS = {
  'living-room': {
    wallSpread: 0.55,   // wall color fills top 55%
    lightAngle: 135,    // light from upper-left
    warmth: 0.15,       // warm overlay intensity
    accentY: 70,        // accent pop sits lower
    accentSize: 18,
    textileBlur: 50,
    featureX: 75,       // feature blob offset
    featureY: 35,
  },
  'bedroom': {
    wallSpread: 0.60,   // more enveloping
    lightAngle: 180,    // light from above (soft, diffuse)
    warmth: 0.08,
    accentY: 60,
    accentSize: 14,
    textileBlur: 60,
    featureX: 30,
    featureY: 45,
  },
  'kitchen': {
    wallSpread: 0.45,   // less wall, more surface
    lightAngle: 90,     // bright side light
    warmth: 0.12,
    accentY: 55,
    accentSize: 22,
    textileBlur: 35,
    featureX: 65,
    featureY: 25,
  },
  'bathroom': {
    wallSpread: 0.50,
    lightAngle: 160,
    warmth: -0.05,      // slightly cool
    accentY: 65,
    accentSize: 16,
    textileBlur: 45,
    featureX: 50,
    featureY: 40,
  },
};

/**
 * Convert hex to rgba string
 */
function hexRgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(128,128,128,${alpha})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

/**
 * Determine if a color is warm or cool for light tinting
 */
function colorTemperature(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'neutral';
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (s < 10) return 'neutral';
  if ((h >= 0 && h <= 70) || h >= 330) return 'warm';
  return 'cool';
}

function AtmosphericScene({ colors, mood, animKey }) {
  const wallTemp = colorTemperature(colors.walls);
  const lightTint = wallTemp === 'warm'
    ? 'rgba(255,240,220,0.07)'
    : wallTemp === 'cool'
      ? 'rgba(220,235,255,0.07)'
      : 'rgba(245,245,240,0.05)';

  return (
    <div className="absolute inset-0 overflow-hidden" key={animKey}>
      {/* Layer 1: Wall color — fills the whole canvas as base */}
      <div
        className="absolute inset-0 atmo-layer-base"
        style={{ backgroundColor: colors.walls }}
      />

      {/* Layer 2: Ceiling fade — lighter wash at the top */}
      <div
        className="absolute inset-0 atmo-layer-ceiling"
        style={{
          background: `linear-gradient(180deg, ${hexRgba(colors.ceiling, 0.5)} 0%, transparent ${mood.wallSpread * 80}%)`,
        }}
      />

      {/* Layer 3: Floor wash — grounds the bottom */}
      <div
        className="absolute inset-0 atmo-layer-floor"
        style={{
          background: `linear-gradient(0deg, ${hexRgba(colors.floor, 0.7)} 0%, ${hexRgba(colors.floor, 0.3)} 20%, transparent 45%)`,
        }}
      />

      {/* Layer 4: Textile bloom — large soft blob in the lower-middle */}
      <div
        className="absolute atmo-layer-textile"
        style={{
          left: '10%',
          top: '35%',
          width: '80%',
          height: '55%',
          background: `radial-gradient(ellipse at 50% 60%, ${hexRgba(colors.textiles, 0.55)} 0%, ${hexRgba(colors.textiles, 0.15)} 50%, transparent 75%)`,
          filter: `blur(${mood.textileBlur}px)`,
        }}
      />

      {/* Layer 5: Feature color — offset blob suggesting a furniture piece or accent wall */}
      <div
        className="absolute atmo-layer-feature"
        style={{
          left: `${mood.featureX - 18}%`,
          top: `${mood.featureY - 12}%`,
          width: '36%',
          height: '35%',
          background: `radial-gradient(ellipse at 50% 50%, ${hexRgba(colors.feature, 0.45)} 0%, ${hexRgba(colors.feature, 0.1)} 55%, transparent 80%)`,
          filter: 'blur(30px)',
        }}
      />

      {/* Layer 6: Accent pop — vivid small bloom */}
      <div
        className="absolute atmo-layer-accent"
        style={{
          left: `${50 - mood.accentSize / 2}%`,
          top: `${mood.accentY - mood.accentSize / 2}%`,
          width: `${mood.accentSize}%`,
          height: `${mood.accentSize}%`,
          background: `radial-gradient(circle at 50% 50%, ${hexRgba(colors.accents, 0.6)} 0%, ${hexRgba(colors.accents, 0.2)} 40%, transparent 70%)`,
          filter: 'blur(15px)',
        }}
      />

      {/* Layer 7: Trim line — subtle horizontal band suggesting molding/baseboard */}
      <div
        className="absolute atmo-layer-trim"
        style={{
          left: 0,
          right: 0,
          bottom: '18%',
          height: '3%',
          background: `linear-gradient(90deg, transparent 5%, ${hexRgba(colors.trim, 0.35)} 20%, ${hexRgba(colors.trim, 0.4)} 50%, ${hexRgba(colors.trim, 0.35)} 80%, transparent 95%)`,
          filter: 'blur(4px)',
        }}
      />

      {/* Layer 8: Light source — directional glow */}
      <div
        className="absolute inset-0 atmo-layer-light"
        style={{
          background: `linear-gradient(${mood.lightAngle}deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.06) 100%)`,
        }}
      />

      {/* Layer 9: Temperature tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: lightTint }}
      />

      {/* Layer 10: Subtle grain texture for depth */}
      <div className="absolute inset-0 atmo-grain pointer-events-none" />
    </div>
  );
}

function CompactAtmosphere({ colors }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: colors.walls }} />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 70%, ${hexRgba(colors.textiles, 0.5)} 0%, transparent 60%),
            radial-gradient(ellipse at 70% 40%, ${hexRgba(colors.feature, 0.35)} 0%, transparent 50%),
            radial-gradient(circle at 45% 65%, ${hexRgba(colors.accents, 0.45)} 0%, transparent 40%),
            linear-gradient(0deg, ${hexRgba(colors.floor, 0.5)} 0%, transparent 35%)
          `,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}

export default function RoomVisualizer({ bird, defaultRoom, compact = false, colors: colorsProp }) {
  const bestRoom = defaultRoom || getBirdHighestRatedRoom(bird);
  const [activeRoom, setActiveRoom] = useState(bestRoom);
  const colors = colorsProp || mapBirdToRoomColors(bird);
  const mood = ROOM_MOODS[activeRoom] || ROOM_MOODS['living-room'];

  return (
    <div>
      {!compact && (
        <div className="flex gap-1 mb-3">
          {ROOM_OPTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveRoom(id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeRoom === id
                  ? 'bg-plumage-primary text-white shadow-sm'
                  : 'bg-plumage-surface-alt text-gray-500 hover:text-gray-700 hover:bg-plumage-surface-alt/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-plumage-border/60 aspect-[16/9]">
        {compact ? (
          <CompactAtmosphere colors={colors} />
        ) : (
          <AtmosphericScene colors={colors} mood={mood} animKey={activeRoom} />
        )}
      </div>
    </div>
  );
}
