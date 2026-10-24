/* ============================================================
   FV のギャラリー
   制作実績を、左下の手前から右上の奥へ斜めに1列で並べる（motion.dev の
   Gallery showcase「LIST」の並び）。4.5秒ごとに1枚ずつ手前へ送り、動いている間はぶれる。
   横ドラッグ・横スクロール・前後ボタン・←→キーでも送れる。
   奥の作品は押すと手前へ送るだけ、手前の作品はリンク先へ。
   動きを減らす設定のときは自動で送らず、ぶれもかけない
   ============================================================ */
(() => {
  const show = document.querySelector('.fv-gallery');
  if (!show) return;
  const fv = show.closest('.fv'), copy = fv.querySelector('.fv-copy');
  const track = show.querySelector('.fv-track');
  // 作品が7件だと列の奥まで埋まらないので、同じ並びをもう1周ぶん複製して並べる。
  // 複製は読み上げとタブ移動の対象から外す
  const base = [...track.querySelectorAll('.fv-card')], works = base.length;
  base.forEach((c, i) => { c.dataset.no = String(i + 1).padStart(2, '0'); });
  for (const c of base) {
    const d = c.cloneNode(true);
    d.setAttribute('aria-hidden', 'true'); d.tabIndex = -1;
    track.appendChild(d);
  }
  const cards = [...track.querySelectorAll('.fv-card')], n = cards.length;
  const meta = show.querySelector('.fv-meta'), cap = show.querySelector('.fv-cap');
  const capT = cap.querySelector('.fv-cap-title'), capR = cap.querySelector('.fv-cap-role'), capI = cap.querySelector('.fv-cap-i');
  const prog = show.querySelector('.fv-prog i');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTO = 4500, pad = v => String(v).padStart(2, '0'), mod = (a, m) => ((a % m) + m) % m;
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 4);
  // 列の並び方：1枚ぶん奥へ行くごとの移動量（カード幅に対する比）と、カードの向き
  const STEP_X = .9, STEP_Y = -.2, STEP_Z = -1.15, TURN = -32;
  // 手前に見せる枚数と奥に見せる枚数。範囲の外は透明にして、ループのつなぎ目を隠す
  const FRONT = 1, BACK = 6;
  let probe = null, cw = 400, pos = reduce ? 0 : -2.5, prevPos = pos, prevT = 0, tw = null, raf = 0;
  let active = -1, tick = null, drag = null, eatClick = false, wheelT = 0, wheelSnap = 0, wheelP = null;
  const stop = new Set();
  cap.querySelector('.fv-cap-n').textContent = pad(works);

  function size() {
    const h = show.clientHeight, w = show.clientWidth, narrow = w <= 767;
    const copyBottom = copy.offsetTop + copy.offsetHeight;
    let cx, cy, ch;
    if (narrow) {
      // スマホ：コピーのすぐ下に、画面幅の8割強で
      cw = w * .84; ch = cw / 1.6;
      cx = w * .5;
      cy = copyBottom + 44 + ch / 2;
    } else {
      // PC：手前の作品はコピーの右に大きく置く。高さは、下に作品名と操作（約130px）が収まるまで
      // コピーの各行は幅いっぱいの箱なので、文字そのものの右端を測る
      let copyRight = 0;
      const walk = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT), r = document.createRange();
      while (walk.nextNode()) {
        if (!walk.currentNode.textContent.trim()) continue;
        r.selectNodeContents(walk.currentNode);
        copyRight = Math.max(copyRight, r.getBoundingClientRect().right);
      }
      copyRight -= show.getBoundingClientRect().left;
      ch = Math.min((h - 64 - 170) * .92, (w - copyRight - 64) * .72 / 1.6);
      cw = ch * 1.6;
      // 傾いた作品の見た目の幅はおよそ 0.86 倍。その左端がコピーの右から 48px 空くように置く
      cx = copyRight + 48 + cw * .86 / 2;
      cy = 64 + (h - 64 - 150 - ch) / 2 + ch / 2;
    }
    show.style.perspective = Math.round(cw * 4) + 'px';
    show.style.perspectiveOrigin = `${cx}px ${cy}px`;
    Object.assign(track.style, { left: cx + 'px', top: cy + 'px' });
    for (const c of cards) Object.assign(c.style, { width: cw + 'px', height: ch + 'px', margin: `${-ch / 2}px 0 0 ${-cw / 2}px` });
    // 作品名と操作は、PC は手前の作品の下で左端をそろえる。スマホは画面の下に画面幅いっぱいで。
    // 手前の作品は傾いていて見た目の幅が変わるので、同じ傾きの見えない枠を置いて実際の位置を測る
    if (!probe) {
      probe = document.createElement('div');
      probe.setAttribute('aria-hidden', 'true');
      Object.assign(probe.style, { position: 'absolute', left: '0', top: '0', visibility: 'hidden', pointerEvents: 'none' });
      track.appendChild(probe);
    }
    Object.assign(probe.style, { width: cw + 'px', height: ch + 'px', margin: `${-ch / 2}px 0 0 ${-cw / 2}px`, transform: `rotateY(${TURN}deg)` });
    const box = probe.getBoundingClientRect(), origin = show.getBoundingClientRect();
    // スマホは手前の作品の下に、画面幅いっぱいで
    Object.assign(meta.style, narrow
      ? { width: (w - 32) + 'px', left: '16px', top: (box.bottom - origin.top + 20) + 'px', bottom: 'auto', marginLeft: '0' }
      : { width: Math.max(box.width, 340) + 'px', left: (box.left - origin.left) + 'px', top: (box.bottom - origin.top + 24) + 'px', bottom: 'auto', marginLeft: '0' });
    // スマホはブラウザのツールバーで画面が低くなり、作品名と操作が FV の下で切れることがある。
    // そのときは FV を中身の高さまで伸ばす
    if (narrow) {
      fv.style.minHeight = '';
      const need = meta.offsetTop + meta.offsetHeight + 40;
      if (need > fv.clientHeight) fv.style.minHeight = need + 'px';
    } else fv.style.minHeight = '';
    render(0);
  }

  function render(speed) {
    // 動く速さに合わせてぶらす（枚/ms → 手前の移動量 px/ms）
    const blur = reduce ? 0 : Math.min(8, Math.abs(speed) * cw * STEP_X * 5);
    cards.forEach((c, i) => {
      // i番目が手前から何枚ぶん奥にいるか。-2〜n-2 の範囲で巡回させる
      const k = mod(i - pos + 2, n) - 2;
      c.style.transform = `translate3d(${k * cw * STEP_X}px,${k * cw * STEP_Y}px,${k * cw * STEP_Z}px) rotateY(${TURN}deg)`;
      const fade = k < 0 ? Math.max(0, 1 + k / FRONT) : Math.max(0, Math.min(1, (BACK - k) / 1.5));
      c.style.opacity = fade.toFixed(3);
      const b = blur > .4 ? blur * (k < .5 ? 1 : .6) : 0;
      c.style.filter = b ? `blur(${b.toFixed(1)}px)` : '';
      c.style.pointerEvents = fade > .3 ? 'auto' : 'none';
    });
    const a = mod(Math.round(pos), n);
    if (a !== active) {
      active = a;
      // タブで届くのは手前の作品だけ。複製が手前のときは元の作品を対象にする
      base.forEach((c, i) => { c.tabIndex = i === a % works ? 0 : -1; });
      const c = cards[a];
      capT.textContent = c.querySelector('img').alt; capR.textContent = c.dataset.role; capI.textContent = pad(a % works + 1);
      if (!reduce && prevT) cap.animate([{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  }

  function frame(now) {
    raf = 0;
    if (tw) {
      const p = Math.min(1, (now - tw.t0) / tw.dur);
      pos = tw.from + (tw.to - tw.from) * tw.ease(p);
      if (p >= 1) tw = null;
    }
    const dt = Math.max(1, now - (prevT || now)), speed = (pos - prevPos) / dt;
    prevPos = pos; prevT = now;
    render(speed);
    if (tw || drag || now - wheelT < 120) raf = requestAnimationFrame(frame); else { render(0); prevT = now; }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function tween(to, dur, ease) {
    if (reduce) { pos = to; tw = null; render(0); return; }
    tw = { from: pos, to, dur, ease, t0: performance.now() }; kick();
  }
  // i番目を手前へ。いまの位置から近い向きで
  function go(i, dur = 900) {
    const to = pos + (mod(i - pos + n / 2, n) - n / 2);
    tween(to, dur, easeInOut); timer();
  }
  function timer() {
    // 進み具合の線が伸びきったら次へ。止める理由があるあいだは線も止める
    if (tick) tick.cancel();
    if (reduce) { prog.parentNode.hidden = true; return; }
    tick = prog.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: AUTO, fill: 'forwards' });
    tick.onfinish = () => go(Math.round(pos) + 1);
    if (stop.size) tick.pause();
  }
  function hold(why, on) {
    on ? stop.add(why) : stop.delete(why);
    if (tick && tick.playState !== 'finished') stop.size ? tick.pause() : tick.play();
  }

  show.querySelector('.fv-prev').addEventListener('click', () => go(Math.round(pos) - 1));
  show.querySelector('.fv-next').addEventListener('click', () => go(Math.round(pos) + 1));
  show.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i = Math.round(pos) + (e.key === 'ArrowRight' ? 1 : -1);
    go(i); base[mod(i, works)].focus({ preventScroll: true });
  });

  // 横ドラッグで送る。左へ引くと次の作品が手前に来る。離したら勢いの分だけ進んで止まる
  track.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, p: pos, moved: false, v: 0, t: performance.now(), px: e.clientX }; tw = null; hold('drag', true);
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; show.classList.add('is-drag'); }
    if (!drag.moved) return;
    const k = 1 / (cw * STEP_X), now = performance.now();
    pos = drag.p - dx * k;
    drag.v = drag.v * .6 + (-(e.clientX - drag.px) * k / Math.max(1, now - drag.t)) * .4; drag.px = e.clientX; drag.t = now;
    kick();
  });
  function end() {
    if (!drag) return;
    const d = drag; drag = null; show.classList.remove('is-drag'); hold('drag', false);
    if (!d.moved) return;
    eatClick = true; setTimeout(() => { eatClick = false; }, 0);
    const to = Math.round(pos + d.v * 260);
    tween(to, Math.min(1200, 500 + Math.abs(to - pos) * 220), easeOut); timer();
  }
  addEventListener('pointerup', end); addEventListener('pointercancel', end);

  // 横スクロール（トラックパッドの左右スワイプ・Shift＋ホイール）で送る。縦スクロールはページのスクロールのまま
  show.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    const dx = e.deltaX * (e.deltaMode === 1 ? 16 : 1);
    if (wheelP === null) wheelP = pos;
    tw = null; pos += dx / (cw * STEP_X) * 1.3; wheelT = performance.now(); hold('wheel', true); kick();
    // 止めたら、少しでも動かした向きの次の1枚に寄せる
    clearTimeout(wheelSnap);
    wheelSnap = setTimeout(() => {
      const d = pos - wheelP, to = Math.abs(d) < .2 ? Math.round(wheelP) : (d > 0 ? Math.ceil(pos) : Math.floor(pos));
      wheelP = null; tween(to, 520, easeOut); hold('wheel', false); timer();
    }, 140);
  }, { passive: false });

  cards.forEach((c, i) => {
    c.addEventListener('click', e => {
      if (eatClick) { e.preventDefault(); return; }
      // 複製と元は同じ作品なので、どちらが手前でもリンク先へ進める
      if (i % works !== active % works) { e.preventDefault(); go(i); }
    });
  });

  // マウスを載せている・操作中・タブが裏・FV が画面外のあいだは自動で送らない
  show.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hold('hover', true); });
  show.addEventListener('pointerleave', () => hold('hover', false));
  show.addEventListener('focusin', () => hold('focus', true));
  show.addEventListener('focusout', e => { if (!show.contains(e.relatedTarget)) hold('focus', false); });
  document.addEventListener('visibilitychange', () => hold('hidden', document.hidden));
  new IntersectionObserver(([en]) => hold('away', !en.isIntersecting), { threshold: .3 }).observe(fv);
  addEventListener('resize', size);

  show.classList.add('is-ready');
  size(); prevT = performance.now();
  // 最初に奥から列が流れてきて、先頭の1枚が手前で止まる
  if (!reduce) tween(0, 1600, easeOut);
  timer();
})();
