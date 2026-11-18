# Changelog

All notable changes to YourVisualizer are documented here.

## Unreleased

### Features

- Cinematic overview with animated canvas word network.
- Responsive navigation with mobile menu and global footer.
- Three-panel visualizer workspace with live counters and sample library.
- Local analysis engine: tokenization, frequency, keywords, sentences, n-grams, co-occurrence,
  clustering, and statistics.
- Interactive SVG graph with node selection, highlighting, tooltips, zoom, pan, reset, fullscreen,
  and PNG export.
- Insights panel with keyword ranking, statistics, and selected-node details.
- Explore screen with keyword, phrase, sentence, and cluster views.
- About screen explaining algorithms and limitations.
- Local JSON, clipboard summary, and text report exports.
- Session-only analysis history with restore.

### Quality

- 35 unit tests covering analysis primitives, pipeline edge cases, and export generation.
- Strict TypeScript, production build, and Vitest all pass.
- Accessibility: skip link, keyboard shortcut, focus rings, ARIA labels, live status, reduced motion.
- Performance: single-pass co-occurrence bucketing and direct SVG transform animation.
