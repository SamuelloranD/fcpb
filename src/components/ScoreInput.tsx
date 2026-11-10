import { ChevronDown, ChevronUp } from "lucide-react";

export const stepScore = (value: number, delta: 1 | -1) =>
  Math.max(0, value + delta);

export function ScoreInput({
  value,
  onChange,
  disabled = false,
  className = "",
  inputClassName = "",
  ariaLabel,
}: {
  value: number | string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
}) {
  const changeBy = (delta: 1 | -1) =>
    onChange(String(stepScore(Number(value) || 0, delta)));
  return (
    <div className={`group relative h-9 w-10 ${className}`}>
      <input
        aria-label={ariaLabel}
        disabled={disabled}
        className={`h-full w-full appearance-none rounded border bg-[var(--bg)] p-0 text-center font-black [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClassName}`}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {!disabled && (
        <span className="absolute inset-y-0 right-0 flex w-3 flex-col overflow-hidden rounded-r border-l border-slate-200 bg-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            aria-label="Aumentar placar"
            className="flex flex-1 items-center justify-center hover:bg-slate-100"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => changeBy(1)}
          >
            <ChevronUp size={10} />
          </button>
          <button
            type="button"
            aria-label="Diminuir placar"
            className="flex flex-1 items-center justify-center hover:bg-slate-100"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => changeBy(-1)}
          >
            <ChevronDown size={10} />
          </button>
        </span>
      )}
    </div>
  );
}
