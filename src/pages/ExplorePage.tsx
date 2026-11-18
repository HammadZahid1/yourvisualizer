import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Layers3, ListOrdered, Network, Type } from 'lucide-react';
import { ClusterExplorer } from '@/components/explore/ClusterExplorer';
import { KeywordExplorer } from '@/components/explore/KeywordExplorer';
import { PhraseExplorer } from '@/components/explore/PhraseExplorer';
import { SentenceExplorer } from '@/components/explore/SentenceExplorer';
import { Button } from '@/components/ui/Button';
import type { AnalysisResult, ViewId } from '@/types';
import './ExplorePage.css';

type Tab = 'keywords' | 'phrases' | 'sentences' | 'clusters';

interface ExplorePageProps {
  analysis: AnalysisResult | null;
  selectedWord: string | null;
  onSelectWord: (word: string | null) => void;
  onNavigate: (view: ViewId) => void;
}

const TABS: { id: Tab; label: string; icon: typeof Type }[] = [
  { id: 'keywords', label: 'Keywords', icon: Type },
  { id: 'phrases', label: 'Phrases', icon: Layers3 },
  { id: 'sentences', label: 'Sentences', icon: ListOrdered },
  { id: 'clusters', label: 'Clusters', icon: Network },
];

export function ExplorePage({ analysis, selectedWord, onSelectWord, onNavigate }: ExplorePageProps) {
  const [tab, setTab] = useState<Tab>('keywords');

  if (!analysis || analysis.tokens.length === 0) {
    return (
      <div className="explore-page explore-page--empty">
        <span className="eyebrow">Explore</span>
        <h1>Nothing to explore yet.</h1>
        <p className="muted">
          Analyze a piece of text first. Your results stay in this session — nothing is sent
          anywhere.
        </p>
        <Button variant="primary" icon={<ArrowLeft />} onClick={() => onNavigate('visualizer')}>
          Go to Visualizer
        </Button>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <header className="explore-page__header">
        <div>
          <span className="eyebrow">Deep dive</span>
          <h1>Explore the signal.</h1>
          <p className="muted">
            Search, filter, and inspect every local result from your current analysis.
          </p>
        </div>
        <div className="explore-page__context mono">
          <span>{analysis.statistics.words} WORDS</span>
          <span>{analysis.statistics.sentences} SENTENCES</span>
          <span>{analysis.clusters.length} CLUSTERS</span>
        </div>
      </header>

      <div className="explore-tabs" role="tablist" aria-label="Explore sections">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={`explore-tabs__button ${tab === id ? 'explore-tabs__button--active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="explore-page__content"
        >
          {tab === 'keywords' && (
            <KeywordExplorer
              analysis={analysis}
              selectedWord={selectedWord}
              onSelectWord={onSelectWord}
            />
          )}
          {tab === 'phrases' && <PhraseExplorer analysis={analysis} />}
          {tab === 'sentences' && (
            <SentenceExplorer analysis={analysis} selectedWord={selectedWord} />
          )}
          {tab === 'clusters' && (
            <ClusterExplorer
              analysis={analysis}
              selectedWord={selectedWord}
              onSelectWord={onSelectWord}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
