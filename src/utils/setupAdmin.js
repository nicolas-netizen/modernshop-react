const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyACqp9gWhlw1-GeaVVD0dhTPp5OM7KuGVQ",
  authDomain: "proyect-b4502.firebaseapp.com",
  projectId: "proyect-b4502",
  storageBucket: "proyect-b4502.appspot.com",
  messagingSenderId: "2302127202",
  appId: "1:2302127202:web:0fc8674dc6688fe22e753b",
  measurementId: "G-KQYQN367RB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const setupAdmin = async () => {
  const uid = 'vYaJEFwIbgNPAYW6Dplx465sPpu2';
  const userRef = doc(db, 'users', uid);
  
  try {
    await setDoc(userRef, {
      email: 'admin@modernshop.com',
      role: 'admin',
      isAdmin: true
    }, { merge: true });
    console.log('Admin user configured successfully');
  } catch (error) {
    console.error('Error configuring admin user:', error);
  }
};

setupAdmin();
