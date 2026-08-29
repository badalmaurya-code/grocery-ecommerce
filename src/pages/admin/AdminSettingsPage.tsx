import React, { useState } from 'react';
import { Settings, Save, ArrowLeft, Store, Truck, Phone, Clock, AlertCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { settingsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { IStoreSettings } from '../../types';

interface AdminSettingsPageProps {
  navigate: (view: string, params?: any) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ navigate }) => {
  const { settings, refreshSettings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<IStoreSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await settingsAPI.updateSettings(formData);
      if (res.data.success) {
        showToast('Store settings updated successfully!', 'success');
        await refreshSettings();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('admin-dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors mb-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          Store Configuration & Settings (दुकान सेटिंग्स)
        </h1>
        <p className="text-xs text-stone-500 font-hindi">
          स्टोर का नाम, डिलीवरी रेडियस, फोन नंबर एवं समय सारिणी प्रबंधित करें
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Store Identity */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
            <Store className="w-4 h-4 text-emerald-700" />
            <span>Store Identity & Branding</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Store Name (English) *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Hindi Name (हिंदी नाम) *</label>
              <input
                type="text"
                required
                value={formData.storeHindiName}
                onChange={e => setFormData({ ...formData, storeHindiName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold font-hindi"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-stone-700">Store Tagline / स्लोगन</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-hindi"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-stone-700">Store Address (महावीर छपरा, गोरखपुर)</label>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={e => setFormData({ ...formData, storeAddress: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>
        </div>

        {/* 2. Contact & Timings */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>Contact & Store Timings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Opening Time</label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                placeholder="07:00 AM"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Closing Time</label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                placeholder="09:30 PM"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 3. Delivery & Radius Policies */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>Delivery Radius & Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Delivery Radius (in KM) *</label>
              <input
                type="number"
                required
                value={formData.deliveryRadiusKm}
                onChange={e => setFormData({ ...formData, deliveryRadiusKm: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Free Delivery Min Order (₹) *</label>
              <input
                type="number"
                required
                value={formData.freeDeliveryThreshold}
                onChange={e => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                value={formData.deliveryCharge}
                onChange={e => setFormData({ ...formData, deliveryCharge: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-stone-700">Top Header Announcement Bar Text</label>
            <input
              type="text"
              value={formData.announcementText || ''}
              onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-hindi"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save All Settings (सेटिंग्स सहेजें)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
