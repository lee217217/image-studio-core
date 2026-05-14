import { KODAK_PACK } from './kodakPack.js';
import { FUJI_PACK } from './fujiPack.js';
import { applyImageFilters, isImageObject, FILTER_DEFAULTS } from '../imageFilters.js';

export const FILM_PACKS = [KODAK_PACK, FUJI_PACK];

export function getAllPresets() {
  return FILM_PACKS.flatMap((p) =>
    p.presets.map((preset) => ({ ...preset, pack: p.id, packName: p.name }))
  );
}

export function getPresetById(id) {
  for (const pack of FILM_PACKS) {
    const found = pack.presets.find((p) => p.id === id);
    if (found) return { ...found, pack: pack.id, packName: pack.name };
  }
  return null;
}

/**
 * Convert a preset's compact 0..1-ish numbers into the -100..100 sliders used
 * by FILTER_DEFAULTS. Booleans and the colorMatrix pass through unchanged.
 */
function presetToFilterState(preset) {
  const scale = (v) => (typeof v === 'number' ? Math.round(v * 100) : 0);
  return {
    ...FILTER_DEFAULTS,
    brightness: scale(preset.brightness),
    contrast: scale(preset.contrast),
    saturation: preset.saturation === -1 ? -100 : scale(preset.saturation),
    vibrance: scale(preset.vibrance),
    hue: typeof preset.hue === 'number' ? preset.hue : 0,
    gamma: typeof preset.gamma === 'number' ? preset.gamma : 1,
    blur: scale(preset.blur),
    noise: scale(preset.noise),
    pixelate: scale(preset.pixelate),
    grayscale: !!preset.grayscale,
    sepia: !!preset.sepia,
    invert: !!preset.invert,
    colorMatrix: preset.colorMatrix || null,
  };
}

/**
 * Apply a film preset to the currently selected images, or fall back to every image
 * on the canvas if none are selected. Returns true if anything was applied.
 */
export function applyFilmPreset(canvas, presetId) {
  if (!canvas) return false;
  const preset = getPresetById(presetId);
  if (!preset) return false;
  const selected = canvas.getActiveObjects().filter(isImageObject);
  const list = selected.length ? selected : canvas.getObjects().filter(isImageObject);
  if (!list.length) return false;
  const nextState = presetToFilterState(preset);
  list.forEach((obj) => {
    applyImageFilters(canvas, obj, { ...nextState, __filmPresetId: presetId });
  });
  canvas.requestRenderAll();
  return true;
}

/** Get the currently active film preset id from the first selected image (if any). */
export function getActiveFilmPreset(canvas) {
  if (!canvas) return null;
  const selected = canvas.getActiveObjects().filter(isImageObject);
  const target = selected[0] || canvas.getObjects().filter(isImageObject)[0];
  if (!target || !target.__filterState) return null;
  return target.__filterState.__filmPresetId || null;
}
