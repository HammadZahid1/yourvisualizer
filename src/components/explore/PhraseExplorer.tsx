import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { AnalysisResult, NGram } from '@/types';

type GramKind = 'bigrams' | 'trigrams' | 'unigrams';

export function PhraseExplorer({ analysis }: { analysis: AnalysisResult }) {
  const [kind, setKind] = useState<GramKind>('bigrams');
  const [query, setQuery] = useState('');

  const grams: NGram[] = analysis.ngrams[kind] ?? [];
  const filtered = useMemo(
    () => grams.filter((gram) => gram.phrase.includes(query.trim().toLowerCase())),
    [grams, query],
  );
  const max = Math.max(1, ...filtered.map((gram) => gram.count));

  const labels: Record<GramKind, string> = {
    unigrams: 'Single words',
    bigrams: 'Two-word phrases',
    trigrams: 'Three-word phrases',
  };

  return (
    <div className="explore-stack">
      <div className="explore-toolbar">
        <div className="segmented" role="tablist" aria-label="Phrase length">
          {(['bigrams', 'trigrams', 'unigrams'] as GramKind[]).map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={kind === item}
              className={`segmented__button ${kind === item ? 'segmented__button--active' : ''}`}
              onClick={() => setKind(item)}
            >
              {labels[item]}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter phrases…"
            aria-label="Filter phrases"
          />
        </label>
      </div>

      <p className="explore-note mono">
        Repeated sequences only · minimum 2 occurrences · counted across all input text
      </p>

      {filtered.length === 0 ? (
        <div className="explore-empty-card">
          <h3>No repeated phrases found</h3>
          <p className="muted">
            Try a longer sample, switch phrase length, or clear the filter. Short texts may not
            repeat any sequence.
          </p>
        </div>
      ) : (
        <div className="phrase-list">
          {filtered.map((gram) => (
            <div className="phrase-row" key={gram.phrase}>
              <span className="phrase-row__text">{gram.phrase}</span>
              <span className="phrase-row__meter" aria-hidden="true">
                <i style={{ width: `${(gram.count / max) * 100}%` }} />
              </span>
              <span className="phrase-row__count mono">×{gram.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
