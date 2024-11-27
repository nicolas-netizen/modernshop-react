import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';
import OrderReceipt from '../../components/OrderReceipt';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrderForPDF, setSelectedOrderForPDF] = useState<Order | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            ordersData.push({
              id: doc.id,
              items: data.items || [],
              total: data.total || 0,
              status: data.status || 'pending',
              createdAt: data.createdAt?.toDate() || new Date(),
              customerName: data.customerName || 'Sin nombre',
              customerEmail: data.customerEmail || 'Sin email',
              customerPhone: data.customerPhone || 'Sin teléfono',
              shippingAddress: data.shippingAddress || 'Sin dirección',
              paymentMethod: data.paymentMethod || 'Sin método de pago',
              notes: data.notes || ''
            });
          }
        });
        setOrders(ordersData);
      } catch (error) {
        console.error("Error processing orders:", error);
        toast.error("Error al cargar las órdenes");
      }
    }, (error) => {
      console.error("Error fetching orders:", error);
      toast.error("Error al cargar las órdenes");
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders
    .filter(order => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || (
        (order.customerName?.toLowerCase() || '').includes(searchTermLower) ||
        (order.customerPhone || '').includes(searchTerm) ||
        (order.id?.toLowerCase() || '').includes(searchTermLower)
      );
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
          : (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
      } else {
        return sortOrder === 'desc'
          ? (b.total || 0) - (a.total || 0)
          : (a.total || 0) - (b.total || 0);
      }
    });

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      const orderData = orderDoc.data();

      // Si la orden se está completando, actualizar el stock
      if (newStatus === 'delivered' && orderData) {
        for (const item of orderData.items) {
          const productRef = doc(db, 'products', item.productId);
          const productDoc = await getDoc(productRef);
          const productData = productDoc.data();
          
          if (productData) {
            await updateDoc(productRef, {
              stock: Math.max(0, productData.stock - item.quantity),
              updatedAt: new Date()
            });
          }
        }
      }

      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPaymentMethod = (method: string) => {
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Orders Management</h1>
        
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search by name, phone or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
            className="border rounded-md px-3 py-2"
          >
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Total</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="border rounded-md px-3 py-2"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  Order #{order.id.slice(-6)}
                  <span className="ml-2 text-sm text-gray-500">
                    ({formatDate(order.createdAt)})
                  </span>
                </h2>
                <p className="text-lg font-bold text-green-600">
                  ${order.total.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                  className="text-sm border rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="font-semibold mb-2 text-indigo-600">Customer Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {order.customerName}</p>
                  <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                  <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                  <p><span className="font-medium">Address:</span> {order.shippingAddress}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-indigo-600">Order Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Payment Method:</span> {formatPaymentMethod(order.paymentMethod)}</p>
                  <p><span className="font-medium">Total Items:</span> {order.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                  {order.notes && (
                    <p><span className="font-medium">Notes:</span> {order.notes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="mt-4">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
              >
                {expandedOrder === order.id ? (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Hide Products
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Show Products ({order.items.length})
                  </>
                )}
              </button>

              {expandedOrder === order.id && (
                <div className="space-y-4 mt-4 border-t pt-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <div>
                          <p className="font-medium text-lg">{item.name}</p>
                          <div className="text-gray-600 space-x-4">
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: ${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-green-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4 border-t">
                    <p className="text-xl font-bold">
                      Total: ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-4 pt-4 border-t">
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Order
              </button>
              <button
                onClick={() => setSelectedOrderForPDF(order)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              >
                Generate PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para mostrar el PDF */}
      {selectedOrderForPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recibo de Orden #{selectedOrderForPDF.id}</h2>
              <button
                onClick={() => setSelectedOrderForPDF(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>
            <OrderReceipt order={selectedOrderForPDF} />
          </div>
        </div>
      )}
    </div>
  );
};
