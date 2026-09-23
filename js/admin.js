(() => {
  const { request, element: el, imageUrl, date, configured } = ContentAPI;
  const $ = id => document.getElementById(id);
  // Keep credentials out of persistent browser storage. Reloading requires signing in again.
  let token = '', editing = null, previewUrl = '', sessionTimer, sessionVersion = 0;
  const pages = { announcements: 1, photos: 1 };
  function status(id, message = '', error = false) { $(id).textContent = message; $(id).classList.toggle('error', error); }
  async function api(path, options = {}) {
    try { return await request(path, { ...options, token }); }
    catch (error) { if (error.status === 401 && token) logout('Your session expired. Please sign in again.'); throw error; }
  }
  async function busy(button, action) { const label = button.textContent; button.disabled = true; button.textContent = 'Please wait…'; try { await action(); } finally { button.disabled = false; button.textContent = label; } }
  function resetEditor() { editing = null; $('announcement-form').reset(); $('editor-title').textContent = 'New announcement'; $('announcement-save').textContent = 'Publish announcement'; $('cancel-edit').hidden = true; }
  function clearPreview() { if (previewUrl) URL.revokeObjectURL(previewUrl); previewUrl = ''; $('photo-preview').hidden = true; $('photo-preview').removeAttribute('src'); }
  function logout(message = '') {
    token = ''; sessionVersion++; clearTimeout(sessionTimer); resetEditor(); clearPreview(); $('photo-form').reset(); $('login-form').reset(); $('dashboard').hidden = true; $('login-panel').hidden = false;
    $('admin-announcements').replaceChildren(); $('admin-photos').replaceChildren();
    for (const id of ['announcement-status','photo-status','dashboard-status']) status(id);
    status('login-status', message, Boolean(message)); $('email').focus();
  }
  $('setup-notice').hidden = configured;
  $('login-form').querySelector('button').disabled = !configured;
  $('login-form').addEventListener('submit', async event => {
    event.preventDefault(); status('login-status', 'Signing in. The service may take a moment to start.');
    await busy(event.submitter, async () => {
      try {
        const result = await request('/auth/login', { method:'POST', body:{ email:$('email').value, password:$('password').value } });
        token = result.token; sessionVersion++; $('password').value = ''; $('login-panel').hidden = true; $('dashboard').hidden = false;
        sessionTimer = setTimeout(() => logout('Your session expired. Please sign in again.'), result.expiresIn * 1000);
        $('announcements-tab').focus(); await Promise.all([load('announcements', true), load('photos', true)]);
      } catch (error) { status('login-status', error.message, true); }
    });
  });
  $('logout').addEventListener('click', () => logout());
  for (const type of ['announcements','photos']) {
    const tab = $(`${type}-tab`);
    tab.addEventListener('click', () => {
      for (const other of ['announcements','photos']) { $(`${other}-panel`).hidden = type !== other; $(`${other}-tab`).setAttribute('aria-selected', type === other); $(`${other}-tab`).tabIndex = type === other ? 0 : -1; }
    });
    tab.addEventListener('keydown', event => { if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 'announcements' : event.key === 'End' ? 'photos' : type === 'photos' ? 'announcements' : 'photos'; $(`${next}-tab`).click(); $(`${next}-tab`).focus(); } });
    $(`refresh-${type}`).addEventListener('click', event => busy(event.currentTarget, () => load(type, true)));
    $(`admin-${type}-more`).addEventListener('click', event => busy(event.currentTarget, () => load(type)));
  }
  function confirmDelete(item) {
    $('delete-description').textContent = item.title || item.caption;
    const dialog = $('delete-dialog'); dialog.returnValue = ''; dialog.showModal();
    return new Promise(resolve => dialog.addEventListener('close', () => resolve(dialog.returnValue === 'delete'), { once:true }));
  }
  function deleteButton(type, item) {
    const button = el('button', 'text-button', 'Delete');
    button.addEventListener('click', async () => {
      if (!await confirmDelete(item)) return;
      await busy(button, async () => {
        try { await api(`/${type}/${item._id}`, { method:'DELETE' }); if (editing === item._id) resetEditor(); status('dashboard-status', 'Item deleted.'); await load(type, true); }
        catch (error) { status('dashboard-status', error.message, true); }
      });
    }); return button;
  }
  function renderAnnouncement(item) {
    const card = el('article', 'content-card');
    const meta = el('div', 'content-date', date(item.createdAt));
    if (item.pinned) meta.prepend(el('span', 'pin-badge', 'Pinned'));
    const actions = el('div', 'form-actions'), edit = el('button','text-button','Edit'), pin = el('button','text-button',item.pinned ? 'Unpin' : 'Pin to top');
    edit.addEventListener('click', () => {
      editing = item._id; $('announcement-title').value = item.title; $('announcement-body').value = item.body; $('announcement-pinned').checked = item.pinned;
      $('editor-title').textContent = 'Edit announcement'; $('announcement-save').textContent = 'Save changes'; $('cancel-edit').hidden = false; status('announcement-status'); $('announcement-title').focus();
    });
    pin.addEventListener('click', () => busy(pin, async () => {
      try { await api(`/announcements/${item._id}`, { method:'PUT', body:{ title:item.title, body:item.body, pinned:!item.pinned } }); if (editing === item._id) $('announcement-pinned').checked = !item.pinned; await load('announcements', true); status('dashboard-status', 'Pin setting updated.'); }
      catch (error) { status('dashboard-status', error.message, true); }
    }));
    actions.append(edit, pin, deleteButton('announcements', item)); card.append(meta, el('h3','',item.title), el('p','',item.body), actions); return card;
  }
  function renderPhoto(item) {
    const card = el('article','content-card'), img = el('img'), details = el('div','photo-details');
    img.src = imageUrl(item.url); img.alt = item.caption; img.loading = 'lazy';
    details.append(el('p','',item.caption), el('div','content-date',date(item.createdAt)), deleteButton('photos', item)); card.append(img, details); return card;
  }
  const loading = { announcements: false, photos: false };
  async function load(type, reset = false) {
    if (loading[type]) return;
    loading[type] = true;
    const version = sessionVersion, grid = $(`admin-${type}`), more = $(`admin-${type}-more`);
    if (reset) { pages[type] = 1; grid.replaceChildren(); }
    grid.querySelectorAll('.content-state').forEach(node => node.remove());
    const message = el('p','content-state','Loading…'); grid.append(message); more.hidden = true;
    try {
      const data = await api(`/${type}?page=${pages[type]}`);
      if (version !== sessionVersion) return;
      message.remove(); data.items.forEach(item => grid.append(type === 'photos' ? renderPhoto(item) : renderAnnouncement(item)));
      $(type === 'photos' ? 'photo-count' : 'announcement-count').textContent = data.total;
      if (!data.total) grid.append(el('p','content-state',type === 'photos' ? 'No event photos yet. Upload your first moment.' : 'No announcements yet. Publish your first update.'));
      more.hidden = !data.hasMore; pages[type]++;
    } catch (error) { if (version === sessionVersion) { message.textContent = error.message + ' Use Refresh to try again.'; status('dashboard-status', error.message, true); } }
    finally { loading[type] = false; }
  }
  $('cancel-edit').addEventListener('click', () => { resetEditor(); status('announcement-status'); });
  $('announcement-form').addEventListener('submit', async event => {
    event.preventDefault(); status('announcement-status');
    let saved = false;
    await busy(event.submitter, async () => {
      try {
        await api(editing ? `/announcements/${editing}` : '/announcements', { method:editing ? 'PUT' : 'POST', body:{ title:$('announcement-title').value, body:$('announcement-body').value, pinned:$('announcement-pinned').checked } });
        saved = true; status('announcement-status', 'Published. Your announcement is now on the website.'); await load('announcements', true);
      } catch (error) { status('announcement-status', error.message, true); }
    });
    if (saved) resetEditor();
  });
  $('photo-file').addEventListener('change', () => {
    clearPreview(); status('photo-status'); const file = $('photo-file').files[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) { status('photo-status','Choose a JPEG, PNG, or WebP up to 8 MB.',true); $('photo-file').value = ''; return; }
    previewUrl = URL.createObjectURL(file); $('photo-preview').src = previewUrl; $('photo-preview').hidden = false;
  });
  $('photo-form').addEventListener('submit', async event => {
    event.preventDefault(); status('photo-status','Uploading your photo…');
    await busy(event.submitter, async () => {
      try { const data = new FormData(); data.append('caption',$('photo-caption').value); data.append('photo',$('photo-file').files[0]); await api('/photos',{ method:'POST',body:data }); $('photo-form').reset(); clearPreview(); status('photo-status','Published. Your photo is now in the event gallery.'); await load('photos',true); }
      catch (error) { status('photo-status',error.message,true); }
    });
  });
})();
