import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteConfig } from '../siteConfig';
import { ClipWipeTitle } from '../components/ScrollReveal';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'تسويق رقمي وإعلانات',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('فضلاً، يرجى كتابة الاسم ورقم الهاتف للاتصال بك.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate sending data securely
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectType: 'تسويق رقمي وإعلانات',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 pb-20">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase text-[#0055FF] tracking-widest block font-bold">تواصل معنا الآن</span>
        <ClipWipeTitle as="h1" className="text-3xl sm:text-5xl font-black text-white">
          احصل على استشارتك <span className="text-[#FF3E55]">الإعلانية المجانية</span>
        </ClipWipeTitle>
        <p className="text-[#F0F4FF]/70 text-xs sm:text-sm leading-relaxed">
          يسعدنا الرد على مكالماتكم، استفساراتكم، ورسائلكم على مدار الساعة. املأ النموذج المباشر وسنعاود الاتصال بكم فوراً.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Information Cards (Right/RTL) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xl font-bold text-white border-r-4 border-[#0055FF] pr-3">معلومات التواصل المباشرة</h2>
          
          <div className="space-y-4">
            
            {/* Phone */}
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
              className="bg-[#12141E] p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-[#0055FF]/30 transition-all block text-right"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">اتصال هاتفي مباشر</span>
                <span className="text-sm font-bold text-white" dir="ltr">{siteConfig.phone}</span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="bg-[#12141E] p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-[#0055FF]/30 transition-all block text-right"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">البريد الإلكتروني التجاري</span>
                <span className="text-sm font-bold text-white font-mono">{siteConfig.email}</span>
              </div>
            </a>

            {/* Location Address */}
            <div className="bg-[#12141E] p-6 rounded-2xl border border-white/5 flex items-center gap-4 text-right">
              <div className="w-12 h-12 rounded-xl bg-[#FF3E55]/10 text-[#FF3E55] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">مقر وعنوان الوكالة الرئيسي</span>
                <span className="text-xs text-gray-300 leading-relaxed block">{siteConfig.address}</span>
              </div>
            </div>

          </div>

          {/* Social icons */}
          <div className="p-6 bg-[#12141E] rounded-2xl border border-white/5 space-y-4 text-right">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">حسابات ميديا لاند الرسمية</h3>
            <div className="flex gap-3">
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#FF3E55]/20 hover:text-[#FF3E55] flex items-center justify-center text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 flex items-center justify-center text-white transition-all">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Form Container (Left/RTL) */}
        <div className="lg:col-span-7 bg-[#12141E] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-[#22C55E] flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-white">تم استلام طلب استشارتك بنجاح!</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">شكراً لاهتمامك بميديا لاند. يقوم ممثلونا الاستشاريون حالياً بمراجعة التفاصيل، وسنتصل بك هاتفياً أو عبر الـ WhatsApp خلال دقائق معدودة.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#0055FF] font-bold underline"
              >
                إرسال استفسار آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <h2 className="text-xl font-bold text-white border-r-4 border-[#FF3E55] pr-3">أرسل لنا استفسارك وسنعاود الاتصال بك</h2>
              
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="contact_name" className="text-xs font-bold text-gray-400 block">الاسم الكريم *</label>
                  <input
                    id="contact_name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="مثال: محمد العنزي"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="contact_phone" className="text-xs font-bold text-gray-400 block">رقم هاتف الاتصال / واتساب *</label>
                  <input
                    id="contact_phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="مثال: +965 6511 8963"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors text-right"
                    dir="ltr"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="contact_email" className="text-xs font-bold text-gray-400 block">البريد الإلكتروني (اختياري)</label>
                  <input
                    id="contact_email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="مثال: name@example.com"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors"
                  />
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <label htmlFor="contact_project_type" className="text-xs font-bold text-gray-400 block">مجال أو نوع الخدمة المطلوبة</label>
                  <select
                    id="contact_project_type"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors appearance-none"
                  >
                    <option value="تسويق رقمي وإعلانات">تسويق رقمي وإعلانات ممولة</option>
                    <option value="تصوير فوتوغرافي وفيديو">تصوير فوتوغرافي وفيديو سينمائي</option>
                    <option value="برمجة وتطوير مواقع">برمجة وتطوير مواقع ومتاجر</option>
                    <option value="تصميم هويات ولوجو">تصميم هويات بصرية ولوجو</option>
                    <option value="طباعة وهدايا إعلانية">طباعة ورقية ومواد دعائية</option>
                    <option value="باقة تسويق 360 درجة">باقة تسويق سنوية متكاملة</option>
                  </select>
                </div>

              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="contact_message" className="text-xs font-bold text-gray-400 block">تفاصيل متطلبات مشروعك وأهدافك</label>
                <textarea
                  id="contact_message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="اكتب هنا ما تطمح لتحقيقه، مثل: أريد تصوير منيو مطعم جديد حولي مع إعلانات تيك توك لزيادة التوصيل."
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#0055FF] transition-colors resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#FF3E55] hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري إرسال طلبك الآمن...</span>
                ) : (
                  <>
                    <span>إرسال طلب الاستشارة الآمنة</span>
                    <Send className="w-4 h-4 scale-x-[-1]" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
