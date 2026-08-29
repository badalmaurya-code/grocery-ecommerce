import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, RefreshCw, X, Check, ChevronDown } from 'lucide-react';
import { ICategory, IProduct } from '../types';
import { categoryAPI, productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  navigate: (view: string, params?: any) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ navigate, initialCategory, initialSearch }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [sortOption, setSortOption] = useState<string>('default');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Categories once
  useEffect(() => {
    categoryAPI.getCategories().then(res => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    });
  }, []);

  // Fetch Products whenever filters change
  const fetchProductsWith = async (overrides?: {
    category?: string;
    search?: string;
    sort?: string;
    min?: string;
    max?: string;
  }) => {
    setLoading(true);
    try {
      const cat = overrides && overrides.category !== undefined ? overrides.category : selectedCategory;
      const search = overrides && overrides.search !== undefined ? overrides.search : searchQuery;
      const sort = overrides && overrides.sort !== undefined ? overrides.sort : sortOption;
      const min = overrides && overrides.min !== undefined ? overrides.min : minPrice;
      const max = overrides && overrides.max !== undefined ? overrides.max : maxPrice;

      const res = await productAPI.getProducts({
        category: cat === 'all' ? undefined : cat,
        search: search.trim() || undefined,
        sort: sort !== 'default' ? sort : undefined,
        minPrice: min ? Number(min) : undefined,
        maxPrice: max ? Number(max) : undefined,
        limit: 48
      });

      if (res.data.success) {
        setProducts(res.data.products);
        setTotalProducts(res.data.total);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = () => fetchProductsWith();

  useEffect(() => {
    fetchProductsWith({ category: selectedCategory, sort: sortOption });
  }, [selectedCategory, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('default');
    setMinPrice('');
    setMaxPrice('');
    fetchProductsWith({
      category: 'all',
      search: '',
      sort: 'default',
      min: '',
      max: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header / Breadcrumb */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          Store Catalog (दुकान)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          {selectedCategory === 'all'
            ? 'सभी किराना एवं ताज़ा सामान'
            : categories.find(c => c.slug === selectedCategory)?.name || 'Products'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-hindi mt-1">
          घर बैठे शुद्ध एवं ताज़ा किराने का सामान ऑर्डर करें • {totalProducts} सामान उपलब्ध
        </p>
      </div>

      {/* Controls Bar: Search, Category Quick Pills, Sort, Filter Toggle */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search in store (टमाटर, आटा, दाल...)"
              className="w-full pl-9 pr-20 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold border border-stone-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-hidden focus:border-emerald-600"
              >
                <option value="default">Featured (सुझावित)</option>
                <option value="price_asc">Price: Low to High (सस्ता पहले)</option>
                <option value="price_desc">Price: High to Low (महंगा पहले)</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="rating">Top Rated (उच्च रेटिंग)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Items (सभी)
          </button>
          {categories.map(c => (
            <button
              key={c._id || c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === c.slug
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-stone-200 h-fit shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-semibold text-rose-600 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Category</h4>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
              </button>
              {categories.map(c => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.slug
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {selectedCategory === c.slug && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Price Range (₹)</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="p-2 text-xs border border-stone-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="p-2 text-xs border border-stone-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <button
              onClick={fetchProducts}
              className="w-full py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              Apply Price Filter
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse space-y-3">
                  <div className="aspect-square bg-stone-200 rounded-xl" />
                  <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                  <div className="h-3 bg-stone-200 rounded-md w-1/2" />
                  <div className="h-8 bg-stone-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onSelect={p => navigate('product-detail', { slug: p.slug })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                🥬
              </div>
              <h3 className="text-lg font-bold text-stone-800 font-serif">No products found</h3>
              <p className="text-xs text-stone-500 font-hindi max-w-sm mx-auto">
                आपके द्वारा खोजे गए शब्द या फिल्टर के अनुसार कोई सामान नहीं मिला। कृपया दूसरा नाम खोजें।
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs font-medium ${
                    selectedCategory === 'all' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs font-medium ${
                      selectedCategory === c.slug ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                handleClearFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
