/* ============================================================
   ヘッダーのメニュー
   右上のボタンで、画面全体に重ねたメニューを開閉する。
   Esc・リンクを押したとき・もう一度ボタンを押したときに閉じる
   ============================================================ */
(() => {
  const btn = document.querySelector('.nav-toggle'), nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  const root = document.documentElement;
  function set(open) {
    root.classList.toggle('is-nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニュー');
    if (open) nav.querySelector('a').focus(); else if (nav.contains(document.activeElement)) btn.focus();
  }
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') set(false); });
})();
