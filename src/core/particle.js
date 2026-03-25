export class Particle {
  constructor(tx, ty, color) {
    this.x  = tx + (Math.random() - 0.5) * 8;
    this.y  = ty + (Math.random() - 0.5) * 8;
    this.tx = tx;
    this.ty = ty;
    this.vx = 0;
    this.vy = 0;

    this.color    = color;
    this.baseSize = 0.8 + Math.random() * 1.6;
    this.size     = this.baseSize;

    // Organic drift
    this.driftPhase = Math.random() * Math.PI * 2;
    this.driftFreq  = 0.003 + Math.random() * 0.007;
    this.driftR     = 1 + Math.random() * 3;

    // Breathing (radial pulse away from symbol centre)
    this.breathPhase = Math.random() * Math.PI * 2;
    this.breathAmp   = 0.8 + Math.random() * 2;
  }
}