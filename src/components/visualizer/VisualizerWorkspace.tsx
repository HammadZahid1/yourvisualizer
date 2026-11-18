import { Panel } from '@/components/ui/Panel';
import { TextEditor } from './TextEditor';
import type { useVisualizerState } from '@/hooks/useVisualizerState';
import './VisualizerWorkspace.css';

interface VisualizerWorkspaceProps {
  state: ReturnType<typeof useVisualizerState>;
}

export function VisualizerWorkspace({ state }: VisualizerWorkspaceProps) {
  return (
    <div className="workspace-page">
      <div className="workspace-page__intro">
        <div>
          <span className="eyebrow">Analysis workspace</span>
          <h1>Visualize your text.</h1>
        </div>
        <p className="muted">
          Everything below is computed locally from the text you provide. Nothing is uploaded.
        </p>
      </div>

      <div className="workspace-grid">
        <TextEditor
          text={state.text}
          onChange={state.updateText}
          onAnalyze={() => state.runAnalysis()}
          onClear={state.clearAll}
          onLoadSample={state.loadSample}
          isAnalyzing={state.isAnalyzing}
        />

        <Panel
          className="workspace-graph"
          eyebrow="02 / Visualization"
          title="Relationship graph"
          padded={false}
        >
          <div className="workspace-graph__placeholder">
            <span className="mono">Graph engine initializing…</span>
          </div>
        </Panel>

        <Panel className="workspace-insights" eyebrow="03 / Insights" title="Signal readout" padded={false}>
          <div className="workspace-insights__placeholder">
            <span className="mono">Awaiting analysis</span>
          </div>
        </Panel>
      </div>
    </div>
  );
}
