import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
          <p className="text-gray-600 mb-8">
            Tu orden ha sido procesada con éxito. Te enviaremos un email con los detalles de tu pedido.
          </p>
          <div className="space-y-4">
            <Link
              to="/products"
              className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Continuar Comprando
            </Link>
            <Link
              to="/"
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};