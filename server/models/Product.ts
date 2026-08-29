import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDoc extends Document {
  name: string;
  hindiName?: string;
  slug: string;
  description: string;
  category: string;
  categoryName?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  unit: string;
  images: string[];
  brand?: string;
  sku?: string;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    hindiName: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    categoryName: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'gram', 'litre', 'ml', 'packet', 'piece', 'dozen'],
      default: 'kg'
    },
    images: [{ type: String }],
    brand: { type: String, default: 'Maurya' },
    sku: { type: String },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', hindiName: 'text', description: 'text', brand: 'text' });

export const ProductModel = mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);
