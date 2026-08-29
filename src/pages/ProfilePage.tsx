import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { IAddress } from '../types';

interface ProfilePageProps {
  navigate: (view: string, params?: any) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user, isAdmin, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // New Address modal/inline state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState<Partial<IAddress>>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    area: 'Mahavir Chhapra',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    pincode: '273001',
    landmark: '',
    isDefault: false
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900 font-serif">Please Login</h2>
        <p className="text-xs text-stone-500 font-hindi">अपनी प्रोफाइल और पते देखने के लिए लॉगिन करें।</p>
        <button
          onClick={() => navigate('login')}
          className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Login
        </button>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile(name, phone);
    setIsUpdating(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.fullName || !addrForm.phone || !addrForm.addressLine || !addrForm.area) return;
    const ok = await addAddress(addrForm);
    if (ok) {
      setShowAddressForm(false);
      setAddrForm({
        fullName: user.name,
        phone: user.phone,
        addressLine: '',
        area: 'Mahavir Chhapra',
        city: 'Gorakhpur',
        state: 'Uttar Pradesh',
        pincode: '273001',
        landmark: '',
        isDefault: false
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Account Settings</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            My Profile & Delivery Addresses
          </h1>
        </div>
        {isAdmin && (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Account
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Details */}
        <div className="md:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5 h-fit">
          <div className="text-center pb-4 border-b border-stone-100">
            <div className="w-16 h-16 bg-emerald-700 text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase mx-auto mb-2 shadow-sm">
              {user.name.charAt(0)}
            </div>
            <h3 className="font-bold text-stone-900 text-base">{user.name}</h3>
            <p className="text-xs text-stone-500">{user.email}</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-2xs"
            >
              {isUpdating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Saved Addresses List */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Saved Delivery Addresses ({user.addresses?.length || 0})</span>
            </h3>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            )}
          </div>

          {/* New Address Form Inline */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase">New Address Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={addrForm.fullName}
                  onChange={e => setAddrForm({ ...addrForm, fullName: e.target.value })}
                  className="p-2 bg-white border border-stone-200 rounded-xl text-xs"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={addrForm.phone}
                  onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })}
                  className="p-2 bg-white border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <input
                type="text"
                required
                placeholder="House / Street / Lane"
                value={addrForm.addressLine}
                onChange={e => setAddrForm({ ...addrForm, addressLine: e.target.value })}
                className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
              />

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Area (e.g. Mahavir Chhapra)"
                  value={addrForm.area}
                  onChange={e => setAddrForm({ ...addrForm, area: e.target.value })}
                  className="p-2 bg-white border border-stone-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={addrForm.city}
                  onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                  className="p-2 bg-white border border-stone-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={addrForm.pincode}
                  onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })}
                  className="p-2 bg-white border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={addrForm.landmark}
                onChange={e => setAddrForm({ ...addrForm, landmark: e.target.value })}
                className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List of Saved Addresses */}
          {user.addresses && user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map(addr => (
                <div
                  key={addr._id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600">📞 {addr.phone}</p>
                    <p className="text-xs text-stone-700 leading-snug">
                      {addr.addressLine}, {addr.area}, {addr.city} - {addr.pincode}
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-stone-500">Near: {addr.landmark}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr._id!)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr._id!)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-500 text-xs">
              No delivery address saved yet. Click "+ Add Address" above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
