export class MouseField {
  constructor() {
    this.x = window.innerWidth  / 2;
    this.y = window.innerHeight / 2;

    this._prevX   = this.x;
    this._prevY   = this.y;
    this._vx      = 0;
    this._vy      = 0;
    this.isMoving = false;

    this._dot  = document.getElementById('cursor-dot');
    this._ring = document.getElementById('cursor-ring');

    document.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      if (this._dot) {
        this._dot.style.left = e.clientX + 'px';
        this._dot.style.top  = e.clientY + 'px';
      }
    });
  }

  tick(frame) {
    this._vx = this.x - this._prevX;
    this._vy = this.y - this._prevY;
    const spd = Math.sqrt(this._vx * this._vx + this._vy * this._vy);
    this.isMoving = spd > 1;

    if (this._ring) {
      this._ring.style.left = this.x + 'px';
      this._ring.style.top  = this.y + 'px';
    }

    this._prevX = this.x;
    this._prevY = this.y;
  }

  scaleCursor(factor) {
    const t = `translate(-50%,-50%) scale(${factor})`;
    if (this._dot)  this._dot.style.transform  = t;
    if (this._ring) this._ring.style.transform = t;
  }

  resetCursor() { this.scaleCursor(1); }
}