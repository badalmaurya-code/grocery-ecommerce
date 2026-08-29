import React, { useEffect, useState } from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, MessageCircle, Phone, ShoppingBag, MapPin } from 'lucide-react';
import { IOrder } from '../types';
import { orderAPI } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { OrderTracker } from '../components/OrderTracker';

interface OrderSuccessPageProps {
  orderId: string;
  navigate: (view: string, params?: any) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, navigate }) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    if (orderId) {
      orderAPI.getOrderById(orderId).then(res => {
        if (res.data.success) {
          setOrder(res.data.order);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [orderId]);

  const handleWhatsAppNotify = () => {
    if (!order) return;
    const text = `नमस्ते मौर्य ग्रॉसरी, मैंने ऑर्डर नंबर *${order.orderNumber}* दर्ज किया है (कुल ₹${order.totalAmount})। कृपया डिलीवरी स्थिति बताएं।`;
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Badge */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
            Order Confirmed!
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            धन्यवाद! आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है।
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-hindi">
            मौर्य ग्रॉसरी, महावीर छपरा, गोरखपुर द्वारा आपका ताज़ा सामान जल्द तैयार कर पहुंचाया जाएगा।
          </p>
        </div>

        {order && (
          <div className="inline-block bg-white px-5 py-2 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Order Number: </span>
            <strong className="text-emerald-950 font-mono text-sm">{order.orderNumber}</strong>
          </div>
        )}
      </div>

      {/* Visual Timeline Tracker */}
      {order && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-stone-900">
            Current Order Status (ऑर्डर की ताज़ा स्थिति)
          </h3>
          <OrderTracker status={order.orderStatus} timeline={order.timeline} />
        </div>
      )}

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-600 pb-2 border-b border-stone-100">
            Delivery Details (डिलीवरी पता)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-stone-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-stone-600 mt-0.5">📞 {order.shippingAddress.phone}</p>
              <p className="text-stone-700 mt-1">
                {order.shippingAddress.addressLine}, {order.shippingAddress.area}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
              </p>
              {order.shippingAddress.landmark && (
                <p className="text-stone-500 text-[11px] mt-0.5">Landmark: {order.shippingAddress.landmark}</p>
              )}
            </div>

            <div className="space-y-1 sm:text-right">
              <p className="text-stone-500">Payment Mode:</p>
              <p className="font-bold text-stone-900 uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Online Paid'}
              </p>
              <p className="text-stone-500 pt-1">Total Amount:</p>
              <p className="text-xl font-extrabold text-emerald-900 font-serif">₹{order.totalAmount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('my-orders')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Track All My Orders (मेरे सभी ऑर्डर)</span>
        </button>

        <button
          onClick={handleWhatsAppNotify}
          className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask Delivery Status on WhatsApp</span>
        </button>

        <button
          onClick={() => navigate('shop')}
          className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm rounded-2xl transition-colors flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>
    </div>
  );
};
