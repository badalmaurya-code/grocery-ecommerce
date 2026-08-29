import bcrypt from 'bcryptjs';
import { initialCategories, initialProducts, initialSettings } from '../data/seedData';
import { IAddress, ICategory, IOrder, IProduct, IStoreSettings, IUser } from '../../src/types';
import { UserModel } from '../models/User';
import { CategoryModel } from '../models/Category';
import { ProductModel } from '../models/Product';
import { OrderModel } from '../models/Order';
import { SettingsModel } from '../models/Settings';
import mongoose from 'mongoose';

// In-Memory fallback store for immediate preview & zero-config startup
class InMemoryStore {
  users: IUser[] = [];
  categories: ICategory[] = [];
  products: IProduct[] = [];
  orders: IOrder[] = [];
  settings: IStoreSettings = { ...initialSettings };
  isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    // Seed default admin and user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);

    this.users = [
      {
        _id: 'usr_admin_001',
        name: 'Maurya Admin',
        email: 'admin@mauryagrocery.com',
        phone: '6394016580',
        password: adminPasswordHash,
        role: 'admin',
        addresses: [
          {
            _id: 'addr_adm_01',
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
        isActive: true,
        createdAt: new Date()
      },
      {
        _id: 'usr_demo_002',
        name: 'Rahul Maurya',
        email: 'customer@mauryagrocery.com',
        phone: '9876543210',
        password: userPasswordHash,
        role: 'user',
        addresses: [
          {
            _id: 'addr_usr_01',
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
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.categories = initialCategories.map((c, i) => ({
      ...c,
      _id: `cat_${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    this.products = initialProducts.map((p, i) => ({
      ...p,
      _id: `prod_${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    this.settings = { ...initialSettings };

    // Create a demo order for rich initial dashboard
    this.orders = [
      {
        _id: 'ord_demo_101',
        orderNumber: 'MG-100291',
        user: {
          userId: 'usr_demo_002',
          name: 'Rahul Maurya',
          email: 'customer@mauryagrocery.com',
          phone: '9876543210'
        },
        items: [
          {
            productId: 'prod_1',
            name: 'Fresh Hybrid Tomato',
            hindiName: 'ताज़ा टमाटर',
            price: 28,
            quantity: 2,
            unit: 'kg',
            image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80',
            itemTotal: 56
          },
          {
            productId: 'prod_14',
            name: 'Aashirvaad Shudh Chakki Atta (5 kg)',
            hindiName: 'आशीर्वाद शुद्ध चक्की आटा (5 kg)',
            price: 220,
            quantity: 1,
            unit: 'packet',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
            itemTotal: 220
          },
          {
            productId: 'prod_16',
            name: 'Fortune Kachi Ghani Mustard Oil (1L)',
            hindiName: 'फॉर्च्यून कच्ची घानी सरसों तेल (1L)',
            price: 148,
            quantity: 1,
            unit: 'litre',
            image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
            itemTotal: 148
          }
        ],
        shippingAddress: {
          fullName: 'Rahul Maurya',
          phone: '9876543210',
          addressLine: 'House No. 42, Ward 5',
          area: 'Mahavir Chhapra',
          city: 'Gorakhpur',
          state: 'Uttar Pradesh',
          pincode: '273001',
          landmark: 'Behind Primary School'
        },
        subtotal: 424,
        deliveryCharge: 0,
        discount: 0,
        totalAmount: 424,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'out_for_delivery',
        statusTimeline: [
          { status: 'pending', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Order placed via COD' },
          { status: 'confirmed', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Store confirmed order' },
          { status: 'packed', timestamp: new Date(Date.now() - 3600000 * 1), note: 'Packed fresh at Mahavir Chhapra store' },
          { status: 'out_for_delivery', timestamp: new Date(), note: 'Delivery rider is on the way' }
        ],
        createdAt: new Date(Date.now() - 3600000 * 3)
      }
    ];

    this.isInitialized = true;
  }
}

export const memoryStore = new InMemoryStore();

// Data access layer that uses Mongoose if connected, or memoryStore as reliable fallback
export const DataService = {
  isMongooseConnected(): boolean {
    return mongoose.connection.readyState === 1;
  },

  // USERS
  async findUserByEmail(email: string): Promise<IUser | null> {
    if (!email) return null;
    const normalizedEmail = String(email).trim().toLowerCase();
    const escaped = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (this.isMongooseConnected()) {
      try {
        const u = await (UserModel as any).findOne({
          $or: [
            { email: normalizedEmail },
            { email: { $regex: new RegExp(`^${escaped}$`, 'i') } }
          ]
        });
        if (u) {
          const obj = u.toObject() as IUser;
          obj._id = String(obj._id);
          return obj;
        }
        return null;
      } catch (err) {
        console.error('Mongo findUserByEmail error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.users.find(u => String(u.email).trim().toLowerCase() === normalizedEmail) || null;
  },

  async findUserById(id: string): Promise<IUser | null> {
    if (!id) return null;
    const str = String(id).trim();
    if (this.isMongooseConnected()) {
      try {
        let u = null;
        if (mongoose.Types.ObjectId.isValid(str)) {
          u = await (UserModel as any).findById(str);
        }
        if (!u) {
          u = await (UserModel as any).findOne({ _id: str });
        }
        if (u) {
          const obj = u.toObject() as IUser;
          obj._id = String(obj._id);
          return obj;
        }
        return null;
      } catch (err) {
        console.error('Mongo findUserById error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.users.find(u => String(u._id) === str) || null;
  },

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const normalizedEmail = String(userData.email || '').trim().toLowerCase();
    if (this.isMongooseConnected()) {
      try {
        const u = await (UserModel as any).create({
          ...userData,
          email: normalizedEmail
        });
        const obj = u.toObject() as IUser;
        obj._id = String(obj._id);
        return obj;
      } catch (err) {
        console.error('Mongo createUser error:', err);
      }
    }
    await memoryStore.init();
    const newUser: IUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: userData.name || '',
      email: normalizedEmail,
      phone: userData.phone || '',
      password: userData.password,
      role: userData.role || 'user',
      addresses: userData.addresses || [],
      isActive: true,
      createdAt: new Date()
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const str = String(id).trim();
    if (this.isMongooseConnected()) {
      try {
        let u = null;
        if (mongoose.Types.ObjectId.isValid(str)) {
          u = await (UserModel as any).findByIdAndUpdate(str, updates, { new: true });
        }
        if (!u) {
          u = await (UserModel as any).findOneAndUpdate({ _id: str }, updates, { new: true });
        }
        if (u) {
          const obj = u.toObject() as IUser;
          obj._id = String(obj._id);
          return obj;
        }
        return null;
      } catch (err) {
        console.error('Mongo updateUser error:', err);
      }
    }
    await memoryStore.init();
    const index = memoryStore.users.findIndex(u => String(u._id) === str);
    if (index === -1) return null;
    memoryStore.users[index] = { ...memoryStore.users[index], ...updates, updatedAt: new Date() };
    return memoryStore.users[index];
  },

  async getAllUsers(): Promise<IUser[]> {
    if (this.isMongooseConnected()) {
      try {
        const list = await (UserModel as any).find().select('-password').sort({ createdAt: -1 });
        return list.map((u: any) => {
          const obj = u.toObject() as IUser;
          obj._id = String(obj._id);
          return obj;
        });
      } catch (err) {
        console.error('Mongo getAllUsers error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.users.map(({ password, ...rest }) => ({ ...rest, _id: String(rest._id) } as IUser));
  },

  // CATEGORIES
  async getCategories(onlyActive = true): Promise<ICategory[]> {
    if (this.isMongooseConnected()) {
      try {
        const filter = onlyActive ? { isActive: true } : {};
        const cats = await (CategoryModel as any).find(filter).sort({ displayOrder: 1 });
        return cats.map((c: any) => c.toObject() as ICategory);
      } catch (err) {
        console.error('Mongo getCategories error:', err);
      }
    }
    await memoryStore.init();
    const list = onlyActive ? memoryStore.categories.filter(c => c.isActive) : memoryStore.categories;
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    if (this.isMongooseConnected()) {
      try {
        const c = await (CategoryModel as any).findOne({ slug });
        return c ? (c.toObject() as ICategory) : null;
      } catch (err) {
        console.error('Mongo getCategoryBySlug error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.categories.find(c => c.slug === slug) || null;
  },

  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    if (this.isMongooseConnected()) {
      try {
        const c = await (CategoryModel as any).create(categoryData);
        return c.toObject() as ICategory;
      } catch (err) {
        console.error('Mongo createCategory error:', err);
      }
    }
    await memoryStore.init();
    const newCat: ICategory = {
      _id: `cat_${Date.now()}`,
      name: categoryData.name || '',
      hindiName: categoryData.hindiName || '',
      slug: categoryData.slug || (categoryData.name || '').toLowerCase().replace(/\s+/g, '-'),
      description: categoryData.description || '',
      image: categoryData.image || '',
      icon: categoryData.icon || 'Boxes',
      displayOrder: categoryData.displayOrder || memoryStore.categories.length + 1,
      isActive: categoryData.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryStore.categories.push(newCat);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<ICategory>): Promise<ICategory | null> {
    if (this.isMongooseConnected()) {
      try {
        const c = await (CategoryModel as any).findByIdAndUpdate(id, updates, { new: true });
        return c ? (c.toObject() as ICategory) : null;
      } catch (err) {
        console.error('Mongo updateCategory error:', err);
      }
    }
    await memoryStore.init();
    const idx = memoryStore.categories.findIndex(c => c._id === id);
    if (idx === -1) return null;
    memoryStore.categories[idx] = { ...memoryStore.categories[idx], ...updates, updatedAt: new Date() };
    return memoryStore.categories[idx];
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (this.isMongooseConnected()) {
      try {
        await (CategoryModel as any).findByIdAndDelete(id);
        return true;
      } catch (err) {
        console.error('Mongo deleteCategory error:', err);
      }
    }
    await memoryStore.init();
    const idx = memoryStore.categories.findIndex(c => c._id === id);
    if (idx !== -1) {
      memoryStore.categories.splice(idx, 1);
      return true;
    }
    return false;
  },

  // PRODUCTS
  async getProducts(filterParams: {
    search?: string;
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    onlyActive?: boolean;
  }): Promise<{ products: IProduct[]; total: number; page: number; totalPages: number }> {
    const {
      search,
      category,
      featured,
      minPrice,
      maxPrice,
      sort = 'createdAt_desc',
      page = 1,
      limit = 20,
      onlyActive = true
    } = filterParams;

    if (this.isMongooseConnected()) {
      try {
        const query: any = {};
        if (onlyActive) query.isActive = true;
        if (featured !== undefined) query.isFeatured = featured;
        if (category && category !== 'all') {
          query.category = category;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
          query.price = {};
          if (minPrice !== undefined) query.price.$gte = minPrice;
          if (maxPrice !== undefined) query.price.$lte = maxPrice;
        }
        if (search && search.trim()) {
          const s = search.trim();
          query.$or = [
            { name: { $regex: s, $options: 'i' } },
            { hindiName: { $regex: s, $options: 'i' } },
            { description: { $regex: s, $options: 'i' } },
            { brand: { $regex: s, $options: 'i' } }
          ];
        }

        const sortObj: any = {};
        if (sort === 'price_asc') sortObj.price = 1;
        else if (sort === 'price_desc') sortObj.price = -1;
        else if (sort === 'name_asc') sortObj.name = 1;
        else sortObj.createdAt = -1;

        const total = await (ProductModel as any).countDocuments(query);
        const products = await (ProductModel as any)
          .find(query)
          .sort(sortObj)
          .skip((page - 1) * limit)
          .limit(limit);

        return {
          products: products.map((p: any) => p.toObject() as IProduct),
          total,
          page,
          totalPages: Math.ceil(total / limit) || 1
        };
      } catch (err) {
        console.error('Mongo getProducts error:', err);
      }
    }

    // Memory Store fallback
    await memoryStore.init();
    let list = [...memoryStore.products];

    if (onlyActive) {
      list = list.filter(p => p.isActive);
    }
    if (featured !== undefined) {
      list = list.filter(p => p.isFeatured === featured);
    }
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (minPrice !== undefined) {
      list = list.filter(p => (p.discountPrice || p.price) >= minPrice);
    }
    if (maxPrice !== undefined) {
      list = list.filter(p => (p.discountPrice || p.price) <= maxPrice);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'price_asc') {
      list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price_desc') {
      list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  async getProductByIdOrSlug(idOrSlug: string): Promise<IProduct | null> {
    if (this.isMongooseConnected()) {
      try {
        let p = null;
        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
          p = await (ProductModel as any).findById(idOrSlug);
        }
        if (!p) {
          p = await (ProductModel as any).findOne({ slug: idOrSlug });
        }
        return p ? (p.toObject() as IProduct) : null;
      } catch (err) {
        console.error('Mongo getProductByIdOrSlug error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.products.find(p => p._id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    if (this.isMongooseConnected()) {
      try {
        const p = await (ProductModel as any).create(productData);
        return p.toObject() as IProduct;
      } catch (err) {
        console.error('Mongo createProduct error:', err);
      }
    }
    await memoryStore.init();
    const newProd: IProduct = {
      _id: `prod_${Date.now()}`,
      name: productData.name || '',
      hindiName: productData.hindiName || '',
      slug: productData.slug || (productData.name || '').toLowerCase().replace(/\s+/g, '-'),
      description: productData.description || '',
      category: productData.category || 'fresh-vegetables',
      categoryName: productData.categoryName || '',
      price: Number(productData.price) || 0,
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
      stock: Number(productData.stock) || 0,
      unit: productData.unit || 'kg',
      images: productData.images && productData.images.length ? productData.images : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
      brand: productData.brand || 'Maurya',
      sku: productData.sku || `MG-${Date.now().toString().slice(-4)}`,
      isFeatured: !!productData.isFeatured,
      isActive: productData.isActive !== false,
      rating: 4.8,
      reviewCount: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryStore.products.unshift(newProd);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    if (this.isMongooseConnected()) {
      try {
        const p = await (ProductModel as any).findByIdAndUpdate(id, updates, { new: true });
        return p ? (p.toObject() as IProduct) : null;
      } catch (err) {
        console.error('Mongo updateProduct error:', err);
      }
    }
    await memoryStore.init();
    const idx = memoryStore.products.findIndex(p => p._id === id || p.slug === id);
    if (idx === -1) return null;
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...updates, updatedAt: new Date() };
    return memoryStore.products[idx];
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (this.isMongooseConnected()) {
      try {
        await (ProductModel as any).findByIdAndDelete(id);
        return true;
      } catch (err) {
        console.error('Mongo deleteProduct error:', err);
      }
    }
    await memoryStore.init();
    const idx = memoryStore.products.findIndex(p => p._id === id || p.slug === id);
    if (idx !== -1) {
      memoryStore.products.splice(idx, 1);
      return true;
    }
    return false;
  },

  // ORDERS
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    if (this.isMongooseConnected()) {
      try {
        const ord = await (OrderModel as any).create(orderData);
        const obj = ord.toObject() as IOrder;
        obj._id = String(obj._id);
        return obj;
      } catch (err) {
        console.error('Mongo createOrder error:', err);
      }
    }
    await memoryStore.init();
    const newOrd: IOrder = {
      _id: `ord_${Date.now()}`,
      orderNumber: orderData.orderNumber || `MG-${Math.floor(100000 + Math.random() * 900000)}`,
      user: orderData.user || { name: 'Customer', email: 'cust@mail.com', phone: '0000000000' },
      items: orderData.items || [],
      shippingAddress: orderData.shippingAddress || {
        fullName: '',
        phone: '',
        addressLine: '',
        area: '',
        city: 'Gorakhpur',
        state: 'Uttar Pradesh',
        pincode: '273001'
      },
      subtotal: orderData.subtotal || 0,
      deliveryCharge: orderData.deliveryCharge || 0,
      discount: orderData.discount || 0,
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentStatus || 'pending',
      orderStatus: orderData.orderStatus || 'pending',
      statusTimeline: orderData.statusTimeline || [
        {
          status: 'pending',
          timestamp: new Date(),
          note: `Order placed via ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`
        }
      ],
      razorpayOrderId: orderData.razorpayOrderId,
      razorpayPaymentId: orderData.razorpayPaymentId,
      razorpaySignature: orderData.razorpaySignature,
      customerNote: orderData.customerNote,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryStore.orders.unshift(newOrd);
    return newOrd;
  },

  async getOrdersByUser(userIdOrEmail: any): Promise<IOrder[]> {
    if (!userIdOrEmail) return [];
    const val = String(userIdOrEmail).trim();
    const isEmail = val.includes('@');
    const valLower = val.toLowerCase();

    if (this.isMongooseConnected()) {
      try {
        const filter = isEmail
          ? { 'user.email': valLower }
          : {
              $or: [
                { 'user.userId': val },
                { 'user.userId': valLower },
                { 'user.email': valLower }
              ]
            };
        const list = await (OrderModel as any).find(filter).sort({ createdAt: -1 });
        return list.map((o: any) => {
          const obj = o.toObject() as IOrder;
          obj._id = String(obj._id);
          return obj;
        });
      } catch (err) {
        console.error('Mongo getOrdersByUser error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.orders.filter(o => {
      const uId = String(o.user.userId || '');
      const uEmail = String(o.user.email || '').toLowerCase();
      if (isEmail) {
        return uEmail === valLower;
      }
      return uId === val || uId.toLowerCase() === valLower || uEmail === valLower;
    });
  },

  async getOrderById(idOrNumber: string): Promise<IOrder | null> {
    if (!idOrNumber) return null;
    const str = String(idOrNumber).trim();
    if (this.isMongooseConnected()) {
      try {
        let ord = null;
        if (mongoose.Types.ObjectId.isValid(str)) {
          ord = await (OrderModel as any).findById(str);
        }
        if (!ord) {
          ord = await (OrderModel as any).findOne({
            $or: [{ orderNumber: str }, { _id: str }]
          });
        }
        if (ord) {
          const obj = ord.toObject() as IOrder;
          obj._id = String(obj._id);
          return obj;
        }
        return null;
      } catch (err) {
        console.error('Mongo getOrderById error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.orders.find(o => String(o._id) === str || o.orderNumber === str) || null;
  },

  async getAllOrders(): Promise<IOrder[]> {
    if (this.isMongooseConnected()) {
      try {
        const list = await (OrderModel as any).find().sort({ createdAt: -1 });
        return list.map((o: any) => {
          const obj = o.toObject() as IOrder;
          obj._id = String(obj._id);
          return obj;
        });
      } catch (err) {
        console.error('Mongo getAllOrders error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.orders.map(o => ({ ...o, _id: String(o._id) }));
  },

  async updateOrderStatus(
    idOrNumber: string,
    orderStatus: IOrder['orderStatus'],
    paymentStatus?: IOrder['paymentStatus'],
    note?: string
  ): Promise<IOrder | null> {
    if (!idOrNumber) return null;
    const str = String(idOrNumber).trim();
    if (this.isMongooseConnected()) {
      try {
        const query = mongoose.Types.ObjectId.isValid(str)
          ? { _id: str }
          : { $or: [{ orderNumber: str }, { _id: str }] };
        const ord = await (OrderModel as any).findOne(query);
        if (ord) {
          ord.orderStatus = orderStatus;
          if (paymentStatus) ord.paymentStatus = paymentStatus;
          ord.statusTimeline.push({
            status: orderStatus,
            timestamp: new Date(),
            note: note || `Order updated to ${orderStatus}`
          });
          await ord.save();
          const obj = ord.toObject() as IOrder;
          obj._id = String(obj._id);
          return obj;
        }
      } catch (err) {
        console.error('Mongo updateOrderStatus error:', err);
      }
    }
    await memoryStore.init();
    const ord = memoryStore.orders.find(o => String(o._id) === str || o.orderNumber === str);
    if (!ord) return null;
    ord.orderStatus = orderStatus;
    if (paymentStatus) ord.paymentStatus = paymentStatus;
    ord.statusTimeline.push({
      status: orderStatus,
      timestamp: new Date(),
      note: note || `Order updated to ${orderStatus}`
    });
    ord.updatedAt = new Date();
    return ord;
  },

  // SETTINGS
  async getSettings(): Promise<IStoreSettings> {
    if (this.isMongooseConnected()) {
      try {
        let s = await (SettingsModel as any).findOne();
        if (!s) {
          s = await (SettingsModel as any).create(initialSettings);
        }
        return s.toObject() as IStoreSettings;
      } catch (err) {
        console.error('Mongo getSettings error:', err);
      }
    }
    await memoryStore.init();
    return memoryStore.settings;
  },

  async updateSettings(updates: Partial<IStoreSettings>): Promise<IStoreSettings> {
    if (this.isMongooseConnected()) {
      try {
        let s = await (SettingsModel as any).findOne();
        if (!s) {
          s = await (SettingsModel as any).create({ ...initialSettings, ...updates });
        } else {
          Object.assign(s, updates);
          await s.save();
        }
        return s.toObject() as IStoreSettings;
      } catch (err) {
        console.error('Mongo updateSettings error:', err);
      }
    }
    await memoryStore.init();
    memoryStore.settings = { ...memoryStore.settings, ...updates };
    return memoryStore.settings;
  }
};
