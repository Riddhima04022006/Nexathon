import { SETTLE_FRAMES } from '../config/config.js';

const REFORM_FRAMES = 150; 

export class MorphController {
  constructor(particleSystem) {
    this._ps            = particleSystem;
    this._currentSymbol = 'home';
    this._phase         = 'idle';   
    this._morphTimer    = 0;
    this._settleTimer   = SETTLE_FRAMES;
  }


  get currentSymbol()   { return this._currentSymbol; }
  get isReforming()     { return this._phase === 'reforming'; }
  get isFullySettled()  { return this._phase === 'idle' && this._settleTimer >= SETTLE_FRAMES; }

  morphTo(symKey) {
    if (symKey === this._currentSymbol) return;
    this._currentSymbol = symKey;
    this._phase         = 'reforming';
    this._morphTimer    = 0;
    this._settleTimer   = 0;
    this._ps.reassignTargets(symKey);
  }

  tick() {
    this._morphTimer++;

    if (this._phase === 'reforming') {
      if (this._morphTimer >= REFORM_FRAMES) {
        this._phase      = 'idle';
        this._morphTimer = 0;
      }
    } else {
      if (this._settleTimer < SETTLE_FRAMES) this._settleTimer++;
    }
  }
}