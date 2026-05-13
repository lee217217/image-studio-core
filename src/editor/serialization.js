import { downloadBlob, readFileAsText } from '../utils/fileUtils.js';

const STORAGE_KEY = 'image-studio-core:last-project';
const PROPS = ['name', 'lockMovementX', 'lockMovementY', 'lockScalingX', 'lockScalingY', 'lockRotation', 'selectable', 'evented'];

export function serializeProject(canvas) {
  const json = canvas.toJSON(PROPS);
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    background: canvas.backgroundColor || '#ffffff',
    canvas: json
  };
}

export function downloadProjectJson(canvas) {
  const project = serializeProject(canvas);
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  downloadBlob(blob, `image-studio-${ts}.json`);
}

export async function loadProjectFromFile(canvas, file, { onLoaded } = {}) {
  const text = await readFileAsText(file);
  let project;
  try {
    project = JSON.parse(text);
  } catch (err) {
    throw new Error('The file is not a valid project JSON.');
  }
  return applyProject(canvas, project, { onLoaded });
}

export function applyProject(canvas, project, { onLoaded } = {}) {
  return new Promise((resolve, reject) => {
    if (!project || typeof project !== 'object') {
      reject(new Error('Invalid project format.'));
      return;
    }
    const payload = project.canvas || project;
    const w = project.width || canvas.getWidth();
    const h = project.height || canvas.getHeight();
    canvas.setWidth(w);
    canvas.setHeight(h);
    if (project.background) canvas.setBackgroundColor(project.background, () => {});
    canvas.loadFromJSON(payload, () => {
      canvas.renderAll();
      if (typeof onLoaded === 'function') onLoaded();
      resolve();
    });
  });
}

export function autoSaveToLocalStorage(canvas) {
  try {
    const project = serializeProject(canvas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    return true;
  } catch (err) {
    return false;
  }
}

export function hasAutoSavedProject() {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

export function loadAutoSavedProject(canvas, opts) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return Promise.resolve(false);
    const project = JSON.parse(raw);
    return applyProject(canvas, project, opts).then(() => true);
  } catch (err) {
    return Promise.reject(err);
  }
}

export function clearAutoSavedProject() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
