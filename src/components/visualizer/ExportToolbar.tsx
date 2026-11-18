import { useEffect, useRef, useState } from 'react';
import { Check, Copy, FileJson, FileText } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { copyAnalysisSummary, downloadJson } from '@/lib/export/json';
import { downloadTextReport } from '@/lib/export/report';
import './ExportToolbar.css';

interface ExportToolbarProps {
  analysis: AnalysisResult | null;
}

export function ExportToolbar({ analysis }: ExportToolbarProps) {
  const [status, setStatus] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const announce = (message: string) => {
    setStatus(message);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus(null), 2400);
  };

  const disabled = !analysis || analysis.tokens.length === 0;

  return (
    <div className="export-toolbar">
      <button
        className="export-toolbar__button"
        disabled={disabled}
        onClick={async () => {
          const ok = analysis ? await copyAnalysisSummary(analysis) : false;
          announce(ok ? 'Summary copied' : 'Copy unavailable');
        }}
        title="Copy analysis summary"
      >
        <Copy size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>Copy</span>
      </button>
      <button
        className="export-toolbar__button"
        disabled={disabled}
        onClick={() => {
          if (analysis) downloadJson(analysis);
          announce('JSON downloaded');
        }}
        title="Download analysis as JSON"
      >
        <FileJson size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>JSON</span>
      </button>
      <button
        className="export-toolbar__button"
        disabled={disabled}
        onClick={() => {
          if (analysis) downloadTextReport(analysis);
          announce('Report downloaded');
        }}
        title="Download text report"
      >
        <FileText size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>Report</span>
      </button>
      {status && (
        <span className="export-toolbar__status mono" role="status">
          <Check size={12} aria-hidden="true" />
          {status}
        </span>
      )}
    </div>
  );
}
