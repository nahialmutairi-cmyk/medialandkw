import { useParams, Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Check, Sparkles, Clock, Calendar, PhoneCall } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { getServiceIndustryPath, serviceIndustryPages } from '../serviceIndustryData';
import { RelatedContent } from '../components/RelatedContent';

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();

  const service = siteConfig.services.find(s => s.id === id);

  if (!service) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 space-y-4">
        <h2 className="text-xl font-bold text-white">الخدمة المطلوبة غير متوفرة</h2>
        <p className="text-xs text-gray-400">عذراً، لم نتمكن من العثور على هذه الخدمة في سجلات ميديا لاند الإعلانية.</p>
        <Link to="/services" className="text-xs text-[#0055FF] font-bold block hover:underline">← العودة إلى قائمة الخدمات</Link>
      </div>
    );
  }

  // Pre-filled WhatsApp message for user intent
  const prefilledWhatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `مرحباً ميديا لاند، أود الاستفسار وطلب تفاصيل وعرض سعر لخدمة: ${service.title}`
  )}`;
  const industryLandingPages = serviceIndustryPages.filter((page) => page.serviceId === service.id);

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 pb-20 space-y-16">
      
      {/* Back to list link */}
      <div>
        <Link to="/services" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#0055FF] transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>العودة لكافة الخدمات</span>
        </Link>
      </div>

      {/* Header and overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#0055FF]/15 border border-[#0055FF]/20 px-3 py-1.5 rounded-full text-[10px] text-[#0055FF] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خدمة مميزة معتمدة كويتياً</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {service.title}
          </h1>
          <p className="text-[#F0F4FF]/80 text-sm sm:text-base leading-relaxed text-justify">
            {service.description}
          </p>

          {/* Pricing & Duration Mini Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-[#12141E] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase">المدة الزمنية المتوقعة للتنفيذ</span>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF3E55]" />
                <span>3 - 7 أيام عمل (أو حسب حجم المتطلبات)</span>
              </p>
            </div>
            <div className="bg-[#12141E] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase">متوسط سعر الباقات التقريبي</span>
              <p className="text-sm font-bold text-[#22C55E] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>باقات مرنة (تحدد بدقة بعد الاستشارة)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Conversion Box */}
        <div className="lg:col-span-4 bg-[#12141E] border border-[#0055FF]/10 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">هل تريد طلب الخدمة الآن؟</h3>
            <p className="text-xs text-gray-400 leading-relaxed">اتصل بممثلي ميديا لاند فوراً لبدء دراسة مشروعك وتقديم العرض النهائي.</p>
          </div>

          <div className="space-y-3">
            <a
              href={prefilledWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3.5 bg-[#22C55E] hover:bg-[#1eb152] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
            >
              <MessageSquare className="w-4 h-4" />
              <span>اطلب بالواتساب فورا</span>
            </a>
            
            <Link
              to="/contact"
              className="w-full text-center py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-white/5"
            >
              <PhoneCall className="w-4 h-4 text-[#0055FF]" />
              <span>طلب اتصال هاتفي</span>
            </Link>
          </div>

          <div className="text-[10px] text-gray-500 text-center leading-relaxed">
            * الاستشارات والتحليلات الفنية الأولية مجانية لجميع الشركات الكويتية والمشاريع الناشئة.
          </div>
        </div>

      </div>

      {/* Main Features bullet list */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-r-4 border-[#FF3E55] pr-3">ماذا تشمل وتغطي الخدمة تفصيلياً؟</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.features.map((feat, i) => (
            <div key={i} className="bg-[#12141E]/60 p-4 rounded-xl border border-white/5 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{feat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step by step process of work */}
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white border-r-4 border-[#0055FF] pr-3">كيف نعمل في ميديا لاند؟ خطوات مريحة ومنظمة</h3>
          <p className="text-xs text-gray-400">نهجنا الإجرائي في تنفيذ هذه الخدمة لضمان تحقيق أعلى معايير الجودة والأداء والتسليم بالموعد:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
          {service.steps.map((step, idx) => (
            <div key={idx} className="bg-[#12141E] p-6 rounded-2xl border border-white/5 relative space-y-4">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-[#0055FF] to-[#FF3E55] font-mono">0{idx + 1}</span>
              <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Results & KPI expectations */}
      <div className="bg-[#12141E] p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white">النتائج التجارية المتوقعة والعوائد لمشروعك (KPIs)</h3>
          <p className="text-xs text-gray-400">ما الذي ستحصل عليه فعلياً عند التزامنا بهذه الخدمة وإطلاق حملاتها:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {service.benefits.map((res, i) => (
            <div key={i} className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5 space-y-2 text-center flex flex-col justify-center items-center">
              <span className="w-2 h-2 rounded-full bg-[#FF3E55] inline-block" />
              <p className="text-xs text-white font-bold">{res}</p>
            </div>
          ))}
        </div>
      </div>

      {industryLandingPages.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white border-r-4 border-[#0055FF] pr-3">حلول هذه الخدمة حسب القطاع</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industryLandingPages.map((page) => (
              <Link key={getServiceIndustryPath(page)} to={getServiceIndustryPath(page)} className="bg-[#12141E] border border-white/5 hover:border-[#0055FF]/40 rounded-xl p-5 text-xs font-bold text-white transition-colors">
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <RelatedContent
        currentPath={`/services/${service.id}`}
        context={{
          serviceIds: [service.id],
          keywords: [service.title, service.subtitle, service.description, ...service.suitableFor],
          preferredPaths: service.id === 'printing'
            ? [
                '/services/branding',
                '/services/graphic-design',
                '/industries/restaurants-marketing',
                '/industries/events-marketing',
                '/blog/choose-successful-visual-identity',
              ]
            : undefined,
        }}
        excludedPaths={industryLandingPages.map(getServiceIndustryPath)}
      />

    </div>
  );
}
