import { Request, Response } from 'express';
import { DataService } from '../services/dataService';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await DataService.getSettings();
    res.json({
      success: true,
      settings: {
        ...settings,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('YOUR_RAZORPAY')
          ? process.env.RAZORPAY_KEY_ID
          : undefined
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updated = await DataService.updateSettings(updates);
    res.json({
      success: true,
      message: 'Store settings updated successfully',
      settings: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update store settings' });
  }
};
