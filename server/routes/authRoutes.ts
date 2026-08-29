import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);

export default router;
