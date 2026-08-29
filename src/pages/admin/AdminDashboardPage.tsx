import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  Plus
} from 'lucide-react';
import { adminAPI, orderAPI } from '../../services/api';
import { IOrder, IProduct } from '../../types';

interface AdminDashboardPageProps {
  navigate: (view: string, params?: any) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDashboardStats();
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
        setLowStockProducts(res.data.lowStockProducts || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Store Admin Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif mt-1">
            Maurya Grocery Management
          </h1>
          <p className="text-xs text-stone-500 font-hindi">
            महावीर छपरा स्टोर डैशबोर्ड • बिक्री, ऑर्डर एवं इन्वेंटरी प्रबंधन
          </p>
        </div>

        {/* Admin Navigation Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('admin-products')}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => navigate('admin-orders')}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>All Orders</span>
          </button>
          <button
            onClick={() => navigate('admin-settings')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
          >
            Store Settings
          </button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Total Sales (कुल बिक्री)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              ₹
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            ₹{stats?.totalRevenue?.toLocaleString() || 0}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">Delivered & Confirmed Orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Total Orders (ऑर्डर संख्या)</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-[11px] text-stone-500">
            {stats?.pendingOrders || 0} Pending Dispatch
          </p>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Catalog Items (कुल सामान)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            {stats?.totalProducts || 0}
          </p>
          <p className="text-[11px] text-stone-500">Active grocery & vegetables</p>
        </div>

        {/* Registered Users */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Customers (ग्राहक)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            {stats?.totalUsers || 0}
          </p>
          <p className="text-[11px] text-stone-500">Mahavir Chhapra & Gorakhpur</p>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Recent Customer Orders</span>
            </h3>
            <button
              onClick={() => navigate('admin-orders')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              View All Orders →
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer & Phone</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Payment</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {recentOrders.slice(0, 6).map(order => (
                    <tr key={order._id} className="hover:bg-stone-50/50">
                      <td className="py-3 font-mono font-bold text-stone-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-stone-900">{order.shippingAddress.fullName}</div>
                        <div className="text-stone-500 text-[11px]">{order.shippingAddress.phone}</div>
                      </td>
                      <td className="py-3 font-extrabold text-stone-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 uppercase font-medium">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          order.paymentMethod === 'cod' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={order.orderStatus}
                          onChange={e => handleUpdateOrderStatus(order._id!, e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-hidden focus:border-emerald-700"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="packed">Packed</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate('order-detail', { orderId: order._id || order.orderNumber })}
                          className="text-xs font-bold text-emerald-700 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-xs text-stone-400">No orders received yet.</p>
          )}
        </div>

        {/* Low Stock Alerts & Quick Admin Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Warning Box */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low Stock Alerts (कम स्टॉक)</span>
            </h3>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
                {lowStockProducts.map(prod => (
                  <div
                    key={prod._id}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900">{prod.name}</h4>
                      <p className="text-[11px] text-emerald-800 font-hindi">{prod.hindiName}</p>
                    </div>
                    <span className="text-xs font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                      {prod.stock} {prod.unit} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-3">All inventory items are well-stocked! ✅</p>
            )}
          </div>

          {/* Fast Actions */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <h4 className="font-bold text-sm font-serif">Quick Store Actions</h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => navigate('admin-products', { action: 'add' })}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Grocery / Vegetable</span>
              </button>
              <button
                onClick={() => navigate('admin-categories')}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Manage Categories</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
