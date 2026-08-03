import { 
  getAuth, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/* ==========================================================================
   1. DICCIONARIO DE TRADUCCIONES UNIFICADO
   ========================================================================== */
const translations = {
  es: {
    // Interfaz general / Navegación
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

    // Panel de Control / Métricas
    titleQuickMetrics: "Métricas rápidas",
    metricActiveMentorships: "Total de mentorías activas",
    metricRiskStudents: "Estudiantes en riesgo",
    riskMedium: "Medio",
    riskCritical: "Crítico",
    metricUpcomingSessions: "Próximas sesiones",
    metricThisWeek: "esta semana",
    titleAcademicRiskStatus: "Estado de Riesgo Académico de Estudiantes",

    // Tablas
    thStatus: "Estado",
    thStudentName: "Nombre del Estudiante",
    thId: "Matrícula",
    thRiskLevel: "Nivel de Riesgo",
    thMentor: "Mentor",
    thActions: "Acciones",
    titleStudentStatus: "Estatus de los Estudiantes",
    titleRiskStudentsList: "Alumnos Que Están En Riesgo Académico",

    // Calendario
    titleSessionsCalendar: "Calendario de Sesiones",
    btnPrev: "< Anterior",
    btnNext: "Siguiente >",
    mJan: "Enero", mFeb: "Febrero", mMar: "Marzo", mApr: "Abril",
    mMay: "Mayo", mJun: "Junio", mJul: "Julio", mAug: "Agosto",
    mSep: "Septiembre", mOct: "Octubre", mNov: "Noviembre", mDec: "Diciembre",
    daySun: "Dom", dayMon: "Lun", dayTue: "Mar", dayWed: "Mié", dayThu: "Jue", dayFri: "Vie", daySat: "Sáb",

    // Importación y Exportación
    titleDataImportExport: "Importación y Exportación de Datos",
    dropzoneTitle: "Arrastrar y soltar archivo aquí",
    dropzoneSubtitle: "o haz clic para seleccionar archivo (Excel)",
    titleSelectedFiles: "Archivos Seleccionados",
    noFilesSelected: "Aún no hay archivos seleccionados",
    btnUpload: "Subir",
    titleDownloadList: "Descargar de listado de estudiantes (Excel)",
    btnExport: "Exportar",

    // Configuración
    titleConfigPanel: "Panel de Configuración",
    btnPassword: "Cambiar contraseñas",
    btnLanguage: "Idiomas",
    btnTheme: "Temas",

    // Perfil y Detalle
    btnBack: "Volver",
    lblStudentNameDetail: "Nombre del Alumno:",
    lblStatusDetail: "Estatus:",
    lblCareerDetail: "Carrera:",
    lblGradeDetail: "Grado y sección:",

    // Modales y Mensajes de Contraseña
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
    // Interfaz general / Navegación
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

    // Panel de Control / Métricas
    titleQuickMetrics: "Quick Metrics",
    metricActiveMentorships: "Total active mentorships",
    metricRiskStudents: "Students at risk",
    riskMedium: "Medium",
    riskCritical: "Critical",
    metricUpcomingSessions: "Upcoming sessions",
    metricThisWeek: "this week",
    titleAcademicRiskStatus: "Student Academic Risk Status",

    // Tablas
    thStatus: "Status",
    thStudentName: "Student Name",
    thId: "ID Number",
    thRiskLevel: "Risk Level",
    thMentor: "Mentor",
    thActions: "Actions",
    titleStudentStatus: "Student Status",
    titleRiskStudentsList: "Students at Academic Risk",

    // Calendario
    titleSessionsCalendar: "Sessions Calendar",
    btnPrev: "< Previous",
    btnNext: "Next >",
    mJan: "January", mFeb: "February", mMar: "March", mApr: "April",
    mMay: "May", mJun: "June", mJul: "July", mAug: "August",
    mSep: "September", mOct: "October", mNov: "November", mDec: "December",
    daySun: "Sun", dayMon: "Mon", dayTue: "Tue", dayWed: "Wed", dayThu: "Thu", dayFri: "Fri", daySat: "Sat",

    // Importación y Exportación
    titleDataImportExport: "Data Import and Export",
    dropzoneTitle: "Drag and drop file here",
    dropzoneSubtitle: "or click to select file (Excel)",
    titleSelectedFiles: "Selected Files",
    noFilesSelected: "No files selected yet",
    btnUpload: "Upload",
    titleDownloadList: "Download student list (Excel)",
    btnExport: "Export",

    // Configuración
    titleConfigPanel: "Settings Panel",
    btnPassword: "Change password",
    btnLanguage: "Languages",
    btnTheme: "Themes",

    // Perfil y Detalle
    btnBack: "Back",
    lblStudentNameDetail: "Student Name:",
    lblStatusDetail: "Status:",
    lblCareerDetail: "Major:",
    lblGradeDetail: "Grade and section:",

    // Modales y Mensajes de Contraseña
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

/* ==========================================================================
   2. ESTADO GLOBAL E INICIALIZACIÓN
   ========================================================================== */
let currentLang = localStorage.getItem("app_lang") || "es";

document.addEventListener("DOMContentLoaded", () => {
  // Cargar tema guardado
  if (localStorage.getItem("app_theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  // Cargar idioma guardado
  applyLanguage(currentLang);

  // Asignar Event Listeners con los IDs exactos del HTML
  const btnPassword = document.getElementById("btn-change-password");
  const btnLanguage = document.getElementById("btn-change-language");
  const btnTheme = document.getElementById("btn-change-theme");

  if (btnPassword) btnPassword.addEventListener("click", openPasswordModal);
  if (btnLanguage) btnLanguage.addEventListener("click", toggleLanguage);
  if (btnTheme) btnTheme.addEventListener("click", toggleTheme);
});

/* ==========================================================================
   3. FUNCIONES DE CONFIGURACIÓN
   ========================================================================== */

// Alternar Tema (Claro / Oscuro)
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("app_theme", isDark ? "dark" : "light");
}

// Alternar Idioma (Español / Inglés)
function toggleLanguage() {
  currentLang = currentLang === "es" ? "en" : "es";
  localStorage.setItem("app_lang", currentLang);
  applyLanguage(currentLang);
}

// Aplicar Traducciones a la Interfaz
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

/* ==========================================================================
   4. MODAL DE CAMBIO DE CONTRASEÑA (SweetAlert2)
   ========================================================================== */
async function openPasswordModal(e) {
  if (e) e.preventDefault(); // Previene recargar la página si el botón está dentro de un form

  const t = translations[currentLang];

  // Verificamos si SweetAlert2 está cargado
  if (typeof Swal === "undefined") {
    alert("SweetAlert2 no se ha cargado correctamente.");
    return;
  }

  // Intentamos obtener el usuario actual de Firebase de forma segura
  let user = null;
  try {
    const auth = getAuth();
    user = auth.currentUser;
  } catch (err) {
    console.warn("Firebase Auth no está inicializado aún:", err);
  }

  // Desplegar el modal con los 3 campos
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

  // Si el usuario presionó 'Guardar'
  if (formValues) {
    if (!user) {
      Swal.fire("Atención", t.noUser, "warning");
      return;
    }

    try {
      // 1. Reautenticar
      const credential = EmailAuthProvider.credential(user.email, formValues.currentPass);
      await reauthenticateWithCredential(user, credential);

      // 2. Actualizar contraseña
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