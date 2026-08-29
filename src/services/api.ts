import axios from 'axios';
import { IAddress, ICategory, IOrder, IProduct, IStoreSettings, IUser } from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('maurya_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for session expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('maurya_token')) {
        localStorage.removeItem('maurya_token');
        localStorage.removeItem('maurya_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    api.post<{ success: boolean; token: string; user: IUser; message: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; token: string; user: IUser; message: string }>('/auth/login', data),
  getMe: () => api.get<{ success: boolean; user: IUser }>('/auth/me'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put<{ success: boolean; user: IUser; message: string }>('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<{ success: boolean; message: string }>('/auth/change-password', data),
  addAddress: (data: Partial<IAddress>) =>
    api.post<{ success: boolean; addresses: IAddress[]; user: IUser; message: string }>('/auth/addresses', data),
  deleteAddress: (id: string) =>
    api.delete<{ success: boolean; addresses: IAddress[]; user: IUser; message: string }>(`/auth/addresses/${id}`),
  setDefaultAddress: (id: string) =>
    api.put<{ success: boolean; addresses: IAddress[]; user: IUser; message: string }>(`/auth/addresses/${id}/default`, {})
};

export const productAPI = {
  getProducts: (params?: {
    search?: string;
    category?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    all?: boolean;
  }) =>
    api.get<{
      success: boolean;
      products: IProduct[];
      total: number;
      page: number;
      totalPages: number;
    }>('/products', { params }),
  getProductBySlugOrId: (slugOrId: string) =>
    api.get<{ success: boolean; product: IProduct; related: IProduct[] }>(`/products/${slugOrId}`),
  createProduct: (data: Partial<IProduct>) =>
    api.post<{ success: boolean; product: IProduct; message: string }>('/products', data),
  updateProduct: (id: string, data: Partial<IProduct>) =>
    api.put<{ success: boolean; product: IProduct; message: string }>(`/products/${id}`, data),
  deleteProduct: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/products/${id}`)
};

export const categoryAPI = {
  getCategories: (all?: boolean) =>
    api.get<{ success: boolean; categories: ICategory[] }>('/categories', { params: { all: all ? 'true' : 'false' } }),
  createCategory: (data: Partial<ICategory>) =>
    api.post<{ success: boolean; category: ICategory; message: string }>('/categories', data),
  updateCategory: (id: string, data: Partial<ICategory>) =>
    api.put<{ success: boolean; category: ICategory; message: string }>(`/categories/${id}`, data),
  deleteCategory: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/categories/${id}`)
};

export const orderAPI = {
  createOrder: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: IAddress;
    paymentMethod: 'cod' | 'razorpay';
    customerNote?: string;
    email?: string;
  }) => api.post<{ success: boolean; order: IOrder; message: string }>('/orders', data),
  getMyOrders: () => api.get<{ success: boolean; orders: IOrder[] }>('/orders/my-orders'),
  getOrderDetails: (id: string) => api.get<{ success: boolean; order: IOrder }>(`/orders/${id}`),
  getOrderById: (id: string) => api.get<{ success: boolean; order: IOrder }>(`/orders/${id}`),
  cancelOrder: (id: string) => api.post<{ success: boolean; order: IOrder; message: string }>(`/orders/${id}/cancel`, {}),
  getAllOrders: (params?: { status?: string; search?: string; limit?: number }) =>
    api.get<{ success: boolean; orders: IOrder[]; total: number }>('/admin/orders', { params }),
  updateOrderStatus: (id: string, orderStatus: string, paymentStatus?: string, note?: string) =>
    api.put<{ success: boolean; order: IOrder; message: string }>(`/admin/orders/${id}/status`, {
      orderStatus,
      paymentStatus,
      note
    })
};

export const paymentAPI = {
  getConfig: () =>
    api.get<{ success: boolean; keyId: string; onlinePaymentEnabled: boolean; codEnabled: boolean }>('/payment/config'),
  createRazorpayOrder: (orderId: string) =>
    api.post<{
      success: boolean;
      keyId: string;
      razorpayOrderId: string;
      amount: number;
      currency: string;
      orderNumber: string;
      isMock?: boolean;
    }>('/payment/create-order', { orderId }),
  verifyRazorpayPayment: (data: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
    isMock?: boolean;
  }) => api.post<{ success: boolean; order: IOrder; message: string }>('/payment/verify', data)
};

export const settingsAPI = {
  getSettings: () => api.get<{ success: boolean; settings: IStoreSettings }>('/settings'),
  updateSettings: (data: Partial<IStoreSettings>) =>
    api.put<{ success: boolean; settings: IStoreSettings; message: string }>('/settings', data)
};

export const adminAPI = {
  getDashboardStats: () =>
    api.get<{
      success: boolean;
      stats: {
        totalRevenue: number;
        totalOrders: number;
        pendingOrders: number;
        processingOrders: number;
        outForDeliveryOrders: number;
        deliveredOrders: number;
        cancelledOrders: number;
        totalProducts: number;
        lowStockCount: number;
        totalCategories: number;
        totalUsers: number;
      };
      recentOrders: IOrder[];
      lowStockProducts: IProduct[];
    }>('/admin/dashboard'),
  getOrders: (params?: { status?: string; search?: string; limit?: number }) =>
    api.get<{ success: boolean; orders: IOrder[]; total: number }>('/admin/orders', { params }),
  updateOrderStatus: (id: string, data: { orderStatus: string; paymentStatus?: string; note?: string }) =>
    api.put<{ success: boolean; order: IOrder; message: string }>(`/admin/orders/${id}/status`, data),
  getUsers: () =>
    api.get<{ success: boolean; users: (IUser & { ordersCount: number; totalSpent: number })[] }>('/admin/users'),
  toggleUserStatus: (id: string) =>
    api.put<{ success: boolean; user: IUser; message: string }>(`/admin/users/${id}/toggle-status`, {})
};

export default api;
