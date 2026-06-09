import { useState, useRef } from 'react';

export function WhatsAppFloat() {
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
    }, 2000);
  };

  const isActive = isHovered || isTouched;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ direction: 'ltr' }}
    >
      {/* Tooltip above button */}
      <div 
        className="mb-2 bg-[#12141E] border border-white/10 px-3.5 py-1.5 rounded-xl text-xs text-white shadow-2xl pointer-events-none transition-all duration-300 flex items-center gap-1.5 font-display"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
        }}
      >
        <span>نرد خلال دقائق ⚡</span>
      </div>

      {/* Pulsing expand button */}
      <a
        href="https://wa.me/96565118963"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-pulse bg-[#22C55E] text-white flex items-center justify-center rounded-full h-14 transition-all duration-500 overflow-hidden shadow-2xl select-none cursor-pointer"
        style={{
          width: isActive ? '180px' : '56px',
          borderRadius: '28px',
        }}
      >
        <div className="flex items-center gap-2.5 px-4 h-full">
          {/* SVG WhatsApp filled path */}
          <svg className="w-6 h-6 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979C16.58 1.9 14.105.875 11.472.875 6.035.875 1.611 5.3 1.608 10.74c-.001 1.658.435 3.277 1.262 4.704L1.841 21.6l6.305-1.655l-1.499.907zM17.47 15.65c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83 1.04-1.015 1.25-.185.22-.37.24-.69.08-1.127-.565-1.928-.975-2.695-2.29-.18-.313.18-.29.513-.956.115-.228.058-.426-.03-.586-.086-.16-.723-1.74-.99-2.384-.26-.63-.526-.54-.723-.55-.185-.01-.4-.01-.613-.01-.213 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64 0 1.56 1.135 3.07 1.295 3.29.16.22 2.23 3.4 5.405 4.77.755.32 1.345.512 1.805.658.76.24 1.45.206 2.0.124.613-.092 1.89-.77 2.155-1.48.265-.71.265-1.32.185-1.44-.08-.12-.294-.2-.614-.36z"/>
          </svg>
          {isActive && (
            <span className="font-bold text-sm whitespace-nowrap opacity-100 transition-opacity duration-300 font-display text-[#12141E]">
              تواصل معنا الآن
            </span>
          )}
        </div>
      </a>
    </div>
  );
}
