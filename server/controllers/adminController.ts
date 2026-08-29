import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { IOrder } from '../../src/types';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [allOrders, allUsers, productsResult, categories] = await Promise.all([
      DataService.getAllOrders(),
      DataService.getAllUsers(),
      DataService.getProducts({ limit: 1000, onlyActive: false }),
      DataService.getCategories(false)
    ]);

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders
      .filter(o => o.orderStatus !== 'cancelled' && (o.paymentStatus === 'paid' || o.paymentMethod === 'cod'))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = allOrders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
    const processingOrders = allOrders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'packed').length;
    const outForDeliveryOrders = allOrders.filter(o => o.orderStatus === 'out_for_delivery').length;
    const deliveredOrders = allOrders.filter(o => o.orderStatus === 'delivered').length;
    const cancelledOrders = allOrders.filter(o => o.orderStatus === 'cancelled').length;

    const totalProducts = productsResult.total;
    const lowStockProducts = productsResult.products.filter(p => p.stock <= 5);
    const totalUsers = allUsers.length;

    // Recent 10 orders
    const recentOrders = allOrders.slice(0, 10);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        processingOrders,
        outForDeliveryOrders,
        deliveredOrders,
        cancelledOrders,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        totalCategories: categories.length,
        totalUsers
      },
      recentOrders,
      lowStockProducts: lowStockProducts.slice(0, 5)
    });
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
  }
};

export const getAllOrdersAdmin = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let orders = await DataService.getAllOrders();

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      orders = orders.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.user.name.toLowerCase().includes(q) ||
          o.user.phone.includes(q) ||
          o.shippingAddress.addressLine.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, orders, total: orders.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin orders' });
  }
};

export const updateOrderStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, note } = req.body;

    if (!orderStatus) {
      return res.status(400).json({ success: false, message: 'Order status is required' });
    }

    const updated = await DataService.updateOrderStatus(id, orderStatus, paymentStatus, note);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: `Order status updated to ${orderStatus}`, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

export const getAllUsersAdmin = async (req: Request, res: Response) => {
  try {
    const users = await DataService.getAllUsers();
    const allOrders = await DataService.getAllOrders();

    // Attach order counts to each user
    const enriched = users.map(u => {
      const userOrders = allOrders.filter(
        o => o.user.userId === u._id || o.user.email.toLowerCase() === u.email.toLowerCase()
      );
      const totalSpent = userOrders
        .filter(o => o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        ...u,
        ordersCount: userOrders.length,
        totalSpent
      };
    });

    res.json({ success: true, users: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await DataService.findUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate an admin account' });
    }

    const updated = await DataService.updateUser(id, { isActive: !user.isActive });
    res.json({
      success: true,
      message: `User account ${updated?.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to toggle user status' });
  }
};
