import React, { useState } from 'react';
import { Lock, Mail, User, Phone, Store, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface RegisterPageProps {
  navigate: (view: string, params?: any) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await register(name, email, phone, password);
    setIsSubmitting(false);
    if (success) {
      navigate('home');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 font-serif">
          Create Account ({settings.storeName})
        </h1>
        <p className="text-xs text-stone-500 font-hindi">
          ताज़ी सब्ज़ियाँ एवं शुद्ध किराना आसानी से मंगाएँ
        </p>
      </div>

      {/* Register Form */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Full Name / पूरा नाम *</label>
            <div className="relative">
              <input
                id="register-name-input"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Maurya"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Email Address / ईमेल *</label>
            <div className="relative">
              <input
                id="register-email-input"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Phone Number / मोबाइल नंबर *</label>
            <div className="relative">
              <input
                id="register-phone-input"
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="6394016580"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Create Password / पासवर्ड *</label>
            <div className="relative">
              <input
                id="register-password-input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Register (अकाउंट बनाएं)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span>Already have an account? </span>
          <button
            onClick={() => navigate('login')}
            className="font-bold text-emerald-700 hover:underline ml-1"
          >
            Login Here (लॉगिन करें)
          </button>
        </div>
      </div>
    </div>
  );
};
