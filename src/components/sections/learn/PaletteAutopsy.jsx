import React, { useState, useMemo } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { birds } from '../../../data/birds';
import { getUndertone, getTextColor } from '../../../utils/colorUtils';
import { ROLE_LABELS, HARMONY_COLORS } from '../../../data/constants';
import PaletteStrip from '../../shared/PaletteStrip';
import { useNav } from '../../../App';

const HARMONY_EXPLAINERS = {
  analogous: 'Analogous palettes use neighboring hues — they feel effortlessly cohesive, like a landscape at a single time of day. Best for bedrooms and spaces where you want calm flow.',
  complementary: 'Complementary palettes use opposing hues — they create visual electricity, like a cardinal against snow. Best for dining rooms and spaces where you want energy and drama.',
  triadic: 'Triadic palettes use three evenly spaced hues — they feel rich and vibrant without the tension of direct opposition. Great for eclectic living rooms and creative spaces.',
  'split-complementary': 'Split-complementary palettes use a base color plus two adjacent to its opposite — nuanced contrast without the full punch of complementary. Versatile across many room types.',
  monochromatic: 'Monochromatic palettes explore one hue in varying values — sophisticated and unified, like a single material in different finishes. Perfect for spa-like bathrooms and minimalist spaces.',
};

function AutopsyDetail({ bird, onBack }) {
  const { navigate } = useNav();

  const colorAnalysis = bird.colors.map(c => ({
    ...c,
    undertone: getUndertone(c.hex),
  }));

  const dominantUndertone = colorAnalysis.find(c => c.role === 'dominant')?.undertone || 'neutral';
  const matchingCount = colorAnalysis.filter(c => c.undertone === dominantUndertone).length;
  const totalColors = colorAnalysis.length;

  const bestRoom = bird.rooms?.reduce((best, r) => r.rating > (best?.rating || 0) ? r : best, null);
  const harmonyStyle = HARMONY_COLORS[bird.harmony?.type];

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-xs text-plumage-primary font-medium hover:underline">
        &larr; Back to selection
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-xl text-gray-800 mb-1">{bird.name}</h3>
        <p className="text-sm text-gray-500 italic mb-4">{bird.tagline}</p>
        <PaletteStrip colors={bird.colors} height="h-8" className="rounded-xl" clickable={false} />
      </div>

      {/* 1. Harmony */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${harmonyStyle?.bg || 'bg-gray-100'} ${harmonyStyle?.text || 'text-gray-600'}`}>
            {bird.harmony?.type}
          </span>
          <h4 className="font-display text-base text-gray-800">Harmony Type</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">{bird.harmony?.explanation}</p>
        <div className="bg-plumage-surface-alt rounded-xl p-3">
          <p className="text-xs text-gray-500">{HARMONY_EXPLAINERS[bird.harmony?.type]}</p>
        </div>
      </div>

      {/* 2. Color Role Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h4 className="font-display text-base text-gray-800 mb-4">Color Role Breakdown</h4>

        {/* Proportion bar */}
        <div className="flex rounded-xl overflow-hidden h-10 mb-4">
          {bird.colors.map((c, i) => {
            const flex = c.role === 'dominant' ? 6 : c.role === 'secondary' ? 3 : 1;
            return (
              <div
                key={i}
                className="flex items-center justify-center transition-all"
                style={{ backgroundColor: c.hex, flex }}
              >
                <span className="text-[9px] font-bold" style={{ color: getTextColor(c.hex) }}>
                  {c.role === 'dominant' ? '60%' : c.role === 'secondary' ? '30%' : '10%'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Individual cards */}
        <div className="space-y-3">
          {colorAnalysis.map((color, i) => {
            const roleInfo = ROLE_LABELS[color.role];
            return (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-xl flex-shrink-0 border shadow-sm" style={{ backgroundColor: color.hex }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${roleInfo?.bg || 'bg-gray-100'} ${roleInfo?.text || 'text-gray-600'}`}>
                      {roleInfo?.label || color.role}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                      color.undertone === 'warm' ? 'bg-orange-50 text-orange-600' :
                      color.undertone === 'cool' ? 'bg-blue-50 text-blue-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>{color.undertone}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-violet-50 text-violet-600">{color.finish}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium truncate">{color.name}</p>
                  <p className="text-[10px] text-gray-400">{color.application}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Undertone Consistency */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h4 className="font-display text-base text-gray-800 mb-3">Undertone Analysis</h4>
        <div className="flex gap-2 mb-3">
          {colorAnalysis.map((c, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-full h-8 rounded-lg mb-1 border" style={{ backgroundColor: c.hex }} />
              <span className={`text-[9px] font-medium ${
                c.undertone === 'warm' ? 'text-orange-600' :
                c.undertone === 'cool' ? 'text-blue-600' :
                'text-gray-500'
              }`}>{c.undertone}</span>
            </div>
          ))}
        </div>
        <div className="bg-plumage-surface-alt rounded-xl p-3">
          <p className="text-xs text-gray-600">
            {matchingCount >= totalColors - 1
              ? <>This palette has strong undertone consistency — <strong>{matchingCount}/{totalColors}</strong> colors share a <strong>{dominantUndertone}</strong> undertone. It will feel cohesive and intentional. Pair with {dominantUndertone === 'warm' ? 'brass, gold, or copper hardware' : dominantUndertone === 'cool' ? 'chrome, nickel, or stainless hardware' : 'any metal finish — neutral undertones are incredibly flexible'}.</>
              : <>This palette mixes undertones intentionally — the dominant <strong>{dominantUndertone}</strong> base gets contrast from {dominantUndertone === 'warm' ? 'cooler' : 'warmer'} accents. This tension adds visual interest, but keep your largest surfaces consistently <strong>{dominantUndertone}</strong> to anchor the room.</>
            }
          </p>
        </div>
      </div>

      {/* 4. What Would Break */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h4 className="font-display text-base text-gray-800 mb-3">What Would Break?</h4>
        <div className="space-y-2">
          <div className="bg-rose-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-rose-600 mb-0.5">Swap the dominant to a cool blue</p>
            <p className="text-xs text-gray-600">
              {dominantUndertone === 'warm'
                ? 'The warm secondary and accent colors would clash against a cool base — they\'d look disjointed, like wearing brown shoes with a gray suit.'
                : 'You\'d lose the contrast that makes this palette interesting. The accents would disappear into a monochrome wash.'}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-amber-600 mb-0.5">Remove the accent entirely</p>
            <p className="text-xs text-gray-600">
              The room would feel flat and monotonous. The accent is only 10% of the room, but it provides the focal point that makes everything else feel purposeful.
            </p>
          </div>
          <div className="bg-sky-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-sky-600 mb-0.5">Use the accent as the dominant</p>
            <p className="text-xs text-gray-600">
              {bird.colors.find(c => c.role === 'accent')
                ? `Covering 60% of walls in "${bird.colors.find(c => c.role === 'accent').name}" would overwhelm the space. Accent colors are meant to be sparks, not bonfires.`
                : 'Accent colors are designed for small doses — scaling them up removes their power and fatigues the eye.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Nature Connection */}
      {bird.nature?.colorStory && (
        <div className="bg-white rounded-2xl p-5 border border-plumage-border">
          <h4 className="font-display text-base text-gray-800 mb-3">From Feather to Room</h4>
          <p className="text-sm text-gray-600 mb-3">{bird.nature.colorStory}</p>
          {bird.nature.habitat && (
            <div className="bg-plumage-surface-alt rounded-xl p-3">
              <p className="text-xs text-gray-500"><strong>Habitat connection:</strong> {bird.nature.habitat}</p>
            </div>
          )}
        </div>
      )}

      {/* 6. Best Room */}
      {bestRoom && (
        <div className="bg-white rounded-2xl p-5 border border-plumage-border">
          <h4 className="font-display text-base text-gray-800 mb-2">Best Room Match</h4>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < bestRoom.rating ? 'bg-plumage-primary' : 'bg-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{bestRoom.room}</span>
          </div>
          <p className="text-xs text-gray-500">{bestRoom.reason}</p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => navigate('palette-detail', { birdId: bird.id })}
        className="w-full flex items-center justify-center gap-2 bg-plumage-primary text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-plumage-primary/90 transition-colors"
      >
        View full palette <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function PaletteAutopsy() {
  const featuredBirds = useMemo(() => {
    const harmonies = ['analogous', 'complementary', 'triadic', 'split-complementary', 'monochromatic'];
    const found = [];
    for (const h of harmonies) {
      const bird = birds.find(b => b.harmony?.type === h && !found.includes(b));
      if (bird) found.push(bird);
    }
    // Add one more bold palette for variety
    const bold = birds.find(b => !found.includes(b) && b.moods?.includes('bold'));
    if (bold) found.push(bold);
    return found;
  }, []);

  const [selectedBird, setSelectedBird] = useState(null);

  if (selectedBird) {
    return <AutopsyDetail bird={selectedBird} onBack={() => setSelectedBird(null)} />;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Pick a palette to dissect. We'll break down every color's role, analyze the harmony, and show you exactly why it works — and what would break it.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {featuredBirds.map(bird => {
          const harmonyStyle = HARMONY_COLORS[bird.harmony?.type];
          return (
            <button
              key={bird.id}
              onClick={() => setSelectedBird(bird)}
              className="bg-white rounded-2xl p-4 border border-plumage-border text-left hover:border-plumage-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display text-base text-gray-800">{bird.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${harmonyStyle?.bg || 'bg-gray-100'} ${harmonyStyle?.text || 'text-gray-600'}`}>
                    {bird.harmony?.type}
                  </span>
                </div>
                <Layers className="w-4 h-4 text-gray-300" />
              </div>
              <PaletteStrip colors={bird.colors} height="h-6" className="rounded-lg" clickable={false} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
