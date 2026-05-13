export const CANVAS_PRESETS = [
  { id: 'square', name: 'Instagram Post', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'portrait', name: 'Instagram Portrait', width: 1080, height: 1350, ratio: '4:5' },
  { id: 'story', name: 'Story / Reel', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'landscape', name: 'Landscape Post', width: 1200, height: 675, ratio: '16:9' },
  { id: 'youtube', name: 'YouTube Thumbnail', width: 1280, height: 720, ratio: '16:9' },
  { id: 'banner', name: 'Web Banner', width: 1920, height: 800, ratio: '12:5' },
  { id: 'product', name: 'Product Square', width: 2000, height: 2000, ratio: '1:1' },
  { id: 'a4-landscape', name: 'A4 Landscape', width: 1600, height: 1131, ratio: 'A4' },
  { id: 'a4-portrait', name: 'A4 Portrait', width: 1131, height: 1600, ratio: 'A4' }
];

export function isImageObject(obj) {
  return !!obj && obj.type === 'image';
}

export function resizeCanvas(canvas, width, height, mode = 'keep') {
  if (!canvas) return;

  const oldW = canvas.getWidth();
  const oldH = canvas.getHeight();

  canvas.setWidth(width);
  canvas.setHeight(height);

  if (mode === 'scale-content') {
    const scale = Math.min(width / oldW, height / oldH);
    const dx = (width - oldW * scale) / 2;
    const dy = (height - oldH * scale) / 2;

    canvas.getObjects().forEach((obj) => {
      obj.set({
        left: (obj.left || 0) * scale + dx,
        top: (obj.top || 0) * scale + dy,
        scaleX: (obj.scaleX || 1) * scale,
        scaleY: (obj.scaleY || 1) * scale
      });
      obj.setCoords();
    });
  }

  if (mode === 'center-content') {
    const dx = (width - oldW) / 2;
    const dy = (height - oldH) / 2;

    canvas.getObjects().forEach((obj) => {
      obj.set({
        left: (obj.left || 0) + dx,
        top: (obj.top || 0) + dy
      });
      obj.setCoords();
    });
  }

  canvas.fire('object:modified');
  canvas.requestRenderAll();
}

export function centerObject(canvas, obj = canvas?.getActiveObject()) {
  if (!canvas || !obj) return;

  obj.set({
    left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,
    originX: 'center',
    originY: 'center'
  });

  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function fitObjectToCanvas(canvas, obj = canvas?.getActiveObject(), padding = 0) {
  if (!canvas || !obj) return;

  const cw = canvas.getWidth() - padding * 2;
  const ch = canvas.getHeight() - padding * 2;

  const rawW = obj.width || obj.getScaledWidth();
  const rawH = obj.height || obj.getScaledHeight();

  if (!rawW || !rawH) return;

  const scale = Math.min(cw / rawW, ch / rawH);

  obj.set({
    scaleX: scale,
    scaleY: scale,
    left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,
    originX: 'center',
    originY: 'center'
  });

  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function fillObjectToCanvas(canvas, obj = canvas?.getActiveObject()) {
  if (!canvas || !obj) return;

  const cw = canvas.getWidth();
  const ch = canvas.getHeight();

  const rawW = obj.width || obj.getScaledWidth();
  const rawH = obj.height || obj.getScaledHeight();

  if (!rawW || !rawH) return;

  const scale = Math.max(cw / rawW, ch / rawH);

  obj.set({
    scaleX: scale,
    scaleY: scale,
    left: cw / 2,
    top: ch / 2,
    originX: 'center',
    originY: 'center'
  });

  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function rotateObject(canvas, obj = canvas?.getActiveObject(), delta = 90) {
  if (!canvas || !obj) return;

  const next = ((obj.angle || 0) + delta) % 360;
  obj.set({ angle: next });
  obj.setCoords();

  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function flipObject(canvas, obj = canvas?.getActiveObject(), axis = 'x') {
  if (!canvas || !obj) return;

  if (axis === 'x') obj.set({ flipX: !obj.flipX });
  if (axis === 'y') obj.set({ flipY: !obj.flipY });

  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

export function setObjectAngle(canvas, obj = canvas?.getActiveObject(), angle = 0) {
  if (!canvas || !obj) return;

  obj.set({ angle: Number(angle) || 0 });
  obj.setCoords();

  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}