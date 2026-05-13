import { createContext, useContext } from 'react';

/**
 * Provides the shared Fabric canvas instance (and helpers) to UI components.
 * The actual value is created by CanvasWorkspace and passed via App.
 */
export const EditorContext = createContext(null);

export function useEditor() {
  const value = useContext(EditorContext);
  if (!value) {
    return { canvas: null };
  }
  return value;
}
