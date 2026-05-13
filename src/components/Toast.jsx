import Icon from './Icon.jsx';
import { useEditorStore } from '../store/editorStore.js';

export default function Toast() {
  const toast = useEditorStore((s) => s.toast);
  const clearToast = useEditorStore((s) => s.clearToast);
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-md shadow-lg border text-sm ${
          isError
            ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
            : 'bg-surface-1 border-line text-ink'
        }`}
        role="status"
      >
        <Icon name={isError ? 'x' : 'check'} size={14} />
        <span>{toast.message}</span>
        <button onClick={clearToast} className="ml-1 text-ink-subtle hover:text-ink" aria-label="Dismiss">
          <Icon name="x" size={12} />
        </button>
      </div>
    </div>
  );
}
