import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  CheckCircle2,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { IAddress } from '../types';
import { orderAPI, paymentAPI } from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutPageProps {
  navigate: (view: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { user, addAddress } = useAuth();
  const { cart, subtotal, deliveryCharge, totalAmount, clearCart } = useCart();
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Address Form State
  const [formData, setFormData] = useState<IAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    area: 'Mahavir Chhapra',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    pincode: '273001',
    landmark: '',
    isDefault: true
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('cart');
      return;
    }

    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr._id || '');
    } else {
      setShowNewAddressForm(true);
    }
  }, [user, cart]);

  const getSelectedAddress = (): IAddress | null => {
    if (user && user.addresses && user.addresses.length > 0 && selectedAddressId && !showNewAddressForm) {
      return user.addresses.find(a => a._id === selectedAddressId) || null;
    }
    if (formData.fullName && formData.phone && formData.addressLine && formData.area) {
      return formData;
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    const addressToUse = getSelectedAddress();

    if (!addressToUse) {
      showToast('Please provide or select a complete delivery address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on backend with server-side price validation
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.product._id!,
          quantity: item.quantity
        })),
        shippingAddress: addressToUse,
        paymentMethod,
        customerNote: customerNote.trim() || undefined,
        email: user?.email || undefined
      };

      const orderRes = await orderAPI.createOrder(orderPayload);

      if (!orderRes.data.success || !orderRes.data.order) {
        throw new Error(orderRes.data.message || 'Failed to place order');
      }

      const createdOrder = orderRes.data.order;

      // If COD, order is immediately confirmed
      if (paymentMethod === 'cod') {
        clearCart();
        showToast('Order confirmed successfully with Cash on Delivery!', 'success');
        navigate('order-success', { orderId: createdOrder._id || createdOrder.orderNumber });
        return;
      }

      // If Razorpay Online Payment
      if (paymentMethod === 'razorpay') {
        const pmtRes = await paymentAPI.createRazorpayOrder(createdOrder._id || createdOrder.orderNumber);

        if (!pmtRes.data.success) {
          throw new Error('Failed to initiate Razorpay payment session');
        }

        const paymentData = pmtRes.data;

        // If Razorpay SDK is loaded in browser
        if (typeof window.Razorpay !== 'undefined' && paymentData.keyId && !paymentData.isMock) {
          const options = {
            key: paymentData.keyId,
            amount: paymentData.amount,
            currency: 'INR',
            name: settings.storeName || 'Maurya Grocery',
            description: `Order ${paymentData.orderNumber}`,
            order_id: paymentData.razorpayOrderId,
            handler: async (response: any) => {
              try {
                const verifyRes = await paymentAPI.verifyRazorpayPayment({
                  orderId: createdOrder._id!,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });

                if (verifyRes.data.success) {
                  clearCart();
                  showToast('Payment verified successfully!', 'success');
                  navigate('order-success', { orderId: createdOrder._id || createdOrder.orderNumber });
                }
              } catch (err: any) {
                showToast('Payment verification failed. Please contact store.', 'error');
              }
            },
            prefill: {
              name: addressToUse.fullName,
              email: user?.email || 'customer@mauryagrocery.com',
              contact: addressToUse.phone
            },
            theme: {
              color: '#047857' // Emerald-700
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (response: any) => {
            showToast(`Payment failed: ${response.error?.description || 'Unknown error'}`, 'error');
          });
          rzp.open();
        } else {
          // Interactive Sandbox Mode Verification
          const mockPaymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
          const verifyRes = await paymentAPI.verifyRazorpayPayment({
            orderId: createdOrder._id!,
            razorpay_order_id: paymentData.razorpayOrderId,
            razorpay_payment_id: mockPaymentId,
            isMock: true
          });

          if (verifyRes.data.success) {
            clearCart();
            showToast('Simulated Razorpay payment confirmed!', 'success');
            navigate('order-success', { orderId: createdOrder._id || createdOrder.orderNumber });
          }
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast(err.response?.data?.message || err.message || 'Something went wrong during checkout', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine || !formData.area) {
      showToast('Please fill all required address fields', 'error');
      return;
    }

    if (user) {
      const ok = await addAddress(formData);
      if (ok) {
        setShowNewAddressForm(false);
      }
    } else {
      setShowNewAddressForm(false);
      showToast('Delivery address set for this order', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <button
          onClick={() => navigate('cart')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart (कार्ट पर लौटें)</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          Checkout & Delivery (ऑर्डर और पता)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address & Payment Selection */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Delivery Address (डिलीवरी पता)
                </h2>
              </div>

              {user && user.addresses && user.addresses.length > 0 && !showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {/* Saved Addresses Selector */}
            {user && user.addresses && user.addresses.length > 0 && !showNewAddressForm ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map(addr => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id!)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/40 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-sm text-stone-900">{addr.fullName}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                      </div>
                      <p className="text-xs text-stone-600 mt-1">{addr.phone}</p>
                      <p className="text-xs text-stone-700 mt-1 leading-snug">
                        {addr.addressLine}, {addr.area}, {addr.city} - {addr.pincode}
                      </p>
                      {addr.landmark && (
                        <p className="text-[11px] text-stone-500 mt-0.5">Near: {addr.landmark}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* New Address Form */
              <form onSubmit={handleSaveNewAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Maurya"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 6394016580"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">House No., Building, Street *</label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine}
                    onChange={e => setFormData({ ...formData, addressLine: e.target.value })}
                    placeholder="e.g. House No. 42, Main Road"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Area / Mohalla *</label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={e => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. Mahavir Chhapra"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g. Near Hanuman Mandir / Primary School"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {user && user.addresses && user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
                  >
                    Save Address & Use
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Payment Method (भुगतान का तरीका)
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery (COD) */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-700 bg-emerald-50/40 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-emerald-700 focus:ring-emerald-700"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-hindi">
                      नकद भुगतान
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 font-hindi">
                    सामान आपके घर पहुँचने पर डिलीवरी बॉय को नकद दें।
                  </p>
                </div>
              </label>

              {/* Razorpay Online Payment */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-emerald-700 bg-emerald-50/40 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-1 text-emerald-700 focus:ring-emerald-700"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      Razorpay Online Payment (UPI, Google Pay, PhonePe, Cards)
                    </span>
                    <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                      Instant & Safe
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 font-hindi">
                    सुरक्षित ऑनलाइन पेमेंट करें (GPay, PhonePe, Paytm, Debit/Credit Card)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Delivery Notes */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-2">
            <label className="text-xs font-bold text-stone-700">Delivery Instructions / Note (वैकल्पिक टिप्पणी):</label>
            <textarea
              value={customerNote}
              onChange={e => setCustomerNote(e.target.value)}
              placeholder="e.g. Ring the doorbell, deliver before 6 PM, leave with neighbor if not available..."
              rows={2}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Right Column: Order Review & Place Order Button */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
            Order Review ({cart.length} items)
          </h2>

          <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 pr-1 text-xs">
            {cart.map(item => (
              <div key={item.product._id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="truncate">
                  <p className="font-bold text-stone-800 truncate">{item.product.name}</p>
                  <p className="text-[11px] text-stone-500">
                    {item.quantity} {item.product.unit} x ₹{item.product.discountPrice || item.product.price}
                  </p>
                </div>
                <span className="font-bold text-stone-900 shrink-0">
                  ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs sm:text-sm text-stone-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Home Delivery Fee (1 KM)</span>
              <span className="font-semibold text-stone-900">
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between text-base font-bold text-stone-900">
              <span>Total Payable</span>
              <span className="text-2xl font-extrabold text-emerald-950 font-serif">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          <button
            id="place-order-final-btn"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <span>Processing Order...</span>
            ) : paymentMethod === 'cod' ? (
              <span>Place Order (ऑर्डर कन्फर्म करें)</span>
            ) : (
              <span>Pay with Razorpay (₹{totalAmount})</span>
            )}
          </button>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-[11px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Maurya Grocery Guarantee</span>
            </div>
            <p>
              Your order is prepared fresh at our Mahavir Chhapra store and dispatched promptly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
