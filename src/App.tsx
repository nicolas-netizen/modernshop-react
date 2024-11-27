import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from './store/useAuthStore';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

// Componente para manejar la navegación condicional
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {!isAdminRoute && <Navbar />}
      <div className={!isAdminRoute ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const { login } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verificar permisos de administrador
          const adminDoc1 = await getDoc(doc(db, 'admins', user.uid));
          const adminDoc2 = await getDoc(doc(db, 'Admins', user.uid));
          
          const isAdmin = (adminDoc1.exists() && adminDoc1.data()?.role === 'admin') ||
                         (adminDoc2.exists() && adminDoc2.data()?.role === 'admin');

          if (isAdmin) {
            login({
              email: user.email || '',
              role: 'admin',
              uid: user.uid,
              isAdmin: true
            });
          }
        } catch (error) {
          console.error('Error al verificar permisos:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [login]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;