import type { AnalysisResult } from '@/types';

const CLUSTER_COLORS = ['#48ddf5', '#9a7bff', '#5b8cff', '#55e6a5', '#f5c76a', '#ff8fb1'];

interface ClusterExplorerProps {
  analysis: AnalysisResult;
  selectedWord: string | null;
  onSelectWord: (word: string) => void;
}

export function ClusterExplorer({ analysis, selectedWord, onSelectWord }: ClusterExplorerProps) {
  if (analysis.clusters.length === 0) {
    return (
      <div className="explore-empty-card">
        <h3>No clusters to display</h3>
        <p className="muted">Clusters appear when analysed words share co-occurrence links.</p>
      </div>
    );
  }

  return (
    <div className="explore-stack">
      <p className="explore-note mono">
        Connected components over observed co-occurrence links · structural, not topic modelling
      </p>
      <div className="cluster-grid">
        {analysis.clusters.map((cluster) => {
          const color = CLUSTER_COLORS[cluster.id % CLUSTER_COLORS.length] ?? '#48ddf5';
          return (
            <article className="cluster-card" key={cluster.id} style={{ borderTopColor: color }}>
              <header>
                <h3>{cluster.label}</h3>
                <span className="mono">{cluster.words.length} NODES</span>
              </header>
              <div className="cluster-card__words">
                {cluster.words.map((word) => (
                  <button
                    key={word}
                    className={`cluster-card__word ${selectedWord === word ? 'cluster-card__word--active' : ''}`}
                    onClick={() => onSelectWord(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
