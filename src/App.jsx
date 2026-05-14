import { useEffect, useState } from 'react';
import { useIsMobile } from './mobile/useIsMobile.js';
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

import MobileApp from './mobile/MobileApp.jsx';

/**
 * App is the high-level shell. It picks one of two complete layouts based
 * on `useIsMobile()` and mounts a single CanvasWorkspace either way so the
 * Fabric instance is the single source of truth.
 *
 *   Desktop (>= md viewport AND fine pointer):
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
 *   Mobile (< md viewport OR coarse pointer):
 *     Dedicated MobileApp shell — see src/mobile/MobileApp.jsx.
 *
 * RightPropertiesPanel is desktop-only per spec; on mobile its properties
 * live inside the Style / Adjust / Crop sheets.
 */
export default function App() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const [activePanel, setActivePanel] = useState('layers');
  const theme = useEditorStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // Mobile gets tighter fit-to-screen padding so the canvas fills more of
  // the screen without empty margins.
  const viewportPadding = isMobile ? 16 : 24;

  return (
    <CanvasWorkspace
      viewportPadding={viewportPadding}
      renderShell={(canvasStage) =>
        isMobile ? (
          /* ===== Mobile shell ===== */
          <>
            <MobileApp
              canvasStage={canvasStage}
              onOpenNewCanvas={() => setSizeModalOpen(true)}
            />
            <SizePresetModal open={sizeModalOpen} onClose={() => setSizeModalOpen(false)} />
            <Toast />
          </>
        ) : (
          /* ===== Desktop shell (unchanged) ===== */
          <div className="h-full w-full flex flex-col bg-surface-0">
            <TopBar onOpenSizeModal={() => setSizeModalOpen(true)} />

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

            <SizePresetModal open={sizeModalOpen} onClose={() => setSizeModalOpen(false)} />
            <Toast />
          </div>
        )
      }
    />
  );
}

/**
 * Desktop side-panel mapper. Mobile renders its own sheet wrappers.
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
