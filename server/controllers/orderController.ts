import { Response } from 'express';
import { DataService } from '../services/dataService';
import { AuthRequest } from '../middleware/auth';
import { IOrderItem, IOrder } from '../../src/types';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod, customerNote } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to place an order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    if (!paymentMethod || !['cod', 'razorpay'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Valid payment method (cod or razorpay) is required' });
    }

    const settings = await DataService.getSettings();

    // Check if store is open
    if (!settings.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'The store is currently closed for new orders. Please check our opening hours.'
      });
    }

    if (paymentMethod === 'cod' && !settings.codEnabled) {
      return res.status(400).json({ success: false, message: 'Cash on delivery is currently disabled' });
    }

    if (paymentMethod === 'razorpay' && !settings.onlinePaymentEnabled) {
      return res.status(400).json({ success: false, message: 'Online payment is currently disabled' });
    }

    // Recalculate and validate prices against database
    const validatedItems: IOrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const dbProduct = await DataService.getProductByIdOrSlug(item.productId || item.product?._id || item._id);

      if (!dbProduct) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name || item.productId} was not found in catalog`
        });
      }

      if (!dbProduct.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${dbProduct.name}" is currently not available`
        });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);

      if (dbProduct.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} ${dbProduct.unit} available.`
        });
      }

      const effectivePrice = dbProduct.discountPrice !== undefined && dbProduct.discountPrice > 0
        ? dbProduct.discountPrice
        : dbProduct.price;

      const itemTotal = effectivePrice * qty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: dbProduct._id!,
        name: dbProduct.name,
        hindiName: dbProduct.hindiName,
        price: effectivePrice,
        quantity: qty,
        unit: dbProduct.unit,
        image: dbProduct.images && dbProduct.images[0] ? dbProduct.images[0] : '',
        itemTotal
      });
    }

    // Calculate delivery charge according to store rules
    let deliveryCharge = 0;
    if (calculatedSubtotal < settings.freeDeliveryThreshold) {
      deliveryCharge = settings.deliveryCharge;
    }

    const discount = 0;
    const finalTotal = calculatedSubtotal + deliveryCharge - discount;

    const orderNumber = `MG-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;

    const userDetails = {
      userId: req.user?._id || undefined,
      name: shippingAddress.fullName || req.user?.name || 'Customer',
      email: req.user?.email || req.body.email || 'guest@mauryagrocery.com',
      phone: shippingAddress.phone || req.user?.phone || ''
    };

    const newOrder = await DataService.createOrder({
      orderNumber,
      user: userDetails,
      items: validatedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        area: shippingAddress.area || 'Mahavir Chhapra',
        city: shippingAddress.city || 'Gorakhpur',
        state: shippingAddress.state || 'Uttar Pradesh',
        pincode: shippingAddress.pincode || '273001',
        landmark: shippingAddress.landmark || ''
      },
      subtotal: calculatedSubtotal,
      deliveryCharge,
      discount,
      totalAmount: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      statusTimeline: [
        {
          status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
          timestamp: new Date(),
          note: paymentMethod === 'cod'
            ? 'Order confirmed with Cash on Delivery at Mahavir Chhapra'
            : 'Awaiting online payment'
        }
      ],
      customerNote
    });

    // Deduct stock for confirmed orders
    if (paymentMethod === 'cod') {
      for (const item of validatedItems) {
        const p = await DataService.getProductByIdOrSlug(item.productId);
        if (p) {
          await DataService.updateProduct(p._id!, { stock: Math.max(0, p.stock - item.quantity) });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error: any) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const orders = await DataService.getOrdersByUser(req.user._id);
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await DataService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If user is logged in, ensure they own the order unless they are admin
    if (req.user && req.user.role !== 'admin') {
      if (order.user.userId && order.user.userId !== req.user._id && order.user.email.toLowerCase() !== req.user.email.toLowerCase()) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await DataService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'out_for_delivery') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus.replace('_', ' ')}.`
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    const updated = await DataService.updateOrderStatus(id, 'cancelled', order.paymentStatus === 'paid' ? 'refunded' : 'failed', 'Cancelled by customer');

    // Restore stock
    for (const item of order.items) {
      const p = await DataService.getProductByIdOrSlug(item.productId);
      if (p) {
        await DataService.updateProduct(p._id!, { stock: p.stock + item.quantity });
      }
    }

    res.json({ success: true, message: 'Order cancelled successfully', order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};
