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
  document.addEventListener('visibilitychange', () => { starsRunning = !document.hidden; if(starsRunning) drawStars(); });
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
      bgMusic.play().then(()=>{}).catch((e)=>{});
      soundOn = true;
      soundBtn.textContent = 'Som: ligado';
      soundBtn.setAttribute('aria-pressed','true');
      if(mainSoundBtn) mainSoundBtn.textContent = 'Som: ligado';
    } else {
      bgMusic.pause();
      soundOn = false;
      soundBtn.textContent = 'Som: desligado';
      soundBtn.setAttribute('aria-pressed','false');
    }
  }
  soundBtn.addEventListener('click', toggleSound);

  // ---------- Main page controls ----------
  const mainSoundBtn = document.getElementById('mainSoundBtn');
  const mainIntroBtn = document.getElementById('mainIntroBtn');
  if(mainSoundBtn){
    mainSoundBtn.addEventListener('click', () => {
      toggleSound();
      mainSoundBtn.textContent = soundOn ? 'Som: ligado' : 'Som: desligado';
    });
  }
  if(mainIntroBtn){
    mainIntroBtn.addEventListener('click', () => {
      const intro = document.getElementById('intro');
      const main = document.getElementById('main');
      if(intro){ intro.style.display=''; intro.classList.remove('is-done','is-leaving'); intro.style.opacity=''; intro.style.filter=''; intro.setAttribute('aria-hidden','false'); }
      if(main){ main.hidden = true; main.classList.remove('is-visible'); }
    });
  }

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
    if(soundOn){ try{ bgMusic.pause(); }catch(e){} soundOn=false; soundBtn.textContent='Som: desligado'; }
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
  if(enterBtn) enterBtn.addEventListener('click', finishIntro);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && !introDone) finishIntro(); });

  // intro stays static until user clicks 'Ir para Oriental' or 'Pular'

  // ---------- Quiz ----------
const MIN_SCORE = 0.7; // pontuação mínima para liberar o vídeo (70%)
const UNLOCK_KEY = 'oriental_quiz_unlocked';

const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizNext = document.getElementById('quizNext');
const quizRestart = document.getElementById('quizRestart');
const quizResult = document.getElementById('quizResult');
const quizScore = document.getElementById('quizScore');
const quizResultMsg = document.getElementById('quizResultMsg');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizProgressLabel = document.getElementById('quizProgressLabel');
const quizScoreLive = document.getElementById('quizScoreLive');
const quizVideoWrap = document.getElementById('quizVideoWrap');
const quizReward = document.getElementById('quizReward');
const quizFail = document.getElementById('quizFail');
const quizAudio = document.getElementById('quizAudio');
const quizPlayBtn = document.getElementById('quizPlayBtn');
const quizPauseBtn = document.getElementById('quizPauseBtn');
const quizVolume = document.getElementById('quizVolume');
const quizPlayerStatus = document.getElementById('quizPlayerStatus');

const guideCard = document.getElementById('guideCard');
const guidePlayBtn = document.getElementById('guidePlayBtn');
const guideStatus = document.getElementById('guideStatus');
const guidePlayer = document.getElementById('guidePlayer');
const guideAudio = document.getElementById('guideAudio');
const guidePlay = document.getElementById('guidePlay');
const guidePause = document.getElementById('guidePause');
const guideVolume = document.getElementById('guideVolume');
const guidePlayerStatus = document.getElementById('guidePlayerStatus');

let qIndex = 0;
let qScore = 0;
let qAnswered = false;
let qTimer = null;

function updateProgress(){
  const total = QUIZ_DATA.length;
  const pct = (qIndex / total) * 100;
  if(quizProgressBar) quizProgressBar.style.width = pct + '%';
  if(quizProgressLabel) quizProgressLabel.textContent = `Pergunta ${Math.min(qIndex+1,total)} de ${total}`;
  if(quizScoreLive) quizScoreLive.textContent = `Acertos: ${qScore} | Erros: ${qIndex - qScore}`;
}

function renderQuestion(){
  if(!QUIZ_DATA || qIndex >= QUIZ_DATA.length){ showResult(); return; }
  const q = QUIZ_DATA[qIndex];
  qAnswered = false;
  if(quizQuestion){ quizQuestion.classList.remove('is-entering'); void quizQuestion.offsetWidth; quizQuestion.classList.add('is-entering'); quizQuestion.textContent = q.pergunta; }
  if(quizOptions){
    quizOptions.innerHTML = '';
    q.alternativas.forEach((alt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz__option';
      btn.textContent = alt;
      btn.addEventListener('click', () => selectAnswer(i, btn));
      quizOptions.appendChild(btn);
    });
  } else {
  }
  if(quizFeedback){ quizFeedback.hidden = true; quizFeedback.className='quiz__feedback'; }
  if(quizNext) quizNext.hidden = true;
  updateProgress();
}

function selectAnswer(i, btn){
  if(qAnswered) return;
  qAnswered = true;
  const q = QUIZ_DATA[qIndex];
  const correct = i === q.respostaCorreta;
  if(correct){ qScore++; }
  // mark buttons
  [...quizOptions.children].forEach((b, idx) => {
    b.disabled = true;
    if(idx === q.respostaCorreta) b.classList.add('is-correct');
    if(idx === i && !correct) b.classList.add('is-wrong');
  });
  if(quizFeedback){
    quizFeedback.hidden = false;
    quizFeedback.textContent = correct ? 'Correto!' : 'Errado. A resposta correta foi destacada.';
    quizFeedback.className = 'quiz__feedback ' + (correct ? 'is-correct' : 'is-wrong');
  }
  if(quizNext) quizNext.hidden = true;
  if(quizScoreLive) quizScoreLive.textContent = `Acertos: ${qScore} | Erros: ${qIndex + 1 - qScore}`;
  // auto-advance to next question
  if(qTimer) clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    qIndex++;
    if(quizQuestion) quizQuestion.parentElement.style.display = '';
    if(quizOptions) quizOptions.style.display = '';
    if(qIndex >= QUIZ_DATA.length){
      showResult();
    } else {
      renderQuestion();
    }
  }, 1500);
}

function showResult(){
  if(quizQuestion) quizQuestion.parentElement.style.display = 'none';
  if(quizOptions) quizOptions.style.display = 'none';
  if(quizNext) quizNext.hidden = true;
  if(quizProgressLabel) quizProgressLabel.textContent = 'Concluído';
  if(quizProgressBar) quizProgressBar.style.width = '100%';
  if(quizResult){ quizResult.hidden = false; }
  const total = QUIZ_DATA.length;
  const pct = qScore / total;
  if(quizScore) quizScore.textContent = `${qScore} / ${total}`;
  if(quizScoreLive) quizScoreLive.textContent = `Acertos: ${qScore} | Erros: ${total - qScore}`;
  if(qScore === total){
    if(quizReward) quizReward.hidden = false;
    if(quizFail) quizFail.hidden = true;
    if(quizResultMsg) quizResultMsg.textContent = '';
    if(quizAudio){ quizAudio.pause(); quizAudio.currentTime = 0; }
    if(quizPlayerStatus) quizPlayerStatus.textContent = 'Pronto';
    // desbloquear guide card
    unlockGuide();
  } else {
    if(quizReward) quizReward.hidden = true;
    if(quizFail) quizFail.hidden = false;
    if(quizResultMsg) quizResultMsg.textContent = 'Você não acertou todas as 15 perguntas. É necessário acertar todas para desbloquear a prévia exclusiva.';
    if(quizRestart) quizRestart.hidden = false;
    if(quizAudio){ quizAudio.pause(); quizAudio.currentTime = 0; }
    lockGuide();
  }
}

if(quizRestart){
  quizRestart.addEventListener('click', () => {
    if(qTimer) clearTimeout(qTimer);
    if(quizAudio){ quizAudio.pause(); quizAudio.currentTime = 0; }
    if(guideAudio){ guideAudio.pause(); guideAudio.currentTime = 0; }
    qIndex = 0; qScore = 0; qAnswered = false;
    if(quizResult) quizResult.hidden = true;
    if(quizReward) quizReward.hidden = true;
    if(quizFail) quizFail.hidden = true;
    if(quizQuestion) quizQuestion.parentElement.style.display = '';
    if(quizOptions) quizOptions.style.display = '';
    if(quizRestart) quizRestart.hidden = true;
    if(quizVideoWrap) quizVideoWrap.hidden = true;
    if(quizScoreLive) quizScoreLive.textContent = 'Acertos: 0 | Erros: 0';
    lockGuide();
    renderQuestion();
  });
}
if(quizNext){
  quizNext.addEventListener('click', () => {
    qIndex++;
    // restore question UI
    if(quizQuestion) quizQuestion.parentElement.style.display = '';
    if(quizOptions) quizOptions.style.display = '';
    renderQuestion();
  });
}
function unlockGuide(){
  if(guidePlayBtn){ guidePlayBtn.disabled = false; guidePlayBtn.removeAttribute('aria-disabled'); }
  if(guideStatus) guideStatus.textContent = 'Desbloqueado — toque para ouvir.';
  if(guidePlayer) guidePlayer.hidden = false;
}
function lockGuide(){
  if(guidePlayBtn){ guidePlayBtn.disabled = true; guidePlayBtn.setAttribute('aria-disabled','true'); }
  if(guideStatus) guideStatus.textContent = 'Bloqueado — acerte todas as perguntas.';
  if(guidePlayer) guidePlayer.hidden = true;
  if(guideAudio){ guideAudio.pause(); guideAudio.currentTime = 0; }
  if(guidePlay) guidePlay.hidden = false;
  if(guidePause) guidePause.hidden = true;
  if(guidePlayerStatus) guidePlayerStatus.textContent = 'Pronto';
}

// guide card player
if(guidePlay){
  guidePlay.addEventListener('click', () => {
    if(guideAudio){
      if(bgMusic && !bgMusic.paused){ bgMusic.pause(); soundOn = false; if(soundBtn) soundBtn.textContent = 'Som: desligado'; if(soundBtn) soundBtn.setAttribute('aria-pressed','false'); if(mainSoundBtn) mainSoundBtn.textContent = 'Som: desligado'; }
      guideAudio.play().catch(()=>{});
      if(guidePlay) guidePlay.hidden = true;
      if(guidePause) guidePause.hidden = false;
      if(guidePlayerStatus) guidePlayerStatus.textContent = 'Tocando';
    }
  });
}
if(guidePause){
  guidePause.addEventListener('click', () => {
    if(guideAudio){
      guideAudio.pause();
      if(guidePlay) guidePlay.hidden = false;
      if(guidePause) guidePause.hidden = true;
      if(guidePlayerStatus) guidePlayerStatus.textContent = 'Pausado';
    }
  });
}
if(guideVolume){
  guideVolume.addEventListener('input', () => {
    if(guideAudio) guideAudio.volume = parseFloat(guideVolume.value);
  });
}
if(guideAudio){
  guideAudio.addEventListener('ended', () => {
    if(guidePlay) guidePlay.hidden = false;
    if(guidePause) guidePause.hidden = true;
    if(guidePlayerStatus) guidePlayerStatus.textContent = 'Concluído';
  });
}
if(guidePlayBtn){
  guidePlayBtn.addEventListener('click', () => {
    if(!guidePlayBtn.disabled){
      if(guidePlayer) guidePlayer.hidden = false;
      if(guideAudio){ guideAudio.play().catch(()=>{}); }
      if(guidePlay) guidePlay.hidden = true;
      if(guidePause) guidePause.hidden = false;
      if(guidePlayerStatus) guidePlayerStatus.textContent = 'Tocando';
    }
  });
}

// init locked
lockGuide();

if(quizRestart){
  quizRestart.addEventListener('click', () => {
    if(qTimer) clearTimeout(qTimer);
    if(quizAudio){ quizAudio.pause(); quizAudio.currentTime = 0; }
    if(guideAudio){ guideAudio.pause(); guideAudio.currentTime = 0; }
    qIndex = 0; qScore = 0; qAnswered = false;
    if(quizResult) quizResult.hidden = true;
    if(quizReward) quizReward.hidden = true;
    if(quizFail) quizFail.hidden = true;
    if(quizQuestion) quizQuestion.parentElement.style.display = '';
    if(quizOptions) quizOptions.style.display = '';
    if(quizRestart) quizRestart.hidden = true;
    if(quizVideoWrap) quizVideoWrap.hidden = true;
    if(quizScoreLive) quizScoreLive.textContent = 'Acertos: 0 | Erros: 0';
    lockGuide();
    renderQuestion();
  });
}

if(quizPlayBtn){
  quizPlayBtn.addEventListener('click', () => {
    if(quizAudio){
      if(bgMusic && !bgMusic.paused){ bgMusic.pause(); soundOn = false; if(soundBtn) soundBtn.textContent = 'Som: desligado'; if(soundBtn) soundBtn.setAttribute('aria-pressed','false'); if(mainSoundBtn) mainSoundBtn.textContent = 'Som: desligado'; }
      quizAudio.play().catch(()=>{});
      if(quizPlayBtn) quizPlayBtn.hidden = true;
      if(quizPauseBtn) quizPauseBtn.hidden = false;
      if(quizPlayerStatus) quizPlayerStatus.textContent = 'Tocando';
    }
  });
}
if(quizPauseBtn){
  quizPauseBtn.addEventListener('click', () => {
    if(quizAudio){
      quizAudio.pause();
      if(quizPlayBtn) quizPlayBtn.hidden = false;
      if(quizPauseBtn) quizPauseBtn.hidden = true;
      if(quizPlayerStatus) quizPlayerStatus.textContent = 'Pausado';
    }
  });
}
if(quizVolume){
  quizVolume.addEventListener('input', () => {
    if(quizAudio) quizAudio.volume = parseFloat(quizVolume.value);
  });
}
if(quizAudio){
  quizAudio.addEventListener('ended', () => {
    if(quizPlayBtn) quizPlayBtn.hidden = false;
    if(quizPauseBtn) quizPauseBtn.hidden = true;
    if(quizPlayerStatus) quizPlayerStatus.textContent = 'Concluído';
  });
}

// If already unlocked, mark so video shows after completion
renderQuestion();

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


  window.finishIntro = finishIntro;
})();
