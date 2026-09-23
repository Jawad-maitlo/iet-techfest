/* ============================================================
   HACKATHON CARDS — renders from SITE_DATA.hackathonCards
============================================================ */
(function () {
  const grid = document.getElementById("hackathon-cards");
  if (!grid) return;

  SITE_DATA.hackathonCards.forEach((card, i) => {
    const delay = i + 1;
    grid.innerHTML += `
      <div class="hack-card reveal reveal-delay-${delay}">
        <div class="hack-icon">${card.icon}</div>
        <div class="hack-title">${card.title}</div>
        <p class="hack-desc">${card.desc}</p>
      </div>
    `;
  });
})();
