import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

interface CartPageProps {
  navigate: (view: string, params?: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    totalAmount
  } = useCart();

  const { settings } = useSettings();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-stone-900 font-serif">Your Cart is Empty</h2>
          <p className="text-sm text-stone-500 font-hindi max-w-sm mx-auto">
            आपकी कार्ट में अभी कोई सामान नहीं है। ताज़ी सब्ज़ियाँ एवं आवश्यक किराना सामान चुनें।
          </p>
        </div>
        <button
          id="cart-empty-shop-btn"
          onClick={() => navigate('shop')}
          className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Start Shopping (सामान खरीदें)
        </button>
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Checkout Process
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Shopping Cart (आपकी कार्ट)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart (खाली करें)</span>
        </button>
      </div>

      {/* Free Delivery Threshold Alert */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-950">
            <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
            {amountNeededForFreeDelivery > 0 ? (
              <span>
                Add <strong className="text-emerald-800">₹{amountNeededForFreeDelivery}</strong> more for{' '}
                <span className="text-emerald-700">FREE Home Delivery</span>!
              </span>
            ) : (
              <span className="text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Congratulations! You qualify for <strong>FREE Home Delivery</strong> (1 KM radius).
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-emerald-800">
            ₹{subtotal} / ₹{freeDeliveryThreshold}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
            {cart.map(item => {
              const p = item.product;
              const unitPrice = p.discountPrice !== undefined && p.discountPrice > 0 ? p.discountPrice : p.price;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div key={p._id} className="p-4 sm:p-5 flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4 hover:bg-stone-50/50 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <img
                      src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-stone-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate">{p.name}</h3>
                      {p.hindiName && (
                        <p className="text-xs text-emerald-800 font-hindi mt-0.5 truncate">{p.hindiName}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                        <span className="font-semibold text-stone-800">₹{unitPrice}</span>
                        <span>/ {p.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls and price */}
                  <div className="flex items-center justify-between xs:justify-end gap-3 pt-2 xs:pt-0 border-t xs:border-t-0 border-stone-100">
                    <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(p._id!, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-stone-700 cursor-pointer min-h-[32px]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(p._id!, item.quantity + 1)}
                        disabled={item.quantity >= p.stock}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-stone-700 disabled:opacity-30 cursor-pointer min-h-[32px]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right shrink-0 min-w-[70px]">
                      <div className="text-sm sm:text-base font-extrabold text-stone-900">
                        ₹{itemTotal}
                      </div>
                      <button
                        onClick={() => removeFromCart(p._id!)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-medium mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add more items (और सामान जोड़ें)</span>
          </button>
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
            Order Summary (बिल विवरण)
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600">
            <div className="flex items-center justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Home Delivery Fee</span>
              <span className="font-semibold text-stone-900">
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between text-base sm:text-lg font-bold text-stone-900">
              <span>Total Payable</span>
              <span className="text-2xl font-extrabold text-emerald-950 font-serif">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          <button
            id="proceed-checkout-btn"
            onClick={() => navigate('checkout')}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Proceed to Checkout (आगे बढ़ें)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-[11px] text-stone-500 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Trusted Ordering</span>
            </div>
            <p>
              • Cash on Delivery or Secure UPI/Online Payment<br />
              • Contactless Home Delivery in Mahavir Chhapra, Gorakhpur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
