// Nav scroll state
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.style.display = 'none');
  });

  // Reveal on scroll
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  // Terminal typing animation
  const terminalBody = document.getElementById('terminalBody');
  const lines = [
    { prompt: true, text: 'npm run build --project="cliente"' },
    { text: 'Instalando dependencias' + '.'.repeat(3) },
    { ok: true, text: 'Dependencias listas (1.2s)' },
    { text: 'Compilando módulos' + '.'.repeat(3) },
    { ok: true, text: 'Build completado sin errores' },
    { ok: true, text: 'Producto listo para producción ✓' },
  ];

  function typeLine(el, text, speed) {
    return new Promise(resolve => {
      let i = 0;
      const span = document.createElement('span');
      el.appendChild(span);
      const interval = setInterval(() => {
        span.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve(span);
        }
      }, speed);
    });
  }

  async function runTerminal() {
    if (reduceMotion) {
      terminalBody.innerHTML = lines.map(l => {
        if (l.prompt) return `<div><span class="prompt">$ </span>${l.text}</div>`;
        if (l.ok) return `<div class="ok">✓ ${l.text}</div>`;
        return `<div>${l.text}</div>`;
      }).join('') + '<span class="cursor"></span>';
      return;
    }
    for (const line of lines) {
      const row = document.createElement('div');
      if (line.prompt) {
        const p = document.createElement('span');
        p.className = 'prompt';
        p.textContent = '$ ';
        row.appendChild(p);
      }
      if (line.ok) row.classList.add('ok');
      terminalBody.appendChild(row);
      await typeLine(row, (line.ok ? '✓ ' : '') + line.text, line.prompt ? 32 : 14);
      await new Promise(r => setTimeout(r, 220));
    }
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    terminalBody.appendChild(cursor);
  }
  runTerminal();

  // Contact form (no backend — demo confirmation)
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMsg.classList.add('show');
    form.reset();
  });
