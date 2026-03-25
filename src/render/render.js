export class Renderer {
  constructor(canvasId = 'canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) throw new Error(`Renderer: canvas #${canvasId} not found in DOM`);
    this.ctx    = this.canvas.getContext('2d');
    this._onResizeCb = null;
    this.resize();

    window.addEventListener('resize', () => {
      this.resize();
      if (this._onResizeCb) this._onResizeCb(this.W, this.H);
    });
  }
  onResize(cb) {
    this._onResizeCb = cb;
  }

  resize() {
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.W, this.H);
  }
}