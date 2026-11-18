/** Shared domain types for YourVisualizer. All analysis data is produced locally. */

export type ViewId = 'overview' | 'visualizer' | 'explore' | 'about';

export interface Token {
  /** Original text as it appeared in the source. */
  text: string;
  /** Lowercase, punctuation-trimmed form used for comparison. */
  normalized: string;
  /** Character offset where the token starts in the source text. */
  start: number;
  /** Character offset where the token ends (exclusive). */
  end: number;
  /** Index in the ordered token list. */
  index: number;
  /** True when the normalized token is a common stop word. */
  isStopWord: boolean;
}

export interface WordFrequency {
  word: string;
  count: number;
}

export interface Sentence {
  text: string;
  index: number;
  wordCount: number;
  start: number;
  end: number;
}

export interface NGram {
  phrase: string;
  count: number;
  size: 1 | 2 | 3;
}

export interface Relationship {
  source: string;
  target: string;
  weight: number;
}

export interface Cluster {
  id: number;
  label: string;
  words: string[];
}

export interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  uniqueWords: number;
  averageWordLength: number;
  averageSentenceLength: number;
  readingTimeMinutes: number;
  lexicalDiversity: number;
}

export interface GraphNode {
  id: string;
  word: string;
  frequency: number;
  degree: number;
  clusterId: number;
  strength: number;
}

export interface GraphLink {
  source: string;
  target: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface AnalysisResult {
  /** Snapshot of the source text that produced this result. */
  text: string;
  tokens: Token[];
  statistics: TextStatistics;
  frequencies: WordFrequency[];
  keywords: WordFrequency[];
  sentences: Sentence[];
  ngrams: {
    unigrams: NGram[];
    bigrams: NGram[];
    trigrams: NGram[];
  };
  relationships: Relationship[];
  clusters: Cluster[];
  graph: GraphData;
  createdAt: number;
}

export interface AnalysisOptions {
  /** Maximum number of keywords / graph nodes. Defaults to 34. */
  maxNodes?: number;
  /** Maximum number of co-occurrence links retained. Defaults to 90. */
  maxLinks?: number;
  /** Number of keywords to surface in insight lists. Defaults to 12. */
  keywordCount?: number;
}

export interface HistoryEntry {
  id: string;
  label: string;
  result: AnalysisResult;
}
