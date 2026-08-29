import React, { createContext, useContext, useState, useEffect } from 'react';
import { IStoreSettings } from '../types';
import { settingsAPI } from '../services/api';

const defaultSettings: IStoreSettings = {
  storeName: 'Maurya Grocery',
  storeHindiName: 'मौर्य ग्रॉसरी',
  tagline: 'आपकी अपनी भरोसेमंद किराना एवं ताज़ी सब्ज़ी स्टोर',
  storeAddress: 'महावीर छपरा, गोरखपुर, उत्तर प्रदेश',
  storeCity: 'Gorakhpur',
  phone: '6394016580',
  whatsappNumber: '6394016580',
  deliveryRadiusKm: 1,
  minimumOrderForDelivery: 299,
  deliveryCharge: 30,
  freeDeliveryThreshold: 299,
  codEnabled: true,
  onlinePaymentEnabled: true,
  openingTime: '07:00 AM',
  closingTime: '09:30 PM',
  isOpen: true,
  announcementText: '🚀 1 KM के अंदर ₹299 या उससे अधिक के ऑर्डर पर Free Home Delivery! ताज़ी सब्ज़ियाँ और शुद्ध किराना।'
};

interface SettingsContextType {
  settings: IStoreSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<IStoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.getSettings();
      if (res.data.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Failed to load settings, using defaults');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
