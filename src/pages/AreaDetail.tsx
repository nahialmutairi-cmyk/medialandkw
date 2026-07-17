import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Check, ChevronLeft, MapPin, MessageSquare, Phone, Target } from 'lucide-react';
import { areaData, findArea, getAreaPath } from '../areaData';
import { siteConfig } from '../siteConfig';
import { RelatedContent } from '../components/RelatedContent';

export function AreaDetail() {
  const { governorateId, areaId } = useParams<{ governorateId: string; areaId: string }>();
  const area = findArea(governorateId, areaId);
  const governorate = siteConfig.locations.find((item) => item.id === governorateId);

  if (!area || !governorate) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">صفحة المنطقة غير متوفرة</h2>
        <p className="text-xs text-gray-400">لم نعثر على المنطقة المطلوبة ضمن صفحات التغطية الحالية.</p>
        <Link to="/locations" className="text-xs text-[#0055FF] font-bold hover:underline">العودة إلى المناطق</Link>
      </div>
    );
  }

  const services = area.recommendedServiceIds
    .map((id) => siteConfig.services.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const industries = area.recommendedIndustryIds
    .map((id) => siteConfig.industries.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const nearby = area.nearbyAreas
    .map((key) => areaData.find((item) => `${item.governorateId}/${item.slug}` === key))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const whatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `مرحباً ميديا لاند، أود مناقشة خدمات الدعاية والتسويق لمشروع في منطقة ${area.nameAr}.`
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 pb-20 space-y-14">
      <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
        <Link to="/" className="hover:text-white">الرئيسية</Link>
        <ChevronLeft className="w-3 h-3" />
        <Link to="/locations" className="hover:text-white">المناطق</Link>
        <ChevronLeft className="w-3 h-3" />
        <Link to={`/locations/${governorate.id}`} className="hover:text-white">{governorate.title}</Link>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-[#F0F4FF]">{area.nameAr}</span>
      </nav>

      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Link to={`/locations/${governorate.id}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0055FF]/15 text-[#6E9BFF] border border-[#0055FF]/20 text-[10px] font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{governorate.title}</span>
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{area.h1}</h1>
          <p className="text-sm text-[#F0F4FF]/75 leading-8 text-justify">{area.introduction}</p>
        </div>

        <aside className="lg:col-span-4 bg-[#12141E] border border-white/5 rounded-2xl p-6 space-y-5">
          <Target className="w-7 h-7 text-[#0055FF]" />
          <h2 className="text-base font-bold text-white">تواصل حول مشروعك</h2>
          <p className="text-xs text-gray-400 leading-6">شاركنا نوع النشاط والخدمات المطلوبة لنرتب معك نطاق العمل والخطوات المناسبة.</p>
          <div className="grid grid-cols-1 gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="py-3 bg-[#22C55E] hover:bg-[#1EAD52] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>واتساب</span>
            </a>
            <a href={`tel:${siteConfig.phoneRaw}`} className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              <Phone className="w-4 h-4 text-[#0055FF]" />
              <span>{siteConfig.phone}</span>
            </a>
          </div>
        </aside>
      </header>

      <section className="bg-[#12141E] border border-white/5 rounded-2xl p-7 sm:p-9 space-y-4">
        <h2 className="text-xl font-bold text-white">سياق الأعمال في {area.nameAr}</h2>
        <p className="text-sm text-gray-300 leading-8 text-justify">{area.businessContext}</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-white border-r-4 border-[#FF3E55] pr-3">أنشطة تجارية شائعة</h2>
          <div className="space-y-3">
            {area.commonBusinessTypes.map((item) => (
              <div key={item} className="bg-[#12141E]/70 border border-white/5 rounded-xl p-4 flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#FF7485] shrink-0" />
                <p className="text-xs text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-white border-r-4 border-[#0055FF] pr-3">احتياجات تسويقية مناسبة</h2>
          <div className="space-y-3">
            {area.marketingNeeds.map((item) => (
              <div key={item} className="bg-[#12141E]/70 border border-white/5 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-4 h-4 text-[#6E9BFF] shrink-0" />
                <p className="text-xs text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">خدمات مناسبة للمشاريع في المنطقة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link key={service.id} to={`/services/${service.id}`} className="bg-[#12141E] border border-white/5 hover:border-[#0055FF]/40 rounded-xl p-5 flex items-center justify-between gap-3 transition-colors">
              <span className="text-xs font-bold text-white leading-6">{service.title}</span>
              <ArrowLeft className="w-4 h-4 text-[#0055FF] shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">قطاعات مرتبطة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map((industry) => (
            <Link key={industry.id} to={`/industries/${industry.id}`} className="bg-[#12141E] border border-white/5 hover:border-[#FF3E55]/40 rounded-xl p-5 text-xs font-bold text-white leading-6 transition-colors">
              {industry.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#0A0A0F] border-y border-white/5 py-8 px-6 sm:px-8 space-y-4">
        <h2 className="text-xl font-bold text-white">طريقة تقديم الخدمة</h2>
        <p className="text-sm text-gray-300 leading-8 text-justify">{area.serviceDelivery}</p>
      </section>

      {nearby.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white">مناطق قريبة ضمن التغطية</h2>
          <div className="flex flex-wrap gap-3">
            {nearby.map((item) => (
              <Link key={getAreaPath(item)} to={getAreaPath(item)} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-white transition-colors">
                {item.nameAr}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">روابط مفيدة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {area.internalLinks.map((item) => (
            <Link key={item.path} to={item.path} className="bg-[#12141E] border border-white/5 hover:border-[#0055FF]/40 rounded-xl p-5 flex items-center justify-between gap-3 transition-colors">
              <span className="text-xs font-bold text-white">{item.title}</span>
              <ArrowLeft className="w-4 h-4 text-[#0055FF]" />
            </Link>
          ))}
        </div>
      </section>

      <RelatedContent
        currentPath={getAreaPath(area)}
        context={{
          serviceIds: area.recommendedServiceIds,
          industryIds: area.recommendedIndustryIds,
          locationIds: [governorate.id],
          keywords: [area.nameAr, governorate.title, area.introduction, area.serviceDelivery],
        }}
        excludedPaths={[
          `/locations/${governorate.id}`,
          '/locations',
          ...area.recommendedServiceIds.map((serviceId) => `/services/${serviceId}`),
          ...area.recommendedIndustryIds.map((industryId) => `/industries/${industryId}`),
          ...area.nearbyAreas.map((key) => `/locations/${key}`),
          ...area.internalLinks.map((item) => item.path),
        ]}
      />

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">أسئلة شائعة عن خدماتنا في {area.nameAr}</h2>
        <div className="space-y-3">
          {area.faq.map((item) => (
            <details key={item.q} className="bg-[#12141E] border border-white/5 rounded-xl p-5">
              <summary className="cursor-pointer list-none text-sm font-bold text-white">{item.q}</summary>
              <p className="pt-4 text-xs text-gray-400 leading-7">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">استكشف التغطية الجغرافية</h2>
          <p className="text-xs text-gray-400">راجع المحافظة أو جميع صفحات المناطق المتاحة.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={`/locations/${governorate.id}`} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white">{governorate.title}</Link>
          <Link to="/locations" className="px-5 py-2.5 bg-[#0055FF] hover:bg-[#0044CC] rounded-xl text-xs font-bold text-white">كل المناطق</Link>
        </div>
      </section>
    </div>
  );
}
