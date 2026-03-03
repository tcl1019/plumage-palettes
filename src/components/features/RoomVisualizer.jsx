import React, { useState } from 'react';
import { Home, BedDouble, CookingPot, Bath } from 'lucide-react';
import { mapBirdToRoomColors, getBirdHighestRatedRoom } from '../../utils/paletteHelpers';
import { getTextColor } from '../../utils/colorUtils';

const ROOM_OPTIONS = [
  { id: 'living-room', label: 'Living', Icon: Home },
  { id: 'bedroom', label: 'Bedroom', Icon: BedDouble },
  { id: 'kitchen', label: 'Kitchen', Icon: CookingPot },
  { id: 'bathroom', label: 'Bath', Icon: Bath },
];

// Texture class per surface type for mood-board feel
const SURFACE_TEXTURE = {
  walls: 'texture-linen',
  textiles: 'texture-knit',
  floor: 'texture-grain',
  feature: 'texture-smooth',
  accents: 'texture-smooth',
  trim: '',
};

// Different layout compositions per room type — elevated abstract architectural grids
const LAYOUTS = {
  'living-room': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/9]',
    blocks: [
      ['col-span-8 row-span-4', 'walls', 'Walls'],
      ['col-span-8 row-span-2', 'textiles', 'Textiles'],
      ['col-span-4 row-span-3', 'feature', 'Feature'],
      ['col-span-4 row-span-1', 'accents', 'Accents'],
      ['col-span-4 row-span-1', 'trim', 'Trim'],
      ['col-span-4 row-span-1', 'floor', ''],
    ],
    // Floating accent shapes suggesting objects (relative position %, size)
    accents: [
      { x: 72, y: 15, w: 12, h: 18, shape: 'rect', key: 'feature', opacity: 0.3, label: '' }, // frame
      { x: 18, y: 68, w: 6, h: 6, shape: 'circle', key: 'accents', opacity: 0.5, label: '' }, // pillow
      { x: 85, y: 72, w: 3, h: 12, shape: 'rect', key: 'accents', opacity: 0.25, label: '' }, // lamp
    ],
  },
  'bedroom': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/9]',
    blocks: [
      ['col-span-12 row-span-2', 'walls', 'Walls'],
      ['col-span-5 row-span-2', 'feature', 'Headboard'],
      ['col-span-7 row-span-2', 'textiles', 'Bedding'],
      ['col-span-3 row-span-1', 'accents', 'Pillows'],
      ['col-span-5 row-span-1', 'trim', 'Trim'],
      ['col-span-4 row-span-1', 'floor', ''],
    ],
    accents: [
      { x: 45, y: 12, w: 10, h: 14, shape: 'rect', key: 'accents', opacity: 0.25, label: '' }, // art
      { x: 22, y: 55, w: 5, h: 5, shape: 'circle', key: 'accents', opacity: 0.4, label: '' }, // pillow
      { x: 88, y: 45, w: 4, h: 16, shape: 'rect', key: 'trim', opacity: 0.2, label: '' }, // nightstand
    ],
  },
  'kitchen': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/9]',
    blocks: [
      ['col-span-8 row-span-2', 'feature', 'Cabinets'],
      ['col-span-4 row-span-3', 'walls', 'Walls'],
      ['col-span-8 row-span-1', 'trim', 'Counter'],
      ['col-span-8 row-span-2', 'textiles', 'Base'],
      ['col-span-4 row-span-2', 'accents', 'Accents'],
      ['col-span-12 row-span-1', 'floor', ''],
    ],
    accents: [
      { x: 78, y: 18, w: 6, h: 8, shape: 'rect', key: 'accents', opacity: 0.35, label: '' }, // window
      { x: 30, y: 42, w: 4, h: 4, shape: 'circle', key: 'accents', opacity: 0.45, label: '' }, // hardware
    ],
  },
  'bathroom': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/9]',
    blocks: [
      ['col-span-7 row-span-3', 'walls', 'Walls'],
      ['col-span-5 row-span-2', 'accents', 'Mirror'],
      ['col-span-5 row-span-1', 'trim', 'Vanity'],
      ['col-span-7 row-span-2', 'textiles', 'Textiles'],
      ['col-span-5 row-span-2', 'feature', 'Tile'],
      ['col-span-12 row-span-1', 'floor', ''],
    ],
    accents: [
      { x: 65, y: 10, w: 14, h: 18, shape: 'rect', key: 'accents', opacity: 0.2, label: '' }, // mirror
      { x: 20, y: 65, w: 5, h: 8, shape: 'rect', key: 'textiles', opacity: 0.3, label: '' }, // towel
    ],
  },
};

function ColorBlock({ className, color, label, textureClass, index, animKey }) {
  const textColor = getTextColor(color);
  return (
    <div
      className={`${className} relative overflow-hidden rounded-lg group`}
      style={{
        backgroundColor: color,
        boxShadow: `inset 0 1px 2px rgba(255,255,255,0.12), inset 0 -1px 3px rgba(0,0,0,0.08)`,
        animation: 'blockReveal 400ms ease-out both',
        animationDelay: `${index * 60}ms`,
        transition: 'background-color 500ms ease-out',
      }}
      key={animKey}
    >
      {/* Surface texture overlay */}
      <div className={`absolute inset-0 ${textureClass} pointer-events-none`} />

      {/* Light source gradient (simulates window light from upper left) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)',
        }}
      />

      {/* Label — always visible at low opacity, brighter on hover */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-[9px] sm:text-[10px] tracking-[0.15em] opacity-30 group-hover:opacity-70 transition-opacity duration-300 select-none"
            style={{ color: textColor }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

function FloatingAccent({ accent, colors }) {
  const color = colors[accent.key] || '#888';
  const isCircle = accent.shape === 'circle';
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${accent.x}%`,
        top: `${accent.y}%`,
        width: `${accent.w}%`,
        height: `${accent.h}%`,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '4px',
        opacity: accent.opacity,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        animation: 'blockReveal 500ms ease-out both',
        animationDelay: '350ms',
        transition: 'background-color 500ms ease-out',
      }}
    />
  );
}

export default function RoomVisualizer({ bird, defaultRoom, compact = false, colors: colorsProp }) {
  const bestRoom = defaultRoom || getBirdHighestRatedRoom(bird);
  const [activeRoom, setActiveRoom] = useState(bestRoom);
  const colors = colorsProp || mapBirdToRoomColors(bird);
  const layout = LAYOUTS[activeRoom] || LAYOUTS['living-room'];

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
      <div className={`relative rounded-2xl overflow-hidden shadow-md border border-plumage-border/60 ${layout.aspect}`}>
        {/* Grid composition */}
        <div className={`grid ${layout.grid} gap-1 bg-white/20 h-full w-full p-1`} key={activeRoom}>
          {layout.blocks.map((block, i) => (
            <ColorBlock
              key={`${activeRoom}-${i}`}
              animKey={`${activeRoom}-${i}`}
              className={block[0]}
              color={colors[block[1]] || '#E5E5E5'}
              label={compact ? '' : block[2]}
              textureClass={SURFACE_TEXTURE[block[1]] || ''}
              index={i}
            />
          ))}
        </div>

        {/* Floating accent shapes — suggest objects without being literal */}
        {!compact && layout.accents && layout.accents.map((accent, i) => (
          <FloatingAccent key={`accent-${activeRoom}-${i}`} accent={accent} colors={colors} />
        ))}
      </div>
    </div>
  );
}
