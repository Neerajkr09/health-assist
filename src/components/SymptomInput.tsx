import { useState, useRef, useEffect } from "react";
import { SYMPTOM_LIST } from "@/data/symptoms";

interface Props {
  selected: string[];
  onChange: (symptoms: string[]) => void;
}

const SymptomInput = ({ selected, onChange }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = SYMPTOM_LIST.filter(
    (s) =>
      s.toLowerCase().includes(query.toLowerCase()) && !selected.includes(s)
  );

  useEffect(() => {
    setHighlightIdx(0);
  }, [query]);

  const add = (symptom: string) => {
    onChange([...selected, symptom]);
    setQuery("");
    inputRef.current?.focus();
  };

  const remove = (symptom: string) => {
    onChange(selected.filter((s) => s !== symptom));
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[highlightIdx]) {
      e.preventDefault();
      add(filtered[highlightIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.children[highlightIdx] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx]);

  const formatLabel = (s: string) => s.replace(/_/g, " ");

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="block text-xl font-bold text-foreground mb-3">
        Select your symptoms(min:3)
      </label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium capitalize"
            >
              {formatLabel(s)}
              <button
                onClick={() => remove(s)}
                className="ml-1 hover:text-destructive transition-colors"
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          placeholder="Type a symptom..."
          className="w-full rounded-lg border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />

        {open && filtered.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-lg border border-border bg-card shadow-lg"
          >
            {filtered.slice(0, 30).map((s, i) => (
              <li
                key={s}
                onMouseDown={() => add(s)}
                className={`px-4 py-2 cursor-pointer capitalize text-sm transition-colors ${
                  i === highlightIdx
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {formatLabel(s)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SymptomInput;
