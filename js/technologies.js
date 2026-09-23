/* ============================================================
   TECHNOLOGIES — renders from SITE_DATA.technologies
============================================================ */
(function () {
  const grid = document.getElementById("tech-grid");
  if (!grid) return;

  SITE_DATA.technologies.forEach((tech, i) => {
    const delay = (i % 4) + 1;
    grid.innerHTML += `
      <div class="tech-badge reveal reveal-delay-${delay}">
        <div class="tech-dot" style="background:${tech.color}"></div>
        ${tech.name}
      </div>
    `;
  });
})();
