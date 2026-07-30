import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, ArrowUpRight, Phone, Instagram, Send, Globe, ChevronRight } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { getSeoForPathname, generateJsonLd } from '../seoData';
import { normalizeInternalHref } from '../url';

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top and dynamically update SEO metadata on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileMenuOpen(false);

    try {
      const seo = getSeoForPathname(pathname);
      
      // Update Title
      document.title = seo.title;

      // Update Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seo.description);

      // Update Canonical Link
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', seo.canonical);

      // Update Open Graph Title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', seo.title);

      // Update Open Graph Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', seo.description);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', seo.canonical);

      let twitterUrl = document.querySelector('meta[name="twitter:url"]');
      if (!twitterUrl) {
        twitterUrl = document.createElement('meta');
        twitterUrl.setAttribute('name', 'twitter:url');
        document.head.appendChild(twitterUrl);
      }
      twitterUrl.setAttribute('content', seo.canonical);

      // Inject / Update JSON-LD Script tag
      let jsonLdScript = document.getElementById('json-ld-seo-schema');
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.setAttribute('id', 'json-ld-seo-schema');
        jsonLdScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(generateJsonLd(seo));

      // Update Robots meta (noindex for request-quote and /u/* routes)
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (pathname === '/request-quote' || pathname.startsWith('/u/')) {
        if (!robotsMeta) {
          robotsMeta = document.createElement('meta');
          robotsMeta.setAttribute('name', 'robots');
          document.head.appendChild(robotsMeta);
        }
        robotsMeta.setAttribute('content', 'noindex,follow');
      } else {
        if (robotsMeta) {
          robotsMeta.remove();
        }
      }

    } catch (err) {
      console.error('Error updating SEO on navigation:', err);
    }
  }, [pathname]);

  // React Router route data stays slashless; keep rendered internal anchors aligned with Netlify's final URLs.
  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
      const normalizedHref = normalizeInternalHref(anchor.getAttribute('href') ?? '');
      if (normalizedHref !== anchor.getAttribute('href')) anchor.setAttribute('href', normalizedHref);
    });
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'خدماتنا', href: '/services' },
    { name: 'القطاعات', href: '/industries' },
    { name: 'أعمالنا', href: '/portfolio' },
    { name: 'المناطق', href: '/locations' },
    { name: 'من نحن', href: '/about' },
    { name: 'المدونة', href: '/blog' },
    { name: 'تواصل معنا', href: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F4FF] font-sans antialiased overflow-x-hidden relative flex flex-col justify-between" dir="rtl">
      
      {/* Background Ambient Glowing Orbs - Elegant Dark Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#0055FF] opacity-10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-100px] w-[400px] h-[400px] bg-[#FF3E55] opacity-10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] bg-[#0055FF] opacity-5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* HEADER NAVBAR */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#12141E]/90 border-b border-[#0055FF]/10 backdrop-blur-md py-3 shadow-lg shadow-[#0055FF]/5' 
            : 'bg-[#12141E]/50 border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#0055FF] to-[#FF3E55] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#0055FF]/25 group-hover:scale-105 transition-all">
                  <span className="text-white text-lg font-black tracking-widest pl-0.5">M</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-lg font-bold leading-none tracking-tight text-white group-hover:text-[#0055FF] transition-colors">
                    {siteConfig.brandNameAr}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#0055FF] font-semibold mt-1">
                    {siteConfig.brandNameEn}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all py-1.5 border-b-2 hover:text-[#0055FF] ${
                      isActive 
                        ? 'text-white border-[#FF3E55] font-bold' 
                        : 'text-[#F0F4FF]/70 border-transparent hover:border-[#0055FF]/30'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Action CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/request-quote"
                className="px-5 py-2.5 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-full text-xs font-bold shadow-lg shadow-[#0055FF]/20 flex items-center gap-2 hover:scale-102 active:scale-98 transition-all"
              >
                <span>طلب عرض سعر</span>
                <span className="text-xs opacity-75">←</span>
              </Link>
              
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
            </div>

            {/* Mobile Hamburger toggle button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE OVERLAY MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#12141E]/95 border-b border-[#0055FF]/10 backdrop-blur-lg absolute top-full inset-x-0 shadow-2xl z-50">
            <div className="px-6 pt-3 pb-8 space-y-3 flex flex-col text-right">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-3 px-4 text-sm font-medium rounded-xl transition-all flex justify-between items-center ${
                      isActive 
                        ? 'text-white bg-[#0055FF]/10 font-bold border-r-4 border-[#FF3E55]' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-55 scale-x-[-1]" />
                </NavLink>
              ))}
              
              <div className="pt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/request-quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3.5 bg-[#0055FF] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#0055FF]/10"
                >
                  عرض سعر
                </Link>
                
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center py-3.5 bg-[#22C55E] text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 z-10 pt-28">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#12141E] border-t border-[#0055FF]/10 py-16 text-right relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/5 pb-12 mb-10">
            
            {/* Agency info */}
            <div className="md:col-span-1.5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0055FF] to-[#FF3E55] flex items-center justify-center font-bold text-white">
                  M
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white leading-none">{siteConfig.fullNameAr}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#0055FF] font-semibold mt-1">{siteConfig.fullNameEn}</span>
                </div>
              </div>
              <p className="text-xs text-[#F0F4FF]/60 leading-relaxed">
                نبني هويتك الرقمية ونقود حملاتك الإعلانية بأحدث التقنيات لنضمن لك الانتشار والنجاح في السوق الكويتي والخليجي.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#F0F4FF]/70">
                <Phone className="w-4 h-4 text-[#FF3E55]" />
                <span dir="ltr">{siteConfig.phone}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-[#0055FF] pr-2">روابط سريعة</h4>
              <ul className="space-y-2.5 text-xs text-[#F0F4FF]/70">
                <li><Link to="/" className="hover:text-[#0055FF] transition-colors">الرئيسية</Link></li>
                <li><Link to="/about" className="hover:text-[#0055FF] transition-colors">من نحن</Link></li>
                <li><Link to="/services" className="hover:text-[#0055FF] transition-colors">خدماتنا الإعلانية</Link></li>
                <li><Link to="/portfolio" className="hover:text-[#0055FF] transition-colors">معرض أعمالنا</Link></li>
                <li><Link to="/blog" className="hover:text-[#0055FF] transition-colors">المدونة التسويقية</Link></li>
              </ul>
            </div>

            {/* Local Areas */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-[#0055FF] pr-2">محافظات الخدمة</h4>
              <ul className="space-y-2.5 text-xs text-[#F0F4FF]/70">
                <li><Link to="/locations/kuwait-city" className="hover:text-[#0055FF] transition-colors">العاصمة</Link></li>
                <li><Link to="/locations/hawalli" className="hover:text-[#0055FF] transition-colors">حولي</Link></li>
                <li><Link to="/locations/farwaniya" className="hover:text-[#0055FF] transition-colors">الفروانية</Link></li>
                <li><Link to="/locations/ahmadi" className="hover:text-[#0055FF] transition-colors">الأحمدي</Link></li>
                <li><Link to="/locations/jahra" className="hover:text-[#0055FF] transition-colors">الجهراء</Link></li>
              </ul>
            </div>

            {/* Legal / Social */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-[#0055FF] pr-2">حساباتنا وسياساتنا</h4>
              <ul className="space-y-2.5 text-xs text-[#F0F4FF]/70 mb-4">
                <li><Link to="/privacy-policy/" className="hover:text-[#0055FF] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service/" className="hover:text-[#0055FF] transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy/" className="hover:text-[#0055FF] transition-colors">Cookie Policy</Link></li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#FF3E55]/20 flex items-center justify-center text-white transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#22C55E]/20 flex items-center justify-center text-white transition-all">
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p>
              © {new Date().getFullYear()} {siteConfig.fullNameAr}. جميع الحقوق محفوظة لدولة الكويت 🇰🇼.
            </p>
            <p dir="ltr" className="font-mono tracking-wide text-[10px] text-gray-600">
              DESIGNED IN HIGH FIDELITY • LOCAL SEO POWERED
            </p>
          </div>

        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#22C55E] hover:bg-[#1eb152] rounded-full flex items-center justify-center shadow-xl border-4 border-[#0A0A0F] active:scale-95 transition-all group"
        >
          <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.891-11.893 11.891-2.01-.001-3.986-.51-5.746-1.479l-6.351 1.688zm6.536-3.818l.403.239c1.452.862 3.084 1.317 4.757 1.318 5.485 0 9.948-4.463 9.948-9.948 0-2.658-1.034-5.157-2.912-7.036-1.878-1.878-4.377-2.912-7.035-2.912-5.483 0-9.947 4.463-9.947 9.948 0 1.837.507 3.633 1.467 5.195l.261.425-1.074 3.921 4.132-1.05z" />
          </svg>
          <span className="absolute right-full mr-3 whitespace-nowrap bg-[#12141E] border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            تواصل معنا الآن ⚡
          </span>
        </a>
      </div>

    </div>
  );
}
