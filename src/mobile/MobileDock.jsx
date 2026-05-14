import Icon from '../components/Icon.jsx';

/**
 * 6-slot bottom dock for the mobile shell.
 *
 *   ┌────────────────────────────────────────────────────┐
 *   │  Add   Adjust   Crop   Style   Layers   Export    │
 *   └────────────────────────────────────────────────────┘
 *
 * Pinned to the very bottom with safe-area padding so it sits above the
 * home-indicator on iOS. Only 6 items max to keep tap targets large.
 */
const DOCK_ITEMS = [
  { id: 'add',    label: 'Add',    icon: 'plus' },
  { id: 'adjust', label: 'Adjust', icon: 'sparkle' },
  { id: 'crop',   label: 'Crop',   icon: 'square' },
  { id: 'style',  label: 'Style',  icon: 'sparkle' },
  { id: 'layers', label: 'Layers', icon: 'layers' },
  { id: 'export', label: 'Export', icon: 'download' }
];

export default function MobileDock({ active, onOpen }) {
  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-40 h-16 border-t border-line bg-surface-1 flex items-center justify-around select-none pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile toolbar"
    >
      {DOCK_ITEMS.map((it) => {
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onOpen(it.id)}
            aria-pressed={isActive}
            aria-label={it.label}
            className={[
              'flex flex-col items-center justify-center gap-0.5 rounded-lg transition-colors',
              'h-12 min-w-[44px] px-2',
              isActive
                ? 'text-brand bg-brand/10'
                : 'text-ink-muted hover:text-ink hover:bg-surface-2'
            ].join(' ')}
          >
            <Icon name={it.icon} size={18} />
            <span className="text-[10px] leading-none font-medium">{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
