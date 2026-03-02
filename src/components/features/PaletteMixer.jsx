import React, { useState } from 'react';
import { X, Search, Plus, Trash2, Save, Shuffle } from 'lucide-react';
import { birds } from '../../data/birds';
import { ROLE_LABELS } from '../../data/constants';
import { getTextColor } from '../../utils/colorUtils';
import { useStudioContext } from '../../hooks/useStudio';

const ROLES = ['dominant', 'secondary', 'accent', 'neutral', 'highlight'];

const ALL_COLORS = birds.flatMap(bird =>
  bird.colors.map(c => ({ ...c, birdName: bird.name, birdId: bird.id }))
);

export default function PaletteMixer({ onClose, initialColors }) {
  const { createCustomPalette } = useStudioContext();
  const [slots, setSlots] = useState(() => {
    if (initialColors) return initialColors;
    return ROLES.map(role => ({ role, color: null }));
  });
  const [search, setSearch] = useState('');
  const [activeSlot, setActiveSlot] = useState(null);
  const [paletteName, setPaletteName] = useState('');
  const [saved, setSaved] = useState(false);

  const filteredColors = ALL_COLORS.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.name.toLowerCase().includes(s) ||
      c.hex.toLowerCase().includes(s) ||
      c.birdName.toLowerCase().includes(s);
  });

  const selectColor = (color) => {
    if (activeSlot === null) return;
    setSlots(prev => prev.map((s, i) =>
      i === activeSlot ? { ...s, color: { hex: color.hex, name: color.name, sourceBird: color.birdName } } : s
    ));
    setActiveSlot(null);
    setSearch('');
  };

  const clearSlot = (idx) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, color: null } : s));
  };

  const randomize = () => {
    const shuffled = [...ALL_COLORS].sort(() => Math.random() - 0.5);
    setSlots(prev => prev.map((s, i) => ({
      ...s,
      color: shuffled[i] ? { hex: shuffled[i].hex, name: shuffled[i].name, sourceBird: shuffled[i].birdName } : null,
    })));
  };

  const handleSave = () => {
    const filledSlots = slots.filter(s => s.color);
    if (filledSlots.length === 0) return;
    createCustomPalette({
      name: paletteName || 'Custom Palette',
      colors: slots.map(s => s.color ? { ...s.color, role: s.role } : null).filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); if (onClose) onClose(); }, 1500);
  };

  const filledCount = slots.filter(s => s.color).length;

  return (
    <div className="bg-white rounded-2xl border border-plumage-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-gray-800">Palette Mixer</h3>
        <div className="flex items-center gap-2">
          <button onClick={randomize} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-plumage-primary transition-colors">
            <Shuffle className="w-3.5 h-3.5" /> Random
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Slots */}
      <div className="space-y-2 mb-4">
        {slots.map((slot, idx) => {
          const roleInfo = ROLE_LABELS[slot.role];
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                activeSlot === idx ? 'border-plumage-primary bg-emerald-50' : 'border-plumage-border hover:border-plumage-primary/40'
              }`}
              onClick={() => setActiveSlot(activeSlot === idx ? null : idx)}
            >
              {slot.color ? (
                <div
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center"
                  style={{ backgroundColor: slot.color.hex }}
                >
                  <span className="text-[8px] font-mono font-bold" style={{ color: getTextColor(slot.color.hex) }}>
                    {slot.color.hex}
                  </span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {slot.color ? (
                  <>
                    <p className="text-sm font-medium text-gray-800 truncate">{slot.color.name}</p>
                    <p className="text-[10px] text-gray-400">from {slot.color.sourceBird}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Tap to add color</p>
                )}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleInfo?.bg || 'bg-gray-100'} ${roleInfo?.text || 'text-gray-600'}`}>
                {roleInfo?.label || slot.role}
              </span>
              {slot.color && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearSlot(idx); }}
                  className="p-1 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Color Picker */}
      {activeSlot !== null && (
        <div className="mb-4">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search colors or birds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-plumage-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5 rounded-xl border border-plumage-border p-1">
            {filteredColors.slice(0, 50).map((color, i) => (
              <button
                key={`${color.birdId}-${color.hex}-${i}`}
                onClick={() => selectColor(color)}
                className="w-full flex items-center gap-2 p-2 hover:bg-plumage-surface-alt rounded-lg transition-colors text-left"
              >
                <div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: color.hex }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{color.name}</p>
                  <p className="text-[10px] text-gray-400">{color.birdName} · {color.hex}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview Strip */}
      {filledCount > 0 && (
        <div className="mb-4">
          <div className="flex rounded-xl overflow-hidden h-10">
            {slots.map((slot, i) => (
              <div
                key={i}
                className="flex-1 transition-all"
                style={{ backgroundColor: slot.color?.hex || '#E5E5E5' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Save */}
      {filledCount > 0 && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Name your palette..."
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            className="flex-1 px-3 py-2 border border-plumage-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
          />
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex items-center gap-1.5 px-4 py-2 bg-plumage-primary text-white rounded-xl text-sm font-medium hover:bg-plumage-primary-light disabled:opacity-50 transition-colors"
          >
            {saved ? 'Saved!' : <><Save className="w-3.5 h-3.5" /> Save</>}
          </button>
        </div>
      )}
    </div>
  );
}
