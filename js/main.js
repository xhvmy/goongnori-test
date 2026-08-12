// ============================================================
//  main.js — 궁노리 앱 로직 (화면 단위 SPA)
// ============================================================

'use strict';

// ── 상태 ────────────────────────────────────────────────────
const LANG_KEY      = 'goongnori_lang';
const AUTH_KEY       = 'goongnori_auth';
const ATTEMPTS_KEY    = 'goongnori_pin_attempts';
const LOCK_KEY         = 'goongnori_pin_lock_until';
const STEP_KEY          = 'goongnori_step';

// 여정 순서: chapter0 → map0 → chapter1 → map1 → ... → chapter6 → closing
const TOTAL_STEPS = CHAPTERS.length * 2; // 마지막 인덱스(TOTAL_STEPS-1)는 closing
let progressStep = 0;

let currentLang = localStorage.getItem(LANG_KEY) || null;
let currentPin  = '';

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function getLockRemainingMs() {
  const until = Number(localStorage.getItem(LOCK_KEY) || 0);
  return Math.max(0, until - Date.now());
}

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// 언어별 표시 폰트 클래스 적용 (제목/CTA 등 브랜드 서체가 필요한 요소용)
function applyDisplayFont(el, lang, isCta) {
  el.classList.remove('font-ko', 'font-en', 'font-ja', 'font-zh', 'font-cta-ko');
  if (isCta && lang === 'ko') {
    el.classList.add('font-cta-ko');
  } else {
    el.classList.add('font-' + lang);
  }
}

// ── 오프라인 지원 (서비스 워커) ─────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ── 콘텐츠 보호 (캐주얼한 저장/열람 방지 — 완전 차단은 아님) ──
function setupContentProtection() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    const mac = e.metaKey && e.altKey;
    const win = e.ctrlKey && e.shiftKey;
    const isDevtoolsCombo =
      e.key === 'F12' ||
      ((mac || win) && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key));
    const isViewSourceCombo =
      (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
      (e.metaKey && e.altKey && (e.key === 'U' || e.key === 'u'));
    if (isDevtoolsCombo || isViewSourceCombo) e.preventDefault();
  });
}

// ============================================================
//  화면 전환
// ============================================================
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(sec => {
    const isActive = sec.dataset.screen === name;
    sec.classList.toggle('is-active', isActive);
    // 화면은 재사용되는 DOM 요소라 (예: Chapter 1→2) 이전 스크롤 위치가 남아있을 수 있음 —
    // 새로 보여줄 때마다 맨 위로 리셋
    if (isActive) sec.scrollTop = 0;
  });
}

// ============================================================
//  Language Select
// ============================================================
function renderLanguageSelect() {
  const subtitleEl = document.getElementById('lang-select-subtitle');
  subtitleEl.innerHTML = '';
  LANGUAGE_SELECT_TEXT.subtitle.forEach(line => {
    const span = document.createElement('span');
    span.textContent = line;
    subtitleEl.appendChild(span);
  });

  const buttonsEl = document.getElementById('lang-select-buttons');
  buttonsEl.innerHTML = '';
  LANGUAGES.forEach(({ code, label }) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'lang-row';
    applyDisplayFont(row, code, false);

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    const chevron = document.createElement('span');
    chevron.className = 'lang-row__chevron';
    chevron.textContent = '›';

    row.appendChild(labelSpan);
    row.appendChild(chevron);
    row.addEventListener('click', () => selectLanguage(code));
    buttonsEl.appendChild(row);
  });
}

function selectLanguage(code) {
  currentLang = code;
  localStorage.setItem(LANG_KEY, code);
  document.documentElement.lang = code;
  goToGatePin();
}

// ============================================================
//  Gate Screen — PIN
// ============================================================
function goToGatePin() {
  const text = GATE_PIN_TEXT[currentLang];
  const titleEl = document.getElementById('gate-pin-title');
  titleEl.textContent = text.title;
  applyDisplayFont(titleEl, currentLang, false);

  document.getElementById('gate-pin-dialogue').textContent = text.dialogue;
  document.getElementById('pin-error-msg').textContent = UI_TEXT[currentLang].pw_error;

  currentPin = '';
  updatePinSlots();
  showScreen('gate-pin');

  const remaining = getLockRemainingMs();
  if (remaining > 0) startLockout(remaining);
}

function startLockout(ms) {
  const keypad = document.getElementById('keypad');
  const errorEl = document.getElementById('pin-error-msg');
  keypad.classList.add('locked');

  let timer;
  const tick = () => {
    const remaining = getLockRemainingMs();
    if (remaining <= 0) {
      clearInterval(timer);
      keypad.classList.remove('locked');
      errorEl.classList.remove('visible');
      localStorage.removeItem(LOCK_KEY);
      localStorage.removeItem(ATTEMPTS_KEY);
      return;
    }
    const secs = Math.ceil(remaining / 1000);
    errorEl.textContent = (LOCK_TEXT[currentLang] || LOCK_TEXT.ko)(secs);
    errorEl.classList.add('visible');
  };
  tick();
  timer = setInterval(tick, 1000);
}

function handleKeyPress(key) {
  if (getLockRemainingMs() > 0) return;
  if (key === 'del') {
    if (currentPin.length === 0) return;
    vibrate(10);
    currentPin = currentPin.slice(0, -1);
    updatePinSlots();
    return;
  }
  if (currentPin.length >= 4) return;
  vibrate(10);
  currentPin += String(key);
  updatePinSlots();
  if (currentPin.length === 4) setTimeout(verifyPin, 120);
}

function updatePinSlots() {
  document.querySelectorAll('.pin-slot').forEach((slot, i) => {
    slot.textContent = currentPin[i] || '';
    slot.classList.remove('is-error', 'is-success');
    slot.classList.toggle('is-current', i === currentPin.length);
  });
}

async function verifyPin() {
  const slots = document.querySelectorAll('.pin-slot');
  const slotsWrap = document.getElementById('pin-slots');
  const errorEl = document.getElementById('pin-error-msg');
  const hash = await sha256Hex(currentPin);

  if (hash === CONFIG.passwordHash) {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCK_KEY);

    vibrate(15);
    slots.forEach(s => s.classList.add('is-success'));
    const audio = new Audio('sound/login.mp3');
    audio.play().catch(() => {});

    localStorage.setItem(AUTH_KEY, 'ok');

    setTimeout(() => goToGateAppear(), 900);
  } else {
    const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || 0) + 1;
    localStorage.setItem(ATTEMPTS_KEY, String(attempts));

    vibrate([40, 30, 40]);
    slots.forEach(s => s.classList.add('is-error'));
    slotsWrap.classList.add('shake');
    errorEl.classList.add('visible');

    if (attempts >= CONFIG.maxAttempts) {
      localStorage.setItem(LOCK_KEY, String(Date.now() + CONFIG.lockoutMs));
      setTimeout(() => {
        slotsWrap.classList.remove('shake');
        currentPin = '';
        updatePinSlots();
        startLockout(CONFIG.lockoutMs);
      }, 800);
    } else {
      setTimeout(() => {
        slotsWrap.classList.remove('shake');
        errorEl.classList.remove('visible');
        currentPin = '';
        updatePinSlots();
      }, 800);
    }
  }
}

// 다음 화면으로 넘어가기 전에 필요한 이미지를 미리 받아둠 — 화면이 바뀌는 순간
// src를 처음 설정하면 그때부터 네트워크 요청이 시작돼서 1초 가까이 빈 이미지로
// 보이는 문제가 있었음. 사용자가 이전 화면(지도 등)을 보는 동안 백그라운드로 미리 로드.
function prefetchImage(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

function prefetchChapterImages(idx) {
  const chapter = CHAPTERS[idx];
  if (!chapter) return;
  prefetchImage(chapter.hero1);
  chapter.extraImages.forEach(entry => prefetchImage(entry.src));
}

// ============================================================
//  Gate 등장
// ============================================================
function goToGateAppear() {
  const text = GATE_APPEAR_TEXT[currentLang];
  document.getElementById('gate-appear-dialogue').textContent = text.dialogue;
  const cta = document.getElementById('gate-appear-cta');
  cta.textContent = text.cta;
  applyDisplayFont(cta, currentLang, true);
  showScreen('gate-appear');

  // 첫 챕터(경복궁) 이미지 + 지도 배경(모든 지도가 공유)을 미리 받아둬서
  // 첫 챕터/첫 지도 화면 진입 시 바로 보이게 함
  prefetchChapterImages(0);
  prefetchImage(MAPS[0] && MAPS[0].image);
}

// ============================================================
//  여정 상태머신 — chapter0 → map0 → chapter1 → ... → chapter6 → closing
// ============================================================
function stepInfo(step) {
  const closingStep = TOTAL_STEPS - 1;
  if (step >= closingStep) return { type: 'closing' };
  if (step % 2 === 0) return { type: 'chapter', idx: step / 2 };
  return { type: 'map', idx: (step - 1) / 2 };
}

function goToStep(step) {
  progressStep = Math.max(0, Math.min(step, TOTAL_STEPS - 1));
  localStorage.setItem(STEP_KEY, String(progressStep));
  const info = stepInfo(progressStep);
  if (info.type === 'chapter') renderChapter(info.idx);
  else if (info.type === 'map') renderEnroute(info.idx);
  else renderClosing();
}

function beginOrResume() {
  const saved = Number(localStorage.getItem(STEP_KEY));
  const step = Number.isFinite(saved) && saved >= 0 && saved < TOTAL_STEPS ? saved : 0;
  goToStep(step);
}

// ============================================================
//  Chapter Screen
// ============================================================
function renderChapter(idx) {
  const chapter = CHAPTERS[idx];
  const text = chapter.text[currentLang];
  const place = PLACES[idx][currentLang];

  const headerTitleEl = document.getElementById('chapter-header-title');
  headerTitleEl.textContent = `${idx + 1} · ${place}`;
  applyDisplayFont(headerTitleEl, currentLang, false);

  document.getElementById('chapter-stamp-mini').textContent = `${idx + 1}/7`;

  const heroEl = document.getElementById('chapter-hero1');
  heroEl.src = chapter.hero1;
  heroEl.alt = place;

  document.getElementById('chapter-dialogue').textContent = text.dialogue;
  document.getElementById('chapter-title').textContent = text.title;

  const paraWrap = document.getElementById('chapter-paragraphs');
  paraWrap.innerHTML = '';
  text.paragraphs.forEach((paragraph, i) => {
    const p = document.createElement('p');
    p.className = 'chapter__paragraph';
    p.textContent = paragraph;
    paraWrap.appendChild(p);

    chapter.extraImages.filter(img => img.after === i).forEach(imgData => {
      const wrap = document.createElement('div');
      wrap.className = 'chapter__image';
      const img = document.createElement('img');
      img.src = imgData.src;
      img.alt = place;
      img.loading = 'lazy'; // 히어로 아래 본문 삽입 이미지는 스크롤해서 볼 때까지 미룸
      wrap.appendChild(img);
      paraWrap.appendChild(wrap);
    });
  });

  const cta = document.getElementById('chapter-cta');
  cta.textContent = text.cta;
  applyDisplayFont(cta, currentLang, true);

  showScreen('chapter');

  // 다음 챕터 이미지를 미리 받아둠 (이 챕터를 읽는 동안 + 다음 지도 화면을 보는 동안이
  // 로딩 시간을 벌 수 있는 창)
  prefetchChapterImages(idx + 1);
}

// ============================================================
//  이동 중 (지도)
// ============================================================
const LEGEND_STATE_ORDER = ['completed', 'current', 'locked'];

// .enroute__map-inner의 실제 px 크기를 계산 — 슬롯 안에 376:519 비율 그대로(크롭 없이)
// 최대한 크게 들어가는 크기를 구함("contain"). 잘림을 조금이라도 허용하면 화면마다
// 다른 방향(가로/세로)으로 잘려 보여서, 크롭은 아예 없애고 남는 공간은 여백으로 둠.
// inner는 항상 정확히 376:519 비율로 스케일만 되므로 핀은 항상 같은 %로 정확히 맞음.
const MAP_REF_W = 376;
const MAP_REF_H = 519;
function layoutMapPins() {
  const slot = document.getElementById('enroute-map');
  const inner = document.getElementById('enroute-map-inner');
  if (!slot || !inner) return;
  const slotW = slot.clientWidth;
  const slotH = slot.clientHeight;
  if (slotW <= 0 || slotH <= 0) return;
  const scale = Math.min(slotW / MAP_REF_W, slotH / MAP_REF_H);
  inner.style.width = (MAP_REF_W * scale) + 'px';
  inner.style.height = (MAP_REF_H * scale) + 'px';

  inner.querySelectorAll('[data-label-offset]').forEach(el => {
    el.style.transform = `translate(${Number(el.dataset.labelOffset) * scale}px, -50%)`;
  });
}

function renderEnroute(mapIdx) {
  const map = MAPS[mapIdx];
  const text = map.text[currentLang];

  const titleEl = document.getElementById('enroute-title');
  titleEl.textContent = text.title;
  applyDisplayFont(titleEl, currentLang, true); // KO는 Sungkok Serif(font-cta-ko) 사용 — Figma 주석 참고

  document.getElementById('enroute-subtitle').textContent = text.stamp(map.fromIdx + 1);

  const mapImg = document.getElementById('enroute-map-image');
  mapImg.src = map.image;
  mapImg.alt = '';

  const pinsWrap = document.getElementById('enroute-pins');
  pinsWrap.innerHTML = '';
  MAP_PIN_POSITIONS.forEach((pos, i) => {
    // .enroute__map-inner는 항상 정확히 376:519 비율로만 스케일되므로 %로 고정해도 항상 맞음
    const relX = (pos.x - MAP_GEOMETRY.mapLeft) / MAP_GEOMETRY.mapW * 100;
    const relY = (pos.y - MAP_GEOMETRY.mapTop) / MAP_GEOMETRY.mapH * 100;
    const state = i <= map.fromIdx ? 'completed' : (i === map.toIdx ? 'current' : 'locked');

    const pin = document.createElement('div');
    pin.className = `map-pin map-pin--${state}`;
    pin.style.left = relX + '%';
    pin.style.top = relY + '%';
    if (state === 'current') {
      const avatarCrop = document.createElement('span');
      avatarCrop.className = 'avatar-crop';
      const avatar = document.createElement('img');
      avatar.src = 'images/avatar-default.webp';
      avatar.alt = '';
      avatarCrop.appendChild(avatar);
      pin.appendChild(avatarCrop);
    } else {
      pin.textContent = String(i + 1);
    }
    pinsWrap.appendChild(pin);

    const label = document.createElement('span');
    label.className = 'map-pin__label';
    label.textContent = PLACES[i][currentLang];
    label.style.left = relX + '%';
    label.style.top = relY + '%';
    label.dataset.labelOffset = MAP_LABEL_OFFSETS[i];
    pinsWrap.appendChild(label);
  });

  const legendWrap = document.getElementById('enroute-legend');
  legendWrap.innerHTML = '';
  text.legend.forEach((label, i) => {
    const item = document.createElement('div');
    item.className = 'enroute__legend-item';
    const dot = document.createElement('span');
    dot.className = `enroute__legend-dot enroute__legend-dot--${LEGEND_STATE_ORDER[i]}`;
    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    item.appendChild(dot);
    item.appendChild(labelSpan);
    legendWrap.appendChild(item);
  });

  const cta = document.getElementById('enroute-cta');
  cta.textContent = text.cta;
  applyDisplayFont(cta, currentLang, true);

  showScreen('enroute');
  // display:none→flex 직후엔 레이아웃이 아직 안정되지 않아 크기를 잘못 읽을 수 있음 —
  // 다음 프레임에서 다시 계산
  requestAnimationFrame(layoutMapPins);

  // 다음 챕터 이미지를 다시 한 번 미리 받아둠(이미 진행 중이면 브라우저가 중복 요청 안 함) —
  // 이 지도 화면을 보는 동안이 곧 다음 챕터 이미지가 도착할 시간을 버는 창
  prefetchChapterImages(map.toIdx);
}

// ============================================================
//  Closing Screen
// ============================================================
function renderClosing() {
  const text = CLOSING_TEXT[currentLang];

  const headlineEl = document.getElementById('closing-headline');
  headlineEl.textContent = text.headline;
  applyDisplayFont(headlineEl, currentLang, false);

  const stampsWrap = document.getElementById('closing-stamps');
  stampsWrap.innerHTML = '';
  for (let i = 1; i <= PLACES.length; i++) {
    const stamp = document.createElement('div');
    stamp.className = 'closing__stamp';
    stamp.textContent = String(i);
    stampsWrap.appendChild(stamp);
  }

  document.getElementById('closing-summary').textContent = text.summary;
  document.getElementById('closing-farewell-name').textContent = CHARACTER_NAME[currentLang];
  document.getElementById('closing-farewell-text').textContent = text.farewell;
  document.getElementById('closing-instagram-label').textContent = text.instagram;

  const cta = document.getElementById('closing-cta');
  cta.textContent = text.cta;
  applyDisplayFont(cta, currentLang, true);

  showScreen('closing');
}

function restartJourney() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(LANG_KEY);
  localStorage.removeItem(STEP_KEY);
  currentLang = null;
  currentPin = '';
  progressStep = 0;
  showScreen('language-select');
}

// ============================================================
//  Lightbox — 챕터 이미지(히어로 + 본문 삽입 이미지) 클릭 시 확대
// ============================================================
function openLightbox(src, alt) {
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt || '';
  document.getElementById('lightbox').classList.add('is-active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('is-active');
}

function setupLightbox() {
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.chapter__hero img, .chapter__image img');
    if (img) openLightbox(img.src, img.alt);
  });
  document.getElementById('lightbox').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ============================================================
//  초기화
// ============================================================
window.addEventListener('resize', layoutMapPins);

document.addEventListener('DOMContentLoaded', () => {
  // 로컬 개발 중(localhost)에는 개발자도구 차단을 걸지 않음 — 실제 배포 도메인에서만 동작
  const isLocalDev = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  if (!isLocalDev) setupContentProtection();

  setupLightbox();

  document.getElementById('keypad').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-key]');
    if (btn) handleKeyPress(btn.dataset.key);
  });
  document.getElementById('gate-appear-cta').addEventListener('click', beginOrResume);
  document.getElementById('chapter-back').addEventListener('click', () => {
    if (progressStep === 0) { showScreen('gate-appear'); return; }
    goToStep(progressStep - 1);
  });
  document.getElementById('chapter-cta').addEventListener('click', () => goToStep(progressStep + 1));
  document.getElementById('enroute-cta').addEventListener('click', () => goToStep(progressStep + 1));
  document.getElementById('closing-cta').addEventListener('click', restartJourney);

  renderLanguageSelect();

  if (!currentLang) {
    showScreen('language-select');
  } else if (localStorage.getItem(AUTH_KEY) !== 'ok') {
    document.documentElement.lang = currentLang;
    goToGatePin();
  } else {
    document.documentElement.lang = currentLang;
    beginOrResume();
  }
});
