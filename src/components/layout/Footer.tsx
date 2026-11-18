import { ShieldCheck } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <span className="app-footer__name">
            Your<span>Visualizer</span>
          </span>
          <span className="muted">Visualize the hidden patterns inside your words.</span>
        </div>
        <div className="app-footer__meta">
          <span className="app-footer__privacy">
            <ShieldCheck size={13} aria-hidden="true" />
            Local-first · No tracking · No accounts
          </span>
          <span className="mono">Algorithmic analysis, not AI inference</span>
        </div>
      </div>
    </footer>
  );
}
