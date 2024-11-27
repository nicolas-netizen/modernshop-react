import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';

interface Order {
  id: string;
  total: number;
  status: 'completed' | 'processing' | 'pending' | 'delivered';
  createdAt: string;
  items: Array<{ quantity: number }>;
}

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        <div className="flex items-center mt-2">
          {trend === 'up' ? (
            <ArrowUp className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="p-3 bg-indigo-100 rounded-full">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
  </div>
);

export const Analytics = () => {
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: { value: 0, change: 0, trend: 'up' },
    products: { value: 0, change: 0, trend: 'up' },
    orders: { value: 0, change: 0, trend: 'up' },
    inventory: { value: 0, lowStock: 0, trend: 'up' }
  });

  useEffect(() => {
    // Calcular estadísticas
    const calculateStats = () => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      // Filtrar solo órdenes completadas o entregadas
      const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered');
      
      // Filtrar órdenes completadas del último mes
      const currentMonthOrders = completedOrders.filter(order => new Date(order.createdAt) >= lastMonth);
      const lastMonthOrders = completedOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()) &&
               orderDate < lastMonth;
      });

      // Calcular ingresos totales (solo de órdenes completadas/entregadas)
      const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);
      const revenueChange = lastMonthRevenue === 0 ? 100 : 
        ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

      // Calcular productos vendidos (solo de órdenes completadas/entregadas)
      const currentMonthProducts = currentMonthOrders.reduce(
        (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 
        0
      );
      const lastMonthProducts = lastMonthOrders.reduce(
        (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 
        0
      );
      const productsChange = lastMonthProducts === 0 ? 100 : 
        ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100;

      // Calcular estadísticas de inventario
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock && p.stock < 5).length;

      setStats({
        revenue: {
          value: currentMonthRevenue,
          change: revenueChange,
          trend: revenueChange >= 0 ? 'up' : 'down'
        },
        products: {
          value: currentMonthProducts,
          change: productsChange,
          trend: productsChange >= 0 ? 'up' : 'down'
        },
        orders: {
          value: currentMonthOrders.length,
          change: lastMonthOrders.length === 0 ? 100 :
            ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100,
          trend: currentMonthOrders.length >= lastMonthOrders.length ? 'up' : 'down'
        },
        inventory: {
          value: totalProducts,
          lowStock: lowStockProducts,
          trend: lowStockProducts === 0 ? 'up' : 'down'
        }
      });

      // Preparar datos para los gráficos (solo órdenes completadas/entregadas)
      const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      const dailyData = Array(7).fill(0).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const dayOrders = completedOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getDate() === date.getDate() &&
                 orderDate.getMonth() === date.getMonth() &&
                 orderDate.getFullYear() === date.getFullYear();
        });
        return {
          name: days[date.getDay()],
          ventas: dayOrders.reduce((sum, order) => sum + order.total, 0)
        };
      });
      setSalesData(dailyData);

      // Ingresos mensuales (solo órdenes completadas/entregadas)
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthlyData = monthNames.map((month, index) => {
        const monthOrders = completedOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === index && orderDate.getFullYear() === now.getFullYear();
        });
        return {
          name: month,
          ingresos: monthOrders.reduce((sum, order) => sum + order.total, 0)
        };
      });
      setMonthlyRevenue(monthlyData);
    };

    calculateStats();
  }, [orders, products]);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`$${stats.revenue.value.toFixed(2)}`}
          change={`${stats.revenue.change.toFixed(1)}% vs mes anterior`}
          icon={DollarSign}
          trend={stats.revenue.trend}
        />
        <StatCard
          title="Productos Vendidos"
          value={stats.products.value}
          change={`${stats.products.change.toFixed(1)}% vs mes anterior`}
          icon={Package}
          trend={stats.products.trend}
        />
        <StatCard
          title="Pedidos Completados"
          value={stats.orders.value}
          change={`${stats.orders.change.toFixed(1)}% vs mes anterior`}
          icon={ShoppingCart}
          trend={stats.orders.trend}
        />
        <StatCard
          title="Stock Bajo"
          value={stats.inventory.lowStock}
          change={`${stats.inventory.value} productos totales`}
          icon={AlertTriangle}
          trend={stats.inventory.trend}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ventas Diarias (Completadas)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" name="Ventas ($)" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ingresos Mensuales (Completados)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ingresos" name="Ingresos ($)" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Pedidos Recientes</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  order.status === 'completed' ? 'bg-green-500' :
                  order.status === 'processing' ? 'bg-yellow-500' :
                  order.status === 'delivered' ? 'bg-blue-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium">
                    Pedido #{order.id.slice(-4)} - {order.status === 'completed' ? 'Completado' : 
                    order.status === 'processing' ? 'En Proceso' : 
                    order.status === 'delivered' ? 'Entregado' : 
                    'En Proceso'}
                  </p>
                  <div className="text-xs text-gray-500">
                    <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)} productos</p>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
