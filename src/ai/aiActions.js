import { AI_FEATURES, callAi, isAiEnabled } from './aiClient.js';

/**
 * High-level AI action wrappers used by the toolbar/properties panel.
 * All functions are currently stubs; UI presents them as "coming soon".
 */

export async function removeBackground(_imageObject) {
  if (!isAiEnabled()) throw new Error('AI Remove Background is not enabled yet.');
  return callAi(AI_FEATURES.REMOVE_BACKGROUND, {});
}

export async function objectCleanup(_region) {
  if (!isAiEnabled()) throw new Error('AI Object Cleanup is not enabled yet.');
  return callAi(AI_FEATURES.OBJECT_CLEANUP, {});
}

export async function generateBackground(_prompt) {
  if (!isAiEnabled()) throw new Error('AI Generate Background is not enabled yet.');
  return callAi(AI_FEATURES.GENERATE_BACKGROUND, {});
}

export async function extendImage(_imageObject) {
  if (!isAiEnabled()) throw new Error('AI Extend Image is not enabled yet.');
  return callAi(AI_FEATURES.EXTEND_IMAGE, {});
}

export async function autoLayout(_objects) {
  if (!isAiEnabled()) throw new Error('AI Auto Layout is not enabled yet.');
  return callAi(AI_FEATURES.AUTO_LAYOUT, {});
}
