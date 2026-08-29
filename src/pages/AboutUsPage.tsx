import React from 'react';
import { Store, Award, Heart, Truck, ShieldCheck, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { MauryaLogo } from '../components/MauryaLogo';

interface AboutUsPageProps {
  navigate: (view: string, params?: any) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ navigate }) => {
  const { settings } = useSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm inline-block">
          <MauryaLogo variant="full" size="lg" />
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-hindi">
          मौर्य ग्रॉसरी महावीर छपरा, गोरखपुर का एक प्रतिष्ठित एवं विश्वसनीय किराना एवं सब्ज़ी स्टोर है। हमारा उद्देश्य हर परिवार तक ताज़ी, स्वच्छ सब्जियाँ, शुद्ध दालें, उच्च गुणवत्ता का आटा, चावल एवं रोज़मर्रा का घरेलू सामान सबसे उचित मूल्य और मुफ्त होम डिलीवरी के साथ पहुँचाना है।
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">100% शुद्ध एवं ताज़ा</h3>
          <p className="text-xs text-stone-500 font-hindi leading-relaxed">
            हम सीधे किसानों एवं विश्वसनीय थोक मंडियों से दैनिक ताज़ी सब्जियाँ व प्रमाणित ब्रांड्स का किराना लाते हैं।
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">1 KM Free Home Delivery</h3>
          <p className="text-xs text-stone-500 font-hindi leading-relaxed">
            महावीर छपरा क्षेत्र में ₹{settings.freeDeliveryThreshold} के न्यूनतम आर्डर पर सुपरफास्ट फ्री होम डिलीवरी सेवा।
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">ग्राहक संतुष्टि हमारी प्राथमिकता</h3>
          <p className="text-xs text-stone-500 font-hindi leading-relaxed">
            सामान पसंद न आने पर तत्काल रिप्लेसमेंट अथवा वापसी की सुविधा उपलब्ध है।
          </p>
        </div>
      </div>

      {/* Store Location & Timings Box */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold font-serif">दुकान पर पधारें (Visit Our Store)</h3>
          <div className="space-y-1.5 text-xs sm:text-sm text-emerald-100">
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>{settings.storeAddress}</span>
            </p>
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>मोबाइल नंबर: +91 {settings.phone}</span>
            </p>
            <p className="text-emerald-300 font-medium">
              खुलने का समय: प्रतिदिन {settings.openingTime} - {settings.closingTime}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('shop')}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-transform active:scale-95 shrink-0 cursor-pointer"
        >
          Explore Catalog (सामान देखें)
        </button>
      </div>
    </div>
  );
};
