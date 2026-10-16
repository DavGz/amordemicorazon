/**
 * CARTA PARA GABRIELA - GABRIELA & DAVID
 * Script: Stardust Canvas, Música de Fondo & Experiencia Inmersiva
 */

document.addEventListener('DOMContentLoaded', () => {
  // Canvases & Elements
  const starsCanvas = document.getElementById('letterStarsCanvas');
  const audioToggle = document.getElementById('letterAudioToggle');
  const audioBtnText = document.getElementById('letterAudioBtnText');
  const bgAudio = document.getElementById('letterBgAudio');

  // Mouse & Viewport State
  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (starsCanvas) {
      starsCanvas.width = width;
      starsCanvas.height = height;
      initStars();
    }
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
    }
  }, { passive: true });

  // ==========================================================================
  // 1. STARFIELD PARTICLES
  // ==========================================================================
  let stars = [];
  const STAR_COUNT = 160;

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        baseAlpha: Math.random() * 0.7 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        twinkleOffset: Math.random() * Math.PI * 2,
        speedMultiplier: Math.random() * 0.025 + 0.01,
        isWarm: Math.random() > 0.45
      });
    }
  }

  const starsCtx = starsCanvas ? starsCanvas.getContext('2d') : null;

  function renderStars() {
    if (!starsCtx) return;
    starsCtx.clearRect(0, 0, width, height);

    const offsetX = (mouse.x - width / 2);
    const offsetY = (mouse.y - height / 2);

    stars.forEach(star => {
      star.twinkleOffset += star.twinkleSpeed;
      const alpha = star.baseAlpha + Math.sin(star.twinkleOffset) * 0.28;
      const safeAlpha = Math.max(0.08, Math.min(1, alpha));

      starsCtx.fillStyle = star.isWarm
        ? `rgba(255, 235, 205, ${safeAlpha})`
        : `rgba(235, 240, 255, ${safeAlpha})`;

      starsCtx.beginPath();
      starsCtx.arc(
        star.x + offsetX * star.speedMultiplier,
        star.y + offsetY * star.speedMultiplier,
        star.size,
        0,
        Math.PI * 2
      );
      starsCtx.fill();
    });
  }

  // ==========================================================================
  // 2. AUDIO REPRODUCER: "A MOMENT" DE DANIEL PEMBERTON
  // ==========================================================================
  let isAudioPlaying = false;

  function playTrack() {
    if (!bgAudio) return;
    bgAudio.volume = 0.85;

    const promise = bgAudio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          isAudioPlaying = true;
          if (audioToggle) audioToggle.classList.add('playing');
          if (audioBtnText) audioBtnText.textContent = 'A Moment ♫';
          sessionStorage.setItem('bgAudioPlaying', 'true');
        })
        .catch(() => {
          // Autoplay was prevented by browser policy, waiting for user click
          isAudioPlaying = false;
          if (audioToggle) audioToggle.classList.remove('playing');
        });
    }
  }

  function pauseTrack() {
    if (!bgAudio) return;
    bgAudio.pause();
    isAudioPlaying = false;
    if (audioToggle) audioToggle.classList.remove('playing');
    sessionStorage.setItem('bgAudioPlaying', 'false');
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAudioPlaying) {
        pauseTrack();
      } else {
        playTrack();
      }
    });
  }

  // Si el audio venía sonando desde el sobre o el usuario interactúa con la pantalla
  const wasPlaying = sessionStorage.getItem('bgAudioPlaying') === 'true';
  if (wasPlaying) {
    playTrack();
  }

  // Un primer toque en la página iniciará la música automáticamente si el navegador lo bloqueó
  const autoPlayOnTouch = () => {
    if (!isAudioPlaying) {
      playTrack();
    }
    window.removeEventListener('click', autoPlayOnTouch);
    window.removeEventListener('touchstart', autoPlayOnTouch);
  };
  window.addEventListener('click', autoPlayOnTouch, { once: true });
  window.addEventListener('touchstart', autoPlayOnTouch, { once: true });

  // ==========================================================================
  // 3. MAIN ANIMATION LOOP
  // ==========================================================================
  function loop() {
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    renderStars();
    requestAnimationFrame(loop);
  }

  handleResize();
  loop();
});
