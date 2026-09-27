/* 全局 AudioContext（解決手機音效無法播放問題） */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 通用按鈕音效 (啵 Pop 聲)
function playPopSound() {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
}

// 愛玉吃東西音效 (咀嚼/嚼嚼 Munch 聲)
function playMunchSound() {
  try {
    initAudio();
    const now = audioCtx.currentTime;
    
    // 第一聲咀嚼
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(280, now);
    osc1.frequency.exponentialRampToValueAtTime(120, now + 0.12);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // 第二聲咀嚼
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(350, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(150, now + 0.28);
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.28);
  } catch(e) {}
}

// 貓貓音效 (高音喵喵感)
function playMeowSound() {
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch(e) {}
}

/* 全局頁面淡入淡出切換 */
function switchPage(currentId, nextId) {
  const currentPage = document.getElementById(currentId);
  const nextPage = document.getElementById(nextId);
  if (!currentPage || !nextPage) return;

  currentPage.classList.remove('active');
  setTimeout(() => {
    nextPage.classList.add('active');
  }, 400);
}

/* 第一介面邏輯 */
const giftBtn = document.getElementById('giftBtn');

setTimeout(() => { triggerConfettiDrop(); }, 300);

function clickGift() {
  giftBtn.classList.remove('jelly-active');
  void giftBtn.offsetWidth;
  giftBtn.classList.add('jelly-active');
  
  playPopSound();
  triggerConfettiDrop();

  setTimeout(() => {
    switchPage('page1', 'page2');
  }, 1200);
}

function triggerConfettiDrop() {
  createFallingConfetti(false);
  createFallingConfetti(true);
}

function createFallingConfetti(isRight) {
  const confettiImg = document.createElement('img');
  confettiImg.src = 'img1/confetti-left.png';
  confettiImg.className = 'falling-confetti';
  if (isRight) {
    confettiImg.style.right = '20px';
    confettiImg.style.transform = 'scaleX(-1)';
  } else {
    confettiImg.style.left = '20px';
  }
  document.body.appendChild(confettiImg);
  setTimeout(() => {
    confettiImg.style.top = '105vh';
    confettiImg.style.opacity = '0.8';
  }, 50);
  setTimeout(() => { confettiImg.remove(); }, 2500);
}

/* 藍白細緻粒子系統 */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const colors = ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8'];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function addParticle(x, y) {
  particles.push({
    x: x, y: y,
    size: Math.random() * 2.5 + 1.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    type: Math.random() > 0.5 ? 'star' : 'dot',
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    alpha: 1
  });
}

function handleMove(e) {
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  for(let i = 0; i < 2; i++) addParticle(x, y);
}
window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove);

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
  let rot = Math.PI / 2 * 3, x = cx, y = cy, step = Math.PI / spikes;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y); rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y); rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.fill();
  ctx.restore();
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy; p.alpha -= 0.025;
    if (p.type === 'star') {
      drawStar(ctx, p.x, p.y, 5, p.size * 2, p.size, p.color, p.alpha);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fill();
    }
    if (p.alpha <= 0) { particles.splice(i, 1); i--; }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* 第二介面互動邏輯 */
let isHatOn = false;
const aiyu = document.getElementById('aiyu');
const dragHand = document.getElementById('drag-hand');
const dragCake = document.getElementById('drag-cake');
const catCompanion = document.getElementById('cat-companion');

// 選單單擊
document.getElementById('menu-toggle-btn').addEventListener('click', () => {
  playPopSound();
  document.getElementById('sub-menu').classList.toggle('hidden');
});

// 帽子按鈕
document.getElementById('btn-hat').addEventListener('click', () => {
  playPopSound();
  isHatOn = !isHatOn;
  aiyu.src = isHatOn ? 'img2/aiyu_hat.png' : 'img2/aiyu_normal.png';
});

// 手按鈕
document.getElementById('btn-hand').addEventListener('click', () => {
  playPopSound();
  dragHand.classList.toggle('hidden');
  if (!dragHand.classList.contains('hidden')) {
    dragHand.style.left = '20vw';
    dragHand.style.top = '55vh';
  }
});

// 蛋糕按鈕
document.getElementById('btn-cake').addEventListener('click', () => {
  playPopSound();
  dragCake.classList.toggle('hidden');
  if (!dragCake.classList.contains('hidden')) {
    dragCake.style.left = '60vw';
    dragCake.style.top = '55vh';
  }
});

// 隱藏貓貓按鈕
document.getElementById('btn-cat').addEventListener('click', () => {
  playPopSound();
  catCompanion.classList.toggle('hidden');
});

// 貓貓被點擊彈跳與音效
catCompanion.addEventListener('click', () => {
  playMeowSound();
  catCompanion.classList.add('cat-pat-bounce');
  setTimeout(() => { catCompanion.classList.remove('cat-pat-bounce'); }, 800);
});

// 右側按鈕：重置
document.getElementById('btn-reset-character').addEventListener('click', () => {
  playPopSound();
  isHatOn = false;
  aiyu.src = 'img2/aiyu_normal.png';
  aiyu.className = 'aiyu-img idle-swing';
  dragHand.classList.add('hidden');
  dragCake.classList.add('hidden');
});

// 右側按鈕：看信 (進入第3介面)
document.getElementById('btn-go-letter').addEventListener('click', () => {
  playPopSound();
  switchPage('page2', 'page3');
});

// 第三介面：前往第四介面
document.getElementById('btn-go-p4').addEventListener('click', () => {
  playPopSound();
  switchPage('page3', 'page4');
});

// 點擊信封打開動畫
const envelopeWrapper = document.getElementById('envelopeWrapper');
if (envelopeWrapper) {
  envelopeWrapper.addEventListener('click', (e) => {
    // 避免點擊按鈕時重複觸發
    if (e.target.tagName !== 'BUTTON') {
      playPopSound();
      envelopeWrapper.classList.add('open');
    }
  });
}

// 第四介面：返回第二介面 + 解鎖貓貓！
document.getElementById('btn-back-to-p2-from-p4').addEventListener('click', () => {
  playPopSound();
  switchPage('page4', 'page2');
  // 這裡解鎖貓貓按鈕與顯示貓貓！
  document.getElementById('btn-cat').classList.remove('hidden');
  catCompanion.classList.remove('hidden');
});

// 通用拖動邏輯
function makeDraggable(elmnt, onDrag, onRelease) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  elmnt.ontouchstart = dragTouchStart;

  function dragMouseDown(e) {
    e.preventDefault();
    initAudio();
    pos3 = e.clientX; pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function dragTouchStart(e) {
    initAudio();
    const touch = e.touches[0];
    pos3 = touch.clientX; pos4 = touch.clientY;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementTouchDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
    pos3 = e.clientX; pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    if (onDrag) onDrag(elmnt);
  }

  function elementTouchDrag(e) {
    const touch = e.touches[0];
    pos1 = pos3 - touch.clientX; pos2 = pos4 - touch.clientY;
    pos3 = touch.clientX; pos4 = touch.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    if (onDrag) onDrag(elmnt);
  }

  function closeDragElement() {
    document.onmouseup = null; document.onmousemove = null;
    document.ontouchend = null; document.ontouchmove = null;
    if (onRelease) onRelease(elmnt);
  }
}

function isOverlapping(rect1, rect2) {
  return !(rect1.right < rect2.left || rect1.left > rect2.right || 
           rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

// 摸頭/摸貓判定 (手)
makeDraggable(dragHand, 
  (hand) => {
    const handRect = hand.getBoundingClientRect();
    const aiyuRect = aiyu.getBoundingClientRect();
    const catRect = catCompanion.getBoundingClientRect();

    const headRect = {
      left: aiyuRect.left,
      right: aiyuRect.right,
      top: aiyuRect.top,
      bottom: aiyuRect.top + (aiyuRect.height * 0.45)
    };

    // 摸愛玉頭
    if (isOverlapping(handRect, headRect)) {
      if (!isHatOn) aiyu.src = 'img2/aiyu_closed.png';
      aiyu.classList.add('head-pat-swing');
    } else {
      if (!isHatOn) aiyu.src = 'img2/aiyu_normal.png';
      aiyu.classList.remove('head-pat-swing');
    }

    // 摸貓貓 Q 彈動態
    if (!catCompanion.classList.contains('hidden') && isOverlapping(handRect, catRect)) {
      catCompanion.classList.add('cat-pat-bounce');
    } else {
      catCompanion.classList.remove('cat-pat-bounce');
    }
  },
  () => {
    if (!isHatOn) aiyu.src = 'img2/aiyu_normal.png';
    aiyu.classList.remove('head-pat-swing');
    catCompanion.classList.remove('cat-pat-bounce');
  }
);

// 餵食判定 (蛋糕)
makeDraggable(dragCake, 
  null,
  (cake) => {
    const cakeRect = cake.getBoundingClientRect();
    const aiyuRect = aiyu.getBoundingClientRect();

    if (isOverlapping(cakeRect, aiyuRect)) {
      playMunchSound(); // 播放嚼嚼音效
      if (!isHatOn) aiyu.src = 'img2/aiyu_mouth.png';
      aiyu.classList.add('eat-bounce');
      cake.classList.add('hidden');

      setTimeout(() => {
        aiyu.classList.remove('eat-bounce');
        if (!isHatOn) aiyu.src = 'img2/aiyu_normal.png';
      }, 1500);
    }
  }
);

// 自動把 letterData.js 裡的祝福文字塞進信紙
document.addEventListener('DOMContentLoaded', () => {
  const letterContentElement = document.querySelector('.letter-content');
  if (letterContentElement && typeof aiyuLetterContent !== 'undefined') {
    // 保留換行與文字格式
    letterContentElement.innerHTML = aiyuLetterContent.replace(/\n/g, '<br>');
  }
});
