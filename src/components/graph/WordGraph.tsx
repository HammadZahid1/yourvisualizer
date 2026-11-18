import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Network, ScanLine } from 'lucide-react';
import type { GraphData } from '@/types';
import { computeGraphLayout } from '@/lib/graph/layout';
import { GraphControls } from './GraphControls';
import { NodeTooltip } from './NodeTooltip';
import './WordGraph.css';

const CLUSTER_COLORS = ['#48ddf5', '#9a7bff', '#5b8cff', '#55e6a5', '#f5c76a', '#ff8fb1'];
const PADDING = 58;

interface ViewState {
  scale: number;
  x: number;
  y: number;
}

interface HoverState {
  word: string;
  x: number;
  y: number;
}

interface WordGraphProps {
  graph: GraphData;
  selectedWord: string | null;
  onSelectWord: (word: string | null) => void;
  onExportImage: (svg: SVGSVGElement | null) => void;
  isAnalyzing?: boolean;
  hasAnalysis?: boolean;
}

function hashWord(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function WordGraph({
  graph,
  selectedWord,
  onSelectWord,
  onExportImage,
  isAnalyzing = false,
  hasAnalysis = false,
}: WordGraphProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const dragRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);
  const [size, setSize] = useState({ width: 800, height: 620 });
  const [view, setView] = useState<ViewState>({ scale: 1, x: 0, y: 0 });
  const [hover, setHover] = useState<HoverState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => computeGraphLayout(graph), [graph]);

  const positions = useMemo(() => {
    const result = new Map<string, { x: number; y: number }>();
    const usableWidth = Math.max(1, size.width - PADDING * 2);
    const usableHeight = Math.max(1, size.height - PADDING * 2);
    for (const node of graph.nodes) {
      const point = layout.get(node.id);
      if (point) {
        result.set(node.id, {
          x: PADDING + point.x * usableWidth,
          y: PADDING + point.y * usableHeight,
        });
      }
    }
    return result;
  }, [graph, layout, size]);

  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const node of graph.nodes) map.set(node.id, new Set());
    for (const link of graph.links) {
      map.get(link.source)?.add(link.target);
      map.get(link.target)?.add(link.source);
    }
    return map;
  }, [graph]);

  // Gentle floating motion applied directly to SVG nodes — no React rerenders.
  useEffect(() => {
    if (reducedMotion || graph.nodes.length === 0) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const time = (now - start) / 1000;
      nodeRefs.current.forEach((element, id) => {
        const phase = hashWord(id) * Math.PI * 2;
        const dx = Math.sin(time * 0.62 + phase) * 2.1;
        const dy = Math.cos(time * 0.48 + phase) * 2.1;
        element.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [graph, reducedMotion]);

  // Native wheel listener so preventDefault works (React wheel handlers are passive).
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = svg.getBoundingClientRect();
      const cx = event.clientX - rect.left;
      const cy = event.clientY - rect.top;
      setView((current) => {
        const next = Math.min(3, Math.max(0.5, current.scale * (event.deltaY < 0 ? 1.12 : 0.89)));
        const ratio = next / current.scale;
        return {
          scale: next,
          x: cx - (cx - current.x) * ratio,
          y: cy - (cy - current.y) * ratio,
        };
      });
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [graph.nodes.length]);

  const zoomBy = useCallback((factor: number) => {
    setView((current) => {
      const next = Math.min(3, Math.max(0.5, current.scale * factor));
      const ratio = next / current.scale;
      const cx = size.width / 2;
      const cy = size.height / 2;
      return {
        scale: next,
        x: cx - (cx - current.x) * ratio,
        y: cy - (cy - current.y) * ratio,
      };
    });
  }, [size]);

  const resetView = useCallback(() => {
    setView({ scale: 1, x: 0, y: 0 });
    onSelectWord(null);
  }, [onSelectWord]);

  const toggleFullscreen = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void wrapper.requestFullscreen?.();
    }
  }, []);

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest('[data-node="true"]')) return;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      originX: view.x,
      originY: view.y,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setView((current) => ({
      ...current,
      x: drag.originX + (event.clientX - drag.x),
      y: drag.originY + (event.clientY - drag.y),
    }));
  };

  const endDrag = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleNodeEnter = (nodeId: string, event: ReactMouseEvent<SVGGElement>) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({
      word: nodeId,
      x: event.clientX - rect.left + 14,
      y: event.clientY - rect.top + 14,
    });
  };

  const activeSet = selectedWord ? neighbors.get(selectedWord) ?? new Set<string>() : null;
  const hoveredNode = hover ? graph.nodes.find((node) => node.id === hover.word) : undefined;
  const visibleClusters = useMemo(() => {
    const counts = new Map<number, { label: string; count: number }>();
    for (const node of graph.nodes) {
      const entry = counts.get(node.clusterId);
      if (entry) entry.count += 1;
      else counts.set(node.clusterId, { label: node.word, count: 1 });
    }
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [graph.nodes]);

  return (
    <div className="word-graph" ref={wrapperRef}>
      {graph.nodes.length === 0 ? (
        <div className="word-graph__empty">
          <span className="word-graph__empty-icon">
            <Network size={30} strokeWidth={1.2} aria-hidden="true" />
          </span>
          <h3>{hasAnalysis ? 'No keywords extracted' : 'Waiting for words'}</h3>
          <p className="muted">
            {hasAnalysis
              ? 'The text was analysed, but no content words qualified after stop-word filtering. Try a longer or more varied passage.'
              : 'Add text and run an analysis to see its co-occurrence network appear here.'}
          </p>
          <span className="mono word-graph__empty-tag">No data · no invention</span>
        </div>
      ) : (
        <>
          <svg
            ref={svgRef}
            className={`word-graph__svg ${isDragging ? 'word-graph__svg--dragging' : ''}`}
            viewBox={`0 0 ${size.width} ${size.height}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="img"
            aria-label={`Word relationship graph with ${graph.nodes.length} nodes and ${graph.links.length} connections`}
          >
            <defs>
              <radialGradient id="graph-node-glow">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
              <g className="word-graph__links">
                {graph.links.map((link, index) => {
                  const a = positions.get(link.source);
                  const b = positions.get(link.target);
                  if (!a || !b) return null;
                  const isActive = Boolean(
                    selectedWord && (link.source === selectedWord || link.target === selectedWord),
                  );
                  const dimmed = Boolean(selectedWord && !isActive);
                  const width = 0.6 + Math.min(link.weight, 5) * 0.42 + (isActive ? 1.1 : 0);
                  return (
                    <line
                      key={`${link.source}-${link.target}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      pathLength={1}
                      className={`word-graph__link ${isActive ? 'word-graph__link--active' : ''} ${dimmed ? 'word-graph__link--dim' : ''}`}
                      strokeWidth={width}
                      style={{ animationDelay: `${Math.min(index * 14, 700)}ms` }}
                    />
                  );
                })}
              </g>

              <g className="word-graph__nodes">
                {graph.nodes.map((node) => {
                  const point = positions.get(node.id);
                  if (!point) return null;
                  const color = CLUSTER_COLORS[node.clusterId % CLUSTER_COLORS.length] ?? '#48ddf5';
                  const radius = 4.2 + node.strength * 6.5 + Math.min(node.degree, 10) * 0.45;
                  const isSelected = selectedWord === node.id;
                  const isNeighbor = Boolean(activeSet?.has(node.id));
                  const isDimmed = Boolean(selectedWord && !isSelected && !isNeighbor);
                  const showLabel = isSelected || isNeighbor || node.strength > 0.62 || node.degree >= 5;
                  return (
                    <g key={node.id} transform={`translate(${point.x} ${point.y})`}>
                      <g
                        ref={(element) => {
                          if (element) nodeRefs.current.set(node.id, element);
                          else nodeRefs.current.delete(node.id);
                        }}
                        data-node="true"
                        className={`word-graph__node ${isSelected ? 'word-graph__node--selected' : ''} ${isDimmed ? 'word-graph__node--dim' : ''}`}
                        style={{ color }}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectWord(isSelected ? null : node.id);
                        }}
                        onMouseEnter={(event) => handleNodeEnter(node.id, event)}
                        onMouseMove={(event) => handleNodeEnter(node.id, event)}
                        onMouseLeave={() => setHover(null)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${node.word}, frequency ${node.frequency}, ${node.degree} connections`}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onSelectWord(isSelected ? null : node.id);
                          }
                        }}
                      >
                        <circle r={radius * 2.5} fill="url(#graph-node-glow)" opacity={0.5} />
                        {isSelected && (
                          <circle
                            r={radius + 7}
                            className="word-graph__selection-ring"
                            fill="none"
                            strokeWidth={1.2}
                          />
                        )}
                        <circle r={radius} className="word-graph__node-core" strokeWidth={1.2} />
                        <circle r={Math.max(1.4, radius * 0.26)} className="word-graph__node-center" />
                        {showLabel && (
                          <text
                            y={radius + 14}
                            textAnchor="middle"
                            className="word-graph__label"
                          >
                            {node.word}
                          </text>
                        )}
                      </g>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          {visibleClusters.length > 0 && (
            <div className="word-graph__legend" aria-label="Cluster legend">
              {visibleClusters.map((cluster, index) => (
                <span key={index} className="word-graph__legend-item">
                  <i style={{ background: CLUSTER_COLORS[index % CLUSTER_COLORS.length] }} />
                  {cluster.label}
                </span>
              ))}
            </div>
          )}

          <div className="word-graph__hint mono" aria-hidden="true">
            <ScanLine size={12} /> Drag to pan · Scroll to zoom
          </div>

          {hoveredNode && hover && (
            <NodeTooltip
              node={hoveredNode}
              x={Math.min(hover.x, size.width - 170)}
              y={Math.max(8, Math.min(hover.y, size.height - 70))}
              connections={hoveredNode.degree}
            />
          )}

          {isAnalyzing && (
            <div className="word-graph__processing mono" role="status">
              <span className="word-graph__processing-dot" />
              Processing locally…
            </div>
          )}

          <GraphControls
            onZoomIn={() => zoomBy(1.2)}
            onZoomOut={() => zoomBy(0.83)}
            onReset={resetView}
            onFullscreen={toggleFullscreen}
            onExportImage={() => onExportImage(svgRef.current)}
            disabled={graph.nodes.length === 0}
          />
        </>
      )}
    </div>
  );
}
