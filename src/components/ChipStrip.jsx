import { useEffect, useRef } from 'react';

/**
 * Reusable horizontal chip strip with proper mobile touch UX.
 *
 * Rules (from spec):
 *  - flex gap-3 overflow-x-auto thin-scroll pb-3 pt-1 px-4 snap-x snap-mandatory
 *    scroll-pl-4 scroll-pr-4 -mx-4 touch-pan-x overscroll-x-contain
 *  - inline style: WebkitOverflowScrolling 'touch', scrollbarGutter 'stable'
 *  - Trailing spacer (w-4 shrink-0)
 *  - Each chip: shrink-0 snap-start, w-24 sm:w-28 min-h-[96px]
 *    active state via data-active attribute + ring-2 ring-blue-500
 *  - Tap vs scroll: track touchstart x/y, mark moved if dx>8 or dy>8, ignore
 *    click if moved.
 *  - Debounce apply: ignore taps within 80ms of last apply.
 *  - Left/right fade gradients absolute inside relative wrapper.
 *  - Reset scrollLeft to 0 when `resetKey` changes (e.g. active pack tab).
 *  - scrollIntoView({behavior:'smooth', inline:'center'}) on chip apply.
 *
 * Props:
 *  - items: Array<{ id, render: (helpers) => ReactNode, ariaLabel?: string }>
 *    helpers: { isActive }
 *  - activeId: string | null
 *  - onTap: (id) => void
 *  - resetKey: any (scrollLeft resets to 0 when this changes)
 *  - chipClassName?: extra class names per chip
 *  - showFades?: boolean (default true)
 */
export default function ChipStrip({
  items,
  activeId,
  onTap,
  resetKey,
  chipClassName = '',
  showFades = true,
}) {
  const scrollerRef = useRef(null);
  const chipRefs = useRef(new Map());
  const lastApplyRef = useRef(0);
  const touchStateRef = useRef({ x: 0, y: 0, moved: false });

  // Reset scroll position when the pack tab (or any external context) changes.
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
  }, [resetKey]);

  function handleTap(id) {
    const now = Date.now();
    if (now - lastApplyRef.current < 80) return;
    lastApplyRef.current = now;
    onTap && onTap(id);

    // Smooth scroll the active chip into view (centered).
    const el = chipRefs.current.get(id);
    if (el && el.scrollIntoView) {
      try {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch {
        /* older browsers may not support options object */
      }
    }
  }

  function onTouchStart(e) {
    const t = e.touches && e.touches[0];
    if (!t) return;
    touchStateRef.current = { x: t.clientX, y: t.clientY, moved: false };
  }
  function onTouchMove(e) {
    const t = e.touches && e.touches[0];
    if (!t) return;
    const s = touchStateRef.current;
    if (Math.abs(t.clientX - s.x) > 8 || Math.abs(t.clientY - s.y) > 8) {
      s.moved = true;
    }
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto thin-scroll pb-3 pt-1 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 -mx-4 touch-pan-x overscroll-x-contain"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarGutter: 'stable' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) chipRefs.current.set(item.id, el);
                else chipRefs.current.delete(item.id);
              }}
              data-active={isActive ? 'true' : undefined}
              aria-label={item.ariaLabel || item.id}
              onClick={() => {
                if (touchStateRef.current.moved) {
                  touchStateRef.current.moved = false;
                  return;
                }
                handleTap(item.id);
              }}
              className={[
                'shrink-0 snap-start w-24 sm:w-28 min-h-[96px] rounded-2xl border p-3 text-left bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-50 transition-all',
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500'
                  : 'border-surface-200 dark:border-surface-800 hover:border-blue-400 dark:hover:border-blue-500',
                chipClassName,
              ].join(' ')}
            >
              {item.render({ isActive })}
            </button>
          );
        })}
        {/* Trailing spacer so the last chip can fully scroll into view */}
        <div className="shrink-0 w-4" aria-hidden="true" />
      </div>

      {showFades && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-3 left-0 w-6 bg-gradient-to-r from-surface-50 dark:from-surface-950 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-3 right-0 w-6 bg-gradient-to-l from-surface-50 dark:from-surface-950 to-transparent"
          />
        </>
      )}
    </div>
  );
}

/**
 * Reusable horizontal pack tabs (smaller pills). Same touch UX rules as
 * ChipStrip but rendered as compact pills with no min-height.
 *
 * Props:
 *  - tabs: Array<{ id, label }>
 *  - activeId: string
 *  - onChange: (id) => void
 */
export function PackTabRow({ tabs, activeId, onChange }) {
  const scrollerRef = useRef(null);
  const touchStateRef = useRef({ x: 0, y: 0, moved: false });
  const lastApplyRef = useRef(0);
  const tabRefs = useRef(new Map());

  function onTouchStart(e) {
    const t = e.touches && e.touches[0];
    if (!t) return;
    touchStateRef.current = { x: t.clientX, y: t.clientY, moved: false };
  }
  function onTouchMove(e) {
    const t = e.touches && e.touches[0];
    if (!t) return;
    const s = touchStateRef.current;
    if (Math.abs(t.clientX - s.x) > 8 || Math.abs(t.clientY - s.y) > 8) {
      s.moved = true;
    }
  }

  function handleTap(id) {
    const now = Date.now();
    if (now - lastApplyRef.current < 80) return;
    lastApplyRef.current = now;
    onChange && onChange(id);
    const el = tabRefs.current.get(id);
    if (el && el.scrollIntoView) {
      try { el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch {}
    }
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto thin-scroll pb-1 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 -mx-4 touch-pan-x overscroll-x-contain"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarGutter: 'stable' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {tabs.map((t) => {
          const isActive = activeId === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => { if (el) tabRefs.current.set(t.id, el); else tabRefs.current.delete(t.id); }}
              data-active={isActive ? 'true' : undefined}
              onClick={() => {
                if (touchStateRef.current.moved) {
                  touchStateRef.current.moved = false;
                  return;
                }
                handleTap(t.id);
              }}
              className={[
                'shrink-0 snap-start px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-200 dark:hover:bg-surface-700',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
        <div className="shrink-0 w-4" aria-hidden="true" />
      </div>
    </div>
  );
}
