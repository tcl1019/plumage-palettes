import React, { useState } from 'react';
import { BookOpen, Palette, Feather, Paintbrush, Eye, Sparkles, ArrowRight, Star, Zap, Layers, Leaf } from 'lucide-react';
import { birds } from '../../data/birds';
import { FLOCK_PAIRINGS } from '../../data/flockPairings';
import { DESIGN_STYLES, FINISH_GUIDE, ROLE_LABELS } from '../../data/constants';
import PaletteStrip from '../shared/PaletteStrip';
import { useNav } from '../../App';
import ColorLab from './learn/ColorLab';
import PaletteAutopsy from './learn/PaletteAutopsy';
import NatureDesignBridges from './learn/NatureDesignBridges';

const TABS = [
  { id: 'color-theory', label: 'Color Theory', Icon: Palette },
  { id: 'bird-science', label: 'Bird Science', Icon: BookOpen },
  { id: 'flock-pairings', label: 'Flock Pairings', Icon: Feather },
  { id: 'style-directory', label: 'Styles', Icon: Eye },
  { id: 'finishes', label: 'Paint Finishes', Icon: Paintbrush },
  { id: 'color-lab', label: 'Color Lab', Icon: Zap },
  { id: 'palette-autopsy', label: 'Autopsy', Icon: Layers },
  { id: 'nature-design', label: 'Nature \u00d7 Design', Icon: Leaf },
];

function ColorTheoryTab() {
  return (
    <div className="space-y-8">
      {/* 60-30-10 Rule */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">The 60-30-10 Rule</h3>
        <p className="text-sm text-gray-600 mb-4">
          The foundation of balanced interior color design. Distribute your palette across three proportions for visual harmony.
        </p>
        <div className="flex rounded-xl overflow-hidden h-12 mb-4">
          <div className="bg-plumage-primary/20 flex-[6] flex items-center justify-center text-xs font-bold text-plumage-primary">60%</div>
          <div className="bg-plumage-primary/40 flex-[3] flex items-center justify-center text-xs font-bold text-white">30%</div>
          <div className="bg-plumage-primary flex-[1] flex items-center justify-center text-xs font-bold text-white">10%</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { pct: '60%', label: 'Dominant', desc: 'Walls & large surfaces. Sets the overall tone.' },
            { pct: '30%', label: 'Secondary', desc: 'Furniture, textiles, curtains. Supports the dominant.' },
            { pct: '10%', label: 'Accent', desc: 'Pillows, art, decor. Adds visual interest.' },
          ].map(item => (
            <div key={item.pct} className="bg-plumage-surface-alt rounded-xl p-3">
              <p className="text-xs font-bold text-plumage-primary mb-1">{item.pct} — {item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Undertones */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">Understanding Undertones</h3>
        <p className="text-sm text-gray-600 mb-4">
          Every color has an underlying temperature that affects how it feels in a room. Mixing warm and cool undertones carelessly creates visual tension.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tone: 'Warm', color: 'bg-orange-400', desc: 'Yellow/red base. Advances toward you. Creates energy and coziness.' },
            { tone: 'Cool', color: 'bg-blue-400', desc: 'Blue/green base. Recedes away. Creates calm and spaciousness.' },
            { tone: 'Neutral', color: 'bg-gray-400', desc: 'Balanced base. Bridges warm and cool. Versatile and grounding.' },
          ].map(item => (
            <div key={item.tone} className="flex items-start gap-3 bg-plumage-surface-alt rounded-xl p-3">
              <span className={`w-4 h-4 rounded-full ${item.color} flex-shrink-0 mt-0.5`} />
              <div>
                <p className="text-xs font-bold text-gray-700 mb-1">{item.tone}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lighting */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">Lighting Changes Everything</h3>
        <p className="text-sm text-gray-600 mb-4">
          The same paint color can look completely different depending on your room's light. Always test samples.
        </p>
        <div className="space-y-2">
          {[
            { label: 'North-facing', note: 'Cool, blue-gray light. Colors appear muted and cooler. Choose warmer tones.' },
            { label: 'South-facing', note: 'Warm, golden light. Colors appear more vivid. Can handle cooler tones.' },
            { label: 'Incandescent bulbs', note: 'Warm yellow cast. Amplifies warm colors, dulls cool ones.' },
            { label: 'Cool LED', note: 'Blue-white cast. Can make warm colors look washed out.' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 bg-plumage-surface-alt rounded-lg">
              <span className="text-xs font-bold text-gray-700 w-28 flex-shrink-0">{item.label}</span>
              <p className="text-xs text-gray-500">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Harmonies */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">Color Harmonies</h3>
        <p className="text-sm text-gray-600 mb-4">
          Each palette in Ploom uses one of these proven color relationships.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Analogous', desc: 'Adjacent hues on the color wheel. Serene and cohesive.' },
            { name: 'Complementary', desc: 'Opposite hues. High contrast, energetic, bold.' },
            { name: 'Triadic', desc: 'Three evenly spaced hues. Rich, vibrant, balanced.' },
            { name: 'Split-Complementary', desc: 'Base + two adjacent to its complement. Nuanced contrast.' },
            { name: 'Monochromatic', desc: 'One hue in varying values. Sophisticated and unified.' },
          ].map(item => (
            <div key={item.name} className="bg-plumage-surface-alt rounded-xl p-3">
              <p className="text-xs font-bold text-gray-700 mb-1">{item.name}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BirdScienceTab() {
  return (
    <div className="space-y-8">
      {/* Structural vs Pigment Color */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">Structural vs. Pigment Color</h3>
        <p className="text-sm text-gray-600 mb-4">
          Not all bird color comes from pigment. Blue feathers contain no blue pigment at all — they're created by microscopic structures that scatter light, similar to why the sky appears blue.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-plumage-surface-alt rounded-xl p-4">
            <p className="text-xs font-bold text-gray-700 mb-2">Pigment Colors</p>
            <p className="text-xs text-gray-500 mb-2">Melanins (browns, blacks, rusts) and carotenoids (reds, oranges, yellows) are chemical compounds deposited in feathers.</p>
            <p className="text-[10px] text-plumage-primary font-medium">Design connection: Like matte and eggshell finishes — color is embedded in the surface itself.</p>
          </div>
          <div className="bg-plumage-surface-alt rounded-xl p-4">
            <p className="text-xs font-bold text-gray-700 mb-2">Structural Colors</p>
            <p className="text-xs text-gray-500 mb-2">Blues, iridescent greens, and UV reflections are created by nanostructures in feather barbs that interfere with light waves.</p>
            <p className="text-[10px] text-plumage-primary font-medium">Design connection: Like glossy and metallic finishes — the surface changes color with viewing angle.</p>
          </div>
        </div>
      </div>

      {/* The 60/30/10 in Nature */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">The 60/30/10 Rule — In Nature</h3>
        <p className="text-sm text-gray-600 mb-4">
          Interior designers didn't invent the 60/30/10 ratio — birds did. Most species follow this exact pattern in their plumage, and it maps directly to how we assign color roles in a room.
        </p>
        <div className="space-y-2">
          {[
            { pct: '60%', bird: 'Body/back plumage', room: 'Walls & ceiling', note: 'The dominant field color. In birds, it\'s usually the most camouflaged. In rooms, it sets the tone.' },
            { pct: '30%', bird: 'Breast & wing patches', room: 'Furniture & textiles', note: 'The secondary area. Often a contrasting but harmonious shade that supports the dominant.' },
            { pct: '10%', bird: 'Eye rings, bill, wing bars', room: 'Accent decor & art', note: 'Small but vital. In birds, these spots attract mates and signal species. In rooms, they draw the eye.' },
          ].map(item => (
            <div key={item.pct} className="bg-plumage-surface-alt rounded-xl p-3 flex gap-3">
              <span className="text-xs font-bold text-plumage-primary w-10 flex-shrink-0">{item.pct}</span>
              <div>
                <p className="text-xs text-gray-700"><strong>Bird:</strong> {item.bird} → <strong>Room:</strong> {item.room}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camouflage vs Display */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">Camouflage vs. Display</h3>
        <p className="text-sm text-gray-600 mb-4">
          Every bird balances two competing pressures: blend in to survive, or stand out to reproduce. This tension maps perfectly to interior design choices.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-plumage-surface-alt rounded-xl p-4">
            <p className="text-xs font-bold text-gray-700 mb-2">Camouflage = Analogous Harmony</p>
            <p className="text-xs text-gray-500">Muted, earth-toned birds (sparrows, owls, sandpipers) use adjacent colors that blend together. Their palettes create serene, cohesive rooms — perfect for bedrooms and spa bathrooms.</p>
          </div>
          <div className="bg-plumage-surface-alt rounded-xl p-4">
            <p className="text-xs font-bold text-gray-700 mb-2">Display = Complementary Harmony</p>
            <p className="text-xs text-gray-500">Bold birds (macaws, tanagers, kingfishers) use contrasting colors to stand out. Their palettes create energetic, statement-making spaces — ideal for dining rooms and creative studios.</p>
          </div>
        </div>
      </div>

      {/* Sexual Dimorphism */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">Sexual Dimorphism in Design</h3>
        <p className="text-sm text-gray-600 mb-4">
          In many species, males and females of the same bird look strikingly different. These aren't random — they're warm/cool and bold/subtle versions of the same genetic palette.
        </p>
        <div className="space-y-2">
          {[
            { label: 'Male palettes', desc: 'Tend toward bold, saturated colors with high contrast. Think statement walls, jewel-toned accents, and dramatic dining rooms.' },
            { label: 'Female palettes', desc: 'Tend toward subtle, earth-toned colors with soft transitions. Think cozy reading nooks, serene bedrooms, and understated elegance.' },
            { label: 'Pairing them', desc: 'Use the male version in your accent spaces and the female version in your living spaces — same genetic palette, two expressions of it.' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 bg-plumage-surface-alt rounded-xl p-3">
              <span className="text-xs font-bold text-gray-700 w-24 flex-shrink-0">{item.label}</span>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Plumage */}
      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        <h3 className="font-display text-lg text-gray-800 mb-3">Seasonal Plumage & Your Home</h3>
        <p className="text-sm text-gray-600 mb-4">
          Many birds molt into different plumage for breeding season vs. winter. This natural cycle connects directly to the seasonal design metadata in every Ploom palette.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { season: 'Spring', desc: 'Fresh greens, bright accents. Birds return to breeding colors — vibrant and optimistic.', color: 'bg-emerald-100 text-emerald-700' },
            { season: 'Summer', desc: 'Bold, saturated hues at peak intensity. Full breeding plumage.', color: 'bg-amber-100 text-amber-700' },
            { season: 'Fall', desc: 'Warm rusts, deep golds. Post-molt transition colors.', color: 'bg-orange-100 text-orange-700' },
            { season: 'Winter', desc: 'Muted, subtle tones. Non-breeding plumage — cozy and grounded.', color: 'bg-blue-100 text-blue-700' },
          ].map(item => (
            <div key={item.season} className="bg-plumage-surface-alt rounded-xl p-3 text-center">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 ${item.color}`}>{item.season}</span>
              <p className="text-[10px] text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlockPairingsTab() {
  const { navigate } = useNav();
  const [selectedPairing, setSelectedPairing] = useState(null);

  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Curated combinations of two bird palettes that create magic together. Perfect for open floor plans, adjacent rooms, or layered spaces.
      </p>
      <div className="space-y-4">
        {FLOCK_PAIRINGS.map(p => {
          const b1 = birds.find(b => b.id === p.birdIds[0]);
          const b2 = birds.find(b => b.id === p.birdIds[1]);
          const isOpen = selectedPairing === p.id;

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-plumage-border overflow-hidden">
              <button
                onClick={() => setSelectedPairing(isOpen ? null : p.id)}
                className="w-full text-left p-4 hover:bg-plumage-surface-alt/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-display text-base text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{b1?.name} + {b2?.name}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
                <div className="flex gap-1">
                  {b1 && <PaletteStrip colors={b1.colors} height="h-5" className="flex-1 rounded-md" clickable={false} />}
                  {b2 && <PaletteStrip colors={b2.colors} height="h-5" className="flex-1 rounded-md" clickable={false} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-gray-600 italic">{p.moodBoard.vibe}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.moodBoard.rooms.map(room => (
                      <span key={room} className="px-2 py-0.5 bg-plumage-surface-alt text-gray-600 rounded-full text-[10px] font-medium">{room}</span>
                    ))}
                  </div>
                  {p.moodBoard.accent && (
                    <p className="text-xs text-gray-500">Accent: {p.moodBoard.accent}</p>
                  )}
                  <div className="flex gap-2">
                    {b1 && (
                      <button
                        onClick={() => navigate('palette-detail', { birdId: b1.id })}
                        className="text-xs text-plumage-primary font-medium hover:underline"
                      >
                        See {b1.name}
                      </button>
                    )}
                    {b2 && (
                      <button
                        onClick={() => navigate('palette-detail', { birdId: b2.id })}
                        className="text-xs text-plumage-primary font-medium hover:underline"
                      >
                        See {b2.name}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StyleDirectoryTab() {
  const { navigate } = useNav();

  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        10 interior design styles, each with curated palette recommendations.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DESIGN_STYLES.map(style => {
          const matchingBirds = birds.filter(b => b.styles.includes(style.id)).slice(0, 3);
          return (
            <div key={style.id} className="bg-white rounded-2xl p-4 border border-plumage-border">
              <h3 className="font-display text-base text-gray-800 mb-1">{style.label}</h3>
              <p className="text-xs text-gray-500 mb-3">{style.description}</p>
              {matchingBirds.length > 0 && (
                <div className="space-y-2 mb-3">
                  {matchingBirds.map(bird => (
                    <div
                      key={bird.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-plumage-surface-alt p-1.5 rounded-lg transition-colors"
                      onClick={() => navigate('palette-detail', { birdId: bird.id })}
                    >
                      <PaletteStrip colors={bird.colors} height="h-4" className="w-20 rounded" clickable={false} />
                      <span className="text-xs text-gray-600">{bird.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate('explore', { filters: { style: style.id } })}
                className="text-xs text-plumage-primary font-medium hover:underline flex items-center gap-1"
              >
                See all {style.label} palettes <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FinishesTab() {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        The right finish affects how your paint looks and performs. Here's what to use where.
      </p>
      <div className="space-y-3">
        {Object.entries(FINISH_GUIDE).map(([role, info]) => {
          const roleInfo = ROLE_LABELS[role];
          return (
            <div key={role} className="bg-white rounded-xl p-4 border border-plumage-border flex items-start gap-4">
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleInfo?.bg || 'bg-gray-100'} ${roleInfo?.text || 'text-gray-600'} flex-shrink-0 mt-0.5`}>
                {roleInfo?.label || role}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 mb-0.5">{info.finish}</p>
                <p className="text-xs text-gray-500">{info.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-plumage-surface-alt rounded-2xl p-5">
        <h3 className="font-display text-base text-gray-800 mb-2">Quick Reference</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <p><strong>Matte:</strong> No sheen. Best for living rooms and bedrooms. Hides wall imperfections but harder to clean.</p>
          <p><strong>Eggshell:</strong> Slight warmth. Most popular for living spaces. Low sheen, somewhat washable.</p>
          <p><strong>Satin:</strong> Soft glow. Great for kitchens, bathrooms, kids' rooms. Durable and easy to wipe.</p>
          <p><strong>Semi-Gloss:</strong> Noticeable sheen. Ideal for trim, doors, cabinets. Very durable.</p>
          <p><strong>High-Gloss:</strong> Mirror-like shine. Statement pieces, front doors, furniture. Shows every imperfection.</p>
        </div>
      </div>
    </div>
  );
}

export default function Learn() {
  const [activeTab, setActiveTab] = useState('color-theory');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 section-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-gray-800 mb-1">Learn</h1>
        <p className="text-sm text-gray-500">Color theory, styles, and design knowledge</p>
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-plumage-primary text-white'
                : 'bg-white text-gray-500 border border-plumage-border hover:text-gray-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'color-theory' && <ColorTheoryTab />}
      {activeTab === 'bird-science' && <BirdScienceTab />}
      {activeTab === 'flock-pairings' && <FlockPairingsTab />}
      {activeTab === 'style-directory' && <StyleDirectoryTab />}
      {activeTab === 'finishes' && <FinishesTab />}
      {activeTab === 'color-lab' && <ColorLab />}
      {activeTab === 'palette-autopsy' && <PaletteAutopsy />}
      {activeTab === 'nature-design' && <NatureDesignBridges />}
    </div>
  );
}
