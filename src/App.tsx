import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/navigation/Header';
import { VisualizerWorkspace } from './components/visualizer/VisualizerWorkspace';
import { OverviewPage } from './pages/OverviewPage';
import { SAMPLES } from './data/samples';
import { useVisualizerState } from './hooks/useVisualizerState';
import type { ViewId } from './types';

const PLACEHOLDER_TITLES: Record<Exclude<ViewId, 'overview' | 'visualizer'>, string> = {
  explore: 'Explore',
  about: 'About',
};

export default function App() {
  const [view, setView] = useState<ViewId>('overview');
  const visualizer = useVisualizerState();

  const start = () => setView('visualizer');

  const openDemo = () => {
    const demo = SAMPLES[1] ?? SAMPLES[0]!;
    visualizer.loadSample(demo.text);
    setView('visualizer');
  };

  return (
    <AppShell header={<Header view={view} onNavigate={setView} />}>
      {view === 'overview' && <OverviewPage onStart={start} onDemo={openDemo} />}
      {view === 'visualizer' && <VisualizerWorkspace state={visualizer} />}
      {(view === 'explore' || view === 'about') && (
        <section className="temp-content">
          <span className="eyebrow">{PLACEHOLDER_TITLES[view]}</span>
          <h1>{PLACEHOLDER_TITLES[view]}</h1>
          <p className="muted">This screen is being assembled.</p>
        </section>
      )}
    </AppShell>
  );
}
