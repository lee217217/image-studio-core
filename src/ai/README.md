# AI Module (Placeholder)

This folder is reserved for future AI features. In v1 of Image Studio Core,
**no paid AI API is integrated** — the UI exposes disabled "coming soon"
buttons only.

## Files

- `aiClient.js` — Stubbed client. Defines feature ids and a single `callAi()`
  entry point. Replace with real `fetch` calls when ready.
- `aiActions.js` — High-level wrappers used by toolbar / properties panel.

## When you wire up real AI

1. Choose a provider (e.g. Replicate, Clipdrop, OpenAI, your own backend).
2. Add environment variables to your `.env`:
   ```
   VITE_AI_API_BASE=https://your-backend.example.com
   VITE_AI_API_KEY=__server_token_only__
   ```
   For security, do **not** ship a secret key to the browser. Proxy through
   a serverless function (e.g. Netlify Functions) so the key stays server-side.
3. Replace `callAi()` in `aiClient.js` with a real `fetch()` implementation.
4. Flip `isAiEnabled()` to return `true` when configuration is present.
5. The UI will then automatically enable the AI buttons that are gated on
   `isAiEnabled()`.

## Planned features

- AI Remove Background
- AI Object Cleanup
- AI Generate Background
- AI Extend Image
- AI Auto Layout
