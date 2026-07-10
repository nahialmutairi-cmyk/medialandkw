import { Link } from 'react-router-dom';
import { Compass, MapPin, ChevronRight } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function Locations() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      
      {/* Title block */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">التغطية والسيادة الجغرافية في الكويت</span>
        <ClipWipeTitle className="text-3xl sm:text-5xl font-black text-white">
          خدماتنا الإعلانية تغطي <span className="text-[#FF3E55]">محافظات الكويت الست</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نحن في ميديا لاند نفهم جيداً التوزيع السكاني والجغرافي والشرائي لكل محافظة ومنطقة كويتية، ونصيغ حملات إعلانية ذكية تستهدف عملاءك الأقرب جغرافياً لتعظيم المبيعات.
        </p>
      </div>

      {/* 6 Locations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteConfig.locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-[#12141E] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#0055FF]/30 hover:scale-[1.01] transition-all shadow-xl group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#0055FF] transition-colors">{loc.title}</h3>
                </div>
                <span className="text-[10px] text-gray-500 font-mono tracking-wider font-bold">KUWAIT</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">سلوك المستهلك المحلي بالمنطقة</span>
                <p className="text-xs text-gray-300 leading-relaxed text-justify line-clamp-4">{loc.intro}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-[10px] text-[#FF3E55] font-bold block">أنشطة ومحاور نركز عليها هنا:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {loc.sectors.slice(0, 3).map((sec, i) => (
                    <span key={i} className="bg-white/5 text-[#F0F4FF]/70 text-[9px] px-2.5 py-1 rounded-full">{sec}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to={`/locations/${loc.id}`}
                className="w-full text-center py-2.5 bg-white/5 hover:bg-[#0055FF] hover:text-white text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
              >
                <span>استكشف حلول الاستهداف المحلي</span>
                <ChevronRight className="w-3.5 h-3.5 scale-x-[-1]" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Local SEO benefits banner */}
      <div className="bg-gradient-to-tr from-[#0055FF]/10 to-[#FF3E55]/10 p-8 rounded-3xl border border-[#0055FF]/10 space-y-6">
        <h3 className="text-lg font-bold text-white text-center md:text-right">قوة التسويق المحلي المستهدف في دولة الكويت (Local SEO & Geo-targeting)</h3>
        <p className="text-xs text-gray-400 leading-relaxed text-justify">
          الشرائح السلوكية والقدرة الشرائية تختلف بشكل نسبي بين قاطني المحافظات مثل حولي، العاصمة، والجهراء. نقوم في ميديا لاند بصناعة وضبط فئات الاستهداف الجغرافي الدقيق لموقعك الجغرافي أو مستودعاتك، وتوزيع ميزانياتك الترويجية بذكاء لتأكيد جذب العميل الأكثر قرباً وفائدة لمشروعك، متجنبين بذلك أي استهلاك غير مجدٍ لميزانية إعلاناتك الممولة.
        </p>
      </div>

    </div>
  );
}
