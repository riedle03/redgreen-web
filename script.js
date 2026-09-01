(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("site-menu");
  var navLinks = menu ? menu.querySelectorAll("a") : [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function openMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1180) closeMenu();
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -8px 0px" }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // 스크롤 위치 표시는 우측 목차 레일이 맡는다.
  // (섹션 링크는 상단 메뉴에서 빠지고 .toc-rail / .page-toc 로 옮겨졌다)
  var spyLinks = document.querySelectorAll('.toc-rail a[href^="#"]');
  if (!spyLinks.length) {
    spyLinks = menu ? menu.querySelectorAll('a[href^="#"]') : [];
  }

  var sections = [];
  Array.prototype.forEach.call(spyLinks, function (link) {
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    var section = document.querySelector(href);
    if (section) sections.push({ link: link, section: section });
  });

  function setActiveLink() {
    if (!sections.length) return;
    var marker = window.scrollY + 120;
    var current = null;
    if (window.scrollY + 80 >= sections[0].section.offsetTop) {
      current = sections[0];
      for (var i = 0; i < sections.length; i += 1) {
        if (sections[i].section.offsetTop <= marker) {
          current = sections[i];
        }
      }
    }
    sections.forEach(function (item) {
      item.link.classList.remove("is-active");
    });
    if (current) current.link.classList.add("is-active");
  }

  // 히어로를 지나 본문에 들어서면 우측 목차를 띄운다
  var rail = document.querySelector(".toc-rail");
  var firstSection = sections.length ? sections[0].section : null;

  function toggleRail() {
    if (!rail || !firstSection) return;
    rail.classList.toggle("is-on", window.scrollY + 200 >= firstSection.offsetTop);
  }

  toggleRail();
  window.addEventListener("scroll", toggleRail, { passive: true });
  window.addEventListener("resize", toggleRail);

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });
  window.addEventListener("resize", setActiveLink);
})();

(function () {
  var hero = document.querySelector(".hero");
  function togglePets() {
    var limit = hero ? hero.offsetHeight * 0.55 : 300;
    document.body.classList.toggle("pets-on", window.scrollY > limit);
  }
  togglePets();
  window.addEventListener("scroll", togglePets, { passive: true });
})();

(function () {
  var packs = document.querySelectorAll(".viz-card");
  if (!packs.length) return;

  function activate(card, panelName) {
    var buttons = card.querySelectorAll(".viz-btn");
    var panels = card.querySelectorAll(".viz-panel");
    buttons.forEach(function (btn) {
      var on = btn.getAttribute("data-panel") === panelName;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    panels.forEach(function (panel) {
      var on = panel.getAttribute("data-panel") === panelName;
      panel.classList.toggle("is-active", on);
      if (on) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  packs.forEach(function (card) {
    card.querySelectorAll(".viz-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activate(card, btn.getAttribute("data-panel"));
      });
      btn.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        var buttons = Array.prototype.slice.call(card.querySelectorAll(".viz-btn"));
        var idx = buttons.indexOf(btn);
        var next = event.key === "ArrowRight" ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
        buttons[next].focus();
        activate(card, buttons[next].getAttribute("data-panel"));
      });
    });
  });
})();
