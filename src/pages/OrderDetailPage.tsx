import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { IOrder, IProduct } from '../types';
import { orderAPI, productAPI } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { OrderTracker } from '../components/OrderTracker';

interface OrderDetailPageProps {
  orderId: string;
  navigate: (view: string, params?: any) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId, navigate }) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);

  const { settings } = useSettings();
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getOrderById(orderId);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('Failed to load order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      const res = await orderAPI.cancelOrder(order._id || order.orderNumber);
      if (res.data.success) {
        showToast('Order cancelled successfully', 'info');
        setOrder(res.data.order);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    if (!order || !order.items || order.items.length === 0) return;
    setReordering(true);
    let addedCount = 0;

    try {
      for (const item of order.items) {
        try {
          const res = await productAPI.getProductBySlugOrId(item.productId);
          if (res.data.success && res.data.product) {
            const freshProd = res.data.product;
            if (freshProd.stock > 0) {
              const qtyToAdd = Math.min(item.quantity, freshProd.stock);
              addToCart(freshProd, qtyToAdd);
              addedCount++;
            }
          } else {
            // Fallback minimal product structure
            const fallbackProduct: IProduct = {
              _id: item.productId,
              name: item.name,
              hindiName: item.hindiName,
              price: item.price,
              unit: item.unit,
              images: item.image ? [item.image] : [],
              category: 'general',
              stock: 50,
              slug: item.productId,
              description: item.name,
              isFeatured: false,
              isActive: true
            };
            addToCart(fallbackProduct, item.quantity);
            addedCount++;
          }
        } catch (err) {
          // Fallback minimal product structure
          const fallbackProduct: IProduct = {
            _id: item.productId,
            name: item.name,
            hindiName: item.hindiName,
            price: item.price,
            unit: item.unit,
            images: item.image ? [item.image] : [],
            category: 'general',
            stock: 50,
            slug: item.productId,
            description: item.name,
            isFeatured: false,
            isActive: true
          };
          addToCart(fallbackProduct, item.quantity);
          addedCount++;
        }
      }

      if (addedCount > 0) {
        showToast(`${addedCount} items from order #${order.orderNumber} added to your cart!`, 'success');
        navigate('cart');
      } else {
        showToast('Could not reorder items. Products may be currently unavailable.', 'error');
      }
    } catch (err) {
      console.error('Reorder error:', err);
      showToast('Failed to reorder items', 'error');
    } finally {
      setReordering(false);
    }
  };

  const handleWhatsAppHelp = () => {
    if (!order) return;
    const text = `नमस्ते मौर्य ग्रॉसरी, मुझे ऑर्डर *${order.orderNumber}* (₹${order.totalAmount}) के संबंध में सहायता चाहिए।`;
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="h-8 bg-stone-200 rounded-xl w-1/2 mx-auto" />
          <div className="h-32 bg-stone-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 font-serif">Order Not Found</h2>
        <p className="text-xs text-stone-500 font-hindi">ऑर्डर का विवरण नहीं मिला।</p>
        <button
          onClick={() => navigate('my-orders')}
          className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('my-orders')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors py-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Orders (सभी ऑर्डर)</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Reorder Action Button */}
          <button
            id="reorder-order-btn"
            onClick={handleReorder}
            disabled={reordering}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer min-h-[40px] grow sm:grow-0"
          >
            {reordering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            <span>{reordering ? 'Adding Items...' : 'Reorder (दोबारा ऑर्डर करें)'}</span>
          </button>

          {/* WhatsApp Support Button */}
          <button
            onClick={handleWhatsAppHelp}
            className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors min-h-[40px] grow sm:grow-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Help on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Order Info & Live Status Tracker */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">Order Number</span>
            <h1 className="text-lg sm:text-2xl font-extrabold text-stone-900 font-mono">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="sm:text-right flex sm:flex-col justify-between items-end sm:items-end">
            <div>
              <span className="text-[11px] sm:text-xs text-stone-400 block">Total Amount</span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-serif">₹{order.totalAmount}</span>
            </div>
            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}
            </span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 mb-2">Delivery Progress</h3>
          <OrderTracker status={order.orderStatus} timeline={order.timeline} />
        </div>

        {/* Cancel button if pending */}
        {order.orderStatus === 'pending' && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel This Order</span>
            </button>
          </div>
        )}
      </div>

      {/* Items Ordered List with Reorder Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-700">
            Items in Order ({order.items.length})
          </h3>
          <button
            onClick={handleReorder}
            disabled={reordering}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reorder All</span>
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                  {item.hindiName && (
                    <p className="text-[11px] text-emerald-800 font-hindi truncate">{item.hindiName}</p>
                  )}
                  <p className="text-[11px] text-stone-500">
                    {item.quantity} {item.unit} x ₹{item.price}
                  </p>
                </div>
              </div>

              <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                ₹{item.itemTotal || (item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Bill summary */}
        <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Items Total</span>
            <span className="font-semibold text-stone-900">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-semibold text-stone-900">
              {order.deliveryCharge === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${order.deliveryCharge}`}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-bold text-stone-900">
            <span>Grand Total</span>
            <span className="text-lg font-serif font-extrabold text-emerald-950">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Prominent Bottom Reorder CTA */}
        <div className="pt-3 border-t border-stone-100">
          <button
            onClick={handleReorder}
            disabled={reordering}
            className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-98 min-h-[44px]"
          >
            {reordering ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
            )}
            <span>Add all {order.items.length} items back to cart (सारे सामान दोबारा कार्ट में जोड़ें)</span>
          </button>
        </div>
      </div>

      {/* Delivery Address & Customer Note */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-700">
          Shipping Address (डिलीवरी पता)
        </h3>
        <div className="text-xs text-stone-700 space-y-1">
          <p className="font-bold text-stone-900 text-sm">{order.shippingAddress.fullName}</p>
          <p>📞 {order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.addressLine}, {order.shippingAddress.area}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
          {order.shippingAddress.landmark && (
            <p className="text-stone-500">Landmark: {order.shippingAddress.landmark}</p>
          )}
        </div>
        {order.customerNote && (
          <div className="mt-3 p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
            <strong>Customer Note:</strong> {order.customerNote}
          </div>
        )}
      </div>
    </div>
  );
};
