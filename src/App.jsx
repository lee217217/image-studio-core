import { useEffect, useState } from 'react';
import { useEditorStore } from './store/editorStore.js';

import CanvasWorkspace from './components/CanvasWorkspace.jsx';
import TopBar from './components/TopBar.jsx';
import LeftToolbar from './components/LeftToolbar.jsx';
import RightPropertiesPanel from './components/RightPropertiesPanel.jsx';
import LayersPanel from './components/LayersPanel.jsx';
import TemplatePanel from './components/TemplatePanel.jsx';
import AiPanel from './components/AiPanel.jsx';
import SizePresetModal from './components/SizePresetModal.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import Toast from './components/Toast.jsx';

/**
 * App is the high-level layout shell:
 *   ┌───────────────────────────────────────────────────────┐
 *   │ TopBar                                                │
 *   ├──┬───────────┬──────────────────────────┬─────────────┤
 *   │  │ Templates │                          │             │
 *   │L │     OR    │   Canvas stage           │  Properties │
 *   │  │  AiPanel  │                          │             │
 *   │  │           ├──────────────────────────┤             │
 *   │  │           │ Layers (optional)        │             │
 *   │  │           │ Status / Export bar      │             │
 *   └──┴───────────┴──────────────────────────┴─────────────┘
 *
 * CanvasWorkspace provides EditorContext so every child can reach the
 * shared Fabric canvas via `useEditor()`.
 */
export default function App() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('layers');
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
          <div className="flex-1 flex min-h-0">
            <LeftToolbar
              activePanel={activePanel}
              onActivatePanel={setActivePanel}
            />
            {activePanel === 'templates' && <TemplatePanel onClose={() => setActivePanel(null)} />}
{activePanel === 'adjust' && <ImageAdjustPanel onClose={() => setActivePanel(null)} />}
{activePanel === 'ai' && <AiPanel onClose={() => setActivePanel(null)} />}

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
      )}
    />
  );
}
