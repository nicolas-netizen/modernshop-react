import React from 'react';
import { Building2, Users, Trophy, Heart, Truck, Headphones } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Empresa Confiable",
      description: "Más de 5 años brindando excelencia en servicio y productos de calidad."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Clientes Satisfechos",
      description: "Miles de clientes confían en nosotros para sus compras diarias."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Calidad Garantizada",
      description: "Todos nuestros productos pasan por rigurosos controles de calidad."
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Pasión",
      description: "Amamos lo que hacemos y nos esforzamos por la excelencia."
    },
    {
      icon: <Truck className="w-6 h-6 text-green-500" />,
      title: "Eficiencia",
      description: "Entregas rápidas y servicio confiable en todo momento."
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-500" />,
      title: "Atención",
      description: "Soporte personalizado para cada uno de nuestros clientes."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Descubre ModernShop
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-indigo-100">
            Tu destino de compras en línea preferido, donde la innovación se encuentra con la calidad.
          </p>
        </div>
        <div className="absolute bottom-0 w-full">
          <svg className="w-full h-12 text-white" preserveAspectRatio="none" viewBox="0 0 1440 74">
            <path fill="currentColor" d="M0,0 C240,70 480,70 720,30 C960,-10 1200,-10 1440,30 L1440,74 L0,74 Z" />
          </svg>
        </div>
      </div>

      {/* Nuestra Historia */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Desde nuestros humildes comienzos en 2018, nos hemos convertido en uno de los 
            líderes del comercio electrónico en la región, sirviendo a miles de clientes 
            satisfechos con productos de alta calidad y un servicio excepcional.
          </p>
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-indigo-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Nuestros Valores */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-indigo-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas Ayuda?</h2>
          <p className="text-gray-600 mb-6">
            Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier consulta
          </p>
          <a 
            href="mailto:support@modernshop.com" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            Contáctanos
          </a>
        </div>
      </section>
    </div>
  );
};
