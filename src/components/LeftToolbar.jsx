import { useRef } from 'react';
import Icon from './Icon.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import {
  addText,
  addRect,
  addCircle,
  addLine,
  addArrow,
  addLabel,
  addImageFromFile
} from '../editor/editorActions.js';

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
      showToast({
        type: 'error',
        message: err.message || 'Could not load image.'
      });
    }
  }

  function safe(fn) {
    return () => {
      if (canvas) fn(canvas);
    };
  }

  function togglePanel(panelName) {
    onActivatePanel(activePanel === panelName ? null : panelName);
  }

  const buttons = [
    {
      name: 'Select',
      icon: 'cursor',
      onClick: () => {
        if (canvas) {
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    },
    { name: 'Upload image', icon: 'image', onClick: pickFile },
    { name: 'Add text', icon: 'text', onClick: safe(addText) },
    { name: 'Add rectangle', icon: 'square', onClick: safe(addRect) },
    { name: 'Add circle', icon: 'circle', onClick: safe(addCircle) },
    { name: 'Add line', icon: 'line', onClick: safe(addLine) },
    { name: 'Add arrow', icon: 'arrow', onClick: safe(addArrow) },
    { name: 'Add label', icon: 'label', onClick: safe(addLabel) }
  ];

  return (
    <aside
  className={
    mobile
      ? 'h-16 w-full border-t border-line bg-surface-1 flex items-center gap-1 overflow-x-auto px-2'
      : 'w-14 flex-shrink-0 border-r border-line bg-surface-1 flex flex-col items-center py-2 gap-1'
  }
>
      {buttons.map((b) => (
        <button
          key={b.name}
          className="tool-btn"
          title={b.name}
          aria-label={b.name}
          onClick={b.onClick}
          type="button"
        >
          <Icon name={b.icon} size={20} />
        </button>
      ))}

      <div className={mobile ? 'h-8 w-px bg-line mx-1 shrink-0' : 'w-8 h-px bg-line my-1'} />

     <button
  type="button"
  className={`tool-btn shrink-0 ${activePanel === 'crop' ? 'tool-btn-active' : ''}`}
  title="Templates"
  aria-label="Templates"
  onClick={() => togglePanel('templates')}
>
  <Icon name="square" size={20} />
</button>

<button
  type="button"
  className={`tool-btn shrink-0 ${activePanel === 'crop' ? 'tool-btn-active' : ''}`}
  title="Crop / Resize"
  aria-label="Crop / Resize"
  onClick={() => togglePanel('crop')}
>
  <Icon name="square" size={20} />
</button>

<button
  type="button"
  className={`tool-btn shrink-0 ${activePanel === 'crop' ? 'tool-btn-active' : ''}`}
  title="Photo Adjustments"
  aria-label="Photo Adjustments"
  onClick={() => togglePanel('adjust')}
>
  <Icon name="image" size={20} />
</button>

<button
  type="button"
  className={`tool-btn shrink-0 ${activePanel === 'crop' ? 'tool-btn-active' : ''}`}
  title="Layers"
  aria-label="Layers"
  onClick={() => togglePanel('layers')}
>
  <Icon name="layers" size={20} />
</button>

<button
  type="button"
  className={`tool-btn shrink-0 ${activePanel === 'crop' ? 'tool-btn-active' : ''}`}
  title="AI tools (coming soon)"
  aria-label="AI tools"
  onClick={() => togglePanel('ai')}
>
  <Icon name="sparkle" size={20} />
</button>



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