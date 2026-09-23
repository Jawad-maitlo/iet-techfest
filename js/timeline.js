/* ============================================================
   TIMELINE — renders from SITE_DATA.timeline
============================================================ */
(function () {
  const container = document.getElementById("timeline");
  if (!container) return;

  SITE_DATA.timeline.forEach((step, i) => {
    const delay = i + 1;
    const stepEl = document.createElement("div");
    stepEl.className = `timeline-step reveal reveal-delay-${delay}`;
    stepEl.innerHTML = `
      <div class="step-node" style="background:${step.bg}">${step.num}</div>
      <div>
        <div class="step-label">${step.label}</div>
        <div class="step-title">${step.title}</div>
        <p class="step-desc">${step.desc}</p>
      </div>
    `;
    container.appendChild(stepEl);
  });
})();
