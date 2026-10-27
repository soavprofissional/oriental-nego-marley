(() => {
  const intro = document.getElementById('intro');
  const main = document.getElementById('main');
  const planetWrap = document.getElementById('planetWrap');
  const city = document.getElementById('city');
  const subtitle = document.getElementById('introSubtitle');
  const soundBtn = document.getElementById('soundToggle');
  const starsCanvas = document.getElementById('stars');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Stars ----------
  const ctx = starsCanvas.getContext('2d');
  let stars = [];
  function resizeStars(){
    starsCanvas.width = window.innerWidth * devicePixelRatio;
    starsCanvas.height = window.innerHeight * devicePixelRatio;
    starsCanvas.style.width = window.innerWidth + 'px';
    starsCanvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    const n = Math.min(180, Math.floor(window.innerWidth*window.innerHeight/6000));
    stars = Array.from({length:n}, () => ({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      r: Math.random()*1.3 + 0.2,
      a: Math.random(),
      s: Math.random()*0.02 + 0.005
    }));
  }
  resizeStars();
  window.addEventListener('resize', resizeStars);

  let starsRunning = true;
  function drawStars(){
    if(!starsRunning) return;
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    for(const st of stars){
      st.a += st.s;
      const alpha = 0.3 + Math.abs(Math.sin(st.a))*0.7;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // ---------- Sound (music loop) ----------
  const bgMusic = document.getElementById('bgMusic');
  let soundOn = false;
  function toggleSound(){
    if(!bgMusic) return;
    if(!soundOn){
      bgMusic.play().catch(()=>{});
      soundOn = true;
      soundBtn.textContent = 'Som: ligado';
      soundBtn.setAttribute('aria-pressed','true');
    } else {
      bgMusic.pause();
      soundOn = false;
      soundBtn.textContent = 'Som: desligado';
      soundBtn.setAttribute('aria-pressed','false');
    }
  }
  soundBtn.addEventListener('click', toggleSound);

  // ---------- Intro sequence ----------
  let introDone = false;
  function finishIntro(){
    if(introDone) return;
    introDone = true;
    starsRunning = false;
    intro.classList.add('is-done');
    main.hidden = false;
    // trigger main reveal
    requestAnimationFrame(() => main.classList.add('is-visible'));
    // cleanup after transition
    setTimeout(() => { intro.setAttribute('aria-hidden','true'); }, 1000);
    if(soundOn && drone){ try{ drone.stop(); }catch(e){} drone=null; soundOn=false; soundBtn.textContent='Som: desligado'; }
  }

  function runIntro(){
    if(reducedMotion){ finishIntro(); return; }
    // stage 1: planet visible (0s)
    // stage 2: approach (2.6s)
    setTimeout(() => {
      intro.classList.add('is-approach');
      subtitle.textContent = 'Aproximando-se da Terra...';
    }, 1800);
    // stage 3: city (4.4s)
    setTimeout(() => {
      intro.classList.add('is-city');
      subtitle.textContent = 'Chegando ao Japão';
      planetWrap.style.opacity = '0';
    }, 3000);
    // stage 4: finish (6.2s)
    setTimeout(finishIntro, 3600);
  }

  const enterBtn = document.getElementById('enterBtn');
  console.log('enterBtn found:', !!enterBtn);
  if(enterBtn) enterBtn.addEventListener('click', () => { console.log('clicked'); finishIntro(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && !introDone) finishIntro(); });

  // intro stays static until user clicks 'Ir para Oriental' or 'Pular'

  // ---------- Origami transform ----------
  const transformBtn = document.getElementById('transformBtn');
  const resetBtn = document.getElementById('resetBtn');
  const origami = document.getElementById('origami');
  const pendant = document.getElementById('pendantReveal');
  const clue = document.getElementById('clue');
  const particles = document.getElementById('particles');
  const pctx = particles.getContext('2d');

  function resizeParticles(){
    const r = particles.parentElement.getBoundingClientRect();
    particles.width = r.width * devicePixelRatio;
    particles.height = r.height * devicePixelRatio;
    particles.style.width = r.width + 'px';
    particles.style.height = r.height + 'px';
    pctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  resizeParticles();
  window.addEventListener('resize', resizeParticles);

  let transforming = false;
  function burstParticles(){
    const r = particles.parentElement.getBoundingClientRect();
    const cx = r.width/2, cy = r.height/2;
    const pts = Array.from({length:48}, () => ({
      x: cx, y: cy,
      vx: (Math.random()-0.5)*6,
      vy: (Math.random()-0.5)*6 - 1,
      life: 1,
      decay: Math.random()*0.02 + 0.015,
      size: Math.random()*2 + 1,
      color: Math.random() > 0.5 ? '#d4af37' : '#4f7cff'
    }));
    let running = true;
    function step(){
      if(!running) return;
      pctx.clearRect(0,0,r.width,r.height);
      let alive = false;
      for(const p of pts){
        if(p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.05;
        p.life -= p.decay;
        pctx.globalAlpha = Math.max(0,p.life);
        pctx.fillStyle = p.color;
        pctx.beginPath();
        pctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        pctx.fill();
      }
      pctx.globalAlpha = 1;
      if(alive) requestAnimationFrame(step);
      else pctx.clearRect(0,0,r.width,r.height);
    }
    step();
  }

  function transform(){
    if(transforming) return;
    transforming = true;
    transformBtn.disabled = true;
    origami.classList.add('is-hidden');
    setTimeout(() => {
      burstParticles();
      pendant.classList.add('is-shown');
    }, 300);
    setTimeout(() => {
      clue.hidden = false;
      transforming = false;
      const e2 = document.getElementById('enigma2');
      if(e2){ e2.hidden = false; setTimeout(() => e2.scrollIntoView({behavior:'smooth'}), 100); }
      setStep(2);
    }, 1100);
  }

  function reset(){
    origami.classList.remove('is-hidden');
    pendant.classList.remove('is-shown');
    clue.hidden = true;
    transformBtn.disabled = false;
    transforming = false;
    const r = particles.parentElement.getBoundingClientRect();
    pctx.clearRect(0,0,r.width,r.height);
  }

  transformBtn.addEventListener('click', transform);
  resetBtn.addEventListener('click', reset);
  window.finishIntro = finishIntro;
})();

// ---------- Progress ----------
const progressLabel = document.getElementById('progressLabel');
const dots = document.querySelectorAll('.dot');
let currentStep = 1;
function setStep(n){
  currentStep = n;
  dots.forEach(d => {
    const s = +d.dataset.step;
    d.classList.toggle('is-done', s < n);
    d.classList.toggle('is-current', s === n);
  });
  if(progressLabel) progressLabel.textContent = `Etapa ${n} de 4`;
}

// ---------- Enigma 2: grade dourada ----------
const gridpad = document.getElementById('gridpad');
const pads = gridpad ? [...gridpad.querySelectorAll('.pad')] : [];
const showSeqBtn = document.getElementById('showSeqBtn');
const resetSeqBtn = document.getElementById('resetSeqBtn');
const clue2 = document.getElementById('clue2');
let seq = [];
let userSeq = [];
let showing = false;

function randomSeq(len=4){
  return Array.from({length:len}, () => Math.floor(Math.random()*9));
}
function lightPad(i, cls='is-lit', ms=350){
  const p = pads[i];
  if(!p) return;
  p.classList.add(cls);
  setTimeout(() => p.classList.remove(cls), ms);
}
function playSeq(){
  showing = true;
  userSeq = [];
  let i = 0;
  const iv = setInterval(() => {
    if(i >= seq.length){ clearInterval(iv); showing = false; return; }
    lightPad(seq[i]);
    i++;
  }, 550);
}
function handlePadClick(e){
  const btn = e.target.closest('.pad');
  if(!btn || showing) return;
  const i = +btn.dataset.i;
  userSeq.push(i);
  lightPad(i, 'is-lit', 200);
  const idx = userSeq.length - 1;
  if(seq[idx] !== i){
    lightPad(i, 'is-wrong', 400);
    // reset attempt
    setTimeout(() => { userSeq = []; }, 400);
    return;
  }
  if(userSeq.length === seq.length){
    pads.forEach(p => p.classList.add('is-right'));
    setTimeout(() => pads.forEach(p => p.classList.remove('is-right')), 700);
    clue2.hidden = false;
    setStep(3);
    const e3 = document.getElementById('enigma3');
    if(e3){ e3.hidden = false; setTimeout(() => e3.scrollIntoView({behavior:'smooth'}), 100); }
  }
}
if(gridpad) gridpad.addEventListener('click', handlePadClick);
if(showSeqBtn) showSeqBtn.addEventListener('click', () => {
  if(seq.length === 0) seq = randomSeq(4);
  playSeq();
});
if(resetSeqBtn) resetSeqBtn.addEventListener('click', () => {
  seq = randomSeq(4);
  userSeq = [];
  clue2.hidden = true;
  pads.forEach(p => p.classList.remove('is-right','is-wrong','is-lit'));
});

// ---------- Enigma 3: globo gira ----------
const rotorMarker = document.getElementById('rotorMarker');
const rotorValue = document.getElementById('rotorValue');
const rotorSlider = document.getElementById('rotorSlider');
const checkAngleBtn = document.getElementById('checkAngleBtn');
const clue3 = document.getElementById('clue3');
const targetAngle = 360;

function revealFinal(){
  const finale = document.getElementById('finale');
  if(finale){ finale.hidden = false; finale.style.display = 'flex'; }
  if(clue3) clue3.hidden = false;
  setStep(4);
  const st = document.getElementById('rotorStatus');
  if(st) st.textContent = 'Final revelado!';
  setTimeout(() => { if(finale) finale.scrollIntoView({behavior:'smooth'}); }, 200);
}
if(rotorSlider){
  rotorSlider.addEventListener('input', () => {
    const v = +rotorSlider.value;
    if(rotorMarker) rotorMarker.style.transform = `translate(-50%,0) rotate(${v}deg)`;
    if(rotorValue) rotorValue.textContent = `${v}°`;
    const st = document.getElementById('rotorStatus');
    if(st) st.textContent = `Ângulo: ${v}° (alvo ${targetAngle}°)`;
    if(Math.abs(v - targetAngle) <= 15){ revealFinal(); }
  });
}
if(checkAngleBtn){
  checkAngleBtn.addEventListener('click', () => {
    const v = +rotorSlider.value;
    if(Math.abs(v - targetAngle) <= 15){
      revealFinal();
    } else {
      checkAngleBtn.textContent = 'Tente novamente';
      const st = document.getElementById('rotorStatus');
      if(st) st.textContent = `Errou. Atual ${v}°, alvo ${targetAngle}°`;
      setTimeout(() => { checkAngleBtn.textContent = 'Confirmar'; }, 1200);
    }
  });
}

// initial
setStep(1);

// ---------- Omikuji (biscoito da sorte) ----------
const omikuji = document.getElementById('omikuji');
const omikujiMsg = document.getElementById('omikujiMsg');
const omikujiClose = document.getElementById('omikujiClose');
const omikujiAgain = document.getElementById('omikujiAgain');
const omikujiBackdrop = document.getElementById('omikujiBackdrop');
const omikujiBreak = document.getElementById('omikujiBreak');
const pendantBtn = document.getElementById('pendantBtn');
const cookieWrap = document.getElementById('cookieWrap');

const messages = [
  "A sorte sorri para quem ousa sonhar. Hoje, um novo caminho se abre diante de você.",
  "Como o globo que gira, sua vida encontra equilíbrio. Confie no movimento.",
  "A paciência é a chave que destranca portas invisíveis. Seu momento está chegando.",
  "Cada dobra do papel esconde uma beleza. Desdobre-se e mostre quem você é.",
  "O sol nasce vermelho no Oriente para lembrar: recomeços são sagrados.",
  "A grade dourada protege quem segue com o coração leve. Siga em frente.",
  "Pequenos passos constroem grandes viagens. Continue, mesmo devagar.",
  "A música que você carrega é a trilha do seu destino. Toque-a sem medo.",
  "Quem busca, encontra. Quem pergunta, recebe. Sua resposta está a caminho.",
  "A noite japonesa ilumina o que o dia esconde. Olhe com atenção.",
  "Você é o protagonista da sua própria jornada. Escreva-a com coragem.",
  "A gratidão transforma o comum em extraordinário. Agradeça e floresça."
];

function drawOmikuji(){
  if(!omikujiMsg) return;
  const m = messages[Math.floor(Math.random()*messages.length)];
  omikujiMsg.textContent = m;
}
function resetCookie(){
  const cookie = cookieWrap ? cookieWrap.querySelector('.cookie') : null;
  if(cookie) cookie.classList.remove('is-broken');
  drawOmikuji();
}
function breakCookie(){
  const cookie = cookieWrap ? cookieWrap.querySelector('.cookie') : null;
  if(!cookie) return;
  if(!cookie.classList.contains('is-broken')){
    drawOmikuji();
  }
  cookie.classList.add('is-broken');
}
function openOmikuji(){
  resetCookie();
  if(omikuji) omikuji.hidden = false;
}
function closeOmikuji(){
  if(omikuji) omikuji.hidden = true;
}
if(pendantBtn) pendantBtn.addEventListener('click', openOmikuji);
if(omikujiClose) omikujiClose.addEventListener('click', closeOmikuji);
if(omikujiBackdrop) omikujiBackdrop.addEventListener('click', closeOmikuji);
if(omikujiBreak) omikujiBreak.addEventListener('click', breakCookie);
if(omikujiAgain) omikujiAgain.addEventListener('click', () => { resetCookie(); setTimeout(breakCookie, 100); });

// ---------- Ensure final appears when enigma3 completes ----------
const clue3El = document.getElementById('clue3');
if(clue3El){
  const obs = new MutationObserver(() => {
    if(!clue3El.hidden){ revealFinal(); }
  });
  obs.observe(clue3El, {attributes:true, attributeFilter:['hidden']});
}
