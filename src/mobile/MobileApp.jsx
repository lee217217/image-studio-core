import { useState } from 'react';
import MobileTopBar from './MobileTopBar.jsx';
import MobileCanvasStage from './MobileCanvasStage.jsx';
import MobileDock from './MobileDock.jsx';
import MobileSheet from './MobileSheet.jsx';
import MobileSelectionHud from './MobileSelectionHud.jsx';

import AddSheet from './sheets/AddSheet.jsx';
import AdjustSheet from './sheets/AdjustSheet.jsx';
import CropSheet from './sheets/CropSheet.jsx';
import StyleSheet from './sheets/StyleSheet.jsx';
import LayersSheet from './sheets/LayersSheet.jsx';
import ExportSheet from './sheets/ExportSheet.jsx';
import MoreSheet from './sheets/MoreSheet.jsx';

/**
 * MobileApp — dedicated mobile shell.
 *
 *   ┌────────────────────────────┐  ← TopBar (44px, slim)
 *   ├────────────────────────────┤
 *   │                            │
 *   │         Canvas             │  ← MobileCanvasStage
 *   │                            │
 *   │   [Dup] [Del] [Style]      │  ← MobileSelectionHud (when selected)
 *   ├────────────────────────────┤
 *   │  Add  Adjust  Crop  Style  │  ← MobileDock (64px, fixed)
 *   │      Layers   Export       │
 *   └────────────────────────────┘
 *
 *  - All non-canvas chrome (top + dock + sheets) is fixed. The canvas is the
 *    only flex child of the column so it expands naturally.
 *  - Bottom safe-area is applied inside the dock; top safe-area on the outer
 *    container so the TopBar pushes down on devices with a notch.
 *  - Sheets render conditionally — only the active sheet's component is
 *    mounted at any time, so panel state inside them resets cleanly between
 *    opens.
 */
export default function MobileApp({ canvasStage, onOpenNewCanvas }) {
  const [activeSheet, setActiveSheet] = useState(null);

  const openSheet = (name) => setActiveSheet((prev) => (prev === name ? null : name));
  const closeSheet = () => setActiveSheet(null);

  const titles = {
    add:    'Add to canvas',
    adjust: 'Adjust image',
    crop:   'Crop & resize',
    style:  'Layer style',
    layers: 'Layers',
    export: 'Save & export',
    more:   'More options'
  };

  return (
    <div className="h-full w-full flex flex-col bg-surface-0 pt-[env(safe-area-inset-top)]">
      <MobileTopBar onOpenMore={() => openSheet('more')} />
      <MobileCanvasStage canvasStage={canvasStage} />

      {/* Selection HUD floats above the canvas and the dock backdrop. */}
      <MobileSelectionHud onOpenStyle={() => openSheet('style')} />

      <MobileDock active={activeSheet} onOpen={openSheet} />

      <MobileSheet
        open={!!activeSheet}
        onClose={closeSheet}
        title={titles[activeSheet] || ''}
      >
        {activeSheet === 'add'    && <AddSheet    onClose={closeSheet} />}
        {activeSheet === 'adjust' && <AdjustSheet onClose={closeSheet} />}
        {activeSheet === 'crop'   && <CropSheet   onClose={closeSheet} />}
        {activeSheet === 'style'  && <StyleSheet  onClose={closeSheet} />}
        {activeSheet === 'layers' && <LayersSheet onClose={closeSheet} />}
        {activeSheet === 'export' && <ExportSheet onClose={closeSheet} />}
        {activeSheet === 'more'   && <MoreSheet   onClose={closeSheet} onOpenNewCanvas={onOpenNewCanvas} />}
      </MobileSheet>
    </div>
  );
}
