import React, { useState, useEffect } from 'react';
import { ArrowRight, Boxes } from 'lucide-react';
import { ICategory } from '../types';
import { categoryAPI } from '../services/api';

interface CategoriesPageProps {
  navigate: (view: string, params?: any) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ navigate }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryAPI.getCategories().then(res => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">All Categories</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          किराना एवं ताज़ी सब्ज़ी श्रेणियाँ
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-hindi mt-1">
          अपनी आवश्यकता के अनुसार श्रेणी चुनें और तुरंत ताज़ा सामान मंगाएँ
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse space-y-4">
              <div className="aspect-square bg-stone-200 rounded-2xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat._id || cat.slug}
              onClick={() => navigate('shop', { category: cat.slug })}
              className="group bg-white rounded-3xl border border-stone-200/90 hover:border-emerald-500/80 p-5 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-emerald-50/50 relative">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-900 shadow-xs">
                    {cat.productCount || 0} Items
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.hindiName && (
                    <p className="text-xs font-semibold text-emerald-700 font-hindi mt-0.5">
                      {cat.hindiName}
                    </p>
                  )}
                  {cat.description && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Browse Products →</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
