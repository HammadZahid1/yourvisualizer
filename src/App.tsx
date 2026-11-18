import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/navigation/Header';
import { OverviewPage } from './pages/OverviewPage';
import type { ViewId } from './types';

const PLACEHOLDER_TITLES: Record<Exclude<ViewId, 'overview'>, string> = {
  visualizer: 'Visualizer',
  explore: 'Explore',
  about: 'About',
};

export default function App() {
  const [view, setView] = useState<ViewId>('overview');

  return (
    <AppShell header={<Header view={view} onNavigate={setView} />}>
      {view === 'overview' ? (
        <OverviewPage onStart={() => setView('visualizer')} onDemo={() => setView('visualizer')} />
      ) : (
        <section className="temp-content">
          <span className="eyebrow">{PLACEHOLDER_TITLES[view]}</span>
          <h1>{PLACEHOLDER_TITLES[view]}</h1>
          <p className="muted">This workspace is being assembled.</p>
        </section>
      )}
    </AppShell>
  );
}
