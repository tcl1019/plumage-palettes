import React, { useState } from 'react';
import { Home, BedDouble, CookingPot, Bath } from 'lucide-react';
import LivingRoomSVG from '../rooms/LivingRoomSVG';
import BedroomSVG from '../rooms/BedroomSVG';
import KitchenSVG from '../rooms/KitchenSVG';
import BathroomSVG from '../rooms/BathroomSVG';
import { mapBirdToRoomColors, getBirdHighestRatedRoom } from '../../utils/paletteHelpers';

const ROOM_OPTIONS = [
  { id: 'living-room', label: 'Living', Icon: Home },
  { id: 'bedroom', label: 'Bedroom', Icon: BedDouble },
  { id: 'kitchen', label: 'Kitchen', Icon: CookingPot },
  { id: 'bathroom', label: 'Bath', Icon: Bath },
];

const ROOM_COMPONENTS = {
  'living-room': LivingRoomSVG,
  'bedroom': BedroomSVG,
  'kitchen': KitchenSVG,
  'bathroom': BathroomSVG,
};

export default function RoomVisualizer({ bird, defaultRoom, compact = false, colors: colorsProp }) {
  const bestRoom = defaultRoom || getBirdHighestRatedRoom(bird);
  const [activeRoom, setActiveRoom] = useState(bestRoom);
  const colors = colorsProp || mapBirdToRoomColors(bird);
  const RoomComponent = ROOM_COMPONENTS[activeRoom] || LivingRoomSVG;

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
      <div className="rounded-xl overflow-hidden shadow-sm border border-plumage-border">
        <RoomComponent colors={colors} />
      </div>
    </div>
  );
}
