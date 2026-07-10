import { Link } from 'react-router-dom';
import { MessageSquare, ArrowUpRight, TrendingUp, Users, Target, ShieldCheck, Sparkles } from 'lucide-react';
import { ClipWipeTitle } from '../components/ScrollReveal';
import { siteConfig } from '../siteConfig';

export function CaseStudies() {
  const caseStudies = [
    {
      title: "تحسين حضور سلسلة مطاعم برجر كويتية في القنوات الرقمية",
      sector: "المطاعم والأغذية",
      metrics: { reach: "محلي", engagement: "أفضل", tracking: "أوضح" },
      challenge: "تراجع أرقام الطلبات الخارجية وزيادة تكلفة الوصول للمستهلك على منصات التوصيل.",
      solution: "أطلقنا باقة تصوير سينمائي للأكلات مفعمة بالحيوية والشهية، ووجهنا الإعلانات الممولة نحو نطاق جغرافي ضيق بمحافظات حولي والعاصمة والفروانية مع تفعيل كود خصم حصري.",
      result: "تحسن تفاعل الجمهور مع المحتوى، وأصبحت رسائل الحملة أوضح وأسهل قياساً عبر قنوات التواصل."
    },
    {
      title: "تنظيم حملات حجز رقمية لعيادة أسنان تجميلية",
      sector: "الرعاية والخدمات الطبية",
      metrics: { reach: "موجه", engagement: "منظم", tracking: "مقاس" },
      challenge: "شدة المنافسة بين عيادات الأسنان في الكويت وصعوبة إثبات المصداقية الرقمية.",
      solution: "أقمنا جلسة تصوير فيديو احترافية توعوية للأطباء يشرحون فيها حالات زراعة وابتسامة هوليود، ونشرناها مصحوبة بحملات Lead Generation مستهدفة.",
      result: "تحسنت جودة الاستفسارات الواردة، وأصبحت رحلة العميل من الإعلان إلى التواصل أكثر وضوحاً."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#FF3E55] tracking-widest block font-bold">نماذج عمل قابلة للقياس</span>
        <ClipWipeTitle as="h1" className="text-3xl sm:text-5xl font-black text-white">
          دراسات حالة رقمية <span className="text-[#0055FF]">تشرح منهج العمل</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نعرض هنا نماذج توضح طريقة التفكير والتخطيط والقياس في الحملات، دون ادعاء نتائج غير موثقة أو أرقام غير منشورة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {caseStudies.map((cs, idx) => (
          <div
            key={idx}
            className="bg-[#12141E] border border-white/5 p-8 rounded-3xl space-y-6 hover:border-[#0055FF]/20 transition-all flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs font-bold text-[#FF3E55] bg-[#FF3E55]/10 px-3 py-1.5 rounded-full">{cs.sector}</span>
                <span className="text-[10px] text-gray-500 font-mono">CASE STUDY 0{idx + 1}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">{cs.title}</h3>

              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-3 text-center bg-[#0A0A0F] p-4 rounded-2xl border border-white/5">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 block">نطاق الوصول</span>
                  <span className="text-xl font-black text-[#22C55E] font-mono">{cs.metrics.reach}</span>
                </div>
                <div className="space-y-1 border-x border-white/5">
                  <span className="text-xs text-gray-500 block">تفاعل الجمهور</span>
                  <span className="text-xl font-black text-white font-mono">{cs.metrics.engagement}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 block">وضوح القياس</span>
                  <span className="text-xl font-black text-[#0055FF] font-mono">{cs.metrics.tracking}</span>
                </div>
              </div>

              {/* Challenge / Solution */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E55]" />
                    <span>التحدي والعقبة:</span>
                  </h4>
                  <p className="text-gray-400 leading-relaxed text-justify">{cs.challenge}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-[#0055FF] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF]" />
                    <span>منهج وحل ميديا لاند:</span>
                  </h4>
                  <p className="text-gray-400 leading-relaxed text-justify">{cs.solution}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-[#22C55E] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>النتيجة النهائية:</span>
                  </h4>
                  <p className="text-gray-300 leading-relaxed text-justify">{cs.result}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <a
                  href={`${siteConfig.whatsappUrl}?text=${encodeURIComponent(
                  `مرحباً ميديا لاند، أرغب بالاستفسار عن خطتكم التسويقية للقطاع: ${cs.sector} وبناء تجربة مناسبة لمشروعي.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>اطلب خطة مناسبة لمشروعك</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
