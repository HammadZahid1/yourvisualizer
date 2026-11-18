import type { WordFrequency } from '@/types';
import './KeywordList.css';

interface KeywordListProps {
  items: WordFrequency[];
  selectedWord: string | null;
  onSelect: (word: string) => void;
  limit?: number;
}

export function KeywordList({ items, selectedWord, onSelect, limit = 10 }: KeywordListProps) {
  const visible = items.slice(0, limit);
  const max = Math.max(1, ...visible.map((item) => item.count));

  if (visible.length === 0) {
    return <p className="muted keyword-list__empty mono">No keywords available</p>;
  }

  return (
    <ol className="keyword-list">
      {visible.map((item, index) => (
        <li key={item.word}>
          <button
            className={`keyword-list__item ${selectedWord === item.word ? 'keyword-list__item--active' : ''}`}
            onClick={() => onSelect(item.word)}
            title={`Highlight ${item.word} in the graph`}
          >
            <span className="keyword-list__rank mono">{String(index + 1).padStart(2, '0')}</span>
            <span className="keyword-list__word">{item.word}</span>
            <span className="keyword-list__bar" aria-hidden="true">
              <i style={{ width: `${(item.count / max) * 100}%` }} />
            </span>
            <span className="keyword-list__count mono">{item.count}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
