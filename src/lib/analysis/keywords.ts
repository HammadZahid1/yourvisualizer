import type { Token, WordFrequency } from '@/types';
import { countFrequencies } from './frequency';

export interface KeywordOptions {
  limit?: number;
  minLength?: number;
}

interface ScoredWord extends WordFrequency {
  score: number;
}

/**
 * Transparent, frequency-first keyword ranking.
 *
 * score = frequency × (1 + 0.04 × min(max(length − 3, 0), 8))
 *
 * Stop words and very short tokens are removed first. The mild length weight
 * only breaks near-ties in favour of more specific terms; it is not semantic
 * understanding. Ties are resolved by count, then alphabetically.
 */
export function extractKeywords(tokens: Token[], options: KeywordOptions = {}): WordFrequency[] {
  const { limit = 12, minLength = 3 } = options;

  const scored: ScoredWord[] = countFrequencies(tokens, {
    includeStopWords: false,
    minLength,
  }).map(({ word, count }) => ({
    word,
    count,
    score: count * (1 + 0.04 * Math.min(Math.max(word.length - 3, 0), 8)),
  }));

  return scored
    .sort(
      (a, b) =>
        b.score - a.score || b.count - a.count || a.word.localeCompare(b.word),
    )
    .slice(0, limit)
    .map(({ word, count }) => ({ word, count }));
}
