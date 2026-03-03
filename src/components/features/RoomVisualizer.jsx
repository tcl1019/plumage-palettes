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

// Different layout compositions per room type — abstract architectural grids
// Each block: [gridColumn, gridRow, label, colorKey]
const LAYOUTS = {
  'living-room': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/10]',
    blocks: [
      // Large wall area (dominant)
      ['col-span-8 row-span-4', 'walls', 'Walls'],
      // Sofa / textile block
      ['col-span-8 row-span-2', 'textiles', 'Textiles'],
      // Feature column (bookshelf/art)
      ['col-span-4 row-span-3', 'feature', 'Feature'],
      // Accent strip
      ['col-span-4 row-span-1', 'accents', 'Accents'],
      // Trim bar
      ['col-span-4 row-span-1', 'trim', 'Trim'],
      // Floor strip
      ['col-span-4 row-span-1', 'floor', ''],
    ],
  },
  'bedroom': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/10]',
    blocks: [
      // Wall area
      ['col-span-12 row-span-2', 'walls', 'Walls'],
      // Headboard / feature
      ['col-span-5 row-span-2', 'feature', 'Feature'],
      // Bedding / textiles
      ['col-span-7 row-span-2', 'textiles', 'Textiles'],
      // Accent pillows
      ['col-span-3 row-span-1', 'accents', 'Accents'],
      // Trim bar
      ['col-span-5 row-span-1', 'trim', 'Trim'],
      // Floor
      ['col-span-4 row-span-1', 'floor', ''],
    ],
  },
  'kitchen': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/10]',
    blocks: [
      // Upper cabinets / feature
      ['col-span-8 row-span-2', 'feature', 'Cabinets'],
      // Wall / backsplash
      ['col-span-4 row-span-3', 'walls', 'Walls'],
      // Countertop / trim
      ['col-span-8 row-span-1', 'trim', 'Counter'],
      // Lower cabinets / textiles
      ['col-span-8 row-span-2', 'textiles', 'Base'],
      // Accents (hardware, fixtures)
      ['col-span-4 row-span-2', 'accents', 'Accents'],
      // Floor
      ['col-span-12 row-span-1', 'floor', ''],
    ],
  },
  'bathroom': {
    grid: 'grid-cols-12 grid-rows-6',
    aspect: 'aspect-[16/10]',
    blocks: [
      // Walls
      ['col-span-7 row-span-3', 'walls', 'Walls'],
      // Mirror / accents
      ['col-span-5 row-span-2', 'accents', 'Accents'],
      // Trim / vanity top
      ['col-span-5 row-span-1', 'trim', 'Trim'],
      // Textiles (towels, shower curtain)
      ['col-span-7 row-span-2', 'textiles', 'Textiles'],
      // Feature (vanity, tile)
      ['col-span-5 row-span-2', 'feature', 'Feature'],
      // Floor
      ['col-span-12 row-span-1', 'floor', ''],
    ],
  },
};

function ColorBlock({ className, color, label }) {
  const textColor = getTextColor(color);
  const isLight = textColor === '#111827';
  return (
    <div
      className={`${className} relative overflow-hidden transition-all duration-500 ease-out group`}
      style={{ backgroundColor: color }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${isLight ? '#000' : '#fff'} 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
      {/* Label */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{ color: textColor }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
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
                  ? 'bg-plumage-primary text-white'
                  : 'bg-plumage-surface-alt text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}
      <div className={`rounded-xl overflow-hidden shadow-sm border border-plumage-border ${layout.aspect}`}>
        <div className={`grid ${layout.grid} gap-[2px] bg-white/10 h-full w-full`}>
          {layout.blocks.map((block, i) => (
            <ColorBlock
              key={`${activeRoom}-${i}`}
              className={block[0]}
              color={colors[block[1]] || '#E5E5E5'}
              label={compact ? '' : block[2]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
