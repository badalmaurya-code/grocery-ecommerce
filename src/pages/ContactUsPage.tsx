import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

interface ContactUsPageProps {
  navigate: (view: string, params?: any) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
    showToast('Your message has been sent to Maurya Grocery support!', 'success');

    // Also offer WhatsApp direct redirect
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = `नमस्ते मौर्य ग्रॉसरी, मेरा नाम *${name}* (${phone}) है। \nसंदेश: ${message}`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Get in Touch</span>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
          Contact Maurya Grocery (संपर्क करें)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-hindi">
          किसी भी पूछताछ, थोक आर्डर अथवा डिलीवरी सहायता के लिए हमसे संपर्क करें
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-base text-stone-900">Store Information</h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">Address:</strong>
                  <span>{settings.storeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">Phone / Calling:</strong>
                  <a href={`tel:${settings.phone}`} className="hover:text-emerald-700 font-medium">
                    +91 {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">WhatsApp Order:</strong>
                  <span>+91 {settings.whatsappNumber}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">Store Timings:</strong>
                  <span>Everyday {settings.openingTime} to {settings.closingTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-stone-900">Send us a Message (संदेश भेजें)</h3>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-sm">Message Sent Successfully!</h4>
              <p className="text-xs text-emerald-800">We will respond to your query promptly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 6394016580"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Your Message / Query *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message or special requirement..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message & Open WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
