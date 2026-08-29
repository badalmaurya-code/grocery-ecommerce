import React from 'react';
import { ShieldCheck, FileText, RefreshCw, ArrowLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'refund';
  navigate: (view: string, params?: any) => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ type, navigate }) => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home (मुख्य पृष्ठ)</span>
      </button>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-2xs space-y-6 text-stone-700 leading-relaxed text-sm">
        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-900 font-serif">Privacy Policy (गोपनीयता नीति)</h1>
                <p className="text-xs text-stone-500">{settings.storeName} • Mahavir Chhapra, Gorakhpur</p>
              </div>
            </div>

            <p>
              At <strong>{settings.storeName} ({settings.storeHindiName})</strong>, accessible from our grocery app and physical store at Mahavir Chhapra, Gorakhpur, Uttar Pradesh, the privacy of our customers is our utmost priority.
            </p>

            <h3 className="font-bold text-stone-900 text-base">1. Information We Collect</h3>
            <p>
              We collect information necessary to fulfill your grocery delivery orders, including your name, contact phone number, delivery address in Mahavir Chhapra/Gorakhpur, and order history.
            </p>

            <h3 className="font-bold text-stone-900 text-base">2. How We Use Your Data</h3>
            <p>
              Your contact details are strictly used to dispatch grocery packages, provide WhatsApp order updates, and ensure smooth delivery within our {settings.deliveryRadiusKm} KM radius. We never sell or share your personal information with third parties.
            </p>

            <h3 className="font-bold text-stone-900 text-base">3. Payment Security</h3>
            <p>
              All online payments are securely processed through RBI-compliant payment gateways (such as Razorpay). We do not store credit card or UPI PIN information on our servers.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-900 font-serif">Terms & Conditions (नियम एवं शर्तें)</h1>
                <p className="text-xs text-stone-500">{settings.storeName} • Mahavir Chhapra, Gorakhpur</p>
              </div>
            </div>

            <p>
              Welcome to <strong>{settings.storeName}</strong>. By accessing our platform or placing an order, you agree to the following terms and local store policies:
            </p>

            <h3 className="font-bold text-stone-900 text-base">1. Delivery Radius & Minimum Order</h3>
            <p>
              Free Home Delivery is applicable within a {settings.deliveryRadiusKm} KM radius from Mahavir Chhapra, Gorakhpur on orders above ₹{settings.freeDeliveryThreshold}. Orders below this threshold may incur a nominal delivery fee of ₹{settings.deliveryCharge}.
            </p>

            <h3 className="font-bold text-stone-900 text-base">2. Product Freshness & Availability</h3>
            <p>
              Daily vegetables and fruits are priced according to local market rates and weight. In case of seasonal stock unavailability, our store manager may notify you via phone or WhatsApp.
            </p>

            <h3 className="font-bold text-stone-900 text-base">3. Cash on Delivery (COD)</h3>
            <p>
              For Cash on Delivery orders, customers are requested to provide exact cash or pay via QR code on delivery.
            </p>
          </div>
        )}

        {type === 'refund' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-900 font-serif">Refund & Replacement Policy (वापसी नीति)</h1>
                <p className="text-xs text-stone-500">{settings.storeName} • Mahavir Chhapra, Gorakhpur</p>
              </div>
            </div>

            <p>
              We strive to deliver the highest quality fresh vegetables and sealed grocery items. If you are not satisfied with any item received:
            </p>

            <h3 className="font-bold text-stone-900 text-base">1. Instant Doorstep Return / Replacement</h3>
            <p>
              Customers can check vegetables, fruits, and packed items upon delivery. If any product is damaged or unsatisfactory, you may return it immediately to the delivery boy or request a replacement within 24 hours.
            </p>

            <h3 className="font-bold text-stone-900 text-base">2. Refund Processing</h3>
            <p>
              For online prepaid orders, refunds for returned items will be credited back to your original payment method within 2-4 business days. For COD orders, immediate cash adjustment or store credit will be provided.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
