(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
  });

  let activeFilter = 'all';
  const search = document.getElementById('work-search');
  const cards = [...document.querySelectorAll('.work-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  function filterWork() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'all' || card.dataset.category.split(' ').includes(activeFilter);
      const text = (card.dataset.search + ' ' + card.textContent).toLowerCase();
      const match = categoryMatch && (!query || text.includes(query));
      card.hidden = !match; if (match) visible++;
    });
    document.getElementById('no-results').hidden = visible > 0;
    document.getElementById('work-count').textContent = `${visible} ${visible === 1 ? 'project' : 'projects'} shown`;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(other => {
      const active = other === button; other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));
    }); filterWork();
  }));
  search.addEventListener('input',filterWork);filterWork();

  const projectDialog = document.getElementById('project-dialog');
  const imageDialog = document.getElementById('image-dialog');
  const detail = document.getElementById('project-detail');
  const esc = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => {
    try {const url = new URL(value,location.href);return ['https:','http:'].includes(url.protocol) ? esc(value) : '#';}catch{return '#';}
  };
  const syncScroll = () => document.body.classList.toggle('modal-open',projectDialog.open || imageDialog.open);
  function openImage(src,caption) {
    const img = document.getElementById('expanded-image');img.src=src;img.alt=caption;
    document.getElementById('image-caption').textContent=caption;
    imageDialog.showModal();syncScroll();
  }
  function openProject(id) {
    const work = window.SNEHA_WORK[id]; if (!work) return;
    detail.innerHTML = `<p class="detail-eyebrow">${esc(work.label)}</p><h2 id="project-dialog-title" class="detail-title">${esc(work.title)}</h2><div class="detail-meta"><div><span>ORGANIZATION</span><strong>${esc(work.company)}</strong></div><div><span>MY ROLE</span><strong>${esc(work.role)}</strong></div><div><span>PERIOD</span><strong>${esc(work.period)}</strong></div></div><p class="detail-intro">${esc(work.intro)}</p>`+
      work.sections.map(section => `<section class="detail-section"><h3>${esc(section.title)}</h3>${section.text ? `<p>${esc(section.text)}</p>` : ''}${section.bullets ? `<ul>${section.bullets.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>` : ''}</section>`).join('')+
      (work.images.length ? `<div class="detail-images">${work.images.map(img=>`<figure class="detail-proof"><button type="button" data-image="assets/images/${esc(img.file)}.webp" data-caption="${esc(img.caption)}" aria-label="Enlarge: ${esc(img.caption)}"><img src="assets/images/${esc(img.file)}.webp" alt="${esc(img.caption)}" loading="lazy"></button><figcaption>${esc(img.caption)} <span aria-hidden="true">↗</span></figcaption></figure>`).join('')}</div>`:'')+
      (work.links.length ? `<div class="detail-links">${work.links.map(link=>`<a class="small-outline-button" href="${safeUrl(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join('')}</div>`:'')+
      (work.note ? `<p class="detail-note">${esc(work.note)}</p>`:'');
    projectDialog.showModal();projectDialog.scrollTop=0;syncScroll();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open]');
    if (trigger) openProject(trigger.dataset.open);
    const proof = event.target.closest('button[data-image]');
    if (proof) openImage(proof.dataset.image,proof.dataset.caption);
  });
  [projectDialog,imageDialog].forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',syncScroll);
    dialog.addEventListener('click',event=>{
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  const copy = document.getElementById('copy-email');
  copy.addEventListener('click',async()=>{
    const email = 'sneha19murali@gmail.com';
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      document.getElementById('copy-status').textContent='Copied to clipboard';
    } catch {
      const range=document.createRange();range.selectNodeContents(document.querySelector('.contact-email'));
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      document.getElementById('copy-status').textContent='Select and copy the email above';
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
