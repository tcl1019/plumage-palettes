import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, Home, BedDouble, CookingPot, Bath, UtensilsCrossed, Camera, Pipette, Palette, ChevronLeft, ChevronRight, Heart, ArrowDown } from 'lucide-react';
import { birds } from '../../data/birds';
import { HERO_BIRDS } from '../../data/herobirds';
import { FLOCK_PAIRINGS } from '../../data/flockPairings';
import { MOODS } from '../../data/constants';
import PaletteStrip from '../shared/PaletteStrip';
import FeatherPattern from '../shared/FeatherPattern';
import SaveButton from '../shared/SaveButton';
import { useNav } from '../../App';

const ROOM_CARDS = [
  { id: 'bedroom', label: 'Bedroom', Icon: BedDouble, desc: 'Calm & restful' },
  { id: 'living-room', label: 'Living Room', Icon: Home, desc: 'Versatile & welcoming' },
  { id: 'kitchen', label: 'Kitchen', Icon: CookingPot, desc: 'Bright & energizing' },
  { id: 'bathroom', label: 'Bathroom', Icon: Bath, desc: 'Spa-like & clean' },
  { id: 'dining-room', label: 'Dining Room', Icon: UtensilsCrossed, desc: 'Warm & inviting' },
];

// Mini abstract room viz using palette colors
function MiniRoomViz({ colors }) {
  const hexes = colors.map(c => typeof c === 'string' ? c : c.hex);
  const wall = hexes[0] || '#888';
  const floor = hexes[1] || '#666';
  const furniture = hexes[2] || '#999';
  const accent = hexes[3] || hexes[0];
  const art = hexes[4] || hexes[1];

  return (
    <svg viewBox="0 0 160 100" className="w-full rounded-lg overflow-hidden" style={{ maxWidth: 280 }}>
      {/* Wall */}
      <rect x="0" y="0" width="160" height="65" fill={wall} opacity="0.9" />
      {/* Floor */}
      <rect x="0" y="65" width="160" height="35" fill={floor} opacity="0.7" />
      {/* Art frame */}
      <rect x="55" y="10" width="50" height="35" rx="2" fill={art} opacity="0.8" />
      <rect x="57" y="12" width="46" height="31" rx="1" fill={accent} opacity="0.6" />
      {/* Furniture - sofa shape */}
      <rect x="25" y="50" width="110" height="25" rx="4" fill={furniture} opacity="0.85" />
      <rect x="20" y="48" width="15" height="27" rx="3" fill={furniture} opacity="0.7" />
      <rect x="125" y="48" width="15" height="27" rx="3" fill={furniture} opacity="0.7" />
      {/* Accent pillow */}
      <rect x="45" y="52" width="18" height="12" rx="3" fill={accent} opacity="0.9" />
      <rect x="97" y="52" width="18" height="12" rx="3" fill={art} opacity="0.9" />
      {/* Side table */}
      <rect x="5" y="55" width="12" height="20" rx="2" fill={floor} opacity="0.5" />
      {/* Lamp */}
      <ellipse cx="11" cy="50" rx="6" ry="4" fill={accent} opacity="0.4" />
    </svg>
  );
}

function HeroBirdCard({ heroBird, bird, isActive, onExplore }) {
  if (!bird) return null;

  return (
    <div className={`hero-bird-card ${isActive ? 'active' : ''}`}>
      {/* FeatherPattern background */}
      <div className="absolute inset-0">
        {heroBird.image ? (
          <>
            <img
              src={heroBird.image}
              alt={bird.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
          </>
        ) : (
          <FeatherPattern colors={bird.colors} seed={bird.id} />
        )}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
        {/* Bird name & scientific */}
        <div className="mb-4">
          <p className="text-white/50 text-xs uppercase tracking-[0.2em] font-medium mb-1">
            {bird.harmony.type} palette
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-white mb-1 leading-tight">
            {bird.name}
          </h2>
          <p className="text-white/40 text-sm italic">{bird.scientific}</p>
        </div>

        {/* Palette strip */}
        <div className="mb-4">
          <div className="flex rounded-lg overflow-hidden h-10 md:h-12 shadow-lg">
            {bird.colors.map((color, i) => {
              const hex = typeof color === 'string' ? color : color.hex;
              const role = typeof color === 'string' ? null : color.role;
              const flex = role === 'dominant' ? 6 : role === 'secondary' ? 3 : 1;
              return (
                <div
                  key={i}
                  className="transition-all"
                  style={{ backgroundColor: hex, flex }}
                />
              );
            })}
          </div>
        </div>

        {/* Story excerpt */}
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-5 max-w-xl line-clamp-3">
          {heroBird.story}
        </p>

        {/* Mini room viz + CTA */}
        <div className="flex items-end gap-4">
          <div className="hidden md:block flex-shrink-0">
            <MiniRoomViz colors={bird.colors} />
          </div>
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/15 backdrop-blur-sm text-white rounded-xl text-sm font-medium hover:bg-white/25 transition-all border border-white/10"
            >
              Explore This Palette <ArrowRight className="w-4 h-4" />
            </button>
            <SaveButton birdId={bird.id} size="w-5 h-5" className="text-white/60 hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroCarousel() {
  const { navigate } = useNav();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const autoplayRef = useRef(null);

  const heroBirds = useMemo(() =>
    HERO_BIRDS.map(h => ({
      hero: h,
      bird: birds.find(b => b.id === h.id),
    })).filter(h => h.bird),
  []);

  const goTo = useCallback((index) => {
    setActiveIndex((index + heroBirds.length) % heroBirds.length);
  }, [heroBirds.length]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(goNext, 8000);
    return () => clearInterval(autoplayRef.current);
  }, [goNext]);

  const resetAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(goNext, 8000);
  };

  // Swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
      resetAutoplay();
    }
    touchStartX.current = null;
  };

  const current = heroBirds[activeIndex];
  if (!current) return null;

  return (
    <div
      className="hero-carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <HeroBirdCard
        key={current.hero.id}
        heroBird={current.hero}
        bird={current.bird}
        isActive={true}
        onExplore={() => navigate('palette-detail', { birdId: current.bird.id })}
      />

      {/* Navigation arrows */}
      <button
        onClick={() => { goPrev(); resetAutoplay(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/60 hover:text-white hover:bg-black/40 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => { goNext(); resetAutoplay(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/60 hover:text-white hover:bg-black/40 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroBirds.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetAutoplay(); }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === activeIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Discover() {
  const { navigate } = useNav();
  const previewPairings = useMemo(() => FLOCK_PAIRINGS.slice(0, 4), []);

  return (
    <div className="section-fade-in">
      {/* === HERO: Full-screen bird carousel === */}
      <HeroCarousel />

      {/* === Tagline + scroll hint === */}
      <div className="bg-[#111111] text-center py-8 px-4 -mt-px">
        <p className="font-display text-lg md:text-xl text-white/80 max-w-lg mx-auto leading-relaxed">
          The world's most beautiful color palettes weren't designed. They evolved.
        </p>
        <p className="text-white/30 text-xs mt-3 uppercase tracking-widest">219 palettes from real birds</p>
        <ArrowDown className="w-4 h-4 text-white/20 mx-auto mt-4 animate-bounce" />
      </div>

      {/* === Light section: Tools & browsing === */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <button
            onClick={() => navigate('quiz')}
            className="bg-gradient-to-br from-plumage-primary to-plumage-primary-dark rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group"
          >
            <Sparkles className="w-6 h-6 text-plumage-accent mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-white">Find My Palette</p>
            <p className="text-[10px] text-white/60 mt-0.5">4-question style quiz</p>
          </button>
          <button
            onClick={() => navigate('color-match')}
            className="bg-white rounded-xl p-5 border border-plumage-border hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group"
          >
            <Camera className="w-6 h-6 text-plumage-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-800">Match a Photo</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Upload or snap a color</p>
          </button>
          <button
            onClick={() => navigate('explore')}
            className="bg-white rounded-xl p-5 border border-plumage-border hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group"
          >
            <Search className="w-6 h-6 text-plumage-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-800">Browse All</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{birds.length} bird palettes</p>
          </button>
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
            <Palette className="w-4 h-4" /> Browse by Mood
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

        {/* Flock Pairings */}
        <div className="mb-10">
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
            <Search className="w-4 h-4" /> Explore All {birds.length} Palettes
          </button>
        </div>
      </div>
    </div>
  );
}
