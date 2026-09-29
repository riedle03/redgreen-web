/* 교정쇄 — 움직임 (2026-09-29)
   움직임은 하나뿐이다: 교정 부호가 화면에 들어오면 펜으로 한 번 긋는다
   (빨간 줄 → 초록 삽입표와 바꾼 말 → 여백 지시선). 줄인 움직임 설정이면 처음부터 그어져 있다.
   그 밖에 — 지금 읽는 장 표시(차례의 빨간 동그라미), 읽은 비율, 막대가 값만큼 차오름. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function draw(el) {
    el.classList.add("is-drawn");
    all("[data-draw]", el).forEach(function (d) { d.classList.add("is-drawn"); });
  }
  // ── 지시선: 여백 메모(data-anchor)에서 가리키는 교정 부호까지 실제로 긋는다 ──
  var sheet = document.querySelector(".sheet");
  var notes = all(".mnote[data-anchor]");
  var NS = "http://www.w3.org/2000/svg";
  var layer = null;
  function drawLeaders() {
    if (!sheet || !notes.length) return;
    if (!layer) {
      layer = document.createElementNS(NS, "svg");
      layer.setAttribute("class", "leaders"); layer.setAttribute("aria-hidden", "true");
      sheet.appendChild(layer);
    }
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    if (window.innerWidth <= 820) return;
    var base = sheet.getBoundingClientRect();
    notes.forEach(function (n) {
      var anchor = document.getElementById(n.getAttribute("data-anchor"));
      if (!anchor) return;
      var t = anchor.querySelector(".fix del") || anchor;
      var rects = t.getClientRects();
      var ar = rects.length ? rects[rects.length - 1] : t.getBoundingClientRect();
      var nr = n.getBoundingClientRect();
      var ax, ay;
      if (t === anchor) { ax = ar.right - base.left + 8; ay = ar.top - base.top + 14; }
      else { ax = ar.right - base.left + 14; ay = ar.top - base.top + ar.height * .6; }
      var bx = nr.left - base.left - 8, by = nr.top - base.top + 12;
      if (bx - ax < 16) return;
      var mx = (ax + bx) / 2;
      var d = "M" + bx + " " + by + " C" + mx + " " + by + " " + mx + " " + ay + " " + ax + " " + ay +
              " M" + (ax + 7) + " " + (ay - 4.5) + " L" + ax + " " + ay + " L" + (ax + 7) + " " + (ay + 4.5);
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("class", n.classList.contains("r") ? "r" : n.classList.contains("g") ? "g" : "p");
      layer.appendChild(path);
      n._leader = null;
      if (!reduce && !n.classList.contains("is-drawn") && path.getTotalLength) {
        var len = Math.ceil(path.getTotalLength()) + 40;
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        n._leader = path;
      }
    });
  }
  function revealLeader(n) { if (n._leader) n._leader.style.strokeDashoffset = 0; }
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(drawLeaders, 120); });
  drawLeaders();
  window.addEventListener("load", drawLeaders);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLeaders);

  var targets = all(".fix, .mnote, .bar, .rise");
  var chapters = all("main > section[id]");
  var links = all("[data-chap]");

  function setCurrent(id) {
    links.forEach(function (a) {
      if (a.getAttribute("data-chap") === id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    var chip = document.querySelector('.chips [aria-current="true"]');
    if (chip && chip.scrollIntoView && document.querySelector(".chips").offsetParent) {
      chip.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    }
  }

  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { draw(el); el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        draw(e.target); e.target.classList.add("is-in");
        revealLeader(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: "-35% 0px -60% 0px" });
    chapters.forEach(function (s) { co.observe(s); });
  }
  setCurrent("c0");

  var prog = document.getElementById("prog");
  var ticking = false;
  function updateProg() {
    ticking = false;
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    prog.textContent = Math.max(0, Math.min(100, Math.round(p * 100)));
  }
  if (prog) {
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProg); }
    }, { passive: true });
    updateProg();
  }
})();
