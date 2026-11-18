import { useCallback, useEffect, useRef, useState } from 'react';
import { analyzeText } from '@/lib/analysis';
import type { AnalysisResult, HistoryEntry } from '@/types';

export function useVisualizerState() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const runAnalysis = useCallback((source?: string) => {
    const value = source ?? text;
    const usable = tokenCount(value) > 0;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setIsAnalyzing(true);

    timerRef.current = window.setTimeout(() => {
      const result = usable ? analyzeText(value) : analyzeText('');
      setAnalysis(result);
      setSelectedWord(null);
      setHistory((entries) =>
        usable
          ? [
              {
                id: `${result.createdAt}-${entries.length}`,
                label: value.trim().slice(0, 48) + (value.trim().length > 48 ? '…' : ''),
                result,
              },
              ...entries,
            ].slice(0, 6)
          : entries,
      );
      setIsAnalyzing(false);
      timerRef.current = null;
    }, 260);
  }, [text]);

  const updateText = useCallback((value: string) => {
    setText(value);
  }, []);

  const loadSample = useCallback((sampleText: string) => {
    setText(sampleText);
    runAnalysis(sampleText);
  }, [runAnalysis]);

  const clearAll = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setText('');
    setAnalysis(null);
    setSelectedWord(null);
    setIsAnalyzing(false);
  }, []);

  const resetGraph = useCallback(() => {
    setSelectedWord(null);
  }, []);

  const restoreEntry = useCallback((entry: HistoryEntry) => {
    setText(entry.result.text);
    setAnalysis(entry.result);
    setSelectedWord(null);
  }, []);

  return {
    text,
    analysis,
    selectedWord,
    history,
    isAnalyzing,
    updateText,
    runAnalysis,
    loadSample,
    clearAll,
    resetGraph,
    restoreEntry,
    setSelectedWord,
    setAnalysis,
  };
}

function tokenCount(value: string): number {
  const matches = value.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
}
