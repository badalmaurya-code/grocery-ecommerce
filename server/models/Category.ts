import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryDoc extends Document {
  name: string;
  hindiName?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, trim: true },
    hindiName: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, default: '' },
    icon: { type: String, default: 'Boxes' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.models.Category || mongoose.model<ICategoryDoc>('Category', CategorySchema);
