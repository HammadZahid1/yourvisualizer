import { describe, expect, it } from 'vitest';
import { analyzeText } from '../analysis';
import { buildAnalysisExport } from './json';
import { buildTextReport } from './report';

const analysis = analyzeText('Data flows through networks. Networks carry data.');

describe('export generation', () => {
  it('builds a JSON payload with a disclaimer and source text', () => {
    const payload = buildAnalysisExport(analysis);
    expect(payload.app).toBe('YourVisualizer');
    expect(payload.sourceText).toBe(analysis.text);
    expect(payload.disclaimer).toContain('not semantic');
    expect(payload.statistics.words).toBe(analysis.statistics.words);
  });

  it('builds a readable text report', () => {
    const report = buildTextReport(analysis);
    expect(report).toContain('YOURVISUALIZER');
    expect(report).toContain('TEXT STATISTICS');
    expect(report).toContain('TOP KEYWORDS');
    expect(report).toContain('Co-occurrence links show words appearing near each other');
    expect(report).toContain(analysis.text);
  });
});
