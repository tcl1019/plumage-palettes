import React from 'react';
import { DESIGN_STYLES } from '../../data/constants';
import { HERO_BIRD_MAP } from '../../data/herobirds';
import { BIRD_IMAGE_MAP } from '../../data/birdImageMap';
import PaletteStrip from './PaletteStrip';
import SaveButton from './SaveButton';
import { StatusBadge, HarmonyBadge, SeasonBadge } from './Badge';
import { useNav } from '../../App';
import { getSmartBird } from '../../utils/paletteHelpers';

export default function BirdCard({ bird: rawBird, compact = false }) {
  const bird = getSmartBird(rawBird);
  const { navigate } = useNav();

  const heroBird = HERO_BIRD_MAP[bird.id];
  const birdImage = BIRD_IMAGE_MAP[bird.id];
  const imageUrl = (heroBird && heroBird.image) || (birdImage && birdImage.image);
  const hasImage = !!imageUrl;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-plumage-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => navigate('palette-detail', { birdId: bird.id })}
    >
      {/* Bird photo thumbnail for hero birds */}
      {hasImage && !compact && (
        <div className="relative h-32 overflow-hidden">
          <img
            src={imageUrl}
            alt={bird.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
      )}
      <div className={hasImage && !compact ? 'p-5 -mt-4 relative' : 'p-5'}>
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <h3 className="font-display text-lg text-gray-800 truncate">{bird.name}</h3>
            <p className="text-xs text-gray-400 italic">{bird.scientific}</p>
          </div>
          <SaveButton birdId={bird.id} />
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <StatusBadge status={bird.status} />
            <HarmonyBadge type={bird.harmony.type} />
            <SeasonBadge season={bird.season} />
          </div>
        )}

        <PaletteStrip colors={bird.colors} height="h-12" className="mb-3" clickable={false} />

        {!compact && (
          <>
            <div className="flex flex-wrap gap-1 mb-2">
              {bird.styles.map(s => {
                const style = DESIGN_STYLES.find(ds => ds.id === s);
                return style ? (
                  <span key={s} className="px-2 py-0.5 bg-plumage-surface-alt text-gray-600 rounded text-[10px] font-medium">{style.label}</span>
                ) : null;
              })}
            </div>
            {bird.tagline && (
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{bird.tagline}</p>
            )}
            {!bird.tagline && (
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{bird.description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
