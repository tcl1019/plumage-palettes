import React, { useState } from 'react';
import { Feather, ChevronDown, ChevronUp, TreePine } from 'lucide-react';

export default function NatureCard({ bird }) {
  const [expanded, setExpanded] = useState(false);
  const nature = bird.nature;

  if (!nature) return null;

  return (
    <div className="bg-gradient-to-br from-plumage-surface-alt to-white rounded-2xl border border-plumage-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-plumage-surface-alt/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Feather className="w-4 h-4 text-plumage-primary" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nature's Design Brief</span>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />
        }
      </button>

      {!expanded && (
        <div className="px-5 pb-4 -mt-1">
          <p className="text-sm text-gray-500 line-clamp-2">{nature.colorStory}</p>
        </div>
      )}

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <div>
            <p className="text-[10px] font-bold text-plumage-primary uppercase tracking-wider mb-1.5">Why These Colors?</p>
            <p className="text-sm text-gray-600 leading-relaxed">{nature.colorStory}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-plumage-primary uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <TreePine className="w-3 h-3" /> Habitat as Mood Board
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{nature.habitat}</p>
          </div>
        </div>
      )}
    </div>
  );
}
