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
    wallSpread: 0.45,
    lightAngle: 135,
    warmth: 0.15,
    accentY: 72,
    accentSize: 22,
    textileBlur: 18,
    featureX: 78,
    featureY: 30,
    featureSize: 32,
    floorHeight: 38,
  },
  'bedroom': {
    wallSpread: 0.55,
    lightAngle: 180,
    warmth: 0.08,
    accentY: 55,
    accentSize: 18,
    textileBlur: 25,
    featureX: 25,
    featureY: 40,
    featureSize: 38,
    floorHeight: 30,
  },
  'kitchen': {
    wallSpread: 0.35,
    lightAngle: 90,
    warmth: 0.12,
    accentY: 50,
    accentSize: 26,
    textileBlur: 12,
    featureX: 68,
    featureY: 20,
    featureSize: 28,
    floorHeight: 45,
  },
  'bathroom': {
    wallSpread: 0.48,
    lightAngle: 160,
    warmth: -0.05,
    accentY: 62,
    accentSize: 20,
    textileBlur: 16,
    featureX: 45,
    featureY: 35,
    featureSize: 34,
    floorHeight: 35,
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
    ? 'rgba(255,240,220,0.06)'
    : wallTemp === 'cool'
      ? 'rgba(220,235,255,0.06)'
      : 'rgba(245,245,240,0.04)';

  const floorTop = 100 - mood.floorHeight;

  return (
    <div className="absolute inset-0 overflow-hidden" key={animKey}>
      {/* Layer 1: Wall — upper zone */}
      <div
        className="absolute inset-0 atmo-layer-base"
        style={{
          background: `linear-gradient(180deg, ${hexRgba(colors.ceiling, 0.85)} 0%, ${colors.walls} ${Math.round(mood.wallSpread * 60)}%, ${colors.walls} ${floorTop - 5}%, transparent ${floorTop}%)`,
        }}
      />

      {/* Layer 2: Floor — distinct lower zone */}
      <div
        className="absolute inset-0 atmo-layer-floor"
        style={{
          background: `linear-gradient(0deg, ${colors.floor} 0%, ${hexRgba(colors.floor, 0.9)} ${Math.round(mood.floorHeight * 0.5)}%, ${hexRgba(colors.floor, 0.4)} ${Math.round(mood.floorHeight * 0.8)}%, transparent ${mood.floorHeight}%)`,
        }}
      />

      {/* Layer 3: Trim line — visible divider between wall and floor zones */}
      <div
        className="absolute atmo-layer-trim"
        style={{
          left: 0,
          right: 0,
          top: `${floorTop - 2}%`,
          height: '4%',
          background: `linear-gradient(90deg, transparent 3%, ${hexRgba(colors.trim, 0.7)} 15%, ${colors.trim} 50%, ${hexRgba(colors.trim, 0.7)} 85%, transparent 97%)`,
          filter: 'blur(2px)',
        }}
      />

      {/* Layer 4: Textile — mid-zone furnishing shape */}
      <div
        className="absolute atmo-layer-textile"
        style={{
          left: '8%',
          top: `${floorTop - 22}%`,
          width: '84%',
          height: '35%',
          borderRadius: '40%',
          background: `radial-gradient(ellipse at 50% 55%, ${hexRgba(colors.textiles, 0.85)} 0%, ${hexRgba(colors.textiles, 0.5)} 35%, ${hexRgba(colors.textiles, 0.15)} 65%, transparent 85%)`,
          filter: `blur(${mood.textileBlur}px)`,
        }}
      />

      {/* Layer 5: Feature — offset shape suggesting furniture or decor */}
      <div
        className="absolute atmo-layer-feature"
        style={{
          left: `${mood.featureX - mood.featureSize / 2}%`,
          top: `${mood.featureY - mood.featureSize / 3}%`,
          width: `${mood.featureSize}%`,
          height: `${mood.featureSize * 0.9}%`,
          borderRadius: '30%',
          background: `radial-gradient(ellipse at 50% 50%, ${hexRgba(colors.feature, 0.75)} 0%, ${hexRgba(colors.feature, 0.35)} 45%, transparent 75%)`,
          filter: 'blur(14px)',
        }}
      />

      {/* Layer 6: Accent pop — vivid focal point */}
      <div
        className="absolute atmo-layer-accent"
        style={{
          left: `${50 - mood.accentSize / 2}%`,
          top: `${mood.accentY - mood.accentSize / 2}%`,
          width: `${mood.accentSize}%`,
          height: `${mood.accentSize}%`,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, ${colors.accents} 0%, ${hexRgba(colors.accents, 0.6)} 30%, ${hexRgba(colors.accents, 0.15)} 60%, transparent 80%)`,
          filter: 'blur(8px)',
        }}
      />

      {/* Layer 7: Directional light */}
      <div
        className="absolute inset-0 atmo-layer-light"
        style={{
          background: `linear-gradient(${mood.lightAngle}deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)`,
        }}
      />

      {/* Layer 8: Temperature tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: lightTint }}
      />

      {/* Layer 9: Grain */}
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
          background: `linear-gradient(0deg, ${colors.floor} 0%, ${hexRgba(colors.floor, 0.6)} 25%, transparent 40%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 65%, ${hexRgba(colors.textiles, 0.8)} 0%, ${hexRgba(colors.textiles, 0.3)} 30%, transparent 55%),
            radial-gradient(ellipse at 72% 38%, ${hexRgba(colors.feature, 0.65)} 0%, ${hexRgba(colors.feature, 0.2)} 30%, transparent 55%),
            radial-gradient(circle at 40% 60%, ${hexRgba(colors.accents, 0.7)} 0%, ${hexRgba(colors.accents, 0.2)} 25%, transparent 45%)
          `,
          filter: 'blur(12px)',
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
