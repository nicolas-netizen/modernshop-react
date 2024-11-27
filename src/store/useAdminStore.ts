import { create } from 'zustand';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Order } from '../types';
import toast from 'react-hot-toast';

interface AdminStore {
  products: Product[];
  orders: Order[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  products: [],
  orders: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      set({ products });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar los productos');
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      set({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (productData) => {
    set({ loading: true });
    try {
      const newProduct = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await addDoc(collection(db, 'products'), newProduct);
      toast.success('Producto agregado exitosamente');
      await get().fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar el producto');
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true });
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date()
      });
      toast.success('Producto actualizado exitosamente');
      await get().fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Producto eliminado exitosamente');
      await get().fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ loading: true });
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
      toast.success('Estado del pedido actualizado');
      await get().fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado del pedido');
    } finally {
      set({ loading: false });
    }
  },
}));
