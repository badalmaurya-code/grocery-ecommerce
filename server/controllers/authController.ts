import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { DataService } from '../services/dataService';
import { generateToken, AuthRequest } from '../middleware/auth';
import { IAddress } from '../../src/types';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();
    const cleanPassword = String(password || '');

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, phone, password)' });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await DataService.findUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const user = await DataService.createUser({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: 'user',
      addresses: [],
      isActive: true
    });

    const token = generateToken(String(user._id), user.role);

    const { password: _, ...userSafe } = user;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Maurya Grocery.',
      token,
      user: userSafe
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const user = await DataService.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact store support.' });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(String(user._id), user.role);
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userSafe
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const { password: _, ...userSafe } = req.user;
    res.json({
      success: true,
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, phone } = req.body;
    const updated = await DataService.updateUser(req.user._id, {
      name: name || req.user.name,
      phone: phone || req.user.phone
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password: _, ...userSafe } = updated;
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const isMatch = await bcrypt.compare(currentPassword, req.user.password || '');
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await DataService.updateUser(req.user._id, { password: hashedNew });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { fullName, phone, addressLine, area, city, state, pincode, landmark, isDefault } = req.body;

    if (!fullName || !phone || !addressLine || !area) {
      return res.status(400).json({ success: false, message: 'Please provide full name, phone, address line and area' });
    }

    const newAddress: IAddress = {
      _id: `addr_${Date.now()}`,
      fullName,
      phone,
      addressLine,
      area,
      city: city || 'Gorakhpur',
      state: state || 'Uttar Pradesh',
      pincode: pincode || '273001',
      landmark: landmark || '',
      isDefault: isDefault ?? (req.user.addresses.length === 0)
    };

    let addresses = [...(req.user.addresses || [])];
    if (newAddress.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }
    addresses.push(newAddress);

    const updated = await DataService.updateUser(req.user._id, { addresses });
    const { password: _, ...userSafe } = updated!;

    res.json({
      success: true,
      message: 'Delivery address added successfully',
      addresses: updated?.addresses,
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error adding address' });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { id } = req.params;
    let addresses = req.user.addresses.filter(a => a._id !== id);

    // If default was deleted, assign first one as default if available
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
      addresses[0].isDefault = true;
    }

    const updated = await DataService.updateUser(req.user._id, { addresses });
    const { password: _, ...userSafe } = updated!;

    res.json({
      success: true,
      message: 'Address removed successfully',
      addresses: updated?.addresses,
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting address' });
  }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { id } = req.params;
    const addresses = req.user.addresses.map(a => ({
      ...a,
      isDefault: a._id === id
    }));

    const updated = await DataService.updateUser(req.user._id, { addresses });
    const { password: _, ...userSafe } = updated!;

    res.json({
      success: true,
      message: 'Default address updated',
      addresses: updated?.addresses,
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error setting default address' });
  }
};
