import React, { useState } from 'react';
import { ChevronDown, Feather, Home, Lightbulb } from 'lucide-react';
import { birds } from '../../../data/birds';
import PaletteStrip from '../../shared/PaletteStrip';
import { useNav } from '../../../App';

const BRIDGE_CARDS = [
  {
    id: 'camouflage',
    title: 'Camouflage \u2192 Cohesion',
    nature: 'Ground-nesting birds like the Killdeer use analogous earth tones to disappear against their habitat. Their plumage contains no jarring contrasts \u2014 every feather blends into the next.',
    principle: 'Analogous color harmony uses neighboring hues on the color wheel. Like camouflage, it creates seamless visual flow where no single element screams for attention.',
    homeApp: 'Use analogous palettes in bedrooms and reading nooks \u2014 spaces where you want to feel enveloped, not stimulated. Let the colors flow into each other like a bird blending into landscape.',
    findBird: b => b.harmony?.type === 'analogous',
    accent: 'emerald',
  },
  {
    id: 'display',
    title: 'Display \u2192 Drama',
    nature: 'Scarlet Macaws and Painted Buntings evolved blazing contrasts to attract mates. These birds don\'t whisper \u2014 they shout with color, using complementary hues that vibrate against each other.',
    principle: 'Complementary colors sit opposite on the color wheel. The tension between them creates maximum visual energy \u2014 the same way a flash of red catches your eye against a green forest.',
    homeApp: 'Use complementary palettes in dining rooms, entryways, and accent walls \u2014 spaces designed to make an impression. Like display plumage, bold contrast creates memorable moments.',
    findBird: b => b.harmony?.type === 'complementary',
    accent: 'rose',
  },
  {
    id: 'proportion',
    title: 'Plumage Proportions \u2192 The 60-30-10 Rule',
    nature: 'Most birds follow a natural ratio: ~60% body and back plumage, ~30% breast and wing patches, ~10% eye rings, bill, and wing bars. Evolution optimized this balance millions of years before interior design existed.',
    principle: 'The 60-30-10 rule uses the same proportions: 60% dominant (walls), 30% secondary (furniture and textiles), 10% accent (decor). Our eyes evolved to find this ratio harmonious \u2014 it\'s not a design trend, it\'s biology.',
    homeApp: 'Look at any bird palette: the dominant color IS your wall color. The secondary IS your textile color. The accent IS your throw pillow. Nature already did the math for you.',
    findBird: b => b.colors?.length >= 5 && b.harmony?.type === 'analogous' && b.moods?.includes('balanced'),
    accent: 'amber',
  },
  {
    id: 'structural',
    title: 'Structural Color \u2192 Surface Finish',
    nature: 'Blue jay feathers contain zero blue pigment. Their color comes from microscopic structures that scatter light \u2014 change the viewing angle and the color shifts. Iridescent hummingbirds and shimmering starlings work the same way.',
    principle: 'In design, surface finish is our version of structural color. A glossy finish reflects light like a hummingbird\'s throat \u2014 the same paint color looks completely different in matte vs. high-gloss.',
    homeApp: 'Use glossy and semi-gloss finishes on accent pieces to create light-shifting effects throughout the day. Use matte on large surfaces for the stability of pigment-based color. Think of it as giving your room both camouflage and display.',
    findBird: b => b.harmony?.type === 'monochromatic',
    accent: 'violet',
  },
  {
    id: 'seasonal',
    title: 'Seasonal Plumage \u2192 Year-Round Flexibility',
    nature: 'Many birds molt twice yearly \u2014 breeding plumage is bold and saturated, winter plumage is muted and subtle. Same bird, same genetic palette, different expression for different seasons.',
    principle: 'Your home\'s permanent colors (walls, floors, trim) are your non-breeding plumage \u2014 they need to work year-round. Seasonal accents (textiles, flowers, decor) are your breeding plumage \u2014 bold and swappable.',
    homeApp: 'Choose a palette with a versatile dominant for walls. Then swap accent pillows and throws seasonally: vibrant in spring and summer, warm and muted in fall and winter. One palette, four expressions.',
    findBird: b => b.season === 'year-round',
    accent: 'sky',
  },
  {
    id: 'habitat',
    title: 'Habitat \u2192 Style Identity',
    nature: 'A rainforest parrot\'s palette looks nothing like a tundra owl\'s. Their colors evolved to match their environment \u2014 habitat shapes every feather\'s hue, saturation, and value.',
    principle: 'In design, your "habitat" is your style identity. Coastal homes echo shoreline blues and sandy neutrals. Forest cabins channel woodland greens and bark browns. The best interiors feel like they grew from their surroundings.',
    homeApp: 'Use bird habitats as style guides. Tropical birds map to bohemian and tropical interiors. Shore birds map to coastal style. Forest birds map to modern farmhouse. Let your palette feel like it belongs where you live.',
    findBird: b => b.styles?.includes('tropical') || b.styles?.includes('coastal'),
    accent: 'teal',
  },
];

const ACCENT_COLORS = {
  emerald: { icon: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-200' },
  rose: { icon: 'text-rose-600 bg-rose-50', border: 'border-rose-200' },
  amber: { icon: 'text-amber-600 bg-amber-50', border: 'border-amber-200' },
  violet: { icon: 'text-violet-600 bg-violet-50', border: 'border-violet-200' },
  sky: { icon: 'text-sky-600 bg-sky-50', border: 'border-sky-200' },
  teal: { icon: 'text-teal-600 bg-teal-50', border: 'border-teal-200' },
};

const LAYER_CONFIG = [
  { icon: Feather, label: 'In Nature', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Lightbulb, label: 'The Principle', color: 'text-amber-600 bg-amber-50' },
  { icon: Home, label: 'In Your Home', color: 'text-plumage-primary bg-plumage-primary/10' },
];

export default function NatureDesignBridges() {
  const { navigate } = useNav();
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-2">
        Every design principle has a counterpart in nature. Tap a card to see how bird biology connects to the color theory you'll use in your home.
      </p>

      {BRIDGE_CARDS.map(card => {
        const isOpen = expandedId === card.id;
        const exampleBird = birds.find(card.findBird);
        const texts = [card.nature, card.principle, card.homeApp];

        return (
          <div key={card.id} className="bg-white rounded-2xl border border-plumage-border overflow-hidden">
            <button
              onClick={() => setExpandedId(isOpen ? null : card.id)}
              className="w-full text-left p-4 hover:bg-plumage-surface-alt/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-base text-gray-800">{card.title}</p>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-4">
                {LAYER_CONFIG.map((layer, i) => (
                  <div key={layer.label} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${layer.color}`}>
                      <layer.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{layer.label}</p>
                      <p className="text-xs text-gray-600">{texts[i]}</p>
                    </div>
                  </div>
                ))}

                {exampleBird && (
                  <div className="bg-plumage-surface-alt rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium mb-2">See it in action</p>
                    <button
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      onClick={() => navigate('palette-detail', { birdId: exampleBird.id })}
                    >
                      <PaletteStrip colors={exampleBird.colors} height="h-5" className="w-24 rounded-md" clickable={false} />
                      <span className="text-xs text-plumage-primary font-medium">{exampleBird.name} &rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
