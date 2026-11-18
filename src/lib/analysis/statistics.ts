import type { Sentence, TextStatistics, Token } from '@/types';

const WORDS_PER_MINUTE = 200;

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Compute descriptive statistics. Reading time is a rough estimate only. */
export function computeStatistics(
  text: string,
  tokens: Token[],
  sentences: Sentence[],
): TextStatistics {
  const words = tokens.length;
  const uniqueWords = new Set(tokens.map((token) => token.normalized)).size;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean).length;

  const totalWordLength = tokens.reduce(
    (sum, token) => sum + token.normalized.replace(/['\-]/g, '').length,
    0,
  );

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences: sentences.length,
    paragraphs,
    uniqueWords,
    averageWordLength: words ? round(totalWordLength / words, 1) : 0,
    averageSentenceLength: sentences.length ? round(words / sentences.length, 1) : 0,
    readingTimeMinutes: words ? Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)) : 0,
    lexicalDiversity: words ? round(uniqueWords / words, 2) : 0,
  };
}
