(() => {
  let previous = '';
  function render() {
    const event = EventSchedule.event();
    const signature = JSON.stringify(event);
    if (signature === previous) return;
    previous = signature;
    document.querySelectorAll('[data-current-event]').forEach(node => { node.hidden = !event; });
    const empty = document.getElementById('no-current-event');
    if (empty) empty.hidden = Boolean(event);
    if (!event) {
      document.querySelectorAll('[data-event-email], [data-event-whatsapp]').forEach(node => { node.hidden = true; });
      if (document.body.dataset.page === 'home') document.title = 'Interconnect | Events';
      return;
    }
    if (document.body.dataset.page === 'home') document.title = event.name + ' | Interconnect';
    if (document.body.dataset.page === 'home') document.querySelector('meta[name="description"]')?.setAttribute('content', event.description.slice(0, 300));
    for (const [attr, value] of [['name', event.name], ['tagline', event.tagline], ['description', event.description], ['venue', event.venue]]) {
      document.querySelectorAll(`[data-event-${attr}]`).forEach(node => { node.textContent = value; });
    }
    document.querySelectorAll('[data-event-map]').forEach(node => {
      node.textContent = event.venue;
      if (event.mapUrl) node.href = event.mapUrl; else node.removeAttribute('href');
    });
    document.querySelectorAll('[data-event-email]').forEach(node => {
      node.hidden = !event.email; node.href = 'mailto:' + event.email;
      const label = node.querySelector('span'); if (label) label.textContent = event.email;
    });
    document.querySelectorAll('[data-event-whatsapp]').forEach(node => { node.hidden = !event.whatsapp; node.href = 'https://wa.me/' + event.whatsapp.replace(/^\+/, ''); });
    const fees = document.getElementById('event-fees');
    if (fees) fees.textContent = event.free ? 'Free registration' : event.feeDetails;
    const img = document.getElementById('event-banner'), fallback = document.getElementById('event-poster-fallback');
    if (img) {
      const src = ContentAPI.imageUrl(event.banner);
      img.hidden = !src; fallback.hidden = Boolean(src);
      if (src) { img.src = src; img.alt = event.name + ' poster'; } else img.removeAttribute('src');
      img.onerror = () => { img.hidden = true; fallback.hidden = false; };
    }
  }
  render(); window.addEventListener('schedulechange', render);
})();
