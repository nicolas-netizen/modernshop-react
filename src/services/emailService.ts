import emailjs from '@emailjs/browser';
import { Order } from '../types';

// Reemplaza estos valores con tus propias credenciales de EmailJS
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export const sendOrderNotification = async (order: Order, storeEmail: string) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: storeEmail,
        order_id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        total: order.total.toFixed(2),
        products: order.products.map(p => `${p.name} x${p.quantity}`).join('\n'),
        date: new Date(order.createdAt).toLocaleString()
      },
      PUBLIC_KEY
    );

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
