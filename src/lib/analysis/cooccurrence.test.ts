import { describe, expect, it } from 'vitest';
import { computeCooccurrence } from './cooccurrence';
import { analyzeSentences } from './sentences';
import { tokenize } from './tokenize';

describe('co-occurrence', () => {
  const text = 'Data flows through data pipes. Data shapes signals.';
  const tokens = tokenize(text);
  const sentences = analyzeSentences(text, tokens);
  const candidates = new Set(['data', 'flows', 'pipes', 'shapes', 'signals']);

  it('creates weighted links between nearby words', () => {
    const links = computeCooccurrence(tokens, sentences, { candidates });
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((link) => link.weight >= 1)).toBe(true);
  });

  it('never creates self-links and keeps source/target ordered', () => {
    const links = computeCooccurrence(tokens, sentences, { candidates });
    expect(links.every((link) => link.source !== link.target)).toBe(true);
    expect(links.every((link) => link.source < link.target)).toBe(true);
  });

  it('respects the candidate set and link limit', () => {
    const links = computeCooccurrence(tokens, sentences, { candidates, maxLinks: 2 });
    expect(links).toHaveLength(2);
    expect(
      links.every((link) => candidates.has(link.source) && candidates.has(link.target)),
    ).toBe(true);
  });

  it('does not link words across sentences', () => {
    const links = computeCooccurrence(tokens, sentences, {
      candidates: new Set(['pipes', 'shapes']),
      windowSize: 8,
    });
    expect(links).toEqual([]);
  });

  it('returns nothing for empty input', () => {
    expect(computeCooccurrence([], [], { candidates })).toEqual([]);
  });
});
