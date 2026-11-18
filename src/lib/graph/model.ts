import type { Cluster, GraphData, GraphLink, GraphNode, WordFrequency } from '@/types';
import type { Relationship } from '@/types';

/** Assemble the render-ready graph from analysis primitives. */
export function buildGraph(
  keywords: WordFrequency[],
  relationships: Relationship[],
  clusters: Cluster[],
  maxLinks = 90,
): GraphData {
  const allowed = new Set(keywords.map((keyword) => keyword.word));
  const clusterOf = new Map<string, number>();
  for (const cluster of clusters) {
    for (const word of cluster.words) clusterOf.set(word, cluster.id);
  }

  const maxFrequency = Math.max(1, ...keywords.map((keyword) => keyword.count));

  const links: GraphLink[] = relationships
    .filter((link) => allowed.has(link.source) && allowed.has(link.target))
    .slice(0, maxLinks)
    .map((link) => ({ source: link.source, target: link.target, weight: link.weight }));

  const degree = new Map<string, number>();
  for (const link of links) {
    degree.set(link.source, (degree.get(link.source) ?? 0) + 1);
    degree.set(link.target, (degree.get(link.target) ?? 0) + 1);
  }

  const nodes: GraphNode[] = keywords.map((keyword) => ({
    id: keyword.word,
    word: keyword.word,
    frequency: keyword.count,
    degree: degree.get(keyword.word) ?? 0,
    clusterId: clusterOf.get(keyword.word) ?? 0,
    strength: 0.28 + 0.72 * (keyword.count / maxFrequency),
  }));

  return { nodes, links };
}
