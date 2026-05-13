# Image Studio Core

A clean, Canva-style image layout editor built with **React + Vite + Tailwind CSS + Fabric.js**. Designed as a solid foundation for product/marketing/garment teams — fully usable in v1 without any paid AI API, with structure prepared for future AI features.

## Highlights

- Real Fabric.js canvas — drag, resize, rotate, group, lock, layer, align
- Text, rectangle, circle, line, arrow, label primitives + image upload
- Properties panel that syncs to the selected object in real time
- Layers panel with reorder, visibility, and lock controls
- 5 built-in templates (incl. a garment presentation board)
- Save / load project JSON, with auto-save to browser localStorage
- Export PNG and JPG at real canvas dimensions
- Undo / redo with full snapshot-based history
- Light & dark mode
- AI module folder is wired in as a placeholder — no paid API required

## Quick start (local)

Requires **Node.js 18.14.0** or newer.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open the URL printed by Vite (default: `http://localhost:5173`).

## Production build

```bash
npm run build
```

The static build is written to `dist/`. To preview it locally:

```bash
npm run preview
```

## Deploy to Netlify

Two equally easy paths:

### Option A — connect your Git repository

1. Push this folder to a Git provider (GitHub, GitLab, Bitbucket).
2. In Netlify: **Add new site → Import from Git**.
3. Netlify auto-detects `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**. Done.

### Option B — drag-and-drop deploy

```bash
npm install
npm run build
```

Then drop the resulting `dist/` folder onto Netlify's **Sites → Add new site → Deploy manually** page.

The included `netlify.toml` also adds a SPA fallback redirect so deep links never 404.

## Folder structure

```
image-studio-core/
├─ public/assets/             Static assets (favicon)
├─ src/
│  ├─ ai/                     Reserved for future AI features (disabled in v1)
│  ├─ components/             React UI components
│  ├─ editor/                 Fabric.js wrappers, history, export, templates
│  ├─ hooks/                  React hooks (editor context, history, shortcuts)
│  ├─ store/                  Zustand editor store
│  ├─ utils/                  File / color / object utilities
│  ├─ App.jsx                 Layout shell
│  ├─ main.jsx                Vite entry
│  └─ styles.css              Tailwind base + design tokens
├─ index.html
├─ netlify.toml               Netlify build & redirect rules
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
└─ vite.config.js
```

The `components/CanvasWorkspace.jsx` component owns the single Fabric.js
instance and provides it to surrounding panels via `EditorContext` (see
`hooks/useEditor.js`).

## Keyboard shortcuts

| Action          | Shortcut                       |
| --------------- | ------------------------------ |
| Delete object   | `Delete` / `Backspace`         |
| Undo            | `Ctrl/Cmd + Z`                 |
| Redo            | `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y` |
| Duplicate       | `Ctrl/Cmd + D`                 |
| Save JSON       | `Ctrl/Cmd + S`                 |

Shortcuts are disabled while you are typing inside a text input or editing a text object on the canvas.

## Templates

- Social Media Product Post (1080×1080)
- Before / After Comparison (1600×900)
- Garment Presentation Board (1600×1131)
- Simple Quote Card (1080×1080)
- Product Catalog Card (1200×1600)

Loading a template replaces the current canvas contents.

## Save / load / auto-save

- **Save**: top bar → Save (or `Ctrl/Cmd + S`) downloads a `.json` file containing the canvas state.
- **Open**: top bar → Open lets you reload a previously saved `.json` file.
- **Auto-save**: every few seconds the latest canvas state is stored in your browser's localStorage. If a saved project is found on next load, a **Restore last project** button appears in the top bar.

## AI placeholder

`src/ai/` contains a stubbed AI client (`aiClient.js`) and high-level action wrappers (`aiActions.js`). All AI buttons in the UI are visible but disabled and labeled "Coming soon". When you are ready to wire up a provider:

1. Add environment variables, e.g.:
   ```
   VITE_AI_API_BASE=https://your-proxy.example.com
   VITE_AI_API_KEY=__do_not_ship_secret_keys_to_the_browser__
   ```
2. Replace the body of `callAi()` in `src/ai/aiClient.js` with a real `fetch()`.
3. Flip `isAiEnabled()` to return `true`. The UI will automatically enable the AI buttons.

Recommended: proxy through a serverless function (e.g. Netlify Functions) so the API key never reaches the browser.

## Internationalization

Labels are kept in plain English strings inside components. Each component groups its labels at the top (e.g. `const T = { ... }`) so a future i18n layer (e.g. `react-i18next` or a tiny lookup table) can swap them out for Traditional Chinese or any other locale without touching JSX.

## Tech

- React 18, Vite 5
- Tailwind CSS 3
- Fabric.js 5
- Zustand 4 (state)

## License

Internal / personal use. Adapt freely.
