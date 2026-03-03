import React, { useState, useEffect } from 'react';
import { Droplets, ExternalLink, ShoppingBag, Check } from 'lucide-react';
import { loadPaintData, findNearestPaints, getMatchQuality } from '../../utils/paintMatcher';
import { getShopUrl } from '../../utils/shopUrls';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export default function PaintMatch({ hex }) {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const { copiedHex, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPaintData().then(({ sw, bm }) => {
      if (cancelled) return;
      setMatches({
        sw: findNearestPaints(hex, sw, 2),
        bm: findNearestPaints(hex, bm, 2),
      });
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [hex]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Paint Matches</p>
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-100 rounded-lg" />
          <div className="flex-1 h-12 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!matches) return null;

  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Droplets className="w-3 h-3" /> Paint Matches
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <BrandColumn brand="Sherwin-Williams" brandKey="sw" matches={matches.sw} copiedHex={copiedHex} copyToClipboard={copyToClipboard} />
        <BrandColumn brand="Benjamin Moore" brandKey="bm" matches={matches.bm} copiedHex={copiedHex} copyToClipboard={copyToClipboard} />
      </div>
    </div>
  );
}

function BrandColumn({ brand, brandKey, matches, copiedHex, copyToClipboard }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-2.5">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{brand}</p>
      <div className="space-y-1.5">
        {matches.map((m, i) => {
          const quality = getMatchQuality(m.deltaE);
          const shopUrl = getShopUrl(m.code, m.name, brandKey);
          return (
            <div
              key={i}
              className="flex items-center gap-2 cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); copyToClipboard(m.hex); }}
              title={`Click to copy ${m.hex}`}
            >
              <div
                className="w-6 h-6 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center group-hover:shadow-sm transition-all"
                style={{ backgroundColor: m.hex }}
              >
                {copiedHex === m.hex && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-700 font-medium truncate">{m.code}</p>
                <p className="text-[10px] text-gray-400 truncate">{m.name}</p>
              </div>
              <span className={`text-[9px] font-medium ${quality.color} flex-shrink-0`}>
                {quality.label}
              </span>
              {shopUrl && (
                <a
                  href={shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                  title={`Shop ${m.code} on ${brand}`}
                >
                  <ShoppingBag className="w-3 h-3 text-gray-400 hover:text-plumage-primary" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
