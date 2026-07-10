import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Clock, MessageSquare, Tag, Bookmark } from 'lucide-react';
import { siteConfig } from '../siteConfig';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();

  const post = siteConfig.blog.find(b => b.id === id);

  if (!post) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 space-y-4">
        <h2 className="text-xl font-bold text-white">المقال المطلوب غير موجود</h2>
        <p className="text-xs text-gray-400">عذراً، لم نتمكن من العثور على هذا المقال في أرشيف مدونة ميديا لاند.</p>
        <Link to="/blog" className="text-xs text-[#0055FF] font-bold block hover:underline">← العودة إلى قائمة المقالات</Link>
      </div>
    );
  }

  // Pre-filled WhatsApp message for consultation based on the blog topic
  const prefilledWhatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    `مرحباً ميديا لاند، قرأت مقالكم المميز: "${post.title}" وأرغب في الحصول على استشارة تسويقية لمشروعي الخاص.`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-20 space-y-12">
      
      {/* Back to list */}
      <div>
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#0055FF] transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>العودة لكافة المقالات</span>
        </Link>
      </div>

      {/* Hero header info */}
      <div className="space-y-6 text-right">
        <div className="inline-flex items-center gap-2 bg-[#0055FF]/15 border border-[#0055FF]/20 px-3 py-1 rounded-full text-[10px] text-[#0055FF] font-bold">
          <Bookmark className="w-3.5 h-3.5" />
          <span>مقالات ميديا لاند الحصرية</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-white leading-snug">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs font-mono pt-2 border-b border-white/5 pb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#FF3E55]" />
            <span>تاريخ النشر: {post.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#0055FF]" />
            <span>الكاتب: {post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>زمن القراءة المقدر: 5 دقائق</span>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl">
        <img
          src={post.coverImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Body */}
        <div className="lg:col-span-8 space-y-8 text-right">
          
          <div className="text-sm text-gray-300 leading-relaxed text-justify bg-[#12141E]/40 p-6 rounded-2xl border border-white/5">
            <p className="font-bold text-white text-base mb-2">مقدمة الدليل:</p>
            {post.intro}
          </div>

          {/* Dynamic Sections rendering */}
          <div className="space-y-8">
            {post.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-r-4 border-[#0055FF] pr-3">
                  <span>{section.heading}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed text-justify">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {/* FAQ specific to the blog post */}
          {post.faq && post.faq.length > 0 && (
            <div className="bg-[#12141E] p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 mt-12">
              <h4 className="text-base font-bold text-white border-r-4 border-[#FF3E55] pr-3">أسئلة شائعة حول هذا الموضوع</h4>
              <div className="space-y-4">
                {post.faq.map((item, i) => (
                  <div key={i} className="space-y-1 bg-[#0A0A0F] p-4 rounded-xl border border-white/5">
                    <h5 className="text-xs font-bold text-white">{item.q}</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags cloud placeholder */}
          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
            <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1.5 ml-2">
              <Tag className="w-3.5 h-3.5" />
              <span>الوسوم:</span>
            </span>
            {["تسويق_الكويت", "دعاية_وإعلان", "السوشيال_ميديا", "ميديا_لاند"].map((tag, i) => (
              <span key={i} className="text-[10px] text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Floating Sidebar Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#12141E] border border-[#0055FF]/10 rounded-2xl p-6 space-y-5 shadow-xl sticky top-24">
            <h4 className="text-sm font-bold text-white">هل تبحث عن شريك تسويقي موثوق؟</h4>
            <p className="text-xs text-gray-400 leading-relaxed">بفضل دمجنا الفريد للبرمجة مع الفن الإبداعي، نساعدك في صياغة حملات تسويقية حقيقية ترفع مبيعاتك.</p>
            
            <a
              href={prefilledWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 bg-[#22C55E] hover:bg-[#1eb152] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
            >
              <MessageSquare className="w-4 h-4" />
              <span>استشارة مجانية بالواتساب</span>
            </a>

            <div className="text-[10px] text-gray-500 text-center leading-relaxed">
              * سنقوم بتحليل قنوات تسويق مشروعك مجاناً عند تواصلك معنا الآن.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
