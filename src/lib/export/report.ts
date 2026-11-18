import type { AnalysisResult } from '@/types';
import { downloadBlob } from './json';

/** Build a human-readable plain text report with no fabricated insight. */
export function buildTextReport(analysis: AnalysisResult): string {
  const stats = analysis.statistics;
  const lines: string[] = [
    '====================================================',
    ' YOURVISUALIZER — ANALYSIS REPORT',
    '====================================================',
    `Generated: ${new Date(analysis.createdAt).toLocaleString()}`,
    '',
    'NOTE: This report describes local, algorithmic measurements.',
    'Co-occurrence links show words appearing near each other, not',
    'semantic similarity. Reading time and diversity are estimates.',
    '',
    '--- TEXT STATISTICS ---',
    `Characters:              ${stats.characters}`,
    `Characters (no spaces):  ${stats.charactersNoSpaces}`,
    `Words:                   ${stats.words}`,
    `Unique words:            ${stats.uniqueWords}`,
    `Sentences:               ${stats.sentences}`,
    `Paragraphs:              ${stats.paragraphs}`,
    `Average word length:     ${stats.averageWordLength}`,
    `Average sentence length: ${stats.averageSentenceLength}`,
    `Lexical diversity:       ${stats.lexicalDiversity}`,
    `Reading time (est.):     ~${stats.readingTimeMinutes} min`,
    '',
    '--- TOP KEYWORDS ---',
  ];

  if (analysis.keywords.length === 0) lines.push('(none)');
  analysis.keywords.slice(0, 20).forEach((item, index) => {
    lines.push(`${String(index + 1).padStart(2, '0')}. ${item.word.padEnd(24)} ${item.count}`);
  });

  lines.push('', '--- MOST FREQUENT WORDS ---');
  analysis.frequencies.slice(0, 20).forEach((item, index) => {
    lines.push(`${String(index + 1).padStart(2, '0')}. ${item.word.padEnd(24)} ${item.count}`);
  });

  lines.push('', '--- REPEATED BIGRAMS ---');
  lines.push(...(analysis.ngrams.bigrams.length
    ? analysis.ngrams.bigrams.map((gram) => `${gram.phrase.padEnd(32)} ${gram.count}`)
    : ['(none)']));

  lines.push('', '--- REPEATED TRIGRAMS ---');
  lines.push(...(analysis.ngrams.trigrams.length
    ? analysis.ngrams.trigrams.map((gram) => `${gram.phrase.padEnd(44)} ${gram.count}`)
    : ['(none)']));

  lines.push('', '--- CLUSTERS ---');
  if (analysis.clusters.length === 0) lines.push('(none)');
  analysis.clusters.forEach((cluster) => {
    lines.push(`[${cluster.label}] ${cluster.words.join(', ')}`);
  });

  lines.push('', '--- SENTENCE WORD COUNTS ---');
  analysis.sentences.forEach((sentence) => {
    lines.push(`S${String(sentence.index + 1).padStart(2, '0')}: ${sentence.wordCount}`);
  });

  lines.push('', '--- SOURCE TEXT ---', analysis.text, '', 'End of report.');

  return lines.join('\n');
}

export function downloadTextReport(analysis: AnalysisResult): void {
  const report = buildTextReport(analysis);
  downloadBlob(new Blob([report], { type: 'text/plain;charset=utf-8' }), 'yourvisualizer-report.txt');
}
