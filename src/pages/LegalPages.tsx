import { useState } from 'react';
import { ShieldCheck, FileText, Lock, Sparkles } from 'lucide-react';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function LegalPages() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookie'>('privacy');

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-20 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">الالتزام التنظيمي والقانوني بدولة الكويت</span>
        <ClipWipeTitle className="text-3xl sm:text-4xl font-black text-white">
          السياسات الأمنية <span className="text-[#FF3E55]">والشروط التنظيمية</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نحن في ميديا لاند نلتزم بكافة قوانين النشر والإعلان الإلكتروني المنظمة من قبل وزارة الإعلام والهيئة العامة للاتصالات وتقنية المعلومات بدولة الكويت لضمان نزاهة وسلامة تعاملاتنا الفنية المشتركة.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center bg-[#12141E] p-2 rounded-2xl border border-white/5 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'bg-gradient-to-r from-[#0055FF] to-[#FF3E55] text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>سياسة الخصوصية</span>
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'terms'
              ? 'bg-gradient-to-r from-[#0055FF] to-[#FF3E55] text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>الشروط والأحكام</span>
        </button>
        <button
          onClick={() => setActiveTab('cookie')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'cookie'
              ? 'bg-gradient-to-r from-[#0055FF] to-[#FF3E55] text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ملفات الارتباط</span>
        </button>
      </div>

      {/* Content Box */}
      <div className="bg-[#12141E] border border-white/5 rounded-3xl p-8 shadow-2xl text-right text-gray-300 text-xs sm:text-sm leading-relaxed space-y-6">
        
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white border-r-4 border-[#0055FF] pr-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0055FF]" />
              <span>وثيقة سياسة حماية سرية وخصوصية البيانات للشركات</span>
            </h2>
            <p className="text-justify text-[#F0F4FF]/80">
              تعتبر خصوصية عملائنا ومشاريعنا وشركائنا التجاريين ذات أهمية قصوى لوكالة ميديا لاند للدعاية والإعلان. توضح هذه الوثيقة أنواع البيانات الشخصية والتجارية التي يتم جمعها، وحمايتها، وكيفية استخدامها في ضبط الإعلانات والحملات البرمجية.
            </p>
            <div className="space-y-4">
              <h3 className="font-bold text-white">1. البيانات التي يتم جمعها وحمايتها</h3>
              <p className="text-gray-400 text-justify">
                نجمع الأسماء، وأرقام هواتف الواتساب، والعناوين الرقمية لضبط نماذج طلبات عروض الأسعار أو مبيعات متاجركم. نطبق تدابير تشفير فنية وسيبرانية صارمة جداً لمنع أي تسريب أو وصول غير مصرح به لهذه السجلات.
              </p>
              <h3 className="font-bold text-white">2. سرية خطط العمل والمبيعات</h3>
              <p className="text-gray-400 text-justify">
                تلتزم ميديا لاند بعدم الإفصاح عن أي سجلات أرباح، خطط تسويقية، أو أفكار ابتكارية حصرية للمنافسين في نفس القطاع والمحافظة الجغرافية لضمان سلامة تفوقكم التجاري.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white border-r-4 border-[#FF3E55] pr-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF3E55]" />
              <span>اتفاقية الشروط والأحكام والالتزامات التعاقدية</span>
            </h2>
            <p className="text-justify text-[#F0F4FF]/80">
              باستخدامك لموقع ميديا لاند أو طلب خدماتنا الإعلانية والبرمجية، فإنك توافق تماماً وبلا قيد على الالتزام بالشروط والأحكام المنصوص عليها هنا والتي تنظم طبيعة الأعمال المشتركة.
            </p>
            <div className="space-y-4">
              <h3 className="font-bold text-white">1. الالتزامات المالية وميزانيات التمويل</h3>
              <p className="text-gray-400 text-justify">
                يتم الاتفاق مسبقاً على ميزانيات الإعلانات الممولة (مثل إعلانات تيك توك، جوجل، إنستقرام) وتدفع بشكل مستقل ومسبق لضمان استمرارية وبقاء تدفق الاتصالات والعملاء دون انقطاع.
              </p>
              <h3 className="font-bold text-white">2. حقوق الملكية الفكرية للأصول</h3>
              <p className="text-gray-400 text-justify">
                تعود ملكية جميع لقطات الفيديو، الصور السينمائية، والتصاميم الحصرية، والبرمجيات المطورة بالكامل لصالح مشروعكم والشركة المتعاقدة بمجرد إتمام الالتزامات المالية المتفق عليها.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cookie' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white border-r-4 border-emerald-500 pr-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>سياسة ملفات تعريف الارتباط وتقنيات الاستهداف</span>
            </h2>
            <p className="text-justify text-[#F0F4FF]/80">
              يستخدم هذا الموقع ملفات تعريف الارتباط (Cookies) لتحسين تجربة تصفحك وتخصيص تجربة المحتوى الرقمي، وتوجيه خدمات التسويق والإعلانات الممولة بكفاءة.
            </p>
            <div className="space-y-4">
              <h3 className="font-bold text-white">1. كيف نستخدم ملفات تعريف الارتباط</h3>
              <p className="text-gray-400 text-justify">
                نستخدم ملفات الارتباط لنفهم خيارات تفضيلاتك الجغرافية داخل محافظات الكويت، والأنشطة والخدمات الأكثر لصفحات العرض، مما يساعدنا على ضبط وتحسين تصميم موقعنا وسرعة تحميله.
              </p>
              <h3 className="font-bold text-white">2. التحكم وإيقاف ملفات الارتباط</h3>
              <p className="text-gray-400 text-justify">
                يمكنك بكل سهولة التحكم بملفات تعريف الارتباط أو تعطيلها بالكامل من خلال إعدادات متصفحك الرقمي الشخصي في أي وقت تراه مناسباً.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
