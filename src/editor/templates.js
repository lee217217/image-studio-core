import { fabric } from './fabricSetup.js';

/**
 * Template library for Image Studio Core.
 * All templates use Fabric.js objects only, with placeholders instead of external assets.
 */

function reset(canvas, width, height, background = '#ffffff') {
  canvas.clear();
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.setBackgroundColor(background, () => canvas.requestRenderAll());
}

function text(value, opts = {}) {
  return new fabric.Text(value, {
    fontFamily: 'Inter',
    fontSize: 24,
    fill: '#111827',
    name: 'Text',
    ...opts
  });
}

function textbox(value, opts = {}) {
  return new fabric.Textbox(value, {
    fontFamily: 'Inter',
    fontSize: 24,
    fill: '#111827',
    name: 'Textbox',
    ...opts
  });
}

function rect(opts = {}) {
  return new fabric.Rect({
    fill: '#ffffff',
    stroke: '#e5e7eb',
    strokeWidth: 1,
    rx: 8,
    ry: 8,
    name: 'Rectangle',
    ...opts
  });
}

function circle(opts = {}) {
  return new fabric.Circle({
    radius: 30,
    fill: '#e5e7eb',
    stroke: '#cbd5e1',
    strokeWidth: 1,
    name: 'Circle',
    ...opts
  });
}

function line(points, opts = {}) {
  return new fabric.Line(points, {
    stroke: '#cbd5e1',
    strokeWidth: 2,
    name: 'Line',
    ...opts
  });
}

function group(items, opts = {}) {
  return new fabric.Group(items, {
    name: 'Group',
    ...opts
  });
}

function placeholderImage({ width = 600, height = 400, label = 'Image', fill = '#e5e7eb' } = {}) {
  const bg = new fabric.Rect({
    width,
    height,
    fill,
    stroke: '#cbd5e1',
    strokeDashArray: [8, 6],
    strokeWidth: 2,
    rx: 10,
    ry: 10
  });

  const labelText = new fabric.Text(label, {
    fontFamily: 'Inter',
    fontSize: Math.max(16, Math.min(24, width / 20)),
    fontWeight: '600',
    fill: '#6b7280',
    originX: 'center',
    originY: 'center',
    left: width / 2,
    top: height / 2
  });

  return new fabric.Group([bg, labelText], {
    originX: 'left',
    originY: 'top',
    name: label
  });
}

function badge(label, opts = {}) {
  const bg = new fabric.Rect({
    width: opts.width || 180,
    height: opts.height || 46,
    rx: 999,
    ry: 999,
    fill: opts.fill || '#111827',
    originX: 'center',
    originY: 'center'
  });

  const t = new fabric.Text(label, {
    fontFamily: 'Inter',
    fontSize: opts.fontSize || 16,
    fontWeight: '700',
    fill: opts.textColor || '#ffffff',
    originX: 'center',
    originY: 'center'
  });

  return new fabric.Group([bg, t], {
    left: opts.left || 0,
    top: opts.top || 0,
    name: opts.name || `Badge: ${label}`
  });
}

function swatch(color, label, x, y) {
  const c = new fabric.Circle({
    left: 0,
    top: 0,
    radius: 26,
    fill: color,
    stroke: '#cbd5e1',
    strokeWidth: 1
  });

  const t = new fabric.Text(label, {
    left: 0,
    top: 66,
    fontFamily: 'Inter',
    fontSize: 13,
    fill: '#475569',
    originX: 'center'
  });

  return new fabric.Group([c, t], {
    left: x,
    top: y,
    name: `Swatch ${label}`
  });
}

/* ---------- Original Templates ---------- */

function socialMediaProductPost(canvas) {
  reset(canvas, 1080, 1080, '#0f172a');

  const eyebrow = text('NEW DROP · SS26', {
    left: 80,
    top: 80,
    fontSize: 28,
    fontWeight: '600',
    fill: '#60a5fa',
    name: 'Eyebrow'
  });

  const title = textbox('Lightweight\nLinen Shirt', {
    left: 80,
    top: 130,
    width: 620,
    fontSize: 88,
    fontWeight: '700',
    fill: '#ffffff',
    lineHeight: 1.05,
    name: 'Title'
  });

  const sub = textbox('Cool, breathable, and made for warm days. Limited release.', {
    left: 80,
    top: 360,
    width: 620,
    fontSize: 24,
    fill: '#cbd5e1',
    name: 'Subtitle'
  });

  const img = placeholderImage({ width: 720, height: 500, label: 'Hero Product Image' });
  img.set({ left: 180, top: 470, name: 'Hero Image' });

  const cta = badge('Shop Now', {
    left: 80,
    top: 1000,
    width: 220,
    height: 58,
    fill: '#ffffff',
    textColor: '#0f172a',
    name: 'CTA Button'
  });

  canvas.add(eyebrow, title, sub, img, cta);
  canvas.requestRenderAll();
}

function beforeAfter(canvas) {
  reset(canvas, 1600, 900, '#f8fafc');

  const title = text('Before / After', {
    left: 80,
    top: 50,
    fontSize: 44,
    fontWeight: '700',
    fill: '#0f172a',
    name: 'Title'
  });

  const leftLabel = text('BEFORE', {
    left: 80,
    top: 140,
    fontSize: 18,
    fontWeight: '700',
    fill: '#64748b',
    name: 'Before Label'
  });

  const rightLabel = text('AFTER', {
    left: 870,
    top: 140,
    fontSize: 18,
    fontWeight: '700',
    fill: '#64748b',
    name: 'After Label'
  });

  const leftImg = placeholderImage({ width: 680, height: 600, label: 'Before' });
  leftImg.set({ left: 80, top: 180, name: 'Before Image' });

  const rightImg = placeholderImage({ width: 680, height: 600, label: 'After' });
  rightImg.set({ left: 840, top: 180, name: 'After Image' });

  const divider = line([800, 180, 800, 780], {
    strokeDashArray: [6, 6],
    name: 'Divider'
  });

  canvas.add(title, leftLabel, rightLabel, leftImg, rightImg, divider);
  canvas.requestRenderAll();
}

function garmentPresentation(canvas) {
  reset(canvas, 1600, 1131, '#fafaf9');

  const title = text('Garment Presentation Board', {
    left: 60,
    top: 50,
    fontSize: 36,
    fontWeight: '700',
    fill: '#1f2937',
    name: 'Title'
  });

  const styleCode = text('Style: GS-2026-001  ·  Season: SS26  ·  Category: Tops', {
    left: 60,
    top: 100,
    fontSize: 16,
    fill: '#6b7280',
    name: 'Style Meta'
  });

  const productImg = placeholderImage({ width: 720, height: 820, label: 'Product Image' });
  productImg.set({ left: 60, top: 160, name: 'Product Image' });

  const swatchTitle = text('Available Colors', {
    left: 820,
    top: 160,
    fontSize: 18,
    fontWeight: '600',
    fill: '#1f2937',
    name: 'Swatches Title'
  });

  const swatches = [
    swatch('#0f172a', 'Navy', 820, 205),
    swatch('#e5e7eb', 'Stone', 898, 205),
    swatch('#1e3a8a', 'Blue', 976, 205),
    swatch('#92400e', 'Brown', 1054, 205),
    swatch('#365314', 'Olive', 1132, 205)
  ];

  const notesBg = rect({
    left: 820,
    top: 310,
    width: 720,
    height: 280,
    fill: '#ffffff',
    name: 'Notes Box'
  });

  const notesTitle = text('Notes', {
    left: 840,
    top: 330,
    fontSize: 18,
    fontWeight: '600',
    fill: '#1f2937',
    name: 'Notes Title'
  });

  const notesBody = textbox('• Fabric: 100% washed linen\n• Fit: Relaxed\n• Wash: Cold machine wash\n• Notes: Pre-shrunk, garment dyed', {
    left: 840,
    top: 370,
    width: 680,
    fontSize: 16,
    fill: '#374151',
    lineHeight: 1.5,
    name: 'Notes Body'
  });

  const specs = [
    ['Sizes', 'XS / S / M / L / XL'],
    ['MOQ', '300 pcs'],
    ['Lead Time', '45 days'],
    ['Target FOB', '$18.50']
  ];

  const specGroups = specs.map(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 820 + col * 360;
    const y = 630 + row * 90;

    const card = rect({ left: 0, top: 0, width: 340, height: 70, fill: '#ffffff' });
    const k = text(label, { left: 16, top: 12, fontSize: 12, fontWeight: '600', fill: '#6b7280' });
    const v = text(value, { left: 16, top: 30, fontSize: 18, fontWeight: '600', fill: '#111827' });

    return group([card, k, v], { left: x, top: y, name: `Spec: ${label}` });
  });

  canvas.add(title, styleCode, productImg, swatchTitle, ...swatches, notesBg, notesTitle, notesBody, ...specGroups);
  canvas.requestRenderAll();
}

function quoteCard(canvas) {
  reset(canvas, 1080, 1080, '#fef3c7');

  const mark = text('“', {
    left: 80,
    top: 80,
    fontSize: 220,
    fontWeight: '700',
    fill: '#b45309',
    name: 'Quote Mark'
  });

  const quote = textbox('Simplicity is the ultimate sophistication.', {
    left: 80,
    top: 320,
    width: 920,
    fontSize: 64,
    fontWeight: '600',
    fill: '#1f2937',
    lineHeight: 1.2,
    name: 'Quote'
  });

  const author = text('— Leonardo da Vinci', {
    left: 80,
    top: 880,
    fontSize: 28,
    fontWeight: '500',
    fill: '#92400e',
    name: 'Author'
  });

  canvas.add(mark, quote, author);
  canvas.requestRenderAll();
}

function productCatalogCard(canvas) {
  reset(canvas, 1200, 1600, '#ffffff');

  const img = placeholderImage({ width: 1040, height: 900, label: 'Product Image' });
  img.set({ left: 80, top: 80, name: 'Product Image' });

  const tag = badge('NEW', {
    left: 130,
    top: 130,
    width: 110,
    height: 36,
    fill: '#0f172a',
    name: 'Tag'
  });

  const name = text('Classic Cotton Tee', {
    left: 80,
    top: 1020,
    fontSize: 48,
    fontWeight: '700',
    fill: '#111827',
    name: 'Product Name'
  });

  const sku = text('SKU · CT-100-WHT', {
    left: 80,
    top: 1090,
    fontSize: 20,
    fill: '#6b7280',
    name: 'SKU'
  });

  const desc = textbox('Soft-hand 200gsm cotton. Pre-shrunk. Garment dyed in 6 colors. Made in a Fair Wear factory.', {
    left: 80,
    top: 1140,
    width: 1040,
    fontSize: 22,
    fill: '#374151',
    lineHeight: 1.5,
    name: 'Description'
  });

  const price = text('$24', {
    left: 80,
    top: 1330,
    fontSize: 64,
    fontWeight: '700',
    fill: '#0f172a',
    name: 'Price'
  });

  const moq = text('MOQ 200 · Lead 30d', {
    left: 80,
    top: 1430,
    fontSize: 20,
    fill: '#6b7280',
    name: 'Order Info'
  });

  canvas.add(img, tag, name, sku, desc, price, moq);
  canvas.requestRenderAll();
}

/* ---------- New Templates ---------- */

function garmentTechSheet(canvas) {
  reset(canvas, 1600, 1131, '#ffffff');

  const header = rect({ left: 0, top: 0, width: 1600, height: 120, fill: '#111827', strokeWidth: 0, rx: 0, ry: 0 });
  const title = text('Garment Technical Sheet', { left: 60, top: 36, fontSize: 38, fontWeight: '700', fill: '#ffffff', name: 'Title' });
  const meta = text('Style: RUN-TEE-026 · Buyer: Sample Buyer · Version: V1', { left: 60, top: 82, fontSize: 16, fill: '#cbd5e1', name: 'Meta' });

  const front = placeholderImage({ width: 500, height: 650, label: 'Front View' });
  front.set({ left: 70, top: 170, name: 'Front View' });

  const back = placeholderImage({ width: 500, height: 650, label: 'Back View' });
  back.set({ left: 610, top: 170, name: 'Back View' });

  const infoBox = rect({ left: 1160, top: 170, width: 360, height: 650, fill: '#f8fafc', name: 'Spec Panel' });
  const infoTitle = text('Key Specs', { left: 1190, top: 205, fontSize: 24, fontWeight: '700', fill: '#0f172a' });

  const specs = textbox('Fabric: 88% Polyester / 12% Spandex\nWeight: 180gsm\nConstruction: Interlock\nFit: Athletic\nNeck: Crew neck\nSleeve: Raglan\nPrint: Heat transfer logo\nPackaging: 1pc polybag', {
    left: 1190,
    top: 260,
    width: 300,
    fontSize: 18,
    fill: '#334155',
    lineHeight: 1.55,
    name: 'Specs'
  });

  const notes = textbox('Revision Notes:\n• Confirm shoulder seam position\n• Check sleeve opening measurement\n• Update logo size before SMS sample', {
    left: 70,
    top: 870,
    width: 1450,
    fontSize: 22,
    fill: '#374151',
    lineHeight: 1.45,
    name: 'Revision Notes'
  });

  canvas.add(header, title, meta, front, back, infoBox, infoTitle, specs, notes);
  canvas.requestRenderAll();
}

function buyerCommentSummary(canvas) {
  reset(canvas, 1600, 900, '#f8fafc');

  const title = text('Buyer Comment Summary', {
    left: 60,
    top: 50,
    fontSize: 42,
    fontWeight: '700',
    fill: '#0f172a',
    name: 'Title'
  });

  const subtitle = text('Style GS-2026-001 · Comments received · Pending action review', {
    left: 60,
    top: 104,
    fontSize: 18,
    fill: '#64748b',
    name: 'Subtitle'
  });

  const columns = [
    ['High Priority', '#fee2e2', '#991b1b', ['Fit too loose at waist', 'Revise sleeve length', 'Confirm logo placement']],
    ['Medium Priority', '#fef3c7', '#92400e', ['Update care label text', 'Check fabric handfeel', 'Review color shade']],
    ['Follow-up', '#dbeafe', '#1d4ed8', ['Send revised tech pack', 'Prepare photo sample', 'Confirm shipment date']]
  ];

  columns.forEach(([head, bg, color, items], i) => {
    const x = 60 + i * 510;
    const card = rect({ left: x, top: 170, width: 470, height: 620, fill: '#ffffff', name: `${head} Card` });
    const chip = rect({ left: x + 24, top: 200, width: 180, height: 42, fill: bg, strokeWidth: 0, rx: 999, ry: 999 });
    const chipText = text(head, { left: x + 44, top: 211, fontSize: 16, fontWeight: '700', fill: color });

    const body = textbox(items.map((item, idx) => `${idx + 1}. ${item}`).join('\n\n'), {
      left: x + 30,
      top: 280,
      width: 410,
      fontSize: 24,
      fill: '#334155',
      lineHeight: 1.45,
      name: `${head} Items`
    });

    canvas.add(card, chip, chipText, body);
  });

  canvas.add(title, subtitle);
  canvas.requestRenderAll();
}

function colorwayBoard(canvas) {
  reset(canvas, 1600, 1131, '#f9fafb');

  const title = text('Colorway Board', { left: 60, top: 50, fontSize: 42, fontWeight: '700', fill: '#111827', name: 'Title' });
  const subtitle = text('Seasonal palette proposal · SS26 active collection', { left: 60, top: 104, fontSize: 18, fill: '#6b7280', name: 'Subtitle' });

  const colors = [
    ['Midnight Navy', '#0f172a'],
    ['Cloud Grey', '#e5e7eb'],
    ['Signal Blue', '#2563eb'],
    ['Burnt Clay', '#b45309'],
    ['Forest Olive', '#365314'],
    ['Soft Lemon', '#fde68a'],
    ['Rose Dust', '#f9a8d4'],
    ['Charcoal', '#374151']
  ];

  colors.forEach(([label, color], i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 80 + col * 375;
    const y = 190 + row * 390;

    const card = rect({ left: x, top: y, width: 320, height: 320, fill: '#ffffff', name: `${label} Card` });
    const block = rect({ left: x + 24, top: y + 24, width: 272, height: 190, fill: color, strokeWidth: 0, rx: 14, ry: 14 });
    const name = text(label, { left: x + 24, top: y + 238, fontSize: 22, fontWeight: '700', fill: '#111827' });
    const code = text(color.toUpperCase(), { left: x + 24, top: y + 274, fontSize: 16, fill: '#64748b' });

    canvas.add(card, block, name, code);
  });

  canvas.add(title, subtitle);
  canvas.requestRenderAll();
}

function fabricSwatchCard(canvas) {
  reset(canvas, 1200, 1600, '#ffffff');

  const title = text('Fabric Swatch Card', {
    left: 70,
    top: 70,
    fontSize: 52,
    fontWeight: '700',
    fill: '#111827',
    name: 'Title'
  });

  const meta = text('Development Sample · Mill Ref: TX-2201 · Date: May 2026', {
    left: 70,
    top: 138,
    fontSize: 20,
    fill: '#64748b',
    name: 'Meta'
  });

  const swatchArea = placeholderImage({ width: 1060, height: 760, label: 'Fabric / Texture Image' });
  swatchArea.set({ left: 70, top: 220, name: 'Fabric Image' });

  const specBox = rect({ left: 70, top: 1040, width: 1060, height: 380, fill: '#f8fafc', name: 'Spec Box' });

  const specText = textbox('Composition: 88% Nylon / 12% Spandex\nWeight: 180gsm\nConstruction: Single Jersey\nFinish: Quick dry + anti-odor\nStretch: 4-way stretch\nUse: Running / Yoga / Training', {
    left: 110,
    top: 1090,
    width: 980,
    fontSize: 28,
    fill: '#334155',
    lineHeight: 1.55,
    name: 'Fabric Specs'
  });

  canvas.add(title, meta, swatchArea, specBox, specText);
  canvas.requestRenderAll();
}

function instagramStoryPromo(canvas) {
  reset(canvas, 1080, 1920, '#111827');

  const bgCircle1 = circle({ left: -180, top: -160, radius: 360, fill: '#2563eb', strokeWidth: 0, opacity: 0.45 });
  const bgCircle2 = circle({ left: 720, top: 1380, radius: 420, fill: '#f97316', strokeWidth: 0, opacity: 0.35 });

  const eyebrow = text('LIMITED RELEASE', {
    left: 90,
    top: 140,
    fontSize: 28,
    fontWeight: '700',
    fill: '#93c5fd',
    name: 'Eyebrow'
  });

  const title = textbox('Performance\nTraining Tee', {
    left: 90,
    top: 210,
    width: 860,
    fontSize: 96,
    fontWeight: '800',
    fill: '#ffffff',
    lineHeight: 1.05,
    name: 'Title'
  });

  const image = placeholderImage({ width: 860, height: 900, label: 'Model / Product Image', fill: '#1f2937' });
  image.set({ left: 110, top: 610, name: 'Main Image' });

  const footer = textbox('Breathable mesh panels · 4-way stretch · Reflective details', {
    left: 90,
    top: 1580,
    width: 860,
    fontSize: 34,
    fill: '#d1d5db',
    lineHeight: 1.35,
    name: 'Footer Text'
  });

  const cta = badge('Swipe / Shop Now', {
    left: 90,
    top: 1745,
    width: 360,
    height: 72,
    fill: '#ffffff',
    textColor: '#111827',
    fontSize: 24,
    name: 'CTA'
  });

  canvas.add(bgCircle1, bgCircle2, eyebrow, title, image, footer, cta);
  canvas.requestRenderAll();
}

function ecommerceHeroBanner(canvas) {
  reset(canvas, 1920, 800, '#f8fafc');

  const leftPanel = rect({ left: 0, top: 0, width: 820, height: 800, fill: '#111827', strokeWidth: 0, rx: 0, ry: 0 });
  const eyebrow = text('NEW ACTIVE COLLECTION', { left: 90, top: 110, fontSize: 22, fontWeight: '700', fill: '#60a5fa' });

  const title = textbox('Built for movement.\nMade for everyday.', {
    left: 90,
    top: 170,
    width: 650,
    fontSize: 64,
    fontWeight: '800',
    fill: '#ffffff',
    lineHeight: 1.08,
    name: 'Hero Title'
  });

  const body = textbox('Lightweight technical fabrics, clean silhouettes, and practical performance details.', {
    left: 90,
    top: 360,
    width: 620,
    fontSize: 24,
    fill: '#cbd5e1',
    lineHeight: 1.4,
    name: 'Hero Body'
  });

  const cta = badge('Explore Collection', {
    left: 90,
    top: 520,
    width: 270,
    height: 62,
    fill: '#ffffff',
    textColor: '#111827',
    fontSize: 20,
    name: 'CTA'
  });

  const image = placeholderImage({ width: 900, height: 620, label: 'Campaign / Product Image' });
  image.set({ left: 930, top: 90, name: 'Hero Image' });

  canvas.add(leftPanel, eyebrow, title, body, cta, image);
  canvas.requestRenderAll();
}

function moodboardGrid(canvas) {
  reset(canvas, 1600, 1131, '#ffffff');

  const title = text('Moodboard', {
    left: 60,
    top: 50,
    fontSize: 46,
    fontWeight: '800',
    fill: '#111827',
    name: 'Title'
  });

  const subtitle = text('Visual direction · Color · Fabric · Styling', {
    left: 60,
    top: 108,
    fontSize: 20,
    fill: '#64748b',
    name: 'Subtitle'
  });

  const positions = [
    [60, 180, 700, 390, 'Main Inspiration'],
    [800, 180, 330, 390, 'Color / Texture'],
    [1170, 180, 370, 390, 'Detail'],
    [60, 610, 470, 420, 'Styling'],
    [570, 610, 470, 420, 'Fabric'],
    [1080, 610, 460, 420, 'Product']
  ];

  positions.forEach(([x, y, w, h, label]) => {
    const img = placeholderImage({ width: w, height: h, label });
    img.set({ left: x, top: y, name: label });
    canvas.add(img);
  });

  canvas.requestRenderAll();
}

export const templates = [
  { id: 'social-product', name: 'Social Media Product Post', size: '1080×1080', apply: socialMediaProductPost },
  { id: 'before-after', name: 'Before / After Comparison', size: '1600×900', apply: beforeAfter },
  { id: 'garment-board', name: 'Garment Presentation Board', size: '1600×1131', apply: garmentPresentation },
  { id: 'quote', name: 'Simple Quote Card', size: '1080×1080', apply: quoteCard },
  { id: 'catalog', name: 'Product Catalog Card', size: '1200×1600', apply: productCatalogCard },

  { id: 'garment-tech-sheet', name: 'Garment Tech Sheet', size: '1600×1131', apply: garmentTechSheet },
  { id: 'buyer-comment-summary', name: 'Buyer Comment Summary', size: '1600×900', apply: buyerCommentSummary },
  { id: 'colorway-board', name: 'Colorway Board', size: '1600×1131', apply: colorwayBoard },
  { id: 'fabric-swatch-card', name: 'Fabric Swatch Card', size: '1200×1600', apply: fabricSwatchCard },
  { id: 'instagram-story-promo', name: 'Instagram Story Promo', size: '1080×1920', apply: instagramStoryPromo },
  { id: 'ecommerce-hero-banner', name: 'E-commerce Hero Banner', size: '1920×800', apply: ecommerceHeroBanner },
  { id: 'moodboard-grid', name: '4-Image Moodboard', size: '1600×1131', apply: moodboardGrid }
];