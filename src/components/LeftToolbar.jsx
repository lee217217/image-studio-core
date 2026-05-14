import { useRef } from 'react';
import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  addText, addRect, addCircle, addLine, addArrow, addLabel, addImageFromFile
} from '../editor/editorActions.js';

/**
 * LeftToolbar.
 *
 * Two layouts share the same logic:
 *   - Desktop (`mobile = false`): vertical 56px column on the left.
 *   - Mobile  (`mobile = true`):  horizontal 64px bar fixed at the bottom of
 *                                 the viewport (positioned by App.jsx).
 *
 * The same buttons are exposed in both layouts. Panel toggles map to the
 * activePanel values: templates | crop | adjust | style | layers | ai.
 */
export default function LeftToolbar({ activePanel, onActivatePanel, mobile = false }) {
  const { canvas } = useEditor();
  const fileRef = useRef(null);
  const showToast = useEditorStore((s) => s.showToast);

  function pickFile() {
    fileRef.current && fileRef.current.click();
  }

  async function onFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file || !canvas) return;
    try {
      await addImageFromFile(canvas, file);
    } catch (err) {
      showToast({ type: 'error', message: err.message || 'Could not load image.' });
    }
  }

  function safe(fn) {
    return () => { if (canvas) fn(canvas); };
  }

  // Object-creation tools — always visible.
  const objectButtons = [
    { name: 'Select', icon: 'cursor', onClick: () => { if (canvas) { canvas.discardActiveObject(); canvas.requestRenderAll(); } } },
    { name: 'Upload image', icon: 'image', onClick: pickFile },
    { name: 'Add text', icon: 'text', onClick: safe(addText) },
    { name: 'Add rectangle', icon: 'square', onClick: safe(addRect) },
    { name: 'Add circle', icon: 'circle', onClick: safe(addCircle) },
    { name: 'Add line', icon: 'line', onClick: safe(addLine) },
    { name: 'Add arrow', icon: 'arrow', onClick: safe(addArrow) },
    { name: 'Add label', icon: 'label', onClick: safe(addLabel) }
  ];

  // Panel toggle buttons. Icons fall back to existing names — there's no
  // dedicated `crop` icon in Icon.jsx, so we reuse `fit`.
  const panelButtons = [
    { key: 'templates', name: 'Templates', icon: 'template' },
    { key: 'crop',      name: 'Crop & shape', icon: 'fit' },
    { key: 'adjust',    name: 'Photo adjust', icon: 'image' },
    { key: 'style',     name: 'Style & effects', icon: 'sparkle' },
    { key: 'layers',    name: 'Layers', icon: 'layers' },
    { key: 'ai',        name: 'AI tools', icon: 'sparkle' }
  ];

  const asideClass = mobile
    ? 'h-16 w-full border-t border-line bg-surface-1 flex items-center gap-1 overflow-x-auto px-2 thin-scroll'
    : 'w-14 flex-shrink-0 border-r border-line bg-surface-1 flex flex-col items-center py-2 gap-1';

  const divider = mobile
    ? <div className="w-px h-8 bg-line mx-1 shrink-0" />
    : <div className="w-8 h-px bg-line my-1" />;

  return (
    <aside className={asideClass} aria-label="Toolbar">
      {objectButtons.map((b) => (
        <button
          key={b.name}
          className="tool-btn shrink-0"
          title={b.name}
          aria-label={b.name}
          onClick={b.onClick}
        >
          <Icon name={b.icon} size={20} />
        </button>
      ))}

      {divider}

      {panelButtons.map((b) => (
        <button
          key={b.key}
          className={`tool-btn shrink-0 ${activePanel === b.key ? 'tool-btn-active' : ''}`}
          title={b.name}
          aria-label={b.name}
          onClick={() => onActivatePanel(activePanel === b.key ? null : b.key)}
        >
          <Icon name={b.icon} size={20} />
        </button>
      ))}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </aside>
  );
}
