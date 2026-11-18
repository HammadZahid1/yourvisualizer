import {
  Binary,
  CircleDot,
  FileSearch,
  Fingerprint,
  Network,
  ScanText,
  ShieldCheck,
  Sigma,
} from 'lucide-react';
import './AboutPage.css';

const PIPELINE = [
  {
    icon: ScanText,
    title: 'Tokenization',
    copy: 'Unicode-aware matching extracts words while preserving their position. Apostrophes and hyphens inside words are kept; punctuation and repeated whitespace are ignored.',
  },
  {
    icon: Binary,
    title: 'Frequency & stop words',
    copy: 'Every normalized word is counted. A conventional stop-word list removes function words before keyword ranking so content words can surface.',
  },
  {
    icon: Sigma,
    title: 'Keyword scoring',
    copy: 'Score = frequency × a small length weight. Stop words and tokens under three characters are excluded. There is no learned model or trained embedding.',
  },
  {
    icon: FileSearch,
    title: 'Sentences & n-grams',
    copy: 'Sentences are split on terminal punctuation. Repeated one-, two-, and three-word sequences are counted and surfaced as phrases.',
  },
  {
    icon: Network,
    title: 'Co-occurrence links',
    copy: 'Within each sentence, words appearing within four tokens of one another are linked. Link weight is the number of observed pairings.',
  },
  {
    icon: Fingerprint,
    title: 'Clusters',
    copy: 'Connected components of the link graph form clusters. A cluster is a structural grouping of linked words, not a discovered topic.',
  },
];

export function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-hero">
        <span className="eyebrow">About the engine</span>
        <h1>Clarity without mystery.</h1>
        <p>
          YourVisualizer is a local, algorithmic text analysis playground. It computes descriptive
          patterns from the words you give it and renders them as an interactive network. It is
          deliberately transparent about where those patterns come from.
        </p>
      </header>

      <section className="about-section">
        <div className="about-section__heading">
          <span className="eyebrow">Pipeline</span>
          <h2>What happens to your text</h2>
        </div>
        <div className="about-pipeline">
          {PIPELINE.map(({ icon: Icon, title, copy }, index) => (
            <article className="about-step" key={title}>
              <div className="about-step__top">
                <span className="about-step__icon"><Icon size={18} strokeWidth={1.7} /></span>
                <span className="mono about-step__index">0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p className="muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-section--split">
        <div className="about-section__heading">
          <span className="eyebrow">Interpretation</span>
          <h2>Reading the visualization</h2>
        </div>
        <div className="about-prose">
          <div className="about-prose__row">
            <CircleDot size={18} aria-hidden="true" />
            <div>
              <h3>Nodes</h3>
              <p className="muted">
                Each node is a ranked keyword. Its radius reflects frequency and graph degree;
                its colour indicates the structural cluster it belongs to.
              </p>
            </div>
          </div>
          <div className="about-prose__row">
            <Network size={18} aria-hidden="true" />
            <div>
              <h3>Links</h3>
              <p className="muted">
                A link means two words appeared near each other in the same sentence. Thickness
                reflects how often that pairing occurred. Links are positional, not semantic.
              </p>
            </div>
          </div>
          <div className="about-prose__row">
            <ShieldCheck size={18} aria-hidden="true" />
            <div>
              <h3>Estimates</h3>
              <p className="muted">
                Reading time assumes roughly 200 words per minute. Diversity is a simple
                unique-to-total ratio. Both are rough descriptive hints, not assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-honesty">
        <div className="about-section__heading">
          <span className="eyebrow">Product honesty</span>
          <h2>What YourVisualizer does not claim</h2>
        </div>
        <ul className="about-honesty__list">
          <li>It does not run an AI model, LLM, or server-side inference of any kind.</li>
          <li>It does not understand meaning, sentiment, intent, or author psychology.</li>
          <li>It does not infer topics through embeddings or machine learning.</li>
          <li>It does not upload, store, or transmit your text anywhere.</li>
          <li>Example content in the sample library is original fictional writing.</li>
        </ul>
      </section>
    </div>
  );
}
