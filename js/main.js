// ===== MENÚ MÓVIL TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ===== SCROLL SUAVE / REDIRECCIÓN =====
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Solo manejar los anchors (#inicio, #experiencias, etc)
      if (!href.startsWith('/#')) return;

      e.preventDefault();

      const anchor = href.replace('/', '');

      const isHome =
        location.pathname === "/" ||
        location.pathname === "/index.html";

      if (isHome) {
          const target = document.querySelector(anchor);
          if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => { history.replaceState(null, "", "/"); }, 400);
          }
      } else {
          window.location.href = "/" + anchor;
      }

      navLinks.classList.remove('active');
  });
});

// ===== CARGA DINÁMICA DE EXPERIENCIAS =====
const activitiesGrid = document.querySelector('.activities-grid');
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjjIOH4mZiejbyg3vbOMbq0BIcwXtG63yLp_7XMZwxYTrVtg9dS-gkthcjp2Xz4DZI0AyJRd8C9aww/pub?output=csv';

// Función para convertir CSV a array de objetos
function csvToArray(csv) {
    const [headerLine, ...lines] = csv.trim().split('\n');
    const headers = headerLine.split(',');
    return lines.map(line => {
        const data = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = data[i] ? data[i].trim() : '';
        });
        return obj;
    });
}

// Obtener hoy para filtrar futuras experiencias
const today = new Date();

fetch(sheetUrl)
  .then(res => res.text())
  .then(csv => {
    const data = csvToArray(csv);

    // Filtrar solo futuras experiencias publicadas
    const upcoming = data.filter(item => 
        item.Estado.toLowerCase() === 'publicado' &&
        item.Categoria.toLowerCase() === 'experiencia' &&
        new Date(item.Fecha_inicio) >= today
    );

    // Ordenar por fecha de inicio
    upcoming.sort((a, b) => new Date(a.Fecha_inicio) - new Date(b.Fecha_inicio));

    // Generar tarjetas
    upcoming.forEach(item => {
        const fechaInicio = new Date(item.Fecha_inicio);
        const fechaFin = item.Fecha_fin ? new Date(item.Fecha_fin) : null;
        let fechaTexto = fechaFin 
            ? `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} – ${fechaFin.getDate()} ${fechaFin.toLocaleString('es', { month: 'short' })} ${fechaFin.getFullYear()}`
            : `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} ${fechaInicio.getFullYear()}`;

        const article = document.createElement('article');
        article.className = 'activity';
        article.innerHTML = `
            <img src="${item.Imagen}" alt="${item.Titulo}" class="activity-img" loading="lazy">
            <h3>${item.Titulo}</h3>
            <p>${item.Tipo}</p>
            <p>${fechaTexto}</p>
            <a href="${item.Link_leer_mas || '#'}" class="cta-button">Leer más</a>
            <a href="${item.Apuntame_URL || '#'}" class="cta-button">Apúntame</a>
        `;
        activitiesGrid.appendChild(article);
    });
  })
  .catch(err => console.error('Error cargando experiencias:', err));
