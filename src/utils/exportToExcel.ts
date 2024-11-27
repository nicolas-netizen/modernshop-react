import { utils, writeFile } from 'xlsx';
import { Order } from '../types';
import { format } from 'date-fns';

export const exportOrdersToExcel = (orders: Order[]) => {
  const workbook = utils.book_new();
  
  // Format orders for the main sheet
  const ordersData = orders.map((order) => ({
    'Order ID': order.id,
    'Date': format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
    'Customer': order.customerEmail,
    'Status': order.status,
    'Total': `$${order.total.toFixed(2)}`,
    'Shipping Address': `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`,
  }));

  // Format order items for the details sheet
  const orderItemsData = orders.flatMap((order) =>
    order.items.map((item) => ({
      'Order ID': order.id,
      'Product': item.product.name,
      'Quantity': item.quantity,
      'Price': `$${item.product.price.toFixed(2)}`,
      'Subtotal': `$${(item.quantity * item.product.price).toFixed(2)}`,
    }))
  );

  const ordersSheet = utils.json_to_sheet(ordersData);
  const itemsSheet = utils.json_to_sheet(orderItemsData);

  utils.book_append_sheet(workbook, ordersSheet, 'Orders');
  utils.book_append_sheet(workbook, itemsSheet, 'Order Items');

  writeFile(workbook, `sales_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};