// ===============================
// MENÚ MÓVIL TOGGLE
// ===============================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ===============================
// SCROLL SUAVE PARA ANCHORS
// ===============================
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

// ===============================
// CALENDARIO Y PANEL ADMIN
// ===============================

// Contraseña simple (solo para ti)
const ADMIN_PASSWORD = "galenat2026"; // cámbiala si quieres

function loginAdmin() {
  const pw = document.getElementById('admin-password').value;
  if(pw === ADMIN_PASSWORD){
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    renderEventsList();
  } else {
    document.getElementById('login-msg').textContent = "Contraseña incorrecta";
  }
}

// Eventos iniciales
let events = [
  { date: '2026-01-17', title: 'Río Mandeo', type: 'Senderismo', location: 'A Coruña', link:'#', register:'#' },
  { date: '2026-01-30', title: 'Sierra del Caurel', type: 'Montañismo', location: 'Lugo', link:'#', register:'#' },
  { date: '2026-02-21', title: 'Muiños do Batán', type: 'Senderismo', location: 'A Coruña', link:'#', register:'#' }
];

const calendarEl = document.getElementById('calendar');

function generateCalendar(year, month) {
  if(!calendarEl) return;
  calendarEl.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month+1,0).getDate();

  for(let i=0;i<firstDay;i++) {
    const empty = document.createElement('div');
    calendarEl.appendChild(empty);
  }

  for(let d=1; d<=lastDate; d++){
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    dayEl.innerHTML = `<span class="date-number">${d}</span>`;
    const dayStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEvents = events.filter(e=>e.date===dayStr);
    if(dayEvents.length>0){
      dayEl.classList.add('has-event');
      dayEl.addEventListener('click', ()=>{
        showPopup(dayEl, dayEvents);
      });
    }
    calendarEl.appendChild(dayEl);
  }
}

function showPopup(dayEl, dayEvents){
  document.querySelectorAll('.popup').forEach(p=>p.remove());
  dayEvents.forEach(ev=>{
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <h3>${ev.title}</h3>
      <p><strong>Actividad:</strong> ${ev.type}</p>
      <p><strong>Lugar:</strong> ${ev.location}</p>
      <p><strong>Fecha:</strong> ${ev.date}</p>
      <a href="${ev.link}" target="_blank">Leer más</a>
      <a href="${ev.register}" target="_blank">Apúntame</a>
    `;
    dayEl.appendChild(popup);
    popup.style.display='block';
  });
}

// Inicializa calendario con el mes actual
const today = new Date();
generateCalendar(today.getFullYear(), today.getMonth());

// ===============================
// FORM ADMIN
// ===============================
const eventForm = document.getElementById('event-form');
if(eventForm){
  eventForm.addEventListener('submit', e=>{
    e.preventDefault();
    const newEvent = {
      date: document.getElementById('event-date').value,
      title: document.getElementById('event-title').value,
      type: document.getElementById('event-type').value,
      location: document.getElementById('event-location').value,
      link: document.getElementById('event-link').value,
      register: document.getElementById('event-register').value
    };
    events.push(newEvent);
    generateCalendar(today.getFullYear(), today.getMonth());
    renderEventsList();
    e.target.reset();
  });
}

function renderEventsList(){
  const list = document.getElementById('event-list');
  if(!list) return;
  list.innerHTML = '<h3>Eventos actuales:</h3>';
  events.forEach((ev,i)=>{
    const div = document.createElement('div');
    div.innerHTML = `${ev.date} - ${ev.title} <button onclick="deleteEvent(${i})">Eliminar</button>`;
    list.appendChild(div);
  });
}

function deleteEvent(i){
  events.splice(i,1);
  generateCalendar(today.getFullYear(), today.getMonth());
  renderEventsList();
}
