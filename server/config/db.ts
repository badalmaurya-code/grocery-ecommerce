import mongoose from 'mongoose';
import { memoryStore } from '../services/dataService';
import { initialCategories, initialProducts, initialSettings } from '../data/seedData';
import { UserModel } from '../models/User';
import { CategoryModel } from '../models/Category';
import { ProductModel } from '../models/Product';
import { SettingsModel } from '../models/Settings';
import bcrypt from 'bcryptjs';

export async function connectDB() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.mongodb_uri ||
    process.env.MONGO_URI ||
    process.env.mongo_uri ||
    process.env.DATABASE_URL ||
    process.env.database_url;

  // Initialize in-memory seed store immediately for fast fallback
  await memoryStore.init();

  if (!uri || uri.includes('YOUR_MONGODB_URI') || uri.trim() === '') {
    console.log('ℹ️ [Maurya Grocery] No remote MONGODB_URI configured. Running in high-performance reactive in-memory database mode.');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ [Maurya Grocery] Successfully connected to MongoDB Atlas / Server.');

    // Always ensure default admin and demo user exist and have valid password hashes
    await ensureEssentialUsers();

    // Check if initial categories and products need seeding
    const categoryCount = await (CategoryModel as any).countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial Maurya Grocery categories, products and settings into MongoDB...');
      await (CategoryModel as any).insertMany(initialCategories);
      await (ProductModel as any).insertMany(initialProducts);
      await (SettingsModel as any).create(initialSettings);
      console.log('✅ Categories and Products seeded successfully!');
    }
  } catch (err: any) {
    console.warn('⚠️ MongoDB connection could not be established:', err.message);
    console.log('💡 Continuing with reliable in-memory storage. All features remain fully interactive.');
  }
}

export async function ensureEssentialUsers() {
  try {
    const adminEmail = 'admin@mauryagrocery.com';
    const customerEmail = 'customer@mauryagrocery.com';

    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);

    // 1. Admin User
    const existingAdmin = await (UserModel as any).findOne({
      email: { $regex: new RegExp(`^${adminEmail}$`, 'i') }
    });

    if (!existingAdmin) {
      console.log('👑 Seeding default Admin user into MongoDB (admin@mauryagrocery.com)...');
      await (UserModel as any).create({
        name: 'Maurya Admin',
        email: adminEmail,
        phone: '6394016580',
        password: adminPasswordHash,
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
      });
    } else {
      // Ensure existing admin has admin123 password valid hash and admin role
      const isMatch = await bcrypt.compare('admin123', existingAdmin.password || '');
      if (!isMatch || existingAdmin.role !== 'admin' || !existingAdmin.isActive) {
        existingAdmin.password = adminPasswordHash;
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log('🔄 Synced and verified Admin credentials in MongoDB.');
      }
    }

    // 2. Demo Customer User
    const existingCustomer = await (UserModel as any).findOne({
      email: { $regex: new RegExp(`^${customerEmail}$`, 'i') }
    });

    if (!existingCustomer) {
      console.log('🛒 Seeding default Customer user into MongoDB (customer@mauryagrocery.com)...');
      await (UserModel as any).create({
        name: 'Rahul Maurya',
        email: customerEmail,
        phone: '9876543210',
        password: userPasswordHash,
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
      });
    } else {
      const isMatch = await bcrypt.compare('user123', existingCustomer.password || '');
      if (!isMatch || !existingCustomer.isActive) {
        existingCustomer.password = userPasswordHash;
        existingCustomer.isActive = true;
        await existingCustomer.save();
      }
    }
  } catch (seedErr) {
    console.error('Error in ensureEssentialUsers:', seedErr);
  }
}
