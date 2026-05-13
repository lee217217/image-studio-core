import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import { describeObject, isTextObject, isLocked, getObjectSize, setObjectSize, typeLabel } from '../utils/objectUtils.js';
import { toHexColor } from '../utils/colorUtils.js';
import {
  alignActive, bringForward, sendBackward, bringToFront, sendToBack,
  deleteActive, duplicateActive, setObjectLocked
} from '../editor/editorActions.js';

const FONT_FAMILIES = ['Inter', 'Helvetica', 'Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Trebuchet MS'];

export default function RightPropertiesPanel() {
  const { canvas } = useEditor();
  const selectionVersion = useEditorStore((s) => s.selectionVersion);
  const background = useEditorStore((s) => s.background);
  const setBackground = useEditorStore((s) => s.setBackground);

  const active = canvas ? canvas.getActiveObject() : null;

  if (!canvas) {
    return <aside className="w-72 flex-shrink-0 border-l border-line bg-surface-1" />;
  }

  return (
    <aside className="w-72 flex-shrink-0 border-l border-line bg-surface-1 flex flex-col min-h-0">
      <div className="px-4 py-3 border-b border-line">
        <div className="panel-heading">Properties</div>
        <div className="mt-1 text-sm font-medium text-ink">
          {active ? describeObject(active) : 'Canvas'}
        </div>
        {active && (
          <div className="text-[11px] text-ink-subtle">{typeLabel(active.type)}</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll">
        {active ? (
          <ObjectProperties canvas={canvas} active={active} version={selectionVersion} />
        ) : (
          <CanvasProperties canvas={canvas} background={background} setBackground={setBackground} />
        )}
      </div>
    </aside>
  );
}

function CanvasProperties({ canvas, background, setBackground }) {
  return (
    <div className="p-4 space-y-5">
      <Section title="Canvas">
        <Row label="Width">
          <input
            type="number"
            className="input-base"
            value={Math.round(canvas.getWidth())}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (Number.isFinite(v) && v > 0) {
                canvas.setWidth(v);
                canvas.fire('object:modified');
              }
            }}
          />
        </Row>
        <Row label="Height">
          <input
            type="number"
            className="input-base"
            value={Math.round(canvas.getHeight())}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (Number.isFinite(v) && v > 0) {
                canvas.setHeight(v);
                canvas.fire('object:modified');
              }
            }}
          />
        </Row>
        <Row label="Background">
          <ColorInput value={background} onChange={setBackground} />
        </Row>
      </Section>

      <div className="rounded-md border border-dashed border-line p-3 text-center">
        <div className="text-[11px] font-medium text-ink-subtle">Tip</div>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          Select an object on the canvas to edit its properties here.
        </p>
      </div>
    </div>
  );
}

function ObjectProperties({ canvas, active, version }) {
  // We use the version counter as a dependency so input values stay in sync
  // when the user drags / resizes the object on the canvas.
  const [, force] = useState(0);
  useEffect(() => { force((n) => n + 1); }, [version]);

  const size = getObjectSize(active);
  const locked = isLocked(active);

  const update = (props) => {
    active.set(props);
    active.setCoords();
    canvas.fire('object:modified', { target: active });
    canvas.requestRenderAll();
  };

  return (
    <div className="p-4 space-y-5">
      <Section title="Position & Size">
        <div className="grid grid-cols-2 gap-2">
          <Row label="X">
            <input
              type="number"
              className="input-base"
              value={Math.round(active.left || 0)}
              onChange={(e) => update({ left: parseFloat(e.target.value) || 0 })}
            />
          </Row>
          <Row label="Y">
            <input
              type="number"
              className="input-base"
              value={Math.round(active.top || 0)}
              onChange={(e) => update({ top: parseFloat(e.target.value) || 0 })}
            />
          </Row>
          <Row label="W">
            <input
              type="number"
              className="input-base"
              value={Math.round(size.width)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (Number.isFinite(v) && v > 0) {
                  setObjectSize(active, v, size.height);
                  canvas.fire('object:modified', { target: active });
                  canvas.requestRenderAll();
                }
              }}
            />
          </Row>
          <Row label="H">
            <input
              type="number"
              className="input-base"
              value={Math.round(size.height)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (Number.isFinite(v) && v > 0) {
                  setObjectSize(active, size.width, v);
                  canvas.fire('object:modified', { target: active });
                  canvas.requestRenderAll();
                }
              }}
            />
          </Row>
        </div>
        <Row label="Rotation">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-180"
              max="180"
              value={Math.round(active.angle || 0)}
              onChange={(e) => update({ angle: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <input
              type="number"
              className="input-base w-16"
              value={Math.round(active.angle || 0)}
              onChange={(e) => update({ angle: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </Row>
        <Row label="Opacity">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={active.opacity != null ? active.opacity : 1}
              onChange={(e) => update({ opacity: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <span className="text-xs text-ink-muted w-10 text-right">
              {Math.round((active.opacity != null ? active.opacity : 1) * 100)}%
            </span>
          </div>
        </Row>
      </Section>

      {active.fill !== undefined && active.type !== 'image' && (
        <Section title="Appearance">
          <Row label="Fill">
            <ColorInput
              value={toHexColor(active.fill, '#000000')}
              onChange={(c) => update({ fill: c })}
              allowNone
              onClear={() => update({ fill: 'transparent' })}
            />
          </Row>
          <Row label="Stroke">
            <ColorInput
              value={toHexColor(active.stroke, '#000000')}
              onChange={(c) => update({ stroke: c })}
              allowNone
              onClear={() => update({ stroke: null })}
            />
          </Row>
          <Row label="Stroke width">
            <input
              type="number"
              min="0"
              max="60"
              className="input-base"
              value={active.strokeWidth || 0}
              onChange={(e) => update({ strokeWidth: Math.max(0, parseFloat(e.target.value) || 0) })}
            />
          </Row>
        </Section>
      )}

      {isTextObject(active) && (
        <Section title="Text">
          <Row label="Font">
            <select
              className="input-base"
              value={active.fontFamily || 'Inter'}
              onChange={(e) => update({ fontFamily: e.target.value })}
            >
              {FONT_FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Row>
          <Row label="Size">
            <input
              type="number"
              min="6"
              max="400"
              className="input-base"
              value={active.fontSize || 16}
              onChange={(e) => update({ fontSize: parseFloat(e.target.value) || 16 })}
            />
          </Row>
          <Row label="Color">
            <ColorInput
              value={toHexColor(active.fill, '#000000')}
              onChange={(c) => update({ fill: c })}
            />
          </Row>
          <Row label="Align">
            <div className="flex rounded-md overflow-hidden border border-line">
              {['left', 'center', 'right'].map((a) => (
                <button
                  key={a}
                  className={`flex-1 px-2 py-1.5 text-xs ${active.textAlign === a ? 'bg-brand text-white' : 'bg-surface-1 text-ink-muted hover:bg-surface-2'}`}
                  onClick={() => update({ textAlign: a })}
                >
                  {a[0].toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </Row>
          <Row label="Weight">
            <div className="flex rounded-md overflow-hidden border border-line">
              {[
                { v: '400', label: 'Regular' },
                { v: '600', label: 'Semibold' },
                { v: '700', label: 'Bold' }
              ].map((w) => (
                <button
                  key={w.v}
                  className={`flex-1 px-2 py-1.5 text-xs ${String(active.fontWeight) === w.v ? 'bg-brand text-white' : 'bg-surface-1 text-ink-muted hover:bg-surface-2'}`}
                  onClick={() => update({ fontWeight: w.v })}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </Row>
        </Section>
      )}

      <Section title="Align to canvas">
        <div className="grid grid-cols-3 gap-1">
          {[
            { t: 'left', icon: 'alignLeft' },
            { t: 'center', icon: 'alignCenter' },
            { t: 'right', icon: 'alignRight' },
            { t: 'top', icon: 'alignTop' },
            { t: 'middle', icon: 'alignMiddle' },
            { t: 'bottom', icon: 'alignBottom' }
          ].map(({ t, icon }) => (
            <button
              key={t}
              className="btn-secondary"
              onClick={() => alignActive(canvas, t)}
              title={`Align ${t}`}
              aria-label={`Align ${t}`}
            >
              <Icon name={icon} size={16} />
            </button>
          ))}
        </div>
      </Section>

      <Section title="Layer">
        <div className="grid grid-cols-2 gap-1">
          <button className="btn-secondary" onClick={() => bringForward(canvas)}>
            <Icon name="forward" size={14} /> Forward
          </button>
          <button className="btn-secondary" onClick={() => sendBackward(canvas)}>
            <Icon name="backward" size={14} /> Backward
          </button>
          <button className="btn-secondary" onClick={() => bringToFront(canvas)}>
            <Icon name="forward" size={14} /> To Front
          </button>
          <button className="btn-secondary" onClick={() => sendToBack(canvas)}>
            <Icon name="backward" size={14} /> To Back
          </button>
        </div>
      </Section>

      <Section title="Actions">
        <div className="grid grid-cols-2 gap-1">
          <button className="btn-secondary" onClick={() => duplicateActive(canvas)}>
            <Icon name="copy" size={14} /> Duplicate
          </button>
          <button
            className="btn-secondary"
            onClick={() => { setObjectLocked(canvas, active, !locked); canvas.fire('object:modified', { target: active }); }}
          >
            <Icon name={locked ? 'unlock' : 'lock'} size={14} /> {locked ? 'Unlock' : 'Lock'}
          </button>
          <button
            className="btn-secondary col-span-2"
            style={{ color: '#dc2626' }}
            onClick={() => deleteActive(canvas)}
          >
            <Icon name="trash" size={14} /> Delete
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="panel-heading mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <label className="block">
      <span className="field-label block mb-1">{label}</span>
      {children}
    </label>
  );
}

function ColorInput({ value, onChange, allowNone, onClear }) {
  const hex = (value && typeof value === 'string' && value.startsWith('#')) ? value : '#000000';
  return (
    <div className="flex items-center gap-1">
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-9 rounded border border-line bg-surface-1 cursor-pointer"
        aria-label="Color"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-base flex-1 font-mono text-xs"
      />
      {allowNone && (
        <button
          className="btn-ghost h-7 w-7 p-0"
          onClick={onClear}
          title="None"
          aria-label="No color"
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
