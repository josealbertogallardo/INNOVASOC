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
