(() => {
  const buttons = document.querySelectorAll('#nav-register-btn, #mobile-register-btn, .hero-register-btn, .hackathon-register-btn, .cta-register-btn, .pricing-btn');
  const wrap = document.getElementById('register-btn-wrap');
  let main;
  if (wrap) { main = document.createElement('a'); main.className = 'btn btn-primary btn-lg reg-main-btn'; wrap.replaceChildren(main); }
  const all = [...buttons, ...(main ? [main] : [])];
  all.forEach(button => button.addEventListener('click', event => {
    if (!EventSchedule.ready() || !EventSchedule.state(EventSchedule.get()).registrationOpen) { event.preventDefault(); event.stopImmediatePropagation(); }
  }));
  let previous;
  function update() {
    const settings = EventSchedule.get(), ready = EventSchedule.ready(), event = EventSchedule.event();
    const reg = { formUrl: event?.registrationUrl || '', qrImage: '' };
    const open = ready && Boolean(reg.formUrl) && EventSchedule.state(settings).registrationOpen;
    const label = !ready ? (EventSchedule.failed() ? 'Registration unavailable' : 'Checking registration…') : open ? 'Register Now →' : 'Registration Closed';
    document.querySelectorAll('[data-registration-deadline]').forEach(node => {
      node.textContent = new Date(settings.registrationDeadline).toLocaleString('en-GB', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' PKT';
    });
    const signature = label + reg.formUrl;
    if (previous === signature) return;
    previous = signature;
    all.forEach(button => {
      button.textContent = label;
      button.setAttribute('aria-disabled', String(!open));
      button.classList.toggle('registration-pending', !open);
      if (open) { button.href = reg.formUrl; button.target = '_blank'; button.rel = 'noopener noreferrer'; button.removeAttribute('tabindex'); }
      else { button.removeAttribute('href'); button.removeAttribute('target'); button.setAttribute('tabindex', '-1'); }
    });
    const link = document.getElementById('reg-form-link-text');
    if (link) {
      link.replaceChildren();
      if (open) { const a = document.createElement('a'); a.href = reg.formUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Open registration form ↗'; link.append(a); }
      else link.textContent = ready ? 'Registration is currently closed.' : 'The registration service may take a moment to start. Please wait or refresh to try again.';
    }
    document.querySelectorAll('.qr-label').forEach(node => { node.textContent = open ? 'Scan to Register' : label; });
    document.querySelectorAll('.qr-hint').forEach(node => { node.hidden = !open; });
    const qr = document.getElementById('qr-wrapper');
    if (!qr) return;
    qr.replaceChildren();
    if (!open) { const p = document.createElement('p'); p.textContent = label; qr.append(p); }
    else if (reg.qrImage) { const img = document.createElement('img'); img.src = reg.qrImage; img.alt = 'Registration QR Code'; img.className = 'qr-img-custom'; qr.append(img); }
    else if (typeof QRCode !== 'undefined') {
      try { new QRCode(qr, { text: reg.formUrl, width: 200, height: 200, colorDark: '#030d2c', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H }); }
      catch { qr.replaceChildren(); const p = document.createElement('p'); p.textContent = 'Use the Register Now button to open the form.'; qr.append(p); }
    }
    else { const p = document.createElement('p'); p.textContent = 'Use the Register Now button to open the form.'; qr.append(p); }
  }
  update();
  window.addEventListener('schedulechange', update);
  setInterval(update, 1000);
})();
