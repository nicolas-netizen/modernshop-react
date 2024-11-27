import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProductDetail = () => {
  const { id } = useParams();
  const { products, checkStock } = useProductStore();
  const { addToCart, items } = useCartStore();
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  const currentCartQuantity = items.find(item => item.productId === id)?.quantity || 0;

  const handleAddToCart = () => {
    if (!checkStock(product.id, currentCartQuantity + quantity)) {
      toast.error('No hay suficiente stock disponible');
      return;
    }
    
    addToCart(product.id, quantity);
    toast.success('Producto agregado al carrito');
  };

  // Simular múltiples imágenes (en producción, esto vendría del producto)
  const images = [product.imageUrl];
  if (product.imageUrl) {
    // Agregar la misma imagen varias veces para simular galería
    images.push(product.imageUrl);
    images.push(product.imageUrl);
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-indigo-600">Inicio</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600">Productos</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Galería de Imágenes */}
            <div className="space-y-4">
              {/* Imagen Principal */}
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain object-center"
                />
              </div>

              {/* Miniaturas */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 ${
                      selectedImage === image ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain object-center"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Información del Producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(128 reseñas)</span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.price < 100 && (
                    <span className="text-lg text-gray-500 line-through">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.price < 100 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    Ahorra 20%
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">{product.description || 'Sin descripción disponible.'}</p>
                
                {/* Stock Status */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 10 
                    ? 'En stock'
                    : product.stock > 0
                    ? `¡Solo quedan ${product.stock} unidades!`
                    : 'Sin stock'}
                </div>
                
                {/* Características */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-green-500" />
                    <span>Envío gratis en 24/48h</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span>Garantía de 2 años</span>
                  </div>
                </div>

                {/* Selector de Cantidad */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">Cantidad:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Botón de Compra */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Sin stock disponible' : `Agregar ${quantity} al Carrito`}
                  </button>
                  <Link
                    to="/cart"
                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-center"
                  >
                    Comprar Ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Características Detalladas */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones</h3>
            <ul className="space-y-3 text-gray-600">
              <li>Material: Premium</li>
              <li>Dimensiones: Estándar</li>
              <li>Peso: Ligero</li>
              <li>Garantía: 2 años</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Envío</h3>
            <ul className="space-y-3 text-gray-600">
              <li>Envío gratis en pedidos +$50</li>
              <li>Entrega en 24/48 horas</li>
              <li>Seguimiento en tiempo real</li>
              <li>Envíos internacionales</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Devoluciones</h3>
            <ul className="space-y-3 text-gray-600">
              <li>30 días de devolución</li>
              <li>Proceso simple</li>
              <li>Reembolso garantizado</li>
              <li>Soporte 24/7</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
