import { fabric } from './fabricSetup.js';

/**
 * v1.4 Style & Layer Effects — opacity, blend mode, shadow, stroke, glow.
 *
 * Every helper:
 *   - operates on whatever Fabric object is passed in,
 *   - mirrors the chosen state onto `obj.__styleState` so the panel UI can
 *     read back what is currently applied,
 *   - finishes with obj.setCoords + canvas.fire('object:modified') +
 *     canvas.requestRenderAll() so the history manager and Layers panel
 *     stay in sync.
 *
 * Image objects get a reduced subset (shadow/opacity/blend) — Fabric strokes
 * applied to images don't render reliably across versions, so we skip stroke
 * for images per spec.
 */

const DEFAULT_STATE = {
  opacity: 1,
  blendMode: 'source-over',
  shadow: { enabled: false, color: '#000000', blur: 12, offsetX: 4, offsetY: 4 },
  stroke:  { enabled: false, color: '#111827', width: 2 },
  glow:    { enabled: false, color: '#60a5fa', blur: 24 }
};

export function getActiveObject(canvas) {
  return canvas ? canvas.getActiveObject() : null;
}

export function isImageObject(obj) {
  return !!(obj && obj.type === 'image');
}

export function getObjectStyleState(obj) {
  if (!obj) return { ...DEFAULT_STATE, shadow: { ...DEFAULT_STATE.shadow }, stroke: { ...DEFAULT_STATE.stroke }, glow: { ...DEFAULT_STATE.glow } };
  if (!obj.__styleState) {
    // Reconstruct best-effort from the current object so panels open with
    // accurate values even for objects created before v1.4.
    obj.__styleState = {
      opacity: typeof obj.opacity === 'number' ? obj.opacity : 1,
      blendMode: obj.globalCompositeOperation || 'source-over',
      shadow: { ...DEFAULT_STATE.shadow, enabled: !!obj.shadow },
      stroke: {
        enabled: !!(obj.stroke && obj.strokeWidth),
        color: obj.stroke || DEFAULT_STATE.stroke.color,
        width: obj.strokeWidth || DEFAULT_STATE.stroke.width
      },
      glow: { ...DEFAULT_STATE.glow }
    };
  }
  // Return a shallow clone so callers can't mutate internal state by accident.
  const s = obj.__styleState;
  return {
    opacity: s.opacity,
    blendMode: s.blendMode,
    shadow: { ...s.shadow },
    stroke: { ...s.stroke },
    glow:   { ...s.glow }
  };
}

function commit(canvas, obj) {
  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function applyOpacity(canvas, obj, value) {
  if (!canvas || !obj) return;
  const v = Math.max(0, Math.min(1, value));
  obj.set({ opacity: v });
  const st = getObjectStyleState(obj);
  st.opacity = v;
  obj.__styleState = st;
  commit(canvas, obj);
}

export function applyBlendMode(canvas, obj, mode) {
  if (!canvas || !obj) return;
  obj.set({ globalCompositeOperation: mode });
  const st = getObjectStyleState(obj);
  st.blendMode = mode;
  obj.__styleState = st;
  commit(canvas, obj);
}

function makeShadow(color, blur, offsetX, offsetY) {
  try {
    return new fabric.Shadow({ color, blur, offsetX, offsetY });
  } catch {
    // Some Fabric builds expect a string shadow spec — fall back gracefully.
    return `${color} ${offsetX}px ${offsetY}px ${blur}px`;
  }
}

export function applyShadow(canvas, obj, { color, blur, offsetX, offsetY }) {
  if (!canvas || !obj) return;
  const st = getObjectStyleState(obj);
  const next = {
    enabled: true,
    color: color ?? st.shadow.color,
    blur:  blur  ?? st.shadow.blur,
    offsetX: offsetX ?? st.shadow.offsetX,
    offsetY: offsetY ?? st.shadow.offsetY
  };
  obj.set({ shadow: makeShadow(next.color, next.blur, next.offsetX, next.offsetY) });
  st.shadow = next;
  obj.__styleState = st;
  commit(canvas, obj);
}

export function clearShadow(canvas, obj) {
  if (!canvas || !obj) return;
  obj.set({ shadow: null });
  const st = getObjectStyleState(obj);
  st.shadow = { ...st.shadow, enabled: false };
  obj.__styleState = st;
  commit(canvas, obj);
}

export function applyStroke(canvas, obj, { color, width }) {
  if (!canvas || !obj) return;
  if (isImageObject(obj)) return; // images: skip stroke per spec
  const st = getObjectStyleState(obj);
  const next = {
    enabled: true,
    color: color ?? st.stroke.color,
    width: width ?? st.stroke.width
  };
  obj.set({ stroke: next.color, strokeWidth: next.width, strokeUniform: true });
  st.stroke = next;
  obj.__styleState = st;
  commit(canvas, obj);
}

export function clearStroke(canvas, obj) {
  if (!canvas || !obj) return;
  obj.set({ stroke: null, strokeWidth: 0 });
  const st = getObjectStyleState(obj);
  st.stroke = { ...st.stroke, enabled: false };
  obj.__styleState = st;
  commit(canvas, obj);
}

export function applyGlow(canvas, obj, { color, blur } = {}) {
  // Glow is implemented as a colored, zero-offset shadow with extra blur.
  if (!canvas || !obj) return;
  const st = getObjectStyleState(obj);
  const next = {
    enabled: true,
    color: color ?? st.glow.color,
    blur:  blur  ?? st.glow.blur
  };
  obj.set({ shadow: makeShadow(next.color, next.blur, 0, 0) });
  st.glow = next;
  // Glow takes over the shadow slot — mark shadow as off so the UI doesn't
  // double-toggle.
  st.shadow = { ...st.shadow, enabled: false };
  obj.__styleState = st;
  commit(canvas, obj);
}

export const STYLE_PRESETS = [
  { id: 'clean',        label: 'Clean' },
  { id: 'soft-shadow',  label: 'Soft Shadow' },
  { id: 'product-glow', label: 'Product Glow' },
  { id: 'dark-floating',label: 'Dark Floating' },
  { id: 'outline',      label: 'Outline Sticker' }
];

export const BLEND_MODES = [
  { id: 'source-over', label: 'Normal' },
  { id: 'multiply',    label: 'Multiply' },
  { id: 'screen',      label: 'Screen' },
  { id: 'overlay',     label: 'Overlay' },
  { id: 'darken',      label: 'Darken' },
  { id: 'lighten',     label: 'Lighten' }
];

export function applyStylePreset(canvas, obj, presetId) {
  if (!canvas || !obj) return;
  // Reset before applying so presets are composable as one-shot looks.
  resetLayerStyle(canvas, obj, /* silent */ true);
  switch (presetId) {
    case 'clean':
      applyOpacity(canvas, obj, 1);
      break;
    case 'soft-shadow':
      applyOpacity(canvas, obj, 1);
      applyShadow(canvas, obj, { color: 'rgba(0,0,0,0.25)', blur: 18, offsetX: 0, offsetY: 8 });
      break;
    case 'product-glow':
      applyOpacity(canvas, obj, 1);
      applyGlow(canvas, obj, { color: 'rgba(96,165,250,0.7)', blur: 32 });
      break;
    case 'dark-floating':
      applyOpacity(canvas, obj, 0.95);
      applyShadow(canvas, obj, { color: 'rgba(0,0,0,0.55)', blur: 28, offsetX: 0, offsetY: 18 });
      break;
    case 'outline':
      applyOpacity(canvas, obj, 1);
      if (!isImageObject(obj)) {
        applyStroke(canvas, obj, { color: '#111827', width: 4 });
      } else {
        applyShadow(canvas, obj, { color: '#111827', blur: 0, offsetX: 0, offsetY: 0 });
      }
      break;
    default:
      break;
  }
}

export function resetLayerStyle(canvas, obj, silent = false) {
  if (!canvas || !obj) return;
  obj.set({
    opacity: 1,
    globalCompositeOperation: 'source-over',
    shadow: null,
    stroke: null,
    strokeWidth: 0
  });
  obj.__styleState = {
    opacity: 1,
    blendMode: 'source-over',
    shadow: { ...DEFAULT_STATE.shadow },
    stroke: { ...DEFAULT_STATE.stroke },
    glow:   { ...DEFAULT_STATE.glow }
  };
  if (!silent) commit(canvas, obj);
}
