import type { Token } from '@/types';
import { isStopWord } from './stopWords';

/**
 * Unicode-aware word pattern. Keeps internal apostrophes and hyphens so
 * "don't", "state-of-the-art" and "naïve" remain intact, while punctuation
 * and repeated whitespace are ignored.
 */
const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;

function normalizeToken(raw: string): string {
  return raw.replace(/’/g, "'").toLowerCase();
}

/** Split text into ordered tokens with source offsets. */
export function tokenize(text: string): Token[] {
  if (!text) return [];

  const tokens: Token[] = [];
  let match: RegExpExecArray | null;
  WORD_PATTERN.lastIndex = 0;

  while ((match = WORD_PATTERN.exec(text)) !== null) {
    const raw = match[0];
    const normalized = normalizeToken(raw);
    if (!normalized) continue;
    tokens.push({
      text: raw,
      normalized,
      start: match.index,
      end: match.index + raw.length,
      index: tokens.length,
      isStopWord: isStopWord(normalized),
    });
  }

  return tokens;
}

/** Normalize a user-entered word with the same rules used for tokens. */
export function normalizeWord(value: string): string {
  return normalizeToken(value.trim());
}
