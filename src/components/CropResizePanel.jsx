import { useMemo, useState } from 'react';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  CANVAS_PRESETS,
  centerObject,
  fillObjectToCanvas,
  fitObjectToCanvas,
  flipObject,
  isImageObject,
  resizeCanvas,
  rotateObject,
  setObjectAngle
} from '../editor/cropResizeActions.js';

const T = {
  title: 'Crop / Resize',
  subtitle: 'Resize the canvas and quickly fit, fill, rotate, or flip the selected image.',
  canvasSize: 'Canvas size',
  presets: 'Aspect presets',
  selectedImage: 'Selected image',
  noImage: 'Select an image to use image fit, fill, rotate, and flip tools.',
  width: 'Width',
  height: 'Height',
  applyKeep: 'Resize canvas',
  applyCenter: 'Resize + center content',
  applyScale: 'Resize + scale content',
  fit: 'Fit to canvas',
  fill: 'Fill canvas',
  center: 'Center',
  rotateLeft: 'Rotate -90°',
  rotateRight: 'Rotate +90°',
  flipX: 'Flip horizontal',
  flipY: 'Flip vertical',
  angle: 'Straighten / angle',
  close: 'Close'
};

export default function CropResizePanel({ onClose }) {
  const { canvas } = useEditor();
  const showToast = useEditorStore((s) => s.showToast);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectionVersion = useEditorStore((s) => s.selectionVersion);

  const selectedImage = useMemo(() => {
    if (!canvas) return null;
    const obj = canvas.getActiveObject();
    return isImageObject(obj) ? obj : null;
  }, [canvas, selectedIds, selectionVersion]);

  const [width, setWidth] = useState(() => canvas?.getWidth?.() || 1080);
  const [height, setHeight] = useState(() => canvas?.getHeight?.() || 1080);
  const [angle, setAngle] = useState(0);

  function applyResize(mode) {
    if (!canvas) return;

    const w = Math.max(50, Math.round(Number(width) || 1080));
    const h = Math.max(50, Math.round(Number(height) || 1080));

    resizeCanvas(canvas, w, h, mode);
    setWidth(w);
    setHeight(h);
    showToast?.({ type: 'success', message: 'Canvas resized.' });
  }

  function applyPreset(preset, mode = 'keep') {
    if (!canvas) return;

    setWidth(preset.width);
    setHeight(preset.height);
    resizeCanvas(canvas, preset.width, preset.height, mode);
    showToast?.({ type: 'success', message: `${preset.name} applied.` });
  }

  function withImage(fn, message) {
    if (!canvas || !selectedImage) return;
    fn();
    showToast?.({ type: 'success', message });
  }

  function onAngleChange(value) {
    setAngle(value);
    if (!canvas || !selectedImage) return;
    setObjectAngle(canvas, selectedImage, value);
  }

  return (
    <aside className="w-80 shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll">
      <div className="sticky top-0 z-10 border-b border-surface-200 bg-surface-50/95 px-4 py-4 backdrop-blur dark:border-surface-800 dark:bg-surface-950/95">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-surface-950 dark:text-surface-50">{T.title}</h2>
            <p className="mt-1 text-xs leading-5 text-surface-500 dark:text-surface-400">{T.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            {T.close}
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {T.canvasSize}
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-surface-500">{T.width}</span>
              <input
                type="number"
                min="50"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-900"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-surface-500">{T.height}</span>
              <input
                type="number"
                min="50"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-800 dark:bg-surface-900"
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <button type="button" onClick={() => applyResize('keep')} className="panel-btn">
              {T.applyKeep}
            </button>
            <button type="button" onClick={() => applyResize('center-content')} className="panel-btn">
              {T.applyCenter}
            </button>
            <button type="button" onClick={() => applyResize('scale-content')} className="panel-btn-primary">
              {T.applyScale}
            </button>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {T.presets}
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {CANVAS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset, 'scale-content')}
                className="rounded-xl border border-surface-200 bg-white p-3 text-left hover:border-blue-400 hover:bg-blue-50 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">{preset.name}</span>
                  <span className="rounded-md bg-surface-100 px-2 py-0.5 text-xs text-surface-500 dark:bg-surface-800">
                    {preset.ratio}
                  </span>
                </div>
                <div className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                  {preset.width} × {preset.height}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
            {T.selectedImage}
          </h3>

          {!selectedImage ? (
            <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-4 text-sm leading-6 text-surface-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400">
              {T.noImage}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => withImage(() => fitObjectToCanvas(canvas, selectedImage, 0), 'Image fitted to canvas.')}
                  className="panel-btn-primary"
                >
                  {T.fit}
                </button>

                <button
                  type="button"
                  onClick={() => withImage(() => fillObjectToCanvas(canvas, selectedImage), 'Image filled canvas.')}
                  className="panel-btn-primary"
                >
                  {T.fill}
                </button>

                <button
                  type="button"
                  onClick={() => withImage(() => centerObject(canvas, selectedImage), 'Image centered.')}
                  className="panel-btn"
                >
                  {T.center}
                </button>

                <button
                  type="button"
                  onClick={() => withImage(() => rotateObject(canvas, selectedImage, 90), 'Image rotated.')}
                  className="panel-btn"
                >
                  {T.rotateRight}
                </button>

                <button
                  type="button"
                  onClick={() => withImage(() => rotateObject(canvas, selectedImage, -90), 'Image rotated.')}
                  className="panel-btn"
                >
                  {T.rotateLeft}
                </button>

                <button
                  type="button"
                  onClick={() => withImage(() => flipObject(canvas, selectedImage, 'x'), 'Image flipped.')}
                  className="panel-btn"
                >
                  {T.flipX}
                </button>

                <button
                  type="button"
                  onClick={() => withImage(() => flipObject(canvas, selectedImage, 'y'), 'Image flipped.')}
                  className="panel-btn"
                >
                  {T.flipY}
                </button>
              </div>

              <label className="block">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-200">{T.angle}</span>
                  <span className="rounded-md bg-surface-100 px-2 py-0.5 text-xs tabular-nums text-surface-500 dark:bg-surface-800">
                    {angle}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={angle}
                  onChange={(e) => onAngleChange(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </label>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}