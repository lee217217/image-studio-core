import { useEffect, useState } from 'react';
import { useEditorStore } from './store/editorStore.js';

import CanvasWorkspace from './components/CanvasWorkspace.jsx';
import TopBar from './components/TopBar.jsx';
import LeftToolbar from './components/LeftToolbar.jsx';
import RightPropertiesPanel from './components/RightPropertiesPanel.jsx';
import LayersPanel from './components/LayersPanel.jsx';
import TemplatePanel from './components/TemplatePanel.jsx';
import ImageAdjustPanel from './components/ImageAdjustPanel.jsx';
import CropResizePanel from './components/CropResizePanel.jsx';
import AiPanel from './components/AiPanel.jsx';
import SizePresetModal from './components/SizePresetModal.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const theme = useEditorStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const renderPanel = () => {
    if (activePanel === 'templates') return <TemplatePanel onClose={() => setActivePanel(null)} />;
    if (activePanel === 'crop') return <CropResizePanel onClose={() => setActivePanel(null)} />;
    if (activePanel === 'adjust') return <ImageAdjustPanel onClose={() => setActivePanel(null)} />;
    if (activePanel === 'layers') return <LayersPanel onClose={() => setActivePanel(null)} />;
    if (activePanel === 'ai') return <AiPanel onClose={() => setActivePanel(null)} />;
    return null;
  };

  return (
    <CanvasWorkspace
      renderShell={(canvasStage) => (
        <div className="h-full w-full flex flex-col bg-surface-0 overflow-hidden">
          <TopBar onOpenSizeModal={() => setSizeModalOpen(true)} />

          <div className="relative flex-1 min-h-0 overflow-hidden">
            <div className="hidden md:flex h-full min-h-0">
              <LeftToolbar activePanel={activePanel} onActivatePanel={setActivePanel} />

              {activePanel !== 'layers' && renderPanel()}

              <main className="flex-1 flex flex-col min-w-0 min-h-0">
                {canvasStage}

                {activePanel === 'layers' && (
                  <LayersPanel onClose={() => setActivePanel(null)} />
                )}

                <ExportPanel />
              </main>

              <RightPropertiesPanel />
            </div>

            <div className="md:hidden h-full min-h-0 flex flex-col">
              <main className="relative flex-1 min-h-0 pb-16">
                {canvasStage}
              </main>

              {activePanel && (
                <div className="fixed inset-x-0 bottom-16 z-40 max-h-[68vh] overflow-hidden rounded-t-3xl border-t border-surface-200 bg-surface-50 shadow-2xl dark:border-surface-800 dark:bg-surface-950">
                  <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-surface-300 dark:bg-surface-700" />
                  <div className="max-h-[65vh] overflow-y-auto">
                    {renderPanel()}
                  </div>
                </div>
              )}

              <div className="fixed inset-x-0 bottom-0 z-50">
                <LeftToolbar
                  activePanel={activePanel}
                  onActivatePanel={setActivePanel}
                  mobile
                />
              </div>
            </div>
          </div>

          <SizePresetModal
            open={sizeModalOpen}
            onClose={() => setSizeModalOpen(false)}
          />

          <Toast />
        </div>
      )}
    />
  );
}