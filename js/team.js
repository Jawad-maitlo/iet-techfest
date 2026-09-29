(() => {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  let previous = '';
  function render(members) {
    const signature = JSON.stringify(members); if (signature === previous) return; previous = signature;
    grid.replaceChildren();
    grid.className='organization';
    if (!members.length) { const p=document.createElement('p'); p.textContent='Team details will be announced soon.'; grid.append(p); }
    const containers=new Map();
    for(const group of [...Organization,{id:'unassigned',label:'Organizing Team',note:'Our existing organizers'}]) {
      if(!members.some(x=>(x.group || 'unassigned')===group.id))continue;
      const section=document.createElement('section');section.className='organization-group';section.dataset.group=group.id;
      const title=document.createElement('h2');title.textContent=group.label;section.append(title);
      const note=document.createElement('p');note.className='organization-note';note.textContent=group.note || `Planning / contributor capacity: ${group.capacity}. This is separate from the official execution roster.`;section.append(note);
      const list=document.createElement('div');list.className='team-grid';section.append(list);grid.append(section);containers.set(group.id,list);
    }
    const slotOrder=member=>{const roles=Organization.find(g=>g.id===member.group)?.roles || [];const index=roles.indexOf(member.slot);return index<0?roles.length:index;};
    for (const member of [...members].sort((a,b)=>slotOrder(a)-slotOrder(b) || a.order-b.order)) {
      const card=document.createElement('article'); card.className='team-card';
      const avatar=document.createElement('div'); avatar.className='team-avatar';
      const initials=member.name.split(/\s+/).map(x=>x[0]).slice(0,2).join(''); avatar.textContent=initials;
      const src=/^images\/people\/[a-z0-9_.-]+$/i.test(member.photo || '') ? member.photo : ContentAPI.imageUrl(member.photo);
      if(src){ const img=document.createElement('img');img.src=src;img.alt=member.name;img.loading='lazy';img.width=112;img.height=112;img.onerror=()=>{avatar.textContent=initials;};avatar.replaceChildren(img); }
      card.append(avatar);
      for(const [tag,cls,value] of [['h3','team-name',member.name],['div','team-role',member.role],['p','team-desc',member.description || member.desc || '']]) { const node=document.createElement(tag);node.className=cls;node.textContent=value;card.append(node); }
      if(member.secondary){const note=document.createElement('p');note.className='team-secondary';note.textContent='Also contributing: '+member.secondary;card.append(note);}
      if(member.linkedin) try {
        const url=new URL(member.linkedin);
        if(url.protocol==='https:' && ['www.linkedin.com','linkedin.com'].includes(url.hostname) && url.pathname.startsWith('/in/')){
          const a=document.createElement('a');a.className='team-linkedin';a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',member.name+' on LinkedIn');
          const icon=document.createElement('img');icon.src='images/logos/linkedinLogo.png';icon.alt='';icon.width=20;icon.height=20;icon.className='team-linkedin-icon';a.append(icon,document.createTextNode('LinkedIn ↗'));card.append(a);
        }
      } catch {}
      containers.get(member.group || 'unassigned')?.append(card);
    }
  }
  let loading=false, hasData=false;
  const cacheKey='interconnect-team-v2:'+(window.APP_CONFIG?.apiBaseUrl || 'local');
  if(!ContentAPI.configured) {render(SITE_DATA.team);return;}
  try { const cached=JSON.parse(localStorage.getItem(cacheKey));if(Array.isArray(cached)){render(cached);hasData=true;} } catch {}
  async function refresh(){
    if(loading)return;loading=true;
    try{const data=await ContentAPI.request('/team');render(data.items);hasData=true;try{localStorage.setItem(cacheKey,JSON.stringify(data.items));}catch{}}
    catch{if(!hasData){grid.textContent='Team details are temporarily unavailable. Please try again shortly.';}}
    finally{loading=false;}
  }
  if(!hasData)grid.textContent='Loading our team…';
  refresh();setInterval(()=>{if(!document.hidden)refresh();},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
