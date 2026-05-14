/**
 * Mobile canvas stage — renders the Fabric canvasStage from CanvasWorkspace
 * inside a centered, padded scrollable area.
 *
 * Key layout decisions:
 *   - `items-start` (not `items-center`) so the canvas hugs the top under
 *     the slim TopBar rather than floating in the middle of the viewport.
 *   - `pt-3` keeps the canvas a small breath away from TopBar.
 *   - `overflow-auto` lets users scroll if the canvas is taller than viewport
 *     even after fit-to-screen.
 *
 * The actual checkerboard background comes from `.canvas-shell` on the
 * inner stage element from CanvasWorkspace, so we don't paint our own.
 */
export default function MobileCanvasStage({ canvasStage }) {
  return (
    <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
      {canvasStage}
    </div>
  );
}
