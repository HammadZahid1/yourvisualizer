import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/navigation/Header';
import type { ViewId } from './types';

const VIEW_TITLES: Record<ViewId, string> = {
  overview: 'Overview',
  visualizer: 'Visualizer',
  explore: 'Explore',
  about: 'About',
};

export default function App() {
  const [view, setView] = useState<ViewId>('overview');

  return (
    <AppShell header={<Header view={view} onNavigate={setView} />}>
      <section className="temp-content">
        <span className="eyebrow">{VIEW_TITLES[view]}</span>
        <h1>See what your words are made of.</h1>
        <p className="muted">Visualize the hidden patterns inside your words.</p>
      </section>
    </AppShell>
  );
}
