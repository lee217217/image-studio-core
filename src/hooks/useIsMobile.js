import { useEffect, useState } from 'react';

/**
 * Reactive viewport-width check that mirrors Tailwind's `md` breakpoint by
 * default (768px). Returns true when `window.innerWidth < breakpoint`.
 *
 * Why JS-detected instead of pure CSS? The two layouts in App.jsx mount very
 * different DOM trees (bottom-sheet vs side-panel). Toggling them with
 * `hidden md:flex` would keep both mounted, double-binding Fabric event
 * listeners and duplicating local state — which is wasteful and creates
 * subtle bugs in panels that read `canvas.getActiveObject()`.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    // matchMedia listeners are cheaper than resize handlers and don't fire on
    // every pixel of resize.
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    setIsMobile(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [breakpoint]);

  return isMobile;
}
