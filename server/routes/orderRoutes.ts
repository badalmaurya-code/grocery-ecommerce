import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderDetails,
  cancelOrder
} from '../controllers/orderController';
import { optionalAuth, protect } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', optionalAuth, getOrderDetails);
router.post('/:id/cancel', optionalAuth, cancelOrder);

export default router;
