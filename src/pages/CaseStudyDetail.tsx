import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronLeft, Lightbulb, MessageSquare, Target } from 'lucide-react';
import { findCaseStudy } from '../caseStudyData';
import { siteConfig } from '../siteConfig';

export function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const study = findCaseStudy(id);

  if (!study) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">دراسة الحالة غير موجودة</h2>
        <p className="text-xs text-gray-400">لم نعثر على السيناريو المطلوب ضمن دراسات الحالة الحالية.</p>
        <Link to="/case-studies" className="text-xs text-[#0055FF] font-bold hover:underline">العودة إلى دراسات الحالة</Link>
      </div>
    );
  }

  const services = study.serviceIds
    .map((serviceId) => siteConfig.services.find((item) => item.id === serviceId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const industries = study.industryIds
    .map((industryId) => siteConfig.industries.find((item) => item.id === industryId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const articles = study.articleIds
    .map((articleId) => siteConfig.blog.find((item) => item.id === articleId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const location = siteConfig.locations.find((item) => item.id === study.locationId);
  const whatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `مرحباً ميديا لاند، اطلعت على السيناريو التوضيحي: ${study.title} وأود مناقشة احتياج مشروعي.`
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 pb-20 space-y-14">
      <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
        <Link to="/" className="hover:text-white">الرئيسية</Link>
        <ChevronLeft className="w-3 h-3" />
        <Link to="/case-studies" className="hover:text-white">دراسات الحالة</Link>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-[#F0F4FF]">{study.sectorLabel}</span>
      </nav>

      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-[#FF7485] bg-[#FF3E55]/10 border border-[#FF3E55]/20 px-3 py-1.5 rounded-full">{study.sectorLabel}</span>
            <span className="text-[10px] font-bold text-[#6E9BFF] bg-[#0055FF]/10 border border-[#0055FF]/20 px-3 py-1.5 rounded-full">سيناريو توضيحي</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{study.h1}</h1>
          <p className="text-sm text-[#F0F4FF]/75 leading-8 text-justify">{study.introduction}</p>
          <p className="text-xs text-[#FFB5BE] bg-[#FF3E55]/10 border border-[#FF3E55]/15 rounded-xl p-4 leading-6">{study.scenarioLabel}. المحتوى لا يدّعي تنفيذ مشروع حقيقي أو تحقيق نتائج موثقة.</p>
        </div>
        <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/5">
          <img src={study.coverImage} alt={study.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
      </header>

      <section className="bg-[#12141E] border border-white/5 rounded-2xl p-7 sm:p-9 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Target className="w-5 h-5 text-[#FF3E55]" /> وصف التحدي</h2>
        <p className="text-sm text-gray-300 leading-8 text-justify">{study.challenge}</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white border-r-4 border-[#0055FF] pr-3">منهجية العمل</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {study.methodology.map((step, index) => (
            <div key={step} className="bg-[#12141E]/70 border border-white/5 rounded-2xl p-6 space-y-4">
              <span className="w-8 h-8 rounded-full bg-[#0055FF]/15 text-[#6E9BFF] flex items-center justify-center text-xs font-bold">{index + 1}</span>
              <p className="text-xs text-gray-300 leading-7">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">الخدمات المستخدمة في السيناريو</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {services.map((service) => (
            <Link key={service.id} to={`/services/${service.id}`} className="bg-[#12141E] border border-white/5 hover:border-[#0055FF]/40 rounded-xl p-5 flex items-center justify-between gap-3 transition-colors">
              <span className="text-xs font-bold text-white">{service.title}</span>
              <ArrowLeft className="w-4 h-4 text-[#0055FF]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-white border-r-4 border-[#22C55E] pr-3">نتائج متوقعة بصياغة عامة</h2>
          <div className="space-y-3">
            {study.expectedResults.map((item) => (
              <div key={item} className="bg-[#12141E] border border-white/5 rounded-xl p-4 flex items-start gap-3">
                <Check className="w-4 h-4 text-[#22C55E] mt-1 shrink-0" />
                <p className="text-xs text-gray-300 leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-white border-r-4 border-[#FF3E55] pr-3">الدروس المستفادة</h2>
          <div className="space-y-3">
            {study.lessons.map((item) => (
              <div key={item} className="bg-[#12141E] border border-white/5 rounded-xl p-4 flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-[#FF7485] mt-1 shrink-0" />
                <p className="text-xs text-gray-300 leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">روابط مرتبطة بالسيناريو</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {industries.map((industry) => <Link key={industry.id} to={`/industries/${industry.id}`} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-xs font-bold text-white transition-colors">{industry.title}</Link>)}
          {articles.map((article) => <Link key={article.id} to={`/blog/${article.id}`} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-xs font-bold text-white transition-colors">{article.title}</Link>)}
          {location && <Link to={`/locations/${location.id}`} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-xs font-bold text-white transition-colors">{location.title}</Link>}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">أسئلة شائعة عن هذا المثال</h2>
        <div className="space-y-3">
          {study.faq.map((item) => (
            <details key={item.q} className="bg-[#12141E] border border-white/5 rounded-xl p-5">
              <summary className="cursor-pointer list-none text-sm font-bold text-white">{item.q}</summary>
              <p className="pt-4 text-xs text-gray-400 leading-7">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#12141E] border border-[#0055FF]/15 rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">ناقش سيناريو مناسباً لمشروعك</h2>
          <p className="text-xs text-gray-400">نراجع طبيعة النشاط والهدف والبيانات المتاحة قبل اقتراح نطاق العمل.</p>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#22C55E] hover:bg-[#1EAD52] rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-colors">
          <MessageSquare className="w-4 h-4" /> تواصل عبر واتساب
        </a>
      </section>
    </div>
  );
}
