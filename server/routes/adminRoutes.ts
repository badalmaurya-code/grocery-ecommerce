import { Router } from 'express';
import {
  getDashboardStats,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getAllUsersAdmin,
  toggleUserStatus
} from '../controllers/adminController';
import { protect, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes here require Admin JWT authentication
router.use(protect, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatusAdmin);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;
