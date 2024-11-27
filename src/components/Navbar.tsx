import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { CartWidget } from './CartWidget';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="bg-white shadow fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">ModernShop</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Inicio
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900">
                Productos
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CartWidget />
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogIn className="h-5 w-5" />
                <span>Iniciar Sesión</span>
              </Link>
            ) : (
              <>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};