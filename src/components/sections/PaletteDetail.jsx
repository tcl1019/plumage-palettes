import React, { useState, useCallback } from 'react';
import { ArrowLeft, Star, Sparkles, ArrowRight, Lightbulb, Palette, Home, Paintbrush, Layers, Eye, Leaf, Info, Check, Share2, FileText, Download } from 'lucide-react';
import { birds } from '../../data/birds';
import { FLOCK_PAIRINGS } from '../../data/flockPairings';
import { DESIGN_STYLES, ROLE_LABELS, HARMONY_COLORS, SEASON_STYLES } from '../../data/constants';
import { getUndertone, generateTints, generateShades, getTextColor } from '../../utils/colorUtils';
import { findSimilarPalettes, mapBirdToRoomColors } from '../../utils/paletteHelpers';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useNav } from '../../App';
import RoomVisualizer from '../features/RoomVisualizer';
import PaletteStrip from '../shared/PaletteStrip';
import PaintMatch from '../shared/PaintMatch';
import SaveButton from '../shared/SaveButton';
import NatureCard from '../shared/NatureCard';
import MaterialPairings from '../shared/MaterialPairings';
import { StatusBadge, HarmonyBadge, SeasonBadge, RoleBadge } from '../shared/Badge';

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

  const similar = findSimilarPalettes(bird, birds, 3);
  const relatedPairings = FLOCK_PAIRINGS.filter(p => p.birdIds.includes(bird.id));
  const roomColors = mapBirdToRoomColors(bird);

  const scaleData = showScale ? {
    tints: generateTints(showScale, 4),
    shades: generateShades(showScale, 4),
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 section-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-plumage-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('chat', { context: { type: 'palette', bird } })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-plumage-surface-alt text-plumage-primary rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Ask AI
          </button>
          <SaveButton birdId={bird.id} size="w-6 h-6" />
        </div>
      </div>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-gray-800 mb-1">{bird.name}</h1>
        <p className="text-sm text-gray-400 italic mb-3">{bird.scientific}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <StatusBadge status={bird.status} />
          <HarmonyBadge type={bird.harmony.type} />
          <SeasonBadge season={bird.season} />
        </div>
        <PaletteStrip colors={bird.colors} height="h-14 md:h-20" className="mb-3 shadow-md" />
        <p className="text-base text-gray-600 leading-relaxed">
          {bird.tagline || bird.harmony.explanation}
        </p>
      </div>

      {/* Room Visualizer */}
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

      {/* Paint Chips */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" /> The Palette
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {bird.colors.map((color, idx) => {
            const undertone = getUndertone(color.hex);
            const utDot = undertone === 'warm' ? 'bg-orange-400' : undertone === 'cool' ? 'bg-blue-400' : 'bg-gray-400';
            const isExpanded = expandedColor === idx;

            return (
              <div key={idx} className={`${isExpanded ? 'col-span-2 sm:col-span-3 md:col-span-5' : ''}`}>
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
        <MaterialPairings bird={bird} />
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

      {/* Conservation */}
      <div className="bg-white rounded-2xl p-5 border-l-4 border-plumage-primary mb-8">
        <p className="text-xs font-bold text-plumage-primary uppercase tracking-wider mb-2">Conservation</p>
        <p className="text-sm text-gray-600 leading-relaxed">{bird.conservation}</p>
      </div>

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
              className="bg-white rounded-xl p-4 border border-plumage-border cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('palette-detail', { birdId: b.id })}
            >
              <p className="font-display text-sm text-gray-800 mb-2">{b.name}</p>
              <PaletteStrip colors={b.colors} height="h-8" clickable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
