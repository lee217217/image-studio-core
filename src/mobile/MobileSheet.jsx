import { useEffect } from 'react';
import Icon from '../components/Icon.jsx';

/**
 * Bottom sheet overlay for the mobile shell.
 *
 *   ┌────────────────────────────────────────┐
 *   │            ── grab handle ──           │
 *   │  Title                            [×]  │
 *   │ ─────────────────────────────────────  │
 *   │                                        │
 *   │           scrollable content           │
 *   │                                        │
 *   └────────────────────────────────────────┘
 *
 * Anchored above the 64px MobileDock (`bottom-16`) so the dock stays
 * tappable while the sheet is open — Instagram / TikTok style.
 *
 * Slides up via translate-y transition. When `open` flips false we
 * still render the wrapper briefly off-screen so the slide-down feels
 * natural; React unmounts on the next tick because the parent gates on
 * `open` too, which is fine.
 */
export default function MobileSheet({ open, onClose, title, children }) {
  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape closes the sheet.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop sits above canvas but below the dock so the dock stays usable. */}
      <div
        className="fixed inset-0 z-30 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed left-0 right-0 bottom-16 z-50 w-screen max-h-[78vh] rounded-t-3xl bg-surface-50 dark:bg-surface-950 shadow-2xl border-t border-surface-200 dark:border-surface-800 transform transition-transform"
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Tool sheet'}
      >
        {/* Grab handle */}
        <div className="flex justify-center pt-2">
          <span className="h-1.5 w-12 rounded-full bg-surface-300 dark:bg-surface-700" aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">{title}</span>
          <button
            className="btn-ghost h-7 w-7 p-0"
            onClick={onClose}
            aria-label="Close sheet"
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[68vh] w-full overflow-y-auto px-1 pb-24 thin-scroll">
          {children}
        </div>
      </div>
    </>
  );
}
