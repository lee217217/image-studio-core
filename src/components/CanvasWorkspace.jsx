import { useEffect, useRef, useState, useCallback } from 'react';
import { createFabricCanvas } from '../editor/fabricSetup.js';
import { createHistoryManager } from '../editor/historyManager.js';
import { autoSaveToLocalStorage, downloadProjectJson } from '../editor/serialization.js';
import { useEditorStore } from '../store/editorStore.js';
import { EditorContext } from '../hooks/useEditor.js';
import { useCanvasHistory } from '../hooks/useCanvasHistory.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { deleteActive, duplicateActive } from '../editor/editorActions.js';

const DEFAULT_VIEWPORT_PADDING = 24;

/**
 * CanvasWorkspace owns the Fabric.js canvas instance, exposes it via
 * EditorContext, and renders the central canvas stage. Surrounding panels
 * (TopBar, LeftToolbar, RightPropertiesPanel, etc.) are rendered as
 * children so they have access to the same canvas instance.
 */
export default function CanvasWorkspace({ renderShell, viewportPadding = DEFAULT_VIEWPORT_PADDING }) {
  const canvasElRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const historyRef = useRef(null);
  const fitToScreenRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [visualZoom, setVisualZoom] = useState(1);

  const canvasSize = useEditorStore((s) => s.canvasSize);
  const background = useEditorStore((s) => s.background);
  const setSelection = useEditorStore((s) => s.setSelection);
  const bumpSelection = useEditorStore((s) => s.bumpSelection);
  const setLayers = useEditorStore((s) => s.setLayers);
  const setZoom = useEditorStore((s) => s.setZoom);
  const showToast = useEditorStore((s) => s.showToast);

  // Initialize Fabric canvas once
  useEffect(() => {
    if (canvasRef.current) return;
    const canvas = createFabricCanvas(canvasElRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      background
    });
    canvasRef.current = canvas;

    const history = createHistoryManager(canvas);
    historyRef.current = history;

    const refreshLayers = () => {
      const list = canvas.getObjects().map((o) => {
        if (!o.__uid) o.__uid = uid();
        return {
          id: o.__uid,
          type: o.type,
          name: o.name || labelFor(o.type),
          ref: o
        };
      });
      setLayers([...list].reverse());
    };

    const syncSelection = () => {
      const active = canvas.getActiveObjects();
      setSelection(active.map((o) => o.__uid || (o.__uid = uid())));
    };
    const onAny = () => { refreshLayers(); bumpSelection(); };

    canvas.on('selection:created', syncSelection);
    canvas.on('selection:updated', syncSelection);
    canvas.on('selection:cleared', () => setSelection([]));
    canvas.on('object:added', onAny);
    canvas.on('object:removed', onAny);
    canvas.on('object:modified', onAny);
    canvas.on('object:scaling', bumpSelection);
    canvas.on('object:moving', bumpSelection);
    canvas.on('object:rotating', bumpSelection);

    refreshLayers();

    const interval = setInterval(() => {
      try { autoSaveToLocalStorage(canvas); } catch {}
    }, 4000);

    setReady(true);

    return () => {
      clearInterval(interval);
      history.destroy();
      canvas.dispose();
      canvasRef.current = null;
      historyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setWidth(canvasSize.width);
    canvas.setHeight(canvasSize.height);
    canvas.requestRenderAll();
    fitToScreenRef.current && fitToScreenRef.current();
  }, [canvasSize.width, canvasSize.height]);

  // Apply background changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setBackgroundColor(background, () => canvas.requestRenderAll());
  }, [background]);

  // Fit-to-screen via CSS transform so logical canvas size stays accurate.
  const fitToScreen = useCallback(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const stageW = stage.clientWidth - viewportPadding * 2;
    const stageH = stage.clientHeight - viewportPadding * 2;
    const cw = canvas.getWidth();
    const ch = canvas.getHeight();
    const z = Math.min(stageW / cw, stageH / ch, 1);
    const clamped = Math.max(z, 0.05);
    setVisualZoom(clamped);
    setZoom(clamped);
  }, [setZoom, viewportPadding]);

  useEffect(() => { fitToScreenRef.current = fitToScreen; }, [fitToScreen]);

  // Re-fit when viewportPadding changes (e.g. switching mobile <-> desktop).
  useEffect(() => { if (ready) fitToScreen(); }, [viewportPadding, ready, fitToScreen]);

  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(() => fitToScreen());
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [fitToScreen]);

  useEffect(() => { if (ready) fitToScreen(); }, [ready, fitToScreen]);

  const zoomIn = useCallback(() => {
    setVisualZoom((z) => {
      const next = Math.min(z * 1.2, 4);
      setZoom(next);
      return next;
    });
  }, [setZoom]);

  const zoomOut = useCallback(() => {
    setVisualZoom((z) => {
      const next = Math.max(z / 1.2, 0.05);
      setZoom(next);
      return next;
    });
  }, [setZoom]);

  const handlers = {
    delete: () => canvasRef.current && deleteActive(canvasRef.current),
    duplicate: () => canvasRef.current && duplicateActive(canvasRef.current),
    undo: () => historyRef.current && historyRef.current.undo(),
    redo: () => historyRef.current && historyRef.current.redo(),
    save: () => {
      if (!canvasRef.current) return;
      downloadProjectJson(canvasRef.current);
      showToast({ type: 'success', message: 'Project saved as JSON.' });
    }
  };
  useKeyboardShortcuts({ canvas: canvasRef.current, handlers });
  useCanvasHistory(historyRef.current);

  const ctxValue = {
    canvas: canvasRef.current,
    history: historyRef.current,
    fitToScreen,
    zoomIn,
    zoomOut
  };

  // Wrap the canvas in a box sized to the scaled visual dimensions so the
  // surrounding flex container can lay it out as a normal-sized element.
  // Without this, the inner inline-block keeps its un-scaled width/height
  // (e.g. 1080×1080) and `items-start` pushes the visually-small canvas
  // far below the visible area, leaving the user staring at empty space.
  const fabricCanvas = canvasRef.current;
  const logicalW = fabricCanvas ? fabricCanvas.getWidth() : canvasSize.width;
  const logicalH = fabricCanvas ? fabricCanvas.getHeight() : canvasSize.height;
  const scaledW = logicalW * visualZoom;
  const scaledH = logicalH * visualZoom;

  const canvasStage = (
    <div
      ref={stageRef}
      className="canvas-shell flex-1 min-h-0 overflow-auto thin-scroll flex items-start md:items-center justify-center p-3 pt-4 md:p-8"
    >
      <div
        style={{
          width: scaledW || undefined,
          height: scaledH || undefined,
          position: 'relative'
        }}
      >
        <div
          className="shadow-xl ring-1 ring-black/10 bg-white"
          style={{
            width: logicalW || undefined,
            height: logicalH || undefined,
            transform: `scale(${visualZoom})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <canvas ref={canvasElRef} />
        </div>
      </div>
    </div>
  );

  return (
    <EditorContext.Provider value={ctxValue}>
      {renderShell(canvasStage)}
    </EditorContext.Provider>
  );
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function labelFor(type) {
  switch (type) {
    case 'i-text':
    case 'text':
    case 'textbox': return 'Text';
    case 'rect': return 'Rectangle';
    case 'circle': return 'Circle';
    case 'line': return 'Line';
    case 'group': return 'Group';
    case 'image': return 'Image';
    case 'triangle': return 'Triangle';
    default: return 'Object';
  }
}
