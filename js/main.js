// Menú móvil toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Scroll suave si estás en el home, redirección si estás fuera
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Solo manejar los anchors (#inicio, #experiencias, etc)
      if (!href.startsWith('/#')) return;

      e.preventDefault(); // evitar navegación normal

      const anchor = href.replace('/', ''); // "/#experiencias" → "#experiencias"

      // Detectar si estamos en el home
      const isHome =
        location.pathname === "/" ||
        location.pathname === "/index.html";

      if (isHome) {
          // Scroll suave
          const target = document.querySelector(anchor);
          if (target) {
              target.scrollIntoView({ behavior: 'smooth' });

              // 👇 Ocultar hash después del scroll
              setTimeout(() => {
                  history.replaceState(null, "", "/");
              }, 400);
          }
      } else {
          // Redirige al home con el anchor pero sin mostrar index.html
          window.location.href = "/" + anchor;
      }

      // Cerrar menú móvil en móvil
      navLinks.classList.remove('active');
  });
});

// Formulario (solo efecto)
const form = document.getElementById('leadForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  document.querySelector('.confirmation').style.display = 'block';
  form.reset();
});
