(() => {
  const { request, element: el, date, imageUrl, configured } = ContentAPI;
  const dialog = document.getElementById('photo-viewer');
  document.getElementById('close-viewer')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  function photo(item) {
    const card = el('figure', 'content-card photo-card');
    const button = el('button'); button.type = 'button'; button.setAttribute('aria-label', `View photo: ${item.caption}`);
    const img = el('img'); img.src = imageUrl(item.url); img.alt = item.caption; img.loading = 'lazy';
    button.append(img); card.append(button, el('figcaption', '', item.caption));
    button.addEventListener('click', () => {
      const full = document.getElementById('viewer-image'); full.src = imageUrl(item.url); full.alt = item.caption;
      document.getElementById('viewer-caption').textContent = item.caption; dialog.showModal();
    }); return card;
  }
  function announcement(item) {
    const card = el('article', 'content-card');
    const meta = el('div', 'content-date');
    if (item.pinned) meta.append(el('span', 'pin-badge', 'Pinned'));
    const time = el('time', '', date(item.createdAt)); time.dateTime = item.createdAt; meta.append(time);
    card.append(meta, el('h3', '', item.title), el('p', '', item.body)); return card;
  }
  for (const type of ['announcements', 'photos']) {
    const grid = document.getElementById(`${type}-grid`), more = document.getElementById(`${type}-more`);
    if (!grid || !more) continue;
    let page = 1;
    function state(title, message, retry = false) {
      const box = el('div', 'content-state'); box.append(el('strong', '', title), el('p', '', message));
      if (retry) { const button = el('button', 'btn btn-ghost', 'Try again'); button.addEventListener('click', () => load()); box.append(button); }
      grid.append(box);
    }
    async function load() {
      grid.querySelectorAll('.content-state').forEach(node => node.remove());
      more.hidden = true;
      state('Loading…', 'Fetching the latest updates. This may take a moment.');
      try {
        const data = await request(`/${type}?page=${page}`);
        grid.querySelectorAll('.content-state').forEach(node => node.remove());
        for (const item of data.items) grid.append(type === 'photos' ? photo(item) : announcement(item));
        if (!grid.children.length) state(type === 'photos' ? 'The best moments are still ahead.' : 'You’re up to date.', type === 'photos' ? 'Event photographs will be shared here after the hackathon.' : 'New announcements from the organizing team will appear here.');
        more.hidden = !data.hasMore; page++;
      } catch (error) { grid.querySelectorAll('.content-state').forEach(node => node.remove()); state('Updates are temporarily unavailable.', error.message, true); }
    }
    more.addEventListener('click', load);
    grid.replaceChildren();
    if (configured) load(); else state(type === 'photos' ? 'The best moments are still ahead.' : 'Stay connected.', type === 'photos' ? 'Event photographs will be shared here after the hackathon.' : 'Announcements will appear here when the content service is connected.');
  }
})();
