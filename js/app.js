// =========================================================================
// MENTORÍAS IAEV - APP.JS (VERSIÓN CORREGIDA - DISEÑO INTACTO)
// =========================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiF249Hc2oId_ouLgMH9QkAl8PPH6HHp0",
  authDomain: "mentorias-iaev-c9815.firebaseapp.com",
  projectId: "mentorias-iaev-c9815",
  storageBucket: "mentorias-iaev-c9815.firebasestorage.app",
  messagingSenderId: "535210347796",
  appId: "1:535210347796:web:353db2779c7d58c0380601",
  measurementId: "G-HGT9XLCK6G"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const state = {
  currentUser: null,
  selectedFile: null,
  students: [],
  calendar: {
    year: 2026,
    month: 6,
    sessions: {
      "2026-07-15": ["Sesión: Luis Rodríguez - Tutoría"]
    }
  }
};

// =========================================================================
// 1. CONTROL DE LOGIN Y VISIBILIDAD USANDO SOLO TUS CLASES (SIN ROMPER DISEÑO)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('appContainer');
  const loginView = document.getElementById('loginView');

  if (appContainer) appContainer.classList.add('hidden');
  if (loginView) loginView.classList.remove('hidden');

  // Forzamos cierre de sesión inicial para que no entre con cookies guardadas
  signOut(auth).catch(() => {});

  // Limpiar campos de texto al cargar
  const emailInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';

  initLogin();
  initNavigation();
  initExcelHandling();
  initSearch();
  initCalendar();
});

function initLogin() {
  const loginForm = document.getElementById('loginForm');
  const loginView = document.getElementById('loginView');
  const appContainer = document.getElementById('appContainer');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const emailInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      // Validación estricta: No permite avanzar si están vacíos o incompletos
      if (!email || !email.includes('@') || !password) {
        alert("Acceso denegado: Debes ingresar un correo y contraseña válidos.");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error Auth:", error);
        alert("Acceso denegado: " + getAuthErrorMessage(error.code));
      }
    });
  }

  onAuthStateChanged(auth, async (user) => {
    const isLoginVisible = loginView && !loginView.classList.contains('hidden');

    if (user && isLoginVisible) {
      state.currentUser = user;
      
      if (loginView) loginView.classList.add('hidden');
      if (appContainer) appContainer.classList.remove('hidden');

      let nombreCompleto = user.displayName;
      if (!nombreCompleto) {
        let base = user.email.split('@')[0];
        nombreCompleto = base.charAt(0).toUpperCase() + base.slice(1).replace('.', ' ');
      }

      let iniciales = nombreCompleto
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      const userNameElem = document.querySelector('.user-name');
      if (userNameElem) userNameElem.textContent = nombreCompleto;

      const avatarCircle = document.querySelector('.user-profile-widget .avatar-circle');
      if (avatarCircle) avatarCircle.textContent = iniciales;

      const profileNameElem = document.querySelector('.profile-name');
      if (profileNameElem) profileNameElem.textContent = nombreCompleto;

      const profileEmailElem = document.querySelector('.profile-email');
      if (profileEmailElem) profileEmailElem.textContent = user.email;

      const profileAvatarLarge = document.querySelector('.profile-avatar-large');
      if (profileAvatarLarge) profileAvatarLarge.textContent = iniciales;

      await cargarEstudiantesDesdeFirestore();
      updateAllViews();
    }
  });
}

function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email': 
      return 'El formato del correo electrónico no es válido.';
    case 'auth/user-not-found': 
      return 'No existe una cuenta registrada con este correo.';
    case 'auth/wrong-password': 
      return 'Contraseña incorrecta.';
    case 'auth/invalid-credential': 
      return 'Correo o contraseña incorrectos. Verifica tus datos.';
    case 'auth/too-many-requests': 
      return 'Demasiados intentos fallidos. Inténtalo más tarde.';
    default: 
      return 'No se pudo iniciar sesión. Revisa tus credenciales.';
  }
}

window.logoutUser = () => {
  signOut(auth).then(() => {
    state.currentUser = null;
    document.getElementById('appContainer')?.classList.add('hidden');
    document.getElementById('loginView')?.classList.remove('hidden');

    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
  });
};

// =========================================================================
// 2. NAVEGACIÓN PROTEGIDA
// =========================================================================
function initNavigation() {
  const navButtons = document.querySelectorAll('.sidebar-menu .nav-btn');
  const views = document.querySelectorAll('.content-area .view-section');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!state.currentUser) {
        alert("Acceso denegado. Debes iniciar sesión.");
        return;
      }

      const targetViewId = button.getAttribute('data-target');
      if (!targetViewId) return;

      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      views.forEach(view => view.classList.add('hidden'));
      const targetView = document.getElementById(targetViewId);
      if (targetView) targetView.classList.remove('hidden');
    });
  });

  const btnBack = document.getElementById('btnBackToStudents');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      document.getElementById('detalleEstudianteView')?.classList.add('hidden');
      document.getElementById('estudiantesView')?.classList.remove('hidden');
    });
  }

  const userProfileBtn = document.getElementById('userProfileBtn');
  if (userProfileBtn) {
    userProfileBtn.addEventListener('click', () => {
      if (!state.currentUser) return;
      views.forEach(v => v.classList.add('hidden'));
      navButtons.forEach(b => b.classList.remove('active'));
      document.getElementById('perfilView')?.classList.remove('hidden');
    });
  }
}

// =========================================================================
// 3. LECTURA INTELIGENTE DE EXCEL
// =========================================================================
function initExcelHandling() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const selectedFileName = document.getElementById('selectedFileName');
  const btnProcessFile = document.getElementById('btnProcessFile');
  const btnExportFile = document.getElementById('btnExportFile');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        state.selectedFile = e.target.files[0];
        if (selectedFileName) {
          selectedFileName.innerHTML = `<i class="fa-regular fa-file"></i> ${state.selectedFile.name}`;
        }
      }
    });
  }

  if (btnProcessFile) {
    btnProcessFile.addEventListener('click', () => {
      if (!state.selectedFile) {
        alert("Por favor selecciona o arrastra un archivo Excel primero.");
        return;
      }
      processExcelFile(state.selectedFile);
    });
  }

  if (btnExportFile) {
    btnExportFile.addEventListener('click', exportToExcel);
  }
}

function processExcelFile(file) {
  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" });

      if (!rows || rows.length === 0) {
        alert("El archivo Excel está vacío.");
        return;
      }

      let estudiantesValidos = [];

      const PALABRAS_PROHIBIDAS = [
        'FORMATO', 'SEGUIMIENTO', 'USO MULTIPLE', 'INFORME', 'CUATRIMESTRAL',
        'ENTREVISTA', 'CALIFICACIONES', 'MATRICULA', 'MATRÍCULA', 'NOMBRE',
        'ESTUDIANTE', 'ALUMNO', 'CARRERA', 'INSTITUTO', 'UNIVERSIDAD',
        'TECNOLOGICO', 'TECNOLÓGICO', 'REPORTE', 'LISTA', 'TUTOR', 'MENTOR',
        'PERIODO', 'PERÍODO', 'GRUPO', 'GRADO', 'OBSERVACIONES', 'FECHA',
        'FIRMA', 'NUMERO', 'NÚMERO', 'NUM', 'NÚM', 'NO.', 'DIRECCION',
        'COORDINACION', 'EVALUACION', 'CUATRIMESTRE'
      ];

      rows.forEach((row) => {
        if (!Array.isArray(row) || row.length === 0) return;

        let cleanCells = row.map(cell => String(cell || "").trim().replace(/\.0$/, ''));

        let matriculaEncontrada = "";
        let nombreEncontrado = "";

        for (let cellVal of cleanCells) {
          if (!cellVal) continue;
          let upper = cellVal.toUpperCase();
          if (PALABRAS_PROHIBIDAS.some(word => upper.includes(word))) continue;

          let numOnly = cellVal.replace(/[\s-]/g, '');
          if (/^\d{5,12}$/.test(numOnly)) {
            matriculaEncontrada = numOnly;
            break;
          }
        }

        if (matriculaEncontrada) {
          for (let cellVal of cleanCells) {
            if (!cellVal || cellVal === matriculaEncontrada) continue;
            let upper = cellVal.toUpperCase();
            if (PALABRAS_PROHIBIDAS.some(word => upper.includes(word))) continue;

            if (/[A-ZÁÉÍÓÚÑ]{3,}/i.test(cellVal) && !/^\d+$/.test(cellVal)) {
              if (cellVal.length >= 4) {
                nombreEncontrado = cellVal;
                break;
              }
            }
          }
        }

        if (matriculaEncontrada && nombreEncontrado) {
          let textoFila = cleanCells.join(" ").toLowerCase();
          let nivelRiesgo = "Bueno";

          if (textoFila.includes("reprobar") || textoFila.includes("critico") || textoFila.includes("crítico") || textoFila.includes("alto")) {
            nivelRiesgo = "Critico";
          } else if (textoFila.includes("medio") || textoFila.includes("moderado") || textoFila.includes("riesgo")) {
            nivelRiesgo = "Medio";
          }

          estudiantesValidos.push({
            id: estudiantesValidos.length + 1,
            nombre: nombreEncontrado,
            matricula: matriculaEncontrada,
            riesgo: nivelRiesgo,
            mentor: "Carlos López",
            carrera: "Desarrollo de Software Multiplataforma",
            grado: "Cuatrimestre Actual",
            estado: "Activo"
          });
        }
      });

      if (estudiantesValidos.length === 0) {
        alert("No se pudieron detectar registros de estudiantes en el Excel.");
        return;
      }

      const mapUnicos = new Map();
      estudiantesValidos.forEach(est => mapUnicos.set(est.matricula, est));
      state.students = Array.from(mapUnicos.values());

      try {
        for (let est of state.students) {
          await setDoc(doc(db, "estudiantes", est.matricula), {
            nombre: est.nombre,
            matricula: est.matricula,
            riesgo: est.riesgo,
            mentor: est.mentor,
            carrera: est.carrera,
            grado: est.grado,
            estado: est.estado,
            actualizado: new Date()
          });
        }
      } catch (fbError) {
        console.error("Error al guardar en Firestore:", fbError);
      }

      updateAllViews();
      alert(`¡Éxito! Se importaron ${state.students.length} estudiantes correctamente.`);

    } catch (error) {
      console.error("Error al procesar Excel:", error);
      alert("Error al leer el archivo Excel.");
    }
  };

  reader.readAsArrayBuffer(file);
}

async function cargarEstudiantesDesdeFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "estudiantes"));
    if (!querySnapshot.empty) {
      let remoteStudents = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        remoteStudents.push({
          id: remoteStudents.length + 1,
          nombre: data.nombre,
          matricula: data.matricula,
          riesgo: data.riesgo || "Bueno",
          mentor: data.mentor || "Sin asignar",
          carrera: data.carrera || "General",
          grado: data.grado || "N/A",
          estado: data.estado || "Activo"
        });
      });
      if (remoteStudents.length > 0) {
        state.students = remoteStudents;
      }
    }
  } catch (error) {
    console.error("Error al cargar Firestore:", error);
  }
}

function exportToExcel() {
  if (state.students.length === 0) {
    alert("No hay registros para exportar.");
    return;
  }

  const exportData = state.students.map(s => ({
    "Estado": s.estado,
    "Nombre": s.nombre,
    "Matrícula": s.matricula,
    "Riesgo": s.riesgo,
    "Mentor": s.mentor,
    "Carrera": s.carrera,
    "Grado": s.grado
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
  XLSX.writeFile(workbook, `Estudiantes_IAEV_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// =========================================================================
// 4. RENDERIZADO DE TABLAS Y MÉTRICAS
// =========================================================================
function updateAllViews() {
  calculateMetrics();
  renderPanelTable();
  renderEstudiantesTable();
  renderRiesgoTable();
}

function calculateMetrics() {
  const totalMentorias = state.students.length;
  const medioCount = state.students.filter(s => s.riesgo === 'Medio').length;
  const criticoCount = state.students.filter(s => s.riesgo === 'Critico').length;
  const totalRiesgo = medioCount + criticoCount;

  const elemTotal = document.getElementById('metricTotalMentorias');
  if (elemTotal) elemTotal.textContent = totalMentorias;

  const elemRiesgo = document.getElementById('metricEstudiantesRiesgo');
  if (elemRiesgo) elemRiesgo.textContent = totalRiesgo;

  const elemMedio = document.getElementById('metricMedioCount');
  if (elemMedio) elemMedio.textContent = medioCount;

  const elemCritico = document.getElementById('metricCriticoCount');
  if (elemCritico) elemCritico.textContent = criticoCount;

  let totalSesiones = 0;
  Object.values(state.calendar.sessions).forEach(arr => totalSesiones += arr.length);
  const elemSesiones = document.getElementById('metricProximasSesiones');
  if (elemSesiones) elemSesiones.textContent = totalSesiones;
}

function createTableRow(student) {
  let riskClass = 'risk-bueno';
  let riskLabel = student.riesgo || 'Bueno';
  let barColorClass = 'status-bar-green';

  const riskLower = (student.riesgo || '').toLowerCase();
  if (riskLower.includes('medio')) {
    riskClass = 'risk-medio';
    barColorClass = 'status-bar-yellow';
    riskLabel = 'Medio';
  } else if (riskLower.includes('critico') || riskLower.includes('crítico')) {
    riskClass = 'risk-critico';
    barColorClass = 'status-bar-red';
    riskLabel = 'Critico';
  }

  return `
    <tr>
      <td class="col-estado"><span class="status-indicator-bar ${barColorClass}"></span></td>
      <td class="col-nombre"><strong>${student.nombre}</strong></td>
      <td class="col-matricula">${student.matricula}</td>
      <td class="col-riesgo"><span class="risk-pill ${riskClass}">${riskLabel}</span></td>
      <td class="col-mentor">${student.mentor}</td>
      <td class="col-acciones">
        <button class="btn-ver-mas" onclick="window.viewStudentDetail(${student.id})">Ver más</button>
      </td>
    </tr>
  `;
}

function renderPanelTable() {
  const tbody = document.getElementById('tablePanelBody');
  if (!tbody) return;
  tbody.innerHTML = state.students.length > 0 
    ? state.students.map(createTableRow).join('') 
    : `<tr><td colspan="6" class="text-center">No hay datos de estudiantes. Carga un archivo Excel.</td></tr>`;
}

function renderEstudiantesTable() {
  const tbody = document.getElementById('tableEstudiantesBody');
  if (!tbody) return;
  tbody.innerHTML = state.students.length > 0 
    ? state.students.map(createTableRow).join('') 
    : `<tr><td colspan="6" class="text-center">No hay datos de estudiantes. Carga un archivo Excel.</td></tr>`;
}

function renderRiesgoTable() {
  const tbody = document.getElementById('tableRiesgoBody');
  if (!tbody) return;
  const riesgoStudents = state.students.filter(s => s.riesgo === 'Medio' || s.riesgo === 'Critico');
  tbody.innerHTML = riesgoStudents.length > 0 
    ? riesgoStudents.map(createTableRow).join('') 
    : `<tr><td colspan="6" class="text-center">No hay estudiantes en riesgo académico.</td></tr>`;
}

window.viewStudentDetail = (id) => {
  const student = state.students.find(s => s.id === id);
  if (!student) return;

  const nameElem = document.getElementById('detailNombre');
  if (nameElem) nameElem.textContent = student.nombre;

  const estatusElem = document.getElementById('detailEstatus');
  if (estatusElem) estatusElem.textContent = `${student.estado} (Riesgo: ${student.riesgo})`;

  const carreraElem = document.getElementById('detailCarrera');
  if (carreraElem) carreraElem.textContent = student.carrera;

  const gradoElem = document.getElementById('detailGrado');
  if (gradoElem) gradoElem.textContent = student.grado;

  document.querySelectorAll('.content-area .view-section').forEach(v => v.classList.add('hidden'));
  document.getElementById('detalleEstudianteView')?.classList.remove('hidden');
};

// =========================================================================
// 5. BUSCADOR Y CALENDARIO INTERACTIVO
// =========================================================================
function initSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      updateAllViews();
      return;
    }

    const filtered = state.students.filter(s => 
      s.nombre.toLowerCase().includes(term) || 
      s.matricula.toLowerCase().includes(term)
    );

    const renderFiltered = (tbodyId) => {
      const tbody = document.getElementById(tbodyId);
      if (tbody) {
        tbody.innerHTML = filtered.length > 0 
          ? filtered.map(createTableRow).join('') 
          : `<tr><td colspan="6" class="text-center">No se encontraron coincidencias.</td></tr>`;
      }
    };

    renderFiltered('tablePanelBody');
    renderFiltered('tableEstudiantesBody');
    renderFiltered('tableRiesgoBody');
  });
}

function initCalendar() {
  const btnPrev = document.getElementById('btnPrevMonth');
  const btnNext = document.getElementById('btnNextMonth');
  const selectMonth = document.getElementById('selectMonth');
  const inputYear = document.getElementById('inputYear');

  if (selectMonth && inputYear) {
    selectMonth.value = state.calendar.month;
    inputYear.value = state.calendar.year;

    selectMonth.addEventListener('change', (e) => {
      state.calendar.month = parseInt(e.target.value);
      renderCalendarGrid();
    });

    inputYear.addEventListener('change', (e) => {
      const val = parseInt(e.target.value);
      if (val >= 1900 && val <= 2100) {
        state.calendar.year = val;
        renderCalendarGrid();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (state.calendar.month === 0) {
        state.calendar.month = 11;
        state.calendar.year--;
      } else {
        state.calendar.month--;
      }
      syncCalendarControls();
      renderCalendarGrid();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (state.calendar.month === 11) {
        state.calendar.month = 0;
        state.calendar.year++;
      } else {
        state.calendar.month++;
      }
      syncCalendarControls();
      renderCalendarGrid();
    });
  }

  renderCalendarGrid();
}

function syncCalendarControls() {
  const selectMonth = document.getElementById('selectMonth');
  const inputYear = document.getElementById('inputYear');
  if (selectMonth) selectMonth.value = state.calendar.month;
  if (inputYear) inputYear.value = state.calendar.year;
}

function renderCalendarGrid() {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const year = state.calendar.year;
  const month = state.calendar.month;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const blank = document.createElement('div');
    blank.className = 'calendar-day-cell empty';
    grid.appendChild(blank);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const daySessions = state.calendar.sessions[dateKey] || [];

    cell.innerHTML = `
      <div class="day-number">${day}</div>
      <div class="day-sessions-badge">${daySessions.length > 0 ? `📌 ${daySessions.length} sesión(es)` : ''}</div>
    `;

    cell.addEventListener('click', () => {
      abrirVentanaEdicionCalendario(dateKey);
    });

    grid.appendChild(cell);
  }
}

function abrirVentanaEdicionCalendario(dateKey) {
  let sesionesDia = state.calendar.sessions[dateKey] || [];
  let listaTexto = sesionesDia.length > 0 ? sesionesDia.join("\n• ") : "Ninguna";

  let nuevaSesion = prompt(
    `📅 Fecha: ${dateKey}\n\n` +
    `Recordatorios/Sesiones actuales:\n• ${listaTexto}\n\n` +
    `Escribe un nuevo recordatorio para este día:`
  );

  if (nuevaSesion && nuevaSesion.trim() !== "") {
    if (!state.calendar.sessions[dateKey]) {
      state.calendar.sessions[dateKey] = [];
    }
    state.calendar.sessions[dateKey].push(nuevaSesion.trim());
    calculateMetrics();
    renderCalendarGrid();
    alert("Recordatorio agregado correctamente.");
  }
}