import { describe, expect, it } from 'vitest';
import { analyzeText } from './index';

describe('analyzeText pipeline', () => {
  it('never invents data for empty input', () => {
    const result = analyzeText('');
    expect(result.tokens).toEqual([]);
    expect(result.keywords).toEqual([]);
    expect(result.graph.nodes).toEqual([]);
    expect(result.statistics.words).toBe(0);
    expect(result.statistics.readingTimeMinutes).toBe(0);
  });

  it('produces a complete result for meaningful text', () => {
    const text = 'Data flows through networks. Networks carry data. Data and networks shape signals.';
    const result = analyzeText(text);
    expect(result.statistics.words).toBeGreaterThan(10);
    expect(result.statistics.uniqueWords).toBeGreaterThan(3);
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.sentences).toHaveLength(3);
    expect(result.graph.nodes.length).toBeGreaterThan(0);
    expect(result.graph.links.length).toBeGreaterThan(0);
    expect(result.clusters.length).toBeGreaterThan(0);
  });

  it('respects configured graph limits', () => {
    const long = Array.from({ length: 40 }, (_, i) => `signal${i} data${i} network${i}.`).join(' ');
    const result = analyzeText(long, { maxNodes: 10, maxLinks: 5 });
    expect(result.graph.nodes.length).toBeLessThanOrEqual(10);
    expect(result.graph.links.length).toBeLessThanOrEqual(5);
  });

  it('handles punctuation-heavy and whitespace-heavy input safely', () => {
    const result = analyzeText('   !!! ???   ...\n\n   data   data!!!   ');
    expect(result.statistics.words).toBe(2);
    expect(result.keywords[0]?.word).toBe('data');
    expect(Number.isFinite(result.statistics.averageWordLength)).toBe(true);
  });

  it('assigns every node to a cluster', () => {
    const result = analyzeText('Noise becomes signal when signal repeats across noise.');
    const clustered = new Set(result.clusters.flatMap((cluster) => cluster.words));
    expect(result.graph.nodes.every((node) => clustered.has(node.id))).toBe(true);
  });
});
