import { describe, expect, it } from 'vitest';
import { generateNGrams } from './ngrams';
import { tokenize } from './tokenize';

describe('n-gram generation', () => {
  const tokens = tokenize('the cat sat the cat sat');

  it('generates repeated bigrams', () => {
    const bigrams = generateNGrams(tokens, 2, { limit: 5 });
    expect(bigrams[0]).toEqual({ phrase: 'cat sat', count: 2, size: 2 });
    expect(bigrams.find((gram) => gram.phrase === 'the cat')?.count).toBe(2);
  });

  it('generates repeated trigrams', () => {
    const trigrams = generateNGrams(tokens, 3);
    expect(trigrams).toEqual([{ phrase: 'the cat sat', count: 2, size: 3 }]);
  });

  it('can exclude stop words from phrases', () => {
    const grams = generateNGrams(tokens, 2, { includeStopWords: false, minCount: 1 });
    expect(grams.some((gram) => gram.phrase.includes('the'))).toBe(false);
  });

  it('returns nothing when no phrase repeats', () => {
    expect(generateNGrams(tokenize('one two three'), 2)).toEqual([]);
  });
});
