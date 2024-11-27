import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';

interface ProductGridProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onDelete,
  onEdit,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative aspect-square">
            <img
              src={product.imageUrl || '/placeholder-product.png'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.png';
              }}
            />
            <div className="absolute top-2 right-2">
              {product.stock < 10 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Low Stock: {product.stock}
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">
                Stock: {product.stock}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit product"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete product"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <Link
                to={`/admin/products/${product.id}`}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                title="View details"
              >
                <Eye size={18} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
