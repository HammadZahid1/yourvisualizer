import type { Token, WordFrequency } from '@/types';

export interface FrequencyOptions {
  /** Include stop words in the result. Defaults to true. */
  includeStopWords?: boolean;
  /** Exclude tokens shorter than this. Defaults to 1. */
  minLength?: number;
}

function compareFrequencies(a: WordFrequency, b: WordFrequency): number {
  return b.count - a.count || a.word.localeCompare(b.word);
}

/** Count normalized words and return them ordered by descending frequency. */
export function countFrequencies(tokens: Token[], options: FrequencyOptions = {}): WordFrequency[] {
  const { includeStopWords = true, minLength = 1 } = options;
  const counts = new Map<string, number>();

  for (const token of tokens) {
    if (!includeStopWords && token.isStopWord) continue;
    if (token.normalized.length < minLength) continue;
    counts.set(token.normalized, (counts.get(token.normalized) ?? 0) + 1);
  }

  return Array.from(counts, ([word, count]) => ({ word, count })).sort(compareFrequencies);
}

export function getMostFrequent(frequencies: WordFrequency[], limit = 10): WordFrequency[] {
  return frequencies.slice(0, limit);
}

export function getLeastFrequent(frequencies: WordFrequency[], limit = 10): WordFrequency[] {
  return [...frequencies].sort((a, b) => compareFrequencies(b, a)).slice(0, limit);
}

/** Return the token positions where a normalized word occurs. */
export function getOccurrences(tokens: Token[], word: string): number[] {
  return tokens.filter((token) => token.normalized === word).map((token) => token.index);
}
