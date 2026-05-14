import { fabric } from './fabricSetup.js';

/**
 * v1.2 Photo Adjustments — Fabric.js image filter helpers.
 *
 * Fabric.js's filter classes differ slightly between versions (e.g. v3 vs v5,
 * webgl backend availability, etc.). Every helper in this file is defensive:
 * missing filter constructors are simply skipped instead of throwing.
 *
 * Each image carries an `__filterState` object that mirrors the slider /
 * preset values currently applied. The UI panel reads this back so the
 * controls stay in sync with the actual canvas state across selections.
 */

export const FILTER_DEFAULTS = {
  // Slider values are unit-less and mapped per-filter inside applyImageFilters.
  brightness: 0,   // -100 .. 100
  contrast: 0,     // -100 .. 100
  saturation: 0,   // -100 .. 100
  blur: 0,         // 0 .. 100
  pixelate: 0,     // 0 .. 100 (mapped to a fabric blocksize 2..40)
  // Toggles
  grayscale: false,
  sepia: false,
  invert: false
};

export const FILTER_PRESETS = [
  { id: 'original',     label: 'Original',      state: { ...FILTER_DEFAULTS } },
  { id: 'warm',         label: 'Warm',          state: { ...FILTER_DEFAULTS, brightness: 6, contrast: 8, saturation: 18 } },
  { id: 'cool',         label: 'Cool',          state: { ...FILTER_DEFAULTS, brightness: 2, contrast: 6, saturation: -10 } },
  { id: 'high-contrast',label: 'High Contrast', state: { ...FILTER_DEFAULTS, contrast: 40, saturation: 10 } },
  { id: 'soft',         label: 'Soft',          state: { ...FILTER_DEFAULTS, brightness: 4, contrast: -8, blur: 4 } },
  { id: 'mono',         label: 'Mono',          state: { ...FILTER_DEFAULTS, contrast: 12, grayscale: true } }
];

export function isImageObject(obj) {
  return !!(obj && obj.type === 'image' && typeof obj.applyFilters === 'function');
}

export function getImageFilterState(obj) {
  if (!isImageObject(obj)) return { ...FILTER_DEFAULTS };
  return { ...FILTER_DEFAULTS, ...(obj.__filterState || {}) };
}

/**
 * Replace the filters array of a Fabric image based on a target state.
 * Fires `object:modified` so history and panels refresh.
 */
export function applyImageFilters(canvas, obj, partial = {}) {
  if (!isImageObject(obj)) return getImageFilterState(obj);
  const next = { ...getImageFilterState(obj), ...partial };
  const filters = buildFiltersFromState(next);
  obj.filters = filters;
  try {
    obj.applyFilters();
  } catch (err) {
    // Some Fabric builds can throw if the WebGL backend can't allocate a
    // texture for very large images. Swallow and continue — the image is
    // still rendered without filters.
    // eslint-disable-next-line no-console
    console.warn('applyFilters failed:', err && err.message);
  }
  obj.__filterState = next;
  obj.setCoords();
  if (canvas) {
    canvas.fire('object:modified', { target: obj });
    canvas.requestRenderAll();
  }
  return next;
}

export function applyPreset(canvas, obj, presetId) {
  const preset = FILTER_PRESETS.find((p) => p.id === presetId);
  if (!preset) return getImageFilterState(obj);
  return applyImageFilters(canvas, obj, preset.state);
}

export function resetImageFilters(canvas, obj) {
  return applyImageFilters(canvas, obj, FILTER_DEFAULTS);
}

/* ------------------------------------------------------------------ */
/* Internal helpers                                                    */
/* ------------------------------------------------------------------ */

function buildFiltersFromState(state) {
  const F = fabric.Image && fabric.Image.filters;
  if (!F) return [];
  const list = [];

  const push = (Ctor, opts) => {
    if (!Ctor) return;
    try { list.push(new Ctor(opts)); } catch {}
  };

  // Slider filters — only added when their value is non-default so the
  // filter pipeline stays short.
  if (state.brightness) {
    push(F.Brightness, { brightness: clamp(state.brightness / 100, -1, 1) });
  }
  if (state.contrast) {
    push(F.Contrast, { contrast: clamp(state.contrast / 100, -1, 1) });
  }
  if (state.saturation) {
    push(F.Saturation, { saturation: clamp(state.saturation / 100, -1, 1) });
  }
  if (state.blur) {
    // Fabric Blur expects a 0..1 value
    push(F.Blur, { blur: clamp(state.blur / 100, 0, 1) });
  }
  if (state.pixelate) {
    // Map 1..100 -> blocksize 2..40 for a usable range
    const blocksize = Math.max(2, Math.round(2 + (state.pixelate / 100) * 38));
    push(F.Pixelate, { blocksize });
  }

  // Toggles
  if (state.grayscale) push(F.Grayscale, {});
  if (state.sepia)     push(F.Sepia, {});
  if (state.invert)    push(F.Invert, {});

  return list;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
