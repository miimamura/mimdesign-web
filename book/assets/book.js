// 本型ポートフォリオ：ページを開いたときの「めくり」演出。
//
// ページを開いた瞬間は紙（.curl-sheet）が全面にかぶさっている。
// それを角から折り返しながら取り除くことで、紙をめくったように見せる。
// - 進んだとき（前のページより番号が大きい）：右下の角からめくり、左上へ抜ける
// - 戻ったとき（前のページより番号が小さい）：左上の角から紙が戻り、右下へ抜ける
// ページ番号は <body data-page="N">（表紙 0、第一章〜第八章 1〜8）。
// 直前に開いていたページ番号は sessionStorage に持つ。
(function () {
  var overlay = document.querySelector('.curl');
  if (!overlay) return;
  var sheet = overlay.querySelector('.curl-sheet');
  var flap = overlay.querySelector('.curl-flap');

  var page = Number(document.body.getAttribute('data-page')) || 0;
  var back = false;
  try {
    var prev = sessionStorage.getItem('mimdesignPage');
    back = prev !== null && Number(prev) > page;
    sessionStorage.setItem('mimdesignPage', String(page));
  } catch (e) { /* storage が使えない環境では常に「進む」 */ }

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    overlay.classList.add('is-done');
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { finish(); return; }

  var DURATION = 650;
  var DELAY = 40;

  function frame(q) {
    var W = window.innerWidth;
    var H = window.innerHeight;
    var cx = back ? 0 : W;
    var cy = back ? 0 : H;
    var nx = back ? 1 : -1;
    var ny = back ? 0.45 : -0.45;
    var len = Math.hypot(nx, ny);
    nx /= len; ny /= len;
    function dot(p) { return (p[0] - cx) * nx + (p[1] - cy) * ny; }
    var rect = [[0, 0], [W, 0], [W, H], [0, H]];
    var D = 0;
    rect.forEach(function (p) { D = Math.max(D, dot(p)); });
    var h = q * D * 1.02;

    // 折り目の線で画面を切り分ける（keep=true は残る紙、false は折り返す部分）
    function clip(keep) {
      var out = [];
      for (var i = 0; i < 4; i++) {
        var a = rect[i], b = rect[(i + 1) % 4];
        var fa = dot(a) - h, fb = dot(b) - h;
        var ina = keep ? fa >= 0 : fa < 0;
        var inb = keep ? fb >= 0 : fb < 0;
        if (ina) out.push(a);
        if (ina !== inb) {
          var t = fa / (fa - fb);
          out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
      }
      return out;
    }
    function poly(pts) {
      if (pts.length < 3) return 'polygon(0 0, 0 0, 0 0)';
      return 'polygon(' + pts.map(function (p) { return p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px'; }).join(', ') + ')';
    }
    // 折り返した部分は、折り目を軸に反転させて紙の裏として描く
    var flapPts = clip(false).map(function (p) {
      var d = dot(p) - h;
      return [p[0] - 2 * d * nx, p[1] - 2 * d * ny];
    });
    sheet.style.clipPath = poly(clip(true));
    flap.style.clipPath = poly(flapPts);

    var deg = Math.atan2(nx, -ny) * 180 / Math.PI;
    var L = Math.abs(W * nx) + Math.abs(H * ny);
    var tf = (cx + h * nx - W / 2) * nx + (cy + h * ny - H / 2) * ny + L / 2;
    var span = Math.max(60, h);
    flap.style.background = 'linear-gradient(' + deg.toFixed(1) + 'deg, #D9D0BE ' + tf.toFixed(0) + 'px, #FBF8F1 ' + (tf + span * 0.22).toFixed(0) + 'px, #E4DCCB ' + (tf + span).toFixed(0) + 'px)';
  }

  var t0 = null;
  function step(ts) {
    if (done) return;
    if (t0 === null) t0 = ts;
    var p = Math.max(0, Math.min(1, (ts - t0 - DELAY) / DURATION));
    var q = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    frame(q);
    if (p < 1) requestAnimationFrame(step); else finish();
  }
  setTimeout(finish, 1500);
  requestAnimationFrame(step);

  // 戻るボタンで bfcache から復帰したときは演出し直さない
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      finish();
      try { sessionStorage.setItem('mimdesignPage', String(page)); } catch (err) { /* noop */ }
    }
  });
})();
