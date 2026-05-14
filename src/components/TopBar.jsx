import { useRef, useState } from 'react';
import Icon from './Icon.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useEditor } from '../hooks/useEditor.js';
import { useEditorStore } from '../store/editorStore.js';
import { downloadProjectJson, loadProjectFromFile, hasAutoSavedProject, loadAutoSavedProject, clearAutoSavedProject } from '../editor/serialization.js';
import { downloadCanvasImage } from '../editor/exportUtils.js';
import { clearCanvas } from '../editor/editorActions.js';

const T = {
  appName: 'Image Studio Core',
  newCanvas: 'New canvas',
  openProject: 'Open project',
  saveProject: 'Save project',
  exportPng: 'Export PNG',
  exportJpg: 'Export JPG',
  undo: 'Undo',
  redo: 'Redo',
  clear: 'Clear canvas',
  restoreLast: 'Restore last project'
};

export default function TopBar({ onOpenSizeModal }) {
  const { canvas, history } = useEditor();
  const fileRef = useRef(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const historyState = useEditorStore((s) => s.history);
  const showToast = useEditorStore((s) => s.showToast);
  const background = useEditorStore((s) => s.background);
  const [restoreVisible, setRestoreVisible] = useState(() => hasAutoSavedProject());

  function handleOpen() {
    fileRef.current && fileRef.current.click();
  }

  async function onFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file || !canvas) return;
    try {
      await loadProjectFromFile(canvas, file);
      showToast({ type: 'success', message: 'Project loaded.' });
    } catch (err) {
      showToast({ type: 'error', message: err.message || 'Could not load project.' });
    }
  }

  function handleSave() {
    if (!canvas) return;
    downloadProjectJson(canvas);
    showToast({ type: 'success', message: 'Project saved as JSON.' });
  }

  function handleExportPng() {
    if (!canvas) return;
    downloadCanvasImage(canvas, 'png');
    showToast({ type: 'success', message: 'PNG exported.' });
  }

  function handleExportJpg() {
    if (!canvas) return;
    downloadCanvasImage(canvas, 'jpg');
    showToast({ type: 'success', message: 'JPG exported.' });
  }

  async function handleRestore() {
    if (!canvas) return;
    try {
      await loadAutoSavedProject(canvas);
      setRestoreVisible(false);
      showToast({ type: 'success', message: 'Last project restored.' });
    } catch {
      showToast({ type: 'error', message: 'Could not restore project.' });
    }
  }

  function performClear() {
    if (!canvas) return;
    clearCanvas(canvas, background);
    clearAutoSavedProject();
    setConfirmClear(false);
    showToast({ type: 'success', message: 'Canvas cleared.' });
  }

  return (
    <header className="h-12 flex-shrink-0 flex items-center px-2 md:px-3 gap-1 md:gap-2 border-b border-line bg-surface-1 overflow-x-auto thin-scroll">
      <div className="flex items-center gap-2 pr-2 md:pr-3 border-r border-line shrink-0">
        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center text-white">
          <Icon name="image" size={16} strokeWidth={2} />
        </div>
        <span className="hidden sm:inline text-sm font-semibold text-ink">{T.appName}</span>
      </div>

      <button className="btn-ghost shrink-0" onClick={onOpenSizeModal} aria-label={T.newCanvas}>
        <Icon name="plus" size={16} />
        <span className="hidden sm:inline">{T.newCanvas}</span>
      </button>

      <button className="btn-ghost shrink-0" onClick={handleOpen} aria-label={T.openProject}>
        <Icon name="upload" size={16} />
        <span className="hidden sm:inline">Open</span>
      </button>

      <button className="btn-ghost shrink-0" onClick={handleSave} aria-label={T.saveProject}>
        <Icon name="save" size={16} />
        <span className="hidden sm:inline">Save</span>
      </button>

      <div className="hidden md:block w-px h-5 bg-line mx-1" />

      <button
        className="btn-ghost shrink-0 hidden md:flex"
        onClick={() => history && history.undo()}
        disabled={!historyState.canUndo}
        aria-label={T.undo}
      >
        <Icon name="undo" size={16} />
      </button>
      <button
        className="btn-ghost shrink-0 hidden md:flex"
        onClick={() => history && history.redo()}
        disabled={!historyState.canRedo}
        aria-label={T.redo}
      >
        <Icon name="redo" size={16} />
      </button>

      <div className="flex-1" />

      {restoreVisible && (
        <button className="btn-ghost shrink-0 hidden md:flex" onClick={handleRestore}>
          <Icon name="refresh" size={16} />
          <span>{T.restoreLast}</span>
        </button>
      )}

      <button className="btn-ghost shrink-0" onClick={() => setConfirmClear(true)} aria-label={T.clear}>
        <Icon name="trash" size={16} />
        <span className="hidden md:inline">Clear</span>
      </button>

      <div className="hidden md:block w-px h-5 bg-line mx-1" />

      <button className="btn-secondary shrink-0 hidden md:flex" onClick={handleExportJpg}>
        <Icon name="download" size={16} />
        <span>JPG</span>
      </button>
      <button className="btn-primary shrink-0 hidden md:flex" onClick={handleExportPng}>
        <Icon name="download" size={16} />
        <span>PNG</span>
      </button>

      <div className="hidden md:block">
        <ThemeToggle />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onFile}
      />

      {confirmClear && (
        <ConfirmDialog
          title="Clear canvas?"
          message="All objects on the canvas will be removed. This cannot be undone with one click — but you can still use Undo."
          confirmLabel="Clear"
          onCancel={() => setConfirmClear(false)}
          onConfirm={performClear}
        />
      )}
    </header>
  );
}

function ConfirmDialog({ title, message, confirmLabel, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onCancel}>
      <div
        className="bg-surface-1 border border-line rounded-lg w-[420px] max-w-[90vw] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" style={{ background: '#dc2626' }} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
