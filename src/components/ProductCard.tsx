import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
    toast.success('Producto agregado al carrito');
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors duration-200"
          aria-label="Agregar al carrito"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-1">
          {product.name}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
          {product.description}
        </p>
        
        <p className="text-base font-medium text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};