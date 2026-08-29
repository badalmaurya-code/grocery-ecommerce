import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICartItem, IProduct } from '../types';
import { useSettings } from './SettingsContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  totalAmount: number;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maurya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { settings } = useSettings();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('maurya_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  const addToCart = (product: IProduct, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.product._id === product._id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const newQty = currentQty + quantity;
      if (newQty > product.stock) {
        showToast(`Only ${product.stock} ${product.unit} available in stock`, 'error');
        return;
      }
      const updated = [...cart];
      updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
      setCart(updated);
      showToast(`Updated quantity of ${product.name} to ${newQty}`, 'success');
    } else {
      if (quantity > product.stock) {
        showToast(`Only ${product.stock} ${product.unit} available in stock`, 'error');
        return;
      }
      setCart([...cart, { product, quantity }]);
      showToast(`Added ${product.name} to cart!`, 'success');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(i => i.product._id === productId);
    if (item && quantity > item.product.stock) {
      showToast(`Only ${item.product.stock} ${item.product.unit} available in stock`, 'error');
      return;
    }

    setCart(
      cart.map(item => (item.product._id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product._id === productId);
    if (item) {
      showToast(`Removed ${item.product.name} from cart`, 'info');
    }
    setCart(cart.filter(i => i.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find(i => i.product._id === productId);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice !== undefined && item.product.discountPrice > 0
      ? item.product.discountPrice
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 299;
  const deliveryCharge = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : settings.deliveryCharge || 30;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const totalAmount = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        deliveryCharge,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        totalAmount,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
