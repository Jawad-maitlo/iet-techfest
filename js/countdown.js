/* ============================================================
   COUNTDOWN TIMER — counts down to 01 October 2026
============================================================ */
(function () {
  // Target: 1 October 2026 at 09:00 AM PKT (UTC+5)
  const TARGET = new Date("2026-10-01T09:00:00+05:00").getTime();

  const elDays  = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins  = document.getElementById("cd-mins");
  const elSecs  = document.getElementById("cd-secs");

  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now  = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      // Event has started
      elDays.textContent  = "00";
      elHours.textContent = "00";
      elMins.textContent  = "00";
      elSecs.textContent  = "00";
      const label = document.querySelector(".countdown-label");
      if (label) label.textContent = "🎉 The Event Is Live!";
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent  = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent  = pad(mins);
    elSecs.textContent  = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();
