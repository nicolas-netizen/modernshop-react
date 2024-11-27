import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACqp9gWhlw1-GeaVVD0dhTPp5OM7KuGVQ",
  authDomain: "proyect-b4502.firebaseapp.com",
  projectId: "proyect-b4502",
  storageBucket: "proyect-b4502.firebasestorage.app",
  messagingSenderId: "2302127202",
  appId: "1:2302127202:web:0fc8674dc6688fe22e753b",
  measurementId: "G-KQYQN367RB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = 'admin@modernshop.com';
const password = 'Admin123!';

async function createAdminUser() {
  try {
    // Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Crear documento en la colección 'admins'
    await setDoc(doc(db, 'admins', uid), {
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    console.log('Usuario administrador creado exitosamente');
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
    if (error.code === 'auth/email-already-in-use') {
      console.log('El usuario ya existe. Puedes usar las credenciales proporcionadas para iniciar sesión.');
    }
  }
}

createAdminUser();
