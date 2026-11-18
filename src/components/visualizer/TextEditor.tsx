import { useMemo } from 'react';
import { FileText, Play, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SAMPLES } from '@/data/samples';
import { splitSentences } from '@/lib/analysis/sentences';
import { tokenize } from '@/lib/analysis/tokenize';
import './TextEditor.css';

interface TextEditorProps {
  text: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  onLoadSample: (text: string) => void;
  isAnalyzing: boolean;
}

const PLACEHOLDER = `Paste or write text here…\n\nA paragraph, an article, a few sentences — anything with words. YourVisualizer will map its patterns locally, right in this browser.`;

export function TextEditor({
  text,
  onChange,
  onAnalyze,
  onClear,
  onLoadSample,
  isAnalyzing,
}: TextEditorProps) {
  const stats = useMemo(() => {
    const tokens = tokenize(text);
    return {
      characters: text.length,
      words: tokens.length,
      sentences: splitSentences(text).length,
    };
  }, [text]);

  const canAnalyze = stats.words > 0 && !isAnalyzing;
  const isShort = stats.words > 0 && stats.words < 14;

  return (
    <section className="text-editor" aria-label="Text input panel">
      <header className="text-editor__header">
        <div className="text-editor__heading">
          <span className="eyebrow">01 / Input</span>
          <h2>Your text</h2>
        </div>
        <button className="text-editor__clear" onClick={onClear} disabled={!text} title="Clear text">
          <RotateCcw size={14} strokeWidth={1.8} aria-hidden="true" />
          Clear
        </button>
      </header>

      <div className="text-editor__field">
        <textarea
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          aria-label="Text to analyze"
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault();
              if (canAnalyze) onAnalyze();
            }
          }}
        />
        {!text && (
          <div className="text-editor__placeholder-icon" aria-hidden="true">
            <FileText size={26} strokeWidth={1.2} />
          </div>
        )}
      </div>

      <div className="text-editor__counters" aria-live="polite">
        <Counter label="Characters" value={stats.characters} />
        <Counter label="Words" value={stats.words} />
        <Counter label="Sentences" value={stats.sentences} />
      </div>

      {isShort && (
        <p className="text-editor__hint">
          Short text produces fewer connections. Try a longer passage for a richer graph.
        </p>
      )}

      <div className="text-editor__samples">
        <label className="text-editor__samples-label" htmlFor="sample-select">
          <Sparkles size={13} strokeWidth={1.8} aria-hidden="true" />
          Load a sample
        </label>
        <select
          id="sample-select"
          className="text-editor__select"
          value=""
          onChange={(event) => {
            const sample = SAMPLES.find((item) => item.id === event.target.value);
            if (sample) onLoadSample(sample.text);
          }}
        >
          <option value="" disabled>
            Choose a category…
          </option>
          {SAMPLES.map((sample) => (
            <option key={sample.id} value={sample.id}>
              {sample.category} — {sample.title}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        icon={<Play size={15} fill="currentColor" />}
        onClick={onAnalyze}
        disabled={!canAnalyze}
        className="text-editor__analyze"
      >
        {isAnalyzing ? 'Processing locally…' : 'Analyze Text'}
      </Button>
      <p className="text-editor__shortcut mono">Ctrl / ⌘ + Enter to analyze</p>
    </section>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="editor-counter">
      <span className="editor-counter__value mono">{value.toLocaleString()}</span>
      <span className="editor-counter__label">{label}</span>
    </div>
  );
}
