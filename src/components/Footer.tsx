import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { MauryaLogo } from './MauryaLogo';

interface FooterProps {
  navigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useSettings();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Fast Home Delivery</h4>
              <p className="text-xs text-stone-400">
                1 KM के अंदर ₹{settings.freeDeliveryThreshold}+ के ऑर्डर पर Free Home Delivery
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">100% Fresh & Pure</h4>
              <p className="text-xs text-stone-400">
                Farm fresh ताज़ी हरी सब्ज़ियाँ और शुद्ध सीलबंद किराना
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Cash on Delivery & Online</h4>
              <p className="text-xs text-stone-400">
                सामान पहुँचने पर नकद दें या UPI/Card से सुरक्षित भुगतान करें
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">WhatsApp Order Support</h4>
              <p className="text-xs text-stone-400">
                सीधे WhatsApp पर लिस्ट भेजकर भी आर्डर करें
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Store Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-md">
              <MauryaLogo size="sm" variant="horizontal" showTagline={false} />
            </div>

            <p className="text-sm text-stone-400 font-hindi max-w-sm leading-relaxed">
              {settings.tagline}. आपके घर की रसोई के लिए दैनिक ताज़ी सब्ज़ियाँ, दाल, चावल, तेल, मसाले और घरेलू सामान की विश्वसनीय दुकान।
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-medium">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>प्रतिदिन: {settings.openingTime} - {settings.closingTime}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home (मुख्य पृष्ठ)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-emerald-400 transition-colors">
                  Shop All Products (सभी सामान)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('categories')} className="hover:text-emerald-400 transition-colors">
                  Categories (श्रेणियाँ)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('my-orders')} className="hover:text-emerald-400 transition-colors">
                  My Orders (ऑर्डर ट्रैक करें)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-emerald-400 transition-colors">
                  About Maurya Grocery (हमारे बारे में)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact Us (संपर्क करें)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Categories */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Top Categories</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('shop', { category: 'fresh-vegetables' })} className="hover:text-emerald-400 transition-colors">
                  Fresh Vegetables (ताज़ी सब्ज़ियाँ)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'fresh-fruits' })} className="hover:text-emerald-400 transition-colors">
                  Fresh Fruits (ताज़े फल)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'dal-pulses' })} className="hover:text-emerald-400 transition-colors">
                  Dal & Pulses (दाल एवं दालें)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'rice-grains' })} className="hover:text-emerald-400 transition-colors">
                  Rice & Grains (चावल एवं अनाज)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'cooking-oil-ghee' })} className="hover:text-emerald-400 transition-colors">
                  Mustard Oil & Ghee (सरसों तेल / घी)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'spices-masala' })} className="hover:text-emerald-400 transition-colors">
                  Spices & Masala (शुद्ध मसाले)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Policies & Support */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal & Policies</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('privacy-policy')} className="hover:text-emerald-400 transition-colors">
                  Privacy Policy (गोपनीयता नीति)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-emerald-400 transition-colors">
                  Terms & Conditions (नियम एवं शर्तें)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('refund-policy')} className="hover:text-emerald-400 transition-colors">
                  Refund & Cancellation Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.storeName} ({settings.storeHindiName}), महावीर छपरा, गोरखपुर. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Local Indian Grocery Delivery Platform</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
