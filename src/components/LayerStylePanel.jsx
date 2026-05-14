import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  STYLE_PRESETS,
  BLEND_MODES,
  getObjectStyleState,
  isImageObject,
  applyOpacity,
  applyBlendMode,
  applyShadow,
  clearShadow,
  applyStroke,
  clearStroke,
  applyGlow,
  applyStylePreset,
  resetLayerStyle
} from '../editor/layerStyleActions.js';

/**
 * v1.4 Style / Layer Effects panel.
 *
 * Works on the currently active Fabric object. Image objects get a reduced
 * subset (opacity, blend mode, shadow, glow) — stroke is skipped because it
 * doesn't render reliably on Fabric image objects across versions.
 *
 * Mobile-safe: full width on small screens, fixed 320px column on >= md.
 */
export default function LayerStylePanel({ onClose }) {
  const { canvas } = useEditor();
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectionVersion = useEditorStore((s) => s.selectionVersion);

  const active = canvas ? canvas.getActiveObject() : null;
  const isImage = isImageObject(active);

  const [state, setState] = useState(() => getObjectStyleState(active));

  useEffect(() => {
    setState(getObjectStyleState(active));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(','), selectionVersion, active && active.__uid]);

  function refresh() {
    setState(getObjectStyleState(active));
  }

  return (
    <aside className="w-full md:w-80 md:shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll text-surface-900 dark:text-surface-50">
      <PanelHeader title="Style & Effects" subtitle={active ? labelFor(active) : 'Layer effects'} onClose={onClose} />

      {!active ? (
        <EmptyState />
      ) : (
        <div className="p-3 space-y-4">
          {/* Presets */}
          <Section title="Style presets">
            <div className="grid grid-cols-2 gap-2">
              {STYLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { applyStylePreset(canvas, active, p.id); refresh(); }}
                  className="rounded-lg border border-surface-200 bg-white text-surface-900 hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 px-2 py-2 text-xs font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Opacity & blend */}
          <Section title="Blend">
            <Slider
              label="Opacity"
              min={0}
              max={100}
              value={Math.round((state.opacity ?? 1) * 100)}
              onChange={(v) => { applyOpacity(canvas, active, v / 100); refresh(); }}
              onReset={() => { applyOpacity(canvas, active, 1); refresh(); }}
              suffix="%"
            />
            <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2">
              <div className="text-xs font-medium text-surface-700 dark:text-surface-200 mb-1.5">Blend mode</div>
              <select
                value={state.blendMode}
                onChange={(e) => { applyBlendMode(canvas, active, e.target.value); refresh(); }}
                className="w-full rounded-md border border-surface-200 bg-white text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              >
                {BLEND_MODES.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </Section>

          {/* Shadow */}
          <Section title="Shadow">
            <ToggleRow
              label="Drop shadow"
              active={state.shadow.enabled}
              onToggle={(on) => {
                if (on) applyShadow(canvas, active, state.shadow);
                else clearShadow(canvas, active);
                refresh();
              }}
            />
            {state.shadow.enabled && (
              <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2 space-y-2">
                <ColorRow
                  label="Color"
                  value={cssColorOnly(state.shadow.color)}
                  onChange={(c) => { applyShadow(canvas, active, { color: c }); refresh(); }}
                />
                <Slider label="Blur" min={0} max={80} value={state.shadow.blur}
                  onChange={(v) => { applyShadow(canvas, active, { blur: v }); refresh(); }}
                  onReset={() => { applyShadow(canvas, active, { blur: 12 }); refresh(); }} />
                <Slider label="Offset X" min={-40} max={40} value={state.shadow.offsetX}
                  onChange={(v) => { applyShadow(canvas, active, { offsetX: v }); refresh(); }}
                  onReset={() => { applyShadow(canvas, active, { offsetX: 0 }); refresh(); }} />
                <Slider label="Offset Y" min={-40} max={40} value={state.shadow.offsetY}
                  onChange={(v) => { applyShadow(canvas, active, { offsetY: v }); refresh(); }}
                  onReset={() => { applyShadow(canvas, active, { offsetY: 0 }); refresh(); }} />
              </div>
            )}
          </Section>

          {/* Stroke — hidden for images per spec */}
          {!isImage && (
            <Section title="Stroke">
              <ToggleRow
                label="Outline"
                active={state.stroke.enabled}
                onToggle={(on) => {
                  if (on) applyStroke(canvas, active, state.stroke);
                  else clearStroke(canvas, active);
                  refresh();
                }}
              />
              {state.stroke.enabled && (
                <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2 space-y-2">
                  <ColorRow
                    label="Color"
                    value={cssColorOnly(state.stroke.color)}
                    onChange={(c) => { applyStroke(canvas, active, { color: c }); refresh(); }}
                  />
                  <Slider label="Width" min={0} max={40} value={state.stroke.width}
                    onChange={(v) => { applyStroke(canvas, active, { width: v }); refresh(); }}
                    onReset={() => { applyStroke(canvas, active, { width: 2 }); refresh(); }} />
                </div>
              )}
            </Section>
          )}

          {/* Glow */}
          <Section title="Glow">
            <button
              onClick={() => { applyGlow(canvas, active); refresh(); }}
              className="w-full rounded-lg border border-surface-200 bg-white text-surface-900 hover:border-blue-300 hover:bg-blue-50/70 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 px-2 py-2 text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Icon name="sparkle" size={14} />
              Apply soft glow
            </button>
          </Section>

          <button
            onClick={() => { resetLayerStyle(canvas, active); refresh(); }}
            className="w-full rounded-lg border border-surface-200 bg-white text-surface-900 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:bg-surface-800 py-2 text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <Icon name="refresh" size={14} />
            Remove effects
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
        <Icon name="sparkle" size={20} />
      </div>
      <p className="text-sm text-surface-700 dark:text-surface-200 font-medium">Nothing selected</p>
      <p className="mt-1 text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
        Select an object to edit opacity, shadows, stroke, and effects.
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

function Slider({ label, min, max, value, onChange, onReset, suffix = '' }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-surface-600 dark:text-surface-300 w-12 text-right">{value}{suffix}</span>
          <button onClick={onReset} className="text-[11px] text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200">
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

function ToggleRow({ label, active, onToggle }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2 cursor-pointer">
      <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{label}</span>
      <input
        type="checkbox"
        checked={!!active}
        onChange={(e) => onToggle(e.target.checked)}
        className="accent-blue-500 h-4 w-4"
      />
    </label>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-12 rounded border border-surface-200 dark:border-surface-700 bg-transparent cursor-pointer"
      />
    </div>
  );
}

function cssColorOnly(c) {
  // <input type=color> only accepts #rrggbb. Strip rgba() / named colors back
  // to a sensible default so the picker still opens.
  if (typeof c !== 'string') return '#000000';
  if (c.startsWith('#') && (c.length === 7 || c.length === 4)) return c;
  return '#000000';
}

function labelFor(obj) {
  switch (obj.type) {
    case 'image': return 'Image';
    case 'rect': return 'Rectangle';
    case 'circle': return 'Circle';
    case 'line': return 'Line';
    case 'i-text':
    case 'text':
    case 'textbox': return 'Text';
    default: return 'Layer';
  }
}
