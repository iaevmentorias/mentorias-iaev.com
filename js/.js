// Importar funciones principales de Firebase y Autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Configuración de tu proyecto en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDiF249Hc2oId_ouLgMH9QkAl8PPH6HHp0",
  authDomain: "mentorias-iaev-c9815.firebaseapp.com",
  projectId: "mentorias-iaev-c9815",
  storageBucket: "mentorias-iaev-c9815.firebasestorage.app",
  messagingSenderId: "535210347796",
  appId: "1:535210347796:web:353db2779c7d58c0380601",
  measurementId: "G-HGT9XLCK6G"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar el servicio de Autenticación
const auth = getAuth(app);

// Capturar el formulario e interactuar con el usuario
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que la página se recargue

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Intento de inicio de sesión con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    alert(`¡Bienvenido/a ${user.email}!`);
    console.log("Usuario autenticado:", user);

    // Aquí puedes redireccionar al usuario a su panel/dashboard
    // window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Error al iniciar sesión:", error.code, error.message);
    
    // Manejo básico de errores comunes
    if (error.code === 'auth/invalid-credential') {
      alert("Correo o contraseña incorrectos.");
    } else {
      alert("Ocurrió un error al intentar iniciar sesión.");
    }
  }
});