import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Award,
  Phone,
  MessageCircle,
  Clock,
  Carrot,
  Apple,
  Boxes,
  Wheat,
  Droplet,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { ICategory, IProduct } from '../types';
import { categoryAPI, productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { DeliveryBanner } from '../components/DeliveryBanner';
import { useSettings } from '../context/SettingsContext';
import { ProductGridSkeleton } from '../components/skeletons/ProductCardSkeleton';
import { CategoryGridSkeleton } from '../components/skeletons/CategorySkeleton';

interface HomePageProps {
  navigate: (view: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [freshVeggieProducts, setFreshVeggieProducts] = useState<IProduct[]>([]);
  const [staplesProducts, setStaplesProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [catsRes, featRes, vegRes, staplesRes] = await Promise.all([
          categoryAPI.getCategories(),
          productAPI.getProducts({ featured: true, limit: 8 }),
          productAPI.getProducts({ category: 'fresh-vegetables', limit: 4 }),
          productAPI.getProducts({ category: 'flour-atta', limit: 4 })
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.categories);
        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (vegRes.data.success) setFreshVeggieProducts(vegRes.data.products);
        if (staplesRes.data.success) setStaplesProducts(staplesRes.data.products);
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION - Maurya Grocery Branding Inspired */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>महावीर छपरा, गोरखपुर का भरोसेमंद किराना स्टोर</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-white leading-tight">
                  {settings.storeHindiName}
                  <span className="block text-2xl sm:text-3xl font-sans font-bold text-emerald-300 mt-1">
                    {settings.storeName}
                  </span>
                </h1>

                <p className="text-base sm:text-xl text-emerald-100 font-hindi font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  "{settings.tagline}"
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                ताज़ी हरी सब्ज़ियाँ, फल, आटा, दाल, चावल, सरसों तेल, मसाले, बिस्कुट, कोल्ड ड्रिंक्स और दैनिक उपयोग की सभी वस्तुएँ अब घर बैठे मंगाएँ।
              </p>

              {/* Delivery Highlight Pill */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs sm:text-sm text-emerald-100">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white">1 KM के अंदर</strong> ₹{settings.freeDeliveryThreshold}+ पर{' '}
                  <span className="text-amber-300 font-bold">Free Home Delivery</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => navigate('shop')}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>अभी खरीदें (Shop Now)</span>
                </button>

                <button
                  id="hero-veggies-btn"
                  onClick={() => navigate('shop', { category: 'fresh-vegetables' })}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-2xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <Carrot className="w-4 h-4 text-amber-400" />
                  <span>ताज़ी सब्ज़ियाँ</span>
                </button>

                <a
                  href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent('नमस्ते मौर्य ग्रॉसरी, मुझे ऑर्डर देना है।')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-200 border border-[#25D366]/40 font-semibold text-sm rounded-2xl transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-800/60 bg-emerald-900/40">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Maurya Grocery Fresh Store"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="bg-white/95 backdrop-blur-md text-stone-900 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>महावीर छपरा, गोरखपुर</span>
                      </div>
                      <p className="text-xs font-medium text-stone-600 mt-0.5 font-hindi">
                        दैनिक 07:00 AM से 09:30 PM तक खुला
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('shop')}
                      className="px-3.5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs shrink-0"
                    >
                      View Items →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              किराना एवं सब्ज़ी श्रेणियाँ
            </h2>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <CategoryGridSkeleton count={6} variant="compact" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.slice(0, 12).map(cat => (
              <div
                key={cat._id || cat.slug}
                onClick={() => navigate('shop', { category: cat.slug })}
                className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500/60 p-3 flex flex-col items-center text-center cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-emerald-50/50 mb-2.5 group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-700">
                  {cat.name}
                </h3>
                {cat.hindiName && (
                  <p className="text-[11px] text-emerald-800 font-hindi font-medium line-clamp-1 mt-0.5">
                    {cat.hindiName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. HOME DELIVERY FEATURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DeliveryBanner onShopClick={() => navigate('shop')} />
      </section>

      {/* 4. FEATURED BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Popular Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              आज के लोकप्रिय सामान (Bestsellers)
            </h2>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} columnsClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={p => navigate('product-detail', { slug: p.slug })}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. FRESH VEGETABLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Carrot className="w-4 h-4 text-emerald-600" /> Farm Fresh Daily
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">
                ताज़ी सब्ज़ियाँ (Daily Fresh Vegetables)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-hindi mt-1">
                स्वच्छ, ताज़ा और हाथ से छांटी हुई गुणवत्ता युक्त सब्ज़ियाँ
              </p>
            </div>
            <button
              onClick={() => navigate('shop', { category: 'fresh-vegetables' })}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shrink-0"
            >
              सभी सब्ज़ियाँ देखें →
            </button>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} columnsClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {freshVeggieProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onSelect={p => navigate('product-detail', { slug: p.slug })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. ESSENTIAL STAPLES (Atta, Dal, Oil) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Daily Kitchen Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              शुद्ध आटा, दाल, चावल एवं सरसों तेल
            </h2>
          </div>
          <button
            onClick={() => navigate('shop', { category: 'flour-atta' })}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} columnsClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {staplesProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={p => navigate('product-detail', { slug: p.slug })}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
