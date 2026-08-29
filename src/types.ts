export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'admin';
  addresses: IAddress[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddress {
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
}

export interface ICategory {
  _id?: string;
  name: string;
  hindiName?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  displayOrder: number;
  order?: number;
  isActive: boolean;
  productCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductUnit = 'kg' | 'gram' | 'litre' | 'ml' | 'packet' | 'piece' | 'dozen' | string;

export interface IProduct {
  _id?: string;
  name: string;
  hindiName?: string;
  slug: string;
  description: string;
  category: string; // Category Slug or ID
  categoryName?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  unit: ProductUnit;
  images: string[];
  brand?: string;
  sku?: string;
  isFeatured: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | string;

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | string;
export type PaymentMethod = 'cod' | 'razorpay' | string;

export interface IOrderItem {
  productId: string;
  name: string;
  hindiName?: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  itemTotal: number;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  user: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  shippingAddress: IAddress;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusTimeline: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  customerNote?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface IStoreSettings {
  _id?: string;
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
  razorpayKeyId?: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}
