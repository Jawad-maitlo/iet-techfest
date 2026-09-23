/* ============================================================
   SCROLL REVEAL — observes .reveal elements added by all JS renderers
============================================================ */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target); // fire once
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  // Observe existing + newly injected elements
  function observeAll() {
    document.querySelectorAll(".reveal:not(.observed)").forEach(el => {
      el.classList.add("observed");
      observer.observe(el);
    });
  }

  // Run after DOM content + after JS renderers finish
  document.addEventListener("DOMContentLoaded", observeAll);
  window.addEventListener("load", observeAll);
  // Also re-run after a short tick so dynamically injected cards are caught
  setTimeout(observeAll, 100);
})();
