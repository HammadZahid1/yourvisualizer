import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, ScanSearch, ShieldCheck, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroNetwork } from '@/components/hero/HeroNetwork';
import './OverviewPage.css';

interface OverviewPageProps {
  onStart: () => void;
  onDemo: () => void;
}

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Relationship graph',
    copy: 'See how words connect through local co-occurrence, with weighted links and navigable clusters.',
  },
  {
    icon: ScanSearch,
    title: 'Keyword discovery',
    copy: 'Surface the terms that carry the most weight using a transparent frequency-based algorithm.',
  },
  {
    icon: Sigma,
    title: 'Honest statistics',
    copy: 'Counts, averages, diversity, and n-grams computed directly from the text you provide.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    copy: 'Nothing leaves your device. No accounts, no uploads, no external services — ever.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function OverviewPage({ onStart, onDemo }: OverviewPageProps) {
  return (
    <div className="overview-page">
      <section className="overview-hero">
        <div className="overview-hero__visual">
          <HeroNetwork />
          <div className="overview-hero__vignette" />
        </div>

        <motion.div
          className="overview-hero__content"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.09, delayChildren: 0.08 }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="eyebrow">Local text intelligence laboratory</span>
          </motion.div>
          <motion.h1
            className="overview-hero__title"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            See what your words are made of.
          </motion.h1>
          <motion.p
            className="overview-hero__subtitle"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Turn ordinary text into interactive visual patterns, keyword networks, and meaningful
            statistics — computed entirely in your browser.
          </motion.p>
          <motion.div
            className="overview-hero__actions"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button variant="primary" size="lg" icon={<ArrowRight />} iconPosition="right" onClick={onStart}>
              Start Visualizing
            </Button>
            <Button variant="secondary" size="lg" onClick={onDemo}>
              Explore Demo
            </Button>
          </motion.div>
          <motion.div
            className="overview-hero__meta mono"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>100% local</span>
            <span className="overview-hero__meta-dot" />
            <span>No sign-up</span>
            <span className="overview-hero__meta-dot" />
            <span>Instant results</span>
          </motion.div>
        </motion.div>

        <div className="overview-hero__corner mono" aria-hidden="true">
          SYS / VISUALIZER v1.0
        </div>
      </section>

      <section className="overview-features">
        <div className="section-heading">
          <span className="eyebrow">Capabilities</span>
          <h2>A closer reading, rendered.</h2>
          <p className="muted">
            Algorithmic analysis made visible — no black box, no invented meaning.
          </p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="feature-card__icon">
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <h3>{feature.title}</h3>
                <p className="muted">{feature.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="overview-flow">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Three steps to a new perspective.</h2>
        </div>
        <ol className="flow-list">
          <li>
            <span className="flow-list__index mono">01</span>
            <div>
              <h3>Paste your text</h3>
              <p className="muted">An article, a paragraph, a poem — anything with words.</p>
            </div>
          </li>
          <li>
            <span className="flow-list__index mono">02</span>
            <div>
              <h3>Analyze locally</h3>
              <p className="muted">Your browser tokenizes, counts, and connects terms instantly.</p>
            </div>
          </li>
          <li>
            <span className="flow-list__index mono">03</span>
            <div>
              <h3>Explore &amp; export</h3>
              <p className="muted">Navigate the graph, inspect sentences, and save your results.</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
