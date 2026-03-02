import React from 'react';
import { Check, Copy } from 'lucide-react';
import { getTextColor, getUndertone } from '../../utils/colorUtils';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { RoleBadge } from './Badge';

export default function PaintChip({ color, expanded = false, onExpand }) {
  const { copiedHex, copyToClipboard } = useCopyToClipboard();
  const undertone = getUndertone(color.hex);
  const utDot = undertone === 'warm' ? 'bg-orange-400' : undertone === 'cool' ? 'bg-blue-400' : 'bg-gray-400';

  return (
    <div
      className={`group cursor-pointer transition-all ${expanded ? 'col-span-full' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (onExpand) onExpand(); else copyToClipboard(color.hex); }}
    >
      <div className="rounded-xl shadow-sm overflow-hidden border border-plumage-border group-hover:shadow-md group-hover:-translate-y-0.5 transition-all">
        {/* Color block */}
        <div
          className="relative flex items-center justify-center"
          style={{ backgroundColor: color.hex, paddingBottom: expanded ? '60%' : '100%' }}
          onClick={(e) => { e.stopPropagation(); copyToClipboard(color.hex); }}
        >
          {copiedHex === color.hex && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-6 h-6" style={{ color: getTextColor(color.hex) }} />
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="bg-white px-3 py-2.5 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800 truncate">{color.name}</p>
            <span className={`w-2 h-2 rounded-full ${utDot} flex-shrink-0`} title={undertone} />
          </div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400 font-mono">{color.hex}</p>
            <RoleBadge role={color.role} compact />
          </div>
          <p className="text-[10px] text-gray-400">{color.finish}</p>

          {expanded && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed mb-1">{color.application}</p>
              <p className="text-[10px] text-gray-400 italic">{color.lightingNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
