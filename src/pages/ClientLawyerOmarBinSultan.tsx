import { ExternalLink, MessageCircle, Phone, Scale } from 'lucide-react';

const clientPath = '/clients/lawyer-omar-bin-sultan/';
const clientName = 'المحامي د. عمر بن سلطان';
const phoneVisible = '58858884';
const phoneHref = 'tel:+96558858884';
const whatsappHref = 'https://wa.me/96558858884';
const bannerHref = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9RoVBXm6p0HFwdSKeKnoIgHWSaRBVLnpIh_9xy1hm316pGeoHmeFRRH5SRVDoO8w9iHf8gv5pXlavJOyOm1iJzfA8IHWYNMIiTN_35GqlG3TIN0Nynsagpu7pZ-jOOYxO9DFTFL6NyeErUizKaPqlgDhWjNux3aU5503JAkrGRP24awBC7xBt8wagm37ShISxEK_iAz7K7kiNzG3XprsXgUtd7-EN1AYD6TcoILhQXzJ5ZQ97c_90HQ';

const bio = 'المحامي د. عمر بن سلطان، ألتزم بتقديم استشارات قانونية دقيقة لحماية مصالحك وضمان حقوقك بكل أمانة ومهنية. خبرتي القانونية في خدمتك لتقديم حلول فعالة وواضحة تمنحك الثقة في كل خطواتك القانونية.';

function trackOmar(eventName: string, ctaLocation: string) {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    gtag?: (command: string, eventName: string, params: Record<string, string>) => void;
  };

  win.gtag?.('event', eventName, {
    client: 'lawyer-omar-bin-sultan',
    page_path: clientPath,
    cta_location: ctaLocation,
  });
}

const links = [
  { label: 'اتصال هاتفي', href: phoneHref, icon: Phone, event: 'phone_click' },
  { label: 'دردشة واتساب', href: whatsappHref, icon: MessageCircle, event: 'whatsapp_click' },
];

export function ClientLawyerOmarBinSultan() {
  return (
    <article dir="rtl" lang="ar" className="min-h-screen overflow-hidden bg-[#070707] px-5 py-8 font-sans text-[#e5e2e1]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,102,255,0.12),transparent_68%)]" />
      <div className="pointer-events-none fixed -right-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/20 blur-[150px]" />
      <div className="pointer-events-none fixed -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[150px]" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <section className="overflow-hidden rounded-[32px] border border-zinc-800 bg-[#1a1a1a]/60 shadow-2xl backdrop-blur-md">
          <div className="relative h-40 overflow-hidden">
            <img src={bannerHref} alt="" className="h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
          </div>

          <div className="-mt-14 px-6 pb-7">
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#111111] bg-[#0f172a] text-blue-200 shadow-xl">
                <Scale className="h-12 w-12" />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-300">
                <Scale className="h-3.5 w-3.5" />
                <span>محامي</span>
              </div>
              <h1 className="mt-4 text-3xl font-black leading-tight text-white">{clientName}</h1>
              <p className="mt-4 text-sm leading-7 text-zinc-300">{bio}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-y border-zinc-800 py-4 text-center">
              <div>
                <p className="text-2xl font-black text-white">0</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">زيارات</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">0</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">نقرات</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={() => trackOmar(`lawyer-omar-bin-sultan_${item.event}`, item.label)}
                    className="group flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-[#111111] px-4 py-3 text-start transition-all hover:border-blue-500/40 hover:bg-[#1a1a1a]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-white">{item.label}</span>
                        {item.label === 'اتصال هاتفي' ? (
                          <span className="block text-xs text-zinc-500" dir="ltr">+965 {phoneVisible}</span>
                        ) : null}
                      </span>
                    </span>
                    <ExternalLink className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-blue-300" />
                  </a>
                );
              })}
            </div>

            <p className="mt-7 border-t border-zinc-900 pt-5 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Powered by Media Land
            </p>
          </div>
        </section>
      </main>
    </article>
  );
}
