import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  CANVAS_PRESETS,
  RESIZE_MODES,
  resizeCanvas,
  isImageObject,
  centerObject,
  fitObjectToCanvas,
  fillObjectToCanvas,
  rotateObject,
  flipObject,
  setObjectAngle
} from '../editor/cropResizeActions.js';

/**
 * v1.3 Crop & Shape panel.
 *
 * Top half: canvas presets + resize mode selector (canvas-only / center / scale).
 * Per spec: "Preset changes should only change canvas size by default and
 * should not repeatedly scale existing content." — so applyPreset always calls
 * applyResize(preset.width, preset.height, 'keep') regardless of the picker;
 * the picker only affects custom width/height resizes.
 *
 * Bottom half: image tools acting on the active image — Fit / Fill / Center,
 * rotate ±90, flip X/Y, straighten slider -45..45.
 *
 * Mobile-safe: full width on small screens, fixed 320px column on >= md.
 */
export default function CropResizePanel({ onClose }) {
  const { canvas, fitToScreen } = useEditor();
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const showToast = useEditorStore((s) => s.showToast);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectionVersion = useEditorStore((s) => s.selectionVersion);

  const [mode, setMode] = useState('keep');
  const [customW, setCustomW] = useState(1080);
  const [customH, setCustomH] = useState(1080);

  const active = canvas ? canvas.getActiveObject() : null;
  const image = isImageObject(active) ? active : null;

  // Straighten slider mirrors the selected image's angle (clamped to -45..45).
  const [straighten, setStraighten] = useState(0);

  useEffect(() => {
    if (!image) {
      setStraighten(0);
      return;
    }
    const a = image.angle || 0;
    // Map angle (mod 360) to a -45..45 micro-tilt for the slider UI.
    const norm = ((a + 180) % 360) - 180;
    const clamped = Math.max(-45, Math.min(45, norm));
    setStraighten(clamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(','), selectionVersion, image && image.__uid]);

  const currentW = canvas ? canvas.getWidth() : 0;
  const currentH = canvas ? canvas.getHeight() : 0;

  function applyResize(w, h, m = mode) {
    if (!canvas) return;
    resizeCanvas(canvas, w, h, m);
    setCanvasSize({ width: canvas.getWidth(), height: canvas.getHeight() });
    setTimeout(() => fitToScreen && fitToScreen(), 30);
  }

  function applyPreset(p) {
    // Spec: presets only change canvas size; don't repeatedly scale content.
    applyResize(p.width, p.height, 'keep');
    showToast({ type: 'success', message: `Canvas set to ${p.label} (${p.width}×${p.height}).` });
  }

  function applyCustom() {
    const w = Math.max(50, Math.min(8000, Math.round(customW || 0)));
    const h = Math.max(50, Math.min(8000, Math.round(customH || 0)));
    if (!w || !h) return;
    applyResize(w, h, mode);
    showToast({ type: 'success', message: `Canvas set to ${w}×${h}.` });
  }

  function onStraighten(v) {
    setStraighten(v);
    if (image && canvas) setObjectAngle(canvas, image, v);
  }

  const presetActive = (p) => p.width === currentW && p.height === currentH;

  return (
    <aside className="w-full md:w-80 md:shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll text-surface-900 dark:text-surface-50">
      <PanelHeader title="Crop & Shape" subtitle={`Canvas ${currentW}×${currentH}`} onClose={onClose} />

      <div className="p-3 space-y-4">
        {/* Canvas presets */}
        <Section title="Canvas presets">
          <div className="grid grid-cols-2 gap-2">
            {CANVAS_PRESETS.map((p) => (
              <PresetCard key={p.id} preset={p} active={presetActive(p)} onClick={() => applyPreset(p)} />
            ))}
          </div>
        </Section>

        {/* Custom size */}
        <Section title="Custom size">
          <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <NumberInput label="Width" value={customW} onChange={setCustomW} />
              <NumberInput label="Height" value={customH} onChange={setCustomH} />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Content mode</div>
              <div className="space-y-1.5">
                {RESIZE_MODES.map((rm) => (
                  <label
                    key={rm.id}
                    className={`flex gap-2 items-start rounded-md border px-2 py-1.5 cursor-pointer ${
                      mode === rm.id
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                        : 'border-surface-200 bg-white hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resize-mode"
                      value={rm.id}
                      checked={mode === rm.id}
                      onChange={() => setMode(rm.id)}
                      className="mt-0.5 accent-blue-500"
                    />
                    <span className="text-xs">
                      <span className="font-medium text-surface-900 dark:text-surface-50 block">{rm.label}</span>
                      <span className="text-surface-600 dark:text-surface-300 leading-snug">{rm.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={applyCustom}
              className="w-full rounded-md bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-medium"
            >
              Apply size
            </button>
          </div>
        </Section>

        {/* Image tools */}
        <Section title="Selected image">
          {!image ? (
            <div className="rounded-lg border border-dashed border-surface-300 dark:border-surface-700 px-3 py-4 text-center text-xs text-surface-600 dark:text-surface-300">
              Select an image on the canvas to fit, fill, rotate, flip, or straighten it.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <ToolButton label="Fit" icon="fit" onClick={() => { fitObjectToCanvas(canvas, image); }} />
                <ToolButton label="Fill" icon="image" onClick={() => { fillObjectToCanvas(canvas, image); }} />
                <ToolButton label="Center" icon="alignCenter" onClick={() => { centerObject(canvas, image); }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ToolButton label="Rotate -90°" icon="refresh" onClick={() => rotateObject(canvas, image, -90)} />
                <ToolButton label="Rotate +90°" icon="refresh" onClick={() => rotateObject(canvas, image, 90)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ToolButton label="Flip X" icon="arrow" onClick={() => flipObject(canvas, image, 'x')} />
                <ToolButton label="Flip Y" icon="arrow" onClick={() => flipObject(canvas, image, 'y')} />
              </div>

              <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-200">Straighten</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs tabular-nums text-surface-600 dark:text-surface-300 w-12 text-right">{straighten.toFixed(0)}°</span>
                    <button
                      onClick={() => onStraighten(0)}
                      className="text-[11px] text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={-45}
                  max={45}
                  step={1}
                  value={straighten}
                  onChange={(e) => onStraighten(parseFloat(e.target.value))}
                  className="w-full mt-1 accent-blue-500"
                />
              </div>
            </div>
          )}
        </Section>

        <div className="h-2" />
      </div>
    </aside>
  );
}

function PanelHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-surface-50 dark:bg-surface-950 z-10">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{title}</div>
        {subtitle && <div className="text-xs text-surface-600 dark:text-surface-300 mt-0.5">{subtitle}</div>}
      </div>
      {onClose && (
        <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close panel">
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PresetCard({ preset, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'rounded-lg border-2 px-3 py-2 text-left transition-colors border-blue-500 bg-blue-50 text-surface-900 dark:border-blue-400 dark:bg-blue-950/40 dark:text-surface-50'
          : 'rounded-lg border px-3 py-2 text-left transition-colors border-surface-200 bg-white text-surface-900 hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30'
      }
    >
      <div className="text-xs font-medium truncate">{preset.label}</div>
      <div className="text-[11px] text-surface-600 dark:text-surface-300 mt-0.5">
        {preset.width}×{preset.height} · {preset.hint}
      </div>
    </button>
  );
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">{label}</span>
      <input
        type="number"
        min={50}
        max={8000}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="mt-1 w-full rounded-md border border-surface-200 bg-white text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50 px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:border-blue-500"
      />
    </label>
  );
}

function ToolButton({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-surface-200 bg-white text-surface-900 hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 px-2 py-2 text-xs font-medium flex items-center justify-center gap-1.5"
    >
      <Icon name={icon} size={12} />
      {label}
    </button>
  );
}
