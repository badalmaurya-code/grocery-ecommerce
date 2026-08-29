import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Phone,
  Menu,
  X,
  ChevronDown,
  LogOut,
  PackageCheck,
  ShieldCheck,
  Store,
  Clock,
  Sparkles,
  Home,
  Grid,
  Truck,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { productAPI } from '../services/api';
import { IProduct } from '../types';
import { MauryaLogo } from './MauryaLogo';

interface NavbarProps {
  currentView: string;
  navigate: (view: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, navigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { settings } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close dropdowns on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Search auto-suggest debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productAPI.getProducts({ search: searchQuery, limit: 5 });
        if (res.data.success) {
          setSearchResults(res.data.products);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      setMobileMenuOpen(false);
      navigate('shop', { search: searchQuery.trim() });
    }
  };

  const renderSearchResultsDropdown = () => {
    if (!showSearchDropdown) return null;

    return (
      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 divide-y divide-stone-100 max-h-[70vh] overflow-y-auto">
        {isSearching ? (
          <div className="p-4 text-center text-xs text-stone-500">Searching products...</div>
        ) : searchResults.length > 0 ? (
          <div>
            <div className="px-4 py-2 bg-stone-50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Quick Matches
            </div>
            {searchResults.map(prod => (
              <div
                key={prod._id}
                onClick={() => {
                  setShowSearchDropdown(false);
                  setSearchQuery('');
                  setMobileMenuOpen(false);
                  navigate('product-detail', { slug: prod.slug });
                }}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50/70 cursor-pointer transition-colors"
              >
                <img
                  src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-cover rounded-lg bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-stone-900 truncate">{prod.name}</div>
                  {prod.hindiName && (
                    <div className="text-[11px] text-emerald-700 font-hindi truncate">{prod.hindiName}</div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-emerald-800">
                    ₹{prod.discountPrice || prod.price}
                  </span>
                  <span className="text-[10px] text-stone-500">/{prod.unit}</span>
                </div>
              </div>
            ))}
            <div
              onClick={handleSearchSubmit}
              className="p-2.5 text-center text-xs font-semibold text-emerald-700 hover:bg-stone-50 cursor-pointer bg-stone-50/50 border-t border-stone-100"
            >
              View all results for "{searchQuery}" →
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-stone-500">
            No products found matching "{searchQuery}"
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        {/* Top Announcement Bar */}
        <div className="bg-emerald-800 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 font-medium overflow-hidden w-full">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
              <span className="bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Gorakhpur
              </span>
              <span className="truncate text-[11px] sm:text-xs">
                {settings.announcementText || '1 KM के अंदर ₹299+ पर Free Home Delivery! ताज़ी सब्ज़ियाँ एवं किराना'}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 shrink-0 text-emerald-100 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                {settings.openingTime} - {settings.closingTime}
              </span>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1 hover:text-white font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                {settings.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 w-full">
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            {/* Logo & Branding */}
            <div
              id="brand-logo"
              onClick={() => navigate('home')}
              className="cursor-pointer group min-w-0 shrink"
            >
              <MauryaLogo size="md" variant="horizontal" />
            </div>

            {/* Desktop Search Bar */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-lg lg:max-w-xl relative mx-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  id="header-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search fresh vegetables, atta, dal, rice, spices... (सब्जी, दाल खोजें)"
                  className="w-full pl-10 pr-24 py-2 bg-stone-100/90 hover:bg-stone-100 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-full border border-stone-200 focus:border-emerald-600 focus:outline-hidden transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  id="search-btn"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-full transition-colors shadow-xs cursor-pointer"
                >
                  Search
                </button>
              </form>
              {renderSearchResultsDropdown()}
            </div>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-stone-700">
                <button
                  id="nav-home-btn"
                  onClick={() => navigate('home')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'home' ? 'text-emerald-800 bg-emerald-50 font-bold' : 'hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                >
                  Home
                </button>
                <button
                  id="nav-shop-btn"
                  onClick={() => navigate('shop')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'shop' ? 'text-emerald-800 bg-emerald-50 font-bold' : 'hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                >
                  Shop (दुकान)
                </button>
                <button
                  id="nav-categories-btn"
                  onClick={() => navigate('categories')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'categories' ? 'text-emerald-800 bg-emerald-50 font-bold' : 'hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                >
                  Categories
                </button>
                <button
                  id="nav-about-btn"
                  onClick={() => navigate('about')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'about' ? 'text-emerald-800 bg-emerald-50 font-bold' : 'hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                >
                  About Us
                </button>
              </nav>

              {/* Call Store quick button (visible on md+) */}
              <a
                href={`tel:${settings.phone}`}
                className="hidden md:flex p-2 sm:px-2.5 sm:py-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors items-center gap-1 shrink-0"
                title={`Call Maurya Grocery (${settings.phone})`}
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span className="hidden xl:inline text-xs font-semibold">{settings.phone}</span>
              </a>

              {/* Cart Button */}
              <button
                id="cart-btn"
                onClick={() => navigate('cart')}
                className="relative p-2 sm:px-3 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl flex items-center gap-1.5 transition-all group border border-emerald-200/80 shadow-2xs shrink-0 cursor-pointer"
                title="View Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span
                      id="cart-badge-count"
                      className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
                    >
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-emerald-950">Cart</span>
              </button>

              {/* User Account / Login Button (hidden on mobile xs, visible on sm+) */}
              <div ref={userMenuRef} className="hidden sm:block relative shrink-0">
                {user ? (
                  <div>
                    <button
                      id="user-menu-btn"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 transition-colors shadow-2xs cursor-pointer"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] sm:text-xs font-bold uppercase shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="hidden md:block text-xs font-semibold max-w-[80px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full mt-1">
                              <ShieldCheck className="w-3 h-3 text-amber-700" /> Admin
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <button
                            id="menu-admin-dashboard-btn"
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate('admin-dashboard');
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-amber-800 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Admin Dashboard
                          </button>
                        )}

                        <button
                          id="menu-profile-btn"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('profile');
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-stone-400" />
                          My Profile & Addresses
                        </button>

                        <button
                          id="menu-orders-btn"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('my-orders');
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                        >
                          <PackageCheck className="w-4 h-4 text-stone-400" />
                          My Orders (मेरे ऑर्डर)
                        </button>

                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <button
                            id="menu-logout-btn"
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    id="login-header-btn"
                    onClick={() => navigate('login')}
                    className="p-2 sm:px-3 sm:py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Login or Register"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                )}
              </div>

              {/* Mobile Hamburger Toggle - Always visible on mobile screens */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-xl border transition-all cursor-pointer shrink-0 ${
                  mobileMenuOpen
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200/80 shadow-2xs'
                }`}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                title="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-emerald-900" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div ref={mobileSearchRef} className="md:hidden mt-2 relative w-full">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search fresh vegetables, atta, dal, spices..."
                className="w-full pl-9 pr-20 py-2 bg-stone-100 text-stone-900 placeholder:text-stone-400 text-xs rounded-xl border border-stone-200 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Search
              </button>
            </form>
            {renderSearchResultsDropdown()}
          </div>
        </div>
      </header>

      {/* Full Mobile Navigation Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            id="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Slide-in Drawer Container */}
          <div
            id="mobile-drawer-panel"
            className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-50 animate-in slide-in-from-left duration-300"
          >
            {/* Top Drawer Header */}
            <div className="p-3.5 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-950">
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('home');
                }}
                className="flex items-center gap-2 cursor-pointer min-w-0 bg-white px-2.5 py-1.5 rounded-2xl shadow-xs"
              >
                <MauryaLogo size="xs" variant="horizontal" showTagline={false} />
              </div>

              {/* Close Button */}
              <button
                id="close-mobile-menu-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-stone-100">
              {/* User Account / Login State */}
              <div>
                {user ? (
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold truncate">+91 {user.phone}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                ) : (
                  <button
                    id="mobile-drawer-login-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('login');
                    }}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Login / Register (लॉग इन / रजिस्टर)</span>
                  </button>
                )}
              </div>

              {/* Free Delivery Announcement in Drawer */}
              <div className="pt-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-center gap-2 text-emerald-900 text-xs">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">
                    {settings.announcementText || '1 KM के अंदर ₹299+ पर Free Delivery!'}
                  </span>
                </div>
              </div>

              {/* Primary Navigation Links */}
              <div className="pt-3 space-y-1">
                <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Navigation
                </div>

                <button
                  id="mobile-drawer-home-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('home');
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                    currentView === 'home'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-emerald-700" />
                    <span>Home (मुख्य पृष्ठ)</span>
                  </span>
                </button>

                <button
                  id="mobile-drawer-shop-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('shop');
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                    currentView === 'shop'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <span>Shop All Products (दुकान)</span>
                  </span>
                </button>

                <button
                  id="mobile-drawer-categories-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('categories');
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                    currentView === 'categories'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Grid className="w-4 h-4 text-emerald-700" />
                    <span>Categories (श्रेणियाँ)</span>
                  </span>
                </button>

                <button
                  id="mobile-drawer-cart-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('cart');
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                    currentView === 'cart'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <span>Shopping Cart (कार्ट)</span>
                  </span>
                  {totalItems > 0 && (
                    <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {totalItems} items
                    </span>
                  )}
                </button>

                <button
                  id="mobile-drawer-orders-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('my-orders');
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                    currentView === 'my-orders' || currentView === 'order-detail'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>My Orders & Tracking (मेरे ऑर्डर)</span>
                  </span>
                </button>
              </div>

              {/* Account & Settings */}
              <div className="pt-3 space-y-1">
                <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Account & Settings
                </div>

                {user && (
                  <button
                    id="mobile-drawer-profile-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('profile');
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                      currentView === 'profile'
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <UserIcon className="w-4 h-4 text-emerald-700" />
                      <span>My Profile & Addresses</span>
                    </span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    id="mobile-drawer-admin-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('admin-dashboard');
                    }}
                    className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 flex items-center justify-between min-h-[44px] cursor-pointer transition-colors border border-amber-200/60"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Admin Dashboard (स्टोर प्रबंधन)</span>
                    </span>
                  </button>
                )}

                <button
                  id="mobile-drawer-about-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('about');
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                    currentView === 'about'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-emerald-700" />
                    <span>About Us (हमारे बारे में)</span>
                  </span>
                </button>

                <button
                  id="mobile-drawer-contact-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('contact');
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-colors ${
                    currentView === 'contact'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>Contact Us & Store Location</span>
                  </span>
                </button>
              </div>

              {/* Store Details Card */}
              <div className="pt-3">
                <div className="p-3 bg-stone-50 rounded-2xl text-xs space-y-1.5 text-stone-600 border border-stone-200/70">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Store className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Maurya Grocery (मौर्या किराना स्टोर)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-500">{settings.storeAddress}</p>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{settings.openingTime} - {settings.closingTime}</span>
                  </div>
                </div>
              </div>

              {/* Logout button */}
              {user && (
                <div className="pt-3">
                  <button
                    id="mobile-drawer-logout-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 min-h-[44px] cursor-pointer border border-rose-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out ({user.name})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Footer in Drawer */}
            <div className="p-3 bg-stone-100 border-t border-stone-200 grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Maurya Grocery, I want to order grocery.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

