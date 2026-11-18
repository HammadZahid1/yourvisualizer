import type { Sentence, Token } from '@/types';

/**
 * Sentence splitting is intentionally simple and transparent: a sentence ends
 * at one or more . ! or ? characters followed by whitespace/end, or at a line
 * break. Repeated punctuation ("What?!") is treated as one boundary.
 */
const SENTENCE_PATTERN = /[^.!?\n]+(?:[.!?]+(?=\s|$)|$)/g;

export function splitSentences(text: string): string[] {
  if (!text.trim()) return [];

  const matches = text.match(SENTENCE_PATTERN);
  if (!matches) return [];

  return matches
    .map((sentence) => sentence.trim())
    .filter((sentence) => /[\p{L}\p{N}]/u.test(sentence));
}

/** Build sentence records, counting only word tokens inside each sentence. */
export function analyzeSentences(text: string, tokens: Token[]): Sentence[] {
  const sentences = splitSentences(text);
  const ordered = [...tokens].sort((a, b) => a.start - b.start);
  let searchFrom = 0;
  let tokenCursor = 0;

  return sentences.map((sentence, index) => {
    const relativeStart = text.indexOf(sentence, searchFrom);
    const start = relativeStart >= 0 ? relativeStart : searchFrom;
    const end = start + sentence.length;
    searchFrom = end;

    let wordCount = 0;
    while (tokenCursor < ordered.length && ordered[tokenCursor]!.start < end) {
      wordCount += 1;
      tokenCursor += 1;
    }

    return { text: sentence, index, wordCount, start, end };
  });
}
