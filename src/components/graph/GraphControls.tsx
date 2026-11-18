import { Camera, Focus, Maximize2, Minus, Plus } from 'lucide-react';
import './GraphControls.css';

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  onExportImage: () => void;
  disabled?: boolean;
}

const CONTROLS = [
  { key: 'in', label: 'Zoom in', icon: Plus },
  { key: 'out', label: 'Zoom out', icon: Minus },
  { key: 'reset', label: 'Reset view', icon: Focus },
  { key: 'full', label: 'Toggle fullscreen', icon: Maximize2 },
  { key: 'image', label: 'Export graph as PNG', icon: Camera },
] as const;

export function GraphControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onFullscreen,
  onExportImage,
  disabled = false,
}: GraphControlsProps) {
  const handlers = {
    in: onZoomIn,
    out: onZoomOut,
    reset: onReset,
    full: onFullscreen,
    image: onExportImage,
  };

  return (
    <div className="graph-controls" role="group" aria-label="Graph controls">
      {CONTROLS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className="graph-controls__button"
          onClick={handlers[key]}
          title={label}
          aria-label={label}
          disabled={disabled && key !== 'full'}
        >
          <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
