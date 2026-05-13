import { fabric } from 'fabric';

/**
 * Create a Fabric.js canvas bound to a <canvas> DOM element.
 * Centralized configuration so other modules don't reach into fabric internals.
 */
export function createFabricCanvas(canvasEl, { width, height, background = '#ffffff' } = {}) {
  const canvas = new fabric.Canvas(canvasEl, {
    width,
    height,
    backgroundColor: background,
    preserveObjectStacking: true,
    selection: true,
    fireRightClick: false,
    stopContextMenu: true,
    enableRetinaScaling: true
  });

  // Better defaults for selection handles
  fabric.Object.prototype.set({
    cornerStyle: 'circle',
    cornerSize: 9,
    cornerColor: '#2563eb',
    cornerStrokeColor: '#ffffff',
    transparentCorners: false,
    borderColor: '#2563eb',
    borderScaleFactor: 1.2,
    padding: 2
  });

  return canvas;
}

/**
 * Resize the canvas drawing area to a logical size.
 * `fit` decides if we should also rescale the on-screen zoom to fit the viewport.
 */
export function resizeCanvas(canvas, width, height) {
  if (!canvas) return;
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.renderAll();
}

export { fabric };
