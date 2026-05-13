/**
 * Keyboard shortcuts. Skips shortcut handling when the user is typing
 * in an input/textarea/contenteditable element, or while a Fabric.js
 * IText is in editing mode.
 */
export function isEditingTextNode(target) {
  if (!target) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function isCanvasTextEditing(canvas) {
  const obj = canvas && canvas.getActiveObject && canvas.getActiveObject();
  return !!(obj && obj.isEditing);
}

export function makeShortcutHandler({ canvas, handlers }) {
  return function onKeyDown(e) {
    if (isEditingTextNode(e.target)) return;
    if (isCanvasTextEditing(canvas)) return;

    const meta = e.ctrlKey || e.metaKey;
    const key = e.key;

    if (meta && (key === 'z' || key === 'Z')) {
      e.preventDefault();
      if (e.shiftKey) handlers.redo && handlers.redo();
      else handlers.undo && handlers.undo();
      return;
    }
    if (meta && (key === 'y' || key === 'Y')) {
      e.preventDefault();
      handlers.redo && handlers.redo();
      return;
    }
    if (meta && (key === 'd' || key === 'D')) {
      e.preventDefault();
      handlers.duplicate && handlers.duplicate();
      return;
    }
    if (meta && (key === 's' || key === 'S')) {
      e.preventDefault();
      handlers.save && handlers.save();
      return;
    }
    if (key === 'Delete' || key === 'Backspace') {
      e.preventDefault();
      handlers.delete && handlers.delete();
      return;
    }
  };
}
