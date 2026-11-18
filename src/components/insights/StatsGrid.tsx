import type { TextStatistics } from '@/types';
import './StatsGrid.css';

interface StatsGridProps {
  statistics: TextStatistics;
}

const STAT_LABELS: { key: keyof TextStatistics; label: string; suffix?: string }[] = [
  { key: 'words', label: 'Words' },
  { key: 'uniqueWords', label: 'Unique words' },
  { key: 'sentences', label: 'Sentences' },
  { key: 'paragraphs', label: 'Paragraphs' },
  { key: 'averageWordLength', label: 'Avg word length', suffix: ' ch' },
  { key: 'averageSentenceLength', label: 'Avg sentence', suffix: ' w' },
  { key: 'lexicalDiversity', label: 'Diversity', suffix: '' },
  { key: 'charactersNoSpaces', label: 'Chars no spaces' },
];

export function StatsGrid({ statistics }: StatsGridProps) {
  return (
    <div className="stats-grid">
      {STAT_LABELS.map(({ key, label, suffix }) => (
        <div className="stats-grid__cell" key={key}>
          <span className="stats-grid__value mono">
            {statistics[key].toLocaleString()}
            {suffix}
          </span>
          <span className="stats-grid__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
