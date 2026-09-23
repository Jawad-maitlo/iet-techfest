/* ============================================================
   PARTICLES
============================================================ */
(function () {
  const container = document.getElementById("particles");
  if (!container) return;
  const colors = [
    "rgba(168,85,247,0.6)",
    "rgba(56,189,248,0.5)",
    "rgba(236,72,153,0.5)",
    "rgba(251,191,36,0.4)",
  ];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      width:${Math.random() * 2 + 1}px;
      height:${Math.random() * 2 + 1}px;
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 8}s;
      background:${colors[Math.floor(Math.random() * colors.length)]};
    `;
    container.appendChild(p);
  }
})();
