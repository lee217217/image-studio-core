import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { STICKER_PACKS, getAllStickers, addStickerToCanvas } from '../editor/stickerPacks/index.js';

/**
 * Sticker library panel. Search + pack tabs + grid of SVG tiles.
 * Clicking a tile drops the sticker on the canvas centered.
 */
export default function StickerPanel({ onClose }) {
  const { canvas } = useEditor();
  const [tab, setTab] = useState('all'); // 'all' | pack.id
  const [query, setQuery] = useState('');

  const tabs = useMemo(
    () => [{ id: 'all', label: 'All' }, ...STICKER_PACKS.map((p) => ({ id: p.id, label: p.name }))],
    []
  );

  const stickers = useMemo(() => {
    const all = getAllStickers();
    const byTab = tab === 'all' ? all : all.filter((s) => s.pack === tab);
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((s) => {
      if (s.name.toLowerCase().includes(q)) return true;
      if (s.tags && s.tags.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [tab, query]);

  function onPick(id) {
    if (!canvas) return;
    addStickerToCanvas(canvas, id).catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Sticker add failed:', err && err.message);
    });
  }

  return (
    <aside className="w-full md:w-80 md:shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll text-surface-900 dark:text-surface-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-surface-50 dark:bg-surface-950 z-10">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Stickers</div>
          <div className="text-xs text-surface-600 dark:text-surface-300 mt-0.5">Tap to add</div>
        </div>
        {onClose && (
          <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close stickers">
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      <div className="p-3 space-y-3">
        <div className="relative">
          <input
            type="search"
            placeholder="Search stickers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-surface-200 bg-white text-surface-900 placeholder:text-surface-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:placeholder:text-surface-400"
          />
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? 'px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500 text-white'
                  : 'px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-200 dark:hover:bg-surface-700'
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {stickers.length === 0 ? (
          <div className="text-center text-xs text-surface-500 dark:text-surface-400 py-8">
            No stickers match “{query}”
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
            {stickers.map((s) => (
              <button
                key={s.id}
                onClick={() => onPick(s.id)}
                className="aspect-square rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex items-center justify-center p-2 hover:ring-2 hover:ring-blue-500 transition"
                title={s.name}
                aria-label={`Add sticker ${s.name}`}
              >
                <span
                  className="block w-full h-full"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: s.svg }}
                />
              </button>
            ))}
          </div>
        )}

        <div className="h-2" />
      </div>
    </aside>
  );
}
