import { Request, Response } from 'express';
import { DataService } from '../services/dataService';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const categories = await DataService.getCategories(onlyActive);

    // Attach product count
    const { products } = await DataService.getProducts({ limit: 1000, onlyActive: false });
    const enriched = categories.map(cat => {
      const count = products.filter(p => p.category === cat.slug && p.isActive).length;
      return { ...cat, productCount: count };
    });

    res.json({ success: true, categories: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, hindiName, description, icon, image, displayOrder, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await DataService.getCategoryBySlug(slug);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category with this name already exists' });
    }

    const category = await DataService.createCategory({
      name,
      hindiName,
      slug,
      description,
      icon: icon || 'Boxes',
      image: image || '',
      displayOrder: Number(displayOrder) || 0,
      isActive: isActive !== false
    });

    res.status(201).json({ success: true, message: 'Category created successfully', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, hindiName, description, icon, image, displayOrder, isActive } = req.body;

    const updated = await DataService.updateCategory(id, {
      name,
      hindiName,
      description,
      icon,
      image,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      isActive
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category updated successfully', category: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DataService.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};
