import { fabric } from './fabricSetup.js';

export const FILTER_DEFAULTS = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  pixelate: 0,
  grayscale: false,
  sepia: false,
  invert: false
};

export const FILTER_PRESETS = [
  {
    id: 'clean',
    name: 'Clean',
    description: 'Subtle product-friendly enhancement',
    values: { brightness: 0.04, contrast: 0.08, saturation: 0.06, blur: 0, pixelate: 0, grayscale: false, sepia: false, invert: false }
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Soft warm editorial tone',
    values: { brightness: 0.05, contrast: 0.06, saturation: 0.14, blur: 0, pixelate: 0, grayscale: false, sepia: true, invert: false }
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Cooler modern product look',
    values: { brightness: 0.02, contrast: 0.08, saturation: -0.05, blur: 0, pixelate: 0, grayscale: false, sepia: false, invert: false }
  },
  {
    id: 'mono',
    name: 'Mono',
    description: 'Black and white',
    values: { brightness: 0.02, contrast: 0.12, saturation: 0, blur: 0, pixelate: 0, grayscale: true, sepia: false, invert: false }
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Light and soft visual tone',
    values: { brightness: 0.08, contrast: -0.08, saturation: 0.02, blur: 0.02, pixelate: 0, grayscale: false, sepia: false, invert: false }
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Sharp contrast for banners',
    values: { brightness: 0, contrast: 0.22, saturation: 0.08, blur: 0, pixelate: 0, grayscale: false, sepia: false, invert: false }
  },
  {
    id: 'product-boost',
    name: 'Product Boost',
    description: 'Better product image clarity',
    values: { brightness: 0.06, contrast: 0.16, saturation: 0.1, blur: 0, pixelate: 0, grayscale: false, sepia: false, invert: false }
  }
];

export function isImageObject(obj) {
  return !!obj && obj.type === 'image';
}

export function normalizeFilterValues(values = {}) {
  return {
    ...FILTER_DEFAULTS,
    ...values,
    brightness: clampNumber(values.brightness ?? FILTER_DEFAULTS.brightness, -1, 1),
    contrast: clampNumber(values.contrast ?? FILTER_DEFAULTS.contrast, -1, 1),
    saturation: clampNumber(values.saturation ?? FILTER_DEFAULTS.saturation, -1, 1),
    blur: clampNumber(values.blur ?? FILTER_DEFAULTS.blur, 0, 1),
    pixelate: Math.max(0, Math.round(Number(values.pixelate ?? FILTER_DEFAULTS.pixelate) || 0)),
    grayscale: !!values.grayscale,
    sepia: !!values.sepia,
    invert: !!values.invert
  };
}

export function getImageFilterState(image) {
  if (!isImageObject(image)) return { ...FILTER_DEFAULTS };
  return normalizeFilterValues(image.__filterState || FILTER_DEFAULTS);
}

export function applyImageFilters(canvas, image, values = {}) {
  if (!canvas || !isImageObject(image)) return;

  const state = normalizeFilterValues(values);
  const filters = [];

  if (state.brightness !== 0 && fabric.Image.filters.Brightness) {
    filters.push(new fabric.Image.filters.Brightness({ brightness: state.brightness }));
  }

  if (state.contrast !== 0 && fabric.Image.filters.Contrast) {
    filters.push(new fabric.Image.filters.Contrast({ contrast: state.contrast }));
  }

  if (state.saturation !== 0 && fabric.Image.filters.Saturation) {
    filters.push(new fabric.Image.filters.Saturation({ saturation: state.saturation }));
  }

  if (state.blur > 0 && fabric.Image.filters.Blur) {
    filters.push(new fabric.Image.filters.Blur({ blur: state.blur }));
  }

  if (state.grayscale && fabric.Image.filters.Grayscale) {
    filters.push(new fabric.Image.filters.Grayscale());
  }

  if (state.sepia && fabric.Image.filters.Sepia) {
    filters.push(new fabric.Image.filters.Sepia());
  }

  if (state.invert && fabric.Image.filters.Invert) {
    filters.push(new fabric.Image.filters.Invert());
  }

  if (state.pixelate > 0 && fabric.Image.filters.Pixelate) {
    filters.push(new fabric.Image.filters.Pixelate({ blocksize: state.pixelate }));
  }

  image.filters = filters;
  image.__filterState = state;
  image.applyFilters();

  image.dirty = true;
  canvas.fire('object:modified', { target: image });
  canvas.requestRenderAll();
}

export function resetImageFilters(canvas, image) {
  if (!canvas || !isImageObject(image)) return;

  image.filters = [];
  image.__filterState = { ...FILTER_DEFAULTS };
  image.applyFilters();

  image.dirty = true;
  canvas.fire('object:modified', { target: image });
  canvas.requestRenderAll();
}

export function applyPreset(canvas, image, presetId) {
  const preset = FILTER_PRESETS.find((p) => p.id === presetId);
  if (!preset) return;

  applyImageFilters(canvas, image, preset.values);
}

function clampNumber(value, min, max) {
  const n = Number(value);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}