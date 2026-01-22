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
      if (!href.startsWith('/#')) return;

      e.preventDefault();
      const anchor = href.replace('/', '');
      const isHome = location.pathname === "/" || location.pathname === "/index.html";

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

// ===== CARGA DINÁMICA DE EXPERIENCIAS Y BLOG =====
const activitiesGrid = document.querySelector('.activities-grid'); // contenedor Experiencias
const blogGrid = document.querySelector('.blog-grid');             // contenedor Blog
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjjIOH4mZiejbyg3vbOMbq0BIcwXtG63yLp_7XMZwxYTrVtg9dS-gkthcjp2Xz4DZI0AyJRd8C9aww/pub?output=csv';

// Convierte CSV a array de objetos, soportando tab, coma o punto y coma
function csvToArray(csv) {
    const lines = csv.trim().split('\n').filter(l => l.trim() !== '');
    const sep = lines[0].includes('\t') ? '\t' : (lines[0].includes(';') ? ';' : ',');
    const headers = lines[0].split(sep).map(h => h.trim());

    return lines.slice(1).map(line => {
        const data = line.split(sep).map(v => v.replace(/^"|"$/g, '').trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = data[i] || '');
        return obj;
    });
}

fetch(sheetUrl)
  .then(res => res.text())
  .then(csv => {
    const data = csvToArray(csv);

    // Filtrar solo elementos publicados
    const published = data.filter(item => item.Estado.toLowerCase() === 'publicado');

    // Ordenar por fecha de inicio
    published.sort((a, b) => new Date(a.Fecha_inicio) - new Date(b.Fecha_inicio));

    published.forEach(item => {
        const fechaInicio = new Date(item.Fecha_inicio);
        const fechaFin = item.Fecha_fin ? new Date(item.Fecha_fin) : null;
        let fechaTexto = fechaFin 
            ? `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} – ${fechaFin.getDate()} ${fechaFin.toLocaleString('es', { month: 'short' })} ${fechaFin.getFullYear()}`
            : `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} ${fechaInicio.getFullYear()}`;

        const article = document.createElement('article');
        article.className = 'activity';
        article.innerHTML = `
            <img src="${item.Imagen}" alt="${item.Texto_corto}" class="activity-img" loading="lazy">
            <h3>${item.Actividad}</h3>
            <p>${item.Zona} | ${item.Lugar}</p>
            <p>${fechaTexto}</p>
            <a href="${item.Link_leer_mas || '#'}" class="cta-button">Leer más</a>
            <a href="${item.Apuntame_URL || '#'}" class="cta-button">Apúntame</a>
        `;

        // Añadir al contenedor correspondiente según categoría
        if (item.Categoria.toLowerCase() === 'experiencia') {
            activitiesGrid.appendChild(article);
        } else if (item.Categoria.toLowerCase() === 'blog') {
            blogGrid.appendChild(article);
        }
    });
  })
  .catch(err => console.error('Error cargando experiencias:', err));
