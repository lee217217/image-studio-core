import { fabric } from './fabricSetup.js';
import { isImageObject } from './imageFilters.js';
import { getFrameById } from './framePacks/index.js';

/**
 * Apply a frame to the currently selected image (or to the first image on the canvas
 * if none is selected). Removes any previous frame on the same image first.
 *
 * Supported frame types:
 *  - 'border'      → stroke / strokeWidth / strokeDashArray / rx applied directly to the image
 *  - 'svg-overlay' → an SVG group is added on top of the image and locked to it
 *  - 'css-mask'    → reserved for clipPath-based masks (not used in v1 frames)
 */
export function applyFrame(canvas, frameId) {
  if (!canvas) return false;
  const frame = getFrameById(frameId);
  if (!frame) return false;

  const active = canvas.getActiveObject();
  const target = isImageObject(active)
    ? active
    : canvas.getObjects().find((o) => isImageObject(o));
  if (!target) return false;

  // Always remove existing frame artifacts first
  removeFrame(canvas, target);

  if (frame.type === 'border') {
    target.set({
      stroke: frame.stroke || 'transparent',
      strokeWidth: frame.strokeWidth || 0,
      strokeUniform: true,
      strokeDashArray: frame.strokeDashArray || null,
      rx: frame.rx || 0,
      ry: frame.rx || 0,
      __frameId: frame.id,
    });
    target.setCoords();
    canvas.requestRenderAll();
    return true;
  }

  if (frame.type === 'svg-overlay' && frame.svg) {
    return new Promise((resolve) => {
      fabric.loadSVGFromString(frame.svg, (objects, options) => {
        if (!objects || !objects.length) {
          resolve(false);
          return;
        }
        const group = fabric.util.groupSVGElements(objects, options);
        const bound = target.getBoundingRect(true, true);
        const w = bound.width;
        const h = bound.height;
        const scaleX = w / (group.width || w);
        const scaleY = h / (group.height || h);
        group.set({
          left: bound.left + w / 2,
          top: bound.top + h / 2,
          originX: 'center',
          originY: 'center',
          scaleX,
          scaleY,
          selectable: true,
          evented: true,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          hasControls: false,
          hoverCursor: 'default',
          name: frame.name,
          __frameId: frame.id,
          __frameTargetUid: target.__uid || target.cacheKey || null,
        });
        canvas.add(group);
        // Bring frame to top of stack but below selection overlays.
        canvas.bringToFront(group);
        target.__frameOverlayId = frame.id;

        // Optional editable text slot for Magazine/Comic frames.
        if (frame.textSlot && typeof fabric.IText === 'function') {
          const slot = frame.textSlot;
          const tx = bound.left + w * (slot.x != null ? slot.x : 0.5);
          const ty = bound.top + h * (slot.y != null ? slot.y : 0.5);
          const text = new fabric.IText(slot.placeholder || 'Title', {
            left: tx,
            top: ty,
            originX: 'center',
            originY: 'center',
            fontFamily: slot.fontFamily || 'Inter, system-ui, sans-serif',
            fontSize: slot.fontSize || 32,
            fontWeight: slot.fontWeight || 700,
            fill: slot.fill || '#111111',
            textAlign: 'center',
            editable: true,
            __frameTextSlot: frame.id,
          });
          canvas.add(text);
          canvas.bringToFront(text);
        }

        canvas.requestRenderAll();
        resolve(true);
      });
    });
  }

  return false;
}

/**
 * Remove any frame applied to the target image — both border-style strokes
 * and SVG overlay groups added by applyFrame.
 */
export function removeFrame(canvas, target) {
  if (!canvas) return;
  const img = target || (isImageObject(canvas.getActiveObject())
    ? canvas.getActiveObject()
    : canvas.getObjects().find((o) => isImageObject(o)));
  if (!img) return;
  // 1. Strip border stroke if it was set by a frame
  if (img.__frameId) {
    img.set({
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      rx: 0,
      ry: 0,
      __frameId: null,
    });
    img.setCoords();
  }
  // 2. Strip overlay frames belonging to this image
  const overlays = canvas.getObjects().filter((o) => o && o.__frameId && o !== img);
  overlays.forEach((o) => canvas.remove(o));
  // 3. Strip frame text slots
  const textSlots = canvas.getObjects().filter((o) => o && o.__frameTextSlot);
  textSlots.forEach((o) => canvas.remove(o));
  img.__frameOverlayId = null;
  canvas.requestRenderAll();
}
