import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, Star, Sparkles, ArrowRight, Lightbulb, Palette, Home, Paintbrush, Layers, Eye, Leaf, Info, Check, Share2, FileText, Download, ExternalLink, Camera } from 'lucide-react';
import { birds } from '../../data/birds';
import { FLOCK_PAIRINGS } from '../../data/flockPairings';
import { DESIGN_STYLES, ROLE_LABELS, HARMONY_COLORS, SEASON_STYLES, IUCN_STATUS } from '../../data/constants';
import { getUndertone, generateTints, generateShades, getTextColor } from '../../utils/colorUtils';
import { findSimilarPalettes, mapBirdToRoomColors, getSmartBird } from '../../utils/paletteHelpers';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useNav } from '../../App';
import RoomVisualizer from '../features/RoomVisualizer';
import PaletteStrip from '../shared/PaletteStrip';
import PaintMatch from '../shared/PaintMatch';
import SaveButton from '../shared/SaveButton';
import NatureCard from '../shared/NatureCard';
import MaterialPairings from '../shared/MaterialPairings';
import FeatherPattern from '../shared/FeatherPattern';
import { StatusBadge, HarmonyBadge, SeasonBadge, RoleBadge } from '../shared/Badge';
import Reveal from '../shared/Reveal';
import { HERO_BIRD_MAP } from '../../data/herobirds';
import { BIRD_IMAGE_MAP } from '../../data/birdImageMap';
import { CONSERVATION_TEXTS } from '../../data/conservationTexts';

// Positions for floating color chips on the bird photo hero (percentage-based)
const CHIP_POSITIONS = [
  { top: '18%', left: '8%' },
  { top: '12%', right: '12%' },
  { top: '45%', left: '5%' },
  { top: '55%', right: '8%' },
  { top: '72%', left: '15%' },
];

export default function PaletteDetail({ birdId }) {
  const bird = birds.find(b => b.id === birdId);
  const { goBack, navigate } = useNav();
  const { copiedHex, copyToClipboard } = useCopyToClipboard();
  const [expandedColor, setExpandedColor] = useState(null);
  const [showScale, setShowScale] = useState(null);

  const [exporting, setExporting] = useState(null); // 'card' | 'spec' | null

  const handleExport = useCallback(async (type) => {
    setExporting(type);
    try {
      if (type === 'card') {
        const { generateRecipeCard, downloadBlob } = await import('../../utils/recipeCardGenerator');
        const blob = await generateRecipeCard(bird);
        downloadBlob(blob, `${bird.name.toLowerCase().replace(/\s+/g, '-')}-palette-card.png`);
      } else {
        const { generateSpecSheet } = await import('../../utils/specSheetGenerator');
        const { downloadBlob } = await import('../../utils/recipeCardGenerator');
        const blob = await generateSpecSheet(bird);
        downloadBlob(blob, `${bird.name.toLowerCase().replace(/\s+/g, '-')}-spec-sheet.png`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(null);
    }
  }, [bird]);

  if (!bird) return <div className="text-center py-20 text-gray-500">Palette not found.</div>;

  const smartBird = getSmartBird(bird);
  const similar = findSimilarPalettes(bird, birds, 3);
  const relatedPairings = FLOCK_PAIRINGS.filter(p => p.birdIds.includes(bird.id));
  const roomColors = mapBirdToRoomColors(bird);

  const scaleData = showScale ? {
    tints: generateTints(showScale, 4),
    shades: generateShades(showScale, 4),
  } : null;

  const heroBird = HERO_BIRD_MAP[bird.id];
  const birdImage = BIRD_IMAGE_MAP[bird.id];
  const photoUrl = (heroBird && heroBird.image) || (birdImage && birdImage.image);
  const photoCredit = (heroBird && heroBird.imageCredit) || (birdImage && birdImage.imageCredit);
  const hasPhoto = !!photoUrl;

  // Parallax for hero image
  const heroRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!hasPhoto || window.innerWidth < 768) return;
    const handleScroll = () => {
      if (!heroRef.current || !imgRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (rect.bottom < 0) return;
      const offset = window.scrollY * 0.3;
      imgRef.current.style.transform = `translateY(${offset}px) scale(1.1)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasPhoto]);

  return (
    <div className="section-fade-in">
      {/* === Photo Hero (hero birds) or Pattern Hero (all others) === */}
      {hasPhoto ? (
        <div ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: '50vh', maxHeight: '70vh' }}>
          {/* Bird photo with parallax */}
          <img
            ref={imgRef}
            src={photoUrl}
            alt={bird.name}
            className="w-full h-full object-cover absolute inset-0"
            style={{ willChange: 'transform' }}
            loading="eager"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/75" />

          {/* Color extraction lines — SVG overlay */}
          <svg className="absolute inset-0 z-10 pointer-events-none hidden md:block" style={{ width: '100%', height: '100%' }}>
            {bird.colors.slice(0, 5).map((_, i) => {
              const pos = CHIP_POSITIONS[i];
              const x2 = pos.left || pos.right;
              const y2 = pos.top;
              return (
                <line
                  key={i}
                  x1="50%" y1="50%"
                  x2={x2} y2={y2}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  style={{
                    animation: `extractionLine 800ms ease-out ${300 + i * 120}ms both`,
                  }}
                />
              );
            })}
          </svg>

          {/* Back + actions (over image) */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4">
            <button onClick={goBack} className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-black/10 px-3 py-1.5 rounded-lg">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('chat', { context: { type: 'palette', bird } })}
                className="flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Ask AI
              </button>
              <SaveButton birdId={bird.id} size="w-6 h-6" className="text-white/70 hover:text-white" />
            </div>
          </div>

          {/* Floating color chips — "extracted from plumage" */}
          {bird.colors.slice(0, 5).map((color, i) => {
            const pos = CHIP_POSITIONS[i];
            return (
              <div
                key={i}
                className="absolute z-10 hidden md:flex items-center gap-2 backdrop-blur-sm bg-white/15 border border-white/20 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-white/25 transition-all"
                style={{
                  ...pos,
                  animation: 'chipFloat 500ms ease-out both',
                  animationDelay: `${300 + i * 120}ms`,
                }}
                onClick={() => copyToClipboard(color.hex)}
              >
                <div
                  className="w-5 h-5 rounded-md shadow-sm border border-white/30"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[10px] text-white/80 font-mono">{color.hex}</span>
              </div>
            );
          })}

          {/* Bottom overlay content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <HarmonyBadge type={bird.harmony.type} />
              <SeasonBadge season={bird.season} />
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-white mb-1 leading-tight">{bird.name}</h1>
            <p className="text-sm text-white/40 italic mb-3">{bird.scientific}</p>
            <PaletteStrip colors={bird.colors} height="h-10 md:h-14" className="mb-3 shadow-lg max-w-xl palette-shimmer" />
            {photoCredit && (
              <p className="text-[10px] text-white/25 flex items-center gap-1">
                <Camera className="w-2.5 h-2.5" /> Photo: {photoCredit} / Unsplash
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Pattern hero for non-photo birds */
        <div className="relative w-full overflow-hidden" style={{ minHeight: '30vh', maxHeight: '40vh' }}>
          <div className="absolute inset-0">
            <FeatherPattern colors={bird.colors} seed={bird.id} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

          {/* Back + actions */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4">
            <button onClick={goBack} className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-black/10 px-3 py-1.5 rounded-lg">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('chat', { context: { type: 'palette', bird } })}
                className="flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Ask AI
              </button>
              <SaveButton birdId={bird.id} size="w-6 h-6" className="text-white/70 hover:text-white" />
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <StatusBadge status={bird.status} />
              <HarmonyBadge type={bird.harmony.type} />
              <SeasonBadge season={bird.season} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-white mb-1">{bird.name}</h1>
            <p className="text-sm text-white/40 italic mb-3">{bird.scientific}</p>
            <PaletteStrip colors={bird.colors} height="h-10 md:h-14" className="shadow-lg max-w-xl" />
          </div>
        </div>
      )}

      {/* === Content below hero === */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

      {/* Story pull quote (hero birds only) */}
      {hasPhoto && heroBird && heroBird.story && (
        <Reveal>
        <div className="mb-8">
          <blockquote className="text-base md:text-lg text-gray-600 leading-relaxed italic border-l-4 border-plumage-primary/30 pl-4 max-w-2xl">
            {heroBird.story.length > 220 ? heroBird.story.slice(0, 220).trim() + '...' : heroBird.story}
          </blockquote>
        </div>
        </Reveal>
      )}

      {/* Tagline (always shown) */}
      <Reveal delay={50}>
      <div className="mb-8">
        <p className="text-base text-gray-600 leading-relaxed">
          {bird.tagline || bird.harmony.explanation}
        </p>
      </div>
      </Reveal>

      {/* Room Visualizer */}
      <Reveal delay={100}>
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Home className="w-4 h-4" /> See It In A Room
        </h2>
        <RoomVisualizer bird={bird} />
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries({
            'Walls': { hex: roomColors.walls, role: 'dominant' },
            'Textiles': { hex: roomColors.textiles, role: 'secondary' },
            'Accents': { hex: roomColors.accents, role: 'accent' },
            'Trim': { hex: roomColors.trim, role: 'neutral' },
            'Feature': { hex: roomColors.feature, role: 'highlight' },
          }).map(([label, { hex, role }]) => (
            <div key={label} className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-plumage-border text-xs">
              <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: hex }} />
              <span className="text-gray-500">{label}:</span>
              <span className="font-mono text-gray-400">{hex}</span>
            </div>
          ))}
        </div>
      </div>
      </Reveal>

      {/* Paint Chips */}
      <Reveal delay={150}>
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" /> The Palette
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {smartBird.colors.map((color, idx) => {
            const undertone = getUndertone(color.hex);
            const utDot = undertone === 'warm' ? 'bg-orange-400' : undertone === 'cool' ? 'bg-blue-400' : 'bg-gray-400';
            const isExpanded = expandedColor === idx;

            return (
              <div
                key={idx}
                className={`${isExpanded ? 'col-span-2 sm:col-span-3 md:col-span-5' : ''}`}
                style={{ animation: 'chipCascade 400ms ease-out both', animationDelay: `${400 + idx * 80}ms` }}
              >
                <div
                  className="bg-white rounded-xl shadow-sm border border-plumage-border hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  onClick={() => setExpandedColor(isExpanded ? null : idx)}
                >
                  <div
                    className="relative flex items-center justify-center"
                    style={{ backgroundColor: color.hex, paddingBottom: isExpanded ? '30%' : '100%' }}
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(color.hex); }}
                  >
                    {copiedHex === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-6 h-6" style={{ color: getTextColor(color.hex) }} />
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{color.name}</p>
                      <span className={`w-2 h-2 rounded-full ${utDot} flex-shrink-0`} title={undertone} />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-400 font-mono">{color.hex}</p>
                      <RoleBadge role={color.role} compact />
                    </div>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Paintbrush className="w-2.5 h-2.5" /> {color.finish}
                    </p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-plumage-surface-alt rounded-xl p-4 mt-2 space-y-3">
                    <p className="text-sm text-gray-600">{color.application}</p>
                    <p className="text-xs text-gray-400 italic flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" /> {color.lightingNote}
                    </p>
                    {/* Paint Matches */}
                    <PaintMatch hex={color.hex} />
                    {/* Value Scale */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Value Scale</p>
                      <div className="flex rounded-lg overflow-hidden shadow-sm">
                        {[...generateTints(color.hex, 4).reverse(), color.hex, ...generateShades(color.hex, 4)].map((hex, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-8 cursor-pointer transition-all hover:h-10 ${i === 4 ? 'ring-2 ring-gray-800 ring-inset z-10' : ''}`}
                            style={{ backgroundColor: hex }}
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(hex); }}
                            title={hex}
                          >
                            {copiedHex === hex && (
                              <div className="w-full h-full flex items-center justify-center">
                                <Check className="w-3 h-3" style={{ color: getTextColor(hex) }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </Reveal>

      {/* Coordinating Neutrals */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border mb-8">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Coordinating Neutrals</p>
        <div className="flex gap-6 flex-wrap">
          {[
            { ...bird.neutrals.trim, label: 'Trim' },
            { ...bird.neutrals.ceiling, label: 'Ceiling' },
            { ...bird.neutrals.floor, label: 'Floor' },
          ].map((n, i) => (
            <div key={i} className="flex items-center gap-2 cursor-pointer group" onClick={() => copyToClipboard(n.hex)}>
              <div className="w-10 h-10 rounded-lg border border-plumage-border shadow-sm group-hover:shadow-md transition-all" style={{ backgroundColor: n.hex }} />
              <div>
                <p className="text-sm font-medium text-gray-700">{n.label}</p>
                <p className="text-xs text-gray-400 font-mono">{n.name} · {n.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Pairings */}
      <div className="mb-8">
        <MaterialPairings bird={smartBird} />
      </div>

      {/* Room Ratings */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Home className="w-4 h-4" /> Room Ratings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bird.rooms.sort((a, b) => b.rating - a.rating).map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-plumage-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700">{r.room}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">{r.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design Info */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border mb-8 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harmony</span>
            <HarmonyBadge type={bird.harmony.type} />
          </div>
          <p className="text-sm text-gray-600">{bird.harmony.explanation}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Styles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {bird.styles.map(s => {
              const style = DESIGN_STYLES.find(ds => ds.id === s);
              return style ? (
                <span key={s} className="px-3 py-1 bg-plumage-surface-alt text-gray-600 rounded-full text-xs font-medium">{style.label}</span>
              ) : null;
            })}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Season</span>
            <SeasonBadge season={bird.season} />
          </div>
          <p className="text-sm text-gray-600">{bird.seasonNote}</p>
        </div>
      </div>

      {/* Nature's Design Brief */}
      {bird.nature && (
        <div className="mb-8">
          <NatureCard bird={bird} />
        </div>
      )}

      {/* Conservation — enhanced with IUCN badge and links */}
      {(() => {
        const iucn = IUCN_STATUS[bird.status] || IUCN_STATUS['Least Concern'];
        const birdSlug = bird.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <div className="bg-white rounded-2xl overflow-hidden border border-plumage-border mb-8">
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-plumage-surface-alt to-white border-b border-plumage-border">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-plumage-primary" />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Conservation Status</span>
              </div>
              {/* IUCN-style badge */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: iucn.color, animation: 'gentlePulse 3s ease-in-out infinite' }}
                />
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${iucn.bg} ${iucn.text}`}>
                  {iucn.code} · {bird.status}
                </span>
              </div>
            </div>
            {/* Conservation text */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">{CONSERVATION_TEXTS[bird.id] || bird.conservation}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.allaboutbirds.org/guide/${birdSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-plumage-primary font-medium hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> Cornell Lab
                </a>
                <a
                  href={`https://www.audubon.org/field-guide/bird/${birdSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-plumage-primary font-medium hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> Audubon
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Related Flock Pairings */}
      {relatedPairings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Flock Pairings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedPairings.map(p => {
              const otherBirdId = p.birdIds.find(id => id !== bird.id);
              const otherBird = birds.find(b => b.id === otherBirdId);
              return (
                <div key={p.id} className="bg-white rounded-xl p-4 border border-plumage-border">
                  <p className="font-semibold text-gray-800 text-sm mb-1">{p.name}</p>
                  <p className="text-xs text-gray-500 mb-2">with {otherBird?.name}</p>
                  <p className="text-xs text-gray-400">{p.moodBoard.vibe}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => navigate('chat', { context: { type: 'palette', bird } })}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-plumage-primary text-white rounded-xl font-medium text-sm hover:bg-plumage-primary-light transition-colors col-span-2 sm:col-span-1"
        >
          <Sparkles className="w-4 h-4" /> AI Advice
        </button>
        <button
          onClick={() => navigate('my-studio')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-plumage-primary border border-plumage-primary rounded-xl font-medium text-sm hover:bg-emerald-50 transition-colors col-span-2 sm:col-span-1"
        >
          <Layers className="w-4 h-4" /> Project
        </button>
        <button
          onClick={() => handleExport('card')}
          disabled={!!exporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-plumage-border rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" /> {exporting === 'card' ? 'Creating...' : 'Share Card'}
        </button>
        <button
          onClick={() => handleExport('spec')}
          disabled={!!exporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-plumage-border rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FileText className="w-4 h-4" /> {exporting === 'spec' ? 'Creating...' : 'Spec Sheet'}
        </button>
      </div>

      {/* Similar Palettes */}
      <div>
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Similar Palettes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {similar.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-xl p-4 border border-plumage-border cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate('palette-detail', { birdId: b.id })}
            >
              <p className="font-display text-sm text-gray-800 mb-2">{b.name}</p>
              <PaletteStrip colors={b.colors} height="h-8" clickable={false} />
            </div>
          ))}
        </div>
      </div>

      </div>{/* end content wrapper */}
    </div>
  );
}
