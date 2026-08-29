import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  ArrowLeft,
  Clock,
  Filter,
  CheckCircle2,
  Phone,
  MessageCircle,
  Eye,
  X
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import { IOrder } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';

interface AdminOrdersPageProps {
  navigate: (view: string, params?: any) => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ navigate }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const { showToast } = useToast();
  const { settings } = useSettings();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        limit: 100
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await orderAPI.updateOrderStatus(orderId, status);
      if (res.data.success) {
        showToast(`Order status updated to ${status}`, 'success');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const handleWhatsAppNotify = (order: IOrder) => {
    const cleanPhone = order.shippingAddress.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `नमस्ते ${order.shippingAddress.fullName}, मौर्य ग्रॉसरी से आपका आर्डर *${order.orderNumber}* (कुल ₹${order.totalAmount}) की स्थिति अब: *${order.orderStatus.toUpperCase()}* है। धन्यवाद!`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('admin-dashboard')}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Orders & Delivery Dispatch (ऑर्डर प्रबंधन)
          </h1>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchOrders()}
            placeholder="Search by Order # or Customer phone..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="all">All Statuses (सभी)</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-500 animate-pulse">Loading customer orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer & Location</th>
                  <th className="py-3.5 px-4">Items Count</th>
                  <th className="py-3.5 px-4">Total & Mode</th>
                  <th className="py-3.5 px-4">Live Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-stone-900">{order.orderNumber}</div>
                      <div className="text-[11px] text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{order.shippingAddress.fullName}</div>
                      <div className="text-stone-500 text-[11px]">📞 {order.shippingAddress.phone}</div>
                      <div className="text-stone-400 text-[10px] truncate max-w-[160px]">
                        {order.shippingAddress.area}, {order.shippingAddress.city}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {order.items.length} items
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-stone-900 text-sm">₹{order.totalAmount}</div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        order.paymentMethod === 'cod' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleUpdateStatus(order._id!, e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] font-bold"
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
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded-lg font-bold inline-flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleWhatsAppNotify(order)}
                        className="p-1.5 text-[#25D366] hover:bg-emerald-50 rounded-lg"
                        title="Send WhatsApp Update"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-500">No orders found.</div>
        )}
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">Order Invoice & Details</h3>
                <p className="text-xs font-mono text-emerald-800 font-bold">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer info */}
            <div className="bg-stone-50 p-4 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-stone-900 text-sm">{selectedOrder.shippingAddress.fullName}</p>
              <p>📞 {selectedOrder.shippingAddress.phone}</p>
              <p>{selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</p>
              {selectedOrder.shippingAddress.landmark && (
                <p className="text-stone-500">Landmark: {selectedOrder.shippingAddress.landmark}</p>
              )}
            </div>

            {/* Item list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Ordered Items</h4>
              <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{item.productName}</span>
                      <span className="text-[11px] text-stone-500 block">
                        {item.quantity} {item.unit} x ₹{item.unitPrice}
                      </span>
                    </div>
                    <span className="font-bold text-stone-900">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-stone-100 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-100">
                <span>Total Amount</span>
                <span className="text-base font-serif text-emerald-950">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleWhatsAppNotify(selectedOrder)}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Dispatch Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
