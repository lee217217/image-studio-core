/**
 * Helpers for working with Fabric.js objects.
 */

export function describeObject(obj) {
  if (!obj) return 'No selection';
  if (obj.name) return obj.name;
  return typeLabel(obj.type);
}

export function typeLabel(type) {
  switch (type) {
    case 'i-text':
    case 'text':
    case 'textbox':
      return 'Text';
    case 'rect': return 'Rectangle';
    case 'circle': return 'Circle';
    case 'triangle': return 'Triangle';
    case 'line': return 'Line';
    case 'group': return 'Group';
    case 'image': return 'Image';
    case 'path': return 'Path';
    case 'polygon': return 'Polygon';
    case 'activeSelection': return 'Selection';
    default: return type || 'Object';
  }
}

export function isTextObject(obj) {
  if (!obj) return false;
  return obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox';
}

export function getObjectSize(obj) {
  if (!obj) return { width: 0, height: 0 };
  const w = (obj.width || 0) * (obj.scaleX || 1);
  const h = (obj.height || 0) * (obj.scaleY || 1);
  return { width: w, height: h };
}

export function setObjectSize(obj, width, height) {
  if (!obj) return;
  const baseW = obj.width || 1;
  const baseH = obj.height || 1;
  obj.set({
    scaleX: width / baseW,
    scaleY: height / baseH
  });
  obj.setCoords();
}

export function isLocked(obj) {
  return !!(obj && (obj.lockMovementX || obj.lockMovementY || obj.lockScalingX || obj.lockScalingY || obj.lockRotation));
}
