import { Link } from 'react-router-dom';
import { Target, Users, Sparkles, ShieldCheck, ChevronRight, Briefcase } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function Industries() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#FF3E55] tracking-widest block font-bold">القطاعات والمجالات التجارية المستهدفة</span>
        <ClipWipeTitle className="text-3xl sm:text-5xl font-black text-white">
          استراتيجيات تسويقية مخصصة <span className="text-[#0055FF]">لكل قطاع</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نحن في ميديا لاند ندرك أن التسويق الفعال لا يقوم على قالب واحد. قمنا بتطوير دراسات تحليلية وسلوكية متعمقة لخدمة 10 قطاعات رئيسية داخل الكويت والخليج.
        </p>
      </div>

      {/* Grid of 10 Industries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteConfig.industries.map((ind) => (
          <div
            key={ind.id}
            className="bg-[#12141E] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#FF3E55]/30 transition-all group shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white group-hover:text-[#0055FF] transition-colors">{ind.title}</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">الجمهور والمستهلك المستهدف</span>
                <p className="text-xs text-[#F0F4FF]/80 leading-relaxed">{ind.targetAudience}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-[10px] text-[#0055FF] font-bold block">التحديات الرئيسية للقطاع:</span>
                <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                  {ind.challenges.slice(0, 2).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to={`/industries/${ind.id}`}
                className="w-full text-center py-2.5 bg-white/5 hover:bg-[#FF3E55] hover:text-white text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
              >
                <span>دراسة الاستراتيجية والمحاور</span>
                <ChevronRight className="w-3.5 h-3.5 scale-x-[-1]" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Conversion Area */}
      <div className="bg-gradient-to-tr from-[#0055FF]/10 to-[#FF3E55]/10 p-8 rounded-3xl border border-[#0055FF]/10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-right">
          <h3 className="text-lg font-bold text-white">هل تعمل في مجال أو قطاع تجاري غير مذكور هنا؟</h3>
          <p className="text-xs text-gray-400">لا قلق، لدينا خبرة واسعة في تحليل وتطوير الخطط والحلول الإعلانية المتخصصة لأكثر من 50 نموذج أعمال كويتي وخليجي.</p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-3 bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/20 whitespace-nowrap"
        >
          اطلب دراسة مخصصة لنشاطك
        </Link>
      </div>

    </div>
  );
}
