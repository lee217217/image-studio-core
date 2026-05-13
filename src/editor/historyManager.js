/**
 * Simple snapshot-based history for a Fabric canvas.
 *
 * We push JSON snapshots into an undo stack and a redo stack. The manager
 * exposes a `suspend()` helper so programmatic mutations (e.g. undo itself)
 * don't recursively push new states.
 */
export function createHistoryManager(canvas, { limit = 60 } = {}) {
  const undoStack = [];
  const redoStack = [];
  let suspended = false;
  let listeners = new Set();

  function emit() {
    const state = { canUndo: undoStack.length > 1, canRedo: redoStack.length > 0 };
    listeners.forEach((fn) => fn(state));
  }

  function snapshot() {
    return JSON.stringify(canvas.toJSON(['name', 'lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation', 'selectable', 'evented']));
  }

  function record() {
    if (suspended) return;
    const snap = snapshot();
    const top = undoStack[undoStack.length - 1];
    if (top === snap) return;
    undoStack.push(snap);
    if (undoStack.length > limit) undoStack.shift();
    redoStack.length = 0;
    emit();
  }

  function applyState(snap) {
    suspended = true;
    canvas.loadFromJSON(snap, () => {
      canvas.renderAll();
      suspended = false;
      emit();
    });
  }

  function undo() {
    if (undoStack.length <= 1) return;
    const current = undoStack.pop();
    redoStack.push(current);
    const prev = undoStack[undoStack.length - 1];
    applyState(prev);
  }

  function redo() {
    if (redoStack.length === 0) return;
    const next = redoStack.pop();
    undoStack.push(next);
    applyState(next);
  }

  function reset() {
    undoStack.length = 0;
    redoStack.length = 0;
    undoStack.push(snapshot());
    emit();
  }

  function suspend(fn) {
    suspended = true;
    try { fn(); } finally { suspended = false; }
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn({ canUndo: undoStack.length > 1, canRedo: redoStack.length > 0 });
    return () => listeners.delete(fn);
  }

  const events = ['object:added', 'object:modified', 'object:removed', 'path:created'];
  const handler = () => record();
  events.forEach((ev) => canvas.on(ev, handler));

  // Seed initial state
  reset();

  function destroy() {
    events.forEach((ev) => canvas.off(ev, handler));
    listeners.clear();
  }

  return { undo, redo, reset, suspend, subscribe, destroy, record };
}
