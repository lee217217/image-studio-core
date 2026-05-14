import { fabric } from './fabricSetup.js';

/**
 * Each template is a function (canvas) => void that clears the canvas
 * to a target size, sets a background, and pushes a curated set of
 * Fabric objects. Templates use placeholders only — no external imagery.
 */

function reset(canvas, width, height, background = '#ffffff') {
  canvas.clear();
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.setBackgroundColor(background, () => canvas.requestRenderAll());
}

function placeholderImage(opts) {
  const { width = 600, height = 400, label = 'Product Image' } = opts;
  const rect = new fabric.Rect({
    width, height,
    fill: '#e5e7eb',
    stroke: '#cbd5e1',
    strokeDashArray: [8, 6],
    strokeWidth: 2,
    rx: 8, ry: 8
  });
  const text = new fabric.Text(label, {
    fontFamily: 'Inter',
    fontSize: 22,
    fill: '#6b7280',
    originX: 'center',
    originY: 'center',
    left: width / 2,
    top: height / 2
  });
  const group = new fabric.Group([rect, text], {
    originX: 'left',
    originY: 'top',
    name: 'Image Placeholder'
  });
  return group;
}

/* ---------- Templates ---------- */

function socialMediaProductPost(canvas) {
  reset(canvas, 1080, 1080, '#0f172a');
  const eyebrow = new fabric.Text('NEW DROP · SS26', {
    left: 80, top: 80,
    fontFamily: 'Inter', fontSize: 28, fontWeight: '600',
    fill: '#60a5fa', name: 'Eyebrow'
  });
  const title = new fabric.Textbox('Lightweight\nLinen Shirt', {
    left: 80, top: 130,
    width: 600,
    fontFamily: 'Inter', fontSize: 88, fontWeight: '700',
    fill: '#ffffff', lineHeight: 1.05, name: 'Title'
  });
  const sub = new fabric.Textbox('Cool, breathable, and made for warm days. Limited release.', {
    left: 80, top: 360,
    width: 600,
    fontFamily: 'Inter', fontSize: 24, fill: '#cbd5e1', name: 'Subtitle'
  });
  const img = placeholderImage({ width: 720, height: 540, label: 'Hero Product Image' });
  img.set({ left: 180, top: 460, name: 'Hero Image' });
  const btnBg = new fabric.Rect({
    width: 240, height: 64,
    rx: 999, ry: 999,
    fill: '#ffffff',
    originX: 'center', originY: 'center'
  });
  const btnText = new fabric.Text('Shop Now', {
    fontFamily: 'Inter', fontSize: 22, fontWeight: '600',
    fill: '#0f172a',
    originX: 'center', originY: 'center'
  });
  const cta = new fabric.Group([btnBg, btnText], {
    left: 200, top: 1020,
    name: 'CTA Button'
  });
  canvas.add(eyebrow, title, sub, img, cta);
  canvas.requestRenderAll();
}

function beforeAfter(canvas) {
  reset(canvas, 1600, 900, '#f8fafc');
  const title = new fabric.Text('Before / After', {
    left: 80, top: 50,
    fontFamily: 'Inter', fontSize: 44, fontWeight: '700',
    fill: '#0f172a', name: 'Title'
  });
  const leftLabel = new fabric.Text('BEFORE', {
    left: 80, top: 140,
    fontFamily: 'Inter', fontSize: 18, fontWeight: '700', fill: '#64748b', name: 'Before Label'
  });
  const rightLabel = new fabric.Text('AFTER', {
    left: 870, top: 140,
    fontFamily: 'Inter', fontSize: 18, fontWeight: '700', fill: '#64748b', name: 'After Label'
  });
  const leftImg = placeholderImage({ width: 680, height: 600, label: 'Before' });
  leftImg.set({ left: 80, top: 180, name: 'Before Image' });
  const rightImg = placeholderImage({ width: 680, height: 600, label: 'After' });
  rightImg.set({ left: 840, top: 180, name: 'After Image' });
  const divider = new fabric.Line([800, 180, 800, 780], {
    stroke: '#cbd5e1', strokeWidth: 2, strokeDashArray: [6, 6], name: 'Divider'
  });
  canvas.add(title, leftLabel, rightLabel, leftImg, rightImg, divider);
  canvas.requestRenderAll();
}

function garmentPresentation(canvas) {
  reset(canvas, 1600, 1131, '#fafaf9'); // A4 landscape-ish
  const title = new fabric.Text('Garment Presentation Board', {
    left: 60, top: 50,
    fontFamily: 'Inter', fontSize: 36, fontWeight: '700',
    fill: '#1f2937', name: 'Title'
  });
  const styleCode = new fabric.Text('Style: GS-2026-001    Season: SS26    Category: Tops', {
    left: 60, top: 100,
    fontFamily: 'Inter', fontSize: 16, fill: '#6b7280', name: 'Style Meta'
  });
  const productImg = placeholderImage({ width: 720, height: 820, label: 'Product Image' });
  productImg.set({ left: 60, top: 160, name: 'Product Image' });

  // Color swatches
  const swatchColors = ['#0f172a', '#e5e7eb', '#1e3a8a', '#92400e', '#365314'];
  const swatchY = 200;
  swatchColors.forEach((c, i) => {
    const sw = new fabric.Circle({
      left: 820 + i * 78,
      top: swatchY,
      radius: 30,
      fill: c,
      stroke: '#cbd5e1',
      strokeWidth: 1,
      name: `Swatch ${i + 1}`
    });
    canvas.add(sw);
  });
  const swatchTitle = new fabric.Text('Available Colors', {
    left: 820, top: 160,
    fontFamily: 'Inter', fontSize: 18, fontWeight: '600',
    fill: '#1f2937', name: 'Swatches Title'
  });

  // Notes
  const notesBg = new fabric.Rect({
    left: 820, top: 300,
    width: 720, height: 280,
    fill: '#ffffff',
    stroke: '#e5e7eb', strokeWidth: 1,
    rx: 6, ry: 6,
    name: 'Notes Box'
  });
  const notesTitle = new fabric.Text('Notes', {
    left: 840, top: 320,
    fontFamily: 'Inter', fontSize: 18, fontWeight: '600',
    fill: '#1f2937', name: 'Notes Title'
  });
  const notesBody = new fabric.Textbox('• Fabric: 100% washed linen\n• Fit: Relaxed\n• Wash: Cold machine wash\n• Notes: Pre-shrunk, garment dyed', {
    left: 840, top: 360,
    width: 680,
    fontFamily: 'Inter', fontSize: 16,
    fill: '#374151', lineHeight: 1.5,
    name: 'Notes Body'
  });

  // Spec labels
  const specs = [
    { label: 'Sizes', value: 'XS / S / M / L / XL' },
    { label: 'MOQ', value: '300 pcs' },
    { label: 'Lead Time', value: '45 days' },
    { label: 'Target FOB', value: '$18.50' }
  ];
  specs.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 820 + col * 360;
    const y = 620 + row * 90;
    const card = new fabric.Rect({
      left: x, top: y, width: 340, height: 70,
      fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1, rx: 6, ry: 6
    });
    const k = new fabric.Text(s.label, {
      left: x + 16, top: y + 12,
      fontFamily: 'Inter', fontSize: 12, fontWeight: '600',
      fill: '#6b7280'
    });
    const v = new fabric.Text(s.value, {
      left: x + 16, top: y + 30,
      fontFamily: 'Inter', fontSize: 18, fontWeight: '600',
      fill: '#111827'
    });
    const group = new fabric.Group([card, k, v], { name: `Spec: ${s.label}` });
    canvas.add(group);
  });

  canvas.add(title, styleCode, productImg, swatchTitle, notesBg, notesTitle, notesBody);
  canvas.requestRenderAll();
}

function quoteCard(canvas) {
  reset(canvas, 1080, 1080, '#fef3c7');
  const mark = new fabric.Text('“', {
    left: 80, top: 80,
    fontFamily: 'Inter', fontSize: 220, fontWeight: '700',
    fill: '#b45309', name: 'Quote Mark'
  });
  const quote = new fabric.Textbox('Simplicity is the ultimate sophistication.', {
    left: 80, top: 320,
    width: 920,
    fontFamily: 'Inter', fontSize: 64, fontWeight: '600',
    fill: '#1f2937', lineHeight: 1.2, name: 'Quote'
  });
  const author = new fabric.Text('— Leonardo da Vinci', {
    left: 80, top: 880,
    fontFamily: 'Inter', fontSize: 28, fontWeight: '500',
    fill: '#92400e', name: 'Author'
  });
  canvas.add(mark, quote, author);
  canvas.requestRenderAll();
}

function productCatalogCard(canvas) {
  reset(canvas, 1200, 1600, '#ffffff');
  const img = placeholderImage({ width: 1040, height: 900, label: 'Product Image' });
  img.set({ left: 80, top: 80, name: 'Product Image' });
  const tag = (() => {
    const bg = new fabric.Rect({
      width: 110, height: 36, rx: 999, ry: 999, fill: '#0f172a',
      originX: 'center', originY: 'center'
    });
    const t = new fabric.Text('NEW', {
      fontFamily: 'Inter', fontSize: 14, fontWeight: '700',
      fill: '#ffffff', originX: 'center', originY: 'center'
    });
    return new fabric.Group([bg, t], { left: 130, top: 130, name: 'Tag' });
  })();
  const name = new fabric.Text('Classic Cotton Tee', {
    left: 80, top: 1020,
    fontFamily: 'Inter', fontSize: 48, fontWeight: '700',
    fill: '#111827', name: 'Product Name'
  });
  const sku = new fabric.Text('SKU · CT-100-WHT', {
    left: 80, top: 1090,
    fontFamily: 'Inter', fontSize: 20, fill: '#6b7280', name: 'SKU'
  });
  const desc = new fabric.Textbox('Soft-hand 200gsm cotton. Pre-shrunk. Garment dyed in 6 colors. Made in a Fair Wear factory.', {
    left: 80, top: 1140,
    width: 1040,
    fontFamily: 'Inter', fontSize: 22, fill: '#374151', lineHeight: 1.5, name: 'Description'
  });
  const price = new fabric.Text('$24', {
    left: 80, top: 1330,
    fontFamily: 'Inter', fontSize: 64, fontWeight: '700',
    fill: '#0f172a', name: 'Price'
  });
  const moq = new fabric.Text('MOQ 200 · Lead 30d', {
    left: 80, top: 1430,
    fontFamily: 'Inter', fontSize: 20, fill: '#6b7280', name: 'Order Info'
  });
  canvas.add(img, tag, name, sku, desc, price, moq);
  canvas.requestRenderAll();
}

export const templates = [
  { id: 'social-product', name: 'Social Media Product Post', size: '1080×1080', apply: socialMediaProductPost },
  { id: 'before-after', name: 'Before / After Comparison', size: '1600×900', apply: beforeAfter },
  { id: 'garment-board', name: 'Garment Presentation Board', size: '1600×1131', apply: garmentPresentation },
  { id: 'quote', name: 'Simple Quote Card', size: '1080×1080', apply: quoteCard },
  { id: 'catalog', name: 'Product Catalog Card', size: '1200×1600', apply: productCatalogCard }
];
