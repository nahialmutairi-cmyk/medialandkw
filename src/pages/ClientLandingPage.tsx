import { Link } from 'react-router-dom';
import { BriefcaseBusiness, CheckCircle2, FileText, MessageSquare, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import type { ClientLanding } from '../clientLandingData';

type CtaLocation = 'hero' | 'sticky' | 'final';

function trackCta(client: ClientLanding, eventName: string, ctaLocation: CtaLocation) {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
  };

  win.gtag?.('event', eventName, {
    client: client.id,
    page_path: `${client.path}/`,
    cta_location: ctaLocation,
  });
}

function PrimaryButton({ client, location, className = '' }: { client: ClientLanding; location: CtaLocation; className?: string }) {
  if (!client.whatsappHref) {
    return (
      <a
        href="#service-details"
        onClick={() => trackCta(client, `${client.id}_details_click`, location)}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#071014] ${className}`}
        style={{ backgroundColor: client.accent, boxShadow: `0 20px 40px ${client.accent}22` }}
      >
        <FileText className="h-5 w-5" />
        <span>{client.primaryCta}</span>
      </a>
    );
  }

  return (
    <a
      href={client.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta(client, `${client.id}_whatsapp_click`, location)}
      aria-label={`${client.primaryCta} - ${client.brand}`}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#071014] ${className}`}
      style={{ backgroundColor: client.accent, boxShadow: `0 20px 40px ${client.accent}22` }}
    >
      <MessageSquare className="h-5 w-5" />
      <span>{client.whatsappLabel ?? client.primaryCta}</span>
    </a>
  );
}

function PhoneButton({ client, location, className = '' }: { client: ClientLanding; location: CtaLocation; className?: string }) {
  if (!client.phoneHref || !client.secondaryCta) return null;

  return (
    <a
      href={client.phoneHref}
      onClick={() => trackCta(client, `${client.id}_phone_click`, location)}
      aria-label={`${client.secondaryCta} - ${client.brand}`}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#071014] ${className}`}
    >
      <Phone className="h-5 w-5" />
      <span>{client.secondaryCta}</span>
    </a>
  );
}

export function ClientLandingPage({ client }: { client: ClientLanding }) {
  return (
    <article className="bg-[#071014] text-white" dir="rtl" lang="ar">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071014]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <a href="#top" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#071014]">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-white/5 font-mono text-xs font-black text-white"
              style={{ borderColor: `${client.accent}66`, color: client.softAccent }}
            >
              {client.iconLabel}
            </span>
            <span className="flex flex-col leading-none text-right">
              <span className="text-base font-black text-white">{client.brand}</span>
              <span className="mt-1 text-[11px] font-bold" style={{ color: client.softAccent }}>{client.label}</span>
            </span>
          </a>
          <PrimaryButton client={client} location="hero" className="min-h-10 px-4 py-2 text-xs sm:min-h-11 sm:px-5" />
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <span id="top" className="absolute top-0" aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${client.accent}24, rgba(14,165,233,0.10) 38%, rgba(255,255,255,0) 70%)` }} />
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full border border-white/10" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-16 pt-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-16">
          <div className="text-right">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold" style={{ color: client.softAccent }}>
              <Sparkles className="h-4 w-4" />
              <span>{client.eyebrow}</span>
            </div>

            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em]" dir="ltr" style={{ color: client.accent }}>
              Media Land Client Page
            </p>

            <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.25] text-white sm:text-5xl lg:text-6xl">
              {client.h1}
            </h1>

            <p className="mt-6 max-w-2xl text-2xl font-bold leading-relaxed text-white">
              {client.heroLead}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              {client.heroText}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrimaryButton client={client} location="hero" className="sm:min-w-48" />
              <PhoneButton client={client} location="hero" className="sm:min-w-40" />
            </div>

            {client.phoneVisible ? (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-lg font-black text-white" dir="ltr">
                <Phone className="h-5 w-5" style={{ color: client.accent }} />
                {client.phoneVisible}
              </p>
            ) : (
              <p className="mt-5 max-w-2xl rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold leading-7 text-white/70">
                بيانات التواصل المباشرة تحتاج اعتماداً قبل استخدام الصفحة كوجهة إعلان نهائية.
              </p>
            )}
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#0B1720] p-6">
                <div className="absolute inset-x-6 top-8 h-1 rounded-full" style={{ background: `linear-gradient(270deg, ${client.accent}, #38BDF8, rgba(255,255,255,0.18))` }} />
                <div className="mt-10 rounded-[1.25rem] border border-white/10 bg-black/20 p-6">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border bg-white/5" style={{ borderColor: `${client.accent}66` }}>
                    <BriefcaseBusiness className="h-12 w-12" style={{ color: client.softAccent }} />
                  </div>
                  <div className="space-y-4 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.24em]" dir="ltr" style={{ color: client.accent }}>
                      {client.serviceType}
                    </p>
                    <p className="font-display text-3xl font-black text-white">
                      {client.brand}
                    </p>
                    <p className="text-sm leading-7 text-white/70">
                      صفحة مخصصة لحملة Google Ads.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold">
                  {client.tiles.map((tile) => (
                    <div key={tile} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">{tile}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:py-20">
        <p className="text-sm font-black" style={{ color: client.accent }}>طريقة العمل</p>
        <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">كيف تبدأ الخدمة؟</h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {client.steps.map((step, index) => (
            <section key={step.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8" style={{ color: client.softAccent }}>
                  <MessageSquare className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm font-black text-white/35">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="text-xl font-black text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/68">{step.text}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-black" style={{ color: client.softAccent }}>نطاق الخدمة</p>
            <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">{client.scopeTitle}</h2>
            <p className="mt-5 text-base leading-8 text-white/70">{client.scopeText}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {client.benefits.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#071014] p-4 text-sm font-bold text-white/84">
                <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: client.accent }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="service-details" className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8" style={{ color: client.softAccent }}>
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="font-display text-3xl font-black text-white">{client.serviceTitle}</h2>
          <p className="mt-4 text-base leading-8 text-white/70">{client.serviceText}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {client.tiles.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <CheckCircle2 className="mb-4 h-5 w-5" style={{ color: client.accent }} />
              <p className="text-sm font-bold leading-7 text-white/78">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:py-20">
          <p className="text-sm font-black" style={{ color: client.softAccent }}>أسئلة شائعة</p>
          <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">معلومات سريعة قبل التواصل</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {client.faq.map((faq) => (
              <section key={faq.q} className="rounded-3xl border border-white/10 bg-[#071014] p-6">
                <h3 className="text-lg font-black text-white">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">{faq.a}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 pb-28 sm:px-10 lg:py-20 lg:pb-20">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0B1720] to-[#071014] p-7 text-center shadow-2xl shadow-black/20 lg:p-12">
          <p className="font-display text-3xl font-black text-white sm:text-4xl">{client.finalTitle}</p>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-8 text-white/76">{client.finalText}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton client={client} location="final" />
            <PhoneButton client={client} location="final" />
          </div>
          <p className="mt-8 text-xs leading-6 text-white/45">
            تصميم وإدارة الحملات الرقمية بواسطة{' '}
            <Link to="/about/" className="font-bold underline-offset-4 hover:underline" style={{ color: client.softAccent }}>
              ميديا لاند للدعاية والإعلان
            </Link>
          </p>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#071014]/96 p-3 shadow-2xl shadow-black/40 backdrop-blur md:hidden">
        <div className="grid grid-cols-[1fr_0.9fr] gap-3 pl-16">
          <PrimaryButton client={client} location="sticky" className="min-h-11 px-3 py-2 text-xs" />
          <PhoneButton client={client} location="sticky" className="min-h-11 px-3 py-2 text-xs" />
        </div>
      </div>
    </article>
  );
}
