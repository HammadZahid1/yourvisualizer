import { useMemo } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import './NodeDetails.css';

interface NodeDetailsProps {
  analysis: AnalysisResult;
  word: string;
  onSelect: (word: string | null) => void;
}

export function NodeDetails({ analysis, word, onSelect }: NodeDetailsProps) {
  const details = useMemo(() => {
    const node = analysis.graph.nodes.find((item) => item.id === word);
    const connections = analysis.relationships
      .filter((link) => link.source === word || link.target === word)
      .map((link) => ({
        word: link.source === word ? link.target : link.source,
        weight: link.weight,
      }))
      .sort((a, b) => b.weight - a.weight);

    const occurrences = analysis.tokens
      .filter((token) => token.normalized === word)
      .slice(0, 3)
      .map((token) => {
        const beforeText = analysis.text
          .slice(Math.max(0, token.start - 42), token.start)
          .replace(/\s+/g, ' ')
          .trim();
        const afterText = analysis.text
          .slice(token.end, Math.min(analysis.text.length, token.end + 42))
          .replace(/\s+/g, ' ')
          .trim();
        return {
          before: beforeText ? `…${beforeText} ` : '',
          after: afterText
            ? `${/^[.,!?;:)\]]/.test(afterText) ? '' : ' '}${afterText}…`
            : '',
        };
      });

    return { node, connections, occurrences };
  }, [analysis, word]);

  const { node, connections, occurrences } = details;

  return (
    <div className="node-details">
      <header className="node-details__header">
        <div>
          <span className="eyebrow">Selected node</span>
          <h3>{word}</h3>
        </div>
        <button
          className="node-details__close"
          onClick={() => onSelect(null)}
          aria-label="Clear selected word"
          title="Clear selection"
        >
          <X size={15} />
        </button>
      </header>

      <div className="node-details__metrics">
        <div>
          <strong className="mono">{node?.frequency ?? 0}</strong>
          <span>Frequency</span>
        </div>
        <div>
          <strong className="mono">{connections.length}</strong>
          <span>Connections</span>
        </div>
        <div>
          <strong className="mono">{node?.degree ?? 0}</strong>
          <span>Graph degree</span>
        </div>
      </div>

      {connections.length > 0 && (
        <div className="node-details__section">
          <span className="node-details__label mono">Connected keywords</span>
          <div className="node-details__chips">
            {connections.slice(0, 8).map((connection) => (
              <button
                key={connection.word}
                className="node-details__chip"
                onClick={() => onSelect(connection.word)}
                title={`Weight ${connection.weight}`}
              >
                {connection.word}
                <ArrowUpRight size={11} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {occurrences.length > 0 && (
        <div className="node-details__section">
          <span className="node-details__label mono">Occurrences in text</span>
          <ul className="node-details__occurrences">
            {occurrences.map((occurrence, index) => (
              <li key={index}>
                {occurrence.before && <span>{occurrence.before}</span>}
                <mark>{word}</mark>
                {occurrence.after && <span>{occurrence.after}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
