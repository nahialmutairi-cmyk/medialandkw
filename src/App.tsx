import { useEffect, useState, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, MessageSquare, Award, Monitor, ExternalLink, ChevronDown } from 'lucide-react';

// Modular Components
import { ScrollReveal, ClipWipeTitle } from './components/ScrollReveal';
import { ServicesGrid } from './components/ServicesGrid';
import { PlatformsBar } from './components/PlatformIcons';
import { WhyUs } from './components/WhyUs';
import { ContactCTA } from './components/ContactCTA';
import { WhatsAppFloat } from './components/WhatsAppFloat';

// Types for dynamic ripple
interface Ripple {
  x: number;
  y: number;
  id: number;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  // Monitor Scroll for Navbar Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CTA Click Ripple Effect
  const handleCtaClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleIdRef.current++;
    
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const navLinks = [
    { name: 'الرئيسية', sub: 'HOME', href: '#home' },
    { name: 'خدماتنا', sub: 'SERVICES', href: '#services' },
    { name: 'شركاؤنا', sub: 'CHANNELS', href: '#channels' },
    { name: 'لماذا نحن', sub: 'WHY US', href: '#why-us' },
    { name: 'تواصل معنا', sub: 'CONTACT', href: '#contact' }
  ];

  const heroWords = ["نُوصِل", "علامتك", "التجارية", "إلى", "كل", "شاشة"];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F4FF] font-sans antialiased overflow-x-hidden relative">
      
      {/* Background Floating Ambient Particles */}
      <div className="absolute inset-x-0 top-0 h-[1000px] overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-[#0055FF]/15 filter blur-[100px] animate-pulse duration-[6000ms]" />
        <div className="absolute top-[35%] right-[10%] w-96 h-96 rounded-full bg-[#FF3E55]/10 filter blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-[60%] left-[25%] w-80 h-80 rounded-full bg-[#0055FF]/10 filter blur-[110px] animate-pulse duration-[7000ms]" />
        
        {/* Subtle grid accent */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* STICKY GLASSMORPHIC NAVBAR */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'background-blur-md bg-[#0A0A0F]/80 border-b border-white/5 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2.5">
              <a href="#home" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0055FF] to-[#FF3E55] p-[1.5px] shadow-[0_4px_15px_rgba(0,85,255,0.3)] group-hover:shadow-[0_4px_20px_rgba(255,62,85,0.5)] transition-all duration-300">
                  <div className="w-full h-full bg-[#0A0A0F] rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm font-display tracking-widest pl-0.5">
                    M
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xl font-black font-display text-white tracking-wide leading-tight group-hover:text-[#0055FF] transition-colors">
                    ميديا لاند
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 tracking-wider">
                    MEDIA LAND
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Link Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-sm font-bold text-gray-300 hover:text-white transition-colors relative py-1 group flex flex-col items-center"
                >
                  <span className="font-display">{link.name}</span>
                  <span className="text-[8px] text-[#0055FF] font-mono tracking-widest font-medium mt-0.5 opacity-60">
                    {link.sub}
                  </span>
                  <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-[#FF3E55] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop Dynamic Conic CTA */}
            <div className="hidden lg:block">
              <a
                href="#contact"
                onClick={handleCtaClick}
                className="relative inline-flex items-center justify-center font-bold font-display text-xs text-white uppercase tracking-wider overflow-hidden rounded-full py-3.5 px-6 border-spin-gradient-box cursor-pointer select-none group active:scale-95 transition-transform"
              >
                <div className="absolute inset-[1.5px] bg-[#0A0A0F] rounded-full group-hover:bg-[#0055FF] transition-colors duration-300 z-10" />
                
                <span className="relative z-20 flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-[-2px] text-white">
                  <span>ابدأ معنا الآن</span>
                  <span className="text-[11px] font-sans">←</span>
                </span>

                {/* Click Ripple element */}
                {ripples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className="absolute bg-white/35 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: '16px',
                      height: '16px',
                      animation: 'ripple-effect 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
                    }}
                  />
                ))}
              </a>
            </div>

            {/* Mobile Hamburger toggle button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE SLIDE OVERLAY MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-[#0D0F17]/95 border-b border-white/5 overflow-hidden backdrop-blur-lg absolute top-full inset-x-0 shadow-2xl"
            >
              <div className="px-5 pt-3 pb-6 space-y-3 flex flex-col">
                {navLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-4 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all flex justify-between items-center"
                  >
                    <span className="font-display">{link.name}</span>
                    <span className="text-[10px] text-[#0055FF] font-mono tracking-widest uppercase">{link.sub}</span>
                  </a>
                ))}
                
                <a
                  href="#contact"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-3.5 bg-gradient-to-r from-[#0055FF] to-[#FF3E55] text-white font-bold font-display rounded-xl shadow-lg shadow-blue-500/10 text-xs tracking-wider"
                >
                  ابدأ معنا الآن
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <header id="home" className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Top Country Label */}
          <ScrollReveal delay={100} className="inline-flex items-center gap-2 bg-[#12141E] border border-white/5 py-1.5 px-4 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[11px] font-sans text-gray-400 uppercase tracking-widest font-bold">
              مكتب الكويت الرئيسي 🇰🇼 KUWAIT DIGITAL HEADQUARTERS
            </span>
          </ScrollReveal>

          {/* Sequential word-by-word fade-in title */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display leading-[1.15] tracking-tight text-white flex flex-wrap gap-x-4 gap-y-1 justify-center">
              {heroWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                  className={`relative inline-block ${
                    i === 1 || i === 2 
                      ? 'text-[#FF3E55] drop-shadow-[0_0_20px_rgba(255,62,85,0.15)]' 
                      : i === 5 
                        ? 'text-[#0055FF] drop-shadow-[0_0_20px_rgba(0,85,255,0.3)] font-black' 
                        : ''
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-gray-300/80 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto"
          >
            الوكالة الإعلانية والتكنولوجية الأقوى بالكويت. نسخر أحدث تقنيات البرمجة المخصصة والسيناريوهات الإعلانية المبتكرة لنصنع لعلامتك التجارية حضوراً تفاعلياً مبهراً يرفع الأرباح والمبيعات.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="bg-gradient-to-r from-[#0055FF] to-[#FF3E55] hover:opacity-95 active:scale-[0.98] text-white font-bold font-display px-8 py-4 rounded-xl shadow-xl shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>ابدأ حملتك التسويقية مجاناً</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>

            <a
              href="#services"
              className="bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/5 text-gray-300 font-bold font-display px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>استعرض خدماتنا الثمانية</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>

        </div>

        {/* Arrow Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-65">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </header>

      {/* SERVICES GRID SECTION */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 scroll-mt-16">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase text-[#FF3E55] tracking-widest block">Our Core Capabilities</span>
          <ClipWipeTitle className="text-3xl sm:text-5xl font-black font-display text-white">
            خدمات تسويق وبرمجة <span className="text-[#0055FF]">بأثر رقمي مضاعف</span>
          </ClipWipeTitle>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            نجمع قوة الأكواد الفنية بالتخطيط والابتكار الإبداعي لنغطي كافة متطلبات مشروعك الرقمية.
          </p>
        </div>

        <ServicesGrid />
      </section>

      {/* PLATFORMS INTEGRATED MARQUEE BAR */}
      <section id="channels" className="scroll-mt-16">
        <PlatformsBar />
      </section>

      {/* WHY US SECTION */}
      <section id="why-us" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 scroll-mt-16">
        <div className="text-center space-y-4 mb-20">
          <span className="text-xs font-mono uppercase text-[#0055FF] tracking-widest block">Kuwait Local Authority</span>
          <ClipWipeTitle className="text-3xl sm:text-5xl font-black font-display text-white">
            منظومة عمل إعلامية <span className="text-[#FF3E55]">تتفوق بالتفاصيل</span>
          </ClipWipeTitle>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            أرقام حقيقية مدعومة بالبراهين وخبرة إعلامية تناسب طبائع المستهلك الكويتي.
          </p>
        </div>

        <WhyUs />
      </section>

      {/* CTA SECTION & FORM */}
      <section className="py-24 bg-[#0D0F17]/40 border-y border-white/5 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactCTA />
        </div>
      </section>

      {/* PERSISTENT WHATSAPP FLOAT */}
      <WhatsAppFloat />

      {/* FOOTER */}
      <footer className="bg-[#05060A] border-t border-white/5 py-12 text-center text-sm text-gray-500 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 text-right">
            
            {/* Logo/Title block */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0055FF] to-[#FF3E55] p-[1px]">
                <div className="w-full h-full bg-[#05060A] rounded-[7px] flex items-center justify-center text-white font-extrabold text-xs">
                  M
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold font-display text-white leading-tight">
                  ميديا لاند الكويت
                </span>
                <span className="text-[9px] font-mono text-gray-500 tracking-wider">
                  MEDIA LAND AGENCY
                </span>
              </div>
            </div>

            {/* Quick footer helper links */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center text-xs">
              <a href="#home" className="hover:text-white transition-colors">الرئيسية</a>
              <a href="#services" className="hover:text-white transition-colors">خدماتنا الثمانية</a>
              <a href="#why-us" className="hover:text-white transition-colors">لماذا نحن</a>
              <a href="#contact" className="hover:text-white transition-colors">تواصل استشاري</a>
            </div>

          </div>

          {/* Copyright and Credits */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-4">
            <p>
              © {new Date().getFullYear()} وكالة ميديا لاند الإعلامية (ميديا لاند). جميع الحقوق محفوظة لدولة الكويت 🇰🇼.
            </p>
            <p dir="ltr" className="font-mono tracking-wide text-[11px]">
              DEVELOPED IN HIGH FIDELITY • COGNITIVE WORKSPACE
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
