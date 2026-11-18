import type { Relationship, Sentence, Token } from '@/types';

export interface CooccurrenceOptions {
  /** Maximum token distance considered "near". Defaults to 4. */
  windowSize?: number;
  /** Maximum number of links retained. Defaults to 90. */
  maxLinks?: number;
  /** Restrict links to these normalized words. Defaults to all content words. */
  candidates?: Set<string>;
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
}

/**
 * Sentence-scoped sliding-window co-occurrence.
 *
 * Two words are linked when they appear within `windowSize` tokens of each
 * other in the same sentence. The link weight is the number of times that
 * pairing occurs. These are positional relationships only — not evidence of
 * semantic similarity.
 */
export function computeCooccurrence(
  tokens: Token[],
  sentences: Sentence[],
  options: CooccurrenceOptions = {},
): Relationship[] {
  const { windowSize = 4, maxLinks = 90, candidates } = options;
  const weights = new Map<string, Relationship>();

  const allowed = (token: Token) =>
    !token.isStopWord && token.normalized.length >= 3 && (!candidates || candidates.has(token.normalized));

  // Bucket tokens into sentences in a single pass (tokens are source-ordered).
  const buckets: Token[][] = sentences.map(() => []);
  let sentenceIndex = 0;
  for (const token of tokens) {
    while (
      sentenceIndex < sentences.length &&
      token.start >= (sentences[sentenceIndex]?.end ?? 0)
    ) {
      sentenceIndex += 1;
    }
    if (sentenceIndex >= sentences.length) break;
    const sentence = sentences[sentenceIndex]!;
    if (token.start >= sentence.start && allowed(token)) {
      buckets[sentenceIndex]!.push(token);
    }
  }

  for (const inSentence of buckets) {
    for (let i = 0; i < inSentence.length; i += 1) {
      const source = inSentence[i];
      if (!source) continue;
      for (let offset = 1; offset <= windowSize; offset += 1) {
        const target = inSentence[i + offset];
        if (!target || target.normalized === source.normalized) continue;
        const key = pairKey(source.normalized, target.normalized);
        const existing = weights.get(key);
        if (existing) {
          existing.weight += 1;
        } else {
          const [first, second] = key.split('\u0000');
          weights.set(key, { source: first ?? source.normalized, target: second ?? target.normalized, weight: 1 });
        }
      }
    }
  }

  return Array.from(weights.values())
    .sort((a, b) => b.weight - a.weight || a.source.localeCompare(b.source) || a.target.localeCompare(b.target))
    .slice(0, maxLinks);
}
