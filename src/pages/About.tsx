import { Link } from 'react-router-dom';
import { Award, Compass, Heart, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { ClipWipeTitle } from '../components/ScrollReveal';
import { siteConfig } from '../siteConfig';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-20 pb-20">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">عن وكالتنا الإعلامية</span>
        <ClipWipeTitle as="h1" className="text-3xl sm:text-5xl font-black text-white">
          قصة ميديا لاند للدعاية والإعلان <span className="text-[#FF3E55]">والتسويق الرقمي</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نحن فريق كويتي وخليجي متكامل يدمج التخطيط الاستراتيجي الصارم بالفن البصري الراقي وهندسة البرمجيات السريعة لنصنع فارقاً حقيقياً في نمو مبيعات شركتك.
        </p>
      </div>

      {/* Story / Vision / Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-bold text-white border-r-4 border-[#FF3E55] pr-3">قصتنا وبدايتنا</h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-justify">
            انطلقت ميديا لاند بدولة الكويت بهدف سد الفجوة الكبيرة بين التصاميم العادية والحملات الإعلانية الصارمة ذات العائد الربحي الفعلي. نحن لا نكتفي بإنشاء تصاميم، بل نضع استراتيجية متكاملة تبدأ من دراسة المنافسين وتصوير الأصول الخاصة بمشروعك تصويراً سينمائياً احترافياً، مروراً بهندسة برمجيات موقعك أو متجرك ليصبح فائق السرعة، انتهاءً بضبط حملات التمويل والميزانيات على منصات التواصل ومحركات البحث.
          </p>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-justify">
            اليوم، نفتخر بكوننا شريكاً تقنياً وترويجياً معتمداً للعشرات من المشاريع والعلامات التجارية الرائدة والمطاعم والعيادات في الكويت، ونواصل تطوير أدواتنا وقدراتنا التحليلية لنبقى دائماً الخيار الأول لرواد الأعمال الطموحين.
          </p>
        </div>

        <div className="lg:col-span-5 space-y-4 bg-[#12141E] p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#0055FF]">رؤيتنا المستدامة</h3>
            <p className="text-xs text-gray-400 leading-relaxed text-justify">
              تسيّد مشهد الدعاية والإعلانات المبتكرة في الخليج العربي من خلال إرساء معايير جديدة تجمع الفن الإبداعي البصري بالعوائد والبيانات والأرقام الملموسة.
            </p>
          </div>
          <div className="h-px bg-white/5" />
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#FF3E55]">رسالتنا للعملاء</h3>
            <p className="text-xs text-gray-400 leading-relaxed text-justify">
              تمكين المشاريع الكويتية والشركات المتوسطة من امتلاك حضور رقمي ريادي يرفع مبيعاتها ويحمي استثماراتنا التسويقية المشتركة بأعلى مستويات الشفافية المهنية.
            </p>
          </div>
        </div>

      </div>

      {/* Values */}
      <div className="space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-black text-white">القيم التي تحكم ميثاق عملنا بميديا لاند</h2>
          <p className="text-xs text-gray-400">نهج أخلاقي وفني متين يقود كافة تفاصيل يومنا وتعاملاتنا مع عملائنا وشركائنا:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">الشفافية المطلقة والسرية</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              تقارير دورية بالأرقام والاتصالات، وحماية تامة لبيانات وسجلات أرباح وخطط عملائنا دون تهاون.
            </p>
          </div>
          <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FF3E55]/10 text-[#FF3E55] flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">شغف الابتكار والتفوق</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              نطور ونحدث تقنياتنا البرمجية والتسويقية لمواكبة أحدث تحديثات خوارزميات جوجل والمنصات باستمرار.
            </p>
          </div>
          <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">الشراكة الدائمة الممتدة</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              لا نعتبركم مجرد صفقة عابرة؛ نجاح مبيعاتكم ونموكم هو الضمان الأساسي لاستمرارية شراكتنا وصدارتنا.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
