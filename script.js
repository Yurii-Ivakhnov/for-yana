(function () {
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const mainCard = document.getElementById('mainCard');
  const successCard = document.getElementById('successCard');
  const buttonsWrapper = document.querySelector('.buttons-wrapper');
  const videoOverlay = document.getElementById('videoOverlay');
  const rejectVideo = document.getElementById('rejectVideo');
  const videoClose = document.getElementById('videoClose');

  const noButtonTexts = [
    'Нет',
    'Уверена?',
    'Подумай ещё',
    'Почему?',
    'Точно нет?',
    'Жаль',
    'Попробуй ещё раз',
    'Не торопись',
    'Может, да?',
    'Я жду',
  ];

  const NO_REJECT_LIMIT = 15;
  let noClickCount = 0;
  let noRejectCount = 0;
  let escapingMode = false;

  function moveNoButton() {
    if (!escapingMode) return;
    const card = mainCard.getBoundingClientRect();
    const btn = btnNo.getBoundingClientRect();
    const padding = 20;
    const maxX = Math.max(0, card.width - btn.width - padding * 2);
    const maxY = Math.max(0, card.height - btn.height - padding * 2);
    const newX = maxX > 0 ? padding + Math.random() * maxX : padding;
    const newY = maxY > 0 ? padding + Math.random() * maxY : padding;
    btnNo.style.left = newX + 'px';
    btnNo.style.top = newY + 'px';
    btnNo.style.transform = 'none';
  }

  function activateEscaping() {
    escapingMode = true;
    btnNo.classList.add('escaping');
    mainCard.appendChild(btnNo);
    moveNoButton();
  }

  function updateNoButtonText() {
    noClickCount++;
    const index = Math.min(noClickCount, noButtonTexts.length - 1);
    btnNo.textContent = noButtonTexts[index];
    if (noClickCount >= noButtonTexts.length) {
      noClickCount = 0;
    }
  }

  function fireConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  function showSuccess() {
    mainCard.classList.add('hidden');
    successCard.hidden = false;
    successCard.querySelector('.hearts').textContent = '❤️❤️❤️';
    fireConfetti();
  }

  function showRejectVideo() {
    videoOverlay.hidden = false;
    rejectVideo.play().catch(function () { });
  }

  function hideRejectVideo() {
    videoOverlay.hidden = true;
    rejectVideo.pause();
    rejectVideo.currentTime = 0;
  }

  let lastNoInteraction = 0;
  function onNoClick() {
    const now = Date.now();
    if (now - lastNoInteraction < 300) return;
    lastNoInteraction = now;
    noRejectCount++;
    if (noRejectCount >= NO_REJECT_LIMIT) {
      showRejectVideo();
      return;
    }
    if (!escapingMode) {
      activateEscaping();
      updateNoButtonText();
    } else {
      moveNoButton();
      updateNoButtonText();
    }
  }

  btnNo.addEventListener('click', function (e) {
    e.preventDefault();
    onNoClick();
  });
  btnNo.addEventListener('touchstart', function (e) {
    e.preventDefault();
    onNoClick();
  }, { passive: false });

  if (videoClose) {
    videoClose.addEventListener('click', hideRejectVideo);
  }
  rejectVideo.addEventListener('ended', hideRejectVideo);

  btnYes.addEventListener('click', showSuccess);
})();
