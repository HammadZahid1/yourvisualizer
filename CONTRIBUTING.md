# Contributing to YourVisualizer

Thanks for helping improve YourVisualizer. The project is intentionally small, local-first, and
framework-light.

## Ground rules

- Keep the application frontend-only. Do not add a backend, database, API keys, or analytics.
- All text processing must remain in the browser. Do not introduce external AI services or network
  calls that carry user content.
- Be honest in copy and documentation: this is algorithmic analysis, not semantic understanding.
- Preserve existing behaviour unless a change is explicitly a fix or refactor.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use `npm test` while changing analysis logic.

## Development workflow

1. Create a small, focused branch or work directly on the current branch if that is the project norm.
2. Make one coherent change at a time.
3. Run `npm run typecheck`, `npm test`, and `npm run build`.
4. Commit with a Conventional Commit message, for example:
   - `feat: add cluster export`
   - `fix: handle single-word input`
   - `test: cover trigram generation`
   - `docs: clarify reading-time estimate`
5. Push the commit and verify the remote accepted it.

## Code style

- TypeScript strict mode is enabled. Avoid `any`; prefer explicit types in `src/types/`.
- Keep analysis logic in `src/lib/analysis/`, graph computation in `src/lib/graph/`, and exports in
  `src/lib/export/`. Components should stay focused on rendering and interaction.
- Use the existing CSS tokens in `src/styles/tokens.css` instead of hard-coded colours.
- Prefer small components and avoid global state beyond `useVisualizerState`.
- Respect `prefers-reduced-motion` and keep controls keyboard accessible.

## Testing

Unit tests live next to the module they cover and use Vitest. Add tests for empty input, punctuation,
repeated whitespace, and boundary values whenever you change analysis code.

## Reporting issues

Include the browser, viewport size, steps to reproduce, expected behaviour, and actual behaviour.
For visual issues, describe the layout rather than attaching user text.

## License

No license has been selected yet. Do not assume one; ask the maintainer before redistributing.
