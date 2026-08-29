import mongoose from 'mongoose';
import { memoryStore } from '../services/dataService';
import { initialCategories, initialProducts, initialSettings } from '../data/seedData';
import { UserModel } from '../models/User';
import { CategoryModel } from '../models/Category';
import { ProductModel } from '../models/Product';
import { SettingsModel } from '../models/Settings';
import bcrypt from 'bcryptjs';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // Initialize in-memory seed store immediately for fast fallback
  await memoryStore.init();

  if (!uri || uri.includes('YOUR_MONGODB_URI') || uri === '') {
    console.log('ℹ️ [Maurya Grocery] No remote MONGODB_URI configured. Running in high-performance reactive in-memory database mode.');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ [Maurya Grocery] Successfully connected to MongoDB Atlas / Server.');

    // Check if initial seed is required in MongoDB
    const categoryCount = await (CategoryModel as any).countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial Maurya Grocery categories, products and admin user into MongoDB...');
      await (CategoryModel as any).insertMany(initialCategories);
      await (ProductModel as any).insertMany(initialProducts);

      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user123', 10);

      await (UserModel as any).create([
        {
          name: 'Maurya Admin',
          email: 'admin@mauryagrocery.com',
          phone: '6394016580',
          password: adminPassword,
          role: 'admin',
          addresses: [
            {
              fullName: 'Maurya Grocery Store',
              phone: '6394016580',
              addressLine: 'Mahavir Chhapra Market, Main Road',
              area: 'Mahavir Chhapra',
              city: 'Gorakhpur',
              state: 'Uttar Pradesh',
              pincode: '273001',
              landmark: 'Near Hanuman Temple',
              isDefault: true
            }
          ],
          isActive: true
        },
        {
          name: 'Rahul Maurya',
          email: 'customer@mauryagrocery.com',
          phone: '9876543210',
          password: userPassword,
          role: 'user',
          addresses: [
            {
              fullName: 'Rahul Maurya',
              phone: '9876543210',
              addressLine: 'House No. 42, Ward 5',
              area: 'Mahavir Chhapra',
              city: 'Gorakhpur',
              state: 'Uttar Pradesh',
              pincode: '273001',
              landmark: 'Behind Primary School',
              isDefault: true
            }
          ],
          isActive: true
        }
      ]);

      await (SettingsModel as any).create(initialSettings);
      console.log('✅ Database seeded successfully!');
    }
  } catch (err: any) {
    console.warn('⚠️ MongoDB connection could not be established:', err.message);
    console.log('💡 Continuing with reliable in-memory storage. All features remain fully interactive.');
  }
}
