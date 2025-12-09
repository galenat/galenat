// Menú móvil toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Scroll suave y resaltar sección activa
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior:'smooth' });
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
