import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, MessageSquare, Target } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import {
  findServiceIndustryPage,
  getServiceIndustryPath,
  serviceIndustryPages
} from '../serviceIndustryData';

export function ServiceIndustryDetail() {
  const { serviceId, industryId } = useParams<{ serviceId: string; industryId: string }>();
  const page = findServiceIndustryPage(serviceId, industryId);
  const service = siteConfig.services.find((item) => item.id === serviceId);
  const industry = siteConfig.industries.find((item) => item.id === industryId);

  if (!page || !service || !industry) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">الصفحة المطلوبة غير متوفرة</h2>
        <p className="text-xs text-gray-400">لم نعثر على تركيبة الخدمة والقطاع المطلوبة.</p>
        <Link to="/services" className="text-xs text-[#0055FF] font-bold hover:underline">العودة إلى الخدمات</Link>
      </div>
    );
  }

  const relatedServices = page.relatedServiceIds
    .map((id) => siteConfig.services.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const relatedPages = page.relatedPageKeys
    .map((key) => serviceIndustryPages.find((item) => `${item.serviceId}/${item.industryId}` === key))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const whatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `مرحباً ميديا لاند، أود مناقشة خدمة ${page.title}.`
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 pb-20 space-y-14">
      <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
        <Link to="/" className="hover:text-white">الرئيسية</Link>
        <ChevronLeft className="w-3 h-3" />
        <Link to="/services" className="hover:text-white">الخدمات</Link>
        <ChevronLeft className="w-3 h-3" />
        <Link to={`/services/${service.id}`} className="hover:text-white">{service.title}</Link>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-[#F0F4FF]">{industry.title}</span>
      </nav>

      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <Link to={`/services/${service.id}`} className="px-3 py-1.5 rounded-full bg-[#0055FF]/15 text-[#6E9BFF] border border-[#0055FF]/20">
              {service.title}
            </Link>
            <Link to={`/industries/${industry.id}`} className="px-3 py-1.5 rounded-full bg-[#FF3E55]/10 text-[#FF7485] border border-[#FF3E55]/20">
              {industry.title}
            </Link>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{page.h1}</h1>
          <p className="text-sm text-[#F0F4FF]/70 leading-8 text-justify">{page.intro}</p>
        </div>

        <aside className="lg:col-span-4 bg-[#12141E] border border-white/5 rounded-2xl p-6 space-y-5">
          <Target className="w-7 h-7 text-[#0055FF]" />
          <h2 className="text-base font-bold text-white">ناقش احتياج مشروعك</h2>
          <p className="text-xs text-gray-400 leading-6">شاركنا الخدمة والقطاع ونطاق العمل لنحدد معك الخطوات والمواد المطلوبة.</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-[#22C55E] hover:bg-[#1EAD52] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>بدء المحادثة عبر واتساب</span>
          </a>
        </aside>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white border-r-4 border-[#FF3E55] pr-3">تحديات {industry.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {page.challenges.map((challenge, index) => (
            <div key={challenge} className="bg-[#12141E]/70 border border-white/5 rounded-2xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-[#FF7485]">تحدي {index + 1}</span>
              <p className="text-xs text-gray-300 leading-7">{challenge}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#12141E] border border-white/5 rounded-2xl p-7 sm:p-9 space-y-4">
        <h2 className="text-xl font-bold text-white">كيف تخدم ميديا لاند هذا القطاع؟</h2>
        <p className="text-sm text-gray-300 leading-8 text-justify">{page.howWeHelp}</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white border-r-4 border-[#0055FF] pr-3">آلية العمل</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {page.steps.map((step, index) => (
            <div key={step} className="flex gap-4 bg-[#0A0A0F] border border-white/5 rounded-xl p-5">
              <span className="w-8 h-8 shrink-0 rounded-full bg-[#0055FF]/15 text-[#6E9BFF] flex items-center justify-center text-xs font-bold">{index + 1}</span>
              <p className="text-xs text-gray-300 leading-6">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">خدمات مرتبطة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedServices.map((item) => (
            <Link key={item.id} to={`/services/${item.id}`} className="bg-[#12141E] border border-white/5 hover:border-[#0055FF]/40 rounded-xl p-5 flex items-center justify-between gap-3 transition-colors">
              <span className="text-xs font-bold text-white">{item.title}</span>
              <ArrowLeft className="w-4 h-4 text-[#0055FF]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">صفحات ذات علاقة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedPages.map((item) => (
            <Link key={getServiceIndustryPath(item)} to={getServiceIndustryPath(item)} className="bg-[#12141E] border border-white/5 hover:border-[#FF3E55]/40 rounded-xl p-5 space-y-3 transition-colors">
              <p className="text-xs font-bold text-white leading-6">{item.title}</p>
              <span className="text-[10px] text-[#FF7485] inline-flex items-center gap-1">عرض الصفحة <ArrowLeft className="w-3 h-3" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">أسئلة شائعة عن {page.title}</h2>
        <div className="space-y-3">
          {page.faq.map((item) => (
            <details key={item.q} className="group bg-[#12141E] border border-white/5 rounded-xl p-5">
              <summary className="cursor-pointer list-none text-sm font-bold text-white flex items-center justify-between gap-4">
                <span>{item.q}</span>
                <Check className="w-4 h-4 text-[#0055FF]" />
              </summary>
              <p className="pt-4 text-xs text-gray-400 leading-7">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">استكشف المسارات الرئيسية</h2>
          <p className="text-xs text-gray-400">راجع جميع الخدمات والقطاعات المتاحة في ميديا لاند.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/services" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white inline-flex items-center gap-2">كل الخدمات <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/industries" className="px-5 py-2.5 bg-[#0055FF] hover:bg-[#0044CC] rounded-xl text-xs font-bold text-white inline-flex items-center gap-2">كل القطاعات <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </div>
  );
}
