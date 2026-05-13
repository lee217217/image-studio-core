import { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore.js';

/**
 * Subscribe the React store to the history manager so the toolbar
 * undo/redo buttons reflect availability.
 */
export function useCanvasHistory(history) {
  const setHistoryState = useEditorStore((s) => s.setHistoryState);
  useEffect(() => {
    if (!history) return;
    return history.subscribe((state) => setHistoryState(state));
  }, [history, setHistoryState]);
}
