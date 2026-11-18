import { describe, expect, it } from 'vitest';
import { normalizeWord, tokenize } from './tokenize';

describe('tokenize', () => {
  it('returns no tokens for empty or whitespace-only text', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   \n\t  ')).toEqual([]);
  });

  it('normalizes case and ignores punctuation', () => {
    const tokens = tokenize('Hello, world!  Hello again.');
    expect(tokens.map((token) => token.normalized)).toEqual(['hello', 'world', 'hello', 'again']);
    expect(tokens).toHaveLength(4);
  });

  it('preserves source offsets and original text', () => {
    const [first, second] = tokenize('Hello, world!');
    expect(first).toMatchObject({ text: 'Hello', normalized: 'hello', start: 0, end: 5 });
    expect(second).toMatchObject({ text: 'world', normalized: 'world', start: 7, end: 12 });
  });

  it('keeps internal apostrophes and hyphens', () => {
    const tokens = tokenize("Don't stop state-of-the-art work");
    expect(tokens.map((token) => token.normalized)).toEqual([
      "don't",
      'stop',
      'state-of-the-art',
      'work',
    ]);
  });

  it('normalizes curly apostrophes consistently', () => {
    const tokens = tokenize('It’s fine');
    expect(tokens[0]?.normalized).toBe("it's");
    expect(normalizeWord("  IT’S  ")).toBe("it's");
  });

  it('flags stop words', () => {
    const tokens = tokenize('the quiet network');
    expect(tokens[0]?.isStopWord).toBe(true);
    expect(tokens[1]?.isStopWord).toBe(false);
  });
});
