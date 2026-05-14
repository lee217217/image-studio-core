import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import { templates } from '../editor/templates.js';

export default function TemplatePanel({ onClose }) {
  const { canvas, fitToScreen } = useEditor();
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const showToast = useEditorStore((s) => s.showToast);

  function applyTemplate(tpl) {
    if (!canvas) return;
    tpl.apply(canvas);
    // Mirror the new canvas size into the store so other UI stays consistent.
    setCanvasSize({ width: canvas.getWidth(), height: canvas.getHeight(), label: tpl.name });
    setTimeout(() => fitToScreen && fitToScreen(), 50);
    showToast({ type: 'success', message: `Template loaded: ${tpl.name}` });
  }

  return (
    <div className="w-full md:w-72 md:flex-shrink-0 border-r border-line bg-surface-1 flex flex-col min-h-0 max-h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <div>
          <div className="panel-heading">Templates</div>
          <div className="text-xs text-ink-muted mt-0.5">Quick-start layouts</div>
        </div>
        <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close templates">
          <Icon name="x" size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto thin-scroll p-3 space-y-2">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => applyTemplate(tpl)}
            className="w-full text-left rounded-md border border-line bg-surface-1 hover:border-brand hover:bg-surface-2 transition p-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-md bg-surface-2 border border-line flex items-center justify-center text-ink-subtle group-hover:text-brand">
                <Icon name="template" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink truncate">{tpl.name}</div>
                <div className="text-xs text-ink-subtle mt-0.5">{tpl.size}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-line text-[11px] text-ink-subtle">
        Loading a template replaces the current canvas contents.
      </div>
    </div>
  );
}
