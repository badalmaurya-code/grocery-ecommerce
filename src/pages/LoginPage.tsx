import React, { useState } from 'react';
import { Lock, Mail, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface LoginPageProps {
  navigate: (view: string, params?: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
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
      navigate('home');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@mauryagrocery.com');
    setPassword('admin123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 font-serif">
          Login to {settings.storeName}
        </h1>
        <p className="text-xs text-stone-500 font-hindi">
          अपने अकाउंट में लॉगिन करें एवं ऑर्डर ट्रैक करें
        </p>
      </div>

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

        {/* Demo Admin Quick Access */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Store Admin Demo Credentials:</span>
          </div>
          <p className="text-[11px] text-amber-800">
            Email: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">admin@mauryagrocery.com</code><br />
            Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">admin123</code>
          </p>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="text-[11px] font-bold text-amber-900 hover:underline bg-amber-200/60 px-2 py-1 rounded-lg"
          >
            Auto-fill Admin Details
          </button>
        </div>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span>Don't have an account? </span>
          <button
            onClick={() => navigate('register')}
            className="font-bold text-emerald-700 hover:underline ml-1"
          >
            Register Here (नया खाता बनाएं)
          </button>
        </div>
      </div>
    </div>
  );
};
