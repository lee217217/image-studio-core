import { useEffect } from 'react';
import { makeShortcutHandler } from '../editor/shortcuts.js';

export function useKeyboardShortcuts({ canvas, handlers }) {
  useEffect(() => {
    if (!canvas) return;
    const handler = makeShortcutHandler({ canvas, handlers });
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canvas, handlers]);
}
