/**
 * Placeholder AI client.
 *
 * No paid API is wired up in v1 of Image Studio Core. This module defines the
 * shape of the future client so feature code can be migrated without
 * rewriting call sites.
 *
 * When implementing for real:
 *  - Read the API base URL from `import.meta.env.VITE_AI_API_BASE`.
 *  - Read the API key from `import.meta.env.VITE_AI_API_KEY` (or, preferably,
 *    proxy via a serverless function so the key is never exposed to the
 *    browser).
 *  - Replace the bodies below with `fetch()` calls.
 */

export const AI_FEATURES = {
  REMOVE_BACKGROUND: 'remove-background',
  OBJECT_CLEANUP: 'object-cleanup',
  GENERATE_BACKGROUND: 'generate-background',
  EXTEND_IMAGE: 'extend-image',
  AUTO_LAYOUT: 'auto-layout'
};

export function isAiEnabled() {
  // Until a real client is wired up, AI is always disabled in the UI.
  return false;
}

export async function callAi(_feature, _payload) {
  throw new Error('AI features are not enabled in this build.');
}
