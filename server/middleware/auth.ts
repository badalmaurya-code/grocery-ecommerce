import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DataService } from '../services/dataService';
import { IUser } from '../../src/types';

export interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'maurya_grocery_super_secret_jwt_key_2026';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '30d' });
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = await DataService.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required. Access denied.' });
  }
  next();
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      const user = await DataService.findUserById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
};
