import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageSquare, Check, Target, BarChart, Eye } from 'lucide-react';
import { siteConfig } from '../siteConfig';

export function IndustryDetail() {
  const { id } = useParams<{ id: string }>();

  const industry = siteConfig.industries.find(ind => ind.id === id);

  if (!industry) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 space-y-4">
        <h2 className="text-xl font-bold text-white">القطاع التجاري المطلوب غير مدرج</h2>
        <p className="text-xs text-gray-400">عذراً، لم نتمكن من العثور على حلول تسويقية لهذا القطاع.</p>
        <Link to="/industries" className="text-xs text-[#0055FF] font-bold block hover:underline">← العودة إلى قائمة القطاعات</Link>
      </div>
    );
  }

  const prefilledWhatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `مرحباً ميديا لاند، نملك مشروعاً في قطاع: ${industry.title} ونريد الحصول على استشارة وخطة تسويق وحملات إعلانية مخصصة.`
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 pb-20 space-y-16">
      
      {/* Back link */}
      <div>
        <Link to="/industries" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#0055FF] transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>العودة لكافة القطاعات</span>
        </Link>
      </div>

      {/* Header and summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <div className="lg:col-span-8 space-y-6 text-right">
          <div className="inline-flex items-center gap-2 bg-[#FF3E55]/15 border border-[#FF3E55]/20 px-3 py-1.5 rounded-full text-[10px] text-[#FF3E55] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تسويق قطاعي متخصص (Niche Marketing)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {industry.h1}
          </h1>
          <p className="text-[#F0F4FF]/70 text-xs text-gray-400 leading-relaxed text-justify">
            دليل استراتيجي مخصص لكيفية استهداف السوق الكويتي وصياغة الهوية وحملات الدعاية المناسبة للتفوق في هذا المجال بذكاء تسويقي محترف.
          </p>
        </div>

        {/* Sidebar Conversion Box */}
        <div className="lg:col-span-4 bg-[#12141E] border border-[#0055FF]/10 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-xs font-bold text-white">هل تملك مشروعاً في هذا المجال؟</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed">اتصل بممثلي ميديا لاند فوراً للحصول على خطة واستراتيجية تضمن لك الصدارة.</p>
          <a
            href={prefilledWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-3 bg-[#22C55E] hover:bg-[#1eb152] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
          >
            <MessageSquare className="w-4 h-4" />
            <span>طلب دراسة جدوى تسويقية مجانية</span>
          </a>
        </div>

      </div>

      {/* Specific Industry Challenges */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-r-4 border-[#FF3E55] pr-3">أبرز عقبات وتحديات التسويق في هذا القطاع بالكويت</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {industry.challenges.map((chal, i) => (
            <div key={i} className="bg-[#12141E]/50 p-6 rounded-2xl border border-white/5 space-y-3">
              <span className="text-xs font-bold text-[#FF3E55] font-mono">تحدي 0{i + 1}</span>
              <p className="text-xs text-gray-300 leading-relaxed text-justify">{chal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Platforms */}
      <div className="bg-[#12141E] p-8 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-[#0055FF]" />
          <span>القنوات الإعلانية الأنسب والأقوى لهذا القطاع</span>
        </h3>
        <p className="text-xs text-gray-400">توزع ميزانية الإعلانات بكفاءة على المنصات الأكثر تفاعلاً وجلباً للعملاء في الكويت:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {industry.platforms.map((plat, i) => (
            <div key={i} className="bg-[#0A0A0F] border border-white/5 px-4 py-3.5 rounded-xl text-xs text-white font-bold flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF]" />
              <span>{plat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Formats */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-r-4 border-[#0055FF] pr-3">صيغ ونوعية المحتوى البصري الموصى به</h3>
        <p className="text-xs text-gray-400">طريقة عرض منتجاتك أو خدماتك لضمان إثارة الإعجاب وجلب الثقة والقرارات الشرائية:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {industry.contentTypes.map((type, i) => (
            <div key={i} className="bg-[#12141E] p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed text-justify">{type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Campaigns & Strategies */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-r-4 border-[#FF3E55] pr-3">الحملات الترويجية والاستراتيجيات الذكية المقترحة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {industry.campaigns.map((camp, i) => (
            <div key={i} className="bg-[#12141E] p-6 rounded-2xl border border-white/5 space-y-3">
              <span className="text-xs font-bold text-[#FF3E55] font-mono">حملة 0{i + 1}</span>
              <p className="text-xs text-gray-300 leading-relaxed text-justify">{camp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI & Metrics */}
      <div className="bg-[#12141E] p-8 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart className="w-5 h-5 text-[#FF3E55]" />
          <span>مقياس النجاح ومراقبة الأداء (Analytics)</span>
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed text-justify">
          {industry.measurement}
        </p>
      </div>

      {/* Recommended Services list */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-r-4 border-[#0055FF] pr-3">خدمات ميديا لاند التي ننصح بالاستثمار فيها فوراً</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {industry.recommendedServices.map((srv, i) => (
            <div key={i} className="bg-[#12141E] p-5 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white font-bold">{srv}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
