import type { AnalysisResult } from '@/types';

export interface AnalysisExport {
  app: 'YourVisualizer';
  version: 1;
  generatedAt: string;
  disclaimer: string;
  sourceText: string;
  statistics: AnalysisResult['statistics'];
  keywords: AnalysisResult['keywords'];
  frequencies: AnalysisResult['frequencies'];
  ngrams: AnalysisResult['ngrams'];
  sentences: AnalysisResult['sentences'];
  relationships: AnalysisResult['relationships'];
  clusters: AnalysisResult['clusters'];
  graph: AnalysisResult['graph'];
}

export function buildAnalysisExport(analysis: AnalysisResult): AnalysisExport {
  return {
    app: 'YourVisualizer',
    version: 1,
    generatedAt: new Date(analysis.createdAt).toISOString(),
    disclaimer:
      'Local algorithmic analysis. Co-occurrence links are positional, not semantic similarity. No AI model was used.',
    sourceText: analysis.text,
    statistics: analysis.statistics,
    keywords: analysis.keywords,
    frequencies: analysis.frequencies,
    ngrams: analysis.ngrams,
    sentences: analysis.sentences,
    relationships: analysis.relationships,
    clusters: analysis.clusters,
    graph: analysis.graph,
  };
}

export function downloadJson(analysis: AnalysisResult): void {
  const payload = JSON.stringify(buildAnalysisExport(analysis), null, 2);
  downloadBlob(new Blob([payload], { type: 'application/json' }), 'yourvisualizer-analysis.json');
}

export async function copyAnalysisSummary(analysis: AnalysisResult): Promise<boolean> {
  const stats = analysis.statistics;
  const lines = [
    'YOURVISUALIZER — LOCAL ANALYSIS SUMMARY',
    'Algorithmic text analysis. Co-occurrence is positional, not semantic.',
    '',
    `Words: ${stats.words} | Unique: ${stats.uniqueWords} | Sentences: ${stats.sentences}`,
    `Avg word length: ${stats.averageWordLength} | Avg sentence: ${stats.averageSentenceLength}`,
    `Diversity: ${stats.lexicalDiversity} | ~${stats.readingTimeMinutes} min read (est.)`,
    '',
    'TOP KEYWORDS',
    ...analysis.keywords.slice(0, 12).map((item, i) => `${i + 1}. ${item.word} (${item.count})`),
    '',
    'REPEATED PHRASES (BIGRAMS)',
    ...analysis.ngrams.bigrams.slice(0, 8).map((item) => `${item.phrase} — ${item.count}`),
  ].join('\n');

  try {
    await navigator.clipboard.writeText(lines);
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
