// =========================================================================
// IAEV MENTORSIAS
// =========================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  setPersistence,
  browserLocalPersistence,
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword 
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

const DEFAULT_MENTOR = "Olga Luévano";

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

const MONTH_MAP = {
  'ene': '01', 'jan': '01', 'enero': '01', 'january': '01',
  'feb': '02', 'febrero': '02', 'february': '02',
  'mar': '03', 'marzo': '03', 'march': '03',
  'abr': '04', 'apr': '04', 'abril': '04', 'april': '04',
  'may': '05', 'mayo': '05',
  'jun': '06', 'junio': '06', 'june': '06',
  'jul': '07', 'julio': '07', 'july': '07',
  'ago': '08', 'aug': '08', 'agosto': '08', 'august': '08',
  'sep': '09', 'sept': '09', 'septiembre': '09', 'september': '09',
  'oct': '10', 'octubre': '10', 'october': '10',
  'nov': '11', 'noviembre': '11', 'november': '11',
  'dic': '12', 'dec': '12', 'diciembre': '12', 'december': '12'
};

const translations = {
  es: {
    menuPanel: "Panel",
    menuStudents: "Estudiantes",
    menuSessions: "Sesiones",
    menuRisk: "Riesgo Académico",
    menuLoadData: "Cargar Datos",
    menuConfig: "Configuración",
    termsAndConditions: "Términos y condiciones",
    userRole: "Coordinador",
    searchPlaceholder: "Buscar estudiante por nombre o matrícula...",
    titleQuickMetrics: "Métricas Rápidas",
    titleAcademicRiskStatus: "Estatus de los Estudiantes",
    titleSessionsCalendar: "Calendario de Sesiones",
    titleConfigPanel: "Panel de Configuración",
    btnPassword: "Cambiar contraseña",
    btnLanguage: "Idiomas",
    btnTheme: "Temas",
    panelTitle: "Panel",
    studentsTitle: "Gestión de Estudiantes",
    sessionsTitle: "Calendario de Sesiones",
    riskTitle: "Alumnos Que Están En Riesgo Académico",
    loadDataTitle: "Importación y Exportación de Datos",
    configTitle: "Panel de Configuración",
    metricTotal: "Total de mentorías activas",
    metricRisk: "Estudiantes en riesgo",
    metricSessions: "Próximas sesiones",
    metricThisWeek: "esta semana",
    metricMediumLabel: "Medio",
    metricCriticalLabel: "Crítico",
    thStatus: "Status",
    thName: "Nombre del Estudiante",
    thId: "ID",
    thRisk: "Nivel de Riesgo",
    thMentor: "Mentor",
    thActions: "Acciones",
    detailTitle: "Detalles del Estudiante",
    detailBackBtn: "← Volver a Estudiantes",
    detailGeneralInfo: "Información General",
    detailCareerLabel: "Carrera:",
    detailTermLabel: "Cuatrimestre:",
    detailStatusLabel: "Estatus:",
    dropzoneText: "Arrastrar y soltar archivo aquí",
    dropzoneHint: "o haz clic para seleccionar archivo (Excel)",
    btnProcess: "Subir",
    btnExport: "Exportar",
    selectedFileDefault: "Aún no hay archivos seleccionados",
    sectionFilesTitle: "Archivos Seleccionados",
    sectionExportTitle: "Descargar de listado de estudiantes (Excel)",
    riskGood: "Bueno",
    riskMedium: "Medio",
    riskCritical: "Crítico",
    viewMore: "Ver más",
    noStudentsMsg: "No hay datos de estudiantes disponibles. Cargue un archivo de Excel.",
    noRiskMsg: "No hay estudiantes en riesgo académico.",
    prevBtn: "< Anterior",
    nextBtn: "Siguiente >",
    monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  },
  en: {
    menuPanel: "Dashboard",
    menuStudents: "Students",
    menuSessions: "Sessions",
    menuRisk: "Academic Risk",
    menuLoadData: "Upload Data",
    menuConfig: "Settings",
    termsAndConditions: "Terms and conditions",
    userRole: "Coordinator",
    searchPlaceholder: "Search student by name or ID...",
    titleQuickMetrics: "Quick Metrics",
    titleAcademicRiskStatus: "Student Status",
    titleSessionsCalendar: "Sessions Calendar",
    titleConfigPanel: "Settings Panel",
    btnPassword: "Change password",
    btnLanguage: "Languages",
    btnTheme: "Themes",
    panelTitle: "Dashboard",
    studentsTitle: "Student Management",
    sessionsTitle: "Sessions Calendar",
    riskTitle: "Students At Academic Risk",
    loadDataTitle: "Data Import and Export",
    configTitle: "Settings Panel",
    metricTotal: "Total active mentorings",
    metricRisk: "Students at risk",
    metricSessions: "Upcoming sessions",
    metricThisWeek: "this week",
    metricMediumLabel: "Medium",
    metricCriticalLabel: "Critical",
    thStatus: "Status",
    thName: "Student Name",
    thId: "ID",
    thRisk: "Risk Level",
    thMentor: "Mentor",
    thActions: "Actions",
    detailTitle: "Student Details",
    detailBackBtn: "← Back to Students",
    detailGeneralInfo: "General Information",
    detailCareerLabel: "Career:",
    detailTermLabel: "Term:",
    detailStatusLabel: "Status:",
    dropzoneText: "Drag and drop file here",
    dropzoneHint: "or click to select file (Excel)",
    btnProcess: "Upload",
    btnExport: "Export",
    selectedFileDefault: "No files selected yet",
    sectionFilesTitle: "Selected Files",
    sectionExportTitle: "Download student list (Excel)",
    riskGood: "Good",
    riskMedium: "Medium",
    riskCritical: "Critical",
    viewMore: "View more",
    noStudentsMsg: "No student data available. Upload an Excel file.",
    noRiskMsg: "No students at academic risk.",
    prevBtn: "< Previous",
    nextBtn: "Next >",
    monthsList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }
};

let currentLang = localStorage.getItem("app_lang") || "en";

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

  if (localStorage.getItem("app_theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
  applyLanguage(currentLang);

  initLogin();
  initNavigation();
  initExcelHandling();
  initSearch();
  initCalendar();
  initTermsModal(); 
  initConfigButtons();
});

// =========================================================================
// CENTRALIZED ALERT SYSTEM (MODALS WITH DARK MODE SUPPORT)
// =========================================================================
function showCenteredModal(title, message, callback = null) {
  let existingModal = document.getElementById('centeredCustomModal');
  if (existingModal) existingModal.remove();

  const isDark = document.body.classList.contains("dark-mode");
  const bgCard = isDark ? "#1f2937" : "#ffffff";
  const textColor = isDark ? "#f3f4f6" : "#333333";
  const btnText = currentLang === 'es' ? 'Aceptar' : 'Accept';

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'centeredCustomModal';
  modalOverlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center;
    align-items: center; z-index: 9999;
  `;

  modalOverlay.innerHTML = `
    <div style="background: ${bgCard}; color: ${textColor}; padding: 25px; border-radius: 12px; width: 90%; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; font-family: inherit; border: 1px solid ${isDark ? '#374151' : 'transparent'};">
      <h3 style="margin-top: 0; color: #eab308; margin-bottom: 15px;">${title}</h3>
      <p style="margin-bottom: 20px; line-height: 1.5; white-space: pre-line;">${message}</p>
      <div style="display: flex; justify-content: center; gap: 10px;">
        <button id="modalAcceptBtn" style="padding: 10px 20px; background: #eab308; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">${btnText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  document.getElementById('modalAcceptBtn').addEventListener('click', () => {
    modalOverlay.remove();
    if (callback) callback();
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
      if (callback) callback();
    }
  });
}

// =========================================================================
// BUTTON CONFIGURATION AND PASSWORD CHANGE
// =========================================================================
function initConfigButtons() {
  const btnPassword = document.getElementById("btn-change-password");
  const btnLanguage = document.getElementById("btn-change-language");
  const btnTheme = document.getElementById("btn-change-theme");

  if (btnPassword) {
    btnPassword.addEventListener("click", () => {
      openPasswordChangeModal();
    });
  }

  if (btnLanguage) {
    btnLanguage.addEventListener("click", () => {
      toggleLanguage();
      const langTitle = currentLang === 'es' ? 'Idioma' : 'Language';
      const langMsg = currentLang === 'es' ? 'Idioma cambiado a: ESPAÑOL' : 'Language changed to: ENGLISH';
      showCenteredModal(langTitle, langMsg);
    });
  }

  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      toggleTheme();
      const isDark = document.body.classList.contains("dark-mode");
      const themeTitle = currentLang === 'es' ? 'Tema' : 'Theme';
      const themeMsg = currentLang === 'es' 
        ? (isDark ? 'Modo oscuro activado exitosamente.' : 'Modo claro activado exitosamente.')
        : (isDark ? 'Dark mode activated successfully.' : 'Light mode activated successfully.');
      showCenteredModal(themeTitle, themeMsg);
    });
  }
}

function openPasswordChangeModal() {
  let existingModal = document.getElementById('changePasswordModal');
  if (existingModal) existingModal.remove();

  const isDark = document.body.classList.contains("dark-mode");
  const bgCard = isDark ? "#1f2937" : "#ffffff";
  const textColor = isDark ? "#f3f4f6" : "#333333";
  const inputBg = isDark ? "#111827" : "#ffffff";
  const inputBorder = isDark ? "#374151" : "#ccc";

  const tTitle = currentLang === 'es' ? '🔒 Cambiar Contraseña' : '🔒 Change Password';
  const tCurrentLabel = currentLang === 'es' ? 'Contraseña Actual:' : 'Current Password:';
  const tNewLabel = currentLang === 'es' ? 'Nueva Contraseña:' : 'New Password:';
  const tCurrentPlaceholder = currentLang === 'es' ? 'usuario@gmail.com o contraseña actual' : 'user@gmail.com or current password';
  const tUpdate = currentLang === 'es' ? 'Actualizar' : 'Update';
  const tCancel = currentLang === 'es' ? 'Cancelar' : 'Cancel';

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'changePasswordModal';
  modalOverlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center;
    align-items: center; z-index: 9999;
  `;

  modalOverlay.innerHTML = `
    <div style="background: ${bgCard}; color: ${textColor}; padding: 25px; border-radius: 12px; width: 90%; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; font-family: inherit; border: 1px solid ${isDark ? '#374151' : 'transparent'};">
      <h3 style="margin-top: 0; color: #eab308; margin-bottom: 15px;">${tTitle}</h3>
      
      <div style="text-align: left; margin-bottom: 12px; position: relative;">
        <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px;">${tCurrentLabel}</label>
        <div style="position: relative;">
          <input type="password" id="currentPasswordInput" placeholder="${tCurrentPlaceholder}" style="width: 100%; padding: 9px 38px 9px 10px; background: ${inputBg}; color: ${textColor}; border: 1px solid ${inputBorder}; border-radius: 6px; font-size: 12px;">
          <span onclick="togglePasswordVisibility('currentPasswordInput', 'eyeIcon1')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: ${textColor}; opacity: 0.7; z-index: 5;">
            <i id="eyeIcon1" class="fa-regular fa-eye"></i>
          </span>
        </div>
      </div>

      <div style="text-align: left; margin-bottom: 20px; position: relative;">
        <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px;">${tNewLabel}</label>
        <div style="position: relative;">
          <input type="password" id="newPasswordInput" placeholder="********" style="width: 100%; padding: 9px 38px 9px 10px; background: ${inputBg}; color: ${textColor}; border: 1px solid ${inputBorder}; border-radius: 6px; font-size: 12px;">
          <span onclick="togglePasswordVisibility('newPasswordInput', 'eyeIcon2')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: ${textColor}; opacity: 0.7; z-index: 5;">
            <i id="eyeIcon2" class="fa-regular fa-eye"></i>
          </span>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 10px;">
        <button id="confirmChangePwdBtn" style="padding: 9px 20px; background: #eab308; color: #000; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">${tUpdate}</button>
        <button id="cancelChangePwdBtn" style="padding: 9px 20px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">${tCancel}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  window.togglePasswordVisibility = (inputId, iconId) => {
    const inputField = document.getElementById(inputId);
    const iconField = document.getElementById(iconId);
    if (inputField.type === "password") {
      inputField.type = "text";
      iconField.className = "fa-regular fa-eye-slash";
    } else {
      inputField.type = "password";
      iconField.className = "fa-regular fa-eye";
    }
  };

  document.getElementById('confirmChangePwdBtn').addEventListener('click', async () => {
    const currentPwd = document.getElementById('currentPasswordInput').value.trim();
    const newPwd = document.getElementById('newPasswordInput').value.trim();

    if (!currentPwd || !newPwd) {
      showCenteredModal(currentLang === 'es' ? 'Aviso' : 'Notice', currentLang === 'es' ? 'Por favor complete ambos campos.' : 'Please complete both fields.');
      return;
    }

    if (newPwd.length < 6) {
      showCenteredModal(currentLang === 'es' ? 'Aviso' : 'Notice', currentLang === 'es' ? 'La nueva contraseña debe tener al menos 6 caracteres.' : 'The new password must be at least 6 characters long.');
      return;
    }

    const user = auth.currentUser || state.currentUser;
    if (!user || !user.email) {
      showCenteredModal(currentLang === 'es' ? 'Error' : 'Error', currentLang === 'es' ? 'No hay una sesión activa válida.' : 'There is no valid active session.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPwd);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPwd);

      modalOverlay.remove();
      showCenteredModal(currentLang === 'es' ? '¡Éxito!' : 'Success!', currentLang === 'es' ? 'Contraseña actualizada exitosamente.' : 'Password updated successfully.');
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMsg = currentLang === 'es' ? 'No se pudo actualizar la contraseña. Verifique que su contraseña actual sea correcta.' : 'Could not update password. Verify that your current password is correct.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = currentLang === 'es' ? 'La contraseña actual es incorrecta.' : 'The current password is incorrect.';
      }
      showCenteredModal(currentLang === 'es' ? 'Error' : 'Error', errorMsg);
    }
  });

  document.getElementById('cancelChangePwdBtn').addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("app_theme", isDark ? "dark" : "light");
}

function toggleLanguage() {
  currentLang = currentLang === "es" ? "en" : "es";
  localStorage.setItem("app_lang", currentLang);
  applyLanguage(currentLang);
  
  state.students.forEach(s => {
    s.carrera = currentLang === 'es' ? 'Desarrollo de Software Multiplataforma' : 'Multiplatform Software Development';
    s.grado = currentLang === 'es' ? 'Cuatrimestre Actual' : 'Current Term';
    s.estado = currentLang === 'es' ? 'Activo' : 'Active';
  });

  updateAllViews();
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

  const dropzoneTextElem = document.querySelector('.dropzone-text');
  if (dropzoneTextElem) {
    dropzoneTextElem.textContent = translations[lang].dropzoneText;
  }

  const dropzoneHintElem = document.querySelector('.dropzone-hint');
  if (dropzoneHintElem) {
    dropzoneHintElem.textContent = translations[lang].dropzoneHint;
  }

  const btnProcessFile = document.getElementById('btnProcessFile');
  if (btnProcessFile) {
    btnProcessFile.textContent = translations[lang].btnProcess;
  }

  const btnExportFile = document.getElementById('btnExportFile');
  if (btnExportFile) {
    btnExportFile.textContent = translations[lang].btnExport;
  }

  const selectedFileName = document.getElementById('selectedFileName');
  if (selectedFileName && (!state.selectedFile)) {
    selectedFileName.innerHTML = `<i class="fa-regular fa-file"></i> ${translations[lang].selectedFileDefault}`;
  }

  // Update table headers dynamically for thorough translation
  const thNameElem = document.getElementById('thNameText');
  if (thNameElem) thNameElem.textContent = translations[lang].thName;

  const thIdElem = document.getElementById('thIdText');
  if (thIdElem) thIdElem.textContent = translations[lang].thId;

  const thRiskElem = document.getElementById('thRiskText');
  if (thRiskElem) thRiskElem.textContent = translations[lang].thRisk;

  const thMentorElem = document.getElementById('thMentorText');
  if (thMentorElem) thMentorElem.textContent = translations[lang].thMentor;

  const thActionsElem = document.getElementById('thActionsText');
  if (thActionsElem) thActionsElem.textContent = translations[lang].thActions;

  // Also query elements inside tables if IDs are generic
  document.querySelectorAll('.th-name').forEach(el => el.textContent = translations[lang].thName);
  document.querySelectorAll('.th-id').forEach(el => el.textContent = translations[lang].thId);
  document.querySelectorAll('.th-risk').forEach(el => el.textContent = translations[lang].thRisk);
  document.querySelectorAll('.th-mentor').forEach(el => el.textContent = translations[lang].thMentor);
  document.querySelectorAll('.th-actions').forEach(el => el.textContent = translations[lang].thActions);

  // Update static layout titles directly for comprehensive coverage
  const mappingTitles = {
    'titleQuickMetrics': translations[lang].titleQuickMetrics,
    'titleAcademicRiskStatus': translations[lang].titleAcademicRiskStatus,
    'titleSessionsCalendar': translations[lang].titleSessionsCalendar,
    'titleConfigPanel': translations[lang].titleConfigPanel
  };

  for (const [key, val] of Object.entries(mappingTitles)) {
    document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => el.textContent = val);
  }

  // Sync calendar month select elements text/options
  const selectMonth = document.getElementById('selectMonth');
  if (selectMonth) {
    const currentSelectedVal = selectMonth.value;
    selectMonth.innerHTML = '';
    translations[lang].monthsList.forEach((mName, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = mName;
      selectMonth.appendChild(opt);
    });
    selectMonth.value = currentSelectedVal;
  }

  const btnPrevMonth = document.getElementById('btnPrevMonth');
  if (btnPrevMonth) btnPrevMonth.textContent = translations[lang].prevBtn;

  const btnNextMonth = document.getElementById('btnNextMonth');
  if (btnNextMonth) btnNextMonth.textContent = translations[lang].nextBtn;
}

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
        showCenteredModal(currentLang === 'es' ? 'Acceso Denegado' : 'Access Denied', currentLang === 'es' ? 'Debe ingresar un correo y contraseña válidos.' : 'You must enter a valid email and password.');
        return;
      }

      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showDashboard(userCredential.user);

      } catch (error) {
        console.error("Auth Error:", error);
        showCenteredModal(currentLang === 'es' ? 'Error de Autenticación' : 'Authentication Error', getAuthErrorMessage(error.code));
      }
    });
  }
}

function showDashboard(user) {
  const loginView = document.getElementById('loginView');
  const appContainer = document.getElementById('appContainer');

  if (loginView) loginView.classList.add('hidden');
  if (appContainer) appContainer.classList.remove('hidden');

  state.currentUser = user;

  let fullName = user.displayName;
  if (!fullName) {
    let base = user.email.split('@')[0];
    fullName = base.charAt(0).toUpperCase() + base.slice(1).replace('.', ' ');
  }

  let initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const userNameElem = document.querySelector('.user-name');
  if (userNameElem) userNameElem.textContent = fullName;

  const avatarCircle = document.querySelector('.user-profile-widget .avatar-circle');
  if (avatarCircle) avatarCircle.textContent = initials;

  state.students = []; 
  state.calendar.sessions = {};
  updateAllViews();
}

function getAuthErrorMessage(code) {
  const isEs = currentLang === 'es';
  switch (code) {
    case 'auth/invalid-email': return isEs ? 'El formato del correo electrónico es inválido.' : 'The email address format is invalid.';
    case 'auth/user-not-found': return isEs ? 'No existe una cuenta registrada con este correo.' : 'No account registered with this email exists.';
    case 'auth/wrong-password': return isEs ? 'Contraseña incorrecta.' : 'Incorrect password.';
    case 'auth/invalid-credential': return isEs ? 'Correo o contraseña incorrectos. Verifique sus credenciales.' : 'Incorrect email or password. Verify your credentials.';
    case 'auth/too-many-requests': return isEs ? 'Demasiados intentos fallidos. Intente más tarde.' : 'Too many failed login attempts. Try again later.';
    default: return isEs ? 'No se pudo iniciar sesión. Verifique sus credenciales.' : 'Could not sign in. Check your credentials.';
  }
}

window.logoutUser = () => {
  signOut(auth).then(() => {
    state.currentUser = null;
    state.students = [];
    state.calendar.sessions = {};
    
    document.getElementById('appContainer')?.classList.add('hidden');
    document.getElementById('loginView')?.classList.remove('hidden');
  });
};

function initNavigation() {
  const navButtons = document.querySelectorAll('.sidebar-menu .nav-btn');
  const views = document.querySelectorAll('.content-area .view-section');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('btn-terms')) return;

      if (!state.currentUser && !auth.currentUser) {
        showCenteredModal(currentLang === 'es' ? 'Acceso Denegado' : 'Access Denied', currentLang === 'es' ? 'Debe iniciar sesión.' : 'You must log in.');
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

function initExcelHandling() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const selectedFileName = document.getElementById('selectedFileName');
  const btnProcessFile = document.getElementById('btnProcessFile');
  const btnExportFile = document.getElementById('btnExportFile');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        state.selectedFile = e.dataTransfer.files[0];
        if (selectedFileName) {
          selectedFileName.innerHTML = `<i class="fa-regular fa-file"></i> ${state.selectedFile.name}`;
        }
      }
    });

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
        showCenteredModal(currentLang === 'es' ? 'Aviso' : 'Notice', currentLang === 'es' ? 'Por favor seleccione o arrastre un archivo de Excel primero.' : 'Please select or drag an Excel file first.');
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
        showCenteredModal(currentLang === 'es' ? 'Aviso' : 'Notice', currentLang === 'es' ? 'El archivo de Excel está vacío.' : 'The Excel file is empty.');
        return;
      }

      let validStudents = [];
      state.calendar.sessions = {}; 

      const FORBIDDEN_WORDS = [
        'FORMATO', 'SEGUIMIENTO', 'USO MULTIPLE', 'INFORME', 'CUATRIMESTRAL',
        'ENTREVISTA', 'CALIFICACIONES', 'MATRICULA', 'MATRÍCULA', 'NOMBRE',
        'ESTUDIANTE', 'ALUMNO', 'CARRERA', 'INSTITUTO', 'UNIVERSIDAD',
        'TECNOLOGICO', 'TECNOLÓGICO', 'REPORTE', 'LISTA', 'MENTOR', 'MENTORES',
        'TUTOR', 'TUTORES', 'PERIODO', 'PERÍODO', 'GRUPO', 'GRADO', 'OBSERVACIONES', 
        'FECHA', 'FIRMA', 'NUMERO', 'NÚMERO', 'NUM', 'NÚM', 'NO.', 'DIRECCION',
        'COORDINACION', 'EVALUACION', 'CUATRIMESTRE', 'ACUERDOS', 'COMPROMISOS', 'SITUACION',
        'FORMAT', 'FOLLOW-UP', 'REPORT', 'INTERVIEW', 'GRADES', 'STUDENT', 'NAME',
        'CAREER', 'UNIVERSITY', 'TECHNOLOGICAL', 'LIST', 'TUTOR', 'PERIOD', 'GROUP',
        'DATE', 'SIGNATURE', 'NUMBER', 'ADDRESS', 'COORDINATION', 'EVALUATION', 'AGREEMENTS'
      ];

      rows.forEach((row) => {
        if (!Array.isArray(row) || row.length === 0) return;

        let cleanCells = row.map(cell => String(cell || "").trim().replace(/\.0$/, ''));

        let foundId = "";
        let foundName = "";

        for (let cellVal of cleanCells) {
          if (!cellVal) continue;
          let upper = cellVal.toUpperCase();
          if (FORBIDDEN_WORDS.some(word => upper.includes(word))) continue;

          let numOnly = cellVal.replace(/[\s-]/g, '');
          if (/^\d{4,12}$/.test(numOnly)) {
            foundId = numOnly;
            break;
          }
        }

        if (foundId) {
          for (let cellVal of cleanCells) {
            if (!cellVal || cellVal.replace(/[\s-]/g, '') === foundId) continue;
            let upper = cellVal.toUpperCase();
            if (FORBIDDEN_WORDS.some(word => upper.includes(word))) continue;

            if (/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(cellVal) && !/^\d+$/.test(cellVal)) {
              foundName = cellVal.trim();
              break;
            }
          }
        }

        if (foundId && foundName) {
          let rowText = cleanCells.join(" ").toLowerCase();
          let riskLevel = "Good";

          if (rowText.includes("reprobar") || rowText.includes("critico") || rowText.includes("crítico") || rowText.includes("alto") || rowText.includes("critical") || rowText.includes("high")) {
            riskLevel = "Critical";
          } else if (rowText.includes("medio") || rowText.includes("moderado") || rowText.includes("riesgo") || rowText.includes("medium") || rowText.includes("moderate")) {
            riskLevel = "Medium";
          }

          validStudents.push({
            id: validStudents.length + 1,
            nombre: foundName,
            matricula: foundId,
            riesgo: riskLevel,
            mentor: DEFAULT_MENTOR,
            carrera: currentLang === 'es' ? 'Desarrollo de Software Multiplataforma' : 'Multiplatform Software Development',
            grado: currentLang === 'es' ? 'Cuatrimestre Actual' : 'Current Term',
            estado: currentLang === 'es' ? 'Activo' : 'Active'
          });

          extractInterviewsFromRow(cleanCells, foundId, foundName);
        }
      });

      if (validStudents.length === 0) {
        showCenteredModal(currentLang === 'es' ? 'Aviso' : 'Notice', currentLang === 'es' ? 'No se pudieron detectar registros válidos en el archivo de Excel.' : 'Could not detect valid records in the Excel file.');
        return;
      }

      const uniqueMap = new Map();
      validStudents.forEach(est => uniqueMap.set(est.matricula, est));
      state.students = Array.from(uniqueMap.values());

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
        console.error("Error saving to Firestore:", fbError);
      }

      updateAllViews();
      
      let totalInterviews = 0;
      Object.values(state.calendar.sessions).forEach(arr => totalInterviews += arr.length);
      
      const successTitle = currentLang === 'es' ? '¡Éxito!' : 'Success!';
      const successMsg = currentLang === 'es' 
        ? `Se importaron ${state.students.length} estudiantes y ${totalInterviews} entrevistas programadas al calendario.`
        : `Imported ${state.students.length} students and ${totalInterviews} scheduled interviews to the calendar.`;
      
      showCenteredModal(successTitle, successMsg);

    } catch (error) {
      console.error("Error processing Excel:", error);
      showCenteredModal(currentLang === 'es' ? 'Error' : 'Error', currentLang === 'es' ? 'Ocurrió un error al leer el archivo de Excel.' : 'An error occurred while reading the Excel file.');
    }
  };

  reader.readAsArrayBuffer(file);
}

function extractInterviewsFromRow(cells, matricula, nombre) {
  let currentYear = state.calendar.year || new Date().getFullYear();

  for (let i = 0; i < cells.length - 1; i++) {
    let monthStr = cells[i].toLowerCase().trim();
    let monthNum = MONTH_MAP[monthStr];

    if (monthNum) {
      let dayStr = cells[i + 1] ? cells[i + 1].trim() : "";
      let hourStr = cells[i + 2] ? cells[i + 2].trim() : "";

      let dayNum = parseInt(dayStr, 10);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
        let dayPadded = String(dayNum).padStart(2, '0');
        let dateKey = `${currentYear}-${monthNum}-${dayPadded}`;

        if (!state.calendar.sessions[dateKey]) {
          state.calendar.sessions[dateKey] = [];
        }

        let hourText = (hourStr && hourStr.includes(':')) ? ` - ${hourStr} hrs` : '';
        let prefix = currentLang === 'es' ? 'Entrevista' : 'Interview';
        let interviewText = `${prefix}: [${matricula}] ${nombre}${hourText}`;

        if (!state.calendar.sessions[dateKey].includes(interviewText)) {
          state.calendar.sessions[dateKey].push(interviewText);
        }
      }
    }
  }
}

function exportToExcel() {
  if (state.students.length === 0) {
    showCenteredModal(currentLang === 'es' ? 'Aviso' : 'Notice', currentLang === 'es' ? 'No hay registros para exportar.' : 'No records to export.');
    return;
  }

  const exportData = state.students.map(s => ({
    [currentLang === 'es' ? 'Estado' : 'Status']: s.estado,
    [currentLang === 'es' ? 'Nombre' : 'Name']: s.nombre,
    [currentLang === 'es' ? 'Matrícula' : 'ID']: s.matricula,
    [currentLang === 'es' ? 'Riesgo' : 'Risk']: s.riesgo,
    [currentLang === 'es' ? 'Mentor' : 'Mentor']: s.mentor,
    [currentLang === 'es' ? 'Carrera' : 'Career']: s.carrera,
    [currentLang === 'es' ? 'Grado' : 'Term']: s.grado
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, currentLang === 'es' ? "Estudiantes" : "Students");
  XLSX.writeFile(workbook, `Students_IAEV_${new Date().toISOString().split('T')[0]}.xlsx`);
}

function updateAllViews() {
  calculateMetrics();
  renderPanelTable();
  renderEstudiantesTable();
  renderRiesgoTable();
  renderCalendarGrid();
}

function calculateMetrics() {
  const totalMentorings = state.students.length;
  const mediumCount = state.students.filter(s => s.riesgo === 'Medium' || s.riesgo === 'Medio').length;
  const criticalCount = state.students.filter(s => s.riesgo === 'Critical' || s.riesgo === 'Critico' || s.riesgo === 'crítico').length;
  const totalRisk = mediumCount + criticalCount;

  const elemTotal = document.getElementById('metricTotalMentorias');
  if (elemTotal) elemTotal.textContent = totalMentorings;

  const elemRisk = document.getElementById('metricEstudiantesRiesgo');
  if (elemRisk) elemRisk.textContent = totalRisk;

  const elemMedium = document.getElementById('metricMedioCount');
  if (elemMedium) elemMedium.textContent = mediumCount;

  const elemCritical = document.getElementById('metricCriticoCount');
  if (elemCritical) elemCritical.textContent = criticalCount;

  // Update dynamic metric sublabels translation text
  const metricMediumLabelElem = document.getElementById('metricMediumLabel');
  if (metricMediumLabelElem) metricMediumLabelElem.textContent = translations[currentLang].metricMediumLabel;

  const metricCriticalLabelElem = document.getElementById('metricCriticalLabel');
  if (metricCriticalLabelElem) metricCriticalLabelElem.textContent = translations[currentLang].metricCriticalLabel;

  const metricThisWeekElem = document.getElementById('metricThisWeek');
  if (metricThisWeekElem) metricThisWeekElem.textContent = translations[currentLang].metricThisWeek;

  let totalSessions = 0;
  Object.values(state.calendar.sessions).forEach(arr => totalSessions += arr.length);
  const elemSessions = document.getElementById('metricProximasSesiones');
  if (elemSessions) elemSessions.textContent = totalSessions;
}

function createTableRow(student) {
  let riskClass = 'risk-bueno';
  let riskLabel = translations[currentLang].riskGood;
  let barColorClass = 'status-bar-green';

  const riskLower = (student.riesgo || '').toLowerCase();
  if (riskLower.includes('medium') || riskLower.includes('medio')) {
    riskClass = 'risk-medio';
    barColorClass = 'status-bar-yellow';
    riskLabel = translations[currentLang].riskMedium;
  } else if (riskLower.includes('critical') || riskLower.includes('critico') || riskLower.includes('crítico')) {
    riskClass = 'risk-critico';
    barColorClass = 'status-bar-red';
    riskLabel = translations[currentLang].riskCritical;
  }

  const btnText = translations[currentLang].viewMore;

  return `
    <tr>
      <td class="col-estado"><span class="status-indicator-bar ${barColorClass}"></span></td>
      <td class="col-nombre"><strong>${student.nombre}</strong></td>
      <td class="col-matricula">${student.matricula}</td>
      <td class="col-riesgo"><span class="risk-pill ${riskClass}">${riskLabel}</span></td>
      <td class="col-mentor">${student.mentor}</td>
      <td class="col-acciones">
        <button class="btn-ver-mas" onclick="window.viewStudentDetail(${student.id})">${btnText}</button>
      </td>
    </tr>
  `;
}

function renderPanelTable() {
  const tbody = document.getElementById('tablePanelBody');
  if (!tbody) return;
  const emptyText = translations[currentLang].noStudentsMsg;
  tbody.innerHTML = state.students.length > 0 
    ? state.students.map(createTableRow).join('') 
    : `<tr><td colspan="6" class="text-center">${emptyText}</td></tr>`;
}

function renderEstudiantesTable() {
  const tbody = document.getElementById('tableEstudiantesBody');
  if (!tbody) return;
  const emptyText = translations[currentLang].noStudentsMsg;
  tbody.innerHTML = state.students.length > 0 
    ? state.students.map(createTableRow).join('') 
    : `<tr><td colspan="6" class="text-center">${emptyText}</td></tr>`;
}

function renderRiesgoTable() {
  const tbody = document.getElementById('tableRiesgoBody');
  if (!tbody) return;
  const riesgoStudents = state.students.filter(s => s.riesgo === 'Medium' || s.riesgo === 'Critical' || s.riesgo === 'Medio' || s.riesgo === 'Critico' || s.riesgo === 'crítico');
  const emptyText = translations[currentLang].noRiskMsg;
  tbody.innerHTML = riesgoStudents.length > 0 
    ? riesgoStudents.map(createTableRow).join('') 
    : `<tr><td colspan="6" class="text-center">${emptyText}</td></tr>`;
}

window.viewStudentDetail = (id) => {
  const student = state.students.find(s => s.id === id);
  if (!student) return;

  const nameElem = document.getElementById('detailNombre');
  if (nameElem) nameElem.textContent = student.nombre;

  const estatusElem = document.getElementById('detailEstatus');
  if (estatusElem) {
    const riskText = currentLang === 'es' ? 'Riesgo' : 'Risk';
    estatusElem.textContent = `${student.estado} (${riskText}: ${student.riesgo})`;
  }

  const carreraElem = document.getElementById('detailCarrera');
  if (carreraElem) carreraElem.textContent = student.carrera;

  const gradoElem = document.getElementById('detailGrado');
  if (gradoElem) gradoElem.textContent = student.grado;

  document.querySelectorAll('.content-area .view-section').forEach(v => v.classList.add('hidden'));
  document.getElementById('detalleEstudianteView')?.classList.remove('hidden');
};

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
        const noMatchText = currentLang === 'es' ? 'No se encontraron coincidencias.' : 'No matches found.';
        tbody.innerHTML = filtered.length > 0 
          ? filtered.map(createTableRow).join('') 
          : `<tr><td colspan="6" class="text-center">${noMatchText}</td></tr>`;
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
    cell.style.cssText = `min-height: 90px; padding: 8px; border: 1px solid var(--border-color, #e5e7eb); display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; border-radius: 6px; transition: background 0.2s;`;

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const daySessions = state.calendar.sessions[dateKey] || [];
    const count = daySessions.length;

    const sessionLabel = currentLang === 'es' ? 'sesión(es)' : 'session(s)';
    const noSessionLabel = currentLang === 'es' ? 'Sin sesiones' : 'No sessions';
    const actionLabel = count > 0 ? (currentLang === 'es' ? 'Ver / Editar' : 'View / Edit') : (currentLang === 'es' ? '+ Agregar' : '+ Add');

    let badgeHTML = count > 0 
      ? `<div style="background: rgba(234, 179, 8, 0.2); color: #eab308; border: 1px solid #eab308; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; text-align: center; margin-top: 5px;">${count} ${sessionLabel}</div>` 
      : `<div style="font-size: 10px; opacity: 0.5; text-align: center; margin-top: 5px;">${noSessionLabel}</div>`;

    cell.innerHTML = `
      <div style="font-weight: bold; font-size: 13px;">${day}</div>
      <div>${badgeHTML}</div>
      <div style="font-size: 10px; color: #eab308; text-align: right; font-weight: 500;">${actionLabel}</div>
    `;

    cell.addEventListener('click', () => {
      openCalendarDayModal(dateKey, daySessions);
    });

    grid.appendChild(cell);
  }
}

function openCalendarDayModal(dateKey, sessions) {
  let existingModal = document.getElementById('calendarDayModal');
  if (existingModal) existingModal.remove();

  const isDark = document.body.classList.contains("dark-mode");
  const bgCard = isDark ? "#1f2937" : "#ffffff";
  const textColor = isDark ? "#f3f4f6" : "#333333";
  const itemBg = isDark ? "#111827" : "rgba(0,0,0,0.04)";
  const inputBg = isDark ? "#111827" : "#ffffff";
  const inputBorder = isDark ? "#374151" : "#ccc";

  const editBtnText = currentLang === 'es' ? 'Editar' : 'Edit';
  const deleteBtnText = currentLang === 'es' ? 'Eliminar' : 'Delete';
  const noSessionsMsg = currentLang === 'es' ? 'No hay sesiones o recordatorios para este día.' : 'No sessions or reminders for this day.';
  const placeholderText = currentLang === 'es' ? 'Agregar nueva sesión o recordatorio...' : 'Add new session or reminder...';
  const addBtnText = currentLang === 'es' ? '+ Agregar Recordatorio' : '+ Add Reminder';
  const closeBtnText = currentLang === 'es' ? 'Cerrar' : 'Close';
  const modalTitleText = currentLang === 'es' ? `📅 Gestión del Día: ${dateKey}` : `📅 Day Management: ${dateKey}`;

  let listHTML = sessions.length > 0 
    ? sessions.map((s, idx) => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: ${itemBg}; padding: 10px; border-radius: 6px; margin-bottom: 8px; border: 1px solid ${isDark ? '#374151' : 'transparent'};">
          <span style="font-size: 12px; text-align: left; flex: 1; overflow: hidden; text-overflow: ellipsis; margin-right: 8px; color: ${textColor};">${s}</span>
          <button onclick="window.editReminder('${dateKey}', ${idx})" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">${editBtnText}</button>
          <button onclick="window.deleteReminder('${dateKey}', ${idx})" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 4px;">${deleteBtnText}</button>
        </div>
      `).join('')
    : `<p style="font-size: 13px; opacity: 0.7; margin: 15px 0; color: ${textColor};">${noSessionsMsg}</p>`;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'calendarDayModal';
  modalOverlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center;
    align-items: center; z-index: 9999;
  `;

  modalOverlay.innerHTML = `
    <div style="background: ${bgCard}; color: ${textColor}; padding: 25px; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; font-family: inherit; border: 1px solid ${isDark ? '#374151' : 'transparent'};">
      <h3 style="margin-top: 0; color: #eab308; margin-bottom: 10px;">${modalTitleText}</h3>
      <div style="max-height: 220px; overflow-y: auto; margin-bottom: 15px; padding-right: 5px;">
        ${listHTML}
      </div>
      <div style="border-top: 1px solid ${isDark ? '#374151' : 'rgba(0,0,0,0.1)'}; padding-top: 12px; margin-bottom: 15px;">
        <input type="text" id="nuevoRecordatorioInput" placeholder="${placeholderText}" style="width: 100%; padding: 9px; background: ${inputBg}; color: ${textColor}; border: 1px solid ${inputBorder}; border-radius: 6px; font-size: 12px; margin-bottom: 8px;">
        <button id="addReminderBtn" style="width: 100%; padding: 9px; background: #22c55e; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;">${addBtnText}</button>
      </div>
      <button id="closeCalendarModalBtn" style="padding: 8px 20px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">${closeBtnText}</button>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  document.getElementById('addReminderBtn').addEventListener('click', () => {
    const input = document.getElementById('nuevoRecordatorioInput');
    const val = input.value.trim();
    if (val) {
      if (!state.calendar.sessions[dateKey]) {
        state.calendar.sessions[dateKey] = [];
      }
      state.calendar.sessions[dateKey].push(val);
      modalOverlay.remove();
      renderCalendarGrid();
      calculateMetrics();
      showCenteredModal(currentLang === 'es' ? 'Éxito' : 'Success', currentLang === 'es' ? 'Recordatorio agregado exitosamente.' : 'Reminder added successfully.');
    }
  });

  document.getElementById('closeCalendarModalBtn').addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });
}

window.editReminder = (dateKey, index) => {
  const currentVal = state.calendar.sessions[dateKey][index];
  const promptText = currentLang === 'es' ? 'Editar recordatorio o sesión:' : 'Edit reminder or session:';
  const newVal = prompt(promptText, currentVal);
  if (newVal !== null && newVal.trim() !== "") {
    state.calendar.sessions[dateKey][index] = newVal.trim();
    document.getElementById('calendarDayModal')?.remove();
    renderCalendarGrid();
    calculateMetrics();
    showCenteredModal(currentLang === 'es' ? 'Éxito' : 'Success', currentLang === 'es' ? 'Recordatorio actualizado.' : 'Reminder updated.');
  }
};

window.deleteReminder = (dateKey, index) => {
  const confirmText = currentLang === 'es' ? '¿Está seguro de que desea eliminar este recordatorio?' : 'Are you sure you want to delete this reminder?';
  if (confirm(confirmText)) {
    state.calendar.sessions[dateKey].splice(index, 1);
    if (state.calendar.sessions[dateKey].length === 0) {
      delete state.calendar.sessions[dateKey];
    }
    document.getElementById('calendarDayModal')?.remove();
    renderCalendarGrid();
    calculateMetrics();
    showCenteredModal(currentLang === 'es' ? 'Éxito' : 'Success', currentLang === 'es' ? 'Recordatorio eliminado.' : 'Reminder deleted.');
  }
};

// =========================================================================
// TERMS AND CONDITIONS WINDOW (WITH DARK MODE SUPPORT)
// =========================================================================
const termsContentTextEs = `TÉRMINOS Y CONDICIONES DE MENTORÍAS IAEV\n
Bienvenido al sistema de GESTIÓN DE MENTORÍAS IAEV de la Universidad Politécnica de Gómez Palacio (UPGOP). Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones[cite: 2].\n\n
1. Definiciones: Plataforma, Usuario, Mentor, Tutorado, Administrador[cite: 2].\n
2. Purpose: Facilitar la programación, administración, seguimiento y comunicación[cite: 2].\n
3. Registro de Usuario: Se requiere crear una cuenta con información verídica[cite: 2].\n
4. Uso Permitido: Responsable y en cumplimiento con la legislación aplicable[cite: 2].\n
5. Mentorías: Contacto y gestión, sin garantizar resultados específicos[cite: 2].\n
6. Programación y Cancelaciones: Aviso previo mínimo de 24 horas[cite: 2].\n
7. Propiedad Intelectual: Contenido protegido por las leyes aplicables[cite: 2].\n
8. Protección de Datos Personales: Tratados de acuerdo con la normativa[cite: 2].\n
9. Limitación de Responsabilidad: Exento por decisiones o interrupciones técnicas[cite: 2].\n
10. Modificaciones: Sujeto a actualizaciones en el sitio web[cite: 2].`;

const termsContentTextEn = `IAEV MENTORSHIPS TERMS AND CONDITIONS\n
Welcome to GESTION DE MENTORIAS IAEV of the Universidad Politécnica de Gómez Palacio (UPGOP). By accessing and using this website, you agree to comply with and be bound by the following terms and conditions[cite: 2].\n\n
1. Definitions: Platform, User, Mentor, Mentee, Administrator[cite: 2].\n
2. Purpose: To facilitate scheduling, administration, tracking, and communication[cite: 2].\n
3. User Registration: Creating an account with truthful information is required[cite: 2].\n
4. Permitted Use: Responsible and in compliance with applicable legislation[cite: 2].\n
5. Mentorships: Contact and management, without guaranteeing specific results[cite: 2].\n
6. Scheduling and Cancellations: Minimum 24 hours advance notice[cite: 2].\n
7. Intellectual Property: Content protected by applicable laws[cite: 2].\n
8. Personal Data Protection: Treated in accordance with regulations[cite: 2].\n
9. Limitation of Liability: Exempt for decisions or technical interruptions[cite: 2].\n
10. Modifications: Subject to updates on the website[cite: 2].`;

function initTermsModal() {
  const termsTriggers = document.querySelectorAll('[data-i18n="termsAndConditions"], #btnTerms, .btn-terms');
  
  let modal = document.getElementById('termsModal');
  if (!modal) {
    const isDark = document.body.classList.contains("dark-mode");
    const bgCard = isDark ? "#1f2937" : "#ffffff";
    const textColor = isDark ? "#f3f4f6" : "#333333";

    const termsText = currentLang === 'es' ? termsContentTextEs : termsContentTextEn;
    const modalTitle = currentLang === 'es' ? "Términos y Condiciones - IAEV" : "Terms and Conditions - IAEV";
    const closeText = currentLang === 'es' ? "Cerrar" : "Close";

    const modalHTML = `
      <div id="termsModal" class="terms-modal hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 9999;">
        <div id="termsModalContent" style="background: ${bgCard}; color: ${textColor}; padding: 30px; border-radius: 12px; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid ${isDark ? '#374151' : 'transparent'};">
          <h3 style="margin-top: 0; color: #eab308;">${modalTitle}</h3>
          <div id="termsTextDiv" style="font-size: 13px; line-height: 1.6; white-space: pre-line; margin: 15px 0;">${termsText}</div>
          <button class="close-terms-btn" style="padding: 8px 20px; background: #eab308; color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">${closeText}</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('termsModal');
  }

  const closeBtn = modal.querySelector('.close-terms-btn');

  termsTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isDarkNow = document.body.classList.contains("dark-mode");
      const contentDiv = document.getElementById('termsModalContent');
      const textDiv = document.getElementById('termsTextDiv');
      
      if (contentDiv) {
        contentDiv.style.background = isDarkNow ? "#1f2937" : "#ffffff";
        contentDiv.style.color = isDarkNow ? "#f3f4f6" : "#333333";
        contentDiv.style.border = isDarkNow ? "1px solid #374151" : "none";
      }

      if (textDiv) {
        textDiv.textContent = currentLang === 'es' ? termsContentTextEs : termsContentTextEn;
      }

      modal.style.display = 'flex';
      modal.classList.add('flex');
      modal.classList.remove('hidden');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  });
}