// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Publicaciones (datos en assets/js/publicaciones.js)
(() => {
  const data = window.PUBLICACIONES;
  if (!data) return;
  // Apellidos de los miembros del grupo, para destacarlos en la autoría
  const miembros = [
    /López[\s-]Noguero, F\./g, /Gallardo[\s-]López, J\. ?A\./g, /Gallardo, A\./g,
    /Morón[\s-]Marchena, J\. ?A\./g, /García[\s-]Lázaro, I\./g, /Muñoz[\s-]Villaraviz, D\./g,
    /Yunta Ibarrondo, M\. ?Á\./g, /Delgado Baena, A\./g
  ];
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const autores = a => miembros.reduce((s, re) => s.replace(re, m => `<strong>${m}</strong>`), esc(a));

  document.querySelectorAll('[data-pubs]').forEach(box => {
    const tipo = box.dataset.pubs;
    const lista = [...(data[tipo] || [])].sort((x, y) => y.y - x.y);
    const tab = document.querySelector(`[aria-controls="pub-${tipo}"]`);
    if (tab) tab.insertAdjacentHTML('beforeend', ` <span class="count">${lista.length}</span>`);
    if (!lista.length) { box.innerHTML = '<p class="pending">Listado pendiente de completar.</p>'; return; }

    let html = '', anio = null;
    lista.forEach(p => {
      if (p.y !== anio) {
        if (anio !== null) html += '</ol>';
        anio = p.y;
        html += `<h3 class="pub-year">${anio}</h3><ol class="pubs">`;
      }
      const enlace = p.u ? ` <a class="pub-link" href="${esc(p.u)}" target="_blank" rel="noopener">${p.u.includes('doi.org') ? 'DOI' : 'Acceso abierto'}</a>` : '';
      html += `<li><span class="pub-authors">${autores(p.a)}</span> (${p.y}). <span class="pub-title">${esc(p.t)}</span>. <span class="pub-source">${esc(p.f)}</span>.${enlace}</li>`;
    });
    box.innerHTML = html + '</ol>';
  });
})();

// Fotos del equipo: assets/img/equipo/<data-foto>.jpg (si no existe, se quedan las iniciales)
document.querySelectorAll('.avatar[data-foto]').forEach(av => {
  const img = new Image();
  img.alt = '';
  img.decoding = 'async';
  img.onload = () => { av.textContent = ''; av.appendChild(img); };
  img.src = `assets/img/equipo/${av.dataset.foto}.jpg`;
});

// Pestañas (publicaciones)
document.querySelectorAll('[data-tabs]').forEach(tabs => {
  const buttons = [...tabs.querySelectorAll('[role="tab"]')];
  const select = btn => {
    buttons.forEach(b => {
      const on = b === btn;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
  };
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => select(b));
    b.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { const n = buttons[(i + d + buttons.length) % buttons.length]; select(n); n.focus(); }
    });
  });
});

// Resaltar la sección activa en el menú
const navLinks = nav ? [...nav.querySelectorAll('a')] : [];
const groupIds = ['grupo', 'presentacion', 'lineas', 'equipo', 'redes'];
if ('IntersectionObserver' in window && navLinks.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = groupIds.includes(entry.target.id) ? 'grupo' : entry.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => obs.observe(s));
}

// Año en el pie
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
