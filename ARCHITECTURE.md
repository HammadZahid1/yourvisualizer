# Architecture notes

This document explains the important design decisions in YourVisualizer. For commands and setup,
see [README.md](README.md).

## Data flow

```
TextEditor text -> useVisualizerState.runAnalysis -> analyzeText
                                                     -> tokenize / sentences / statistics
                                                     -> frequencies / keywords / ngrams
                                                     -> cooccurrence / clusters / graph
      AnalysisResult -> VisualizerWorkspace -> WordGraph + InsightsPanel
                     -> ExplorePage -> Keyword / Phrase / Sentence / Cluster explorers
```

`useVisualizerState` holds the only application-level state: live editor text, the committed
`AnalysisResult`, the selected keyword, session history, and an `isAnalyzing` flag. The editor
updates live text; analysis only runs when the user clicks Analyze, loads a sample, or restores a
history entry. This keeps expensive work off every keystroke while counters stay live via local
`useMemo` in `TextEditor`.

## Purity and determinism

Every module under `src/lib/analysis/` and `src/lib/graph/` is a pure function of its inputs. No
module imports React, reads the DOM, or calls the network. Graph layout uses a string hash as a
stable pseudo-random seed, so identical input produces identical positions.

## Graph constraints

`analyzeText` caps keywords at 34 and co-occurrence links at 90. This keeps the force layout at a
manageable size, limits label clutter, and makes SVG rendering smooth on mobile. Node floating is
written directly to SVG element transforms in a single animation frame loop, avoiding React state
updates per frame. The loop is cancelled on unmount and skipped entirely when reduced motion is
preferred.

## Rendering choices

- The hero uses Canvas 2D because it only needs decorative particles and labels.
- The relationship graph uses SVG because it gives precise hit-testing, keyboard focusable nodes,
  crisp labels, and straightforward PNG serialization.
- No WebGL context is required, so there is no need for a fallback renderer.

## Exports

`src/lib/export/` contains pure builders (`buildAnalysisExport`, `buildTextReport`) plus thin
browser-side download helpers. Keeping builders separate from DOM side effects makes them unit
testable. PNG export clones the SVG, injects a small stylesheet, rasterizes via an `Image`, and
downloads the resulting canvas blob.

## Privacy boundary

The application makes no `fetch`, `XMLHttpRequest`, or WebSocket calls. The only URLs involved are
local blob/data URLs generated for downloads and image rasterization. Sample text is authored in
this repository and contains no copyrighted material.

## Known trade-offs

- Stop words and sentence boundaries are English-centric.
- Connected-component clusters are intentionally simple and reproducible; they are not topics.
- Reading-time and diversity figures are labelled as estimates in the UI and in exports.
