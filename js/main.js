// ============================================================
// APOI — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll shadow
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── Menú hamburguesa
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const abierto = navMobile.classList.toggle('abierto');
      hamburger.setAttribute('aria-expanded', abierto);
    });
  }

  // ── Marcar enlace activo en nav
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === pagina) a.classList.add('activo');
  });

  // ── Animación de entrada al hacer scroll
  const observador = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observador.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.animar').forEach(el => observador.observe(el));

  // ── Contador animado (para stats)
  function animarContador(el) {
    const objetivo = parseInt(el.dataset.objetivo, 10);
    const duracion = 1600;
    const inicio = performance.now();
    const actualizar = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(ease * objetivo);
      if (t < 1) requestAnimationFrame(actualizar);
      else el.textContent = objetivo;
    };
    requestAnimationFrame(actualizar);
  }
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animarContador(e.target);
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-objetivo]').forEach(el => statsObs.observe(el));

  // ── FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const pregunta = item.querySelector('.faq-pregunta');
    if (!pregunta) return;
    pregunta.addEventListener('click', () => {
      const abierto = item.classList.contains('abierto');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('abierto'));
      if (!abierto) item.classList.add('abierto');
    });
  });

  // ── Formulario de contacto
  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.querySelector('[name="nombre"]').value.trim();
      const email  = form.querySelector('[name="email"]').value.trim();
      const msg    = form.querySelector('[name="mensaje"]').value.trim();
      const aviso  = document.getElementById('form-aviso');
      if (!nombre || !email || !msg) {
        mostrarAviso(aviso, 'Por favor, completa todos los campos.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarAviso(aviso, 'Introduce un correo electrónico válido.', 'error');
        return;
      }
      mostrarAviso(aviso, '¡Mensaje enviado! Te contactaremos en menos de 24 horas.', 'ok');
      form.reset();
    });
  }

  function mostrarAviso(el, texto, tipo) {
    if (!el) return;
    el.textContent = texto;
    el.className = 'form-aviso ' + tipo;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 6000);
  }

});
