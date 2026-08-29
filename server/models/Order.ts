import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderDoc extends Document {
  orderNumber: string;
  user: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: {
    productId: string;
    name: string;
    hindiName?: string;
    price: number;
    quantity: number;
    unit: string;
    image?: string;
    itemTotal: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'razorpay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  statusTimeline: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  customerNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: {
      userId: { type: String },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        hindiName: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, default: 'kg' },
        image: { type: String },
        itemTotal: { type: Number, required: true }
      }
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true, default: 'Gorakhpur' },
      state: { type: String, required: true, default: 'Uttar Pradesh' },
      pincode: { type: String, required: true, default: '273001' },
      landmark: { type: String }
    },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'razorpay'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    statusTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ],
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    customerNote: { type: String }
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);
