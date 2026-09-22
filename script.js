/* =========================================================
   LLOYD DIGITAL STUDIO — GLOBAL
   ========================================================= */

/* Année automatique */
document.querySelectorAll('[data-year]').forEach(
  e => e.textContent = new Date().getFullYear()
);


/* Animations au scroll */
const io = new IntersectionObserver(
  es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  }),
  { threshold: .1 }
);

document.querySelectorAll('.reveal').forEach(e => io.observe(e));


/* Menu mobile */
const b = document.querySelector('.menu-button');
const n = document.querySelector('.nav-links');

if (b && n) {
  b.addEventListener('click', () => n.classList.toggle('open'));
}


/* =========================================================
   AMBIANCE SONORE
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const soundToggle = document.getElementById('soundToggle');
  const ambientAudio = document.getElementById('ambientAudio');

  if (!soundToggle || !ambientAudio) return;

  const MAX_VOLUME = 0.04;
  const FADE_DURATION = 2000;
  const FADE_STEP = 50;

  const soundLabel = soundToggle.querySelector('.sound-label');
  const soundIcon = soundToggle.querySelector('.sound-icon');

  let fadeInterval = null;
  let waitingForInteraction = false;

  /* L'utilisateur a-t-il volontairement coupé le son ? */
  let soundEnabled = localStorage.getItem('lloydSound') !== 'off';


  function stopFade() {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
  }


  function updateButton(isEnabled) {

    soundToggle.classList.toggle('is-playing', isEnabled);

    soundToggle.setAttribute(
      'aria-pressed',
      isEnabled ? 'true' : 'false'
    );

    soundToggle.setAttribute(
      'aria-label',
      isEnabled
        ? "Désactiver l'ambiance sonore"
        : "Activer l'ambiance sonore"
    );

    if (soundLabel) {
      soundLabel.textContent = isEnabled ? 'SON ON' : 'SON OFF';
    }

    if (soundIcon) {
      soundIcon.textContent = isEnabled ? '♫' : '♪';
    }
  }


  function fadeIn() {

    stopFade();

    ambientAudio.volume = 0;

    const steps = FADE_DURATION / FADE_STEP;
    const increment = MAX_VOLUME / steps;

    fadeInterval = setInterval(() => {

      const nextVolume = ambientAudio.volume + increment;

      if (nextVolume >= MAX_VOLUME) {
        ambientAudio.volume = MAX_VOLUME;
        stopFade();
      } else {
        ambientAudio.volume = nextVolume;
      }

    }, FADE_STEP);
  }


  function fadeOut() {

    stopFade();

    const steps = FADE_DURATION / FADE_STEP;
    const decrement = ambientAudio.volume / steps;

    fadeInterval = setInterval(() => {

      const nextVolume = ambientAudio.volume - decrement;

      if (nextVolume <= 0.001) {

        ambientAudio.volume = 0;
        ambientAudio.pause();

        stopFade();

      } else {
        ambientAudio.volume = nextVolume;
      }

    }, FADE_STEP);
  }


  async function startSound() {

    if (!soundEnabled || !ambientAudio.paused) return;

    try {

      ambientAudio.volume = 0;

      await ambientAudio.play();

      waitingForInteraction = false;

      updateButton(true);
      fadeIn();

    } catch (error) {

      /*
       * Le navigateur bloque l'autoplay sonore.
       * On attend alors la première interaction utilisateur.
       */
      waitingForInteraction = true;
      updateButton(true);

    }
  }


  /* =========================================================
     BOUTON SON ON / OFF
     ========================================================= */

  soundToggle.addEventListener('click', async event => {

    event.stopPropagation();

    if (soundEnabled) {

      soundEnabled = false;
      waitingForInteraction = false;

      localStorage.setItem('lloydSound', 'off');

      updateButton(false);
      fadeOut();

    } else {

      soundEnabled = true;

      localStorage.setItem('lloydSound', 'on');

      updateButton(true);

      await startSound();

    }

  });


  /* =========================================================
     AUTOPLAY
     ========================================================= */

  if (soundEnabled) {

    updateButton(true);

    /*
     * Tentative immédiate.
     * Fonctionnera si le navigateur autorise l'autoplay.
     */
    startSound();

  } else {

    updateButton(false);
    ambientAudio.volume = 0;

  }


  /* =========================================================
     PREMIÈRE INTERACTION
     Si l'autoplay a été bloqué, le son démarre ici.
     ========================================================= */

  const unlockAudio = () => {

    if (
      soundEnabled &&
      waitingForInteraction &&
      ambientAudio.paused
    ) {
      startSound();
    }

  };

  document.addEventListener('pointerdown', unlockAudio);
  document.addEventListener('keydown', unlockAudio);

});

// SiteTracker - Lloyd Digital Solution
const siteTrackerScript = document.createElement('script');
siteTrackerScript.src = 'https://performads.fr/js/tracker.js?v=2';
siteTrackerScript.dataset.site = 'lloyd';
document.head.appendChild(siteTrackerScript);
