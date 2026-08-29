import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  Star,
  CheckCircle2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { IProduct } from '../types';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailSkeleton } from '../components/skeletons/ProductDetailSkeleton';

interface ProductDetailPageProps {
  slug: string;
  navigate: (view: string, params?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, navigate }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, getItemQuantity } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProductBySlugOrId(slug);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.related || []);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 font-serif">Product Not Found</h2>
        <p className="text-sm text-stone-500 font-hindi">यह सामान उपलब्ध नहीं है। कृपया दूसरा सामान देखें।</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price;
  const effectivePrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const inCartQty = getItemQuantity(product._id!);

  const handleWhatsAppInquiry = () => {
    const text = `नमस्ते मौर्य ग्रॉसरी, मुझे *${product.name}* (${product.hindiName || ''}) - ${quantity} ${product.unit} (₹${effectivePrice * quantity}) के बारे में जानकारी चाहिए और ऑर्डर करना है।`;
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('shop')}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products (दुकान पर वापस जाएं)</span>
      </button>

      {/* Main Product Details Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Product Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
              <img
                src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-md">
                  {discountPercent}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <span>{product.brand || 'Maurya Grocery'}</span>
                <span>•</span>
                <span className="capitalize">{product.categoryName || product.category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif leading-tight">
                {product.name}
              </h1>

              {product.hindiName && (
                <p className="text-base sm:text-lg font-semibold text-emerald-800 font-hindi">
                  {product.hindiName}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating || 4.8} / 5.0</span>
                </div>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600">{product.reviewCount || 24} customer ratings</span>
                <span className="text-stone-400">•</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} ${product.unit} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-stone-900 font-serif">
                  ₹{effectivePrice}
                </span>
                {hasDiscount && (
                  <span className="text-base text-stone-400 line-through">
                    ₹{product.price}
                  </span>
                )}
                <span className="text-xs text-stone-500 font-medium">per {product.unit}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Inclusive of all taxes. Fresh stock guaranteed.
              </p>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700">Quantity ({product.unit}):</span>
                <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4 text-stone-700" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4 text-stone-700" />
                  </button>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  Total: <strong className="text-stone-900">₹{effectivePrice * quantity}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <button
                  id="add-to-cart-detail-btn"
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Add to Cart ({inCartQty > 0 ? `${inCartQty} in Cart` : 'कार्ट में जोड़ें'})</span>
                </button>

                <button
                  id="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 px-4 bg-amber-400 hover:bg-amber-300 disabled:bg-stone-300 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>Buy Now (तुरंत खरीदें)</span>
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="py-3 px-4 sm:p-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-2xl transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                  title="WhatsApp Inquiry"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span className="sm:hidden text-xs font-bold">Ask on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Delivery Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settings.deliveryRadiusKm} KM Free Delivery above ₹{settings.freeDeliveryThreshold}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Quality & Freshness Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery (COD) Available</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Local Store Delivery (Mahavir Chhapra)</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">Product Description</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Related Items from this Category (संबंधित सामान)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel._id}
                product={rel}
                onSelect={p => navigate('product-detail', { slug: p.slug })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
