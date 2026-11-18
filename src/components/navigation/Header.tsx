import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, LayoutDashboard, Menu, Sparkles, X } from 'lucide-react';
import type { ViewId } from '@/types';
import './Header.css';

interface HeaderProps {
  view: ViewId;
  onNavigate: (view: ViewId) => void;
}

const NAV_ITEMS: { id: ViewId; label: string; icon: typeof Compass }[] = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  { id: 'visualizer', label: 'Visualizer', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore', icon: Compass },
];

export function Header({ view, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [view]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const navigate = (next: ViewId) => {
    onNavigate(next);
    setMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <button
          className="brand"
          onClick={() => navigate('overview')}
          aria-label="YourVisualizer home"
        >
          <span className="brand__mark" aria-hidden="true">
            <span className="brand__dot brand__dot--cyan" />
            <span className="brand__dot brand__dot--violet" />
            <span className="brand__dot brand__dot--blue" />
          </span>
          <span className="brand__name">
            Your<span>Visualizer</span>
          </span>
        </button>

        <nav className="app-header__nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-link ${view === item.id ? 'nav-link--active' : ''}`}
                onClick={() => navigate(item.id)}
                aria-current={view === item.id ? 'page' : undefined}
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="app-header__trailing">
          <span className="local-badge" title="All analysis runs locally in your browser">
            <span className="local-badge__pulse" />
            <span className="local-badge__text mono">Local engine</span>
          </span>
          <button
            className={`nav-link nav-link--about ${view === 'about' ? 'nav-link--active' : ''}`}
            onClick={() => navigate('about')}
            aria-current={view === 'about' ? 'page' : undefined}
          >
            About
          </button>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {[...NAV_ITEMS, { id: 'about' as ViewId, label: 'About', icon: Sparkles }].map(
              (item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav__item ${view === item.id ? 'mobile-nav__item--active' : ''}`}
                    onClick={() => navigate(item.id)}
                    aria-current={view === item.id ? 'page' : undefined}
                  >
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              },
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
