import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { PackTabRow } from './ChipStrip.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { FRAME_PACKS, getAllFrames } from '../editor/framePacks/index.js';
import { applyFrame, removeFrame } from '../editor/frameActions.js';

export default function FramePanel({ onClose }) {
  const { canvas } = useEditor();
  const [tab, setTab] = useState('all'); // 'all' | pack.id

  const tabs = useMemo(
    () => [{ id: 'all', label: 'All' }, ...FRAME_PACKS.map((p) => ({ id: p.id, label: p.name }))],
    []
  );

  const frames = useMemo(() => {
    const all = getAllFrames();
    return tab === 'all' ? all : all.filter((f) => f.pack === tab);
  }, [tab]);

  function onPick(id) {
    if (!canvas) return;
    Promise.resolve(applyFrame(canvas, id));
  }

  function onRemove() {
    if (!canvas) return;
    removeFrame(canvas);
  }

  return (
    <aside className="w-full md:w-80 md:shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll text-surface-900 dark:text-surface-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-surface-50 dark:bg-surface-950 z-10">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Frames</div>
          <div className="text-xs text-surface-600 dark:text-surface-300 mt-0.5">Tap to apply</div>
        </div>
        {onClose && (
          <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close frames">
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      <div className="p-3 space-y-3">
        <PackTabRow tabs={tabs} activeId={tab} onChange={setTab} />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {frames.map((f) => (
            <button
              key={f.id}
              onClick={() => onPick(f.id)}
              className="aspect-[4/5] rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-3 hover:ring-2 hover:ring-blue-500 transition flex flex-col"
              title={f.name}
            >
              <div className="flex-1 rounded-lg bg-surface-100 dark:bg-surface-800 overflow-hidden flex items-center justify-center">
                <FramePreview frame={f} />
              </div>
              <div className="mt-2 text-[11px] font-semibold leading-tight truncate text-surface-900 dark:text-surface-50">{f.name}</div>
              <div className="text-[10px] text-surface-500 dark:text-surface-400 truncate">{f.packName}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onRemove}
          className="w-full rounded-lg border border-surface-200 bg-white text-surface-900 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:bg-surface-800 py-2 text-sm font-medium flex items-center justify-center gap-1.5"
        >
          <Icon name="refresh" size={14} />
          Remove frame
        </button>

        <div className="h-2" />
      </div>
    </aside>
  );
}

function FramePreview({ frame }) {
  // For border frames, draw a small box with the same stroke.
  if (frame.type === 'border') {
    const sw = Math.min(frame.strokeWidth || 0, 14);
    const rx = Math.min(frame.rx || 0, 14);
    return (
      <div className="relative w-3/4 h-3/4 rounded-sm bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            border: `${sw}px ${frame.strokeDashArray ? 'dashed' : 'solid'} ${frame.stroke}`,
            borderRadius: rx,
            boxSizing: 'border-box',
          }}
        />
        {frame.padBottom ? (
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{ height: 20, background: frame.stroke }}
          />
        ) : null}
      </div>
    );
  }
  // svg-overlay: show the SVG over a neutral grid.
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-2 rounded-sm bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600" />
      <div
        className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: frame.svg || '' }}
      />
    </div>
  );
}
