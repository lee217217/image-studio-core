import { CLASSIC_FRAMES_PACK } from './classicFrames.js';
import { STICKER_FRAMES_PACK } from './stickerFrames.js';
import { MAGAZINE_FRAMES_PACK } from './magazineFrames.js';
import { COMIC_FRAMES_PACK } from './comicFrames.js';
import { VINTAGE_FILM_FRAMES_PACK } from './vintageFilmFrames.js';
import { GLITCH_NEON_FRAMES_PACK } from './glitchNeonFrames.js';

export const FRAME_PACKS = [
  CLASSIC_FRAMES_PACK,
  STICKER_FRAMES_PACK,
  MAGAZINE_FRAMES_PACK,
  COMIC_FRAMES_PACK,
  VINTAGE_FILM_FRAMES_PACK,
  GLITCH_NEON_FRAMES_PACK,
];

export function getAllFrames() {
  return FRAME_PACKS.flatMap((pack) =>
    pack.frames.map((f) => ({ ...f, pack: pack.id, packName: pack.name }))
  );
}

export function getFrameById(id) {
  for (const pack of FRAME_PACKS) {
    const found = pack.frames.find((f) => f.id === id);
    if (found) return { ...found, pack: pack.id, packName: pack.name };
  }
  return null;
}
