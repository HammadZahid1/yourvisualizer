import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { NodeDetails } from '@/components/insights/NodeDetails';
import './KeywordExplorer.css';

interface KeywordExplorerProps {
  analysis: AnalysisResult;
  selectedWord: string | null;
  onSelectWord: (word: string | null) => void;
}

export function KeywordExplorer({ analysis, selectedWord, onSelectWord }: KeywordExplorerProps) {
  const [query, setQuery] = useState('');
  const [clusterId, setClusterId] = useState<number | null>(null);

  const rows = useMemo(() => {
    const clusterWords = new Set(
      clusterId === null
        ? []
        : (analysis.clusters.find((cluster) => cluster.id === clusterId)?.words ?? []),
    );
    return analysis.keywords.filter(
      (item) =>
        item.word.includes(query.trim().toLowerCase()) &&
        (clusterId === null || clusterWords.has(item.word)),
    );
  }, [analysis, query, clusterId]);

  const max = Math.max(1, ...rows.map((row) => row.count));

  return (
    <div className="explore-split">
      <div className="explore-split__main">
        <div className="explore-toolbar">
          <label className="search-field">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter keywords…"
              aria-label="Filter keywords"
            />
          </label>
          <select
            className="explore-select"
            value={clusterId ?? ''}
            onChange={(event) =>
              setClusterId(event.target.value === '' ? null : Number(event.target.value))
            }
            aria-label="Filter by cluster"
          >
            <option value="">All clusters</option>
            {analysis.clusters.map((cluster) => (
              <option key={cluster.id} value={cluster.id}>
                {cluster.label} ({cluster.words.length})
              </option>
            ))}
          </select>
        </div>

        <div className="explore-table" role="table" aria-label="Keyword ranking">
          <div className="explore-table__head mono" role="row">
            <span>#</span>
            <span>Keyword</span>
            <span>Frequency</span>
            <span>Weight</span>
          </div>
          {rows.length === 0 && (
            <p className="explore-no-results muted">No keywords match this filter.</p>
          )}
          {rows.map((item, index) => (
            <button
              key={item.word}
              className={`explore-table__row ${selectedWord === item.word ? 'explore-table__row--active' : ''}`}
              onClick={() => onSelectWord(item.word)}
              role="row"
            >
              <span className="mono">{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.word}</strong>
              <span className="mono">{item.count}</span>
              <span className="explore-table__meter" aria-hidden="true">
                <i style={{ width: `${(item.count / max) * 100}%` }} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <aside className="explore-split__side">
        {selectedWord && analysis.graph.nodes.some((node) => node.id === selectedWord) ? (
          <NodeDetails analysis={analysis} word={selectedWord} onSelect={onSelectWord} />
        ) : (
          <div className="explore-side-empty">
            <span className="mono">SELECT A KEYWORD</span>
            <p className="muted">Choose a keyword to inspect its connections and occurrences.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
