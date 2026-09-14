/* 포트폴리오 홈 — 움직임과 차트 (2026-09-15)
   점진적 향상: GSAP·Chart.js가 없어도 내용은 전부 읽힌다(표가 차트의 대체 텍스트다).
   움직임은 의미가 있을 때만 — 읽은 위치(챕터 내비·진행률), 수의 크기(카운트업·막대), 등장(reveal). */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chapters = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-chap]"));

  // ── 챕터 내비: 지금 읽는 챕터 표시 ──
  function setCurrent(id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute("data-chap") === id;
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    var bar = document.querySelector(".chap-bar");
    var act = bar && bar.querySelector('[aria-current="true"]');
    if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    chapters.forEach(function (s) { io.observe(s); });

    // 등장 — 한 번만
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        ro.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal, .bar").forEach(function (el) { ro.observe(el); });

    // 카운트업 — 수가 커지는 것을 보여 준다
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countUp(e.target); co.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { co.observe(el); });
  } else {
    document.querySelectorAll(".reveal, .bar").forEach(function (el) { el.classList.add("is-in"); });
  }

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduce || !window.gsap) { el.textContent = target; return; }
    var obj = { v: 0 };
    gsap.to(obj, { v: target, duration: 1.1, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(obj.v); } });
  }

  // ── 진행률 (GSAP ScrollTrigger 있으면 정확히, 없으면 스크롤 비율) ──
  var prog = document.getElementById("prog");
  function updateProg() {
    if (!prog) return;
    var h = document.documentElement;
    var p = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight);
    prog.textContent = Math.max(0, Math.min(100, Math.round(p * 100)));
  }
  window.addEventListener("scroll", updateProg, { passive: true });
  updateProg();

  window.addEventListener("load", function () {
    if (window.gsap && window.ScrollTrigger && !reduce) {
      gsap.registerPlugin(ScrollTrigger);
      // 타임라인 막대가 왼쪽부터 차오른다 — 분 배분이 읽힌다
      document.querySelectorAll(".tl").forEach(function (tl) {
        gsap.from(tl.children, { scaleX: 0, transformOrigin: "left center", stagger: 0.12, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: tl, start: "top 85%", once: true } });
      });
      // 사례 카드 다섯 칸이 차례로 — 조사한 말에서 제언까지의 순서가 읽힌다
      document.querySelectorAll(".case .flow").forEach(function (f) {
        gsap.from(f.children, { y: 14, opacity: 0, stagger: 0.08, duration: 0.45, ease: "power2.out",
          scrollTrigger: { trigger: f, start: "top 85%", once: true } });
      });
    }
    charts();
  });

  // ── 차트: 표가 원본, 차트는 같은 수를 그린다 ──
  function charts() {
    if (!window.Chart) return;
    var red = "#e0432f", green = "#2f8a68", ink = "#17191c", sub = "#6b7079";
    Chart.defaults.font.family = "Pretendard, Malgun Gothic, system-ui, sans-serif";
    Chart.defaults.color = sub;
    var c1 = document.getElementById("chart-overlap");
    if (c1) {
      document.getElementById("tbl-overlap").classList.add("visually-hidden");
      new Chart(c1, {
        type: "bar",
        data: { labels: ["쌰갈 계열", "야르 계열", "ㅅㅂ 계열"],
          datasets: [{ label: "따로 조사한 모둠 수", data: [5, 5, 4], backgroundColor: [red, red, red], borderRadius: 6, maxBarThickness: 44 }] },
        options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, animation: reduce ? false : { duration: 900 },
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.x + "모둠 (24모둠 중)"; } } } },
          scales: { x: { min: 0, max: 6, ticks: { stepSize: 1, callback: function (v) { return v + "모둠"; } }, grid: { color: "#eef0f3" } },
                    y: { ticks: { color: ink, font: { weight: "700", size: 14 } }, grid: { display: false } } } }
      });
    }
    var c2 = document.getElementById("chart-revise");
    if (c2) {
      document.getElementById("tbl-revise").classList.add("visually-hidden");
      new Chart(c2, {
        type: "bar",
        data: { labels: ["원인 한 줄", "실행 방안", "말의 뜻"],
          datasets: [
            { label: "첫 실시 4편", data: [0.50, 0.25, 2.00], backgroundColor: "#c9ced6", borderRadius: 6, maxBarThickness: 36 },
            { label: "개정판 20편", data: [0.95, 1.10, 1.55], backgroundColor: [green, green, red], borderRadius: 6, maxBarThickness: 36 }
          ] },
        options: { responsive: true, maintainAspectRatio: false, animation: reduce ? false : { duration: 900 },
          plugins: { legend: { position: "top", labels: { boxWidth: 12, color: ink } },
                     tooltip: { callbacks: { label: function (c) { return c.dataset.label + ": " + c.parsed.y.toFixed(2) + "점"; } } } },
          scales: { y: { min: 0, max: 2, ticks: { stepSize: 0.5, callback: function (v) { return v.toFixed(1); } }, grid: { color: "#eef0f3" }, title: { display: true, text: "항목 평균 (0~2점)" } },
                    x: { ticks: { color: ink, font: { weight: "700", size: 13 } }, grid: { display: false } } } }
      });
    }
  }
})();
