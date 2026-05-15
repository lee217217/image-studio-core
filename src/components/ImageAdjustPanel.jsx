import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import ChipStrip, { PackTabRow } from './ChipStrip.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  FILTER_DEFAULTS,
  FILTER_PRESETS,
  isImageObject,
  getImageFilterState,
  applyImageFilters,
  applyPreset,
  resetImageFilters
} from '../editor/imageFilters.js';
import { FILM_PACKS, getAllPresets, applyFilmPreset } from '../editor/filmPacks/index.js';

/**
 * v1.2 Photo Adjustments panel.
 *
 * Works against the currently selected Fabric image object. The panel mirrors
 * the object's `__filterState` so sliders stay accurate when the user
 * switches between images.
 *
 * Mobile-safe: full width on small screens, fixed 320px column on >= md.
 */
export default function ImageAdjustPanel({ onClose }) {
  const { canvas } = useEditor();
  // selectedIds / selectionVersion ensure this component re-renders whenever
  // the user switches selections or mutates the selected object.
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectionVersion = useEditorStore((s) => s.selectionVersion);

  const active = canvas ? canvas.getActiveObject() : null;
  const image = isImageObject(active) ? active : null;

  // Local mirror so sliders are responsive without re-rendering the whole
  // canvas on every pixel of drag.
  const [state, setState] = useState(image ? getImageFilterState(image) : { ...FILTER_DEFAULTS });

  useEffect(() => {
    setState(image ? getImageFilterState(image) : { ...FILTER_DEFAULTS });
    // selectionVersion intentionally a dep so dragging the image refreshes us.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(','), selectionVersion, image && image.__uid]);

  function commit(partial) {
    if (!image || !canvas) return;
    const next = applyImageFilters(canvas, image, partial);
    setState(next);
  }

  function onPreset(presetId) {
    if (!image || !canvas) return;
    const next = applyPreset(canvas, image, presetId);
    setState(next);
  }

  function onReset() {
    if (!image || !canvas) return;
    setState(resetImageFilters(canvas, image));
  }

  // ---- Film looks ----
  const [filmTab, setFilmTab] = useState('all');
  function onFilmPreset(presetId) {
    if (!image || !canvas) return;
    if (applyFilmPreset(canvas, presetId)) {
      setState(getImageFilterState(image));
    }
  }
  const activeFilmId = state && state.__filmPresetId;
  const visibleFilmPresets = filmTab === 'all'
    ? getAllPresets()
    : getAllPresets().filter((p) => p.pack === filmTab);
  const filmTabs = [
    { id: 'all', label: 'All' },
    ...FILM_PACKS.map((p) => ({ id: p.id, label: p.name })),
  ];
  const filmChipItems = visibleFilmPresets.map((p) => ({
    id: p.id,
    ariaLabel: `Apply ${p.name}`,
    render: () => (
      <>
        <div
          className="h-12 w-full rounded-lg mb-2 border border-surface-200 dark:border-surface-700"
          style={{ background: p.swatch || '#888' }}
        />
        <div className="text-[11px] font-semibold leading-tight truncate">{p.name}</div>
        <div className="text-[10px] text-surface-500 dark:text-surface-400 truncate mt-0.5">{p.desc}</div>
        <div className="mt-1 inline-block text-[9px] uppercase tracking-wider font-semibold text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 rounded px-1.5 py-0.5">
          {p.packName}
        </div>
      </>
    ),
  }));

  return (
    <aside className="w-full md:w-80 md:shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll text-surface-900 dark:text-surface-50">
      <PanelHeader title="Photo Adjustments" subtitle="Filters and tone" onClose={onClose} />

      {!image ? (
        <EmptyState />
      ) : (
        <div className="p-3 space-y-4">
          {/* Film Looks */}
          <Section title="Film Looks">
            <div className="mb-2">
              <PackTabRow tabs={filmTabs} activeId={filmTab} onChange={setFilmTab} />
            </div>
            <ChipStrip
              items={filmChipItems}
              activeId={activeFilmId}
              onTap={onFilmPreset}
              resetKey={filmTab}
            />
          </Section>

          {/* Presets */}
          <Section title="Presets">
            <div className="grid grid-cols-3 gap-2">
              {FILTER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPreset(p.id)}
                  className="rounded-lg border border-surface-200 bg-white text-surface-900 hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 px-2 py-2 text-xs font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Sliders */}
          <Section title="Tone">
            <Slider label="Brightness" min={-100} max={100} value={state.brightness}
              onChange={(v) => commit({ brightness: v })} onReset={() => commit({ brightness: 0 })} />
            <Slider label="Contrast" min={-100} max={100} value={state.contrast}
              onChange={(v) => commit({ contrast: v })} onReset={() => commit({ contrast: 0 })} />
            <Slider label="Saturation" min={-100} max={100} value={state.saturation}
              onChange={(v) => commit({ saturation: v })} onReset={() => commit({ saturation: 0 })} />
          </Section>

          <Section title="Effects">
            <Slider label="Blur" min={0} max={100} value={state.blur}
              onChange={(v) => commit({ blur: v })} onReset={() => commit({ blur: 0 })} />
            <Slider label="Pixelate" min={0} max={100} value={state.pixelate}
              onChange={(v) => commit({ pixelate: v })} onReset={() => commit({ pixelate: 0 })} />
          </Section>

          <Section title="Toggles">
            <div className="grid grid-cols-3 gap-2">
              <Toggle label="Grayscale" active={state.grayscale} onClick={() => commit({ grayscale: !state.grayscale })} />
              <Toggle label="Sepia" active={state.sepia} onClick={() => commit({ sepia: !state.sepia })} />
              <Toggle label="Invert" active={state.invert} onClick={() => commit({ invert: !state.invert })} />
            </div>
          </Section>

          <button
            onClick={onReset}
            className="w-full rounded-lg border border-surface-200 bg-white text-surface-900 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:bg-surface-800 py-2 text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <Icon name="refresh" size={14} />
            Reset filters
          </button>

          <div className="h-2" />
        </div>
      )}
    </aside>
  );
}

function PanelHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-surface-50 dark:bg-surface-950 z-10">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{title}</div>
        {subtitle && <div className="text-xs text-surface-600 dark:text-surface-300 mt-0.5">{subtitle}</div>}
      </div>
      {onClose && (
        <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close panel">
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-6 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400 mb-3">
        <Icon name="image" size={20} />
      </div>
      <p className="text-sm text-surface-700 dark:text-surface-200 font-medium">No image selected</p>
      <p className="mt-1 text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
        Select an image on the canvas to adjust brightness, contrast, and effects.
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Slider({ label, min, max, value, onChange, onReset }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-surface-600 dark:text-surface-300 w-9 text-right">{value}</span>
          <button
            onClick={onReset}
            className="text-[11px] text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
            aria-label={`Reset ${label}`}
          >
            Reset
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-1 accent-blue-500"
      />
    </div>
  );
}

function Toggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'rounded-lg border-2 border-blue-500 bg-blue-50 text-surface-900 dark:bg-blue-950/40 dark:text-surface-50 px-2 py-2 text-xs font-medium'
          : 'rounded-lg border border-surface-200 bg-white text-surface-900 hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 px-2 py-2 text-xs font-medium'
      }
    >
      {label}
    </button>
  );
}
