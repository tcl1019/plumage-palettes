import React from 'react';
import { Check } from 'lucide-react';
import { getTextColor } from '../../utils/colorUtils';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export default function PaletteStrip({ colors, height = 'h-10', className = '', clickable = true }) {
  const { copiedHex, copyToClipboard } = useCopyToClipboard();

  return (
    <div className={`flex rounded-lg overflow-hidden shadow-sm ${className}`}>
      {colors.map((color, i) => {
        const hex = typeof color === 'string' ? color : color.hex;
        const role = typeof color === 'string' ? null : color.role;
        const flex = role === 'dominant' ? 'flex-[6]' : role === 'secondary' ? 'flex-[3]' : 'flex-[1]';
        return (
          <div
            key={i}
            className={`${role ? flex : 'flex-1'} ${height} ${clickable ? 'cursor-pointer hover:brightness-95' : ''} transition-all flex items-center justify-center`}
            style={{ backgroundColor: hex }}
            onClick={clickable ? (e) => { e.stopPropagation(); copyToClipboard(hex); } : undefined}
            title={typeof color === 'string' ? hex : `${color.name} (${hex})`}
          >
            {clickable && copiedHex === hex && (
              <Check className="w-3 h-3" style={{ color: getTextColor(hex) }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
