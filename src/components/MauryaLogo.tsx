import React from 'react';

interface MauryaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark' | 'horizontal';
  className?: string;
  showTagline?: boolean;
}

export const MauryaLogo: React.FC<MauryaLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  showTagline = true,
}) => {
  // Dimension mappings
  const markSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // The Emblem SVG containing the stylized MG with leaves, fresh grocery basket & produce
  const EmblemSVG = (
    <svg
      viewBox="0 0 400 320"
      className="w-full h-full drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="mgDarkGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a3d24" />
          <stop offset="100%" stopColor="#042716" />
        </linearGradient>
        <linearGradient id="mgLightGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#43a047" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
        <linearGradient id="mgLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
        <linearGradient id="tomatoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="pepperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="carrotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Sprouting Twin Green Leaves on top of M/G */}
      <g filter="url(#softGlow)">
        {/* Leaf 1 (Left upwards) */}
        <path
          d="M210 50 C210 20, 185 10, 180 5 C175 25, 188 52, 205 60 Z"
          fill="url(#mgLeafGrad)"
        />
        <path
          d="M185 18 Q 196 35 205 55"
          stroke="#a7f3d0"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Leaf 2 (Right arched) */}
        <path
          d="M205 60 C235 40, 270 50, 280 40 C265 65, 230 75, 205 60 Z"
          fill="url(#mgLeafGrad)"
        />
        <path
          d="M220 54 Q 250 50 270 43"
          stroke="#a7f3d0"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Main Stylized Letter 'M' (Dark Forest Green) */}
      <path
        d="M 95 240 L 95 100 Q 95 75 125 75 L 145 75 L 210 180 L 220 160 L 175 75 L 205 75 C 215 75 220 85 220 95 L 220 135 C 190 145 170 170 170 200 C 170 215 175 230 185 240 L 140 240 C 135 210 135 150 135 135 L 125 240 Z"
        fill="url(#mgDarkGreen)"
      />

      {/* Main Stylized Letter 'G' (Lighter Organic Green) */}
      <path
        d="M 275 80 C 235 80 200 110 200 160 C 200 210 235 240 280 240 C 310 240 335 225 345 205 L 345 170 L 265 170 L 265 195 L 315 195 C 308 212 295 220 280 220 C 248 220 226 195 226 160 C 226 125 248 100 280 100 C 298 100 312 110 320 125 L 345 108 C 330 90 305 80 275 80 Z"
        fill="url(#mgLightGreen)"
      />

      {/* PRODUCE INSIDE BASKET (Leaves, Tomato, Pepper, Bottle, Carrot, Bread) */}
      <g id="produce-group" filter="url(#softGlow)">
        {/* Green Leafy Lettuce Left */}
        <path
          d="M 125 190 C 115 175 125 155 140 160 C 145 145 165 145 170 160 C 180 150 195 160 190 175 C 195 185 185 200 170 195 Z"
          fill="#4ade80"
        />

        {/* Grocery Bottle */}
        <rect x="190" y="150" width="26" height="42" rx="4" fill="url(#bottleGrad)" />
        <rect x="196" y="142" width="14" height="8" rx="2" fill="#166534" />
        <rect x="198" y="138" width="10" height="4" rx="1" fill="#86efac" />

        {/* Glossy Red Tomato */}
        <circle cx="165" cy="188" r="18" fill="url(#tomatoGrad)" />
        <ellipse cx="160" cy="180" rx="4" ry="2" fill="#fca5a5" opacity="0.8" />
        {/* Tomato stem */}
        <path d="M 165 170 L 163 166 M 165 170 L 168 166 M 165 170 L 165 164" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />

        {/* Yellow Bell Pepper */}
        <path
          d="M 178 185 C 178 172 188 168 200 168 C 212 168 222 172 222 185 C 222 198 212 202 200 202 C 188 202 178 198 178 185 Z"
          fill="url(#pepperGrad)"
        />
        <path d="M 200 168 L 202 162" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />

        {/* Orange Carrot */}
        <path
          d="M 215 195 L 245 160 C 248 156 254 158 253 163 L 232 202 Z"
          fill="url(#carrotGrad)"
        />
        {/* Carrot green sprig */}
        <path d="M 248 158 L 255 148 M 248 158 L 260 156 M 248 158 L 252 144" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />

        {/* Fresh Loaf / Grain stick */}
        <ellipse cx="248" cy="188" rx="8" ry="16" transform="rotate(30 248 188)" fill="#d97706" opacity="0.9" />
      </g>

      {/* FRONT GROCERY BASKET (Dark Pine Green with clean vertical slots) */}
      <g filter="url(#softGlow)">
        {/* Basket Rim */}
        <rect x="130" y="195" width="140" height="12" rx="4" fill="#042716" />
        {/* Basket Tub */}
        <path
          d="M 136 207 L 148 238 C 150 242 154 244 158 244 L 242 244 C 246 244 250 242 252 238 L 264 207 Z"
          fill="#0a3d24"
        />
        {/* Vertical Basket Slits (White Rounded Bars) */}
        <rect x="156" y="213" width="6" height="20" rx="3" fill="#ffffff" />
        <rect x="170" y="213" width="6" height="20" rx="3" fill="#ffffff" />
        <rect x="184" y="213" width="6" height="20" rx="3" fill="#ffffff" />
        <rect x="198" y="213" width="6" height="20" rx="3" fill="#ffffff" />
        <rect x="212" y="213" width="6" height="20" rx="3" fill="#ffffff" />
        <rect x="226" y="213" width="6" height="20" rx="3" fill="#ffffff" />
        <rect x="238" y="213" width="6" height="20" rx="3" fill="#ffffff" />
      </g>
    </svg>
  );

  // Variant: Mark only (Icon symbol)
  if (variant === 'mark') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${markSizeMap[size]} ${className}`}>
        {EmblemSVG}
      </div>
    );
  }

  // Variant: Full badge (Stacked vertically with full typography)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Logo Mark */}
        <div className={`relative shrink-0 ${size === 'xl' ? 'w-36 h-36' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20'}`}>
          {EmblemSVG}
        </div>

        {/* Divider with shopping cart */}
        <div className="w-full max-w-[240px] flex items-center justify-center gap-2 my-1">
          <div className="flex-1 h-[2px] bg-emerald-800/80 rounded-full" />
          <svg className="w-4 h-4 text-emerald-800 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <div className="flex-1 h-[2px] bg-emerald-800/80 rounded-full" />
        </div>

        {/* MAURYA */}
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.18em] text-[#063b22] uppercase mt-0.5">
          MAURYA
        </h1>

        {/* GROCERY */}
        <div className="flex items-center justify-center gap-2 w-full max-w-[200px] mt-0.5">
          <div className="h-[1.5px] w-5 bg-emerald-700" />
          <span className="text-xs sm:text-sm font-bold tracking-[0.35em] text-[#15803d] uppercase font-sans">
            GROCERY
          </span>
          <div className="h-[1.5px] w-5 bg-emerald-700" />
        </div>

        {/* Tagline */}
        {showTagline && (
          <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] sm:text-xs font-semibold tracking-wider text-stone-600 uppercase">
            <span className="text-emerald-600 text-xs">🌿</span>
            <span>Fresh Products, Better Living</span>
            <span className="text-emerald-600 text-xs">🌿</span>
          </div>
        )}
      </div>
    );
  }

  // Variant: Horizontal (Standard for Header/Navbar)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Icon Emblem */}
      <div className={`shrink-0 ${markSizeMap[size]} transition-transform duration-200 group-hover:scale-105`}>
        {EmblemSVG}
      </div>

      {/* Typography Brand Block */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-base sm:text-xl md:text-2xl font-extrabold tracking-[0.08em] text-[#063b22] uppercase leading-none">
            MAURYA
          </span>
          <span className="text-[11px] sm:text-sm md:text-base font-bold tracking-[0.12em] text-[#15803d] uppercase leading-none font-sans">
            GROCERY
          </span>
        </div>

        {/* Subtitle / Hindi name / Tagline */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-800 font-hindi leading-tight">
            (मौर्य ग्रॉसरी)
          </span>
          {showTagline && (
            <>
              <span className="hidden lg:inline text-stone-300 text-[10px]">•</span>
              <span className="hidden lg:inline text-[10px] font-medium text-stone-500 tracking-tight truncate">
                Fresh Products, Better Living
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
