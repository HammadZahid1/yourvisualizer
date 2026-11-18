import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { AnalysisResult } from '@/types';

function highlight(text: string, word: string | null) {
  if (!word) return text;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function SentenceExplorer({
  analysis,
  selectedWord,
}: {
  analysis: AnalysisResult;
  selectedWord: string | null;
}) {
  const [query, setQuery] = useState('');

  const sentences = useMemo(
    () => analysis.sentences.filter((sentence) => sentence.text.toLowerCase().includes(query.trim().toLowerCase())),
    [analysis, query],
  );

  const longest = analysis.sentences.reduce((max, item) => Math.max(max, item.wordCount), 0);
  const shortest = analysis.sentences.length
    ? analysis.sentences.reduce((min, item) => Math.min(min, item.wordCount), Infinity)
    : 0;

  if (analysis.sentences.length === 0) {
    return (
      <div className="explore-empty-card">
        <h3>No sentences detected</h3>
        <p className="muted">Add text with at least one complete thought to explore sentences.</p>
      </div>
    );
  }

  return (
    <div className="explore-stack">
      <div className="sentence-summary">
        <div><strong className="mono">{analysis.sentences.length}</strong><span>Sentences</span></div>
        <div><strong className="mono">{analysis.statistics.averageSentenceLength}</strong><span>Avg words</span></div>
        <div><strong className="mono">{longest}</strong><span>Longest</span></div>
        <div><strong className="mono">{Number.isFinite(shortest) ? shortest : 0}</strong><span>Shortest</span></div>
      </div>

      <label className="search-field sentence-search">
        <Search size={15} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sentences…"
          aria-label="Search sentences"
        />
      </label>

      {sentences.length === 0 ? (
        <p className="explore-no-results muted">No sentences match this search.</p>
      ) : (
        <ol className="sentence-list">
          {sentences.map((sentence) => (
            <li key={sentence.index} className="sentence-item">
              <span className="sentence-item__index mono">S{String(sentence.index + 1).padStart(2, '0')}</span>
              <p>{highlight(sentence.text, selectedWord)}</p>
              <span className="sentence-item__count mono">{sentence.wordCount} w</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
