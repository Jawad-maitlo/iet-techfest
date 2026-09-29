window.PortalAdmin = {
  create({ api, onChange, version }) {
    const $ = id => document.getElementById(id);
    let events = [], members = [], eventId = '', memberId = '', eventPreview, memberPreview;
    const eventKeys = ['name','tagline','description','venue','mapUrl','registrationUrl','registrationMode','feeDetails','email','whatsapp'];
    const dates = ['registrationDeadline','eventStart','eventEnd'];
    const message = (id, text = '', error = false) => { $(id).textContent = text; $(id).classList.toggle('error', error); };
    function preview(prefix, src) {
      const img = $(prefix + '-preview');
      const safe = /^images\/people\/[a-z0-9_.-]+$/i.test(src || '') ? src : ContentAPI.imageUrl(src);
      img.hidden = !safe; if (safe) img.src = safe; else img.removeAttribute('src');
    }
    function fillEvent(item) {
      eventId = item?.id || ''; $('event-form').reset();
      eventKeys.forEach(key => { $('ev-' + key).value = item?.[key] || (key === 'registrationMode' ? 'auto' : ''); });
      dates.forEach(key => { $('ev-' + key).value = EventSchedule.toPKT(item?.[key]); });
      $('ev-free').checked = item?.free ?? true;
      $('event-select').value = eventId;
      $('event-save').textContent = item ? 'Save changes' : 'Save draft';
      $('event-archive').hidden = !item || item.status === 'archived';
      $('event-fields').disabled = false; preview('ev', item?.banner); message('event-status');
    }
    function fillMember(item) {
      memberId = item?.id || ''; $('member-form').reset();
      ['name','role','description','linkedin'].forEach(key => { $('member-' + key).value = item?.[key] || ''; });
      $('member-order').value = item?.order ?? (members.length ? Math.max(...members.map(m => m.order)) + 1 : 0);
      $('member-select').value = memberId; $('delete-member').hidden = !item;
      $('member-fields').disabled = false; preview('member', item?.photo); message('member-status');
    }
    function options(id, items, label, selected) {
      const select = $(id); select.replaceChildren(new Option(label, ''));
      items.forEach(item => select.append(new Option(item.name + (item.status ? ' · ' + item.status : ' · ' + item.role), item.id)));
      select.value = selected;
    }
    async function loadEvents() {
      const current = version();
      try { const data = await api('/admin/events'); if (current !== version()) return false; events = data.items; options('event-select', events, 'New draft', eventId); $('event-fields').disabled = false; return true; }
      catch (error) { if (current === version()) message('event-status', error.message + ' Use Reload events to retry.', true); return false; }
    }
    async function loadTeam() {
      const current = version();
      try { const data = await api('/team'); if (current !== version()) return false; members = data.items; options('member-select', members, 'New member', memberId); $('member-fields').disabled = false; return true; }
      catch (error) { if (current === version()) message('member-status', error.message + ' Use Reload team to retry.', true); return false; }
    }
    function fileInput(prefix) {
      const file = $(prefix + '-image').files[0];
      if (file && (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024)) throw new Error('Choose a JPEG, PNG or WebP image up to 8 MB.');
      return file;
    }
    async function imageUpdate(type, id, prefix, file) {
      if (file) { const body = new FormData(); body.append('image', file); await api(`/admin/${type}/${id}/image`, { method: 'POST', body }); }
      else if ($(prefix + '-remove-image').checked) await api(`/admin/${type}/${id}/image`, { method: 'DELETE' });
    }
    // A save locks its selector as well as its form, so a response cannot apply
    // to a different record selected during an upload.
    async function run(kind, task) {
      const current = version();
      const ids = kind === 'event' ? ['event-fields','event-select','new-event','reload-events'] : ['member-fields','member-select','new-member','reload-team'];
      ids.forEach(id => { $(id).disabled = true; });
      message(kind + '-status', 'Saving…');
      try { await task(() => current === version()); }
      catch (error) { if (current === version()) message(kind + '-status', error.message, true); }
      finally { if (current === version()) ids.forEach(id => { $(id).disabled = false; }); }
    }
    $('event-form').addEventListener('submit', async event => {
      event.preventDefault(); const publish = event.submitter.id === 'event-publish';
      await run('event', async active => {
        const file = fileInput('ev'), body = { free: $('ev-free').checked };
        eventKeys.forEach(key => { body[key] = $('ev-' + key).value; });
        dates.forEach(key => { body[key] = EventSchedule.fromPKT($('ev-' + key).value) || ''; });
        const saved = await api(eventId ? `/admin/events/${eventId}` : '/admin/events', { method: eventId ? 'PUT' : 'POST', body });
        if (!active()) return; eventId = saved.id;
        try { await imageUpdate('events', eventId, 'ev', file); }
        catch (error) { await loadEvents(); throw new Error('Event details saved, but the image was not updated: ' + error.message); }
        if (!active()) return;
        if (publish) {
          try { await api(`/admin/events/${eventId}/publish`, { method: 'POST' }); }
          catch (error) { await loadEvents(); throw new Error('Event saved but not published: ' + error.message); }
        }
        if (!active()) return;
        if (!await loadEvents()) throw new Error('Event saved, but the list could not be reloaded. Use Reload events.');
        if (!active()) return; fillEvent(events.find(x => x.id === eventId));
        await onChange();
        if (active()) message('event-status', publish ? 'Published. This is now the current event on the home page.' : 'Event saved. Drafts stay private; changes to the current event appear on the website.');
      });
    });
    $('member-form').addEventListener('submit', async event => {
      event.preventDefault(); await run('member', async active => {
        const file = fileInput('member'), body = { order: Number($('member-order').value) };
        ['name','role','description','linkedin'].forEach(key => { body[key] = $('member-' + key).value; });
        const saved = await api(memberId ? `/admin/team/${memberId}` : '/admin/team', { method: memberId ? 'PUT' : 'POST', body });
        if (!active()) return; memberId = saved.id;
        try { await imageUpdate('team', memberId, 'member', file); }
        catch (error) { await loadTeam(); throw new Error('Profile saved, but the photo was not updated: ' + error.message); }
        if (!active()) return;
        if (!await loadTeam()) throw new Error('Profile saved, but the list could not be reloaded. Use Reload team.');
        if (!active()) return; fillMember(members.find(x => x.id === memberId)); message('member-status', 'Profile saved. The Team page updates on refresh or within a minute.');
      });
    });
    $('event-archive').addEventListener('click', () => {
      if (!eventId || !confirm('Archive this event? If it is current, the home page will show that no event is currently open.')) return;
      run('event', async active => { await api(`/admin/events/${eventId}/archive`, { method: 'POST' }); if (!active()) return; await loadEvents(); if (!active()) return; fillEvent(events.find(x => x.id === eventId)); await onChange(); if (active()) message('event-status', 'Event archived.'); });
    });
    $('delete-member').addEventListener('click', () => {
      if (!memberId || !confirm('Delete this team profile from the website?')) return;
      run('member', async active => { await api(`/admin/team/${memberId}`, { method: 'DELETE' }); if (!active()) return; memberId = ''; await loadTeam(); if (active()) { fillMember(null); message('member-status', 'Profile deleted.'); } });
    });
    $('event-select').addEventListener('change', () => fillEvent(events.find(x => x.id === $('event-select').value)));
    $('member-select').addEventListener('change', () => fillMember(members.find(x => x.id === $('member-select').value)));
    $('new-event').addEventListener('click', () => fillEvent(null));
    $('new-member').addEventListener('click', () => fillMember(null));
    $('reload-events').addEventListener('click', loadEvents); $('reload-team').addEventListener('click', loadTeam);
    for (const prefix of ['ev','member']) $(prefix + '-image').addEventListener('change', () => {
      let previous = prefix === 'ev' ? eventPreview : memberPreview;
      if (previous) URL.revokeObjectURL(previous);
      try {
        const file = fileInput(prefix); if (!file) { preview(prefix, ''); return; }
        const url = URL.createObjectURL(file); if (prefix === 'ev') eventPreview = url; else memberPreview = url;
        $(prefix + '-preview').src = url; $(prefix + '-preview').hidden = false;
      } catch (error) { $(prefix + '-image').value = ''; message(prefix === 'ev' ? 'event-status' : 'member-status', error.message, true); }
    });
    return {
      async load() { fillEvent(null); fillMember(null); await Promise.all([loadEvents(), loadTeam()]); },
      async refreshEvents() {
        await loadEvents();
        const item = events.find(x => x.id === eventId && x.status === 'published');
        if (item) {
          dates.forEach(key => { $('ev-' + key).value = EventSchedule.toPKT(item[key]); });
          $('ev-registrationMode').value = item.registrationMode;
        }
      },
      reset() {
        events = []; members = []; eventId = ''; memberId = '';
        for (const url of [eventPreview, memberPreview]) if (url) URL.revokeObjectURL(url);
        eventPreview = memberPreview = undefined;
        $('event-form').reset(); $('member-form').reset();
        $('event-fields').disabled = true; $('member-fields').disabled = true;
        options('event-select', [], 'New draft', ''); options('member-select', [], 'New member', '');
        preview('ev', ''); preview('member', ''); message('event-status'); message('member-status');
      }
    };
  }
};
