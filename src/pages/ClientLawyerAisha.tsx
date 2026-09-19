import { ArrowLeft, Briefcase, FileText, Gavel, Instagram, MapPin, Menu, MessageCircle, Phone, Scale, Shield, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

const gold = '#C5A059';
const navy = '#0A1931';
const phoneVisible = '6666 6354';
const phoneHref = 'tel:+96566666354';
const whatsappHref = 'https://wa.me/96566666354';
const instagramHref = 'https://instagram.com/lawyer_aisha__';
const instagramHandle = '@lawyer_aisha__';

const navItems = [
  { name: 'الرئيسية', href: '#home' },
  { name: 'من نحن', href: '#about' },
  { name: 'خدماتنا', href: '#services' },
  { name: 'تواصل معنا', href: '#contact' },
];

const services = [
  {
    title: 'القضايا المدنية والتجارية',
    description: 'تمثيل العملاء في المنازعات المدنية والتجارية والمطالبات المالية.',
    icon: <Briefcase size={32} color={gold} />,
  },
  {
    title: 'قضايا الأحوال الشخصية',
    description: 'التعامل مع قضايا الأسرة، الطلاق، الحضانة، والنفقة بسرية واحترافية.',
    icon: <Scale size={32} color={gold} />,
  },
  {
    title: 'الاستشارات القانونية',
    description: 'تقديم المشورة القانونية للشركات والأفراد في مختلف المجالات.',
    icon: <Shield size={32} color={gold} />,
  },
  {
    title: 'صياغة العقود',
    description: 'إعداد ومراجعة العقود والاتفاقيات للمساعدة في حماية حقوق الموكلين.',
    icon: <FileText size={32} color={gold} />,
  },
];

function trackAisha(eventName: string, ctaLocation: string) {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
  };

  win.gtag?.('event', eventName, {
    client: 'lawyer-aisha-alawadhi',
    page_path: '/clients/lawyer-aisha-alawadhi/',
    cta_location: ctaLocation,
  });
}

function whatsappWithMessage(message: string) {
  return `${whatsappHref}?text=${encodeURIComponent(message)}`;
}

function PhoneCta({ label = 'اتصل الآن', className = '' }: { label?: string; className?: string }) {
  return (
    <a
      href={phoneHref}
      onClick={() => trackAisha('lawyer-aisha-alawadhi_phone_click', label)}
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#C5A059] px-7 py-4 text-base font-bold text-white transition-colors hover:bg-[#b08d4b] ${className}`}
    >
      <Phone size={22} />
      <span>{label}</span>
    </a>
  );
}

function WhatsappCta({ label = 'واتساب', location = 'cta', className = '' }: { label?: string; location?: string; className?: string }) {
  return (
    <a
      href={whatsappWithMessage('السلام عليكم، أرغب بحجز استشارة قانونية.')}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackAisha('lawyer-aisha-alawadhi_whatsapp_click', location)}
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-md border-2 border-[#C5A059] px-7 py-4 text-base font-bold text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-white ${className}`}
    >
      <MessageCircle size={22} />
      <span>{label}</span>
    </a>
  );
}

export function ClientLawyerAisha() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const service = String(formData.get('service') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const text = `طلب استشارة قانونية من صفحة المحامية عايشة العوضي

الاسم: ${name}
رقم الهاتف: ${phone}
الخدمة المطلوبة: ${service}
الرسالة: ${message}`;

    trackAisha('lawyer-aisha-alawadhi_form_whatsapp_submit', 'contact_form');
    window.open(whatsappWithMessage(text), '_blank');
  }

  return (
    <article dir="rtl" lang="ar" className="bg-gray-50 font-sans text-gray-800 selection:bg-[#C5A059] selection:text-white">
      <nav className="sticky top-0 z-50 bg-[#0A1931]/95 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <a href="#home" className="flex items-center gap-3">
              <Scale size={36} color={gold} />
              <span className="text-right">
                <span className="block text-xl font-bold tracking-wide text-white md:text-2xl">المحامية عايشة العوضي</span>
                <span className="block text-xs text-[#C5A059] md:text-sm">المركز التنفيذي للمحاماة والاستشارات القانونية</span>
              </span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} className="font-medium text-white transition-colors hover:text-[#C5A059]">
                  {item.name}
                </a>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-[#C5A059] px-6 py-2 font-medium text-white transition-colors hover:bg-[#b08d4b]"
              >
                <MessageCircle size={18} />
                <span>استشارة مجانية</span>
              </a>
            </div>

            <button type="button" className="text-white md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="القائمة">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="absolute left-0 top-full w-full border-t border-gray-800 bg-[#0A1931] px-4 py-4 shadow-xl md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} onClick={() => setMenuOpen(false)} className="border-b border-gray-800 pb-2 font-medium text-white hover:text-[#C5A059]">
                  {item.name}
                </a>
              ))}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#C5A059] px-4 py-3 text-center font-medium text-white">
                <MessageCircle size={20} />
                <span>تواصل عبر الواتساب</span>
              </a>
            </div>
          </div>
        ) : null}
      </nav>

      <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-[#0A1931] pt-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1931] via-[#0A1931] to-[#C5A059] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#C5A059]/20 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl">
            <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-[#C5A059] md:text-2xl">
              <span className="h-[2px] w-12 bg-[#C5A059]" />
              المركز التنفيذي للمحاماة والاستشارات القانونية
            </h2>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              المحامية <br />
              <span className="text-[#C5A059]">عايشة العوضي</span>
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              نقدم خدمات قانونية متكاملة باحترافية وموثوقية عالية. نسعى لحماية حقوق الموكلين ومتابعة القضايا والمنازعات وفق الإجراءات القانونية المناسبة.
            </p>
            <div className="flex flex-wrap gap-4">
              <PhoneCta />
              <WhatsappCta location="hero" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section id="about" className="bg-gray-50 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Scale size={24} color={gold} />
              <h2 className="text-xl font-bold text-[#C5A059]">من نحن</h2>
            </div>
            <h3 className="mb-6 text-3xl font-bold text-[#0A1931] md:text-4xl">المركز التنفيذي للمحاماة والاستشارات القانونية</h3>
            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              المحامية عايشة العوضي، يمثل مكتبنا صرحاً قانونياً يهدف إلى تقديم خدمات قانونية واستشارية في دولة الكويت. نحن نؤمن بأن العدالة أساس المجتمع، ونسعى لضمان حصول الموكلين على حقوقهم وفق الأطر القانونية.
            </p>
            <p className="mb-12 text-lg leading-relaxed text-gray-600">
              نتميز بالدقة، السرية التامة، والشفافية في التعامل مع القضايا. يضم فريقنا مستشارين قانونيين ذوي خبرة في فروع القانون الكويتي.
            </p>
            <div className="grid grid-cols-1 gap-6 text-right sm:grid-cols-2">
              <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="rounded-full bg-[#0A1931] p-3 text-[#C5A059]">
                  <Gavel size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0A1931]">حماية حقوقك</h4>
                  <p className="text-sm text-gray-500">متابعة المصالح القانونية باهتمام ووضوح</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="rounded-full bg-[#0A1931] p-3 text-[#C5A059]">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0A1931]">خبرة قانونية</h4>
                  <p className="text-sm text-gray-500">معرفة بالقوانين والإجراءات في الكويت</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-2 text-xl font-bold text-[#C5A059]">مجالات التخصص</h2>
            <h3 className="mb-6 text-3xl font-bold text-[#0A1931] md:text-5xl">خدماتنا القانونية</h3>
            <p className="text-lg text-gray-600">نقدم مجموعة من الخدمات القانونية لتلبية احتياجات الأفراد والشركات بمعايير مهنية واضحة.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <section key={service.title} className="group rounded-xl border border-gray-100 bg-gray-50 p-8 transition-all duration-300 hover:border-[#C5A059] hover:shadow-xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#0A1931] transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h4 className="mb-4 text-xl font-bold text-[#0A1931]">{service.title}</h4>
                <p className="leading-relaxed text-gray-600">{service.description}</p>
                <div className="mt-6 flex items-center gap-2 font-medium text-[#C5A059] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span>اقرأ المزيد</span>
                  <ArrowLeft size={16} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden bg-[#0A1931] py-20 md:py-32">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C5A059] opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#C5A059] opacity-20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-16 lg:flex-row">
            <div className="lg:w-1/2">
              <h2 className="mb-2 text-xl font-bold text-[#C5A059]">تواصل معنا</h2>
              <h3 className="mb-8 text-3xl font-bold text-white md:text-5xl">نحن هنا لمساعدتك</h3>
              <p className="mb-12 text-lg leading-relaxed text-gray-300">لا تتردد في التواصل لحجز استشارة قانونية أو للاستفسار عن الخدمات. فريقنا مستعد للرد على التساؤلات.</p>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                    <MapPin size={28} color={gold} />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-bold text-white">العنوان</h4>
                    <p className="leading-relaxed text-gray-300">
                      ضاحية صباح السالم، قطعة 1، شارع 106
                      <br />
                      مبنى 287، الدور العاشر
                      <br />
                      خلف مستشفى الكويت
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                    <Phone size={28} color={gold} />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-bold text-white">الهاتف والواتساب</h4>
                    <a href={phoneHref} className="block text-lg text-gray-300 transition-colors hover:text-[#C5A059]" dir="ltr">
                      {phoneVisible}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                    <Instagram size={28} color={gold} />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-bold text-white">انستغرام</h4>
                    <a href={instagramHref} target="_blank" rel="noopener noreferrer" className="block text-lg text-gray-300 transition-colors hover:text-[#C5A059]" dir="ltr">
                      {instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="rounded-2xl bg-white p-8 shadow-2xl">
                <h3 className="mb-6 text-2xl font-bold text-[#0A1931]">أرسل لنا رسالة</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="aisha_name" className="mb-2 block text-sm font-medium text-gray-700">الاسم الكامل</label>
                    <input id="aisha_name" name="name" type="text" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#C5A059]" placeholder="أدخل اسمك الكريم" />
                  </div>
                  <div>
                    <label htmlFor="aisha_phone" className="mb-2 block text-sm font-medium text-gray-700">رقم الهاتف</label>
                    <input id="aisha_phone" name="phone" type="tel" required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#C5A059]" placeholder="أدخل رقم هاتفك" />
                  </div>
                  <div>
                    <label htmlFor="aisha_service" className="mb-2 block text-sm font-medium text-gray-700">الخدمة المطلوبة</label>
                    <select id="aisha_service" name="service" required defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#C5A059]">
                      <option value="" disabled>اختر الخدمة القانونية</option>
                      {services.map((service) => (
                        <option key={service.title} value={service.title}>{service.title}</option>
                      ))}
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="aisha_message" className="mb-2 block text-sm font-medium text-gray-700">الرسالة أو الاستفسار</label>
                    <textarea id="aisha_message" name="message" required rows={4} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#C5A059]" placeholder="كيف يمكننا مساعدتك؟" />
                  </div>
                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A1931] py-4 font-bold text-white transition-colors hover:bg-[#112647]">
                    <MessageCircle size={20} />
                    <span>إرسال الطلب عبر الواتساب</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-[#050C18] py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Scale size={24} color={gold} />
              <span className="text-lg font-bold text-white">المحامية عايشة العوضي</span>
            </div>
            <p className="text-center text-sm text-gray-400 md:text-right">© {new Date().getFullYear()} المركز التنفيذي للمحاماة والاستشارات القانونية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </article>
  );
}
