import { Request, Response } from 'express';
import crypto from 'crypto';
import { DataService } from '../services/dataService';
import { AuthRequest } from '../middleware/auth';

const getRazorpayKeyId = (): string => {
  return (
    process.env.RAZORPAY_KEY_ID ||
    process.env.razorpay_key_id ||
    process.env.ROZERPAY_KEY_ID ||
    process.env.rozerpay_key_id ||
    process.env.RAZORPAY_ID ||
    process.env.razorpay_id ||
    ''
  );
};

const getRazorpayKeySecret = (): string => {
  return (
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.razorpay_key_secret ||
    process.env.ROZERPAY_KEY_SECRET ||
    process.env.rozerpay_key_secret ||
    process.env.RAZORPAY_SECRET ||
    process.env.razorpay_secret ||
    ''
  );
};

export const getPaymentConfig = async (req: Request, res: Response) => {
  try {
    const keyId = getRazorpayKeyId();
    const settings = await DataService.getSettings();

    res.json({
      success: true,
      keyId: keyId.includes('YOUR_RAZORPAY') ? '' : keyId,
      onlinePaymentEnabled: settings.onlinePaymentEnabled,
      codEnabled: settings.codEnabled
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to get payment configuration' });
  }
};

export const createRazorpayOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await DataService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This order is already paid' });
    }

    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();

    const amountInPaise = Math.round(order.totalAmount * 100);

    // If real Razorpay credentials are configured, we can call Razorpay SDK
    if (keyId && keySecret && !keyId.includes('YOUR_RAZORPAY')) {
      try {
        // Safe dynamic require / import for razorpay
        const rzpModule: any = await import('razorpay');
        const Razorpay = rzpModule.default || rzpModule;
        const instance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret
        });

        const options = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${order.orderNumber}`,
          notes: {
            orderNumber: order.orderNumber,
            customerPhone: order.user.phone
          }
        };

        const razorpayOrder = await instance.orders.create(options);

        // Save razorpayOrderId on order
        await DataService.updateOrderStatus(order._id!, order.orderStatus, 'pending', `Razorpay order created: ${razorpayOrder.id}`);
        const current = await DataService.getOrderById(order._id!);
        if (current) {
          current.razorpayOrderId = razorpayOrder.id;
        }

        return res.json({
          success: true,
          keyId,
          razorpayOrderId: razorpayOrder.id,
          amount: amountInPaise,
          currency: 'INR',
          orderNumber: order.orderNumber,
          isMock: false
        });
      } catch (rzpErr: any) {
        console.error('Razorpay SDK Order Create Error:', rzpErr);
        // Fallback to demo mode if credentials fail
      }
    }

    // Interactive Demo / Sandbox Mode for previewing without live credentials
    const mockRazorpayOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const current = await DataService.getOrderById(order._id!);
    if (current) {
      current.razorpayOrderId = mockRazorpayOrderId;
    }

    res.json({
      success: true,
      keyId: keyId || 'rzp_test_mock_maurya_grocery',
      razorpayOrderId: mockRazorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      orderNumber: order.orderNumber,
      isMock: true,
      message: 'Running in Razorpay simulated/sandbox mode. Payment flow can be tested smoothly.'
    });
  } catch (error: any) {
    console.error('createRazorpayOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment session', error: error.message });
  }
};

export const verifyRazorpayPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature, isMock } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Missing payment verification parameters' });
    }

    const order = await DataService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Idempotency: If already paid, return success immediately
    if (order.paymentStatus === 'paid') {
      return res.json({
        success: true,
        message: 'Order was already verified and marked as paid',
        order
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Signature verification with real Razorpay credentials
    if (keySecret && !keySecret.includes('YOUR_RAZORPAY') && !isMock) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        await DataService.updateOrderStatus(order._id!, order.orderStatus, 'failed', 'Razorpay signature mismatch');
        return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
      }
    }

    // Update order status to Confirmed & Paid
    const updated = await DataService.updateOrderStatus(
      order._id!,
      'confirmed',
      'paid',
      `Payment verified successfully via Razorpay (Payment ID: ${razorpay_payment_id})`
    );

    if (updated) {
      updated.razorpayOrderId = razorpay_order_id;
      updated.razorpayPaymentId = razorpay_payment_id;
      updated.razorpaySignature = razorpay_signature;

      // Deduct stock
      for (const item of updated.items) {
        const p = await DataService.getProductByIdOrSlug(item.productId);
        if (p) {
          await DataService.updateProduct(p._id!, { stock: Math.max(0, p.stock - item.quantity) });
        }
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully! 🎉',
      order: updated
    });
  } catch (error: any) {
    console.error('verifyRazorpayPayment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};
