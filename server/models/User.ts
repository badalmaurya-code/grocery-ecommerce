import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDoc extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'admin';
  addresses: {
    _id?: string;
    fullName: string;
    phone: string;
    addressLine: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault?: boolean;
  }[];
  isActive: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema({
  _id: { type: String, default: () => `addr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  addressLine: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  city: { type: String, required: true, default: 'Gorakhpur', trim: true },
  state: { type: String, required: true, default: 'Uttar Pradesh', trim: true },
  pincode: { type: String, required: true, default: '273001', trim: true },
  landmark: { type: String, default: '', trim: true },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: [AddressSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
