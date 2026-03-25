import { Renderer }        from './render/render.js';
import { MouseField }      from './interaction/mouseField.js';
import { ParticleSystem }  from './core/particleSystem.js';
import { MorphController } from './morph/morphController.js';

function setupVideoLoop() {
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const videoSrc = '/bg.mp4';
  const fadeTime = 1.5;

  v1.src = videoSrc;
  v2.src = videoSrc;

  let activeVideo = v1;
  let idleVideo   = v2;
  let transitioning = false;

  function checkTransition() {
    if (
      !transitioning &&
      activeVideo.duration &&
      activeVideo.currentTime > activeVideo.duration - fadeTime
    ) {
      transitioning = true;

      idleVideo.currentTime = 0;
      idleVideo.play().catch(() => {});

      idleVideo.style.opacity = '1';
      activeVideo.style.opacity = '0';

      const prev = activeVideo;
      activeVideo = idleVideo;
      idleVideo   = prev;

      setTimeout(() => {
        idleVideo.pause();
        transitioning = false;
      }, fadeTime * 1000);
    }
    requestAnimationFrame(checkTransition);
  }

  function start() {
    activeVideo.play()
      .then(() => requestAnimationFrame(checkTransition))
      .catch(() => {
        document.body.addEventListener('click', () => {
          activeVideo.play().then(() => requestAnimationFrame(checkTransition));
        }, { once: true });
      });
  }

  if (v1.readyState >= 1) {
    start();
  } else {
    v1.addEventListener('loadedmetadata', start, { once: true });
  }
}


function setupSound() {
  const v1        = document.getElementById('v1');
  const v2        = document.getElementById('v2');
  const soundLink = document.getElementById('sound-link');
  let muted = true;

  soundLink.addEventListener('click', e => {
    e.preventDefault();
    muted = !muted;
    v1.muted = muted;
    v2.muted = muted;
    soundLink.textContent = muted ? 'SOUND' : 'MUTE';
  });
}


function setupParticles() {
  const renderer = new Renderer('menu-canvas');
  const mouse    = new MouseField();

  const ps = new ParticleSystem({
    canvasW:       renderer.W,
    canvasH:       renderer.H,
    initialSymbol: 'home',
    activePalette: 'white',
  });

  const mc = new MorphController(ps);

  renderer.onResize((W, H) => {
    ps.onResize(W, H, mc.currentSymbol);
  });

  window._menuMorph = (symbol) => mc.morphTo(symbol);

  let breathT = 0;
  let frame   = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame++;
    breathT += 0.007;
    renderer.clear();
    mouse.tick(frame);
    mc.tick();
    ps.update(renderer.ctx, breathT, mouse.x, mouse.y, mc.isFullySettled, mc.isReforming);
  }

  animate();
}


function setupNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const href = item.dataset.href;
      if (href) window.location.href = href;
    });

    item.addEventListener('mouseenter', () => {
      if (window._menuMorph) window._menuMorph(item.dataset.symbol);
    });

    item.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (window._menuMorph) window._menuMorph(item.dataset.symbol);
    }, { passive: false });
  });
}


setupVideoLoop();
setupSound();
setupParticles();
setupNav();