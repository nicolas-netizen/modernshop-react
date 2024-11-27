import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const setupAdmin = async () => {
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

// Ejecuta esta función una vez para configurar el admin
setupAdmin();
