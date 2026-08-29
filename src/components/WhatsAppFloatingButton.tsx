import React, { useState } from 'react';
import { MessageCircle, X, Send, ShoppingBag } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useSettings();
  const { cart, totalAmount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = settings.whatsappNumber || '6394016580';

  const generateWhatsAppUrl = (messageText: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(messageText)}`;
  };

  const handleSendGeneral = () => {
    const defaultText = customMsg.trim() || `नमस्ते मौर्य ग्रॉसरी, मुझे आपके स्टोर से किराना / ताज़ी सब्ज़ी का ऑर्डर देना है।`;
    window.open(generateWhatsAppUrl(defaultText), '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  const handleSendCart = () => {
    if (cart.length === 0) return;
    let text = `🛒 *नमस्ते मौर्य ग्रॉसरी, मेरा ऑर्डर:* \n\n`;
    cart.forEach((item, index) => {
      const p = item.product;
      const price = p.discountPrice || p.price;
      text += `${index + 1}. *${p.name}* (${p.hindiName || ''}) - ${item.quantity} ${p.unit} x ₹${price} = ₹${item.quantity * price}\n`;
    });
    text += `\n*कुल अनुमानित राशि:* ₹${totalAmount}\n`;
    text += `*दुकान:* महावीर छपरा, गोरखपुर\nकृपया आर्डर कन्फर्म करके डिलीवरी का समय बताएं।`;

    window.open(generateWhatsAppUrl(text), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
      {/* WhatsApp Quick Popup */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-100 shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm leading-tight truncate">Maurya Grocery Support</h4>
                <p className="text-[11px] text-emerald-200 truncate">WhatsApp: +91 {phone}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-stone-50 text-xs text-stone-700">
            <p className="leading-relaxed">
              नमस्ते! आप सीधे WhatsApp पर अपनी किराने या सब्ज़ियों की लिस्ट भेजकर भी ऑर्डर दे सकते हैं।
            </p>

            {cart.length > 0 && (
              <div className="p-3 bg-white rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    Cart Summary ({cart.length} items)
                  </span>
                  <span>₹{totalAmount}</span>
                </div>
                <button
                  onClick={handleSendCart}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Cart Items on WhatsApp</span>
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-stone-600">Or type custom message / order list:</label>
              <textarea
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder="उदा. 2 किलो आलू, 1 किलो प्याज, 1 पैकेट आशीर्वाद आटा..."
                rows={3}
                className="w-full p-2.5 bg-white rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-emerald-600 resize-none text-stone-800"
              />
              <button
                onClick={handleSendGeneral}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Chat on WhatsApp (व्हाट्सएप करें)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill/Button */}
      <button
        id="whatsapp-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 group font-bold text-xs sm:text-sm cursor-pointer"
        title="WhatsApp Order"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366] shrink-0" />
        <span className="hidden sm:inline">WhatsApp Order</span>
        {cart.length > 0 && (
          <span className="bg-emerald-950 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
};
