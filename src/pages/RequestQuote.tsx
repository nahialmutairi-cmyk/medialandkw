import React, { useState } from 'react';
import { Send, CheckCircle2, ChevronRight, HelpCircle, ArrowLeft, Building, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function RequestQuote() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    service: 'حملة إعلانية ممولة متكاملة',
    budget: '500 - 1000 دينار كويتي',
    timeline: 'شهر واحد',
    details: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('الرجاء تعبئة حقول الاسم ورقم الهاتف لإرسال طلب عرض السعر.');
      return;
    }
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-20 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase text-[#FF3E55] tracking-widest block font-bold">نموذج B2B المعتمد</span>
        <ClipWipeTitle className="text-3xl sm:text-4xl font-black text-white">
          اطلب عرض سعر <span className="text-[#0055FF]">تفصيلي لمشروعك</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          املأ تفاصيل ميزانيتك، نطاق الخدمة، والجدول الزمني المخطط له، وسيقوم فريق التخطيط والمالية لدينا بصياغة عرض فني ومالي تفصيلي وإرساله لك.
        </p>
      </div>

      <div className="bg-[#12141E] border border-white/5 rounded-3xl p-8 shadow-2xl relative">
        {submitted ? (
          <div className="py-16 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">تم استقبال طلبك بنجاح!</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              يقوم المستشارون والخبراء الماليون بميديا لاند حالياً بدراسة نطاق المتطلبات والميزانية المحددة لصياغة عرض فني دقيق وسنتواصل معك خلال ساعة عمل واحدة.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-white transition-all font-bold"
            >
              تقديم طلب عرض سعر جديد
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="quote_name" className="text-xs font-bold text-gray-400 block">الاسم واللقب *</label>
                <input
                  id="quote_name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="مثال: م. فهد الشمري"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors"
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label htmlFor="quote_company" className="text-xs font-bold text-gray-400 block">اسم الشركة أو المشروع التجاري</label>
                <input
                  id="quote_company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="مثال: مطعم أو شركة أو عيادة ..."
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="quote_phone" className="text-xs font-bold text-gray-400 block">رقم الهاتف الجوال / واتساب *</label>
                <input
                  id="quote_phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="مثال: +965 6511 8963"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors"
                  dir="ltr"
                  required
                />
              </div>

              {/* Service */}
              <div className="space-y-2">
                <label htmlFor="quote_service" className="text-xs font-bold text-gray-400 block">الخدمة التسويقية أو البرمجية الأساسية</label>
                <select
                  id="quote_service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors appearance-none"
                >
                  <option value="حملة إعلانية ممولة متكاملة">حملة إعلانية ممولة متكاملة</option>
                  <option value="برمجة متجر إلكتروني احترافي">برمجة متجر إلكتروني احترافي</option>
                  <option value="تصوير سينمائي وميديا للأكلات">تصوير سينمائي وميديا للأكلات</option>
                  <option value="تصميم هوية بصرية كاملة">تصميم هوية بصرية ولوجو كامل</option>
                  <option value="باقة تسويقية 360 سنوية">باقة تسويقية سنوية شاملة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget */}
              <div className="space-y-2">
                <label htmlFor="quote_budget" className="text-xs font-bold text-gray-400 block">الميزانية التقريبية المقدرة للحملة</label>
                <select
                  id="quote_budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors appearance-none"
                >
                  <option value="حتى 250 دينار كويتي">حتى 250 دينار كويتي (تجريبية)</option>
                  <option value="250 - 500 دينار كويتي">250 - 500 دينار كويتي (اقتصادية)</option>
                  <option value="500 - 1000 دينار كويتي">500 - 1000 دينار كويتي (موصى بها)</option>
                  <option value="أكثر من 1000 دينار كويتي">أكثر من 1000 دينار كويتي (شاملة ريادية)</option>
                </select>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <label htmlFor="quote_timeline" className="text-xs font-bold text-gray-400 block">الجدول الزمني المستهدف للتسليم</label>
                <select
                  id="quote_timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors appearance-none"
                >
                  <option value="خلال أسبوع">عاجل جداً (خلال أسبوع)</option>
                  <option value="2 - 3 أسابيع">خلال أسبوعين إلى 3 أسابيع</option>
                  <option value="شهر واحد">خلال شهر واحد (اعتيادي)</option>
                  <option value="أكثر من شهر">أكثر من شهر (مشروع كبير)</option>
                </select>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <label htmlFor="quote_details" className="text-xs font-bold text-gray-400 block">تفاصيل أو متطلبات فنية خاصة تود لفت الانتباه لها</label>
              <textarea
                id="quote_details"
                name="details"
                rows={4}
                value={formData.details}
                onChange={handleInputChange}
                placeholder="اكتب هنا أي شروط أو تفاصيل إضافية تود إدراجها ضمن عرض السعر..."
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors resize-none text-right"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#FF3E55] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري إرسال المتطلبات ودراسة الميزانية...</span>
              ) : (
                <>
                  <span>طلب العرض المالي والفني رسمياً</span>
                  <Send className="w-4 h-4 scale-x-[-1]" />
                </>
              )}
            </button>

          </form>
        )}
      </div>

    </div>
  );
}
