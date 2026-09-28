(function (root) {
  const defaults = { registrationMode: 'auto', registrationDeadline: '2026-09-27T23:59:59+05:00', eventStart: '2026-10-01T09:00:00+05:00', eventEnd: '2026-10-01T17:00:00+05:00' };
  function valid(s) {
    return s && ['auto', 'open', 'closed'].includes(s.registrationMode) &&
      Number.isFinite(Date.parse(s.registrationDeadline)) && Number.isFinite(Date.parse(s.eventStart)) &&
      Number.isFinite(Date.parse(s.eventEnd)) && Date.parse(s.eventEnd) > Date.parse(s.eventStart);
  }
  function state(s, now = Date.now()) {
    return {
      registrationOpen: s.registrationMode === 'open' || (s.registrationMode === 'auto' && now < Date.parse(s.registrationDeadline)),
      phase: now >= Date.parse(s.eventEnd) ? 'ended' : now >= Date.parse(s.eventStart) ? 'live' : 'upcoming',
      remaining: Math.max(0, Date.parse(s.eventStart) - now)
    };
  }
  const toPKT = value => value ? new Date(Date.parse(value) + 5 * 3600000).toISOString().slice(0, 19) : '';
  const fromPKT = value => value ? new Date(value + (value.length === 16 ? ':00' : '') + '+05:00').toISOString() : null;
  root.EventSchedule = { defaults, valid, state, toPKT, fromPKT };
  if (!root.document || !root.ContentAPI || document.getElementById('schedule-form')) return;
  let current = { ...defaults }, ready = !ContentAPI.configured, loading = false, failed = false;
  const cacheKey = 'interconnect-schedule:' + (root.APP_CONFIG?.apiBaseUrl || 'local');
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    if (ContentAPI.configured && valid(cached)) { current = cached; ready = true; }
  } catch { /* Storage may be unavailable. */ }
  function notify() { root.dispatchEvent(new Event('schedulechange')); }
  Object.assign(root.EventSchedule, { get: () => current, ready: () => ready, failed: () => failed });
  async function refresh() {
    if (!ContentAPI.configured || loading) return;
    loading = true;
    try {
      const value = await ContentAPI.request('/schedule');
      if (!valid(value)) throw new Error('Invalid schedule');
      current = value; ready = true; failed = false;
      try { localStorage.setItem(cacheKey, JSON.stringify(value)); } catch { /* Optional cache. */ }
    } catch { failed = true; /* Keep the last confirmed schedule during temporary outages. */ }
    finally { loading = false; notify(); }
  }
  refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
})(globalThis);
