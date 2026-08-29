import React from 'react';
import { Plus, Minus, Check, Sparkles, Star } from 'lucide-react';
import { IProduct } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: IProduct;
  onSelect?: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const quantityInCart = getItemQuantity(product._id!);

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500/50 p-3 sm:p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Discount & Tag Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {hasDiscount && (
          <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Best Seller
          </span>
        )}
      </div>

      {/* Product Image */}
      <div
        onClick={() => onSelect?.(product)}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-3 cursor-pointer group-hover:scale-[1.02] transition-transform duration-200"
      >
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-stone-900/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock (समाप्त)
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider mb-0.5">
          {product.brand || 'Maurya Store'}
        </div>

        <h3
          onClick={() => onSelect?.(product)}
          className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 hover:text-emerald-800 cursor-pointer transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>

        {product.hindiName && (
          <p className="text-xs font-medium text-emerald-800 font-hindi mt-0.5 line-clamp-1">
            {product.hindiName}
          </p>
        )}

        {/* Rating & Stock status */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md font-semibold text-[11px]">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{product.rating || 4.8}</span>
          </div>
          <span className="text-[11px] text-stone-500">
            {product.unit ? `(${product.unit})` : ''}
          </span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded-md">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>

      {/* Pricing & Add to Cart Controls */}
      <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-sm sm:text-base lg:text-lg font-extrabold text-stone-900">
              ₹{hasDiscount ? product.discountPrice : product.price}
            </span>
            {hasDiscount && (
              <span className="text-[11px] sm:text-xs text-stone-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-500 block truncate">per {product.unit}</span>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {isOutOfStock ? (
            <button
              disabled
              className="px-2 sm:px-3 py-1.5 bg-stone-100 text-stone-400 text-[11px] sm:text-xs font-semibold rounded-xl cursor-not-allowed"
            >
              Out of stock
            </button>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center bg-emerald-800 text-white rounded-xl p-0.5 shadow-xs">
              <button
                onClick={() => updateQuantity(product._id!, quantityInCart - 1)}
                className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                title="Decrease"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="w-5 sm:w-6 text-center text-xs font-bold">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateQuantity(product._id!, quantityInCart + 1)}
                className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                title="Increase"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-2.5 sm:px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-300 hover:border-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
