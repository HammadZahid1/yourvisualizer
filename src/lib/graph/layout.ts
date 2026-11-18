import type { GraphData } from '@/types';

export interface Point {
  x: number;
  y: number;
}

/** Stable pseudo-random value derived from a string (no external seed state). */
function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/**
 * Deterministic 2D force-directed layout in normalized [0, 1] space.
 * Repulsion separates nodes, link springs pull neighbours together, and a
 * weak centering force keeps the composition balanced. No animation state —
 * the result is identical for identical graph data.
 */
export function computeGraphLayout(graph: GraphData, iterations = 180): Map<string, Point> {
  const positions = new Map<string, Point>();
  const nodeCount = graph.nodes.length;

  if (nodeCount === 0) return positions;

  const radius = 0.5 + 0.34 * Math.sqrt(nodeCount) / Math.sqrt(40);

  graph.nodes.forEach((node, index) => {
    const angle = (index / nodeCount) * Math.PI * 2 + hash(node.id) * 0.6;
    const jitter = 0.75 + hash(`${node.id}-r`) * 0.5;
    positions.set(node.id, {
      x: 0.5 + Math.cos(angle) * radius * jitter * 0.42,
      y: 0.5 + Math.sin(angle) * radius * jitter * 0.42,
    });
  });

  const idealLinkLength = nodeCount > 24 ? 0.17 : 0.21;

  for (let step = 0; step < iterations; step += 1) {
    const cooling = 1 - step / iterations;
    const forces = new Map<string, Point>();
    for (const node of graph.nodes) forces.set(node.id, { x: 0, y: 0 });

    for (let i = 0; i < graph.nodes.length; i += 1) {
      const a = graph.nodes[i]!;
      const pa = positions.get(a.id)!;
      for (let j = i + 1; j < graph.nodes.length; j += 1) {
        const b = graph.nodes[j]!;
        const pb = positions.get(b.id)!;
        let dx = pa.x - pb.x;
        let dy = pa.y - pb.y;
        let distance = Math.hypot(dx, dy);
        if (distance < 0.0001) {
          dx = hash(`${a.id}${b.id}`) - 0.5;
          dy = hash(`${b.id}${a.id}`) - 0.5;
          distance = Math.hypot(dx, dy) || 0.001;
        }
        const repulsion = 0.0016 / (distance * distance);
        const fx = (dx / distance) * repulsion;
        const fy = (dy / distance) * repulsion;
        forces.get(a.id)!.x += fx;
        forces.get(a.id)!.y += fy;
        forces.get(b.id)!.x -= fx;
        forces.get(b.id)!.y -= fy;
      }
    }

    for (const link of graph.links) {
      const pa = positions.get(link.source);
      const pb = positions.get(link.target);
      if (!pa || !pb) continue;
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const distance = Math.hypot(dx, dy) || 0.001;
      const spring = (distance - idealLinkLength) * 0.012 * Math.min(link.weight, 4);
      const fx = (dx / distance) * spring;
      const fy = (dy / distance) * spring;
      forces.get(link.source)!.x += fx;
      forces.get(link.source)!.y += fy;
      forces.get(link.target)!.x -= fx;
      forces.get(link.target)!.y -= fy;
    }

    for (const node of graph.nodes) {
      const point = positions.get(node.id)!;
      const force = forces.get(node.id)!;
      point.x += (force.x - (point.x - 0.5) * 0.004) * cooling;
      point.y += (force.y - (point.y - 0.5) * 0.004) * cooling;
      point.x = Math.min(0.94, Math.max(0.06, point.x));
      point.y = Math.min(0.92, Math.max(0.08, point.y));
    }
  }

  return positions;
}
