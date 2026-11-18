import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/navigation/Header';
import { VisualizerWorkspace } from './components/visualizer/VisualizerWorkspace';
import { AboutPage } from './pages/AboutPage';
import { ExplorePage } from './pages/ExplorePage';
import { OverviewPage } from './pages/OverviewPage';
import { SAMPLES } from './data/samples';
import { useVisualizerState } from './hooks/useVisualizerState';
import type { ViewId } from './types';

const PAGE_TITLES: Record<ViewId, string> = {
  overview: 'See what your words are made of',
  visualizer: 'Visualizer',
  explore: 'Explore',
  about: 'About',
};

export default function App() {
  const [view, setView] = useState<ViewId>('overview');
  const visualizer = useVisualizerState();

  useEffect(() => {
    document.title = `${PAGE_TITLES[view]} — YourVisualizer`;
  }, [view]);

  const openDemo = () => {
    const demo = SAMPLES[1] ?? SAMPLES[0]!;
    visualizer.loadSample(demo.text);
    setView('visualizer');
  };

  return (
    <AppShell header={<Header view={view} onNavigate={setView} />}>
      {view === 'overview' && (
        <OverviewPage onStart={() => setView('visualizer')} onDemo={openDemo} />
      )}
      {view === 'visualizer' && <VisualizerWorkspace state={visualizer} />}
      {view === 'explore' && (
        <ExplorePage
          analysis={visualizer.analysis}
          selectedWord={visualizer.selectedWord}
          onSelectWord={visualizer.setSelectedWord}
          onNavigate={setView}
        />
      )}
      {view === 'about' && <AboutPage />}
    </AppShell>
  );
}
