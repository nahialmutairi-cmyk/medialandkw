import { useState } from 'react';
import { siteConfig } from '../siteConfig';
import { Camera, Eye, MessageSquare, Sparkles, FolderOpen, ArrowUpRight } from 'lucide-react';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', name: 'الكل' },
    { key: 'تصوير احترافي سينمائي', name: 'تصوير وميديا' },
    { key: 'برمجة وتطوير مواقع', name: 'مواقع ومتاجر' },
    { key: 'إدارة حسابات وإعلانات ممولة', name: 'إعلانات وحملات' },
    { key: 'تصميم هويات بصرية ولوجو', name: 'هويات وتصميم' }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? siteConfig.projects
    : siteConfig.projects.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">معرض أعمال ميديا لاند الحقيقية</span>
        <ClipWipeTitle className="text-3xl sm:text-5xl font-black text-white">
          شاهد لمسات الإبداع <span className="text-[#FF3E55]">بأعين عملائنا</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          نحن لا نعرض نماذج وهمية؛ جميع الأعمال أدناه هي مشاريع ولقطات وحملات حقيقية قمنا بتنفيذها وتصويرها وإطلاقها لشركات ومشاريع ناشئة في السوق الكويتي.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 justify-center bg-[#12141E] p-3 rounded-2xl border border-white/5 max-w-2xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.key
                ? 'bg-gradient-to-r from-[#0055FF] to-[#FF3E55] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((proj) => {
          const waUrl = `https://wa.me/96565118963?text=${encodeURIComponent(
            `مرحباً ميديا لاند، شاهدت مشروع "${proj.title}" لعميلكم "${proj.client}" وأرغب في تنفيذ عمل مماثل لمشروعي الخاص.`
          )}`;

          return (
            <div
              key={proj.id}
              className="bg-[#12141E] border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-[#0055FF]/30 transition-all flex flex-col justify-between group"
            >
              <div className="relative h-64 overflow-hidden bg-gray-900">
                <img
                  src={proj.image}
                  alt={proj.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-90" />
                <span className="absolute top-4 right-4 bg-gradient-to-r from-[#0055FF] to-[#FF3E55] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {proj.category}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] text-[#FF3E55] font-mono tracking-widest block uppercase font-bold">العميل: {proj.client}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-[#0055FF] transition-colors">{proj.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed text-justify line-clamp-4">{proj.description}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.servicesUsed.map((serv, idx) => (
                      <span key={idx} className="bg-white/5 text-gray-300 text-[9px] px-2.5 py-1 rounded-full">{serv}</span>
                    ))}
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 bg-[#22C55E]/10 hover:bg-[#22C55E] text-[#22C55E] hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>اطلب مشروعاً مماثلاً بالواتساب</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
