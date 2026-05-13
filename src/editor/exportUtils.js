import { dataURLToBlob, downloadBlob } from '../utils/fileUtils.js';

/**
 * Export the current canvas as an image at its real (logical) dimensions,
 * ignoring the on-screen viewport zoom.
 */
export function exportCanvasImage(canvas, { format = 'png', quality = 0.92, scale = 1 } = {}) {
  if (!canvas) return null;
  // Save the current viewport transform and reset to identity for export.
  const currentVT = canvas.viewportTransform ? [...canvas.viewportTransform] : null;
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const mime = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL({
    format: format === 'jpg' ? 'jpeg' : format,
    quality,
    multiplier: scale,
    enableRetinaScaling: false
  });

  if (currentVT) canvas.setViewportTransform(currentVT);

  return { dataUrl, mime };
}

export function downloadCanvasImage(canvas, format = 'png') {
  const result = exportCanvasImage(canvas, { format });
  if (!result) return;
  const blob = dataURLToBlob(result.dataUrl);
  const ext = format === 'jpg' || format === 'jpeg' ? 'jpg' : 'png';
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  downloadBlob(blob, `image-studio-${ts}.${ext}`);
}
