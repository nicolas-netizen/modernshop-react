import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalItems } = useCartStore();
  const { products } = useProductStore();
  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
            <h2 className="text-2xl font-bold mb-4">Tu Carrito está Vacío</h2>
            <p className="text-gray-600 mb-6">Agrega algunos productos a tu carrito para continuar comprando.</p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Carrito de Compras</h2>
          <span className="text-gray-600">({totalItems} productos)</span>
        </div>
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              return (
                <li key={item.productId} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-xl">${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Proceder al Pago
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};