import { useEffect, useState } from 'react';

/**
 * Mobile shell detector for the dedicated mobile experience.
 *
 * Returns true if EITHER:
 *   - viewport width is <= 767px (Tailwind `md` boundary), OR
 *   - the primary pointer is coarse (i.e. a touch device)
 *
 * The coarse-pointer signal catches the case of a tablet/foldable in a
 * wide layout that still feels like a touch device. We also re-evaluate on
 * resize / orientationchange so the layout flips immediately when the user
 * rotates the device or resizes a desktop window across the breakpoint.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => check());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const widthMQL = window.matchMedia('(max-width: 767px)');
    const coarseMQL = window.matchMedia('(pointer: coarse)');

    const onChange = () => setIsMobile(check());

    // matchMedia change events fire only when the predicate flips, so they
    // are far cheaper than wiring a per-pixel resize handler.
    bind(widthMQL, onChange);
    bind(coarseMQL, onChange);
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);

    // Re-evaluate after mount in case SSR returned a stale value.
    onChange();

    return () => {
      unbind(widthMQL, onChange);
      unbind(coarseMQL, onChange);
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
    };
  }, []);

  return isMobile;
}

function check() {
  if (typeof window === 'undefined') return false;
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return narrow || coarse;
}

function bind(mql, fn) {
  if (!mql) return;
  if (mql.addEventListener) mql.addEventListener('change', fn);
  else if (mql.addListener) mql.addListener(fn);
}

function unbind(mql, fn) {
  if (!mql) return;
  if (mql.removeEventListener) mql.removeEventListener('change', fn);
  else if (mql.removeListener) mql.removeListener(fn);
}
