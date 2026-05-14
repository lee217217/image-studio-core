import { useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { useEditor } from '../../hooks/useEditor.js';
import { useEditorStore } from '../../store/editorStore.js';
import {
  hasAutoSavedProject,
  loadAutoSavedProject,
  clearAutoSavedProject
} from '../../editor/serialization.js';
import { clearCanvas } from '../../editor/editorActions.js';

/**
 * MoreSheet — secondary / housekeeping actions.
 *
 * Rendered as a simple list of full-width rows. Theme is exposed as a
 * one-tap toggle row rather than the desktop sun/moon button so the user
 * can see the current state at a glance.
 */
export default function MoreSheet({ onClose, onOpenNewCanvas, onOpenFrames }) {
  const { canvas, history } = useEditor();
  const theme = useEditorStore((s) => s.theme);
  const toggleTheme = useEditorStore((s) => s.toggleTheme);
  const historyState = useEditorStore((s) => s.history);
  const background = useEditorStore((s) => s.background);
  const showToast = useEditorStore((s) => s.showToast);

  const [restoreVisible, setRestoreVisible] = useState(() => hasAutoSavedProject());
  const [confirmClear, setConfirmClear] = useState(false);

  function handleUndo() {
    history && history.undo();
  }
  function handleRedo() {
    history && history.redo();
  }
  async function handleRestore() {
    if (!canvas) return;
    try {
      await loadAutoSavedProject(canvas);
      setRestoreVisible(false);
      showToast({ type: 'success', message: 'Last project restored.' });
      onClose && onClose();
    } catch {
      showToast({ type: 'error', message: 'Could not restore project.' });
    }
  }
  function handleClearConfirmed() {
    if (!canvas) return;
    clearCanvas(canvas, background);
    clearAutoSavedProject();
    setConfirmClear(false);
    showToast({ type: 'success', message: 'Canvas cleared.' });
    onClose && onClose();
  }
  function handleNewCanvas() {
    onOpenNewCanvas && onOpenNewCanvas();
    onClose && onClose();
  }

  return (
    <div className="px-3 space-y-1.5">
      <Row icon="undo"    label="Undo"    disabled={!historyState.canUndo} onClick={handleUndo} />
      <Row icon="redo"    label="Redo"    disabled={!historyState.canRedo} onClick={handleRedo} />
      <Divider />
      <Row icon="plus"    label="New canvas…"     onClick={handleNewCanvas} />
      <Row icon="frame"   label="Frames"           onClick={() => { onOpenFrames && onOpenFrames(); }} />
      {restoreVisible && (
        <Row icon="refresh" label="Restore last project" onClick={handleRestore} />
      )}
      <Row
        icon={theme === 'dark' ? 'sun' : 'moon'}
        label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
      />
      <Divider />
      <Row icon="trash"   label="Clear canvas"    danger onClick={() => setConfirmClear(true)} />

      <div className="px-2 pt-4 text-[11px] text-ink-subtle">
        Image Studio Core · mobile shell
      </div>

      {confirmClear && (
        <Confirm
          title="Clear the canvas?"
          message="All objects will be removed. You can still use Undo afterwards."
          onCancel={() => setConfirmClear(false)}
          onConfirm={handleClearConfirmed}
        />
      )}
    </div>
  );
}

function Row({ icon, label, onClick, disabled = false, danger = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full h-12 rounded-lg border border-line flex items-center gap-3 px-3 text-left transition',
        disabled
          ? 'opacity-50 cursor-not-allowed bg-surface-1'
          : 'bg-surface-1 hover:bg-surface-2 active:scale-[0.99]',
        danger ? 'text-red-600 dark:text-red-400' : 'text-ink'
      ].join(' ')}
    >
      <Icon name={icon} size={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-line my-1" aria-hidden="true" />;
}

function Confirm({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center modal-backdrop" onClick={onCancel}>
      <div
        className="bg-surface-1 border border-line rounded-lg w-[320px] max-w-[90vw] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" style={{ background: '#dc2626' }} onClick={onConfirm}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
