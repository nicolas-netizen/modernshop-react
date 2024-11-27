import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  categories: string[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  updateStock: (productId: string, quantity: number) => void;
  checkStock: (productId: string, quantity: number) => boolean;
}

// Productos de ejemplo
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone XYZ',
    description: 'Un teléfono inteligente de última generación con características increíbles.',
    price: 699.99,
    category: 'Electrónicos',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Laptop Pro',
    description: 'Laptop profesional para trabajo y entretenimiento.',
    price: 1299.99,
    category: 'Electrónicos',
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Camiseta Premium',
    description: 'Camiseta de algodón 100% de alta calidad.',
    price: 29.99,
    category: 'Ropa',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Reloj Elegante',
    description: 'Reloj de diseño elegante con funciones inteligentes.',
    price: 199.99,
    category: 'Accesorios',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      categories: ['Electrónicos', 'Ropa', 'Accesorios'],

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          stock: productData.stock || 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          products: [...state.products, newProduct]
        }));
      },

      updateProduct: (updatedProduct) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id
              ? { ...updatedProduct, updatedAt: new Date() }
              : product
          )
        }));
      },

      updateStock: (productId: string, quantity: number) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { 
                  ...product, 
                  stock: Math.max(0, product.stock - quantity),
                  updatedAt: new Date() 
                }
              : product
          )
        }));
      },

      checkStock: (productId: string, quantity: number) => {
        const product = get().products.find(p => p.id === productId);
        return product ? product.stock >= quantity : false;
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id)
        }));
      },

      addCategory: (category) => {
        set((state) => {
          if (state.categories.includes(category)) {
            throw new Error('La categoría ya existe');
          }
          return {
            categories: [...state.categories, category]
          };
        });
      },

      deleteCategory: (category) => {
        set((state) => {
          const isInUse = state.products.some(product => product.category === category);
          if (isInUse) {
            throw new Error('No se puede eliminar una categoría que está en uso');
          }
          return {
            categories: state.categories.filter((cat) => cat !== category)
          };
        });
      }
    }),
    {
      name: 'product-storage'
    }
  )
);