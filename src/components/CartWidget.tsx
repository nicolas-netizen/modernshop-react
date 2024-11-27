import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const CartWidget: React.FC = () => {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <Link to="/cart" className="relative p-2">
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};
