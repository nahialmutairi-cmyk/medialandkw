import { MessageCircle, Phone, Sparkles } from 'lucide-react';

const phoneVisible = '65658868';
const phoneHref = 'tel:+96565658868';
const whatsappHref = 'https://wa.me/96565658868?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%AE%D8%AF%D9%85%D8%A9%20%D8%BA%D8%B3%D9%8A%D9%84%20%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA.';

function trackFahad(eventName: string) {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
  };

  win.gtag?.('event', eventName, {
    client: 'fahad-car-wash',
    page_path: '/clients/fahad-car-wash/',
  });
}

export function ClientFahadCarWash() {
  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#071014] text-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-200">
          <Sparkles className="h-4 w-4" />
          <span>غسيل سيارات متنقلة</span>
        </div>

        <h1 className="text-4xl font-black leading-tight sm:text-6xl">
          غسيل سيارات متنقلة
          <span className="mt-3 block text-emerald-300" dir="ltr">Great Clean</span>
        </h1>

        <p className="mt-6 text-xl font-bold leading-9 text-white/78">
          للحجز أو الاستفسار تواصل مباشرة عبر الاتصال أو واتساب.
        </p>

        <a href={phoneHref} onClick={() => trackFahad('fahad_car_wash_phone_click')} className="mt-7 text-5xl font-black tracking-wide text-white" dir="ltr">
          {phoneVisible}
        </a>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href={phoneHref}
            onClick={() => trackFahad('fahad_car_wash_phone_click')}
            className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-lg font-black text-[#071014] transition hover:bg-emerald-50"
          >
            <Phone className="h-6 w-6" />
            <span>اتصل الآن</span>
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackFahad('fahad_car_wash_whatsapp_click')}
            className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#22C55E] px-6 py-4 text-lg font-black text-white transition hover:bg-[#1EAD52]"
          >
            <MessageCircle className="h-6 w-6" />
            <span>واتساب</span>
          </a>
        </div>

        <p className="mt-8 text-sm leading-7 text-white/45">
          الصفحة مختصرة لتسهيل التواصل السريع مع خدمة غسيل السيارات.
        </p>
      </section>
    </main>
  );
}
