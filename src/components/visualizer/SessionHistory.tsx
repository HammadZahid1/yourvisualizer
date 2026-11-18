import { History } from 'lucide-react';
import type { HistoryEntry } from '@/types';
import './SessionHistory.css';

interface SessionHistoryProps {
  entries: HistoryEntry[];
  activeText: string;
  onRestore: (entry: HistoryEntry) => void;
}

export function SessionHistory({ entries, activeText, onRestore }: SessionHistoryProps) {
  if (entries.length === 0) return null;

  return (
    <div className="session-history">
      <span className="session-history__label mono">
        <History size={12} aria-hidden="true" /> Session history
      </span>
      <div className="session-history__items">
        {entries.map((entry) => {
          const isActive = entry.result.text === activeText;
          const time = new Date(entry.result.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <button
              key={entry.id}
              className={`session-history__item ${isActive ? 'session-history__item--active' : ''}`}
              onClick={() => onRestore(entry)}
              title={`Restore: ${entry.label}`}
            >
              <span className="session-history__text">{entry.label}</span>
              <span className="session-history__meta mono">
                {entry.result.statistics.words}w · {time}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
