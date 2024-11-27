import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '../types';
import { utils, writeFile } from 'xlsx';
import { sendOrderNotification } from '../services/emailService';
import { useSettingsStore } from './useSettingsStore';
import { useProductStore } from './useProductStore';

interface OrderState {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByDate: (startDate: string, endDate: string) => Order[];
  exportToExcel: (startDate: string, endDate: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: async (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          orders: [...state.orders, newOrder]
        }));

        // Enviar notificación por correo
        try {
          const storeEmail = useSettingsStore.getState().storeEmail;
          if (storeEmail) {
            await sendOrderNotification(newOrder, storeEmail);
          }
        } catch (error) {
          console.error('Error sending order notification:', error);
        }
      },

      updateOrderStatus: (orderId, status) => {
        const productStore = useProductStore.getState();
        
        set((state) => {
          const order = state.orders.find(o => o.id === orderId);
          
          // Si la orden se está completando, actualizar el stock
          if (status === 'completed' && order) {
            order.items.forEach(product => {
              productStore.updateStock(product.productId, product.quantity);
            });
          }
          
          return {
            orders: state.orders.map((order) =>
              order.id === orderId
                ? { ...order, status, updatedAt: new Date() }
                : order
            )
          };
        });
      },

      getOrdersByDate: (startDate, endDate) => {
        const orders = get().orders;
        return orders.filter((order) => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate >= startDate && orderDate <= endDate;
        });
      },

      exportToExcel: (startDate, endDate) => {
        const orders = get().getOrdersByDate(startDate, endDate);
        
        const worksheet = utils.json_to_sheet(
          orders.map((order) => ({
            'ID': order.id,
            'Cliente': order.customerName,
            'Email': order.customerEmail,
            'Total': order.total,
            'Estado': order.status,
            'Fecha': new Date(order.createdAt).toLocaleString(),
            'Productos': order.items.map(p => `${p.product.name} x${p.quantity}`).join(', ')
          }))
        );
        
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Órdenes');
        
        writeFile(workbook, `ordenes_${startDate}_${endDate}.xlsx`);
      }
    }),
    {
      name: 'order-storage'
    }
  )
);