import { describe, expect, it } from 'vitest';
import { analyzeSentences, splitSentences } from './sentences';
import { tokenize } from './tokenize';

describe('sentence analysis', () => {
  it('handles repeated punctuation as one boundary', () => {
    expect(splitSentences('One. Two?! Three!')).toEqual(['One.', 'Two?!', 'Three!']);
  });

  it('treats unpunctuated text as one sentence', () => {
    expect(splitSentences('just a single thought')).toEqual(['just a single thought']);
  });

  it('returns no sentences for empty input', () => {
    expect(splitSentences('')).toEqual([]);
    expect(splitSentences('   ')).toEqual([]);
  });

  it('counts tokens within each sentence', () => {
    const text = 'First sentence here. Second one.';
    const sentences = analyzeSentences(text, tokenize(text));
    expect(sentences.map((sentence) => sentence.wordCount)).toEqual([3, 2]);
    expect(sentences[1]?.text).toBe('Second one.');
  });
});
