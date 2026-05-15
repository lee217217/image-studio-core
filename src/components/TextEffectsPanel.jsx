import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import ChipStrip from './ChipStrip.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  isTextObject,
  getTextEffects,
  applyTextEffects,
  applyTextPreset,
  clearTextEffects,
  TEXT_PRESETS,
} from '../editor/textEffects.js';

/**
 * Text Effects panel — operates on the currently selected fabric.IText /
 * fabric.Textbox. Provides a row of preset chips plus discrete controls for
 * stroke, shadow/glow, gradient, 3D extrude, and curve.
 */
export default function TextEffectsPanel({ onClose }) {
  const { canvas } = useEditor();
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectionVersion = useEditorStore((s) => s.selectionVersion);

  const active = canvas ? canvas.getActiveObject() : null;
  const target = isTextObject(active) ? active : null;

  const [fx, setFx] = useState(target ? getTextEffects(target) : null);
  useEffect(() => {
    setFx(target ? getTextEffects(target) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(','), selectionVersion, target && target.__uid]);

  function commit(partial) {
    if (!canvas || !target) return;
    const next = applyTextEffects(canvas, target, partial);
    setFx(next);
  }

  function onPreset(id) {
    if (!canvas || !target) return;
    const next = applyTextPreset(canvas, target, id);
    setFx(next);
  }

  function onClear() {
    if (!canvas || !target) return;
    setFx(clearTextEffects(canvas, target));
  }

  const presetChipItems = TEXT_PRESETS.map((p) => ({
    id: p.id,
    ariaLabel: `Apply text style ${p.label}`,
    render: () => (
      <div className="flex flex-col items-center justify-center text-center h-full">
        <div
          className="text-xl font-bold mb-1"
          style={presetSwatchStyle(p.effects)}
        >
          Aa
        </div>
        <div className="text-[11px] font-semibold leading-tight">{p.label}</div>
      </div>
    ),
  }));

  return (
    <aside className="w-full md:w-80 md:shrink-0 border-r border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 overflow-y-auto thin-scroll text-surface-900 dark:text-surface-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-surface-50 dark:bg-surface-950 z-10">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Text Effects</div>
          <div className="text-xs text-surface-600 dark:text-surface-300 mt-0.5">Stroke · Shadow · Gradient · Curve</div>
        </div>
        {onClose && (
          <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close text effects">
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      {!target ? (
        <div className="p-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400 mb-3">
            <Icon name="text" size={20} />
          </div>
          <p className="text-sm text-surface-700 dark:text-surface-200 font-medium">No text selected</p>
          <p className="mt-1 text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
            Select a text layer on the canvas to apply styles.
          </p>
        </div>
      ) : (
        <div className="p-3 space-y-4">
          <Section title="Presets">
            <ChipStrip items={presetChipItems} activeId={fx && fx.__presetId} onTap={onPreset} resetKey="text-presets" />
          </Section>

          <Section title="Stroke">
            <RowToggle
              label="Stroke"
              active={!!fx.stroke}
              onToggle={(v) => commit({ stroke: v ? { color: '#111111', width: 3 } : null })}
            />
            {fx.stroke && (
              <>
                <ColorRow label="Color" value={fx.stroke.color} onChange={(v) => commit({ stroke: { ...fx.stroke, color: v } })} />
                <RangeRow label="Width" min={0} max={20} value={fx.stroke.width} onChange={(v) => commit({ stroke: { ...fx.stroke, width: v } })} />
              </>
            )}
          </Section>

          <Section title="Shadow">
            <RowToggle
              label="Shadow"
              active={!!fx.shadow}
              onToggle={(v) => commit({ shadow: v ? { color: 'rgba(0,0,0,0.35)', blur: 12, offsetX: 4, offsetY: 6 } : null, glow: null })}
            />
            {fx.shadow && (
              <>
                <ColorRow label="Color" value={hexFromRgba(fx.shadow.color)} onChange={(v) => commit({ shadow: { ...fx.shadow, color: v } })} />
                <RangeRow label="Blur"   min={0} max={40} value={fx.shadow.blur}    onChange={(v) => commit({ shadow: { ...fx.shadow, blur: v } })} />
                <RangeRow label="Offset X" min={-30} max={30} value={fx.shadow.offsetX} onChange={(v) => commit({ shadow: { ...fx.shadow, offsetX: v } })} />
                <RangeRow label="Offset Y" min={-30} max={30} value={fx.shadow.offsetY} onChange={(v) => commit({ shadow: { ...fx.shadow, offsetY: v } })} />
              </>
            )}
          </Section>

          <Section title="Glow">
            <RowToggle
              label="Glow"
              active={!!fx.glow}
              onToggle={(v) => commit({ glow: v ? { color: '#ff2bd0', blur: 22 } : null, shadow: null })}
            />
            {fx.glow && (
              <>
                <ColorRow label="Color" value={fx.glow.color} onChange={(v) => commit({ glow: { ...fx.glow, color: v } })} />
                <RangeRow label="Blur" min={0} max={60} value={fx.glow.blur} onChange={(v) => commit({ glow: { ...fx.glow, blur: v } })} />
              </>
            )}
          </Section>

          <Section title="Gradient Fill">
            <RowToggle
              label="Gradient"
              active={!!fx.gradient}
              onToggle={(v) => commit({ gradient: v ? { type: 'linear', angle: 90, stops: [[0, '#ff9966'], [1, '#ff5e62']] } : null })}
            />
            {fx.gradient && (
              <>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => commit({ gradient: { ...fx.gradient, type: 'linear' } })}
                    className={tabBtnClass(fx.gradient.type === 'linear')}
                  >Linear</button>
                  <button
                    onClick={() => commit({ gradient: { ...fx.gradient, type: 'radial' } })}
                    className={tabBtnClass(fx.gradient.type === 'radial')}
                  >Radial</button>
                </div>
                <ColorRow label="Stop 1" value={fx.gradient.stops[0][1]} onChange={(v) => commit({ gradient: { ...fx.gradient, stops: [[0, v], fx.gradient.stops[1]] } })} />
                <ColorRow label="Stop 2" value={fx.gradient.stops[1][1]} onChange={(v) => commit({ gradient: { ...fx.gradient, stops: [fx.gradient.stops[0], [1, v]] } })} />
                {fx.gradient.type === 'linear' && (
                  <RangeRow label="Angle" min={0} max={360} value={fx.gradient.angle || 0} onChange={(v) => commit({ gradient: { ...fx.gradient, angle: v } })} />
                )}
              </>
            )}
          </Section>

          <Section title="3D Extrude">
            <RowToggle
              label="3D"
              active={!!fx.extrude3d}
              onToggle={(v) => commit({ extrude3d: v ? { depth: 8, color: '#fbbf24' } : null })}
            />
            {fx.extrude3d && (
              <>
                <RangeRow label="Depth" min={1} max={20} value={fx.extrude3d.depth} onChange={(v) => commit({ extrude3d: { ...fx.extrude3d, depth: v } })} />
                <ColorRow label="Color" value={fx.extrude3d.color} onChange={(v) => commit({ extrude3d: { ...fx.extrude3d, color: v } })} />
              </>
            )}
          </Section>

          <Section title="Curve">
            <RowToggle
              label="Curve"
              active={!!fx.curve}
              onToggle={(v) => commit({ curve: v ? { angle: 30 } : null })}
            />
            {fx.curve && (
              <RangeRow label="Angle" min={-90} max={90} value={fx.curve.angle} onChange={(v) => commit({ curve: { angle: v } })} />
            )}
          </Section>

          <button
            onClick={onClear}
            className="w-full rounded-lg border border-surface-200 bg-white text-surface-900 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-50 dark:hover:bg-surface-800 py-2 text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <Icon name="refresh" size={14} />
            Clear text effects
          </button>

          <div className="h-2" />
        </div>
      )}
    </aside>
  );
}

function presetSwatchStyle(eff) {
  const style = {};
  if (eff.gradient && eff.gradient.stops) {
    const [a, b] = eff.gradient.stops;
    style.background = `linear-gradient(${eff.gradient.angle || 90}deg, ${a[1]}, ${b[1]})`;
    style.WebkitBackgroundClip = 'text';
    style.WebkitTextFillColor = 'transparent';
  } else if (eff.glow) {
    style.color = eff.glow.color;
    style.textShadow = `0 0 8px ${eff.glow.color}`;
  } else if (eff.extrude3d) {
    style.color = eff.extrude3d.color;
    style.textShadow = `2px 2px 0 #111, 4px 4px 0 #111`;
  } else if (eff.stroke) {
    style.color = '#fff';
    style.WebkitTextStroke = `${Math.min(2, eff.stroke.width || 1)}px ${eff.stroke.color}`;
  } else if (eff.shadow) {
    style.color = '#111';
    style.textShadow = `${eff.shadow.offsetX || 2}px ${eff.shadow.offsetY || 2}px ${eff.shadow.blur || 4}px ${eff.shadow.color}`;
  } else {
    style.color = '#111';
  }
  return style;
}

function hexFromRgba(c) {
  if (!c) return '#000000';
  if (c.startsWith('#')) return c;
  return '#000000';
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function RowToggle({ label, active, onToggle }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2">
      <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{label}</span>
      <button
        onClick={() => onToggle(!active)}
        className={
          active
            ? 'h-6 w-11 rounded-full bg-blue-500 relative transition-colors'
            : 'h-6 w-11 rounded-full bg-surface-300 dark:bg-surface-700 relative transition-colors'
        }
        aria-label={`Toggle ${label}`}
      >
        <span
          className={
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ' +
            (active ? 'translate-x-5' : 'translate-x-0.5')
          }
        />
      </button>
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2 flex items-center justify-between">
      <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{label}</span>
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-9 rounded cursor-pointer border border-surface-300 dark:border-surface-700 bg-transparent"
      />
    </div>
  );
}

function RangeRow({ label, min, max, value, onChange }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-surface-700 dark:text-surface-200">{label}</span>
        <span className="text-xs tabular-nums text-surface-600 dark:text-surface-300 w-9 text-right">{value}</span>
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

function tabBtnClass(active) {
  return active
    ? 'px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500 text-white'
    : 'px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-200 dark:hover:bg-surface-700';
}
