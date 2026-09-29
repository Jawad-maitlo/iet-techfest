window.PortalAdmin = {
  create({ api, onChange, version }) {
    const $ = id => document.getElementById(id);
    let events = [], members = [], eventId = '', memberId = '', eventPreview, memberPreview;
    const eventKeys = ['name','tagline','description','venue','mapUrl','registrationUrl','registrationMode','feeDetails','email','whatsapp'];
    const dates = ['registrationDeadline','eventStart','eventEnd'];
    $('member-group').replaceChildren(new Option('Organizing Team (not assigned yet)', 'unassigned'), ...Organization.map(g=>new Option(g.label,g.id)));
    function slots(selected='') {
      const group=Organization.find(g=>g.id===$('member-group').value);
      $('member-slot').replaceChildren(new Option('Custom role / additional member',''),...(group?.roles || []).map(role=>new Option(role,role)));
      $('member-slot').value=selected;
      $('member-role').readOnly=!!selected;
      if(selected)$('member-role').value=selected;
    }
    function planner() {
      const active=members.filter(x=>x.status!=='archived');
      $('roster-count').textContent=`Official roster: ${active.filter(x=>x.officialRoster && x.status==='published').length} published / target 40; ${active.filter(x=>x.officialRoster && x.status==='draft').length} drafts. One person has one primary role. Existing profiles remain visible until you move or unpublish them.`;
      $('role-slots').replaceChildren();
      for(const group of Organization){
        const section=document.createElement('section');const heading=document.createElement('h3');heading.textContent=group.label;section.append(heading);
        const note=document.createElement('p');note.className='field-help';note.textContent=group.note || `Planning capacity: ${group.capacity}`;section.append(note);
        for(const role of group.roles){
          const member=active.find(x=>x.group===group.id && x.slot===role);
          const button=document.createElement('button');button.type='button';button.className='role-slot';button.textContent=`${role} — ${member ? member.name+' ('+member.status+') · Edit' : 'Empty · Assign'}`;
          button.addEventListener('click',()=>{if($('member-fields').disabled)return;if(member)fillMember(member);else{$('member-group').value=group.id;slots(role);} $('member-name').focus();});section.append(button);
        }
        $('role-slots').append(section);
      }
    }
    $('member-group').addEventListener('change',()=>slots());
    $('member-slot').addEventListener('change',()=>{const value=$('member-slot').value;$('member-role').readOnly=!!value;if(value)$('member-role').value=value;});
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
      ['name','role','description','linkedin','secondary'].forEach(key => { $('member-' + key).value = item?.[key] || ''; });
      $('member-group').value=item?.group || 'unassigned';slots(item?.slot || '');
      $('member-officialRoster').checked=!!item?.officialRoster;
      $('member-save').textContent=item ? 'Save changes' : 'Save draft';
      $('member-draft').hidden=item?.status!=='published';
      $('member-archive').hidden=!item || item.status==='archived';
      $('member-restore').hidden=item?.status!=='archived';
      $('member-publish').hidden=item?.status==='archived';
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
      try { const data = await api('/admin/team'); if (current !== version()) return false; members = data.items; options('member-select', members, 'New member', memberId); planner(); $('member-fields').disabled = false; return true; }
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
      event.preventDefault(); const publish=event.submitter?.id==='member-publish'; await run('member', async active => {
        const file = fileInput('member'), body = { order: Number($('member-order').value), officialRoster:$('member-officialRoster').checked };
        ['name','role','description','linkedin','secondary','group','slot'].forEach(key => { body[key] = $('member-' + key).value; });
        const saved = await api(memberId ? `/admin/team/${memberId}` : '/admin/team', { method: memberId ? 'PUT' : 'POST', body });
        if (!active()) return; memberId = saved.id;
        try { await imageUpdate('team', memberId, 'member', file); }
        catch (error) { await loadTeam(); throw new Error('Profile saved, but the photo was not updated: ' + error.message); }
        if (!active()) return;
        if(publish)await api(`/admin/team/${memberId}/publish`,{method:'POST'});
        if (!active()) return;
        if (!await loadTeam()) throw new Error('Profile saved, but the list could not be reloaded. Use Reload team.');
        if (!active()) return; fillMember(members.find(x => x.id === memberId)); message('member-status', publish ? 'Profile published. The Team page updates on refresh or within a minute.' : 'Profile saved. Drafts stay private; published profiles update on refresh or within a minute.');
      });
    });
    for(const action of ['draft','archive','restore']) $('member-'+action).addEventListener('click',()=>{
      if(!memberId || !confirm(`${action==='restore'?'Restore this profile to draft':action==='draft'?'Unpublish this profile':'Archive this profile'}?`))return;
      run('member',async active=>{await api(`/admin/team/${memberId}/${action}`,{method:'POST'});if(!active())return;await loadTeam();if(active()){fillMember(members.find(x=>x.id===memberId));message('member-status','Profile '+(action==='restore'?'restored to draft':action==='draft'?'unpublished':'archived')+'.');}});
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
        $('role-slots').replaceChildren(); $('roster-count').textContent='';
        preview('ev', ''); preview('member', ''); message('event-status'); message('member-status');
      }
    };
  }
};
