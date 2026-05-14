import Icon from '../../components/Icon.jsx';
import { useEditor } from '../../hooks/useEditor.js';
import { useEditorStore } from '../../store/editorStore.js';
import { downloadProjectJson } from '../../editor/serialization.js';
import { downloadCanvasImage } from '../../editor/exportUtils.js';

/**
 * ExportSheet — save / export actions.
 *
 * Big tap targets stacked vertically. Each action toasts on success so
 * the user gets confirmation even though the sheet auto-closes.
 */
export default function ExportSheet({ onClose }) {
  const { canvas } = useEditor();
  const showToast = useEditorStore((s) => s.showToast);

  function handleSave() {
    if (!canvas) return;
    downloadProjectJson(canvas);
    showToast({ type: 'success', message: 'Project saved as JSON.' });
    onClose && onClose();
  }
  function handlePng() {
    if (!canvas) return;
    downloadCanvasImage(canvas, 'png');
    showToast({ type: 'success', message: 'PNG exported.' });
    onClose && onClose();
  }
  function handleJpg() {
    if (!canvas) return;
    downloadCanvasImage(canvas, 'jpg');
    showToast({ type: 'success', message: 'JPG exported.' });
    onClose && onClose();
  }

  return (
    <div className="px-3 space-y-2">
      <Action icon="save"     label="Save project (.json)"  hint="Includes all layers, sizes, and styles." onClick={handleSave} />
      <Action icon="download" label="Export PNG"            hint="Transparent background supported."     onClick={handlePng} primary />
      <Action icon="download" label="Export JPG"            hint="Smaller file, no transparency."        onClick={handleJpg} />
    </div>
  );
}

function Action({ icon, label, hint, onClick, primary = false }) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full h-16 rounded-xl border flex items-center gap-3 px-4 text-left transition active:scale-[0.99]',
        primary
          ? 'bg-brand text-white border-brand hover:bg-brand-hover'
          : 'bg-surface-1 text-ink border-line hover:bg-surface-2'
      ].join(' ')}
    >
      <Icon name={icon} size={20} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className={['text-xs', primary ? 'text-white/80' : 'text-ink-subtle'].join(' ')}>{hint}</div>
      </div>
    </button>
  );
}
