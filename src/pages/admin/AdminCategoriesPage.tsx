import React, { useState, useEffect } from 'react';
import { Boxes, Plus, Edit2, Trash2, ArrowLeft, X } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import { ICategory } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AdminCategoriesPageProps {
  navigate: (view: string, params?: any) => void;
}

export const AdminCategoriesPage: React.FC<AdminCategoriesPageProps> = ({ navigate }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    order: 0
  });

  const { showToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getCategories();
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      hindiName: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: ICategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      hindiName: cat.hindiName || '',
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingCategory) {
        const res = await categoryAPI.updateCategory(editingCategory._id!, formData);
        if (res.data.success) {
          showToast('Category updated successfully!', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await categoryAPI.createCategory(formData);
        if (res.data.success) {
          showToast('New category created!', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await categoryAPI.deleteCategory(id);
      if (res.data.success) {
        showToast('Category deleted', 'info');
        setCategories(prev => prev.filter(c => c._id !== id));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('admin-dashboard')}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Categories Management (श्रेणी प्रबंधन)
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="aspect-video rounded-2xl overflow-hidden bg-stone-100 relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-base text-stone-900">{cat.name}</h3>
                {cat.hindiName && (
                  <p className="text-xs text-emerald-800 font-hindi">{cat.hindiName}</p>
                )}
                <p className="text-[11px] text-stone-400 font-mono mt-0.5">slug: {cat.slug}</p>
                {cat.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{cat.description}</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-3">
              <span className="font-medium text-stone-400">{cat.productCount || 0} Products</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id!, cat.name)}
                  className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fresh Vegetables"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Hindi Name (हिंदी नाम) *</label>
                <input
                  type="text"
                  required
                  value={formData.hindiName}
                  onChange={e => setFormData({ ...formData, hindiName: e.target.value })}
                  placeholder="e.g. ताज़ी सब्ज़ियाँ"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. fresh-vegetables (auto-generated if empty)"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
