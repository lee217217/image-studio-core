import Icon from '../components/Icon.jsx';
import { useEditorStore } from '../store/editorStore.js';

/**
 * Slim 44px header for the mobile shell.
 *
 *   ┌─────────────────────────────────────────────────┐
 *   │ [icon]        1080 × 1080            [more]    │
 *   └─────────────────────────────────────────────────┘
 *
 * Intentionally minimal — no app name, no toolbar. Heavy actions live in
 * the dock and the MoreSheet to keep the canvas as the visual hero.
 */
export default function MobileTopBar({ onOpenMore }) {
  const canvasSize = useEditorStore((s) => s.canvasSize);
  return (
    <header className="h-11 px-3 flex items-center justify-between border-b border-line bg-surface-1 select-none flex-shrink-0">
      <div className="h-7 w-7 rounded-md bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center text-white">
        <Icon name="image" size={14} strokeWidth={2} />
      </div>

      <div className="text-xs font-medium text-ink tabular-nums">
        {Math.round(canvasSize.width)} × {Math.round(canvasSize.height)}
      </div>

      <button
        className="btn-ghost h-8 w-8 p-0"
        onClick={onOpenMore}
        aria-label="More options"
      >
        <MoreDotsIcon />
      </button>
    </header>
  );
}

// Inline "more" dots — Icon.jsx doesn't ship a horizontal-dots glyph.
function MoreDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}
