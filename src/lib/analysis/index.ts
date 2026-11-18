import type { AnalysisOptions, AnalysisResult, TextStatistics } from '@/types';
import { buildGraph } from '@/lib/graph/model';
import { computeClusters } from './clusters';
import { computeCooccurrence } from './cooccurrence';
import { countFrequencies } from './frequency';
import { extractKeywords } from './keywords';
import { generateNGrams } from './ngrams';
import { analyzeSentences } from './sentences';
import { computeStatistics } from './statistics';
import { tokenize } from './tokenize';

const DEFAULTS: Required<AnalysisOptions> = {
  maxNodes: 34,
  maxLinks: 90,
  keywordCount: 12,
};

const EMPTY_STATISTICS: TextStatistics = {
  characters: 0,
  charactersNoSpaces: 0,
  words: 0,
  sentences: 0,
  paragraphs: 0,
  uniqueWords: 0,
  averageWordLength: 0,
  averageSentenceLength: 0,
  readingTimeMinutes: 0,
  lexicalDiversity: 0,
};

function emptyResult(text: string): AnalysisResult {
  return {
    text,
    tokens: [],
    statistics: EMPTY_STATISTICS,
    frequencies: [],
    keywords: [],
    sentences: [],
    ngrams: { unigrams: [], bigrams: [], trigrams: [] },
    relationships: [],
    clusters: [],
    graph: { nodes: [], links: [] },
    createdAt: Date.now(),
  };
}

/** Run the complete local analysis pipeline. Never produces fabricated data. */
export function analyzeText(text: string, options: AnalysisOptions = {}): AnalysisResult {
  const config = { ...DEFAULTS, ...options };

  if (!text.trim()) return emptyResult(text);

  const tokens = tokenize(text);
  if (tokens.length === 0) return emptyResult(text);

  const sentences = analyzeSentences(text, tokens);
  const statistics = computeStatistics(text, tokens, sentences);
  const frequencies = countFrequencies(tokens);
  const keywords = extractKeywords(tokens, { limit: config.maxNodes });
  const keywordSet = new Set(keywords.map((keyword) => keyword.word));

  const ngrams = {
    unigrams: generateNGrams(tokens, 1, { limit: config.keywordCount }),
    bigrams: generateNGrams(tokens, 2, { limit: config.keywordCount }),
    trigrams: generateNGrams(tokens, 3, { limit: config.keywordCount }),
  };

  const relationships = computeCooccurrence(tokens, sentences, {
    candidates: keywordSet,
    maxLinks: config.maxLinks,
    windowSize: 4,
  });

  const clusters = computeClusters(keywords, relationships);
  const graph = buildGraph(keywords, relationships, clusters, config.maxLinks);

  return {
    text,
    tokens,
    statistics,
    frequencies,
    keywords,
    sentences,
    ngrams,
    relationships,
    clusters,
    graph,
    createdAt: Date.now(),
  };
}
