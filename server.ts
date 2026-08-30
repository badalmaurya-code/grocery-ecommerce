import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import productRoutes from './server/routes/productRoutes';
import categoryRoutes from './server/routes/categoryRoutes';
import orderRoutes from './server/routes/orderRoutes';
import paymentRoutes from './server/routes/paymentRoutes';
import settingsRoutes from './server/routes/settingsRoutes';
import adminRoutes from './server/routes/adminRoutes';

const PORT = 3000;

export async function createApp() {
  const app = express();

  // Standard middleware
  app.use(cors({
    origin: true,
    credentials: true
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Connect Database
  await connectDB();

  // API Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      store: 'Maurya Grocery (मौर्य ग्रॉसरी)',
      location: 'Mahavir Chhapra, Gorakhpur',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/admin', adminRoutes);

  // Global API Error Handler
  app.use('/api/*', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('API Error:', err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  });

  // Frontend is handled by Vercel in production.
  // Keep Vite/static serving only for local development.
  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });

      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');

      app.use(express.static(distPath));

      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  return app;
}

// Local development server
if (!process.env.VERCEL) {
  createApp()
    .then((app) => {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(
          `🛒 [Maurya Grocery Server] Running on http://localhost:${PORT}`
        );
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
    });
}