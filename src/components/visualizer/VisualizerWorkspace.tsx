import { WordGraph } from '@/components/graph/WordGraph';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import { Panel } from '@/components/ui/Panel';
import { exportGraphPng } from '@/lib/export/image';
import { ExportToolbar } from './ExportToolbar';
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
        <div className="workspace-page__intro-trailing">
          <p className="muted">
            Everything below is computed locally from the text you provide. Nothing is uploaded.
          </p>
          <ExportToolbar analysis={state.analysis} />
        </div>
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
          title="Co-occurrence network"
          padded={false}
        >
          <WordGraph
            graph={state.analysis?.graph ?? { nodes: [], links: [] }}
            selectedWord={state.selectedWord}
            onSelectWord={state.setSelectedWord}
            onExportImage={(svg) => void exportGraphPng(svg)}
            isAnalyzing={state.isAnalyzing}
          />
        </Panel>

        <Panel className="workspace-insights" eyebrow="03 / Insights" title="Signal readout" padded={false}>
          <InsightsPanel
            analysis={state.analysis}
            selectedWord={state.selectedWord}
            onSelectWord={state.setSelectedWord}
          />
        </Panel>
      </div>
    </div>
  );
}
