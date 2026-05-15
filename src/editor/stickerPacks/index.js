import { fabric } from '../fabricSetup.js';
import { HEARTS_PACK } from './heartsPack.js';
import { ANIMALS_PACK } from './animalsPack.js';
import { CUTE_PACK } from './cutePack.js';
import { SYMBOLS_PACK } from './symbolsPack.js';
import { SPEECH_PACK } from './speechPack.js';
import { FOOD_PACK } from './foodPack.js';
import { WEATHER_PACK } from './weatherPack.js';
import { TRAVEL_PACK } from './travelPack.js';
import { SPORT_PACK } from './sportPack.js';
import { SEASONAL_PACK } from './seasonalPack.js';
import { TECH_PACK } from './techPack.js';
import { pushRecentSticker } from './recent.js';

export const STICKER_PACKS = [
  HEARTS_PACK,
  ANIMALS_PACK,
  CUTE_PACK,
  SYMBOLS_PACK,
  SPEECH_PACK,
  FOOD_PACK,
  WEATHER_PACK,
  TRAVEL_PACK,
  SPORT_PACK,
  SEASONAL_PACK,
  TECH_PACK,
];

export { getRecentStickerIds, clearRecentStickers } from './recent.js';

export function getAllStickers() {
  return STICKER_PACKS.flatMap((pack) =>
    pack.stickers.map((s) => ({ ...s, pack: pack.id, packName: pack.name }))
  );
}

export function getStickerById(id) {
  for (const pack of STICKER_PACKS) {
    const found = pack.stickers.find((s) => s.id === id);
    if (found) return { ...found, pack: pack.id, packName: pack.name };
  }
  return null;
}

// Module-level SVG -> Fabric-object cache. We cache the parsed objects + options
// so subsequent additions skip the SVG parse. We clone fresh objects for each add.
const svgCache = new Map(); // stickerId -> { objects, options }

function parseSvg(stickerId, svg) {
  return new Promise((resolve, reject) => {
    if (svgCache.has(stickerId)) {
      resolve(svgCache.get(stickerId));
      return;
    }
    if (typeof fabric.loadSVGFromString !== 'function') {
      reject(new Error('fabric.loadSVGFromString unavailable'));
      return;
    }
    fabric.loadSVGFromString(svg, (objects, options) => {
      if (!objects || !objects.length) {
        reject(new Error('Failed to parse sticker SVG'));
        return;
      }
      const entry = { objects, options };
      svgCache.set(stickerId, entry);
      resolve(entry);
    });
  });
}

/**
 * Add a sticker to the canvas, centered with a sensible default size.
 * Returns a Promise that resolves to the added Fabric object.
 */
export async function addStickerToCanvas(canvas, stickerId, opts = {}) {
  if (!canvas) return null;
  const sticker = getStickerById(stickerId);
  if (!sticker) return null;
  const { objects, options } = await parseSvg(stickerId, sticker.svg);
  const group = fabric.util.groupSVGElements(objects, options);
  const cw = canvas.getWidth();
  const ch = canvas.getHeight();
  const defaultSize = opts.size || 240;
  const max = Math.min(cw, ch) * 0.35;
  const target = Math.min(defaultSize, max);
  const scale = target / Math.max(group.width || 240, group.height || 240);
  group.set({
    left: opts.left != null ? opts.left : cw / 2,
    top: opts.top != null ? opts.top : ch / 2,
    originX: 'center',
    originY: 'center',
    scaleX: scale,
    scaleY: scale,
    name: sticker.name,
    __stickerId: sticker.id,
    __stickerPack: sticker.pack,
  });
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.requestRenderAll();
  try { pushRecentSticker(sticker.id); } catch { /* ignore */ }
  return group;
}
