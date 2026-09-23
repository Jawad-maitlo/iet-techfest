/* ============================================================
   NAVBAR — scroll, active links, hamburger
============================================================ */
(function () {
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu= document.getElementById("mobileMenu");

  /* Scroll effects */
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    highlightActive();
  }, { passive: true });

  /* Active nav link */
  function highlightActive() {
    const page = document.body.dataset.page;
    if (page) {
      document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        const active = link.getAttribute('href') === (page === 'home' ? 'index.html' : `${page}.html`);
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      return;
    }
    const sections = document.querySelectorAll("section[id]");
    const links    = document.querySelectorAll(".nav-links a");
    let current = "";
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  }
  highlightActive();

  /* Hamburger */
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", mobileMenu.classList.contains("open"));
  });

  /* Close menu on link click */
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); }
    });
  });
})();
