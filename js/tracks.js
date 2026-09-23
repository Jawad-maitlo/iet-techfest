/* ============================================================
   SKILL TRACKS — renders from SITE_DATA.tracks
============================================================ */
(function () {
  const grid = document.getElementById("tracks-grid");
  if (!grid) return;

  SITE_DATA.tracks.forEach((track, i) => {
    const delay = (i % 4) + 1;
    grid.innerHTML += `
      <div class="track-card reveal reveal-delay-${delay}">
        <div class="track-icon-wrap" style="background:${track.bg};border:1px solid ${track.border}">${track.icon}</div>
        <div>
          <div class="track-title">${track.title}</div>
          <p class="track-desc">${track.desc}</p>
        </div>
      </div>
    `;
  });
})();
