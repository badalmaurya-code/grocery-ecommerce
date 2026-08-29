import React from 'react';
import { Truck, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface DeliveryBannerProps {
  onShopClick?: () => void;
}

export const DeliveryBanner: React.FC<DeliveryBannerProps> = ({ onShopClick }) => {
  const { settings } = useSettings();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 my-6">
      {/* Background Decorative Circles */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-700/80 border border-emerald-500/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>HOME DELIVERY AVAILABLE</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
            {settings.deliveryRadiusKm} KM के अंदर Free Home Delivery
          </h3>

          <p className="text-sm sm:text-base text-emerald-100 font-hindi max-w-xl leading-relaxed">
            ₹{settings.freeDeliveryThreshold} या उससे अधिक के ऑर्डर पर आपके घर तक सीधे ताज़ी सब्ज़ियाँ एवं शुद्ध किराना पहुंचाया जाएगा।
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fast Local Dispatch
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cash on Delivery (COD) Available
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-emerald-400" /> Mahavir Chhapra, Gorakhpur
            </span>
          </div>
        </div>

        {onShopClick && (
          <button
            onClick={onShopClick}
            className="shrink-0 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>अभी ऑर्डर करें (Order Now)</span>
          </button>
        )}
      </div>
    </div>
  );
};
