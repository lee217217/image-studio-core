// Classic frames pack — 8 border-based frames. These apply directly to the
// image via Fabric stroke/strokeWidth/strokeDashArray/rx (and optional padding).

export const CLASSIC_FRAMES_PACK = {
  id: 'classic',
  name: 'Classic',
  frames: [
    { id: 'polaroid-white',     name: 'Polaroid White',     type: 'border',
      stroke: '#ffffff', strokeWidth: 36, padBottom: 60, rx: 0 },
    { id: 'polaroid-vintage',   name: 'Polaroid Vintage',   type: 'border',
      stroke: '#f5ecd6', strokeWidth: 36, padBottom: 60, rx: 0 },
    { id: 'black-border-thin',  name: 'Black Border Thin',  type: 'border',
      stroke: '#111111', strokeWidth: 6, rx: 0 },
    { id: 'black-border-thick', name: 'Black Border Thick', type: 'border',
      stroke: '#111111', strokeWidth: 24, rx: 0 },
    { id: 'white-border-thick', name: 'White Border Thick', type: 'border',
      stroke: '#ffffff', strokeWidth: 24, rx: 0 },
    { id: 'rounded-16',         name: 'Rounded 16',         type: 'border',
      stroke: 'transparent', strokeWidth: 0, rx: 16 },
    { id: 'rounded-32',         name: 'Rounded 32',         type: 'border',
      stroke: 'transparent', strokeWidth: 0, rx: 32 },
    { id: 'film-strip',         name: 'Film Strip',         type: 'border',
      stroke: '#1a1a1a', strokeWidth: 32, strokeDashArray: [22, 14], rx: 4 },
  ],
};
