import React from 'react';
import { Layers, Hammer, Gem, Armchair } from 'lucide-react';
import { getMaterialSuggestions } from '../../data/materials';
import { DESIGN_STYLES } from '../../data/constants';

const CATEGORIES = [
  { key: 'flooring', label: 'Flooring', Icon: Layers },
  { key: 'hardware', label: 'Hardware & Metals', Icon: Hammer },
  { key: 'stone', label: 'Stone & Counters', Icon: Gem },
  { key: 'textiles', label: 'Textiles & Fabric', Icon: Armchair },
];

export default function MaterialPairings({ bird }) {
  const suggestions = getMaterialSuggestions(bird);
  const styleLabel = DESIGN_STYLES.find(s => s.id === suggestions.style)?.label || suggestions.style;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <Gem className="w-4 h-4" /> Material Pairings
        </h2>
        <span className="text-[10px] text-gray-400 font-medium">
          {styleLabel} · {suggestions.undertone} undertone
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(({ key, label, Icon }) => (
          <div key={key} className="bg-white rounded-xl border border-plumage-border p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions[key].map((item, i) => (
                <span key={i} className="px-2 py-0.5 bg-plumage-surface-alt text-gray-600 rounded-full text-[10px] font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 italic mt-2 leading-relaxed">{suggestions.textureTip}</p>
    </div>
  );
}
