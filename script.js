(function () {
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const mainCard = document.getElementById('mainCard');
  const successCard = document.getElementById('successCard');
  const buttonsWrapper = document.querySelector('.buttons-wrapper');

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

  let noClickCount = 0;
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

  btnNo.addEventListener('mouseover', function () {
    if (escapingMode) moveNoButton();
  });
  btnNo.addEventListener('click', function (e) {
    e.preventDefault();
    if (!escapingMode) {
      activateEscaping();
      updateNoButtonText();
    } else {
      moveNoButton();
      updateNoButtonText();
    }
  });
  btnNo.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (!escapingMode) {
      activateEscaping();
      updateNoButtonText();
    } else {
      moveNoButton();
      updateNoButtonText();
    }
  }, { passive: false });

  btnYes.addEventListener('click', showSuccess);
})();
