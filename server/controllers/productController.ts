import { Request, Response } from 'express';
import { DataService } from '../services/dataService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, featured, minPrice, maxPrice, sort, page, limit, all } = req.query;

    const result = await DataService.getProducts({
      search: search as string,
      category: category as string,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 24,
      onlyActive: all !== 'true'
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;
    const product = await DataService.getProductByIdOrSlug(slugOrId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Also fetch related products from same category
    const { products: related } = await DataService.getProducts({
      category: product.category,
      limit: 6
    });

    const filteredRelated = related.filter(p => p._id !== product._id).slice(0, 4);

    res.json({
      success: true,
      product,
      related: filteredRelated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      hindiName,
      description,
      category,
      categoryName,
      price,
      discountPrice,
      stock,
      unit,
      images,
      brand,
      sku,
      isFeatured,
      isActive
    } = req.body;

    if (!name || price === undefined || stock === undefined || !unit || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory fields (name, category, price, stock, unit)' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await DataService.createProduct({
      name,
      hindiName,
      slug,
      description: description || '',
      category,
      categoryName,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      unit,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
      brand: brand || 'Maurya',
      sku: sku || `MG-${Date.now().toString().slice(-4)}`,
      isFeatured: !!isFeatured,
      isActive: isActive !== false
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discountPrice !== undefined) updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : undefined;
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = await DataService.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DataService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};
