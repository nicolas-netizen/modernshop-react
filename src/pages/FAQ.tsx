import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const faqs = [
  {
    category: "Envíos",
    questions: [
      {
        q: "¿Cuánto tiempo tarda el envío?",
        a: "Los envíos nacionales suelen tardar entre 2-3 días hábiles. Para envíos internacionales, el tiempo estimado es de 7-14 días hábiles."
      },
      {
        q: "¿Hacen envíos internacionales?",
        a: "Sí, realizamos envíos a más de 50 países. Los costos y tiempos varían según el destino."
      },
      {
        q: "¿Cómo puedo rastrear mi pedido?",
        a: "Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de seguimiento y las instrucciones para rastrearlo."
      }
    ]
  },
  {
    category: "Pagos",
    questions: [
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos tarjetas de crédito/débito (Visa, MasterCard, American Express), PayPal, y transferencias bancarias."
      },
      {
        q: "¿Es seguro comprar en ModernShop?",
        a: "Sí, utilizamos encriptación SSL de 256 bits y cumplimos con todos los estándares de seguridad PCI DSS para proteger tus datos."
      }
    ]
  },
  {
    category: "Devoluciones",
    questions: [
      {
        q: "¿Cuál es la política de devoluciones?",
        a: "Tienes 30 días desde la recepción del producto para solicitar una devolución. El producto debe estar sin usar y en su empaque original."
      },
      {
        q: "¿Cómo solicito una devolución?",
        a: "Puedes iniciar una devolución desde tu cuenta en la sección 'Mis Pedidos' o contactando a nuestro servicio al cliente."
      }
    ]
  }
];

export const FAQ = () => {
  const [activeQuestions, setActiveQuestions] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleQuestion = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setActiveQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Buscar en las preguntas frecuentes..."
            className="flex-1 outline-none text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredFaqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, index) => {
                const key = `${category.category}-${index}`;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <button
                      className="w-full px-6 py-4 flex justify-between items-center"
                      onClick={() => toggleQuestion(category.category, index)}
                    >
                      <span className="text-left font-medium text-gray-900">{faq.q}</span>
                      {activeQuestions[key] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {activeQuestions[key] && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div className="mt-16 text-center p-8 bg-indigo-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600 mb-6">
            Nuestro equipo de soporte está disponible 24/7 para responder todas tus preguntas
          </p>
          <a
            href="mailto:support@modernshop.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>
  );
};
