import { useEffect, useState } from 'react';
import { useIsMobile } from './hooks/useIsMobile.js';
import { useEditorStore } from './store/editorStore.js';

import CanvasWorkspace from './components/CanvasWorkspace.jsx';
import TopBar from './components/TopBar.jsx';
import LeftToolbar from './components/LeftToolbar.jsx';
import RightPropertiesPanel from './components/RightPropertiesPanel.jsx';
import LayersPanel from './components/LayersPanel.jsx';
import TemplatePanel from './components/TemplatePanel.jsx';
import AiPanel from './components/AiPanel.jsx';
import ImageAdjustPanel from './components/ImageAdjustPanel.jsx';
import CropResizePanel from './components/CropResizePanel.jsx';
import LayerStylePanel from './components/LayerStylePanel.jsx';
import SizePresetModal from './components/SizePresetModal.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import Toast from './components/Toast.jsx';

/**
 * App is the high-level layout shell with two complete layouts:
 *
 *   Desktop (>= md, `hidden md:flex`):
 *   ┌───────────────────────────────────────────────────────┐
 *   │ TopBar                                                │
 *   ├──┬───────────────┬─────────────────────┬──────────────┤
 *   │L │ Panel (left)  │ Canvas              │ Properties   │
 *   │  │ templates /   │                     │ (right)      │
 *   │  │ crop /        ├─────────────────────┤              │
 *   │  │ adjust /      │ Layers (optional)   │              │
 *   │  │ style / ai    │ ExportPanel         │              │
 *   └──┴───────────────┴─────────────────────┴──────────────┘
 *
 *   Mobile (< md, `md:hidden`):
 *   ┌──────────────────────────────────┐
 *   │ TopBar (compact)                 │
 *   ├──────────────────────────────────┤
 *   │ Canvas (flex-1)                  │
 *   │                                  │
 *   │   active panel mounts as a       │
 *   │   bottom sheet above this        │
 *   ├──────────────────────────────────┤
 *   │ Bottom toolbar (LeftToolbar mob) │
 *   └──────────────────────────────────┘
 *
 * RightPropertiesPanel is desktop-only per spec.
 */
export default function App() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const isMobile = useIsMobile(768); // matches Tailwind `md` breakpoint
  // Default panel differs by layout — Layers feels natural on desktop, but
  // mobile starts with no sheet open so the canvas is the hero.
  const [activePanel, setActivePanel] = useState(isMobile ? null : 'layers');
  const theme = useEditorStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  return (
    <CanvasWorkspace
      renderShell={(canvasStage) => (
        <div className="h-full w-full flex flex-col bg-surface-0">
          <TopBar onOpenSizeModal={() => setSizeModalOpen(true)} />

          {!isMobile ? (
          /* ===== Desktop layout ===== */
          <div className="flex flex-1 min-h-0">
            <LeftToolbar
              activePanel={activePanel}
              onActivatePanel={setActivePanel}
            />
            {activePanel !== 'layers' && renderSidePanel(activePanel, () => setActivePanel(null))}

            <main className="flex-1 flex flex-col min-w-0 min-h-0">
              {canvasStage}
              {activePanel === 'layers' && (
                <LayersPanel onClose={() => setActivePanel(null)} />
              )}
              <ExportPanel />
            </main>

            <RightPropertiesPanel />
          </div>
          ) : (
          /* ===== Mobile layout ===== */
          <div className="flex flex-1 min-h-0 flex-col relative">
            <main className="flex-1 flex flex-col min-w-0 min-h-0 pb-16">
              {canvasStage}
            </main>

            {/* Bottom sheet — slides up above the fixed toolbar */}
            {activePanel && (
              <>
                <div
                  className="fixed left-0 right-0 top-0 bottom-16 z-30 bg-black/30"
                  onClick={() => setActivePanel(null)}
                  aria-hidden="true"
                />
                <div
                  className="fixed left-0 right-0 bottom-16 z-40 w-screen max-h-[72vh] rounded-t-3xl bg-surface-50 dark:bg-surface-950 overflow-hidden shadow-2xl border-t border-surface-200 dark:border-surface-800"
                  role="dialog"
                  aria-label="Tool panel"
                >
                  <div className="flex justify-center pt-2 pb-1">
                    <span className="h-1.5 w-10 rounded-full bg-surface-300 dark:bg-surface-700" />
                  </div>
                  <div className="max-h-[69vh] w-full overflow-y-auto bg-surface-50 dark:bg-surface-950">
                    {renderSidePanel(activePanel, () => setActivePanel(null))}
                    <div className="h-24" />
                  </div>
                </div>
              </>
            )}

            {/* Fixed bottom toolbar */}
            <div className="fixed left-0 right-0 bottom-0 z-50">
              <LeftToolbar
                mobile
                activePanel={activePanel}
                onActivatePanel={setActivePanel}
              />
            </div>
          </div>
          )}

          <SizePresetModal open={sizeModalOpen} onClose={() => setSizeModalOpen(false)} />
          <Toast />
        </div>
      )}
    />
  );
}

/**
 * Map the activePanel value to the matching panel component. `layers` is
 * special — on desktop it lives under the canvas, but on mobile it also opens
 * as a bottom sheet via this renderer.
 */
function renderSidePanel(activePanel, onClose) {
  switch (activePanel) {
    case 'templates': return <TemplatePanel onClose={onClose} />;
    case 'crop':      return <CropResizePanel onClose={onClose} />;
    case 'adjust':    return <ImageAdjustPanel onClose={onClose} />;
    case 'style':     return <LayerStylePanel onClose={onClose} />;
    case 'layers':    return <LayersPanel onClose={onClose} />;
    case 'ai':        return <AiPanel onClose={onClose} />;
    default:          return null;
  }
}
