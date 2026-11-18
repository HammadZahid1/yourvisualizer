import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <AppShell
      header={
        <header className="temp-header">
          <span className="eyebrow">YourVisualizer</span>
        </header>
      }
    >
      <section className="temp-content">
        <h1>See what your words are made of.</h1>
        <p className="muted">Visualize the hidden patterns inside your words.</p>
      </section>
    </AppShell>
  );
}
