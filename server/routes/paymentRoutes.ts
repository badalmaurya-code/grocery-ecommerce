import { Router } from 'express';
import {
  getPaymentConfig,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../controllers/paymentController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/config', getPaymentConfig);
router.post('/create-order', optionalAuth, createRazorpayOrder);
router.post('/verify', optionalAuth, verifyRazorpayPayment);

export default router;
