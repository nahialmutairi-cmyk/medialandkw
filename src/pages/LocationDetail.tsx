import { useParams, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, Compass, Check, Users, ShieldCheck, MessageSquare } from 'lucide-react';
import { siteConfig } from '../siteConfig';

export function LocationDetail() {
  const { id } = useParams<{ id: string }>();

  const location = siteConfig.locations.find(l => l.id === id);

  if (!location) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 space-y-4">
        <h2 className="text-xl font-bold text-white">الموقع الجغرافي المطلوب غير متاح</h2>
        <p className="text-xs text-gray-400">عذراً، لم نتمكن من العثور على خدمات في هذا الموقع الإقليمي.</p>
        <Link to="/locations" className="text-xs text-[#0055FF] font-bold block hover:underline">← العودة إلى قائمة المحافظات</Link>
      </div>
    );
  }

  // Pre-filled WhatsApp message for local inquiries
  const prefilledWhatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `مرحباً ميديا لاند، أود الاستفسار عن حملات الدعاية والتسويق المستهدفة لمناطق محافظة: ${location.title}`
  )}`;

  // Generate dynamic keywords for regional SEO
  const seoKeywords = [
    `دعاية وإعلان في ${location.title}`,
    `تسويق رقمي في ${location.title}`,
    `تصوير وإدارة حسابات في ${location.title}`,
    `شركة تسويق وإعلانات في ${location.title}`
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 pb-20 space-y-16">
      
      {/* Back to list */}
      <div>
        <Link to="/locations" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#0055FF] transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>العودة لكافة المحافظات</span>
        </Link>
      </div>

      {/* Hero header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-6 text-right">
          <div className="inline-flex items-center gap-2 bg-[#0055FF]/15 border border-[#0055FF]/20 px-3 py-1.5 rounded-full text-[10px] text-[#0055FF] font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#FF3E55]" />
            <span>تسويق محلي كويتي ذكي (Geo-Targeted)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {location.h1}
          </h1>
          <p className="text-[#F0F4FF]/80 text-sm sm:text-base leading-relaxed text-justify">
            {location.intro}
          </p>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 bg-[#12141E] border border-[#0055FF]/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white">هل تريد الاستحواذ على سوق {location.title}؟</h3>
          <p className="text-xs text-gray-400 leading-relaxed">اتصل بفريق ميديا لاند فوراً لبدء رسم خريطة إعلانية جغرافية تضمن جلب عملاء حقيقيين لمشروعك.</p>
          <a
            href={prefilledWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-3 bg-[#22C55E] hover:bg-[#1eb152] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
          >
            <MessageSquare className="w-4 h-4" />
            <span>استفسر عن حملات {location.title}</span>
          </a>
        </div>
      </div>

      {/* Areas we cover */}
      <div className="bg-[#12141E] p-8 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#FF3E55]" />
          <span>المناطق التي نغطيها بالخدمة في هذه المحافظة</span>
        </h3>
        <p className="text-xs text-gray-400">تغطي باقاتنا الميدانية والتسويقية كافة مناطق وضواحي هذه المحافظة دون استثناء:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          {location.subAreas.map((area, i) => (
            <div key={i} className="bg-[#0A0A0F] border border-white/5 px-4 py-2.5 rounded-xl text-center text-xs text-gray-300 font-bold">
              {area}
            </div>
          ))}
        </div>
      </div>

      {/* Sectors & Industries we target */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-r-4 border-[#0055FF] pr-3">أنشطة ومشاريع كبرى نخدمها في هذه المنطقة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {location.sectors.map((sec, i) => (
            <div key={i} className="bg-[#12141E]/50 p-6 rounded-2xl border border-white/5 space-y-3">
              <span className="text-xs font-bold text-[#FF3E55] font-mono">القطاع 0{i + 1}</span>
              <p className="text-xs text-gray-300 leading-relaxed text-justify">{sec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended services for this location */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-r-4 border-[#FF3E55] pr-3">الخدمات الإعلانية الأكثر مبيعاً وننصح بها لهذه المنطقة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {location.recommendedServices.map((srv, i) => (
            <div key={i} className="bg-[#12141E] p-5 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white font-bold">{srv}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Marketing Strategy */}
      <div className="bg-[#12141E] p-8 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#0055FF]" />
          <span>آلية ومقومات التنفيذ في هذه المحافظة</span>
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed text-justify">
          {location.howWeDeliver}
        </p>
      </div>

      {/* Regional SEO keywords tag cloud */}
      <div className="space-y-4">
        <span className="text-xs text-gray-500 font-bold block uppercase">كلمات مفتاحية مستهدفة للتصدر (SEO Optimization)</span>
        <div className="flex flex-wrap gap-2">
          {seoKeywords.map((tag, i) => (
            <span key={i} className="bg-white/5 border border-white/10 text-gray-400 text-[10px] px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
