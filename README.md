# Ploom

**Nature-inspired interior design palettes, powered by birds.**

Ploom turns the plumage of 228 real bird species into actionable interior design palettes — complete with paint codes, material pairings, room visualizations, and shareable exports.

**Live:** [ploom on GitHub Pages](https://tcl1019.github.io/plumage-palettes/)

## Features

### Discover & Explore
- **228 bird palettes** — each with 5-6 colors, harmony analysis, room ratings, and finish recommendations
- **Bird-first landing** — full-screen hero carousel with Unsplash photography, hand-written stories, and abstract FeatherPattern SVG backgrounds
- **Style Quiz** — 4 questions to match your space to a palette
- **Photo Color Match** — upload a photo or enter a hex to find the closest bird palette
- **Browse by room, mood, style, or harmony type**

### Palette Detail
- **Room Visualizer** — abstract grid compositions for living room, bedroom, kitchen, and bathroom
- **Paint Matching** — top 2 Sherwin-Williams + 2 Benjamin Moore matches per color with deltaE quality ratings
- **Shop Links** — direct links to SW and BM product pages for every match
- **Material Pairings** — flooring, hardware, stone, and textile suggestions based on style, mood, and undertone
- **Nature's Design Brief** — the biology behind each bird's color strategy
- **Value Scales** — tints and shades for every color in the palette

### Export & Share
- **Palette Recipe Card** — shareable 1080x1920 Instagram-story PNG with colors, paint codes, and finishes
- **Contractor Spec Sheet** — A4-sized PNG with all SW + BM codes, finishes, materials, and room ratings

### My Studio
- **Save palettes**, create **projects**, and mix **custom palettes**
- **Room-by-Room Planner** — map your house, assign palettes to rooms, mark adjacencies, and run a color flow check (deltaE-based transition analysis)
- **Compare** palettes side by side
- **Palette Mixer** — blend colors from multiple palettes

### AI Color Consultant
- **Chat with AI** about any palette using your own API key
- Context-aware: knows the palette, room ratings, and harmony when you ask

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Canvas API for image generation (no external dependencies)
- localStorage for persistence
- Code-split paint data + export generators

## Getting Started

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173/plumage-palettes/`

```bash
npm run build
```

Production build outputs to `dist/`.

## Project Structure

```
src/
  components/
    features/     # RoomVisualizer, RoomPlanner, PaletteMixer, CompareView, etc.
    layout/       # Header, Navigation
    sections/     # Discover, Explore, PaletteDetail, MyStudio, Learn
    shared/       # PaintMatch, MaterialPairings, PaletteStrip, FeatherPattern, NatureCard, etc.
  data/
    birds.js      # 228 bird palettes with colors, rooms, harmony, nature data
    herobirds.js  # Featured birds with hand-written stories + Unsplash image URLs
    materials.js  # Material pairing logic (14 styles, 5 moods, 3 undertones)
    paints/       # Sherwin-Williams + Benjamin Moore color databases
    constants.js  # Design styles, finishes, roles, moods
    flockPairings.js
  hooks/
    useStudio.js  # localStorage state: saves, projects, house plans, custom palettes
  utils/
    colorUtils.js          # hex/rgb/hsl/lab conversions, deltaE, tints/shades
    paintMatcher.js        # Nearest-paint search with pre-computed LAB values
    recipeCardGenerator.js # Canvas API — 1080x1920 recipe card
    specSheetGenerator.js  # Canvas API — 2480x3508 spec sheet
    flowCheck.js           # Room adjacency color flow analysis
    shopUrls.js            # SW + BM product page URL generation
    colorExtractor.js      # Photo upload color extraction
```

## License

MIT
