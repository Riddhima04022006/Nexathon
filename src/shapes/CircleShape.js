import { SYMBOLS } from './svgShape.js';
export function renderSymbol(key, size) {
  const sym = SYMBOLS[key];
  const oc  = document.createElement('canvas');
  oc.width  = size;
  oc.height = size;
  const ox  = oc.getContext('2d');

  const scale = (size / Math.max(sym.vbW, sym.vbH)) * 0.85;
  const tx    = size / 2 - sym.cx * scale;
  const ty    = size / 2 - sym.cy * scale;

  ox.save();
  ox.translate(tx, ty);
  ox.scale(scale, scale);
  ox.fillStyle = '#fff';
  ox.fill(new Path2D(sym.path));
  ox.restore();

  return ox.getImageData(0, 0, size, size);
}

export function samplePoints(imgData, n, offsetX, offsetY) {
  const { data, width, height } = imgData;
  const whites = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 80) {
        whites.push({ x: offsetX + x, y: offsetY + y });
      }
    }
  }

  if (whites.length === 0) return [];

  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push(whites[Math.floor(Math.random() * whites.length)]);
  }
  return pts;
}