/**
 * GABRIELA & DAVID - PROJECT HAIL MARY LOVE SCRAPBOOK
 * Script: Pestañas Interactivas, Navegación por Scroll del Ratón,
 * Doodles de Rocky & Parche, Stardust Canvas & Melodía Cósmica
 */

document.addEventListener('DOMContentLoaded', () => {
  // Canvases
  const starsCanvas = document.getElementById('starsCanvas');
  const astrophageCanvas = document.getElementById('astrophageCanvas');

  // Navigation & Tabs Elements
  const tabButtons = document.querySelectorAll('.story-tab-btn');
  const navBookmarks = document.querySelectorAll('.nav-bookmark');
  const scrollMeterText = document.getElementById('scrollMeterText');
  const audioToggle = document.getElementById('audioToggle');
  const audioBtnText = document.getElementById('audioBtnText');
  const nextChapterBtn = document.getElementById('nextChapterBtn');

  // Film Layers
  const layerCosmos = document.getElementById('layerCosmos');
  const layerAstrophage = document.getElementById('layerAstrophage');
  const layerTauceti = document.getElementById('layerTauceti');

  // Doodles
  const doodlePatch = document.getElementById('doodlePatch');
  const doodleRockyWave = document.getElementById('doodleRockyWave');
  const doodleRockyFist = document.getElementById('doodleRockyFist');

  // Journal Cards
  const cards = [
    document.getElementById('act1'),
    document.getElementById('act2'),
    document.getElementById('act3'),
    document.getElementById('act4'),
    document.getElementById('act5'),
    document.getElementById('act6')
  ];

  // Current State: Act Index (0 to 5)
  let currentAct = 0;
  const TOTAL_ACTS = 6;
  let isNavigating = false;

  // Mouse & Parallax State
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };
  let width = window.innerWidth;
  let height = window.innerHeight;

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    starsCanvas.width = width;
    starsCanvas.height = height;
    astrophageCanvas.width = width;
    astrophageCanvas.height = height;
    initStars();
    initAstrophage();
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  // ==========================================================================
  // 1. ACT STATE CHANGER (SISTEMA DE PESTAÑAS Y SCROLL)
  // ==========================================================================
  function goToAct(index) {
    if (index < 0 || index >= TOTAL_ACTS) return;
    currentAct = index;

    // 1. Update Top Tabs
    tabButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentAct);
    });

    // 2. Update Footer Status
    scrollMeterText.textContent = `Pestaña activa: ${currentAct + 1} de ${TOTAL_ACTS}`;

    // 4. Update Journal Cards
    cards.forEach((card, idx) => {
      if (card) card.classList.toggle('visible', idx === currentAct);
    });

    // 5. Update Background Film Layers
    // Act 0: Cosmos
    // Act 1: Red Astrophage
    // Act 2: Emerald Tau Ceti
    // Act 3: Gabriela & David (Cosmos with warm ambient glow & Tau Ceti)
    // Act 4: Galería de Recuerdos (Deep twilight stars & warm nebula)
    // Act 5: Dedicatoria (Deep starry cosmos with warm ambient candlelight glow)
    layerCosmos.style.opacity = (currentAct === 0 || currentAct === 4 || currentAct === 5) ? 1 : (currentAct === 3 ? 0.65 : 0);
    layerAstrophage.style.opacity = currentAct === 1 ? 1 : 0;
    layerTauceti.style.opacity = (currentAct === 2 || currentAct === 3) ? 1 : 0;

    // 6. Update Doodles Visibility
    if (doodlePatch) doodlePatch.classList.toggle('visible', currentAct === 0);
    if (doodleRockyWave) doodleRockyWave.classList.toggle('visible', currentAct === 1);
    if (doodleRockyFist) doodleRockyFist.classList.toggle('visible', currentAct === 2);

    // 7. Auto-scroll active tab into view for mobile devices
    if (tabButtons[currentAct]) {
      tabButtons[currentAct].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    // 8. Reset card scroll position to top
    if (cards[currentAct]) {
      cards[currentAct].scrollTop = 0;
      const viewport = cards[currentAct].querySelector('.card-scroll-viewport');
      if (viewport) {
        viewport.scrollTop = 0;
      }
    }
  }

  // Click on Top Tab Buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const act = parseInt(btn.getAttribute('data-act'), 10);
      goToAct(act);
    });
  });

  // Click on Side Ribbon Bookmarks
  navBookmarks.forEach(bm => {
    bm.addEventListener('click', () => {
      const act = parseInt(bm.getAttribute('data-act'), 10);
      goToAct(act);
    });
  });

  // Click on Card Next / Prev Buttons
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetAct = parseInt(btn.getAttribute('data-goto'), 10);
      goToAct(targetAct);
    });
  });

  // ==========================================================================
  // 2. NAVEGACIÓN INTUITIVA CON EL SCROLL DEL RATÓN (MOUSE WHEEL)
  // Desplazamiento nativo y libre en Galería y Carta; cambio de acto en páginas estáticas
  // ==========================================================================
  let wheelTimeout = null;
  let accumulatedDelta = 0;
  const WHEEL_THRESHOLD = 110;

  window.addEventListener('wheel', (e) => {
    // 1. Si el modal lightbox de fotos está abierto, no interferir
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      return;
    }

    const activeCard = cards[currentAct];
    const scrollViewport = activeCard ? activeCard.querySelector('.card-scroll-viewport') : null;

    // 2. Si la tarjeta activa tiene un contenedor con scroll interno (Galería de fotos o Carta de dedicatoria):
    if (scrollViewport && (scrollViewport.scrollHeight > scrollViewport.clientHeight + 10)) {
      // Comprobar si el cursor o el evento del mouse está dentro de la tarjeta o del visor con scroll
      const isInsideCard = e.target && (activeCard === e.target || activeCard.contains(e.target));

      if (isInsideCard) {
        // PERMITIR SCROLL NATIVO 100% LIBRE, PRECISO Y SIN INTERRUPCIONES:
        // No prevenimos el evento para que el navegador use scroll nativo suave (momentum/inercia).
        // Reseteamos el delta acumulado para que el usuario pueda ver sus fotos o leer sin saltar de página.
        accumulatedDelta = 0;
        return;
      }
    }

    // 3. Para las tarjetas sin scroll (Actos 1, 2, 3, 4) o si el usuario rueda en el fondo estrellado exterior:
    const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
    accumulatedDelta += delta;

    if (isNavigating) return;

    if (Math.abs(accumulatedDelta) > WHEEL_THRESHOLD) {
      if (accumulatedDelta > 0 && currentAct < TOTAL_ACTS - 1) {
        // Gira hacia abajo -> Avanza a la siguiente pestaña
        isNavigating = true;
        goToAct(currentAct + 1);
      } else if (accumulatedDelta < 0 && currentAct > 0) {
        // Gira hacia arriba -> Vuelve a la pestaña anterior
        isNavigating = true;
        goToAct(currentAct - 1);
      }

      accumulatedDelta = 0;
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        isNavigating = false;
      }, 550); // Pausa suave entre cambios de acto
    }

    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      accumulatedDelta = 0;
      isNavigating = false;
    }, 250);
  }, { passive: true });

  // Navegación con teclado (Flechas arriba/abajo o izquierda/derecha)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (currentAct < TOTAL_ACTS - 1) goToAct(currentAct + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentAct > 0) goToAct(currentAct - 1);
    }
  });

  // ==========================================================================
  // SOPORTE TÁCTIL INTELIGENTE PARA MÓVILES Y TABLETS
  // Evita interrupciones al hacer scroll en la galería y permite swipe horizontal
  // ==========================================================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTouchInsideScrollable = false;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();

      // En móviles, el toque mueve sutilmente las estrellas y partículas
      mouse.targetX = touchStartX;
      mouse.targetY = touchStartY;

      // Verificar si el toque inició dentro de una tarjeta con scroll interno
      const scrollableTarget = e.target.closest('.card-scroll-viewport, .gallery-scroll-viewport, .letter-scroll-viewport, .gallery-card, .journal-card');
      isTouchInsideScrollable = !!(scrollableTarget && (scrollableTarget.scrollHeight > scrollableTarget.clientHeight + 15));
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      // Efecto de paralaje suave al arrastrar el dedo en pantalla
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const duration = Date.now() - touchStartTime;

    // 1. Si el modal lightbox de fotos está abierto, navegar fotos con swipe horizontal
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          // Deslizó hacia la izquierda -> siguiente foto
          currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
          openLightbox(currentPhotoIndex);
        } else {
          // Deslizó hacia la derecha -> foto anterior
          currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
          openLightbox(currentPhotoIndex);
        }
      }
      return; // Nunca cambiar de acto de fondo mientras el visor de fotos está abierto
    }

    // 2. Si el toque fue sobre la barra superior de pestañas, no cambiar de acto (permite desplazar las pestañas)
    if (e.target.closest('.story-tabs-bar')) {
      return;
    }

    // 3. Si el usuario está navegando dentro de una tarjeta con scroll interno (como la galería de fotos o la carta)
    const activeCard = cards[currentAct];
    const scrollViewport = activeCard ? activeCard.querySelector('.card-scroll-viewport') : null;

    if (activeCard && (isTouchInsideScrollable || scrollViewport)) {
      // En dispositivos táctiles, permitir swipe horizontal intencional para cambiar de acto
      if (Math.abs(diffX) > 75 && Math.abs(diffX) > Math.abs(diffY) * 1.5 && duration < 600) {
        if (diffX > 0 && currentAct < TOTAL_ACTS - 1) {
          goToAct(currentAct + 1);
        } else if (diffX < 0 && currentAct > 0) {
          goToAct(currentAct - 1);
        }
        return;
      }

      // El deslizamiento vertical se reserva exclusivamente para scroll del contenido
      return;
    }

    // 4. En tarjetas sin scroll o tocando el fondo: swipe horizontal o vertical
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX > 45 && absX > absY) {
      // Swipe Horizontal (izquierda = avanzar, derecha = retroceder)
      if (diffX > 0 && currentAct < TOTAL_ACTS - 1) {
        goToAct(currentAct + 1);
      } else if (diffX < 0 && currentAct > 0) {
        goToAct(currentAct - 1);
      }
    } else if (absY > 45) {
      // Swipe Vertical (arriba = avanzar, abajo = retroceder)
      if (diffY > 0 && currentAct < TOTAL_ACTS - 1) {
        goToAct(currentAct + 1);
      } else if (diffY < 0 && currentAct > 0) {
        goToAct(currentAct - 1);
      }
    }
  }, { passive: true });

  // ==========================================================================
  // 3. WARM STARDUST & STARS CANVAS
  // ==========================================================================
  const starsCtx = starsCanvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 180;

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.75 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        speedMultiplier: Math.random() * 0.35 + 0.05,
        isWarm: Math.random() > 0.6
      });
    }
  }

  function renderStars() {
    starsCtx.clearRect(0, 0, width, height);

    const offsetX = (mouse.x - width / 2) * 0.015;
    const offsetY = (mouse.y - height / 2) * 0.015;

    stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed;
      const currentAlpha = star.alpha + Math.sin(star.twinklePhase) * 0.25;
      const safeAlpha = Math.max(0.15, Math.min(1, currentAlpha));

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
  // 4. ASTROPHAGE GLOWING PARTICLES & ROMANTIC FIREFLIES
  // ==========================================================================
  const astroCtx = astrophageCanvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 75;

  function initAstrophage() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 8 + 2.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        isBokeh: Math.random() > 0.7
      });
    }
  }

  function renderAstrophage() {
    astroCtx.clearRect(0, 0, width, height);

    // Particles active during Act 1 (Astrophage) and Act 2 (Tau Ceti)
    if (currentAct !== 1 && currentAct !== 2) return;

    const mouseDist = 120;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -40) p.x = width + 40;
      if (p.x > width + 40) p.x = -40;
      if (p.y < -40) p.y = height + 40;
      if (p.y > height + 40) p.y = -40;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseDist) {
        const force = (1 - dist / mouseDist) * 1.2;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }

      p.pulseOffset += p.pulseSpeed;
      const pulse = 0.85 + Math.sin(p.pulseOffset) * 0.25;
      const currentRadius = p.radius * pulse;

      // Crimson in Act 1, Emerald/Gold in Act 2
      let r = currentAct === 1 ? 255 : 16;
      let g = currentAct === 1 ? 51 : 185;
      let b = currentAct === 1 ? 102 : 129;

      const alpha = p.isBokeh ? 0.35 : 0.8;

      const grad = astroCtx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, currentRadius * (p.isBokeh ? 2.8 : 2.0)
      );

      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      grad.addColorStop(0.5, `rgba(${r}, ${Math.floor(g * 0.6)}, ${b}, ${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${r}, 0, 40, 0)`);

      astroCtx.fillStyle = grad;
      astroCtx.beginPath();
      astroCtx.arc(p.x, p.y, currentRadius * (p.isBokeh ? 2.8 : 2.0), 0, Math.PI * 2);
      astroCtx.fill();

      if (!p.isBokeh) {
        astroCtx.fillStyle = `rgba(255, 250, 240, ${alpha * 0.95})`;
        astroCtx.beginPath();
        astroCtx.arc(p.x, p.y, currentRadius * 0.28, 0, Math.PI * 2);
        astroCtx.fill();
      }
    });
  }

  // ==========================================================================
  // 5. ROCKY'S MUSICAL CHORD CHIMES (Tríadas eridianas)
  // ==========================================================================
  function playRockyChimes() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = audioCtx || new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // D5, F#5, A5
      const chordNotes = [587.33, 739.99, 880.00];

      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.7);
      });
    } catch (e) {
      console.log('Audio note:', e);
    }
  }

  // ==========================================================================
  // 5.B SISTEMA UNIVERSAL DE SONIDOS PERSONALIZADOS PARA TODOS LOS DOODLES
  // ==========================================================================
  let currentDoodleAudio = null;

  const allDoodles = document.querySelectorAll('.card-doodle');
  allDoodles.forEach(doodle => {
    doodle.style.cursor = 'pointer';
    doodle.addEventListener('click', () => {
      // 1. Animación de rebote visual
      doodle.classList.remove('doodle-clicked');
      void doodle.offsetWidth; // Forzar reflow para reiniciar animación
      doodle.classList.add('doodle-clicked');
      setTimeout(() => {
        doodle.classList.remove('doodle-clicked');
      }, 650);

      // Si es Rocky saludando, también animar su bocadillo de diálogo
      const bubble = doodle.querySelector('.speech-bubble-rocky');
      if (bubble) {
        bubble.style.transform = 'scale(1.2) rotate(-3deg)';
        setTimeout(() => { bubble.style.transform = 'scale(1) rotate(0deg)'; }, 400);
      }

      // 2. Detener audio anterior de doodle si había uno sonando
      if (currentDoodleAudio) {
        try {
          currentDoodleAudio.pause();
          currentDoodleAudio.currentTime = 0;
        } catch (err) { }
      }

      // 3. Reproducir el archivo de sonido asignado al doodle
      const soundSrc = doodle.getAttribute('data-sound');
      if (soundSrc) {
        try {
          currentDoodleAudio = new Audio(soundSrc);
          currentDoodleAudio.volume = 0.9;
          const playPromise = currentDoodleAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.log('Audio file error, fallback a acordes:', err);
              playRockyChimes();
            });
          }
        } catch (e) {
          playRockyChimes();
        }
      } else {
        playRockyChimes();
      }
    });
  });

  // ==========================================================================
  // 6. REPRODUCTOR OFICIAL: "A MOMENT" DE PROJECT HAIL MARY (DANIEL PEMBERTON)
  // ==========================================================================
  const bgAudio = document.getElementById('bgAudio');
  let audioCtx = null;
  let isAudioPlaying = false;
  let synthNodes = [];

  function playOfficialTrack() {
    if (!bgAudio) return false;

    // Asegurar que el audio tenga el volumen activo
    bgAudio.volume = 0.85;

    // Si aún no tiene un src activo o falló antes, asegurarlo
    if (!bgAudio.currentSrc && !bgAudio.src) {
      bgAudio.src = 'assets/music/a_moment.mp3';
    }

    const playPromise = bgAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioPlaying = true;
          audioToggle.classList.add('playing');
          if (audioBtnText) audioBtnText.textContent = 'A Moment ♫';
        })
        .catch(err => {
          console.warn('Error al iniciar a_moment.mp3:', err);
          // Probar con a_moment.m4a directamente
          bgAudio.src = 'assets/music/a_moment.m4a';
          bgAudio.load();
          bgAudio.play()
            .then(() => {
              isAudioPlaying = true;
              audioToggle.classList.add('playing');
              if (audioBtnText) audioBtnText.textContent = 'A Moment ♫';
            })
            .catch(err2 => {
              console.warn('Fallback al sintetizador ambiental:', err2);
              startAmbientMelody();
            });
        });
      return true;
    }
    return false;
  }

  function pauseOfficialTrack() {
    if (!bgAudio) return;
    bgAudio.pause();
    isAudioPlaying = false;
    audioToggle.classList.remove('playing');
  }

  function startAmbientMelody() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 2.5);
    masterGain.connect(audioCtx.destination);

    const baseFreqs = [73.42, 110.00, 146.83, 174.61, 220.00, 261.63, 329.63];

    baseFreqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + i * 50, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.07 / baseFreqs.length, audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start();
      synthNodes.push(osc);
    });

    synthNodes.push(masterGain);
    isAudioPlaying = true;
    audioToggle.classList.add('playing');
  }

  function toggleAudio() {
    // Si tenemos el elemento de audio bgAudio:
    if (bgAudio) {
      if (bgAudio.paused) {
        playOfficialTrack();
      } else {
        pauseOfficialTrack();
      }
      return;
    }

    // Fallback secundario si no existiera el elemento de audio
    if (!audioCtx) {
      startAmbientMelody();
      return;
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isAudioPlaying = true;
      audioToggle.classList.add('playing');
    } else if (audioCtx.state === 'running') {
      audioCtx.suspend();
      isAudioPlaying = false;
      audioToggle.classList.remove('playing');
    }
  }

  // Auto-loop y listeners de eventos de audio
  if (bgAudio) {
    bgAudio.addEventListener('ended', () => {
      bgAudio.currentTime = 0;
      bgAudio.play();
    });
    bgAudio.addEventListener('play', () => {
      isAudioPlaying = true;
      audioToggle.classList.add('playing');
    });
    bgAudio.addEventListener('pause', () => {
      if (!isAudioPlaying) {
        audioToggle.classList.remove('playing');
      }
    });
  }

  audioToggle.addEventListener('click', toggleAudio);

  // ==========================================================================
  // 7. BOTÓN DIRECTO A LA GALERÍA DE RECUERDOS (ACTO 5)
  // ==========================================================================
  if (nextChapterBtn) {
    nextChapterBtn.addEventListener('click', () => {
      playRockyChimes();
      goToAct(4);
    });
  }

  // ==========================================================================
  // 8. INTERACTIVIDAD DE LA GALERÍA DE POLAROIDS & LIGHTBOX MODAL
  // ==========================================================================
  const polaroids = document.querySelectorAll('.polaroid-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxLegend = document.getElementById('lightboxLegend');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let currentPhotoIndex = 0;
  let galleryData = [];

  polaroids.forEach((item, index) => {
    galleryData.push({
      img: item.getAttribute('data-img'),
      title: item.getAttribute('data-title'),
      date: item.getAttribute('data-date'),
      legend: item.getAttribute('data-legend')
    });

    // Abrir Lightbox al hacer clic en la polaroid
    item.addEventListener('click', (e) => {
      // Si se pulsa el botón de corazón, solo da like
      if (e.target.classList.contains('polaroid-fav-btn')) {
        e.stopPropagation();
        e.target.textContent = e.target.textContent === '♥' ? '💖' : '♥';
        e.target.style.transform = 'scale(1.4)';
        setTimeout(() => { e.target.style.transform = ''; }, 300);
        return;
      }

      playRockyChimes();
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!galleryData[index]) return;
    currentPhotoIndex = index;
    const data = galleryData[currentPhotoIndex];

    if (lightboxImg) lightboxImg.src = data.img;
    if (lightboxTag) lightboxTag.textContent = data.date;
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxLegend) lightboxLegend.textContent = data.legend;

    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', () => {
      currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
      openLightbox(currentPhotoIndex);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', () => {
      currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
      openLightbox(currentPhotoIndex);
    });
  }

  // Teclado para navegar en el lightbox modal
  window.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
        openLightbox(currentPhotoIndex);
      }
      if (e.key === 'ArrowRight') {
        currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
        openLightbox(currentPhotoIndex);
      }
    }
  });

  // ==========================================================================
  // 8. MAIN ANIMATION LOOP
  // ==========================================================================
  function loop() {
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    renderStars();
    renderAstrophage();

    requestAnimationFrame(loop);
  }

  // Initialize
  handleResize();
  goToAct(0);
  loop();
});
