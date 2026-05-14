/**
 * v1.3 Crop & Shape — canvas-resize and image-orientation helpers.
 *
 * Two responsibilities:
 *   1. Resize the canvas to a preset (or arbitrary) size, with three
 *      content modes:
 *        - keep   : just change the canvas, don't touch objects
 *        - center : keep objects at their current scale, recenter them
 *        - scale  : uniformly scale every object so the layout fills the new
 *                   canvas proportionally
 *   2. Manipulate the currently-selected image: fit / fill / center,
 *      rotate ±90, flip X/Y, and straighten with a -45..45 slider.
 *
 * Every action ends with object:modified + requestRenderAll so undo history
 * and panels refresh.
 */

export const CANVAS_PRESETS = [
  { id: 'ig-square',   label: 'Instagram Post',      width: 1080, height: 1080, hint: '1:1' },
  { id: 'ig-portrait', label: 'Instagram Portrait',  width: 1080, height: 1350, hint: '4:5' },
  { id: 'story',       label: 'Story / Reel',        width: 1080, height: 1920, hint: '9:16' },
  { id: 'landscape',   label: 'Landscape Post',      width: 1200, height: 675,  hint: '16:9' },
  { id: 'yt-thumb',    label: 'YouTube Thumbnail',   width: 1280, height: 720,  hint: '16:9' },
  { id: 'product',     label: 'Product Card',        width: 1200, height: 1600, hint: '3:4' },
  { id: 'before-after',label: 'Before / After',      width: 1600, height: 900,  hint: '16:9' },
  { id: 'tech-sheet',  label: 'Garment Tech Sheet',  width: 1600, height: 1131, hint: 'A4 ≈ √2' }
];

export const RESIZE_MODES = [
  { id: 'keep',   label: 'Canvas only',    desc: 'Resize the canvas. Objects keep their current size and position.' },
  { id: 'center', label: 'Center content', desc: 'Keep object sizes. Recenter them inside the new canvas.' },
  { id: 'scale',  label: 'Scale content',  desc: 'Scale every object proportionally so the layout fills the new canvas.' }
];

export function isImageObject(obj) {
  return !!(obj && obj.type === 'image');
}

/* ---------- Canvas resize ---------- */

export function resizeCanvas(canvas, width, height, mode = 'keep') {
  if (!canvas) return;
  const w = Math.max(50, Math.round(width));
  const h = Math.max(50, Math.round(height));
  const oldW = canvas.getWidth();
  const oldH = canvas.getHeight();
  if (oldW === w && oldH === h) return;

  if (mode === 'scale') {
    const sx = w / oldW;
    const sy = h / oldH;
    canvas.getObjects().forEach((obj) => {
      obj.set({
        left:    (obj.left || 0) * sx,
        top:     (obj.top || 0) * sy,
        scaleX:  (obj.scaleX || 1) * sx,
        scaleY:  (obj.scaleY || 1) * sy
      });
      obj.setCoords();
    });
  } else if (mode === 'center') {
    const dx = (w - oldW) / 2;
    const dy = (h - oldH) / 2;
    canvas.getObjects().forEach((obj) => {
      obj.set({ left: (obj.left || 0) + dx, top: (obj.top || 0) + dy });
      obj.setCoords();
    });
  }

  canvas.setWidth(w);
  canvas.setHeight(h);
  canvas.fire('object:modified');
  canvas.requestRenderAll();
}

/* ---------- Selected image actions ---------- */

export function centerObject(canvas, obj) {
  if (!canvas || !obj) return;
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  // Respect the object's origin to keep this O(1) and robust across types.
  const ox = obj.originX === 'center' ? 0.5 : obj.originX === 'right' ? 1 : 0;
  const oy = obj.originY === 'center' ? 0.5 : obj.originY === 'bottom' ? 1 : 0;
  const box = obj.getBoundingRect(true, true);
  // Compute the object's top-left in canvas space, then offset so the bounding
  // rect lands centered.
  const cx = (w - box.width) / 2 - box.left + (obj.left || 0);
  const cy = (h - box.height) / 2 - box.top + (obj.top || 0);
  obj.set({ left: cx, top: cy });
  obj.setCoords();
  void ox; void oy; // unused but referenced for clarity
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function fitObjectToCanvas(canvas, obj) {
  if (!canvas || !obj) return;
  const baseW = obj.width || 1;
  const baseH = obj.height || 1;
  const cw = canvas.getWidth();
  const ch = canvas.getHeight();
  const s = Math.min(cw / baseW, ch / baseH);
  obj.set({ scaleX: s, scaleY: s, angle: 0 });
  obj.setCoords();
  centerObject(canvas, obj);
}

export function fillObjectToCanvas(canvas, obj) {
  if (!canvas || !obj) return;
  const baseW = obj.width || 1;
  const baseH = obj.height || 1;
  const cw = canvas.getWidth();
  const ch = canvas.getHeight();
  const s = Math.max(cw / baseW, ch / baseH);
  obj.set({ scaleX: s, scaleY: s, angle: 0 });
  obj.setCoords();
  centerObject(canvas, obj);
}

export function rotateObject(canvas, obj, delta) {
  if (!canvas || !obj) return;
  const current = obj.angle || 0;
  let next = (current + delta) % 360;
  if (next < 0) next += 360;
  obj.set({ angle: next });
  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function flipObject(canvas, obj, axis /* 'x' | 'y' */) {
  if (!canvas || !obj) return;
  if (axis === 'x') obj.set({ flipX: !obj.flipX });
  else obj.set({ flipY: !obj.flipY });
  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function setObjectAngle(canvas, obj, angle) {
  if (!canvas || !obj) return;
  obj.set({ angle });
  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}
