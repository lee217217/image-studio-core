import Icon from '../components/Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import { deleteActive, duplicateActive } from '../editor/editorActions.js';
import { isTextObject } from '../editor/textEffects.js';

/**
 * Floating HUD that appears just above the dock when a Fabric object is
 * selected. Three chips: Duplicate, Delete, Style.
 *
 * Positioned just above the dock (64px + safe-area + 12px gap) so it
 * never overlaps either the canvas drag controls or the dock.
 *
 * Visibility is driven by the store's `selection` array (a list of object
 * uids that CanvasWorkspace maintains via Fabric's selection events). This
 * is simpler and more reliable than calling `canvas.getActiveObject()`
 * which doesn't re-evaluate when the active object changes.
 */
export default function MobileSelectionHud({ onOpenStyle, onOpenTextEffects }) {
  const { canvas } = useEditor();
  // CanvasWorkspace mirrors Fabric's selection events into `selectedIds`.
  // Subscribing here makes the HUD re-render on every selection change.
  const selectedIds = useEditorStore((s) => s.selectedIds);

  if (!selectedIds || selectedIds.length === 0) return null;

  const active = canvas ? canvas.getActiveObject() : null;
  const showTextEffects = !!(active && isTextObject(active) && onOpenTextEffects);

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-30 select-none"
      style={{ bottom: 'calc(64px + env(safe-area-inset-bottom) + 12px)' }}
    >
      <div className="flex items-center gap-1 rounded-full bg-surface-1 border border-line shadow-lg px-1 py-1">
        <Chip icon="copy"  label="Duplicate" onClick={() => canvas && duplicateActive(canvas)} />
        <Chip icon="trash" label="Delete"    onClick={() => canvas && deleteActive(canvas)} danger />
        <Chip icon="sparkle" label="Style"   onClick={onOpenStyle} />
        {showTextEffects && (
          <Chip icon="text" label="Text fx" onClick={onOpenTextEffects} />
        )}
      </div>
    </div>
  );
}

function Chip({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={[
        'h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-medium transition-colors',
        danger
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
          : 'text-ink hover:bg-surface-2'
      ].join(' ')}
    >
      <Icon name={icon} size={14} />
      <span>{label}</span>
    </button>
  );
}
