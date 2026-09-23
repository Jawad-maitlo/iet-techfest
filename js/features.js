/* ============================================================
   FEATURES — renders from SITE_DATA.features
============================================================ */
(function () {
  const grid = document.getElementById("features-grid");
  if (!grid) return;

  SITE_DATA.features.forEach((f, i) => {
    const delay = (i % 3) + 1;
    grid.innerHTML += `
      <div class="feature-card reveal reveal-delay-${delay}">
        <div class="feature-icon" style="background:${f.iconBg};border-color:${f.iconBorder}">${f.icon}</div>
        <div class="feature-num">${f.num}</div>
        <div class="feature-title">${f.title}</div>
        <p class="feature-desc">${f.desc}</p>
        <div class="feature-accent" style="background:${f.accentColor}"></div>
      </div>
    `;
  });
})();
