import type { AnalysisResult } from '@/types';
import { NodeDetails } from './NodeDetails';
import { KeywordList } from './KeywordList';
import { StatsGrid } from './StatsGrid';
import './InsightsPanel.css';

interface InsightsPanelProps {
  analysis: AnalysisResult | null;
  selectedWord: string | null;
  onSelectWord: (word: string | null) => void;
}

export function InsightsPanel({ analysis, selectedWord, onSelectWord }: InsightsPanelProps) {
  if (!analysis || analysis.tokens.length === 0) {
    return (
      <div className="insights-empty">
        <span className="mono">NO SIGNAL</span>
        <p>Run an analysis to populate local insights.</p>
      </div>
    );
  }

  const selected = selectedWord && analysis.graph.nodes.some((node) => node.id === selectedWord);

  return (
    <div className="insights-panel">
      {selected && selectedWord && (
        <section className="insights-panel__section insights-panel__section--highlight">
          <NodeDetails analysis={analysis} word={selectedWord} onSelect={onSelectWord} />
        </section>
      )}

      <section className="insights-panel__section">
        <h4 className="insights-panel__title">Top keywords <span className="mono">RANKED</span></h4>
        <KeywordList
          items={analysis.keywords}
          selectedWord={selectedWord}
          onSelect={onSelectWord}
          limit={8}
        />
      </section>

      <section className="insights-panel__section">
        <h4 className="insights-panel__title">Text statistics <span className="mono">LOCAL</span></h4>
        <StatsGrid statistics={analysis.statistics} />
      </section>

      <section className="insights-panel__section">
        <h4 className="insights-panel__title">Most frequent <span className="mono">ALL WORDS</span></h4>
        <KeywordList
          items={analysis.frequencies}
          selectedWord={selectedWord}
          onSelect={onSelectWord}
          limit={7}
        />
      </section>

      <footer className="insights-panel__footer mono">
        <span>~{analysis.statistics.readingTimeMinutes} MIN READ (EST.)</span>
        <span>{analysis.clusters.length} CLUSTERS</span>
      </footer>
    </div>
  );
}
