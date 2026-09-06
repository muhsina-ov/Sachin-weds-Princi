/* -------------------------------------------------------------
   SACHIN & PRINCI ROYAL HINDU WEDDING DIGITAL INVITATION
   JavaScript Logic (Audio, Unseal, Countdown, Gallery, RSVP)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('weiOverlay');
  const videoWrap = document.getElementById('weiVideoWrap');
  const video = document.getElementById('weiVideo');
  const audio = document.getElementById('weiAudio');
  const audioBtn = document.getElementById('weiAudioBtn');
  const toast = document.getElementById('toastMsg');
  
  let unsealDone = false;

  // Unseal Sequence function
  function startUnsealSequence() {
    if (unsealDone) return;
    unsealDone = true;

    // Fade out wax seal overlay
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1200);

    // Play transition video if available
    if (videoWrap && video) {
      videoWrap.classList.add('wei-video-in');
      const videoPromise = video.play();
      if (videoPromise && videoPromise.catch) videoPromise.catch(() => {});

      // Fade out video near end
      video.addEventListener('timeupdate', function () {
        if (video.duration && video.currentTime >= video.duration - 0.8 && !video.dataset.fading) {
          video.dataset.fading = '1';
          videoWrap.classList.remove('wei-video-in');
          setTimeout(() => {
            videoWrap.style.display = 'none';
          }, 800);
        }
      });
    }

    // Play Background Audio
    if (audio) {
      audio.volume = 0.85;
      const audioPromise = audio.play();
      if (audioPromise && audioPromise.catch) {
        audioPromise.catch(err => {
          console.log("Audio autoplay prevented by browser:", err);
        });
      }
    }

    // Show floating audio button
    if (audioBtn) {
      audioBtn.classList.add('visible');
    }
  }

  // Bind tap/click on wax seal overlay
  if (overlay) {
    overlay.addEventListener('click', startUnsealSequence);
    overlay.addEventListener('touchstart', startUnsealSequence, { passive: true });
  }

  // Audio Toggle Button Logic
  if (audioBtn && audio) {
    audioBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
        audioBtn.classList.remove('paused');
      } else {
        audio.pause();
        audioBtn.classList.add('paused');
      }
    });
  }

  // Live Countdown Timer targeting Nov 24, 2026 19:00 IST
  const weddingDate = new Date('November 24, 2026 19:00:00 GMT+0530').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Photo Gallery Lightbox
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // Toast notification helper
  window.showToast = function (msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  // Copy Link function
  window.copyInviteLink = function () {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      showToast('✨ Invitation link copied!');
    }).catch(() => {
      showToast('Copied link to clipboard!');
    });
  };
});
