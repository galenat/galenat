// Menú móvil toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Scroll suave y resaltar sección activa (solo para enlaces internos)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Si es una URL absoluta (https://galenat.com/#...), dejamos que navegue
      if (href.startsWith('http')) {
          return;
      }

      // Si es un anchor interno (#inicio, #nosotros, etc), evitar navegación normal
      e.preventDefault();

      // Hacer scroll suave a la sección
      const target = document.querySelector(href);
      if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
      }

      // Cerrar menú móvil
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
