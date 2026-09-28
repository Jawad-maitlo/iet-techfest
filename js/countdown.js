(() => {
  const section = document.getElementById('countdown');
  if (!section) return;
  function tick() {
    const schedule = EventSchedule.get();
    const { phase, remaining } = EventSchedule.state(schedule);
    section.hidden = phase === 'ended';
    section.querySelector('.countdown-grid').hidden = phase !== 'upcoming';
    section.querySelector('.countdown-label').textContent = phase === 'live' ? '🎉 Event Is Live' : '⚡ Event Starts In';
    const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
    ['days', 'hours', 'mins', 'secs'].forEach((part, i) => { document.getElementById('cd-' + part).textContent = String(values[i]).padStart(2, '0'); });
    const date = new Date(schedule.eventStart).toLocaleDateString('en-GB', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'long', year: 'numeric' });
    document.querySelectorAll('[data-event-date]').forEach(node => { node.textContent = date; });
  }
  tick();
  window.addEventListener('schedulechange', tick);
  setInterval(tick, 1000);
})();
