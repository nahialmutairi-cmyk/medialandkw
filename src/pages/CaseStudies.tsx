import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClipWipeTitle } from '../components/ScrollReveal';
import { caseStudyPages } from '../caseStudyData';

export function CaseStudies() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#FF3E55] tracking-widest block font-bold">سيناريوهات تطبيقية</span>
        <ClipWipeTitle as="h1" className="text-3xl sm:text-5xl font-black text-white">
          دراسات حالة <span className="text-[#0055FF]">تشرح منهج العمل</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          أمثلة افتراضية توضح طريقة تحليل التحدي وبناء المنهجية والقياس، ولا تمثل عملاء أو نتائج فعلية غير موثقة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudyPages.map((study) => (
          <article key={study.id} className="bg-[#12141E] border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-[#0055FF]/30 transition-colors">
            <div className="aspect-video bg-white/5 overflow-hidden">
              <img src={study.coverImage} alt={study.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-bold text-[#FF7485] bg-[#FF3E55]/10 px-3 py-1.5 rounded-full">{study.sectorLabel}</span>
                <h2 className="text-base font-bold text-white leading-7">{study.title}</h2>
                <p className="text-xs text-gray-400 leading-6 line-clamp-4">{study.challenge}</p>
              </div>
              <Link to={`/case-studies/${study.id}`} className="w-full py-3 bg-white/5 hover:bg-[#0055FF] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors">
                <span>عرض السيناريو</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
