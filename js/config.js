// =========================================================================
// MENTORÍAS IAEV - CÓDIGO JAVASCRIPT COMPLETO UNIFICADO
// =========================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  setPersistence,
  browserLocalPersistence,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc 
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

const MENTORA_DEFAULT = "Olga Luévano";

const state = {
  currentUser: null,
  selectedFile: null,
  students: [], 
  calendar: {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    sessions: {} 
  }
};

const MAPA_MESES = {
  'ene': '01', 'jan': '01', 'enero': '01',
  'feb': '02', 'febrero': '02',
  'mar': '03', 'marzo': '03',
  'abr': '04', 'apr': '04', 'abril': '04',
  'may': '05', 'mayo': '05',
  'jun': '06', 'junio': '06',
  'jul': '07', 'julio': '07',
  'ago': '08', 'aug': '08', 'agosto': '08',
  'sep': '09', 'sept': '09', 'septiembre': '09',
  'oct': '10', 'octubre': '10',
  'nov': '11', 'noviembre': '11',
  'dic': '12', 'dec': '12', 'diciembre': '12'
};

/* ==========================================================================
   1. DICCIONARIO DE TRADUCCIONES UNIFICADO
   ========================================================================== */
const translations = {
  es: {
    loginTitle: "Bienvenido a su Portal",
    lblUsername: "Usuario (Correo electrónico)",
    lblPassword: "Contraseña",
    btnLogin: "Iniciar Sesión",
    menuPanel: "Panel de control",
    menuStudents: "Estudiantes",
    menuSessions: "Sesiones",
    menuRisk: "Riesgo académico",
    menuLoadData: "Cargar datos",
    menuConfig: "Configuración",
    termsAndConditions: "Términos y condiciones",
    searchPlaceholder: "Buscar estudiante por nombre o matrícula...",
    userRole: "Coordinadora",

    titleQuickMetrics: "Métricas rápidas",
    metricActiveMentorships: "Total de mentorías activas",
    metricRiskStudents: "Estudiantes en riesgo",
    riskMedium: "Medio",
    riskCritical: "Crítico",
    metricUpcomingSessions: "Próximas sesiones",
    metricThisWeek: "esta semana",
    titleAcademicRiskStatus: "Estado de Riesgo Académico de Estudiantes",

    thStatus: "Estado",
    thStudentName: "Nombre del Estudiante",
    thId: "Matrícula",
    thRiskLevel: "Nivel de Riesgo",
    thMentor: "Mentor",
    thActions: "Acciones",
    titleStudentStatus: "Estatus de los Estudiantes",
    titleRiskStudentsList: "Alumnos Que Están En Riesgo Académico",

    titleSessionsCalendar: "Calendario de Sesiones",
    btnPrev: "< Anterior",
    btnNext: "Siguiente >",
    mJan: "Enero", mFeb: "Febrero", mMar: "Marzo", mApr: "Abril",
    mMay: "Mayo", mJun: "Junio", mJul: "Julio", mAug: "Agosto",
    mSep: "Septiembre", mOct: "Octubre", mNov: "Noviembre", mDec: "Diciembre",
    daySun: "Dom", dayMon: "Lun", dayTue: "Mar", dayWed: "Mié", dayThu: "Jue", dayFri: "Vie", daySat: "Sáb",

    titleDataImportExport: "Importación y Exportación de Datos",
    dropzoneTitle: "Arrastrar y soltar archivo aquí",
    dropzoneSubtitle: "o haz clic para seleccionar archivo (Excel)",
    titleSelectedFiles: "Archivos Seleccionados",
    noFilesSelected: "Aún no hay archivos seleccionados",
    btnUpload: "Subir",
    titleDownloadList: "Descargar de listado de estudiantes (Excel)",
    btnExport: "Exportar",

    titleConfigPanel: "Panel de Configuración",
    btnPassword: "Cambiar contraseñas",
    btnLanguage: "Idiomas",
    btnTheme: "Temas",

    btnBack: "Volver",
    lblStudentNameDetail: "Nombre del Alumno:",
    lblStatusDetail: "Estatus:",
    lblCareerDetail: "Carrera:",
    lblGradeDetail: "Grado y sección:",

    modalTitle: "Cambiar Contraseña",
    lblCurrentPass: "Contraseña actual",
    lblNewPass: "Nueva contraseña",
    lblConfirmPass: "Confirmar nueva contraseña",
    btnSave: "Guardar cambios",
    btnCancel: "Cancelar",
    modalSuccess: "¡Contraseña actualizada con éxito!",
    modalError: "Ocurrió un error al actualizar la contraseña.",
    errMismatch: "Las nuevas contraseñas no coinciden.",
    errShortPass: "La nueva contraseña debe tener al menos 6 caracteres.",
    errWrongCurrent: "La contraseña actual es incorrecta.",
    errEmptyFields: "Por favor, completa todos los campos.",
    noUser: "Debes iniciar sesión para cambiar tu contraseña."
  },

  en: {
    loginTitle: "Welcome to your Portal",
    lblUsername: "User (Email)",
    lblPassword: "Password",
    btnLogin: "Log In",
    menuPanel: "Dashboard",
    menuStudents: "Students",
    menuSessions: "Sessions",
    menuRisk: "Academic Risk",
    menuLoadData: "Upload Data",
    menuConfig: "Settings",
    termsAndConditions: "Terms and conditions",
    searchPlaceholder: "Search student by name or ID...",
    userRole: "Coordinator",

    titleQuickMetrics: "Quick Metrics",
    metricActiveMentorships: "Total active mentorships",
    metricRiskStudents: "Students at risk",
    riskMedium: "Medium",
    riskCritical: "Critical",
    metricUpcomingSessions: "Upcoming sessions",
    metricThisWeek: "this week",
    titleAcademicRiskStatus: "Student Academic Risk Status",

    thStatus: "Status",
    thStudentName: "Student Name",
    thId: "ID Number",
    thRiskLevel: "Risk Level",
    thMentor: "Mentor",
    thActions: "Actions",
    titleStudentStatus: "Student Status",
    titleRiskStudentsList: "Students at Academic Risk",

    titleSessionsCalendar: "Sessions Calendar",
    btnPrev: "< Previous",
    btnNext: "Next >",
    mJan: "January", mFeb: "February", mMar: "March", mApr: "April",
    mMay: "May", mJun: "June", mJul: "July", mAug: "August",
    mSep: "September", mOct: "October", mNov: "November", mDec: "December",
    daySun: "Sun", dayMon: "Mon", dayTue: "Tue", dayWed: "Wed", dayThu: "Thu", dayFri: "Fri", daySat: "Sat",

    titleDataImportExport: "Data Import and Export",
    dropzoneTitle: "Drag and drop file here",
    dropzoneSubtitle: "or click to select file (Excel)",
    titleSelectedFiles: "Selected Files",
    noFilesSelected: "No files selected yet",
    btnUpload: "Upload",
    titleDownloadList: "Download student list (Excel)",
    btnExport: "Export",

    titleConfigPanel: "Settings Panel",
    btnPassword: "Change password",
    btnLanguage: "Languages",
    btnTheme: "Themes",

    btnBack: "Back",
    lblStudentNameDetail: "Student Name:",
    lblStatusDetail: "Status:",
    lblCareerDetail: "Major:",
    lblGradeDetail: "Grade and section:",

    modalTitle: "Change Password",
    lblCurrentPass: "Current password",
    lblNewPass: "New password",
    lblConfirmPass: "Confirm new password",
    btnSave: "Save changes",
    btnCancel: "Cancel",
    modalSuccess: "Password updated successfully!",
    modalError: "Error updating password.",
    errMismatch: "The new passwords do not match.",
    errShortPass: "The new password must be at least 6 characters long.",
    errWrongCurrent: "Current password is incorrect.",
    errEmptyFields: "Please fill in all fields.",
    noUser: "You must be logged in to change your password."
  }
};

let currentLang = localStorage.getItem("app_lang") || "es";

/* =========================================================================
   2. INICIALIZACIÓN GENERAL Y EVENT LISTENERS
   ======================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.getElementById('appContainer');
  const loginView = document.getElementById('loginView');

  if (appContainer) appContainer.classList.add('hidden');
  if (loginView) loginView.classList.remove('hidden');

  try {
    await signOut(auth);
  } catch (error) {}

  const emailInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';

  // Cargar preferencias guardadas de UI
  if (localStorage.getItem("app_theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
  applyLanguage(currentLang);

  initLogin();
  initNavigation();
  initExcelHandling();
  initSearch();
  initCalendar();
  
  // Enlaces de configuración con IDs exactos del HTML
  const btnPassword = document.getElementById("btn-change-password");
  const btnLanguage = document.getElementById("btn-change-language");
  const btnTheme = document.getElementById("btn-change-theme");

  if (btnPassword) btnPassword.addEventListener("click", openPasswordModal);
  if (btnLanguage) btnLanguage.addEventListener("click", toggleLanguage);
  if (btnTheme) btnTheme.addEventListener("click", toggleTheme);
});

// =========================================================================
// 3. CONFIGURACIÓN, TEMAS E IDIOMAS
// =========================================================================
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("app_theme", isDark ? "dark" : "light");
}

function toggleLanguage() {
  currentLang = currentLang === "es" ? "en" : "es";
  localStorage.setItem("app_lang", currentLang);
  applyLanguage(currentLang);
  renderCalendarGrid(); // Refrescar nombres de meses en el calendario
}

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (translations[lang] && translations[lang][key]) {
      element.placeholder = translations[lang][key];
    }
  });
}

// =========================================================================
// 4. CONTROL DE LOGIN Y PERSISTENCIA
// =========================================================================
function initLogin() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const emailInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      if (!email || !email.includes('@') || !password) {
        alert("Acceso denegado: Debes ingresar un correo y contraseña válidos.");
        return;
      }

      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        mostrarDashboard(userCredential.user);

      } catch (error) {
        console.error("Error Auth:", error);
        alert("Acceso denegado: " + getAuthErrorMessage(error.code));
      }
    });
  }
}

function mostrarDashboard(user) {
  const loginView = document.getElementById('loginView');
  const appContainer = document.getElementById('appContainer');

  if (loginView) loginView.classList.add('hidden');
  if (appContainer) appContainer.classList.remove('hidden');

  state.currentUser = user;

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

  state.students = []; 
  state.calendar.sessions = {};
  updateAllViews();
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
    state.students = [];
    state.calendar.sessions = {};
    
    document.getElementById('appContainer')?.classList.add('hidden');
    document.getElementById('loginView')?.classList.remove('hidden');

    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
  });
};

// =========================================================================
// 5. NAVEGACIÓN 
// =========================================================================
function initNavigation() {
  const navButtons = document.querySelectorAll('.sidebar-menu .nav-btn');
  const views = document.querySelectorAll('.content-area .view-section');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!state.currentUser && !auth.currentUser) {
        alert("Acceso denegado. Debes iniciar sesión.");
        return;
      }
      if (!state.currentUser && auth.currentUser) {
        state.currentUser = auth.currentUser;
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
      if (!state.currentUser && auth.currentUser) state.currentUser = auth.currentUser;
      if (!state.currentUser) return;
      views.forEach(v => v.classList.add('hidden'));
      navButtons.forEach(b => b.classList.remove('active'));
      document.getElementById('perfilView')?.classList.remove('hidden');
    });
  }
}

// =========================================================================
// 6. LECTURA DE EXCEL Y EXTRACCIÓN DE ENTREVISTAS
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
      state.calendar.sessions = {}; 

      const PALABRAS_PROHIBIDAS = [
        'FORMATO', 'SEGUIMIENTO', 'USO MULTIPLE', 'INFORME', 'CUATRIMESTRAL',
        'ENTREVISTA', 'CALIFICACIONES', 'MATRICULA', 'MATRÍCULA', 'NOMBRE',
        'ESTUDIANTE', 'ALUMNO', 'CARRERA', 'INSTITUTO', 'UNIVERSIDAD',
        'TECNOLOGICO', 'TECNOLÓGICO', 'REPORTE', 'LISTA', 'MENTOR', 'MENTORES',
        'TUTOR', 'TUTORES', 'PERIODO', 'PERÍODO', 'GRUPO', 'GRADO', 'OBSERVACIONES', 
        'FECHA', 'FIRMA', 'NUMERO', 'NÚMERO', 'NUM', 'NÚM', 'NO.', 'DIRECCION',
        'COORDINACION', 'EVALUACION', 'CUATRIMESTRE', 'ACUERDOS', 'COMPROMISOS', 'SITUACION'
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
          if (/^\d{4,12}$/.test(numOnly)) {
            matriculaEncontrada = numOnly;
            break;
          }
        }

        if (matriculaEncontrada) {
          for (let cellVal of cleanCells) {
            if (!cellVal || cellVal.replace(/[\s-]/g, '') === matriculaEncontrada) continue;
            let upper = cellVal.toUpperCase();
            if (PALABRAS_PROHIBIDAS.some(word => upper.includes(word))) continue;

            if (/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(cellVal) && !/^\d+$/.test(cellVal)) {
              nombreEncontrado = cellVal.trim();
              break;
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
            mentor: MENTORA_DEFAULT,
            carrera: "Desarrollo de Software Multiplataforma",
            grado: "Cuatrimestre Actual",
            estado: "Activo"
          });

          extraerEntrevistasDeFila(cleanCells, matriculaEncontrada, nombreEncontrado);
        }
      });

      if (estudiantesValidos.length === 0) {
        alert("No se pudieron detectar registros válidos en el archivo Excel.");
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
        console.error("Error guardando en Firestore:", fbError);
      }

      updateAllViews();
      
      let totalEntrevistas = 0;
      Object.values(state.calendar.sessions).forEach(arr => totalEntrevistas += arr.length);
      
      alert(`¡Éxito! Se importaron ${state.students.length} estudiantes y ${totalEntrevistas} entrevistas agendadas al calendario.`);

    } catch (error) {
      console.error("Error al procesar Excel:", error);
      alert("Ocurrió un error al leer el archivo Excel.");
    }
  };

  reader.readAsArrayBuffer(file);
}

function extraerEntrevistasDeFila(cells, matricula, nombre) {
  let anioActual = state.calendar.year || new Date().getFullYear();

  for (let i = 0; i < cells.length - 1; i++) {
    let mesStr = cells[i].toLowerCase().trim();
    let numMes = MAPA_MESES[mesStr];

    if (numMes) {
      let diaStr = cells[i + 1] ? cells[i + 1].trim() : "";
      let horaStr = cells[i + 2] ? cells[i + 2].trim() : "";

      let diaNum = parseInt(diaStr, 10);
      if (!isNaN(diaNum) && diaNum >= 1 && diaNum <= 31) {
        let diaPadded = String(diaNum).padStart(2, '0');
        let dateKey = `${anioActual}-${numMes}-${diaPadded}`;

        if (!state.calendar.sessions[dateKey]) {
          state.calendar.sessions[dateKey] = [];
        }

        let horaTexto = (horaStr && horaStr.includes(':')) ? ` - ${horaStr} hrs` : '';
        let textoEntrevista = `Entrevista: [${matricula}] ${nombre}${horaTexto}`;

        if (!state.calendar.sessions[dateKey].includes(textoEntrevista)) {
          state.calendar.sessions[dateKey].push(textoEntrevista);
        }
      }
    }
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
// 7. TABLAS Y MÉTRICAS
// =========================================================================
function updateAllViews() {
  calculateMetrics();
  renderPanelTable();
  renderEstudiantesTable();
  renderRiesgoTable();
  renderCalendarGrid();
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
// 8. BUSCADOR Y CALENDARIO INTERACTIVO
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
      s.matricula.toLowerCase().includes(term) ||
      s.mentor.toLowerCase().includes(term)
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
      <div class="day-sessions-badge">${daySessions.length > 0 ? `📌 ${daySessions.length} entrevista(s)` : ''}</div>
    `;

    cell.addEventListener('click', () => {
      abrirVentanaEdicionCalendario(dateKey);
    });

    grid.appendChild(cell);
  }
}

function abrirVentanaEdicionCalendario(dateKey) {
  let sesionesDia = state.calendar.sessions[dateKey] || [];
  let listaTexto = sesionesDia.length > 0 ? sesionesDia.join("\n• ") : "Sin entrevistas agendadas";

  let nuevaSesion = prompt(
    `📅 Fecha: ${dateKey}\n\n` +
    `Entrevistas / Sesiones programadas:\n• ${listaTexto}\n\n` +
    `Escribe un nuevo recordatorio o entrevista para este día:`
  );

  if (nuevaSesion && nuevaSesion.trim() !== "") {
    if (!state.calendar.sessions[dateKey]) {
      state.calendar.sessions[dateKey] = [];
    }
    state.calendar.sessions[dateKey].push(nuevaSesion.trim());
    calculateMetrics();
    renderCalendarGrid();
    alert("Registro guardado en el calendario.");
  }
}

/* =========================================================================
   9. MODAL DE CAMBIO DE CONTRASEÑA (SweetAlert2)
   ========================================================================== */
async function openPasswordModal(e) {
  if (e) e.preventDefault(); 

  const t = translations[currentLang];

  if (typeof Swal === "undefined") {
    alert("SweetAlert2 no se ha cargado correctamente.");
    return;
  }

  let user = null;
  try {
    user = auth.currentUser || state.currentUser;
  } catch (err) {
    console.warn("Firebase Auth no está inicializado aún:", err);
  }

  const { value: formValues } = await Swal.fire({
    title: t.modalTitle,
    html: `
      <div style="text-align: left; font-size: 14px;">
        <label style="display:block; margin-bottom: 5px; font-weight: bold;">${t.lblCurrentPass}</label>
        <input id="swal-current-password" type="password" class="swal2-input" placeholder="••••••••" style="margin-top:0; width: 100%; box-sizing: border-box;">
        
        <label style="display:block; margin-top: 15px; margin-bottom: 5px; font-weight: bold;">${t.lblNewPass}</label>
        <input id="swal-new-password" type="password" class="swal2-input" placeholder="••••••••" style="margin-top:0; width: 100%; box-sizing: border-box;">
        
        <label style="display:block; margin-top: 15px; margin-bottom: 5px; font-weight: bold;">${t.lblConfirmPass}</label>
        <input id="swal-confirm-password" type="password" class="swal2-input" placeholder="••••••••" style="margin-top:0; width: 100%; box-sizing: border-box;">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: t.btnSave,
    cancelButtonText: t.btnCancel,
    preConfirm: () => {
      const currentPass = document.getElementById("swal-current-password").value;
      const newPass = document.getElementById("swal-new-password").value;
      const confirmPass = document.getElementById("swal-confirm-password").value;

      if (!currentPass || !newPass || !confirmPass) {
        Swal.showValidationMessage(t.errEmptyFields);
        return false;
      }

      if (newPass.length < 6) {
        Swal.showValidationMessage(t.errShortPass);
        return false;
      }

      if (newPass !== confirmPass) {
        Swal.showValidationMessage(t.errMismatch);
        return false;
      }

      return { currentPass, newPass };
    }
  });

  if (formValues) {
    if (!user || !user.email) {
      Swal.fire("Atención", t.noUser, "warning");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, formValues.currentPass);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, formValues.newPass);
      Swal.fire("Éxito", t.modalSuccess, "success");

    } catch (error) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        Swal.fire("Error", t.errWrongCurrent, "error");
      } else {
        Swal.fire("Error", error.message || t.modalError, "error");
      }
    }
  }
}