import type { GraphNode } from '@/types';

interface NodeTooltipProps {
  node: GraphNode;
  x: number;
  y: number;
  connections: number;
}

export function NodeTooltip({ node, x, y, connections }: NodeTooltipProps) {
  return (
    <div
      className="graph-tooltip"
      style={{ left: x, top: y }}
      role="tooltip"
    >
      <div className="graph-tooltip__word">{node.word}</div>
      <div className="graph-tooltip__meta mono">
        <span>FREQ {node.frequency}</span>
        <span>LINKS {connections}</span>
      </div>
    </div>
  );
}
