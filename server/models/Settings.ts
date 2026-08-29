import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingsDoc extends Document {
  storeName: string;
  storeHindiName: string;
  tagline: string;
  storeAddress: string;
  storeCity: string;
  phone: string;
  whatsappNumber: string;
  deliveryRadiusKm: number;
  minimumOrderForDelivery: number;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  announcementText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettingsDoc>(
  {
    storeName: { type: String, required: true, default: 'Maurya Grocery' },
    storeHindiName: { type: String, required: true, default: 'मौर्य ग्रॉसरी' },
    tagline: { type: String, default: 'आपकी अपनी भरोसेमंद किराना एवं ताज़ी सब्ज़ी स्टोर' },
    storeAddress: { type: String, default: 'महावीर छपरा, गोरखपुर, उत्तर प्रदेश' },
    storeCity: { type: String, default: 'Gorakhpur' },
    phone: { type: String, default: '6394016580' },
    whatsappNumber: { type: String, default: '6394016580' },
    deliveryRadiusKm: { type: Number, default: 1 },
    minimumOrderForDelivery: { type: Number, default: 299 },
    deliveryCharge: { type: Number, default: 30 },
    freeDeliveryThreshold: { type: Number, default: 299 },
    codEnabled: { type: Boolean, default: true },
    onlinePaymentEnabled: { type: Boolean, default: true },
    openingTime: { type: String, default: '07:00 AM' },
    closingTime: { type: String, default: '09:30 PM' },
    isOpen: { type: Boolean, default: true },
    announcementText: { type: String, default: '🚀 1 KM के अंदर ₹299 या उससे अधिक के ऑर्डर पर Free Home Delivery! ताज़ी सब्ज़ियाँ और शुद्ध किराना।' }
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.models.Settings || mongoose.model<ISettingsDoc>('Settings', SettingsSchema);
