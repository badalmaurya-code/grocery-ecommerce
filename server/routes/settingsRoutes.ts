import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, requireAdmin, updateSettings);

export default router;
