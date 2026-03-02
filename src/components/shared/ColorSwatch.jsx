import React from 'react';
import { Check } from 'lucide-react';
import { getTextColor } from '../../utils/colorUtils';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export default function ColorSwatch({ hex, size = 'w-10 h-10', className = '', showCheck = true }) {
  const { copiedHex, copyToClipboard } = useCopyToClipboard();

  return (
    <div
      className={`${size} rounded-lg shadow-sm border border-gray-200/60 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all flex-shrink-0 flex items-center justify-center ${className}`}
      style={{ backgroundColor: hex }}
      onClick={(e) => { e.stopPropagation(); copyToClipboard(hex); }}
      title={`Click to copy ${hex}`}
    >
      {showCheck && copiedHex === hex && (
        <Check className="w-4 h-4" style={{ color: getTextColor(hex) }} />
      )}
    </div>
  );
}
