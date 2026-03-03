import React, { useState } from 'react';
import { X, ArrowLeftRight, Search } from 'lucide-react';
import { birds } from '../../data/birds';
import PaletteStrip from '../shared/PaletteStrip';
import RoomVisualizer from './RoomVisualizer';
import { ROLE_LABELS } from '../../data/constants';
import { getUndertone } from '../../utils/colorUtils';
import { getSmartBird } from '../../utils/paletteHelpers';

export default function CompareView({ onClose, initialBirdIds = [] }) {
  const [leftBirdId, setLeftBirdId] = useState(initialBirdIds[0] || null);
  const [rightBirdId, setRightBirdId] = useState(initialBirdIds[1] || null);
  const [picking, setPicking] = useState(null); // 'left' | 'right' | null
  const [search, setSearch] = useState('');

  const leftBird = leftBirdId ? getSmartBird(birds.find(b => b.id === leftBirdId)) : null;
  const rightBird = rightBirdId ? getSmartBird(birds.find(b => b.id === rightBirdId)) : null;

  const filteredBirds = birds.filter(b => {
    if (!search) return true;
    return b.name.toLowerCase().includes(search.toLowerCase());
  });

  const selectBird = (birdId) => {
    if (picking === 'left') setLeftBirdId(birdId);
    else if (picking === 'right') setRightBirdId(birdId);
    setPicking(null);
    setSearch('');
  };

  const swap = () => {
    setLeftBirdId(rightBirdId);
    setRightBirdId(leftBirdId);
  };

  const renderSlot = (bird, side) => {
    if (!bird) {
      return (
        <button
          onClick={() => setPicking(side)}
          className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-plumage-primary/40 hover:text-plumage-primary transition-colors"
        >
          <span className="text-sm">Select a palette</span>
        </button>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setPicking(side)}
            className="font-display text-base text-gray-800 hover:text-plumage-primary transition-colors"
          >
            {bird.name}
          </button>
          <span className="text-[10px] text-gray-400">{bird.harmony.type}</span>
        </div>
        <PaletteStrip colors={bird.colors} height="h-10" clickable={false} className="mb-3 rounded-xl" />
        <RoomVisualizer bird={bird} compact />
        <div className="mt-3 space-y-1.5">
          {bird.colors.map((c, i) => {
            const ut = getUndertone(c.hex);
            const roleInfo = ROLE_LABELS[c.role];
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border border-gray-200" style={{ backgroundColor: c.hex }} />
                <span className="text-xs text-gray-700 flex-1 truncate">{c.name}</span>
                <span className="text-[10px] font-mono text-gray-400">{c.hex}</span>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ut === 'warm' ? 'bg-orange-400' : ut === 'cool' ? 'bg-blue-400' : 'bg-gray-400'}`} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-plumage-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-gray-800">Compare Palettes</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Picker dropdown */}
      {picking && (
        <div className="mb-4">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search palettes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-plumage-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5 rounded-xl border border-plumage-border p-1">
            {filteredBirds.map(b => (
              <button
                key={b.id}
                onClick={() => selectBird(b.id)}
                className="w-full flex items-center gap-3 p-2 hover:bg-plumage-surface-alt rounded-lg transition-colors text-left"
              >
                <PaletteStrip colors={b.colors} height="h-4" className="w-20 rounded" clickable={false} />
                <span className="text-xs font-medium text-gray-700">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-start">
        <div>{renderSlot(leftBird, 'left')}</div>

        {/* Swap button */}
        <div className="hidden sm:flex items-center justify-center pt-16">
          <button
            onClick={swap}
            disabled={!leftBird || !rightBird}
            className="p-2 hover:bg-plumage-surface-alt rounded-lg disabled:opacity-30 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div>{renderSlot(rightBird, 'right')}</div>
      </div>

      {/* Mobile swap */}
      <div className="sm:hidden flex justify-center mt-2">
        <button
          onClick={swap}
          disabled={!leftBird || !rightBird}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-plumage-primary disabled:opacity-30 transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
        </button>
      </div>
    </div>
  );
}
