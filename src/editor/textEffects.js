import { fabric } from './fabricSetup.js';

/**
 * Text Effects — applied to fabric.IText / fabric.Textbox.
 *
 * Effects are stored on the object in `__textEffects` so subsequent edits
 * (typing, restyling) can re-apply the visual treatment without losing state.
 *
 * Supported effects:
 *  - stroke: { color, width }
 *  - shadow: { color, blur, offsetX, offsetY }
 *  - glow:   { color, blur }                       (shadow with zero offset)
 *  - gradient: { type: 'linear'|'radial', stops: [[t,color],[t,color]], angle? }
 *  - extrude3d: { depth, color }                   (stacked text clones behind)
 *  - curve:    { angle: -90..90 }                  (re-layout into per-char path)
 */

export const TEXT_EFFECT_DEFAULTS = {
  stroke: null,
  shadow: null,
  glow: null,
  gradient: null,
  extrude3d: null,
  curve: null,
};

export function isTextObject(obj) {
  return !!(
    obj &&
    (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox')
  );
}

export function getTextEffects(obj) {
  if (!isTextObject(obj)) return { ...TEXT_EFFECT_DEFAULTS };
  return { ...TEXT_EFFECT_DEFAULTS, ...(obj.__textEffects || {}) };
}

/**
 * Apply (or update) text effects on a fabric text object. Pass `null` for any
 * key to clear that effect. Effects merge into the existing state.
 */
export function applyTextEffects(canvas, obj, partial = {}) {
  if (!isTextObject(obj)) return getTextEffects(obj);
  const next = { ...getTextEffects(obj), ...partial };

  // Stroke
  if (next.stroke) {
    obj.set({
      stroke: next.stroke.color || '#000000',
      strokeWidth: Math.max(0, next.stroke.width || 0),
      paintFirst: 'stroke',
    });
  } else {
    obj.set({ stroke: null, strokeWidth: 0 });
  }

  // Shadow / Glow — both map to fabric.Shadow. Glow has zero offset.
  const shadowSrc = next.glow || next.shadow;
  if (shadowSrc) {
    const s = new fabric.Shadow({
      color: shadowSrc.color || '#000000',
      blur: shadowSrc.blur != null ? shadowSrc.blur : 8,
      offsetX: next.glow ? 0 : (shadowSrc.offsetX || 0),
      offsetY: next.glow ? 0 : (shadowSrc.offsetY || 0),
    });
    obj.set({ shadow: s });
  } else {
    obj.set({ shadow: null });
  }

  // Gradient fill
  if (next.gradient && Array.isArray(next.gradient.stops) && next.gradient.stops.length >= 2) {
    const stops = next.gradient.stops.map(([offset, color]) => ({ offset, color }));
    const w = obj.width || 200;
    const h = obj.height || 80;
    if (next.gradient.type === 'radial') {
      obj.set('fill', new fabric.Gradient({
        type: 'radial',
        coords: { x1: w / 2, y1: h / 2, r1: 0, x2: w / 2, y2: h / 2, r2: Math.max(w, h) / 2 },
        colorStops: stops,
      }));
    } else {
      const angle = ((next.gradient.angle || 0) * Math.PI) / 180;
      const dx = Math.cos(angle) * w / 2;
      const dy = Math.sin(angle) * h / 2;
      obj.set('fill', new fabric.Gradient({
        type: 'linear',
        coords: { x1: w / 2 - dx, y1: h / 2 - dy, x2: w / 2 + dx, y2: h / 2 + dy },
        colorStops: stops,
      }));
    }
  } else if (partial.gradient === null && obj.__originalFill) {
    obj.set('fill', obj.__originalFill);
  }

  // 3D extrude — stack faded clones behind. Implemented as siblings tagged
  // with __extrudeParent so we can remove them on update.
  if (canvas) {
    canvas
      .getObjects()
      .filter((o) => o.__extrudeParent === (obj.__uid || obj.cacheKey))
      .forEach((o) => canvas.remove(o));
  }
  if (next.extrude3d && next.extrude3d.depth > 0 && canvas) {
    const depth = Math.min(20, Math.max(1, next.extrude3d.depth));
    const color = next.extrude3d.color || '#fbbf24';
    const baseProps = obj.toObject();
    for (let i = depth; i >= 1; i--) {
      const clone = new fabric.IText(obj.text, {
        ...baseProps,
        left: (obj.left || 0) + i,
        top: (obj.top || 0) + i,
        fill: color,
        stroke: null,
        strokeWidth: 0,
        shadow: null,
        selectable: false,
        evented: false,
        hasControls: false,
        excludeFromExport: false,
        __extrudeParent: obj.__uid || obj.cacheKey || '__extrude',
        __isExtrudeClone: true,
      });
      canvas.add(clone);
      // Send to back so the source text remains in front.
      canvas.sendToBack(clone);
    }
    // Bring original to top again
    canvas.bringToFront(obj);
  }

  // Curve — fabric.IText doesn't support arcs natively. Approximation:
  // re-layout uses a per-character path. We store the angle and render via
  // group of single-glyph IText. To stay non-destructive, we only set the
  // angle metadata here — the rendering step lives below in `relayoutCurved`.
  if (next.curve && Math.abs(next.curve.angle) > 1) {
    relayoutCurved(canvas, obj, next.curve.angle);
  } else if (partial.curve === null && obj.__curveContainer) {
    // Reset: remove the curve container and restore original.
    flattenCurve(canvas, obj);
  }

  obj.__textEffects = next;
  obj.setCoords();
  if (canvas) {
    canvas.fire('object:modified', { target: obj });
    canvas.requestRenderAll();
  }
  return next;
}

/**
 * Spread the text characters along an arc. The original text is hidden and a
 * sibling group of per-character IText is added as the visible representation.
 * Re-running this with a new angle removes the old container first.
 */
function relayoutCurved(canvas, obj, angleDeg) {
  if (!canvas) return;
  const id = obj.__uid || obj.cacheKey || ('curve-' + Math.random().toString(36).slice(2));
  obj.__uid = id;
  // Remove any previous container belonging to this text
  canvas
    .getObjects()
    .filter((o) => o.__curveOwner === id)
    .forEach((o) => canvas.remove(o));

  const chars = (obj.text || '').split('');
  if (!chars.length) return;
  const fontSize = obj.fontSize || 48;
  const radius = Math.max(80, (chars.length * fontSize * 0.6) / 2 / Math.tan(((Math.abs(angleDeg) / 2) * Math.PI) / 180));
  const totalAngle = (angleDeg * Math.PI) / 180;
  const startAngle = -totalAngle / 2 - Math.PI / 2;
  const step = chars.length > 1 ? totalAngle / (chars.length - 1) : 0;

  const cx = obj.left || 0;
  const cy = (obj.top || 0) + radius; // arc center sits below the text
  const items = [];
  for (let i = 0; i < chars.length; i++) {
    const a = startAngle + i * step;
    const x = cx + radius * Math.cos(a);
    const y = cy + radius * Math.sin(a);
    const rot = ((a + Math.PI / 2) * 180) / Math.PI;
    const t = new fabric.Text(chars[i], {
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      fontFamily: obj.fontFamily,
      fontSize,
      fontWeight: obj.fontWeight,
      fontStyle: obj.fontStyle,
      fill: typeof obj.fill === 'string' ? obj.fill : '#111',
      stroke: obj.stroke,
      strokeWidth: obj.strokeWidth,
      shadow: obj.shadow,
      angle: rot,
      selectable: false,
      evented: false,
      __curveOwner: id,
    });
    items.push(t);
  }
  const group = new fabric.Group(items, {
    left: cx,
    top: obj.top,
    originX: 'center',
    originY: 'top',
    __curveOwner: id,
    __curveContainer: true,
  });
  canvas.add(group);
  obj.set({ opacity: 0, selectable: true });
  obj.__curveContainer = group;
}

function flattenCurve(canvas, obj) {
  if (!canvas || !obj) return;
  const id = obj.__uid;
  canvas
    .getObjects()
    .filter((o) => o.__curveOwner === id)
    .forEach((o) => canvas.remove(o));
  obj.set({ opacity: 1 });
  obj.__curveContainer = null;
}

/* ---------------- Presets ---------------- */

export const TEXT_PRESETS = [
  { id: 'clean',          label: 'Clean',
    effects: { stroke: null, shadow: null, glow: null, gradient: null, extrude3d: null, curve: null } },
  { id: 'outlined',       label: 'Outlined',
    effects: { stroke: { color: '#111111', width: 3 }, shadow: null, glow: null } },
  { id: 'neon-pink',      label: 'Neon Pink',
    effects: { glow: { color: '#ff2bd0', blur: 22 }, stroke: { color: '#ff2bd0', width: 2 } } },
  { id: 'neon-cyan',      label: 'Neon Cyan',
    effects: { glow: { color: '#00f0ff', blur: 22 }, stroke: { color: '#00f0ff', width: 2 } } },
  { id: 'drop-soft',      label: 'Drop Shadow Soft',
    effects: { shadow: { color: 'rgba(0,0,0,0.35)', blur: 14, offsetX: 4, offsetY: 6 } } },
  { id: '3d-yellow',      label: '3D Yellow',
    effects: { extrude3d: { depth: 8, color: '#fbbf24' }, stroke: { color: '#111111', width: 2 } } },
  { id: 'gradient-sunset', label: 'Gradient Sunset',
    effects: { gradient: { type: 'linear', angle: 90, stops: [[0, '#ff9966'], [1, '#ff5e62']] } } },
  { id: 'vintage-outline', label: 'Vintage Outline',
    effects: { stroke: { color: '#5a4a28', width: 3 }, shadow: { color: 'rgba(90,74,40,0.4)', blur: 0, offsetX: 4, offsetY: 4 } } },
  { id: 'sticker-white',  label: 'Sticker White Stroke',
    effects: { stroke: { color: '#ffffff', width: 6 }, shadow: { color: 'rgba(0,0,0,0.25)', blur: 8, offsetX: 0, offsetY: 4 } } },
  { id: 'marker',         label: 'Marker Highlight',
    effects: { glow: { color: '#fde047', blur: 8 } } },
];

export function applyTextPreset(canvas, obj, presetId) {
  const preset = TEXT_PRESETS.find((p) => p.id === presetId);
  if (!preset) return getTextEffects(obj);
  // Reset all effects to defaults first so presets are isolated.
  const cleared = {
    stroke: null, shadow: null, glow: null,
    gradient: null, extrude3d: null, curve: null,
  };
  return applyTextEffects(canvas, obj, { ...cleared, ...preset.effects, __presetId: presetId });
}

export function clearTextEffects(canvas, obj) {
  return applyTextEffects(canvas, obj, {
    stroke: null, shadow: null, glow: null,
    gradient: null, extrude3d: null, curve: null,
  });
}
