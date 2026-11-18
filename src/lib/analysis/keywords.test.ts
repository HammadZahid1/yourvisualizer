import { describe, expect, it } from 'vitest';
import { extractKeywords } from './keywords';
import { tokenize } from './tokenize';

describe('keyword extraction', () => {
  it('ranks the most frequent content word first', () => {
    const keywords = extractKeywords(tokenize('data data data signal signal noise'));
    expect(keywords[0]).toEqual({ word: 'data', count: 3 });
  });

  it('removes stop words and short tokens', () => {
    const keywords = extractKeywords(tokenize('the and of a I data signal'));
    // Equal frequencies: the mild length weight ranks "signal" above "data".
    expect([...keywords.map((item) => item.word)].sort()).toEqual(['data', 'signal']);
  });

  it('respects the requested limit', () => {
    const text = 'alpha alpha beta beta gamma gamma delta delta epsilon epsilon';
    expect(extractKeywords(tokenize(text), { limit: 3 })).toHaveLength(3);
  });

  it('returns nothing for punctuation-only input', () => {
    expect(extractKeywords(tokenize('!!! ??? ...'))).toEqual([]);
  });
});
