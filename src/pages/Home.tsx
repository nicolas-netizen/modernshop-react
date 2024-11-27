import React from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const Home = () => {
  const { products } = useProductStore();
  const { addToCart } = useCartStore();

  // Obtener solo los productos destacados (los primeros 4 productos)
  const featuredProducts = products.slice(0, 4);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
      addToCart(productId);
      toast.success('Producto agregado al carrito');
    } else {
      toast.error('Producto sin stock disponible');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              Bienvenido a ModernShop
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8 sm:mb-10">
              Descubre nuestra selección de productos de alta calidad
            </p>
            <div>
              <Link
                to="/products"
                className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Ver Productos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center sm:text-left">
          Productos Destacados
        </h2>
        
        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos destacados</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vuelve más tarde para ver nuestros productos destacados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-3 sm:p-4">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className="block group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base sm:text-lg font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm transition-colors duration-200 ${
                        product.stock === 0 
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {product.stock === 0 ? 'Sin stock' : 'Agregar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Envío Gratis</h3>
              <p className="text-sm text-gray-500">En todos tus pedidos superiores a $50</p>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Calidad Garantizada</h3>
              <p className="text-sm text-gray-500">Todos nuestros productos son de alta calidad</p>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Soporte 24/7</h3>
              <p className="text-sm text-gray-500">Estamos aquí para ayudarte en todo momento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};