import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, Home, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccessDeniedPageProps {
  navigate: (view: string, params?: any) => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ navigate }) => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
        <ShieldAlert className="w-10 h-10 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          403 Forbidden • Access Denied
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
          Admin Portal Access Restricted
        </h1>
        <p className="text-sm text-stone-600 font-hindi max-w-md mx-auto leading-relaxed">
          यह एडमिन पोर्टल केवल अधिकृत स्टोर मैनेजर (Store Administrator) के लिए सुरक्षित है।
        </p>
      </div>

      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 text-left space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <Lock className="w-4 h-4 text-rose-500" />
          <span>Security Protocol Notice:</span>
        </div>
        {user ? (
          <p>
            You are currently signed in as <strong className="text-stone-900">{user.email}</strong> (Role: <span className="capitalize font-semibold text-emerald-700">{user.role}</span>). Your account does not possess administrator privileges.
          </p>
        ) : (
          <p>
            You are not currently logged in. Administrator authentication is required to access store settings and management.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('home')}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Store Home (मुख्य पृष्ठ)</span>
        </button>

        {!user ? (
          <button
            onClick={() => navigate('login', { redirect: 'admin-dashboard' })}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-emerald-700" />
            <span>Admin Login</span>
          </button>
        ) : (
          <button
            onClick={() => {
              logout();
              navigate('login', { redirect: 'admin-dashboard' });
            }}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <span>Sign In with Different Account</span>
          </button>
        )}
      </div>
    </div>
  );
};
