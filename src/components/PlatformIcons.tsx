import { useState, useRef, ReactNode } from 'react';

interface Platform {
  key?: any;
  nameAr: string;
  nameEn: string;
  hoverBgStyle: string;
  icon: ReactNode;
  brandStyle?: string;
}

export function PlatformItem({ nameAr, nameEn, icon, hoverBgStyle }: Platform) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    touchTimeoutRef.current = setTimeout(() => {
      setIsTouched(false);
    }, 1200);
  };

  const isActive = isHovered || isTouched;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative mx-6 py-6 cursor-pointer group"
    >
      {/* Tooltip above */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#12141E] border border-white/10 px-4 py-2 rounded-xl text-xs flex flex-col items-center pointer-events-none transition-all duration-300 shadow-2xl z-30 w-max"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translate(-50%, 0) scale(1)' : 'translate(-50%, 8px) scale(0.9)',
        }}
      >
        <span className="font-bold text-white font-display text-[12px]">{nameAr}</span>
        <span className="text-[10px] text-gray-400 font-mono tracking-wider">{nameEn}</span>
        {/* Tooltip bottom pointer arrow */}
        <div className="w-2 h-2 bg-[#12141E] border-r border-b border-white/10 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-[5px]" />
      </div>

      {/* Circular Platform brand container */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center bg-[#12141E] border border-white/5 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative overflow-hidden shadow-lg"
        style={{
          background: isActive ? hoverBgStyle : '',
          transform: isActive ? 'scale(1.3) rotate(-5deg)' : 'scale(1) rotate(0deg)',
          boxShadow: isActive ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)' : '',
        }}
      >
        <div className={`transition-colors duration-300 ${isActive ? 'scale-110 text-white' : 'text-white/60 group-hover:text-white'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function PlatformsBar() {
  const platforms: Platform[] = [
    {
      nameAr: "إنستغرام",
      nameEn: "Instagram",
      hoverBgStyle: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      )
    },
    {
      nameAr: "سناب شات",
      nameEn: "Snapchat",
      hoverBgStyle: "#FFFC00",
      icon: (
        <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.015 1.5c-3.21 0-5.83 2.62-5.83 5.83 0 .285.035.54.085.805-.38.075-.765.17-1.14.28-.27.085-.415.3-.43.515-.015.215.115.42.36.495.735.225 1.445.48 2.115.82a2.385 2.385 0 01.355.225c.03.11.12.195.21.265.15.11.355.155.51.05.155-.095.185-.285.075-.435-.11-.155-.265-.285-.355-.465-.075-.155-.06-.345-.045-.515a4.34 4.34 0 014.09-3.32c2.25 0 4.09 1.84 4.09 4.09 0 .17.015.36-.045.515-.09.18-.245.31-.355.465-.11.15-.08.34.075.435.155.105.36.06.51-.05.09-.07.18-.155.21-.265a2.375 2.375 0 012.47-.41c.245-.075.375-.28.36-.495-.015-.215-.16-.43-.43-.515-.375-.11-.76-.205-1.14-.28.05-.265.085-.52.085-.805 0-3.21-2.62-5.83-5.83-5.83z"/>
          <path d="M12 22.5c4.76 0 7.82-1.92 7.82-3.83 0-1.42-1.72-2.31-3.62-3.15-.38-.17-.7-.34-.98-.53a3.56 3.56 0 01-.84-.87c-.36-.54-.64-1.2-.95-1.89l-.16-.36c-.19-.44-.45-.66-.75-.66s-.56.22-.75.66l-.16.36c-.31.69-.59 1.35-.95 1.89-.25.37-.53.67-.84.87-.28.19-.6.36-.98.53-1.9.84-3.62 1.73-3.62 3.15 0 1.91 3.06 3.83 7.82 3.83z"/>
        </svg>
      )
    },
    {
      nameAr: "تيك توك",
      nameEn: "TikTok",
      hoverBgStyle: "#010101",
      icon: (
        <svg className="w-7 h-7 drop-shadow-[2px_0_0_#69C9D0] filter select-none hover:drop-shadow-[-2px_0_0_#EE1D52]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31 0 2.536.31 3.633.864a7.973 7.973 0 01.373-1.416c-.73-.55-1.576-.867-2.483-.867h-.893v8.525c0 1.96-1.597 3.558-3.559 3.558a3.56 3.56 0 01-3.558-3.558c0-1.96 1.596-3.559 3.558-3.559.395 0 .768.067 1.116.186v-3.79c-.356-.046-.721-.073-1.092-.073C5.744 1.348.625 6.467.625 12.748c0 6.28 5.119 11.4 11.4 11.4s11.4-5.12 11.4-11.4v-4.22a7.962 7.962 0 01-4-.012V3.53a3.868 3.868 0 003.5 3.84v-3.77a7.618 7.618 0 01-4-3.56v-.02h-3.4v.02z"/>
        </svg>
      )
    },
    {
      nameAr: "إكس (تويتر)",
      nameEn: "Twitter/X",
      hoverBgStyle: "#000000",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      nameAr: "جوجل",
      nameEn: "Google",
      hoverBgStyle: "#FFFFFF",
      icon: (
        <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.111 4.113A5.88 5.88 0 1114 6.8c1.558 0 2.977.575 4.07 1.638l3.125-3.125A10.2 10.2 0 1012.24 24c5.748 0 10.219-4.211 10.219-10.37 0-.698-.084-1.378-.211-1.921H12.24z"/>
        </svg>
      )
    },
    {
      nameAr: "يوتيوب",
      nameEn: "YouTube",
      hoverBgStyle: "#FF0000",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  // Repeat icons to make continuous loop
  const repeatedPlatforms = [...platforms, ...platforms, ...platforms];

  return (
    <div className="w-full bg-[#0E0F17] py-8 border-y border-white/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#0A0A0F] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#0A0A0F] to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 mb-4 flex justify-between items-center relative z-20">
        <span className="text-xs uppercase font-mono text-[#FF3E55] tracking-widest block">Platforms Integrations</span>
        <span className="text-sm font-bold font-display text-gray-400">نطلق حملاتك عبر أهم القنوات الرقمية</span>
      </div>

      <div className="relative flex items-center overflow-x-hidden w-full">
        <div className="marquee-track flex">
          {repeatedPlatforms.map((p, idx) => (
            <PlatformItem
              key={idx}
              nameAr={p.nameAr}
              nameEn={p.nameEn}
              hoverBgStyle={p.hoverBgStyle}
              icon={p.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
