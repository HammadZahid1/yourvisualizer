import type { Cluster, WordFrequency } from '@/types';
import type { Relationship } from '@/types';

/**
 * Reproducible clustering via connected components over co-occurrence links.
 * Any two linked words join the same group; isolated words each form their own
 * group. The group label is its most frequent member. This is a structural
 * grouping of observed links, not topic modelling.
 */
export function computeClusters(keywords: WordFrequency[], relationships: Relationship[]): Cluster[] {
  const parent = new Map<string, string>();
  for (const keyword of keywords) parent.set(keyword.word, keyword.word);

  const find = (word: string): string => {
    let root = parent.get(word) ?? word;
    while (parent.get(root) && parent.get(root) !== root) {
      root = parent.get(root)!;
    }
    return root;
  };

  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootB, rootA);
  };

  for (const link of relationships) {
    if (parent.has(link.source) && parent.has(link.target)) union(link.source, link.target);
  }

  const groups = new Map<string, string[]>();
  for (const keyword of keywords) {
    const root = find(keyword.word);
    const group = groups.get(root) ?? [];
    group.push(keyword.word);
    groups.set(root, group);
  }

  const frequencies = new Map(keywords.map((keyword) => [keyword.word, keyword.count]));

  return Array.from(groups.values())
    .map((words) => {
      const label = [...words].sort(
        (a, b) => (frequencies.get(b) ?? 0) - (frequencies.get(a) ?? 0) || a.localeCompare(b),
      )[0]!;
      return { id: 0, label, words: words.sort((a, b) => a.localeCompare(b)) };
    })
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((cluster, index) => ({ ...cluster, id: index }));
}
