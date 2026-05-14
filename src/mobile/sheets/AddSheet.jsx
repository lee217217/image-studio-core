import { useRef } from 'react';
import Icon from '../../components/Icon.jsx';
import { useEditor } from '../../hooks/useEditor.js';
import { useEditorStore } from '../../store/editorStore.js';
import {
  addText, addRect, addCircle, addLine, addArrow, addLabel, addImageFromFile
} from '../../editor/editorActions.js';
import TemplatePanel from '../../components/TemplatePanel.jsx';

/**
 * AddSheet — primary entry point for putting content on the canvas.
 *
 * 2-column grid of big 56px tap targets for each primitive plus image
 * upload. Templates appear as a section below so the user can also seed
 * a full layout in one tap.
 */
export default function AddSheet({ onClose }) {
  const { canvas } = useEditor();
  const showToast = useEditorStore((s) => s.showToast);
  const fileRef = useRef(null);

  function add(fn) {
    if (!canvas) return;
    fn(canvas);
    // Close so the user immediately sees what they added.
    onClose && onClose();
  }

  function pickImage() {
    fileRef.current && fileRef.current.click();
  }

  async function onFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file || !canvas) return;
    try {
      await addImageFromFile(canvas, file);
      showToast({ type: 'success', message: 'Image added.' });
      onClose && onClose();
    } catch (err) {
      showToast({ type: 'error', message: err.message || 'Could not load image.' });
    }
  }

  const items = [
    { label: 'Text',      icon: 'text',   onClick: () => add(addText) },
    { label: 'Rectangle', icon: 'square', onClick: () => add(addRect) },
    { label: 'Circle',    icon: 'circle', onClick: () => add(addCircle) },
    { label: 'Line',      icon: 'line',   onClick: () => add(addLine) },
    { label: 'Arrow',     icon: 'arrow',  onClick: () => add(addArrow) },
    { label: 'Label',     icon: 'label',  onClick: () => add(addLabel) },
    { label: 'Image',     icon: 'image',  onClick: pickImage },
  ];

  return (
    <div className="px-3">
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={it.onClick}
            className="h-14 rounded-xl border border-line bg-surface-1 hover:bg-surface-2 active:scale-[0.98] transition flex items-center gap-3 px-4 text-sm font-medium text-ink"
          >
            <Icon name={it.icon} size={20} />
            <span>{it.label}</span>
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />

      {/*
        Templates section — reuses the existing TemplatePanel inline. It
        renders its own "Templates" header and a vertical list, so we just
        wrap it in a rounded card. We hide the panel's close button by
        passing a no-op onClose, since we don't want it to close the sheet
        when the user just wants to seed a template.
      */}
      <div className="mt-5 rounded-xl overflow-hidden border border-line">
        <TemplatePanel onClose={() => { /* keep sheet open after template apply */ }} />
      </div>
    </div>
  );
}
