// ===== BARRA MENÚ (Desplegable) =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Abrir / cerrar con hamburguesa
navToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // evita que se cierre al instante
  navLinks.classList.toggle('active');
});

// Cerrar al clicar enlace
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Cerrar al clicar fuera
document.addEventListener('click', (e) => {
  if (
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navLinks.classList.remove('active');
  }
});

// ===== CARGA DINÁMICA DE CONTENIDO =====

// Experiencias
let experienciasGrid = document.querySelector('.experiencias-grid');
if (!experienciasGrid) {
  const experienciasSection = document.createElement('section');
  experienciasSection.id = 'experiencias';
  experienciasSection.className = 'seccion';
  experienciasSection.innerHTML = `<h2>Próximas experiencias</h2><div class="experiencias-grid"></div>`;
  document.body.appendChild(experienciasSection);
  experienciasGrid = document.querySelector('.experiencias-grid');
}

// Blog
let blogGrid = document.querySelector('.blog-grid');
if (!blogGrid) {
  const blogSection = document.createElement('section');
  blogSection.id = 'blog';
  blogSection.className = 'seccion';
  blogSection.innerHTML = `<h2>Blog</h2><div class="blog-grid"></div>`;
  experienciasGrid.parentNode.insertAdjacentElement('afterend', blogSection);
  blogGrid = document.querySelector('.blog-grid');
}

// Nosotros
let nosotrosGrid = document.querySelector('.nosotros-grid');
if (!nosotrosGrid) {
  const nosotrosSection = document.createElement('section');
  nosotrosSection.id = 'nosotros';
  nosotrosSection.className = 'seccion';
  nosotrosSection.innerHTML = `<h2>Nosotros</h2><div class="nosotros-grid"></div>`;
  blogGrid.parentNode.insertAdjacentElement('afterend', nosotrosSection);
  nosotrosGrid = document.querySelector('.nosotros-grid');
}

// URL del CSV
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjjIOH4mZiejbyg3vbOMbq0BIcwXtG63yLp_7XMZwxYTrVtg9dS-gkthcjp2Xz4DZI0AyJRd8C9aww/pub?output=csv';

// ===== FUNCIONES AUXILIARES =====

function csvToArray(csv, delimiter = ",") {
  const lines = csv.split("\n").filter(line => line.trim() !== "");
  const headers = lines[0].split(delimiter).map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(delimiter);
    const obj = {};

    headers.forEach((header, i) => {
      obj[header] = values[i] ? values[i].trim() : "";
    });

    return obj;
  });
}

function driveLinkToDirect(url) {
  if (!url) return "";

  const match = url.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return url;
}

// Fetch y creación de tarjetas
fetch(sheetUrl)
  .then(res => res.text())
  .then(csv => {
    const data = csvToArray(csv);

    // ==============================
    // EXPERIENCIAS
    // ==============================
    const experiencias = data
      .filter(item => item.Estado?.toLowerCase() === 'publicado' && item.Categoria?.toLowerCase() === 'experiencia')
      .sort((a, b) => new Date(a.Fecha_inicio) - new Date(b.Fecha_inicio));

    experiencias.forEach(item => {
      const fechaInicio = new Date(item.Fecha_inicio);
      const fechaFin = item.Fecha_fin ? new Date(item.Fecha_fin) : null;
      const fechaTexto = fechaFin
        ? `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} – 
           ${fechaFin.getDate()} ${fechaFin.toLocaleString('es', { month: 'short' })} ${fechaFin.getFullYear()}`
        : `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} ${fechaInicio.getFullYear()}`;

      const article = document.createElement('article');
      article.className = 'activity';
      if (item.Imagen) {
        const imagenDirecta = driveLinkToDirect(item.Imagen);
        article.style.backgroundImage = `url('${imagenDirecta}')`;
      }

      article.innerHTML = `
        <div class="card-text">
          <h3>${item.Actividad}</h3>
          <p>${item.Zona || ''} ${item.Lugar ? '| ' + item.Lugar : ''}</p>
          <p>${fechaTexto}</p>
          <a href="${item.Link_leer_mas || '#'}" class="cta-button small">Leer más</a>
          <a href="${item.Apuntame_URL || '#'}" class="cta-button small">Apúntame</a>
        </div>
      `;

      experienciasGrid.appendChild(article);
    });

    // ==============================
    // NOSOTROS
    // ==============================
    const nosotros = data
      .filter(item => item.Estado?.toLowerCase() === 'publicado' && item.Categoria?.toLowerCase() === 'nosotros')
      .sort((a, b) => new Date(b.Fecha_inicio) - new Date(a.Fecha_inicio));

    nosotros.forEach(item => {
      const fechaInicio = new Date(item.Fecha_inicio);
      const fechaTexto = `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} ${fechaInicio.getFullYear()}`;

      const article = document.createElement('article');
      article.className = 'activity';

      // Contenido de la tarjeta
      article.innerHTML = `
        <div class="card-text">
          ${item.Imagen ? `<img src="${driveLinkToDirect(item.Imagen)}" alt="${item.Texto_corto}" class="nosotros-img">` : ''}
          <h3>${item.Actividad}</h3>
          <p>${item.Zona}</p>
        </div>
      `;

      nosotrosGrid.appendChild(article);
    });

    // ==============================
    // BLOG
    // ==============================
    const blogs = data
      .filter(item => item.Estado?.toLowerCase() === 'publicado' && item.Categoria?.toLowerCase() === 'blog')
      .sort((a, b) => new Date(b.Fecha_inicio) - new Date(a.Fecha_inicio));

    blogs.forEach(item => {
      const fechaInicio = new Date(item.Fecha_inicio);
      const fechaTexto = `${fechaInicio.getDate()} ${fechaInicio.toLocaleString('es', { month: 'short' })} ${fechaInicio.getFullYear()}`;

      const article = document.createElement('article');
      article.className = 'activity';
      if (item.Imagen) {
        const imagenDirecta = driveLinkToDirect(item.Imagen);
        article.style.backgroundImage = `url('${imagenDirecta}')`;
      }

      article.innerHTML = `
        <div class="card-text">
          <h3>${item.Actividad}</h3>
          <p>${item.Zona || ''} ${item.Lugar ? '| ' + item.Lugar : ''}</p>
          <p>${fechaTexto}</p>
          <a href="${item.Link_leer_mas || '#'}" class="cta-button small">Leer más</a>
        </div>
      `;

      blogGrid.appendChild(article);
    });

  })
  .catch(err => console.error('Error cargando contenido:', err));
