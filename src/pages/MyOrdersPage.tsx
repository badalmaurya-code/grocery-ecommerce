import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronRight, Clock, ArrowRight, ShoppingBag, Truck, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderAPI, productAPI } from '../services/api';
import { IOrder, IProduct } from '../types';

interface MyOrdersPageProps {
  navigate: (view: string, params?: any) => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackInput, setTrackInput] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      orderAPI.getMyOrders().then(res => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleTrackByNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setLookupError('');
    try {
      const res = await orderAPI.getOrderById(trackInput.trim());
      if (res.data.success && res.data.order) {
        navigate('order-detail', { orderId: res.data.order._id || res.data.order.orderNumber });
      } else {
        setLookupError('Order not found. Please verify order ID or phone.');
      }
    } catch (err) {
      setLookupError('Could not find order with this number. Please check again.');
    }
  };

  const handleQuickReorder = async (e: React.MouseEvent, order: IOrder) => {
    e.stopPropagation();
    if (!order || !order.items || order.items.length === 0) return;
    setReorderingId(order._id || order.orderNumber);

    let addedCount = 0;
    try {
      for (const item of order.items) {
        try {
          const res = await productAPI.getProductBySlugOrId(item.productId);
          if (res.data.success && res.data.product && res.data.product.stock > 0) {
            addToCart(res.data.product, Math.min(item.quantity, res.data.product.stock));
            addedCount++;
          } else {
            const fallback: IProduct = {
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
            addToCart(fallback, item.quantity);
            addedCount++;
          }
        } catch {
          const fallback: IProduct = {
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
          addToCart(fallback, item.quantity);
          addedCount++;
        }
      }

      if (addedCount > 0) {
        showToast(`${addedCount} items from order #${order.orderNumber} added to cart!`, 'success');
        navigate('cart');
      }
    } catch (err) {
      showToast('Failed to reorder items', 'error');
    } finally {
      setReorderingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">Pending (प्रतीक्षारत)</span>;
      case 'confirmed':
        return <span className="bg-sky-100 text-sky-800 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">Confirmed (स्वीकृत)</span>;
      case 'processing':
        return <span className="bg-indigo-100 text-indigo-800 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">Processing (तैयारी में)</span>;
      case 'packed':
        return <span className="bg-teal-100 text-teal-800 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">Packed (पैक)</span>;
      case 'out_for_delivery':
        return <span className="bg-amber-500 text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">Out For Delivery (रास्ते में)</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">Delivered (सफलतापूर्वक प्राप्त)</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">Cancelled (रद्द)</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Order History</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          My Orders & Live Tracking (मेरे ऑर्डर)
        </h1>
      </div>

      {/* Instant Order Lookup Widget */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Quick Order Tracker (ऑर्डर नंबर से तुरंत स्थिति जानें)</span>
        </h3>
        <form onSubmit={handleTrackByNumber} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={trackInput}
            onChange={e => setTrackInput(e.target.value)}
            placeholder="Enter Order ID / Number (उदा. ORD-XXXXXX)"
            className="flex-1 p-2.5 bg-white border border-emerald-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-700 text-stone-900"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs cursor-pointer min-h-[40px]"
          >
            Track Order
          </button>
        </form>
        {lookupError && (
          <p className="text-xs text-rose-600 font-medium">{lookupError}</p>
        )}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse space-y-3">
              <div className="h-4 bg-stone-200 rounded w-1/4" />
              <div className="h-6 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => {
            const isReorderingThis = reorderingId === (order._id || order.orderNumber);
            return (
              <div
                key={order._id}
                onClick={() => navigate('order-detail', { orderId: order._id || order.orderNumber })}
                className="bg-white rounded-3xl border border-stone-200/90 hover:border-emerald-500/60 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-mono text-xs font-extrabold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>

                  <div className="text-xs text-stone-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="text-xs text-stone-700 font-medium line-clamp-1">
                    {order.items.length} items ({order.items.map(i => i.name).slice(0, 2).join(', ')}{order.items.length > 2 ? '...' : ''})
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="sm:text-right">
                    <span className="text-[11px] sm:text-xs text-stone-400 block">Total</span>
                    <span className="text-base sm:text-lg font-extrabold text-stone-900 font-serif">₹{order.totalAmount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleQuickReorder(e, order)}
                      disabled={isReorderingThis}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                      title="Reorder items from this order"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isReorderingThis ? 'animate-spin' : ''}`} />
                      <span>{isReorderingThis ? 'Adding...' : 'Reorder'}</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl min-h-[38px]">
                      <span>Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !user ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <Package className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold text-stone-900">Login to see your full order history</h3>
          <p className="text-xs text-stone-500 font-hindi max-w-sm mx-auto">
            अपने पूर्व ऑर्डर देखने के लिए लॉग इन करें या ऊपर दिए गए ट्रैकर में ऑर्डर नंबर दर्ज करें।
          </p>
          <button
            onClick={() => navigate('login')}
            className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer min-h-[44px]"
          >
            Login / Register
          </button>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold text-stone-900">No orders found</h3>
          <p className="text-xs text-stone-500 font-hindi">
            आपने अभी तक कोई ऑर्डर दर्ज नहीं किया है।
          </p>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer min-h-[44px]"
          >
            Start Shopping Now
          </button>
        </div>
      )}
    </div>
  );
};
