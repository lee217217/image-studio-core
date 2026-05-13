import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import { downloadCanvasImage } from '../editor/exportUtils.js';

/**
 * Optional inline export quick-actions — used inside the bottom status bar.
 */
export default function ExportPanel() {
  const { canvas, zoomIn, zoomOut, fitToScreen } = useEditor();
  const zoom = useEditorStore((s) => s.zoom);

  return (
    <div className="h-9 px-3 flex-shrink-0 flex items-center gap-1 border-t border-line bg-surface-1 text-xs text-ink-muted">
      <button className="btn-ghost h-7 px-2 py-1" onClick={zoomOut} aria-label="Zoom out">
        <Icon name="zoomOut" size={14} />
      </button>
      <span className="w-12 text-center tabular-nums">{Math.round((zoom || 1) * 100)}%</span>
      <button className="btn-ghost h-7 px-2 py-1" onClick={zoomIn} aria-label="Zoom in">
        <Icon name="zoomIn" size={14} />
      </button>
      <button className="btn-ghost h-7 px-2 py-1" onClick={fitToScreen} aria-label="Fit to screen">
        <Icon name="fit" size={14} />
        <span className="ml-1">Fit</span>
      </button>
      <div className="flex-1" />
      {canvas && (
        <span className="hidden md:inline text-ink-subtle">
          {Math.round(canvas.getWidth())} × {Math.round(canvas.getHeight())} px
        </span>
      )}
      <div className="w-px h-4 bg-line mx-1" />
      <button className="btn-ghost h-7 px-2 py-1" onClick={() => canvas && downloadCanvasImage(canvas, 'png')}>
        <Icon name="download" size={14} /> PNG
      </button>
      <button className="btn-ghost h-7 px-2 py-1" onClick={() => canvas && downloadCanvasImage(canvas, 'jpg')}>
        <Icon name="download" size={14} /> JPG
      </button>
    </div>
  );
}
