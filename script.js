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
      if (window.innerWidth > 900) closeMenu();
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
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  var sections = [];
  navLinks.forEach(function (link) {
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
    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
    });
    if (current) current.link.classList.add("is-active");
  }

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
