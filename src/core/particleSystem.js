import { Particle } from './particle.js';
import { NUM_PARTICLES, PALETTES } from '../config/config.js';
import { renderSymbol, samplePoints } from '../shapes/CircleShape.js';

export class ParticleSystem {
  constructor({ canvasW, canvasH, initialSymbol, activePalette }) {
    this.W = canvasW;
    this.H = canvasH;
    this.activePalette = activePalette;

    this._initDimensions(canvasW, canvasH);

    this.mode = "idle";
    this.scatterProgress = 0;

    this._prevMouseX = 0;
    this._prevMouseY = 0;

    const keys = ['rebel', 'home', 'about', 'contact', 'structure'];
    this.rendered = {};
    for (const k of keys) {
      this.rendered[k] = renderSymbol(k, this.SZ);
    }

    const targets = this._buildTargets(initialSymbol);
    this.particles = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const t = targets[i % targets.length];
      const p = new Particle(t.x, t.y, this._randColor());

      p.tx = t.x;
      p.ty = t.y;

      this.particles.push(p);
    }
  }


  _initDimensions(canvasW, canvasH) {
    const isMobile = canvasW <= 600;

    this.SZ    = Math.min(canvasW, canvasH) * 1;
    this.SOffX = isMobile
      ? canvasW / 2 - this.SZ / 2
      : canvasW * 0.72 - this.SZ / 2;
    this.SOffY = isMobile
      ? canvasH * 0.38 - this.SZ / 2
      : canvasH / 2    - this.SZ / 2;

    this.symCX = this.SOffX + this.SZ / 2;
    this.symCY = this.SOffY + this.SZ / 2;
  }

  onResize(canvasW, canvasH, currentSymbol) {
    this.W = canvasW;
    this.H = canvasH;
    this._initDimensions(canvasW, canvasH);

    const keys = ['rebel', 'home', 'about', 'contact', 'structure'];
    for (const k of keys) {
      this.rendered[k] = renderSymbol(k, this.SZ);
    }

    this.reassignTargets(currentSymbol);
  }


  _randColor() {
    const pal = PALETTES[this.activePalette];
    const c   = pal[Math.floor(Math.random() * pal.length)];
    const a   = (0.6 + Math.random() * 0.38).toFixed(2);
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  }

  recolour() {
    for (const p of this.particles) {
      p.color = this._randColor();
    }
  }


  _buildTargets(symKey) {
    return samplePoints(
      this.rendered[symKey],
      NUM_PARTICLES,
      this.SOffX,
      this.SOffY
    );
  }


  reassignTargets(symKey) {
    const newTargets = this._buildTargets(symKey);

    const radius = this.SZ * 0.6;

    for (let i = 0; i < this.particles.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius * Math.sqrt(Math.random());

      this.particles[i].scatterX = this.symCX + Math.cos(angle) * r;
      this.particles[i].scatterY = this.symCY + Math.sin(angle) * r;
    }

    const tSorted = newTargets.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y));
    const pSorted = this.particles.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y));

    for (let i = 0; i < this.particles.length; i++) {
      pSorted[i].finalTx = tSorted[i % tSorted.length].x;
      pSorted[i].finalTy = tSorted[i % tSorted.length].y;
    }

    this.mode = "scatter";
    this.scatterProgress = 0;

    for (const p of this.particles) {
      p.tx = p.scatterX;
      p.ty = p.scatterY;
      p.vx = 0;
      p.vy = 0;
    }
  }


  update(ctx, breathT, mouseX, mouseY, isFullySettled, isReforming) {

    const mvx = mouseX - this._prevMouseX;
    const mvy = mouseY - this._prevMouseY;
    const cursorSpeed = Math.sqrt(mvx * mvx + mvy * mvy);

    if (this.mode === "scatter") {
      this.scatterProgress += 0.03;

      if (this.scatterProgress >= 1) {
        this.mode = "reform";

        for (const p of this.particles) {
          p.tx = p.finalTx;
          p.ty = p.finalTy;
          p.vx = 0;
          p.vy = 0;
        }
      }
    }

    const RADIUS = 110;
    const BASE_STRENGTH = 5.5;
    const speedBoost = Math.min(cursorSpeed * 0.18, 4.0);

    const SUBSTEPS = cursorSpeed > 8 ? 3 : 1;

    for (const p of this.particles) {

      if (this.mode === "idle") {
        p.x += (p.tx - p.x) * 0.05;
        p.y += (p.ty - p.y) * 0.05;
      } else {
        const speed = this.mode === "scatter" ? 0.06 : 0.08;
        p.x += (p.tx - p.x) * speed;
        p.y += (p.ty - p.y) * speed;
      }

      for (let s = 0; s < SUBSTEPS; s++) {
        const t  = (s + 1) / SUBSTEPS;
        const cx = this._prevMouseX + mvx * t;
        const cy = this._prevMouseY + mvy * t;

        const dx   = p.x - cx;
        const dy   = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS && dist > 0.001) {
          const force    = (RADIUS - dist) / RADIUS;
          const strength = (force * force * BASE_STRENGTH + speedBoost) / SUBSTEPS;
          const angle    = Math.atan2(dy, dx);

          p.x += Math.cos(angle) * strength;
          p.y += Math.sin(angle) * strength;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    if (this.mode === "reform") {
      let done = true;

      for (const p of this.particles) {
        if (Math.abs(p.x - p.tx) > 0.5 || Math.abs(p.y - p.ty) > 0.5) {
          done = false;
          break;
        }
      }

      if (done) {
        this.mode = "idle";
      }
    }

    this._prevMouseX = mouseX;
    this._prevMouseY = mouseY;
  }
}