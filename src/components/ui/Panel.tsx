import type { ReactNode } from 'react';
import './Panel.css';

interface PanelProps {
  eyebrow?: string;
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  padded?: boolean;
}

export function Panel({
  eyebrow,
  title,
  actions,
  children,
  className = '',
  bodyClassName = '',
  padded = true,
}: PanelProps) {
  const hasHeader = Boolean(eyebrow || title || actions);

  return (
    <section className={`ui-panel ${className}`}>
      {hasHeader && (
        <header className="ui-panel__header">
          <div className="ui-panel__heading">
            {eyebrow && <span className="ui-panel__eyebrow mono">{eyebrow}</span>}
            {title && <h3 className="ui-panel__title">{title}</h3>}
          </div>
          {actions && <div className="ui-panel__actions">{actions}</div>}
        </header>
      )}
      <div className={`ui-panel__body ${padded ? 'ui-panel__body--padded' : ''} ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}
