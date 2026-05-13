import { useEffect, useMemo, useState } from 'react';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  FILTER_DEFAULTS,
  FILTER_PRESETS,
  applyImageFilters,
  applyPreset,
  getImageFilterState,
  isImageObject,
  resetImageFilters
} from '../editor/imageFilters.js';

const T = {
  title: 'Photo Adjustments',
  subtitle: 'Select an image on the canvas to edit its visual style.',
  noImage: 'Select an image to adjust brightness, contrast, saturation, blur, and filters.',
  presets: 'Presets',
  adjustments: 'Adjustments',
  effects: 'Effects',
  reset: 'Reset filters',
  brightness: 'Brightness',
  contrast: 'Contrast',
  saturation: 'Saturation',
  blur: 'Blur',
  pixelate: 'Pixelate',
  grayscale: 'Grayscale',
  sepia: 'Sepia',
  invert: 'Invert',
  close: 'Close'
};

export default function ImageAdjustPanel({ onClose }) {
  const { canvas } = useEditor();
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectionVersion = useEditorStore((s) => s.selectionVersion);
  const showToast = useEditorStore((s) => s.showToast);

  const selectedImage = useMemo(() => {
    if (!canvas) return null;
    const obj = canvas.getActiveObject();
    if (isImageObject(obj)) return obj;
    return null;
  }, [canvas, selectedIds, selectionVersion]);

  const [values, setValues] = useState(FILTER_DEFAULTS);

  useEffect(() => {
    if (!selectedImage) {
      setValues(FILTER_DEFAULTS);
      return;
    }
    setValues(getImageFilterState(selectedImage));
  }, [selectedImage, selectionVersion]);

  function updateValue(key, value) {
    if (!canvas || !selectedImage) return;

    const next = {
      ...values,
      [key]: value
    };

    setValues(next);
    applyImageFilters(canvas, selectedImage, next);
  }

  function handlePreset(presetId) {
    if (!canvas || !selectedImage) return;

    applyPreset(canvas, selectedImage, presetId);
    setValues(getImageFilterState(selectedImage));
    showToast?.({ type: 'success', message: 'Preset applied.' });
  }

  function handleReset() {
    if (!canvas || !selectedImage) return;

    resetImageFilters(canvas, selectedImage);
    setValues(FILTER_DEFAULTS);
    showToast?.({ type: 'success', message: 'Filters reset.' });
  }

  return (
    <aside className="w-full md:w-80 md:shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll">
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

      {!selectedImage ? (
        <div className="p-4">
          <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-4 text-sm leading-6 text-surface-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400">
            {T.noImage}
          </div>
        </div>
      ) : (
        <div className="space-y-5 p-4">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
              {T.presets}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {FILTER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePreset(preset.id)}
                  className="rounded-xl border border-surface-200 bg-white p-3 text-left hover:border-blue-400 hover:bg-blue-50 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
                  title={preset.description}
                >
                  <div className="text-sm font-semibold text-surface-900 dark:text-surface-50">{preset.name}</div>
                  <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-surface-500 dark:text-surface-400">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
              {T.adjustments}
            </h3>

            <Slider
              label={T.brightness}
              value={values.brightness}
              min={-1}
              max={1}
              step={0.01}
              onChange={(v) => updateValue('brightness', v)}
            />

            <Slider
              label={T.contrast}
              value={values.contrast}
              min={-1}
              max={1}
              step={0.01}
              onChange={(v) => updateValue('contrast', v)}
            />

            <Slider
              label={T.saturation}
              value={values.saturation}
              min={-1}
              max={1}
              step={0.01}
              onChange={(v) => updateValue('saturation', v)}
            />

            <Slider
              label={T.blur}
              value={values.blur}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateValue('blur', v)}
            />

            <Slider
              label={T.pixelate}
              value={values.pixelate}
              min={0}
              max={40}
              step={1}
              onChange={(v) => updateValue('pixelate', v)}
            />
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
              {T.effects}
            </h3>

            <Toggle label={T.grayscale} checked={values.grayscale} onChange={(v) => updateValue('grayscale', v)} />
            <Toggle label={T.sepia} checked={values.sepia} onChange={(v) => updateValue('sepia', v)} />
            <Toggle label={T.invert} checked={values.invert} onChange={(v) => updateValue('invert', v)} />
          </section>

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:bg-surface-800"
          >
            {T.reset}
          </button>
        </div>
      )}
    </aside>
  );
}

function Slider({ label, value, min, max, step, onChange }) {
  const displayValue = typeof value === 'number' ? value : 0;

  return (
    <label className="mb-4 block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-surface-700 dark:text-surface-200">{label}</span>
        <span className="rounded-md bg-surface-100 px-2 py-0.5 text-xs tabular-nums text-surface-500 dark:bg-surface-800 dark:text-surface-300">
          {displayValue.toFixed(step >= 1 ? 0 : 2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={(e) => onChange(step >= 1 ? Number(e.target.value) : parseFloat(e.target.value))}
        className="w-full accent-blue-600"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="mb-3 flex cursor-pointer items-center justify-between rounded-xl border border-surface-200 bg-white px-3 py-2 dark:border-surface-800 dark:bg-surface-900">
      <span className="text-sm font-medium text-surface-700 dark:text-surface-200">{label}</span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-blue-600"
      />
    </label>
  );
}