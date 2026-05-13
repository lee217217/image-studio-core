import { fabric } from './fabricSetup.js';

/* ---------- Add primitives ---------- */

export function addText(canvas, value = 'Double-click to edit', options = {}) {
  const text = new fabric.IText(value, {
    left: 80,
    top: 80,
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '500',
    fill: '#111827',
    name: 'Text',
    ...options
  });
  placeAndSelect(canvas, text);
  return text;
}

export function addRect(canvas, options = {}) {
  const rect = new fabric.Rect({
    left: 120,
    top: 120,
    width: 240,
    height: 160,
    fill: '#3b82f6',
    stroke: null,
    strokeWidth: 0,
    rx: 4,
    ry: 4,
    name: 'Rectangle',
    ...options
  });
  placeAndSelect(canvas, rect);
  return rect;
}

export function addCircle(canvas, options = {}) {
  const circle = new fabric.Circle({
    left: 160,
    top: 160,
    radius: 90,
    fill: '#10b981',
    stroke: null,
    strokeWidth: 0,
    name: 'Circle',
    ...options
  });
  placeAndSelect(canvas, circle);
  return circle;
}

export function addLine(canvas, options = {}) {
  const line = new fabric.Line([60, 60, 320, 60], {
    stroke: '#111827',
    strokeWidth: 4,
    strokeLineCap: 'round',
    name: 'Line',
    ...options
  });
  placeAndSelect(canvas, line);
  return line;
}

export function addArrow(canvas, options = {}) {
  // Group a line + triangle head into an arrow shape.
  const line = new fabric.Line([0, 0, 220, 0], {
    stroke: '#111827',
    strokeWidth: 4,
    strokeLineCap: 'round'
  });
  const head = new fabric.Triangle({
    width: 18,
    height: 22,
    fill: '#111827',
    left: 220,
    top: -11,
    angle: 90,
    originX: 'center',
    originY: 'center'
  });
  const group = new fabric.Group([line, head], {
    left: 100,
    top: 200,
    name: 'Arrow',
    ...options
  });
  placeAndSelect(canvas, group);
  return group;
}

export function addLabel(canvas, value = 'Label', options = {}) {
  const text = new fabric.Text(value, {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '600',
    fill: '#ffffff',
    originX: 'center',
    originY: 'center'
  });
  const padX = 18, padY = 8;
  const bg = new fabric.Rect({
    width: text.width + padX * 2,
    height: text.height + padY * 2,
    rx: 999,
    ry: 999,
    fill: '#111827',
    originX: 'center',
    originY: 'center'
  });
  const group = new fabric.Group([bg, text], {
    left: 160,
    top: 160,
    name: 'Label',
    ...options
  });
  placeAndSelect(canvas, group);
  return group;
}

/* ---------- Image upload ---------- */

export function addImageFromFile(canvas, file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('Only image files are supported.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read this image file.'));
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        if (!img) {
          reject(new Error('Could not decode this image.'));
          return;
        }
        const cw = canvas.getWidth();
        const ch = canvas.getHeight();
        const max = Math.min(cw, ch) * 0.7;
        if (img.width > max || img.height > max) {
          const scale = max / Math.max(img.width, img.height);
          img.scale(scale);
        }
        img.set({
          left: cw / 2,
          top: ch / 2,
          originX: 'center',
          originY: 'center',
          name: 'Image'
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        resolve(img);
      }, { crossOrigin: 'anonymous' });
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- Object operations ---------- */

export function deleteActive(canvas) {
  const objs = canvas.getActiveObjects();
  if (!objs.length) return;
  objs.forEach((o) => canvas.remove(o));
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

export function duplicateActive(canvas) {
  const active = canvas.getActiveObject();
  if (!active) return;
  active.clone((cloned) => {
    cloned.set({
      left: (active.left || 0) + 20,
      top: (active.top || 0) + 20,
      name: active.name || cloned.type
    });
    if (cloned.type === 'activeSelection') {
      cloned.canvas = canvas;
      cloned.forEachObject((o) => canvas.add(o));
      cloned.setCoords();
    } else {
      canvas.add(cloned);
    }
    canvas.setActiveObject(cloned);
    canvas.requestRenderAll();
  }, ['name', 'lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation', 'selectable', 'evented']);
}

export function bringForward(canvas) {
  const o = canvas.getActiveObject();
  if (!o) return;
  canvas.bringForward(o);
  canvas.requestRenderAll();
}

export function sendBackward(canvas) {
  const o = canvas.getActiveObject();
  if (!o) return;
  canvas.sendBackwards(o);
  canvas.requestRenderAll();
}

export function bringToFront(canvas) {
  const o = canvas.getActiveObject();
  if (!o) return;
  canvas.bringToFront(o);
  canvas.requestRenderAll();
}

export function sendToBack(canvas) {
  const o = canvas.getActiveObject();
  if (!o) return;
  canvas.sendToBack(o);
  canvas.requestRenderAll();
}

export function setObjectLocked(canvas, obj, locked) {
  if (!obj) return;
  obj.set({
    lockMovementX: locked,
    lockMovementY: locked,
    lockScalingX: locked,
    lockScalingY: locked,
    lockRotation: locked,
    selectable: !locked || true, // keep selectable so user can unlock
    evented: true,
    hasControls: !locked
  });
  obj.setCoords();
  canvas.requestRenderAll();
}

/* ---------- Alignment ---------- */

export function alignActive(canvas, type) {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  const cw = canvas.getWidth();
  const ch = canvas.getHeight();
  const bound = obj.getBoundingRect(true, true);
  switch (type) {
    case 'left':
      obj.set({ left: (obj.left || 0) - bound.left });
      break;
    case 'center':
      obj.set({ left: (obj.left || 0) + (cw / 2 - (bound.left + bound.width / 2)) });
      break;
    case 'right':
      obj.set({ left: (obj.left || 0) + (cw - (bound.left + bound.width)) });
      break;
    case 'top':
      obj.set({ top: (obj.top || 0) - bound.top });
      break;
    case 'middle':
      obj.set({ top: (obj.top || 0) + (ch / 2 - (bound.top + bound.height / 2)) });
      break;
    case 'bottom':
      obj.set({ top: (obj.top || 0) + (ch - (bound.top + bound.height)) });
      break;
    default:
      return;
  }
  obj.setCoords();
  canvas.fire('object:modified', { target: obj });
  canvas.requestRenderAll();
}

/* ---------- Canvas operations ---------- */

export function clearCanvas(canvas, background = '#ffffff') {
  canvas.clear();
  canvas.setBackgroundColor(background, () => canvas.requestRenderAll());
}

export function setBackground(canvas, color) {
  canvas.setBackgroundColor(color, () => {
    canvas.fire('object:modified');
    canvas.requestRenderAll();
  });
}

/* ---------- Helpers ---------- */

function placeAndSelect(canvas, obj) {
  // If position not explicitly set, drop near center
  if (obj.left == null) obj.set({ left: canvas.getWidth() / 2 - 50 });
  if (obj.top == null) obj.set({ top: canvas.getHeight() / 2 - 50 });
  canvas.add(obj);
  canvas.setActiveObject(obj);
  canvas.requestRenderAll();
}
