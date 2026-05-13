import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';

export default function LayersPanel({ onClose }) {
  const { canvas } = useEditor();
  const layers = useEditorStore((s) => s.layers);
  const selectedIds = useEditorStore((s) => s.selectedIds);

  function selectLayer(layer) {
    if (!canvas) return;
    canvas.setActiveObject(layer.ref);
    canvas.requestRenderAll();
  }

  function toggleVisibility(layer, e) {
    e.stopPropagation();
    if (!canvas) return;
    layer.ref.visible = !layer.ref.visible;
    canvas.fire('object:modified', { target: layer.ref });
    canvas.requestRenderAll();
  }

  function toggleLock(layer, e) {
    e.stopPropagation();
    if (!canvas) return;
    const isLocked = !!(layer.ref.lockMovementX || layer.ref.lockMovementY);
    layer.ref.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      lockRotation: !isLocked,
      hasControls: isLocked
    });
    layer.ref.setCoords();
    canvas.fire('object:modified', { target: layer.ref });
    canvas.requestRenderAll();
  }

  function moveLayer(layer, dir, e) {
    e.stopPropagation();
    if (!canvas) return;
    if (dir === 'up') canvas.bringForward(layer.ref);
    else canvas.sendBackwards(layer.ref);
    canvas.fire('object:modified', { target: layer.ref });
    canvas.requestRenderAll();
  }

  return (
    <div className="panel border-t border-line flex flex-col h-64 md:h-48 w-full flex-shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-line">
        <div className="panel-heading">Layers</div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-ink-subtle">{layers.length} object{layers.length === 1 ? '' : 's'}</span>
          {onClose && (
            <button className="btn-ghost h-6 w-6 p-0" onClick={onClose} aria-label="Close layers">
              <Icon name="x" size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto thin-scroll">
        {layers.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4 text-center text-xs text-ink-subtle">
            No objects yet. Add an image, text, or shape to start.
          </div>
        ) : (
          <ul>
            {layers.map((layer) => {
              const selected = selectedIds.includes(layer.id);
              const isLocked = !!(layer.ref.lockMovementX || layer.ref.lockMovementY);
              const visible = layer.ref.visible !== false;
              return (
                <li
                  key={layer.id}
                  className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer border-l-2 ${selected ? 'border-brand bg-brand/5' : 'border-transparent hover:bg-surface-2'}`}
                  onClick={() => selectLayer(layer)}
                >
                  <span className="text-ink-subtle"><Icon name={iconFor(layer.type)} size={14} /></span>
                  <span className="flex-1 text-xs text-ink truncate">{layer.name}</span>
                  <button
                    className="btn-ghost h-6 w-6 p-0"
                    onClick={(e) => moveLayer(layer, 'up', e)}
                    title="Bring forward"
                    aria-label="Bring forward"
                  >
                    <Icon name="chevronUp" size={12} />
                  </button>
                  <button
                    className="btn-ghost h-6 w-6 p-0"
                    onClick={(e) => moveLayer(layer, 'down', e)}
                    title="Send backward"
                    aria-label="Send backward"
                  >
                    <Icon name="chevronDown" size={12} />
                  </button>
                  <button
                    className="btn-ghost h-6 w-6 p-0"
                    onClick={(e) => toggleLock(layer, e)}
                    title={isLocked ? 'Unlock' : 'Lock'}
                    aria-label={isLocked ? 'Unlock' : 'Lock'}
                  >
                    <Icon name={isLocked ? 'lock' : 'unlock'} size={12} />
                  </button>
                  <button
                    className="btn-ghost h-6 w-6 p-0"
                    onClick={(e) => toggleVisibility(layer, e)}
                    title={visible ? 'Hide' : 'Show'}
                    aria-label={visible ? 'Hide' : 'Show'}
                  >
                    <Icon name={visible ? 'eye' : 'eyeOff'} size={12} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function iconFor(type) {
  switch (type) {
    case 'i-text':
    case 'text':
    case 'textbox': return 'text';
    case 'rect': return 'square';
    case 'circle': return 'circle';
    case 'line': return 'line';
    case 'image': return 'image';
    case 'group': return 'label';
    default: return 'square';
  }
}
