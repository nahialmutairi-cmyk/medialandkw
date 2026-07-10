import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, MessageSquare, ShieldCheck, ChevronRight, Sparkles, Award, TrendingUp, Compass, Heart, HelpCircle, Check, Phone } from 'lucide-react';
import { ScrollReveal, ClipWipeTitle } from '../components/ScrollReveal';
import { siteConfig } from '../siteConfig';
import { PlatformsBar } from '../components/PlatformIcons';

export function Home() {
  const heroWords = ["شركة", "دعاية", "وإعلان", "وتسويق", "رقمي", "في", "الكويت"];

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 sm:px-10 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 z-10">
          
          {/* Kuwait Label */}
          <div className="inline-flex items-center gap-2 bg-[#12141E] border border-[#0055FF]/20 py-2 px-4 rounded-full shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest font-bold">
              الوكالة الرقمية الأولى بدولة الكويت 🇰🇼 LOCAL AUTHORITY
            </span>
          </div>

          {/* Strong single H1 for SEO */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.2] tracking-tight text-white flex flex-wrap gap-x-4 gap-y-2 justify-center">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                className={`${
                  i === 1 || i === 2 
                    ? 'text-[#FF3E55]' 
                    : i === 4 
                      ? 'text-transparent bg-clip-text bg-gradient-to-l from-[#0055FF] to-[#FF3E55] font-black' 
                      : ''
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="text-[#F0F4FF]/80 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            مرحباً بك في وكالة ميديا لاند الإعلامية. نوفر باقات تسويقية مبتكرة، إدارة حسابات احترافية، إنتاج فيديو وتصوير سينمائي، وتطوير مواقع ومتاجر رقمية متكاملة لضمان ريادتك ومضاعفة مبيعاتك في السوق الكويتي.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-gradient-to-r from-[#0055FF] to-[#FF3E55] hover:opacity-95 active:scale-[0.98] text-white font-bold rounded-xl shadow-xl shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>ابدأ حملتك التسويقية الآن</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              to="/services"
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>استعرض خدماتنا الـ 16</span>
              <ChevronRight className="w-4 h-4 scale-x-[-1]" />
            </Link>
          </div>

        </div>
      </section>

      {/* AGENCY OVERVIEW / INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">من نحن - ميديا لاند الكويت</span>
            <ClipWipeTitle className="text-3xl sm:text-4xl font-black text-white leading-tight">
              نهندس هويتك الرقمية <span className="text-[#FF3E55]">ونقود انتشارك التسويقي</span>
            </ClipWipeTitle>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify">
              نحن في وكالة ميديا لاند للدعاية والإعلان لا نطلق مجرد حملات، بل نصيغ خططاً تسويقية 360 درجة مبنية على سلوك المستهلك الكويتي وقوته الشرائية. ندمج الفن البصري الراقي بالتصوير الاحترافي وتطوير البرمجيات لنقدم لشركتك حضوراً تفاعلياً مبهراً يرفع أرباحك ويثبت اسمك في السوق.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 bg-[#12141E] p-4 rounded-xl border border-white/5">
                <Award className="w-5 h-5 text-[#FF3E55] mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">خبرة حقيقية ممتدة</h4>
                  <p className="text-xs text-gray-400 mt-1">حلول معتمدة لطبائع السوق الكويتي والخليجي.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#12141E] p-4 rounded-xl border border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#0055FF] mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">التزام تام بالنتائج</h4>
                  <p className="text-xs text-gray-400 mt-1">تقارير دورية شفافة لقياس المبيعات والاتصالات.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="w-full h-80 rounded-2xl bg-gradient-to-tr from-[#0055FF]/20 to-[#FF3E55]/20 p-1 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-[#12141E] rounded-2xl flex flex-col justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">رؤية إبداعية رقمية</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  نصنع لك هيبة بصرية وصوتاً رناناً يتحدث نيابة عن شركتك ويجذب مئات العملاء يومياً.
                </p>
                <Link to="/about" className="text-xs text-[#0055FF] font-bold hover:underline inline-block">اقرأ قصتنا الكاملة ←</Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE 16 SERVICES PREVIEW */}
      <section className="py-12 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase text-[#FF3E55] tracking-widest block font-bold">خدماتنا الثمانية عشر</span>
          <ClipWipeTitle className="text-3xl sm:text-5xl font-black text-white">
            حلول تسويق وبرمجة وتصوير <span className="text-[#0055FF]">تأخذك للصدارة</span>
          </ClipWipeTitle>
          <p className="text-[#F0F4FF]/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            نغطي كافة احتياجات مشروعك الرقمية والمطبوعة باحترافية كاملة من خلال خدماتنا المترابطة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.slice(0, 8).map((service, idx) => (
            <div
              key={service.id}
              className="bg-[#12141E] p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-[#0055FF]/30 hover:-translate-y-1 transition-all shadow-xl group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center group-hover:bg-[#0055FF] group-hover:text-white transition-colors">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#0055FF] transition-colors">{service.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{service.description}</p>
              </div>
              <Link to={`/services/${service.id}`} className="text-xs text-[#0055FF] font-bold mt-4 inline-block hover:underline">اعرف أكثر ←</Link>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <Link
            to="/services"
            className="px-6 py-3 border border-[#0055FF]/30 text-white hover:bg-[#0055FF]/10 rounded-full text-xs font-bold inline-flex items-center gap-2 transition-all"
          >
            <span>عرض كافة خدماتنا الـ 16</span>
            <ChevronRight className="w-4 h-4 scale-x-[-1]" />
          </Link>
        </div>
      </section>

      {/* PLATFORMS INTEGRATED MARQUEE BAR */}
      <PlatformsBar />

      {/* SECTORS/INDUSTRIES WE SERVE */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">القطاعات التجارية</span>
          <ClipWipeTitle className="text-3xl sm:text-5xl font-black text-white">
            شريك النجاح التسويقي <span className="text-[#FF3E55]">لكافة المجالات</span>
          </ClipWipeTitle>
          <p className="text-[#F0F4FF]/70 text-sm sm:text-base max-w-2xl mx-auto">
            نوفر حلولاً تسويقية مخصصة تلامس تفاصيل وتحديات وجمهور كل قطاع تجاري في الكويت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.industries.slice(0, 6).map((ind) => (
            <div
              key={ind.id}
              className="bg-[#12141E] border border-white/5 rounded-2xl p-6 hover:border-[#FF3E55]/30 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">{ind.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed"><span className="text-white font-bold">الجمهور:</span> {ind.targetAudience}</p>
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#0055FF] font-bold block">التحدي الأساسي:</span>
                  <ul className="text-[11px] text-gray-400 space-y-1 list-disc list-inside">
                    {ind.challenges.slice(0, 2).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link to={`/industries/${ind.id}`} className="text-xs text-[#FF3E55] font-bold mt-5 hover:underline inline-block">تفاصيل استراتيجية القطاع ←</Link>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <Link
            to="/industries"
            className="px-6 py-3 border border-[#FF3E55]/30 text-white hover:bg-[#FF3E55]/10 rounded-full text-xs font-bold inline-flex items-center gap-2 transition-all"
          >
            <span>استعراض كافة القطاعات والمجالات</span>
            <ChevronRight className="w-4 h-4 scale-x-[-1]" />
          </Link>
        </div>
      </section>

      {/* WHY US SECTION - NUMBERS AND TRUST */}
      <section className="bg-[#12141E]/40 border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase text-[#FF3E55] tracking-widest block font-bold">لماذا ميديا لاند؟</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                منظومة عمل إعلامية <span className="text-[#0055FF]">تتجاوز التوقعات</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                لسنا مجرد هواة نصمم منشورات، بل خبراء مهنيون ومبرمجون ندرس سلوك المستهلك الكويتي وتنافسية الكلمات المفتاحية في كل منطقة لنوصل علامتك لقمة نتائج محركات البحث ونرفع أرباحك الفعلية.
              </p>
              <div className="space-y-3.5 text-sm text-gray-300 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>تصوير فوتوغرافي وفيديو سينمائي حصري لمشروعك.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>برمجة خاصة سريعة وآمنة ومقاومة للثغرات والأخطاء.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>إعلانات ممولة ومتابعة دورية يومية للميزانيات.</span>
                </div>
              </div>
            </div>

            {/* Counters */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 shadow-lg space-y-2">
                <span className="text-3xl font-black text-[#0055FF] font-mono tracking-tight block">16+</span>
                <span className="text-xs text-gray-400 block">خدمة رقمية متكاملة</span>
              </div>
              <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 shadow-lg space-y-2">
                <span className="text-3xl font-black text-[#FF3E55] font-mono tracking-tight block">10+</span>
                <span className="text-xs text-gray-400 block">قطاعات نخدمها باحتراف</span>
              </div>
              <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 shadow-lg space-y-2">
                <span className="text-3xl font-black text-white font-mono tracking-tight block">6</span>
                <span className="text-xs text-gray-400 block">محافظات كويتية نغطيها</span>
              </div>
              <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 shadow-lg space-y-2 col-span-2 md:col-span-1">
                <span className="text-2xl font-black text-[#22C55E] font-mono tracking-tight block">100%</span>
                <span className="text-xs text-gray-400 block">التزام بالأمان والسرية</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LOCATIONS COVERAGE REVIEW */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">المحافظات والمدن</span>
          <ClipWipeTitle className="text-3xl sm:text-5xl font-black text-white">
            نوصل علامتك التجارية في <span className="text-[#FF3E55]">كافة محافظات الكويت</span>
          </ClipWipeTitle>
          <p className="text-[#F0F4FF]/70 text-sm sm:text-base max-w-2xl mx-auto">
            نقدم خدماتنا وحملاتنا التسويقية الفعالة للعملاء والمشاريع في المحافظات الست الرئيسية في دولة الكويت.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {siteConfig.locations.map((loc) => (
            <Link
              key={loc.id}
              to={`/locations/${loc.id}`}
              className="bg-[#12141E] border border-white/5 p-5 rounded-2xl text-center hover:border-[#0055FF]/30 hover:scale-103 transition-all space-y-2 block"
            >
              <div className="w-10 h-10 rounded-full bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center mx-auto">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-white leading-relaxed">{loc.title}</h3>
              <span className="text-[10px] text-gray-500 block hover:underline">استعرض الخدمات ←</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PORTFOLIO & RECENT WORK PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase text-[#FF3E55] tracking-widest block font-bold">معرض أعمالنا الحقيقية</span>
          <ClipWipeTitle className="text-3xl sm:text-5xl font-black text-white">
            شاهد نتائج ولمسات <span className="text-[#0055FF]">ميديا لاند الإبداعية</span>
          </ClipWipeTitle>
          <p className="text-[#F0F4FF]/70 text-sm sm:text-base max-w-2xl mx-auto">
            لقطات من مشاريع حقيقية قمنا بتصويرها، برمجتها، وإدارتها لعملائنا وشركائنا في الكويت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              className="bg-[#12141E] border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-[#0055FF]/30 transition-all group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={proj.image}
                  alt={proj.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#FF3E55] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{proj.category}</span>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest block uppercase">{proj.client}</span>
                <h3 className="text-sm font-bold text-white group-hover:text-[#0055FF] transition-colors">{proj.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.servicesUsed.map((u, i) => (
                    <span key={i} className="bg-white/5 text-gray-300 text-[9px] px-2 py-0.5 rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <Link
            to="/portfolio"
            className="px-6 py-3 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-full text-xs font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-[#0055FF]/20"
          >
            <span>استكشف معرض الأعمال بالكامل</span>
            <ChevronRight className="w-4 h-4 scale-x-[-1]" />
          </Link>
        </div>
      </section>

      {/* DETAILED FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">الأسئلة الشائعة</span>
          <ClipWipeTitle className="text-3xl sm:text-4xl font-black text-white">
            إجابات واضحة وحقائق <span className="text-[#FF3E55]">تسهل تعاونك معنا</span>
          </ClipWipeTitle>
        </div>

        <div className="space-y-4">
          <div className="bg-[#12141E] p-5 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0055FF] flex-shrink-0" />
              <span>ما هي البداية الصحيحة لتطوير حملة لمشروعي؟</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              تبدأ من خلال حجز استشارة مجانية مع الإدارة الفنية والتحليلية بميديا لاند. ندرس فكرتك، نقارن المنافسين في الكويت، ثم نقترح عليك القنوات والأفكار والميزانية الأنسب لمشروعك.
            </p>
          </div>
          <div className="bg-[#12141E] p-5 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0055FF] flex-shrink-0" />
              <span>هل تلتزم ميديا لاند بالحفاظ على خصوصية بياناتنا؟</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              بكل تأكيد، نحن نطبق سياسة خصوصية وأمان صارمة جداً، ونحمي أصول ومبيعات وبيانات عملائنا وحساباتهم دون أي تهاون وبسرية مطلقة.
            </p>
          </div>
          <div className="bg-[#12141E] p-5 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0055FF] flex-shrink-0" />
              <span>كيف يمكنني طلب عرض سعر تفصيلي لشركتي؟</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              ببساطة تامة، يمكنك تعبئة استمارة طلب عرض السعر المباشر بالصفحة وسيقوم ممثلونا الاستشاريون بالاتصال الفوري بك هاتفياً أو عبر الـ WhatsApp خلال دقائق معدودة.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="bg-gradient-to-tr from-[#0055FF]/20 to-[#FF3E55]/20 border border-[#0055FF]/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#0055FF]/5 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FF3E55]/5 rounded-full filter blur-2xl pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            جاهز لتطلق حملتك الإعلانية وتتصدر <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#0055FF] to-[#FF3E55]">سوق الكويت؟</span>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            دعنا نضع استراتيجية ترويجية وبرمجية حقيقية تتفوق بها على المنافسين. اتصل بنا أو راسلنا عبر الواتساب للاستشارة والمباشرة فوراً.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#22C55E] hover:bg-[#1eb152] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-103"
            >
              <MessageSquare className="w-4 h-4" />
              <span>تواصل معنا بالواتساب فورا</span>
            </a>
            
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-white/5"
            >
              <Phone className="w-4 h-4 text-[#FF3E55]" />
              <span>حجز موعد مكالمة هاتفية</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
