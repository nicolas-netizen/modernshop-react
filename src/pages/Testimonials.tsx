import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "María González",
    role: "Cliente Verificado",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "Increíble experiencia de compra. Los productos son de excelente calidad y el servicio al cliente es excepcional.",
    rating: 5
  },
  {
    name: "Juan Pérez",
    role: "Cliente Premium",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "ModernShop ha superado todas mis expectativas. La entrega fue rápida y el empaque muy profesional.",
    rating: 5
  },
  {
    name: "Ana Martínez",
    role: "Cliente Frecuente",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "Los precios son muy competitivos y la variedad de productos es impresionante. ¡Totalmente recomendado!",
    rating: 4
  }
];

export const Testimonials = () => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Descubre por qué miles de clientes confían en ModernShop para sus compras en línea
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-indigo-600 mb-4" />
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Ya eres cliente de ModernShop?
          </h2>
          <p className="text-gray-600 mb-8">
            Comparte tu experiencia y ayuda a otros a tomar la mejor decisión
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
            Escribir una reseña
          </button>
        </div>
      </div>
    </div>
  );
};
