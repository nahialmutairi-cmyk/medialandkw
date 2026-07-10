import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Search, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function Services() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = siteConfig.services.filter(service => {
    return service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           service.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      
      {/* Title block */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">الحلول والخدمات الإعلانية المتكاملة</span>
        <ClipWipeTitle as="h1" className="text-3xl sm:text-5xl font-black text-white">
          خدمات ميديا لاند الـ <span className="text-[#FF3E55]">16 المعتمدة</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نقدم حلولاً تسويقية وبرمجية متكاملة مصممة خصيصاً لمشاريع وشركات دولة الكويت. ابحث عن الخدمة المناسبة لنمو مبيعاتك وانتشارك الرقمي.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#12141E] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-right">
          <p className="text-xs text-gray-400">استخدم شريط البحث لفلترة الحلول الـ 16 فوراً:</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث عن خدمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors"
          />
          <Search className="w-4 h-4 text-gray-500 absolute top-3.5 right-3.5" />
        </div>
      </div>

      {/* GRID LISTING OF SERVICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-[#12141E] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0055FF]/30 hover:shadow-2xl transition-all group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#0055FF]/25 group-hover:text-white text-[#0055FF] transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 font-mono">
                  {service.subtitle}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#0055FF] transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              {/* Sub features preview */}
              <div className="pt-2 space-y-1.5 border-t border-white/5">
                {service.features.slice(0, 3).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-[#F0F4FF]/70">
                    <span className="w-1 h-1 rounded-full bg-[#FF3E55]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Link
                to={`/services/${service.id}`}
                className="w-full text-center py-2.5 bg-white/5 hover:bg-[#0055FF] hover:text-white text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
              >
                <span>اقرأ التفاصيل الفنية كاملة</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-[#12141E] rounded-3xl border border-white/5 space-y-4">
          <p className="text-sm text-gray-400">لم نعثر على أي خدمات تطابق بحثك حالياً.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#0055FF] font-bold underline"
          >
            عرض كافة الخدمات
          </button>
        </div>
      )}

      {/* Bottom Conversion Section */}
      <div className="bg-gradient-to-tr from-[#0055FF]/10 to-[#FF3E55]/10 p-8 rounded-3xl border border-[#0055FF]/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-right">
          <h3 className="text-lg font-bold text-white">هل تحتاج خدمة مخصصة أو باقة تسويقية تجمع حلولنا؟</h3>
          <p className="text-xs text-gray-400">اتصل بفريق التخطيط والتطوير لنصمم لك عرضاً مخصصاً يناسب ميزانيتك وطموحات مشروعك.</p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-3 bg-[#FF3E55] hover:bg-[#D6223B] text-white font-bold rounded-xl text-xs shadow-lg shadow-red-500/15 whitespace-nowrap transition-transform hover:scale-103"
        >
          طلب عرض مخصص الآن
        </Link>
      </div>

    </div>
  );
}
