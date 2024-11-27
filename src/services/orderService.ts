import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import * as XLSX from 'xlsx';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
}

export interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  paymentMethod: string;
  notes?: string;
}

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  try {
    const ordersRef = collection(db, 'orders');
    const newOrder = {
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    };
    
    const docRef = await addDoc(ordersRef, newOrder);
    return { id: docRef.id, ...newOrder };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const exportOrdersToExcel = async () => {
  try {
    const orders = await getOrders();
    
    const workbook = XLSX.utils.book_new();
    
    // Preparar los datos para el Excel
    const ordersForExcel = orders.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customerName,
      'Customer Email': order.customerEmail,
      'Customer Phone': order.customerPhone,
      'Shipping Address': order.shippingAddress,
      'Total Amount': order.total,
      'Status': order.status,
      'Payment Method': order.paymentMethod,
      'Created At': order.createdAt instanceof Date 
        ? order.createdAt.toLocaleString() 
        : new Date(order.createdAt).toLocaleString(),
      'Notes': order.notes || ''
    }));

    // Crear hoja de órdenes
    const ordersSheet = XLSX.utils.json_to_sheet(ordersForExcel);
    XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Orders');

    // Preparar los items de las órdenes
    const orderItems = orders.flatMap(order => 
      order.items.map(item => ({
        'Order ID': order.id,
        'Product ID': item.productId,
        'Product Name': item.productName,
        'Quantity': item.quantity,
        'Price': item.price,
        'Subtotal': item.quantity * item.price
      }))
    );

    // Crear hoja de items
    const itemsSheet = XLSX.utils.json_to_sheet(orderItems);
    XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Order Items');

    // Generar el archivo
    XLSX.writeFile(workbook, 'orders_export.xlsx');
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw error;
  }
};
