import { describe, expect, it } from 'vitest';
import { countFrequencies, getLeastFrequent, getMostFrequent, getOccurrences } from './frequency';
import { tokenize } from './tokenize';

describe('word frequency', () => {
  it('counts words and sorts by descending frequency', () => {
    const result = countFrequencies(tokenize('Apple apple Banana apple'));
    expect(result).toEqual([
      { word: 'apple', count: 3 },
      { word: 'banana', count: 1 },
    ]);
  });

  it('can exclude stop words', () => {
    const result = countFrequencies(tokenize('the cat and the dog'), {
      includeStopWords: false,
    });
    expect(result).toEqual([
      { word: 'cat', count: 1 },
      { word: 'dog', count: 1 },
    ]);
  });

  it('respects minimum length', () => {
    const result = countFrequencies(tokenize('a I an data'), { minLength: 3 });
    expect(result).toEqual([{ word: 'data', count: 1 }]);
  });

  it('returns most and least frequent slices', () => {
    const frequencies = countFrequencies(tokenize('one one two two two three'));
    expect(getMostFrequent(frequencies, 2).map((item) => item.word)).toEqual(['two', 'one']);
    expect(getLeastFrequent(frequencies, 1)[0]?.word).toBe('three');
  });

  it('returns occurrence token indices', () => {
    const tokens = tokenize('data signal data noise data');
    expect(getOccurrences(tokens, 'data')).toEqual([0, 2, 4]);
  });
});
