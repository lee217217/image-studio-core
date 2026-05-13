import Icon from './Icon.jsx';
import { isAiEnabled } from '../ai/aiClient.js';

const AI_BUTTONS = [
  { id: 'remove-bg', label: 'AI Remove Background', icon: 'sparkle', desc: 'Erase the background of a selected image.' },
  { id: 'cleanup', label: 'AI Object Cleanup', icon: 'sparkle', desc: 'Brush over unwanted areas to remove them.' },
  { id: 'generate-bg', label: 'AI Generate Background', icon: 'sparkle', desc: 'Generate a custom backdrop from a prompt.' },
  { id: 'extend', label: 'AI Extend Image', icon: 'sparkle', desc: 'Expand an image beyond its original frame.' },
  { id: 'auto-layout', label: 'AI Auto Layout', icon: 'sparkle', desc: 'Smart-align objects to a clean grid.' }
];

export default function AiPanel({ onClose }) {
  const enabled = isAiEnabled();

  return (
    <div className="w-full md:w-72 md:flex-shrink-0 border-r border-line bg-surface-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <div>
          <div className="panel-heading">AI tools</div>
          <div className="text-xs text-ink-muted mt-0.5">Coming soon</div>
        </div>
        <button className="btn-ghost h-7 w-7 p-0" onClick={onClose} aria-label="Close AI panel">
          <Icon name="x" size={14} />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-line">
        <div className="rounded-md bg-brand/10 border border-brand/30 px-3 py-2 text-xs text-ink-muted">
          AI features are disabled in this build. The interface is here so the
          workflow stays familiar — wire up a provider when ready.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll p-3 space-y-2">
        {AI_BUTTONS.map((b) => (
          <button
            key={b.id}
            disabled={!enabled}
            className="w-full text-left rounded-md border border-line bg-surface-1 px-3 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <span className="text-brand"><Icon name={b.icon} size={16} /></span>
              <span className="text-sm font-medium text-ink">{b.label}</span>
              {!enabled && (
                <span className="ml-auto text-[10px] uppercase tracking-wider text-ink-subtle bg-surface-2 rounded px-1.5 py-0.5">
                  Soon
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-ink-muted">{b.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
