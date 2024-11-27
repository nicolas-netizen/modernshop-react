import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, getDoc } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyACqp9gWhlw1-GeaVVD0dhTPp5OM7KuGVQ",
  authDomain: "proyect-b4502.firebaseapp.com",
  projectId: "proyect-b4502",
  storageBucket: "proyect-b4502.appspot.com",
  messagingSenderId: "2302127202",
  appId: "1:2302127202:web:0fc8674dc6688fe22e753b",
  measurementId: "G-KQYQN367RB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configurar persistencia de autenticación
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Exportar
export { auth, db, storage, doc, getDoc };

// Removemos analytics ya que no lo necesitamos por ahora
