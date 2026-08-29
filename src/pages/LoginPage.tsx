import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { MauryaLogo } from '../components/MauryaLogo';

interface LoginPageProps {
  navigate: (view: string, params?: any) => void;
  redirect?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, redirect }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate(redirect || 'home');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <MauryaLogo variant="full" size="md" />
        <p className="text-xs text-stone-500 font-hindi">
          अपने अकाउंट में लॉगिन करें एवं ऑर्डर ट्रैक करें
        </p>
      </div>

      {/* Redirect Prompt Banner */}
      {redirect === 'checkout' && (
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center gap-3 text-emerald-950 text-xs shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold">Login required for Checkout</p>
            <p className="text-[11px] text-emerald-800 font-hindi">ऑर्डर पूरा करने के लिए कृपया पहले लॉगिन करें।</p>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Email Address / ईमेल</label>
            <div className="relative">
              <input
                id="login-email-input"
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
            <label className="text-xs font-bold text-stone-700">Password / पासवर्ड</label>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-700 focus:outline-hidden"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{isSubmitting ? 'Logging in...' : 'Login (लॉगिन करें)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span>Don't have an account? </span>
          <button
            onClick={() => navigate('register', { redirect })}
            className="font-bold text-emerald-700 hover:underline ml-1 cursor-pointer"
          >
            Register Here (नया खाता बनाएं)
          </button>
        </div>
      </div>
    </div>
  );
};
