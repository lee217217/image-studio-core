import { useState } from 'react';
import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import { clearCanvas } from '../editor/editorActions.js';

const PRESETS = [
  { label: 'Instagram Post', width: 1080, height: 1080, hint: 'Square · 1:1' },
  { label: 'Instagram Story', width: 1080, height: 1920, hint: 'Portrait · 9:16' },
  { label: 'A4 Portrait', width: 1240, height: 1754, hint: 'Print · 150 dpi' },
  { label: 'Presentation', width: 1600, height: 900, hint: 'Landscape · 16:9' },
  { label: 'Product Card', width: 1200, height: 1600, hint: 'Portrait · 3:4' }
];

export default function SizePresetModal({ open, onClose }) {
  const { canvas, fitToScreen } = useEditor();
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const setBackground = useEditorStore((s) => s.setBackground);
  const background = useEditorStore((s) => s.background);
  const showToast = useEditorStore((s) => s.showToast);
  const [custom, setCustom] = useState({ width: 1200, height: 800 });

  if (!open) return null;

  function pick(preset) {
    if (!canvas) return;
    clearCanvas(canvas, '#ffffff');
    setCanvasSize({ width: preset.width, height: preset.height, label: preset.label });
    setBackground('#ffffff');
    setTimeout(() => fitToScreen && fitToScreen(), 30);
    onClose();
    showToast({ type: 'success', message: `New ${preset.label} canvas created.` });
  }

  function pickCustom() {
    const w = parseInt(custom.width, 10);
    const h = parseInt(custom.height, 10);
    if (!Number.isFinite(w) || w < 50 || !Number.isFinite(h) || h < 50) {
      showToast({ type: 'error', message: 'Width and height must be at least 50px.' });
      return;
    }
    if (w > 8000 || h > 8000) {
      showToast({ type: 'error', message: 'Max dimension is 8000px.' });
      return;
    }
    if (canvas) {
      clearCanvas(canvas, background);
      setCanvasSize({ width: w, height: h, label: 'Custom' });
      setTimeout(() => fitToScreen && fitToScreen(), 30);
    }
    onClose();
    showToast({ type: 'success', message: `New ${w}×${h} canvas created.` });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
      <div
        className="bg-surface-1 border border-line rounded-xl w-[560px] max-w-[92vw] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div>
            <h3 className="text-base font-semibold text-ink">New canvas</h3>
            <p className="text-xs text-ink-muted mt-0.5">Pick a size to start with.</p>
          </div>
          <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close">
            <Icon name="x" size={14} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => pick(p)}
                className="rounded-md border border-line bg-surface-1 hover:border-brand hover:bg-surface-2 p-3 text-left transition"
              >
                <div className="text-sm font-medium text-ink">{p.label}</div>
                <div className="text-xs text-ink-muted mt-0.5">{p.width} × {p.height} · {p.hint}</div>
              </button>
            ))}
          </div>

          <div className="rounded-md border border-line bg-surface-2 p-3">
            <div className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">Custom size</div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="field-label block mb-1">Width</label>
                <input
                  type="number"
                  min="50"
                  max="8000"
                  value={custom.width}
                  onChange={(e) => setCustom((c) => ({ ...c, width: e.target.value }))}
                  className="input-base"
                />
              </div>
              <div className="text-ink-subtle pb-2">×</div>
              <div className="flex-1">
                <label className="field-label block mb-1">Height</label>
                <input
                  type="number"
                  min="50"
                  max="8000"
                  value={custom.height}
                  onChange={(e) => setCustom((c) => ({ ...c, height: e.target.value }))}
                  className="input-base"
                />
              </div>
              <button className="btn-primary" onClick={pickCustom}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
