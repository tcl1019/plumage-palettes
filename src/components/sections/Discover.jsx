import React, { useMemo } from 'react';
import { Search, Compass, ArrowRight, Sparkles, Home, BedDouble, CookingPot, Bath, UtensilsCrossed } from 'lucide-react';
import { birds } from '../../data/birds';
import { FLOCK_PAIRINGS } from '../../data/flockPairings';
import { MOODS } from '../../data/constants';
import PaletteStrip from '../shared/PaletteStrip';
import SaveButton from '../shared/SaveButton';
import { useNav } from '../../App';

const ROOM_CARDS = [
  { id: 'bedroom', label: 'Bedroom', Icon: BedDouble, desc: 'Calm & restful' },
  { id: 'living-room', label: 'Living Room', Icon: Home, desc: 'Versatile & welcoming' },
  { id: 'kitchen', label: 'Kitchen', Icon: CookingPot, desc: 'Bright & energizing' },
  { id: 'bathroom', label: 'Bathroom', Icon: Bath, desc: 'Spa-like & clean' },
  { id: 'dining-room', label: 'Dining Room', Icon: UtensilsCrossed, desc: 'Warm & inviting' },
];

export default function Discover() {
  const { navigate } = useNav();

  const featuredBird = useMemo(() => {
    return birds[Math.floor(Math.random() * birds.length)];
  }, []);

  const previewPairings = useMemo(() => FLOCK_PAIRINGS.slice(0, 4), []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 section-fade-in">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-gray-800 mb-2">
          Find Your Perfect Palette
        </h1>
        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
          Bird-inspired color palettes designed for real rooms. Discover, visualize, and personalize.
        </p>
      </div>

      {/* Quiz CTA */}
      <div
        onClick={() => navigate('quiz')}
        className="relative bg-gradient-to-br from-plumage-primary to-plumage-primary-dark rounded-2xl p-6 md:p-8 mb-10 cursor-pointer hover:shadow-lg transition-all group overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-plumage-accent" />
            <span className="text-plumage-accent text-xs font-bold uppercase tracking-wider">Personalized</span>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-display mb-2">
            Find Your Palette
          </h2>
          <p className="text-white/80 text-sm md:text-base mb-4 max-w-md">
            Answer 4 quick questions about your space and we'll match you with the perfect bird-inspired palette.
          </p>
          <span className="inline-flex items-center gap-1.5 text-white bg-white/20 px-4 py-2 rounded-xl text-sm font-medium group-hover:bg-white/30 transition-colors">
            Take the Quiz <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Browse by Room */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Home className="w-4 h-4" /> Browse by Room
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ROOM_CARDS.map(({ id, label, Icon, desc }) => (
            <button
              key={id}
              onClick={() => navigate('explore', { filters: { room: id } })}
              className="bg-white rounded-xl p-4 border border-plumage-border hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
            >
              <Icon className="w-6 h-6 text-plumage-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-[10px] text-gray-400">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Browse by Mood */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4" /> Browse by Mood
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => navigate('explore', { filters: { mood: mood.id } })}
              className={`bg-gradient-to-br ${mood.gradient} rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left`}
            >
              <p className="text-sm font-semibold text-gray-800">{mood.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Palette */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Featured Palette
        </h2>
        <div
          className="bg-white rounded-2xl border border-plumage-border overflow-hidden cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate('palette-detail', { birdId: featuredBird.id })}
        >
          <PaletteStrip colors={featuredBird.colors} height="h-16 md:h-24" clickable={false} />
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl text-gray-800 mb-1">{featuredBird.name}</h3>
                <p className="text-xs text-gray-400 italic mb-2">{featuredBird.scientific}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {featuredBird.tagline || featuredBird.harmony.explanation}
                </p>
              </div>
              <SaveButton birdId={featuredBird.id} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-plumage-primary text-sm font-medium">
              See Full Palette <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Flock Pairing Previews */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Flock Pairings
          </h2>
          <button
            onClick={() => navigate('learn')}
            className="text-xs text-plumage-primary font-medium hover:underline flex items-center gap-1"
          >
            See All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {previewPairings.map(p => {
            const b1 = birds.find(b => b.id === p.birdIds[0]);
            const b2 = birds.find(b => b.id === p.birdIds[1]);
            return (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-plumage-border">
                <p className="font-semibold text-gray-800 text-sm mb-1">{p.name}</p>
                <p className="text-xs text-gray-500 mb-2">{b1?.name} + {b2?.name}</p>
                <div className="flex gap-1 mb-2">
                  {b1 && <PaletteStrip colors={b1.colors} height="h-4" className="flex-1 rounded-md" clickable={false} />}
                  {b2 && <PaletteStrip colors={b2.colors} height="h-4" className="flex-1 rounded-md" clickable={false} />}
                </div>
                <p className="text-[10px] text-gray-400">{p.moodBoard.vibe}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explore All CTA */}
      <div className="text-center py-4">
        <button
          onClick={() => navigate('explore')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-plumage-primary border border-plumage-primary rounded-xl font-medium hover:bg-emerald-50 transition-colors"
        >
          <Search className="w-4 h-4" /> Explore All 33 Palettes
        </button>
      </div>
    </div>
  );
}
