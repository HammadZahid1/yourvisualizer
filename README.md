# YourVisualizer

> Visualize the hidden patterns inside your words.

YourVisualizer is a frontend-only, interactive text visualization playground. Paste a paragraph,
article, or story and it produces a word relationship network, keyword rankings, repeated-phrase
lists, sentence analysis, and descriptive statistics — **entirely inside your browser**.

There is no backend, no database, no account system, no API key, and no external service. All
processing is local, algorithmic text analysis. The app does **not** use an AI model and does not
claim to understand meaning.

---

## Features

- **Cinematic overview** with a live canvas word-network animation.
- **Three-panel workspace**: text editor, interactive graph, and insights readout.
- **Co-occurrence graph** with weighted links, cluster colours, node selection, hover tooltips,
  connected-node highlighting, zoom, pan, reset, fullscreen, and PNG export.
- **Local analysis engine**: tokenization, word frequency, stop-word filtering, transparent keyword
  scoring, sentence analysis, unigram/bigram/trigram detection, co-occurrence, and connected-component
  clustering.
- **Explore screen** with searchable keywords, phrase ranking, sentence explorer, and cluster cards.
- **Sample library** with six original fictional texts (technology, AI, space, robotics, science,
  creative writing).
- **Export** a JSON payload, a plain-text report, a copied summary, or a graph PNG — all generated locally.
- **Session history** for analyses run during the current page session only.
- **Responsive layout** with a mobile navigation menu and stacked panels.
- **Accessible controls**: keyboard-focusable graph nodes, a skip link, `Ctrl/⌘ + Enter` to analyze,
  ARIA labels, live status messages, and reduced-motion support.

---

## Screenshots

> Screenshots will be added once the visual review is complete.

| Screen | Placeholder |
| --- | --- |
| Overview hero | _screenshot pending_ |
| Visualizer workspace | _screenshot pending_ |
| Explore screen | _screenshot pending_ |

---

## Technology stack

| Concern | Choice |
| --- | --- |
| UI | React 19 + TypeScript (strict) |
| Build | Vite 6 |
| Motion | Framer Motion |
| Icons | Lucide React |
| Styling | Hand-authored CSS with centralized design tokens |
| Graph / hero | SVG and Canvas 2D (no WebGL dependency) |
| Tests | Vitest |

No UI framework, chart library, or AI SDK is used.

---

## Installation

```bash
git clone https://github.com/HammadZahid1/yourvisualizer.git
cd yourvisualizer
npm install
```

## Development commands

```bash
npm run dev        # start the Vite dev server on http://localhost:5173
npm run typecheck  # strict TypeScript check
npm test           # run the Vitest unit suite
npm run build      # typecheck + production build into dist/
npm run preview    # preview the production build locally
```

---

## How local analysis works

The pipeline lives in `src/lib/analysis/` and is deterministic for a given input:

1. **Tokenization** — Unicode-aware matching extracts words with source offsets. Internal
   apostrophes and hyphens are preserved; punctuation and repeated whitespace are ignored.
2. **Frequency** — normalized words are counted. A conventional stop-word list is available for
   keyword ranking.
3. **Keyword scoring** — stop words and tokens under three characters are removed, then
   `score = frequency × (1 + 0.04 × min(max(length − 3, 0), 8))`. This mild length weight only
   breaks near-ties; there is no learned model.
4. **Sentences** — text is split on terminal punctuation (`! . ?`) and line breaks. Repeated
   punctuation counts as one boundary.
5. **N-grams** — sliding windows produce repeated one-, two-, and three-word sequences.
6. **Co-occurrence** — within each sentence, words within four tokens of each other are linked.
   Link weight is the number of observed pairings. These are **positional** relationships, not
   semantic similarity.
7. **Clusters** — connected components of the link graph form structural groups labelled by their
   most frequent member. This is not topic modelling.
8. **Statistics** — counts, averages, lexical diversity, and a rough reading-time estimate
   (`~200 words/minute`). These are descriptive hints, not assessments.

Graph layout is a deterministic force simulation (`src/lib/graph/layout.ts`) computed in normalized
space; node floating is applied directly to SVG elements via `requestAnimationFrame` to avoid React
re-renders.

---

## Architecture overview

```
src/
  components/
    layout/       App shell, header-independent chrome, footer, ambient background
    navigation/   Responsive header and mobile menu
    hero/         Canvas hero network
    ui/           Reusable Button and Panel primitives
    visualizer/   Workspace, editor, export toolbar, session history
    graph/        SVG graph, controls, tooltip
    insights/     Insight sections, keyword list, statistics, node details
    explore/      Keyword, phrase, sentence, and cluster explorers
  pages/          Overview, Visualizer composition, Explore, About
  hooks/          Session state hook
  lib/
    analysis/     Pure analysis modules + orchestrator
    graph/        Graph model and deterministic layout
    export/       JSON, clipboard, text report, PNG
  data/           Original sample texts
  types/          Shared domain types
  styles/         Design tokens and global base styles
```

Analysis logic is kept separate from UI, graph calculations are separate from rendering, and sample
data is isolated from application logic.

---

## Privacy

- Text never leaves the browser. There is no network request carrying user content.
- No analytics, tracking, cookies, accounts, or cloud processing.
- Session history lives in React memory only and disappears on reload.
- Exports are generated locally and downloaded directly by the browser.

---

## Limitations

- English stop words and simple sentence punctuation rules; other languages are tokenized but not
  specially handled.
- Keyword ranking is frequency-based, not semantic; common words can still dominate short texts.
- Reading time and diversity are rough heuristics.
- The graph is capped at 34 nodes and 90 links to stay responsive.
- The PNG export relies on SVG serialization; very large graphs are intentionally avoided.

---

## Future improvements

- Additional language-specific stop-word sets.
- More layout strategies and saved graph views.
- Importing previously exported JSON sessions.
- Optional local text comparison between two passages.
- Component-level tests and visual regression snapshots.

---

## License

No license has been selected yet. See [CONTRIBUTING.md](CONTRIBUTING.md) for development notes.
