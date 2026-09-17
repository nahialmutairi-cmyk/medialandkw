import { Link } from 'react-router-dom';
import { CalendarCheck, Car, CheckCircle2, MapPin, MessageSquare, Phone, ShieldCheck, Sparkles } from 'lucide-react';

const clientPath = '/clients/360autowash/';
const phoneVisible = '67794155';
const phoneHref = 'tel:+96567794155';
const whatsappMessage = encodeURIComponent('السلام عليكم، أرغب بحجز خدمة غسيل سيارة من 360 Auto Wash.');
const whatsappHref = `https://wa.me/96567794155?text=${whatsappMessage}`;

type CtaLocation = 'hero' | 'sticky' | 'final';

function trackCta(eventName: '360_whatsapp_click' | '360_phone_click', ctaLocation: CtaLocation) {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
  };

  win.gtag?.('event', eventName, {
    client: '360autowash',
    page_path: clientPath,
    cta_location: ctaLocation,
  });
}

function WhatsAppButton({ location, className = '' }: { location: CtaLocation; className?: string }) {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta('360_whatsapp_click', location)}
      aria-label="احجز غسيل سيارة عبر واتساب 360 Auto Wash"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#22C55E] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#22C55E]/20 transition hover:bg-[#1EA34F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFFD2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071014] ${className}`}
    >
      <MessageSquare className="h-5 w-5" />
      <span>احجز عبر واتساب</span>
    </a>
  );
}

function PhoneButton({ location, className = '' }: { location: CtaLocation; className?: string }) {
  return (
    <a
      href={phoneHref}
      onClick={() => trackCta('360_phone_click', location)}
      aria-label="اتصل الآن على 67794155"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#071014] ${className}`}
    >
      <Phone className="h-5 w-5" />
      <span>اتصل الآن</span>
    </a>
  );
}

const howItWorks = [
  {
    title: 'تواصل معنا',
    text: 'اتصل أو أرسل رسالة واتساب للحجز أو الاستفسار.',
    icon: MessageSquare,
  },
  {
    title: 'حدد موقعك',
    text: 'البيت، الدوام أو الموقع المناسب لك ضمن نطاق التغطية.',
    icon: MapPin,
  },
  {
    title: 'نصل إليك',
    text: 'يصل فريق 360 Auto Wash إلى الموقع لتنفيذ خدمة غسيل السيارة.',
    icon: CalendarCheck,
  },
];

const benefits = [
  'الخدمة تصل إلى موقعك.',
  'مناسبة للبيت أو الدوام.',
  'لا تحتاج للذهاب إلى مغسلة ثابتة.',
  'الحجز والاستفسار مباشرة عبر الهاتف أو WhatsApp.',
];

const faqs = [
  {
    q: 'هل 360 Auto Wash مغسلة متنقلة؟',
    a: 'نعم، الخدمة متنقلة وتصل إلى موقع العميل ضمن نطاق التغطية المتاح.',
  },
  {
    q: 'هل يمكن طلب الغسيل عند البيت؟',
    a: 'نعم، يمكن طلب الخدمة عند البيت حسب الموقع ونطاق التغطية.',
  },
  {
    q: 'هل يمكن طلب الخدمة عند الدوام؟',
    a: 'نعم، يمكن التنسيق لخدمة السيارة عند الدوام أو الموقع المناسب للعميل ضمن نطاق التغطية.',
  },
  {
    q: 'كيف أحجز؟',
    a: 'يمكن الحجز والاستفسار مباشرة عبر WhatsApp أو الاتصال على 67794155.',
  },
  {
    q: 'ما أسعار غسيل السيارات؟',
    a: 'للحصول على تفاصيل الخدمة والأسعار الحالية، تواصل مباشرة مع 360 Auto Wash عبر WhatsApp أو الهاتف.',
  },
];

export function Client360AutoWash() {
  return (
    <article className="bg-[#071014] text-white" dir="rtl" lang="ar">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,197,94,0.16),rgba(14,165,233,0.12)_38%,rgba(255,255,255,0)_70%)]" />
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full border border-[#22C55E]/20" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full border border-[#38BDF8]/15" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-16 pt-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-16">
          <div className="text-right">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-[#BFFFD2]">
              <Sparkles className="h-4 w-4" />
              <span>خدمة غسيل سيارات متنقلة في الكويت</span>
            </div>

            <div className="mb-7">
              <p className="text-4xl font-black leading-none tracking-normal text-white sm:text-5xl" dir="ltr">
                360
              </p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.28em] text-[#22C55E]" dir="ltr">
                Auto Wash
              </p>
            </div>

            <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.25] text-white sm:text-5xl lg:text-6xl">
              غسيل سيارات متنقل في الكويت – 360 Auto Wash
            </h1>

            <p className="mt-6 max-w-2xl text-2xl font-bold leading-relaxed text-white">
              غسيل سيارتك وين ما كنت.
              <br />
              في البيت، الدوام أو الموقع اللي يناسبك.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              360 Auto Wash يوفر لك خدمة غسيل سيارات متنقلة تصل إلى موقعك، بدون الحاجة للذهاب إلى المغسلة.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppButton location="hero" className="sm:min-w-48" />
              <PhoneButton location="hero" className="sm:min-w-40" />
            </div>

            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-lg font-black text-white" dir="ltr">
              <Phone className="h-5 w-5 text-[#22C55E]" />
              {phoneVisible}
            </p>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#0B1720] p-6">
                <div className="absolute inset-x-6 top-8 h-1 rounded-full bg-gradient-to-l from-[#22C55E] via-[#38BDF8] to-white/20" />
                <div className="mt-10 rounded-[1.25rem] border border-white/10 bg-black/20 p-6">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10">
                    <Car className="h-12 w-12 text-[#BFFFD2]" />
                  </div>
                  <div className="space-y-4 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#38BDF8]" dir="ltr">
                      Mobile Car Wash
                    </p>
                    <p className="font-display text-3xl font-black text-white" dir="ltr">
                      360 AUTO WASH
                    </p>
                    <p className="text-sm leading-7 text-white/70">
                      خدمة متنقلة في الكويت حسب نطاق التغطية المتاح.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">عند البيت</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">عند الدوام</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">مواقف الشركات</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">حسب التغطية</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-black text-[#22C55E]">طريقة الحجز</p>
            <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">كيف تعمل الخدمة؟</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => {
            const Icon = step.icon;
            return (
              <section key={step.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22C55E]/12 text-[#BFFFD2]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm font-black text-white/35">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-xl font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">{step.text}</p>
              </section>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-black text-[#38BDF8]">نطاق الخدمة</p>
            <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">نجيك وين ما كنت</h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              بدل ما تضيع وقتك بالذهاب إلى المغسلة، 360 Auto Wash يوفر لك خدمة غسيل السيارة في الموقع الذي يناسبك.
            </p>
            <p className="mt-4 rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/8 p-4 text-sm font-bold leading-7 text-[#DDFEE8]">
              خدمة متنقلة في الكويت حسب نطاق التغطية المتاح.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {['في البيت', 'في الدوام', 'في مواقف الشركات والمكاتب', 'أو الموقع المناسب لك ضمن نطاق التغطية'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#071014] p-4 text-sm font-bold text-white/84">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#22C55E]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#38BDF8]/12 text-[#BAE6FD]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="font-display text-3xl font-black text-white">غسيل السيارة صار أسهل</h2>
          <p className="mt-4 text-base leading-8 text-white/70">
            صفحة 360 Auto Wash تركز على خدمة واحدة واضحة: غسيل السيارات المتنقل في موقع العميل، مع حجز مباشر عبر واتساب أو الاتصال.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {benefits.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <CheckCircle2 className="mb-4 h-5 w-5 text-[#22C55E]" />
              <p className="text-sm font-bold leading-7 text-white/78">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 sm:px-10 lg:pb-20">
        <div className="rounded-3xl border border-white/10 bg-[#0B1720] p-7 lg:p-10">
          <p className="text-sm font-black text-[#22C55E]">الخدمة الأساسية</p>
          <h2 className="mt-2 font-display text-3xl font-black text-white">غسيل سيارات متنقل</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
            الخدمة الأساسية المتاحة هي غسيل السيارات المتنقل في موقع العميل. ولمعرفة تفاصيل الخدمة المتاحة لسيارتك، تواصل مع 360 Auto Wash مباشرة.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton location="final" />
            <PhoneButton location="final" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:py-20">
          <p className="text-sm font-black text-[#38BDF8]">أسئلة شائعة</p>
          <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">معلومات سريعة قبل الحجز</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <section key={faq.q} className="rounded-3xl border border-white/10 bg-[#071014] p-6">
                <h3 className="text-lg font-black text-white">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">{faq.a}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 pb-28 sm:px-10 lg:py-20 lg:pb-20">
        <div className="overflow-hidden rounded-[2rem] border border-[#22C55E]/20 bg-gradient-to-br from-[#0B1720] to-[#071014] p-7 text-center shadow-2xl shadow-black/20 lg:p-12">
          <p className="font-display text-3xl font-black text-white sm:text-4xl">سيارتك تحتاج غسيل؟</p>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-8 text-white/76">
            360 Auto Wash يجيك إلى موقعك.
          </p>
          <p className="mt-3 text-sm leading-7 text-white/58">احجز أو استفسر الآن:</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton location="final" />
            <PhoneButton location="final" />
          </div>
          <p className="mt-8 text-xs leading-6 text-white/45">
            تصميم وإدارة الحملات الرقمية بواسطة{' '}
            <Link to="/about/" className="font-bold text-[#BFFFD2] underline-offset-4 hover:underline">
              ميديا لاند للدعاية والإعلان
            </Link>
          </p>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#071014]/96 p-3 shadow-2xl shadow-black/40 backdrop-blur md:hidden">
        <div className="grid grid-cols-[1fr_0.9fr] gap-3 pl-16">
          <WhatsAppButton location="sticky" className="min-h-11 px-3 py-2 text-xs" />
          <PhoneButton location="sticky" className="min-h-11 px-3 py-2 text-xs" />
        </div>
      </div>
    </article>
  );
}
