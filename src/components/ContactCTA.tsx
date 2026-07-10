import { useState, FormEvent } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Send, PhoneCall, Instagram, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import { siteConfig } from '../siteConfig';

export function ContactCTA() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'default',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('يرجى ملء الاسم ورقم الهاتف للتمكن من التواصل معكم.');
      return;
    }
    
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', service: 'default', message: '' });
    setStatus('idle');
  };

  return (
    <div id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
      
      {/* Contact Text Column */}
      <div className="lg:col-span-5 space-y-6">
        <span className="text-xs font-mono uppercase text-[#0055FF] tracking-wider block">Let's Get Started</span>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-white leading-tight">
          جاهز لتتحول فكرتك إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0055FF] to-[#FF3E55]">نجاح ملموس؟</span>
        </h2>
        <p className="text-gray-300/80 leading-relaxed text-justify text-sm">
          تواصل مع فريق ميديا لاند الإعلامي الآن لوضع دراسة تسويقية مخصصة لمشروعك تناسب ميزانيتك، وتساعدك على بناء حضور رقمي أوضح في السوق الكويتي. نرد ونحدد موعداً للاستشارة والتحليل الرقمي خلال ساعات قليلة.
        </p>

        {/* Dynamic Interactive Cards with contact handles */}
        <div className="space-y-4 pt-4">
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#12141E] p-4 rounded-xl border border-white/5 hover:border-[#22C55E]/20 transition-all hover:scale-102 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center group-hover:bg-[#22C55E]/20 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-mono">WHATSAPP / INSTANT CHAT</span>
              <span className="text-white font-bold font-display tracking-wide group-hover:text-[#22C55E] transition-colors" dir="ltr">
                {siteConfig.whatsapp}
              </span>
            </div>
          </a>

          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#12141E] p-4 rounded-xl border border-white/5 hover:border-[#FF3E55]/20 transition-all hover:scale-102 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF3E55]/10 text-[#FF3E55] flex items-center justify-center group-hover:bg-[#FF3E55]/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-mono">OFFICIAL INSTAGRAM</span>
              <span className="text-white font-bold font-display group-hover:text-[#FF3E55] transition-colors">
                @medialandkw
              </span>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-[#12141E] p-4 rounded-xl border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-mono">AGENCY LOCATION</span>
              <span className="text-white font-bold font-display text-sm">
                دولة الكويت • لجميع المحافظات الفنية والرقمية
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card Column */}
      <div className="lg:col-span-7">
        <div className="bg-[#12141E] border border-white/5 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          
          {/* Ambient background accent shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3E55]/5 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0055FF]/5 rounded-full filter blur-2xl pointer-events-none" />

          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-right">
              <h3 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4 mb-2">
                طلب استشارة تسويقية وبرمجية مجانية
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 font-display block mb-2 font-bold select-none">الاسم الكريم *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: أحمد الصباح"
                    className="w-full bg-[#0A0A0F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-transparent transition-all placeholder:text-gray-600 focus:bg-[#12141E]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-display block mb-2 font-bold select-none">رقم الهاتف (الكويت) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="مثال: 65118963"
                    className="w-full bg-[#0A0A0F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-transparent transition-all placeholder:text-gray-600 font-bold focus:bg-[#12141E]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-display block mb-2 font-bold select-none">الخدمة المطلوبة</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-[#0A0A0F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-transparent transition-all focus:bg-[#12141E]"
                >
                  <option value="default" disabled hidden>اختر الخدمة المناسبة لمشروعك</option>
                  <option value="apps">📱 تطبيقات الأندرويد الهواتف</option>
                  <option value="web">🌐 تصميم وتطوير المواقع والمنصات</option>
                  <option value="win">🖥️ برمجيات كواتم وويندوز العقارية</option>
                  <option value="social">📊 إدارة شبكات التواصل الاجتماعي</option>
                  <option value="sponsor">📣 إعلانات سبونسر المدفوعة</option>
                  <option value="google">🔍 إعلانات غوغل لتصدر البحث</option>
                  <option value="design">🎨 هوية بصرية وتصميم إنفوغرافيك</option>
                  <option value="video">🎬 إنتاج الفيديو الاحترافي والموشن</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-display block mb-2 font-bold select-none">تفاصيل إضافية لشرح فكرتك</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="حدثنا بموجز عن مشروعك التجاري لنبدأ وضع الاستعراض البرمجي..."
                  className="w-full bg-[#0A0A0F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-transparent transition-all placeholder:text-gray-600 focus:bg-[#12141E]"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-[#0055FF] to-[#FF3E55] hover:opacity-90 active:scale-[0.98] text-white font-bold font-display py-4 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري إرسال طلبكم...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>إرسال الطلب والتواصل الفوري</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-6 relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-2 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-display text-white">تم استلام طلبكم بنجاح!</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                شكراً لتواصلك مع ميديا لاند الإعلامية يا <span className="text-[#FF3E55] font-bold">{formData.name}</span>. تم توجيه ملف الطلب الاستشاري للإدارة التنفيذية، وسيتصل بك أحد خبرائنا الفنيين عبر الهاتف أو الـ WhatsApp على الرقم <span className="font-mono text-[#0055FF] font-bold" dir="ltr">{formData.phone}</span> خلال دقائق معدودة.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <a
                  href={`${siteConfig.whatsappUrl}?text=مرحباً%20ميديا%20لاند،%20لقد%20أرسلت%20طلباً%20للتواصل%20باسمي:%20${encodeURIComponent(formData.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#22C55E] hover:bg-[#22C55E]/90 text-white font-bold font-display px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-103 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>متابعة فورية بالواتساب</span>
                </a>
                
                <button
                  onClick={handleReset}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold font-display px-6 py-3.5 rounded-xl text-sm transition-all focus:outline-none"
                >
                  إرسال طلب آخر
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
