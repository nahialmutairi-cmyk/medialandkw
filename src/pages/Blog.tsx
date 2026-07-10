import { Link } from 'react-router-dom';
import { Calendar, User, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      
      {/* Title block */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">المدونة المعرفية وأسرار السوق</span>
        <ClipWipeTitle as="h1" className="text-3xl sm:text-5xl font-black text-white">
          مدونة <span className="text-[#FF3E55]">ميديا لاند الإعلانية</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نشارككم خبراتنا ورؤيتنا الفنية والبرمجية حول آليات التسويق وإعلانات السوشيال ميديا وتطوير الويب لتمكين رواد الأعمال في الكويت من اتخاذ قرارات ناجحة.
        </p>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {siteConfig.blog.map((post) => (
          <div
            key={post.id}
            className="bg-[#12141E] border border-white/5 rounded-3xl overflow-hidden hover:border-[#0055FF]/30 hover:shadow-2xl transition-all group flex flex-col justify-between"
          >
            {/* Image banner */}
            <div className="relative aspect-video w-full overflow-hidden bg-white/5">
              <img
                src={post.coverImage}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 right-4 bg-[#0055FF] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
                أسرار التسويق
              </div>
            </div>

            {/* Content block */}
            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF3E55]" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>قراءة 5 د</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#0055FF] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 text-justify">
                  {post.intro}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 mt-4">
                <Link
                  to={`/blog/${post.id}`}
                  className="w-full text-center py-3 bg-white/5 hover:bg-[#0055FF] hover:text-white text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <span>اقرأ المقال الكامل</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Subscription banner */}
      <div className="bg-gradient-to-tr from-[#0055FF]/10 to-[#FF3E55]/10 p-8 sm:p-12 rounded-3xl border border-[#0055FF]/10 text-center space-y-6">
        <span className="w-10 h-10 rounded-full bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5" />
        </span>
        <div className="space-y-2 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-white">اشترك في نشرتنا المعرفية الأسبوعية</h3>
          <p className="text-xs text-gray-400 leading-relaxed">كن أول من يحصل على إحصائيات السوشيال ميديا في الكويت والتريندات الصاعدة وتحديثات بكسل تتبع المبيعات مباشرة في بريدك.</p>
        </div>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني..."
            className="flex-1 bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0055FF]"
          />
          <button className="px-6 py-3 bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#0055FF]/15 transition-all">
            اشترك مجاناً
          </button>
        </div>
      </div>

    </div>
  );
}
