# Ploom — Concept Document

## What It Is

Ploom is a web app that turns real bird plumage into interior design palettes. Every palette is derived from an actual bird species, giving each color story a biological origin and a natural harmony that random color generators can't replicate.

The app covers the full journey from inspiration to execution: discover a palette, visualize it in a room, get exact paint codes, find matching materials, export a contractor-ready spec sheet, and plan your whole house.

## The Problem

Picking paint colors is one of the most stressful parts of decorating. People spend hours on Pinterest boards and paint chip walls, only to end up with colors that clash, feel flat, or don't work together across rooms. The gap between "I like this color" and "here's exactly what to buy and where to put it" is where most people get stuck.

## The Solution

Nature already solved color harmony. Birds evolved their plumage over millions of years — every combination serves a purpose, and every palette has built-in balance. Ploom translates that biological wisdom into practical design tools:

- **219 bird palettes** with 5-6 colors each, analyzed for harmony type (analogous, complementary, triadic, etc.)
- **Room-specific ratings** — not every palette works in every room; Ploom tells you which rooms each palette suits best
- **Real paint codes** — Sherwin-Williams and Benjamin Moore matches for every color, with deltaE accuracy ratings
- **One-tap shopping** — direct links to buy matched paints on SW and BM websites
- **Material guidance** — what flooring, hardware, stone, and textiles pair with each palette based on style and undertone
- **Export tools** — shareable recipe cards and contractor spec sheets generated client-side
- **Whole-house planning** — assign palettes to rooms, mark which rooms are adjacent, and check if colors flow smoothly between spaces

## Who It's For

1. **Homeowners redecorating** — the primary audience. People who want a cohesive color plan but don't want to hire a designer.
2. **Interior design enthusiasts** — hobbyists who enjoy color theory and want a tool that goes deeper than "trending palettes."
3. **DIY painters** — people who need the paint codes, finish recommendations, and spec sheets to hand to a contractor or use themselves.
4. **Nature/bird lovers** — the 47M+ US birding community. The conservation angle and species stories add meaning beyond aesthetics.

## How It Works

### Discovery Layer
Users enter through one of several paths:
- **Style Quiz** — 4 questions about their space → matched to a palette
- **Photo Upload** — snap a room or swatch → extract colors → find the closest bird palette
- **Browse** — filter by room, mood, style, harmony, or just scroll all 219

### Palette Detail
Each palette page is a complete design brief:
- Abstract room visualizer showing color proportions for 4 room types
- Every color with its role (60% walls / 30% textiles / 10% accents), finish, and application note
- Top 2 SW + 2 BM paint matches per color, each with a shop link
- Coordinating neutrals (trim, ceiling, floor)
- Material pairings — flooring, hardware/metals, stone/counters, textiles
- The bird's color biology — why evolution chose these colors
- Room ratings with explanations
- Export buttons: Instagram-story recipe card or A4 contractor spec sheet

### Project Tools (My Studio)
- Save palettes for later
- Create room projects and assign palettes
- **Room-by-Room Planner** — build a house plan, assign a palette to each room, mark adjacencies, then run a "flow check" that uses deltaE color science to rate how smoothly colors transition between connected spaces
- Palette Mixer — blend colors from different bird palettes
- Side-by-side comparison view

### AI Consultant
Bring-your-own-API-key chat that knows the palette context. Ask it anything — "will this work in a north-facing room?" or "what accent wall color would pop?"

## What Makes It Different

| Feature | Generic palette tools | Ploom |
|---|---|---|
| Color source | Random / algorithmic | Real bird species (biological harmony) |
| Paint codes | Sometimes | Always — SW + BM with accuracy ratings |
| Buy links | No | Direct to product pages |
| Materials | No | Flooring, hardware, stone, textiles per palette |
| Room guidance | No | Per-room ratings + abstract visualizer |
| Multi-room planning | No | Adjacency mapping + flow analysis |
| Exportable specs | No | Recipe cards + contractor spec sheets |
| Story/meaning | No | Bird biology, conservation, habitat context |

## Data

- **219 bird species** from Christopher Reiger's Field Guide art series
- **~1,500 Sherwin-Williams colors** with pre-computed LAB values
- **~2,100 Benjamin Moore colors** with pre-computed LAB values
- **14 design styles** mapped to material pairings (farmhouse, japandi, art deco, etc.)
- **5 mood categories** with texture guidance
- **3 undertone profiles** (warm, cool, neutral) with metal and stone affinities

## Technical Notes

- Pure client-side — no backend, no database, no auth (except optional AI key)
- React 18 + Vite + Tailwind CSS
- Zero external dependencies beyond React and Lucide icons
- Paint data and export generators are code-split (lazy loaded)
- Image generation via native Canvas API
- All state in localStorage
- Deployed on GitHub Pages

## Status

Live and feature-complete at v4. Current bundle: ~1,045KB main (170KB gzipped) + ~200KB paint data (loaded on demand).
