import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  X
} from 'lucide-react';
import { productAPI, categoryAPI } from '../../services/api';
import { IProduct, ICategory } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AdminProductsPageProps {
  navigate: (view: string, params?: any) => void;
  openAddModal?: boolean;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ navigate, openAddModal }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(openAddModal || false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '',
    hindiName: '',
    category: '',
    price: 50,
    discountPrice: 0,
    unit: '1 kg',
    stock: 20,
    brand: 'Maurya Store',
    description: '',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
    isFeatured: false,
    isActive: true
  });

  const { showToast } = useToast();

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productAPI.getProducts({
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: searchQuery || undefined,
          limit: 100
        }),
        categoryAPI.getCategories()
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (!formData.category && catRes.data.categories.length > 0) {
          setFormData(prev => ({ ...prev, category: catRes.data.categories[0].slug }));
        }
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [categoryFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      hindiName: '',
      category: categories[0]?.slug || 'fresh-vegetables',
      price: 50,
      discountPrice: 0,
      unit: '1 kg',
      stock: 20,
      brand: 'Maurya Store',
      description: '',
      images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: IProduct) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      discountPrice: product.discountPrice || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.unit) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      if (editingProduct) {
        const res = await productAPI.updateProduct(editingProduct._id!, formData);
        if (res.data.success) {
          showToast('Product updated successfully!', 'success');
          setIsModalOpen(false);
          fetchCatalog();
        }
      } else {
        const res = await productAPI.createProduct(formData);
        if (res.data.success) {
          showToast('New product added to store!', 'success');
          setIsModalOpen(false);
          fetchCatalog();
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from store?`)) return;
    try {
      const res = await productAPI.deleteProduct(id);
      if (res.data.success) {
        showToast('Product deleted', 'info');
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            Product & Inventory Management (स्टोर सामान)
          </h1>
          <p className="text-xs text-stone-500 font-hindi">
            किराना, ताज़ी सब्ज़ियाँ जोड़ें, मूल्य व स्टॉक अपडेट करें
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product (नया सामान जोड़ें)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchCatalog()}
            placeholder="Search products by name..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-500 animate-pulse">Loading store catalog...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Item & Hindi Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price / Unit</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {products.map(prod => (
                  <tr key={prod._id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{prod.name}</div>
                          {prod.hindiName && (
                            <div className="text-[11px] text-emerald-800 font-hindi">{prod.hindiName}</div>
                          )}
                          <div className="text-[10px] text-stone-400">{prod.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize font-medium">{prod.category}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900">₹{prod.price}</span>
                      <span className="text-[10px] text-stone-500 block">per {prod.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      {prod.discountPrice ? (
                        <span className="text-emerald-700 font-bold">₹{prod.discountPrice}</span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-extrabold px-2 py-0.5 rounded-md text-[11px] ${
                          prod.stock <= 5
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {prod.stock} {prod.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {prod.isFeatured ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-stone-400">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id!, prod.name)}
                        className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-500">No products found in this category.</div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Grocery Item (नया सामान)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Fresh Red Tomato"
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
                    placeholder="e.g. ताज़ा लाल टमाटर"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl capitalize"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Unit (इकाई) *</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 1 kg, 500 g, 1 Litre"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Brand / Source</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Farm Fresh / Aashirvaad"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Discount Price (₹, optional)</label>
                  <input
                    type="number"
                    value={formData.discountPrice || ''}
                    onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                    placeholder="Leave 0 if none"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Stock Available *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Image URL (Unsplash or Image link)</label>
                <input
                  type="text"
                  value={formData.images && formData.images[0] ? formData.images[0] : ''}
                  onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Description (विवरण)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fresh local produce, crisp and rich in nutrition..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="text-emerald-700 rounded"
                  />
                  <span className="font-bold text-stone-800">Featured Product (होम पेज पर दिखाएं)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="text-emerald-700 rounded"
                  />
                  <span className="font-bold text-stone-800">Active in Store</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
