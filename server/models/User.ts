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
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true, default: 'Gorakhpur' },
  state: { type: String, required: true, default: 'Uttar Pradesh' },
  pincode: { type: String, required: true, default: '273001' },
  landmark: { type: String, default: '' },
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

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
