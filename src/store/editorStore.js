import { create } from 'zustand';

/**
 * Editor state held in React land. The actual Fabric canvas instance lives
 * in a ref inside CanvasWorkspace; this store only holds React-visible state.
 */
export const useEditorStore = create((set, get) => ({
  // Canvas size & background
  canvasSize: { width: 1080, height: 1080, label: 'Instagram Post' },
  background: '#ffffff',

  // Selection
  selectedIds: [],
  selectionVersion: 0, // bumped whenever the selected object's properties change

  // Layers (mirrored list of canvas objects for the panel)
  layers: [],

  // Viewport
  zoom: 1,

  // Theme
  theme: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',

  // History readiness
  history: { canUndo: false, canRedo: false },

  // Notifications
  toast: null,

  // Actions
  setCanvasSize: (size) => set({ canvasSize: size }),
  setBackground: (color) => set({ background: color }),
  setSelection: (ids) => set((s) => ({ selectedIds: ids, selectionVersion: s.selectionVersion + 1 })),
  bumpSelection: () => set((s) => ({ selectionVersion: s.selectionVersion + 1 })),
  setLayers: (layers) => set({ layers }),
  setZoom: (zoom) => set({ zoom }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setHistoryState: (history) => set({ history }),
  showToast: (toast) => {
    set({ toast });
    if (toast) {
      setTimeout(() => {
        if (get().toast === toast) set({ toast: null });
      }, 3200);
    }
  },
  clearToast: () => set({ toast: null })
}));
