import type { ReactNode } from 'react';
import { BackgroundField } from './BackgroundField';
import './AppShell.css';

interface AppShellProps {
  header: ReactNode;
  children: ReactNode;
}

export function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <BackgroundField />
      <div className="app-shell__grid" aria-hidden="true" />
      {header}
      <main className="app-shell__main" id="main-content">
        {children}
      </main>
    </div>
  );
}
