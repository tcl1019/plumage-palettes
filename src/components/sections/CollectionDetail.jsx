import React from 'react';
import { ArrowLeft, Moon, Sun, Heart, Gem, Waves, Minus, Leaf, Sunset } from 'lucide-react';
import { birds } from '../../data/birds';
import { COLLECTION_MAP } from '../../data/collections';
import { useNav } from '../../App';
import BirdCard from '../shared/BirdCard';

const ICON_MAP = { Moon, Sun, Heart, Gem, Waves, Minus, Leaf, Sunset };

export default function CollectionDetail({ collectionId }) {
  const { goBack, navigate } = useNav();
  const collection = COLLECTION_MAP[collectionId];

  if (!collection) {
    return (
      <div className="text-center py-20 text-gray-500">Collection not found.</div>
    );
  }

  const Icon = ICON_MAP[collection.icon] || Gem;
  const collectionBirds = collection.birdIds
    .map(id => birds.find(b => b.id === id))
    .filter(Boolean);

  return (
    <div className="section-fade-in">
      {/* Editorial header */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${collection.coverColors[0]}, ${collection.coverColors[1]}, ${collection.coverColors[2] || collection.coverColors[1]})`,
          minHeight: '35vh',
        }}
      >
        {/* Decorative opacity overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />

        {/* Back button */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 pt-4">
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-black/10 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 lg:px-8 pb-8" style={{ minHeight: '35vh' }}>
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm mb-4"
              style={{ animation: 'chipFloat 400ms ease-out both', animationDelay: '100ms' }}
            >
              <Icon className="w-4 h-4 text-white" />
              <span className="text-xs text-white/80 font-medium uppercase tracking-wider">Curated Collection</span>
            </div>
            <h1
              className="font-display text-3xl md:text-5xl text-white mb-2 leading-tight"
              style={{ animation: 'sectionSlideUp 500ms ease-out both', animationDelay: '150ms' }}
            >
              {collection.name}
            </h1>
            <p
              className="text-sm md:text-base text-white/60 mb-4"
              style={{ animation: 'sectionSlideUp 500ms ease-out both', animationDelay: '200ms' }}
            >
              {collection.tagline}
            </p>
            <p
              className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl"
              style={{ animation: 'sectionSlideUp 500ms ease-out both', animationDelay: '300ms' }}
            >
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bird palette grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-4">{collectionBirds.length} palettes in this collection</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionBirds.map((bird, idx) => (
            <div
              key={bird.id}
              style={{ animation: 'chipCascade 400ms ease-out both', animationDelay: `${400 + idx * 100}ms` }}
            >
              <BirdCard bird={bird} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
