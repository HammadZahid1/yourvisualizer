import type { NGram, Token } from '@/types';

export interface NGramOptions {
  /** Only keep phrases appearing at least this many times. */
  minCount?: number;
  /** Maximum number of phrases returned. Defaults to 12. */
  limit?: number;
  /** Include stop words inside phrases. Defaults to true. */
  includeStopWords?: boolean;
}

/** Generate repeated phrases of size 1 (unigram), 2 (bigram) or 3 (trigram). */
export function generateNGrams(
  tokens: Token[],
  size: 1 | 2 | 3,
  options: NGramOptions = {},
): NGram[] {
  const { minCount = size === 1 ? 2 : 2, limit = 12, includeStopWords = true } = options;
  if (tokens.length < size) return [];

  const pool = includeStopWords ? tokens : tokens.filter((token) => !token.isStopWord);
  const counts = new Map<string, number>();

  for (let i = 0; i <= pool.length - size; i += 1) {
    const phrase = pool.slice(i, i + size).map((token) => token.normalized).join(' ');
    counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
  }

  return Array.from(counts, ([phrase, count]) => ({ phrase, count, size }))
    .filter((gram) => gram.count >= minCount)
    .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase))
    .slice(0, limit);
}
