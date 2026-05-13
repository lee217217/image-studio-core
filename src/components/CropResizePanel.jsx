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
  subtitle: 'Choose a format, resize the canvas, then fit or fill your selected image.',
  format: 'Format',
  customSize: 'Custom size',
  resizeMode: 'Resize mode',
  selectedImage: 'Selected image',
  noImage: 'Select an image on the canvas to use image tools.',
  width: 'Width',
  height: 'Height',
  keep: 'Canvas only',
  centerContent: 'Center content',
  scaleContent: 'Scale content',
  apply: 'Apply size',
  fit: 'Fit',
  fill: 'Fill',
  center: 'Center',
  rotateLeft: '-90°',
  rotateRight: '+90°',
  flipX: 'Flip X',
  flipY: 'Flip Y',
  angle: 'Straighten',
  close: 'Close'
};

const MODE_OPTIONS = [
  { id: 'keep', label: T.keep, description: 'Resize only' },
  { id: 'center-content', label: T.centerContent, description: 'Move content' },
  { id: 'scale-content', label: T.scaleContent, description: 'Best for presets' }
];

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
  const [mode, setMode] = useState('scale-content');
  const [angle, setAngle] = useState(0);
  const [activePreset, setActivePreset] = useState(null);

  function applyResize(nextWidth = width, nextHeight = height, nextMode = mode) {
    if (!canvas) return;

    const w = Math.max(50, Math.round(Number(nextWidth) || 1080));
    const h = Math.max(50, Math.round(Number(nextHeight) || 1080));

    resizeCanvas(canvas, w, h, nextMode);
    setWidth(w);
    setHeight(h);

    showToast?.({ type: 'success', message: 'Canvas resized.' });
  }

  function applyPreset(preset) {
    setActivePreset(preset.id);
    setWidth(preset.width);
    setHeight(preset.height);
    applyResize(preset.width, preset.height, mode);
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
            <h2 className="text-sm font-semibold text-surface-950 dark:text-surface-50">
              {T.title}
            </h2>
            <p className="mt-1 text-xs leading-5 text-surface-500 dark:text-surface-400">
              {T.subtitle}
            </p>
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
        <PanelSection title={T.format}>
          <div className="grid grid-cols-2 gap-2">
            {CANVAS_PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                active={activePreset === preset.id}
                onClick={() => applyPreset(preset)}
              />
            ))}
          </div>
        </PanelSection>

        <PanelSection title={T.customSize}>
          <div className="rounded-2xl border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900">
            <div className="grid grid-cols-2 gap-2">
              <NumberField label={T.width} value={width} onChange={setWidth} />
              <NumberField label={T.height} value={height} onChange={setHeight} />
            </div>

            <button
              type="button"
              onClick={() => applyResize()}
              className="mt-3 w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {T.apply}
            </button>
          </div>
        </PanelSection>

        <PanelSection title={T.resizeMode}>
          <div className="grid grid-cols-1 gap-2">
            {MODE_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={[
                  'rounded-xl border px-3 py-2 text-left transition',
                  mode === item.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200'
                    : 'border-surface-200 bg-white text-surface-700 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:bg-surface-800'
                ].join(' ')}
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="mt-0.5 text-[11px] opacity-70">{item.description}</div>
              </button>
            ))}
          </div>
        </PanelSection>

        <PanelSection title={T.selectedImage}>
          {!selectedImage ? (
            <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-4 text-sm leading-6 text-surface-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400">
              {T.noImage}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <ToolCard
                  label={T.fit}
                  icon="▣"
                  description="Show full image"
                  primary
                  onClick={() => withImage(() => fitObjectToCanvas(canvas, selectedImage, 0), 'Image fitted.')}
                />
                <ToolCard
                  label={T.fill}
                  icon="▤"
                  description="Cover canvas"
                  primary
                  onClick={() => withImage(() => fillObjectToCanvas(canvas, selectedImage), 'Image filled.')}
                />
                <ToolCard
                  label={T.center}
                  icon="◎"
                  description="Move to center"
                  onClick={() => withImage(() => centerObject(canvas, selectedImage), 'Image centered.')}
                />
                <ToolCard
                  label={T.rotateRight}
                  icon="↻"
                  description="Rotate right"
                  onClick={() => withImage(() => rotateObject(canvas, selectedImage, 90), 'Image rotated.')}
                />
                <ToolCard
                  label={T.rotateLeft}
                  icon="↺"
                  description="Rotate left"
                  onClick={() => withImage(() => rotateObject(canvas, selectedImage, -90), 'Image rotated.')}
                />
                <ToolCard
                  label={T.flipX}
                  icon="⇄"
                  description="Mirror"
                  onClick={() => withImage(() => flipObject(canvas, selectedImage, 'x'), 'Image flipped.')}
                />
                <ToolCard
                  label={T.flipY}
                  icon="⇅"
                  description="Vertical"
                  onClick={() => withImage(() => flipObject(canvas, selectedImage, 'y'), 'Image flipped.')}
                />
              </div>

              <div className="rounded-2xl border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                    {T.angle}
                  </span>
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
              </div>
            </div>
          )}
        </PanelSection>
      </div>
    </aside>
  );
}

function PanelSection({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-surface-500 dark:text-surface-400">
        {label}
      </span>
      <input
        type="number"
        min="50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 outline-none focus:border-blue-500 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-50"
      />
    </label>
  );
}

function PresetCard({ preset, active, onClick }) {
  const preview = getRatioPreview(preset.width, preset.height);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-2xl border p-3 text-left transition',
        active
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
          : 'border-surface-200 bg-white hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/30'
      ].join(' ')}
    >
      <div className="mb-3 flex h-16 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800">
        <div
          className="rounded-md border-2 border-blue-500 bg-white shadow-sm dark:bg-surface-950"
          style={{
            width: preview.width,
            height: preview.height
          }}
        />
      </div>

      <div className="text-xs font-semibold leading-4 text-surface-900 dark:text-surface-50">
        {preset.name}
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-surface-500 dark:text-surface-400">
        <span>{preset.ratio}</span>
        <span>{preset.width}×{preset.height}</span>
      </div>
    </button>
  );
}

function ToolCard({ label, icon, description, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-2xl border p-3 text-left transition',
        primary
          ? 'border-blue-500 bg-blue-600 text-white hover:bg-blue-700'
          : 'border-surface-200 bg-white text-surface-800 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:hover:bg-surface-800'
      ].join(' ')}
    >
      <div className="mb-2 text-2xl leading-none">{icon}</div>
      <div className="text-sm font-semibold">{label}</div>
      <div className={primary ? 'mt-0.5 text-[11px] text-blue-100' : 'mt-0.5 text-[11px] text-surface-500 dark:text-surface-400'}>
        {description}
      </div>
    </button>
  );
}

function getRatioPreview(width, height) {
  const maxW = 64;
  const maxH = 48;
  const ratio = width / height;

  if (ratio >= maxW / maxH) {
    return {
      width: maxW,
      height: Math.max(18, Math.round(maxW / ratio))
    };
  }

  return {
    width: Math.max(18, Math.round(maxH * ratio)),
    height: maxH
  };
}