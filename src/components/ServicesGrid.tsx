import { useState, useRef, ReactNode, MouseEvent, TouchEvent } from 'react';
import { ScrollReveal } from './ScrollReveal';
import {
  Smartphone,
  Globe,
  Monitor,
  Heart,
  Megaphone,
  Search,
  Palette,
  Play
} from 'lucide-react';

interface CardProps {
  key?: any;
  title: string;
  subtitle: string;
  desc: string;
  icon: ReactNode;
  iconAnimClass: string;
  glowColor: string;
  index: number;
}

function ServiceCard({ title, subtitle, desc, icon, iconAnimClass, glowColor, index }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [pulseScale, setPulseScale] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    
    // Direct haptic-like scale bump on tap
    setPulseScale(true);
    setTimeout(() => setPulseScale(false), 200);

    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    touchTimeoutRef.current = setTimeout(() => {
      setIsTouched(false);
    }, 600); // stay active for 600ms as requested
  };

  const isActive = isHovered || isTouched;

  return (
    <ScrollReveal delay={index * 80}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`mouse-glow-card rounded-2xl p-7 border border-white/5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative select-none cursor-pointer group h-full flex flex-col justify-between ${
          isActive ? '-translate-y-3 shadow-[0_15px_35px_-5px_rgba(0,85,255,0.15)] active-touch' : ''
        } ${pulseScale ? 'scale-103' : 'scale-100'}`}
      >
        {/* Animated Gradient Border */}
        <div className="card-border-animated" />

        {/* Content Block */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            {/* Layer 1: Icon container with glow overlay */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 mb-6 transition-all duration-300"
              style={{
                background: isActive ? glowColor : '',
                boxShadow: isActive ? `0 8px 30px -4px ${glowColor}` : '',
                transform: isActive ? 'translateY(-8px) scale(1.2)' : 'translateY(0) scale(1)',
              }}
            >
              <div className={isActive ? iconAnimClass : ''}>
                {icon}
              </div>
            </div>

            {/* Title with letter spacing change */}
            <h3
              className="text-xl font-black font-display text-white transition-all duration-300"
              style={{
                letterSpacing: isActive ? '1px' : '0px',
              }}
            >
              {title}
            </h3>

            {/* Section subtitle */}
            <span className="text-xs font-mono text-[#0055FF]/90 block mt-1 tracking-wider uppercase">
              {subtitle}
            </span>

            {/* Layer 3: Description Sliding Up */}
            <p
              className="text-gray-300/80 text-sm mt-4 text-justify leading-relaxed transition-all duration-500"
              style={{
                transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                opacity: isActive ? 1 : 0.85,
              }}
            >
              {desc}
            </p>
          </div>

          <div className="mt-6">
            {/* Layer 3: Action trigger fading in */}
            <div
              className="flex items-center gap-2 text-xs font-bold transition-all duration-500"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(15px)',
              }}
            >
              <span className="text-[#FF3E55] font-display">اعرف المزيد</span>
              <span className="transition-transform duration-300 group-hover:translate-x-[-4px]">←</span>
              <div className="h-[1px] flex-grow bg-gradient-to-l from-[#FF3E55] to-transparent" />
            </div>

            {/* Custom bottom line progress only for video card */}
            {title.includes("الفيديو") && (
              <div className="video-progress-bar">
                <div className="video-progress-fill" />
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function ServicesGrid() {
  const list: Omit<CardProps, 'index'>[] = [
    {
      title: "تطبيقات الأندرويد",
      subtitle: "Android Development",
      desc: "نصمم ونطور تطبيقات هواتف متطورة على منصة أندرويد مع مراعاة أحدث معايير غوغل للأداء السلس والتوافق التام.",
      icon: <Smartphone className="w-6 h-6" />,
      iconAnimClass: "animate-icon-bounce",
      glowColor: "rgba(0, 85, 255, 0.45)"
    },
    {
      title: "تصميم المواقع",
      subtitle: "Web Design & Dev",
      desc: "واجهات وتطبيقات ويب عصرية وسريعة الاستجابة تصنع لعملائك تجربة تصفح تفاعلية ومريحة تضمن تحويلهم لزبائن دائمين.",
      icon: <Globe className="w-6 h-6" />,
      iconAnimClass: "animate-icon-spin",
      glowColor: "rgba(255, 62, 85, 0.45)"
    },
    {
      title: "برامج ويندوز",
      subtitle: "Windows Software",
      desc: "برمجيات وأنظمة متكاملة لبيئة عمل الحواسيب المكتبية تسرّع دورة إدارة البيانات وتقارير الفروع بكل سهولة.",
      icon: <Monitor className="w-6 h-6" />,
      iconAnimClass: "animate-icon-flicker",
      glowColor: "rgba(0, 85, 255, 0.45)"
    },
    {
      title: "إدارة السوشيال ميديا",
      subtitle: "Social Admin & Content",
      desc: "تولي إدارة حساباتك اليومية بالكامل وصناعة محتوى ترويجي وقصص هادفة تخلق تآلفاً وثقة مطلقة بين علامتك وجمهورك.",
      icon: <Heart className="w-6 h-6" />,
      iconAnimClass: "animate-icon-pulse",
      glowColor: "rgba(255, 62, 85, 0.45)"
    },
    {
      title: "إعلانات سبونسر",
      subtitle: "Sponsored Campaigns",
      desc: "إعلانات ممولة على أقوى منصات السوشيال (إنستغرام، تيك توك، سناب شات، وإكس) بآليات استهداف متطورة لضمان أقل تكلفة.",
      icon: <Megaphone className="w-6 h-6" />,
      iconAnimClass: "animate-icon-zoom",
      glowColor: "rgba(0, 85, 255, 0.45)"
    },
    {
      title: "إعلانات جوجل",
      subtitle: "Google Search Ads",
      desc: "نجعلك الخيار الأول لعملائك على محرك البحث مباشرة عند كتابة كلمات مفتاحية متعلقة بنشاطك التجاري في الكويت.",
      icon: <Search className="w-6 h-6" />,
      iconAnimClass: "animate-icon-scan",
      glowColor: "rgba(255, 62, 85, 0.45)"
    },
    {
      title: "تصميم الصور والإنفوغرافيك",
      subtitle: "Graphic Design",
      desc: "ابتكار هوية بصرية متميزة تشمل شعارات وتصميمات إنفوغرافيك وبوستات فاخرة تعزز من وقار وبصمة علامتك التجارية.",
      icon: <Palette className="w-6 h-6" />,
      iconAnimClass: "animate-icon-rotate",
      glowColor: "rgba(0, 85, 255, 0.45)"
    },
    {
      title: "إنتاج الفيديو والموشن جرافيك",
      subtitle: "Video & Motion",
      desc: "مقاطع فيديو سينمائية ورسوم موشن جرافيك تترجم أفكارك بأسلوب سرد قصصي ممتع ومؤثر يسرد غايات مشروعك باحترافية.",
      icon: <Play className="w-6 h-6 fill-current" />,
      iconAnimClass: "", // handled through progress animation wrapper
      glowColor: "rgba(255, 62, 85, 0.45)"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {list.map((item, idx) => (
        <ServiceCard
          key={idx}
          index={idx}
          title={item.title}
          subtitle={item.subtitle}
          desc={item.desc}
          icon={item.icon}
          iconAnimClass={item.iconAnimClass}
          glowColor={item.glowColor}
        />
      ))}
    </div>
  );
}
