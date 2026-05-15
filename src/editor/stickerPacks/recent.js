// Tracks recently-used stickers in localStorage. Falls back to in-memory
// when localStorage is unavailable (e.g. private mode, sandboxed iframe).

const KEY = 'isc:recentStickers';
const MAX = 12;

let memoryFallback = [];

function safeRead() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((id) => typeof id === 'string');
    return [];
  } catch {
    return memoryFallback.slice();
  }
}

function safeWrite(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    memoryFallback = ids.slice();
  }
}

export function getRecentStickerIds() {
  return safeRead();
}

export function pushRecentSticker(id) {
  if (!id) return;
  const list = safeRead().filter((x) => x !== id);
  list.unshift(id);
  safeWrite(list.slice(0, MAX));
}

export function clearRecentStickers() {
  safeWrite([]);
  memoryFallback = [];
}
