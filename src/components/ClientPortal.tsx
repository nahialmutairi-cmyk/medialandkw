import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Phone, Globe, ShieldCheck, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

export function ClientPortal() {
  const { clientId } = useParams<{ clientId: string }>();

  // This can serve as a fully isolated placeholder/template for their dynamic client-pages system
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 sm:px-10 py-16 text-right" dir="rtl">
      <div className="max-w-xl w-full bg-[#12141E] border border-[#0055FF]/10 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl relative">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#0055FF]/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0055FF] to-[#FF3E55] flex items-center justify-center font-bold text-white shadow-lg">
            {clientId?.substring(0, 2).toUpperCase() || 'C'}
          </div>
          <div>
            <span className="text-[10px] text-[#0055FF] uppercase font-bold tracking-widest block">صفحة عميل مستقلة معزولة</span>
            <h1 className="text-lg font-bold text-white">بوابة العميل الرقمية: {clientId}</h1>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            مرحباً بك في نظام بوابات العملاء المخصصة لوكالة ميديا لاند. هذه الصفحة تتبع قنوات تسويقية أو عروض حصرية معزولة تماماً عن الموقع الرئيسي للشركة لخدمة تتبع المبيعات والاتصالات بكفاءة قصوى.
          </p>

          <div className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5 space-y-2.5">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FF3E55]" />
              <span>حالة البوابة ومستوى العزل الأمنية</span>
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              البوابة نشطة ومتكاملة مع نظام التتبع الأساسي. جميع اتصالات ومبيعات هذه الصفحة تذهب مباشرة لحساب العميل المعني دون تداخل.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/96565118963"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3.5 bg-[#22C55E] hover:bg-[#1eb152] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
          >
            <MessageSquare className="w-4 h-4" />
            <span>اتصل بمسؤول حساب البوابة</span>
          </a>

          <Link
            to="/"
            className="flex-1 text-center py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-white/5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تصفح موقع ميديا لاند الرئيسي</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
