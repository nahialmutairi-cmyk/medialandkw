import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Lock, RefreshCw, Search, ShieldCheck } from 'lucide-react';

type EventType = 'PORTAL_VISIT' | 'CAMPAIGN_ENABLED' | 'CAMPAIGN_PAUSED';

type ActivityEvent = {
  id: string;
  eventType: EventType;
  occurredAt: string;
  occurredAtKuwait: string;
  ipAddress?: string | null;
  deviceType?: string | null;
};

type ClientPortalMonitor = {
  clientSlug: string;
  name: string;
  campaignName: string;
  campaignStatus: string;
  connected: boolean;
  portalPath: string | null;
  latestVisitAt: string | null;
  latestActionType: EventType | null;
  latestActionAt: string | null;
  latestActivityAt: string | null;
  events: ActivityEvent[];
};

type MonitorResponse = {
  ok: boolean;
  message?: string;
  summary?: {
    clients: number;
    visitsToday: number;
    enabledToday: number;
    pausedToday: number;
  };
  clients?: ClientPortalMonitor[];
};

const filters = [
  { value: 'ALL', label: 'الكل' },
  { value: 'PORTAL_VISIT', label: 'الزيارات' },
  { value: 'CAMPAIGN_ENABLED', label: 'تشغيل' },
  { value: 'CAMPAIGN_PAUSED', label: 'إيقاف' },
] as const;

function formatKuwait(value?: string | null) {
  if (!value) return 'لا يوجد';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuwait',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

function eventLabel(type?: string | null) {
  if (type === 'PORTAL_VISIT') return 'زيارة صفحة العميل';
  if (type === 'CAMPAIGN_ENABLED') return 'تشغيل الحملة';
  if (type === 'CAMPAIGN_PAUSED') return 'إيقاف الحملة';
  return 'لا يوجد';
}

function eventIcon(type?: string | null) {
  if (type === 'PORTAL_VISIT') return '👁';
  if (type === 'CAMPAIGN_ENABLED') return '🟢';
  if (type === 'CAMPAIGN_PAUSED') return '🔴';
  return '';
}

function deviceLabel(deviceType?: string | null) {
  if (deviceType === 'Mobile') return 'جوال';
  if (deviceType === 'Tablet') return 'تابلت';
  if (deviceType === 'Desktop') return 'كمبيوتر';
  return deviceType || 'غير معروف';
}

function statusText(status: string) {
  if (status === 'ENABLED') return '🟢 تعمل';
  if (status === 'PAUSED') return '🔴 متوقفة';
  return 'غير معروف';
}

export function AdminClientPortals() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('ml_admin_portal_key') || '');
  const [data, setData] = useState<MonitorResponse | null>(null);
  const [query, setQuery] = useState('');
  const [selectedClientSlug, setSelectedClientSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('ALL');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'بوابات عملاء Google Ads | Media Land';
    const robots = document.querySelector('meta[name="robots"]') ?? document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex,nofollow');
    if (!robots.parentNode) document.head.appendChild(robots);
  }, []);

  async function load(nextPassword = password) {
    if (!nextPassword) return;
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch('/.netlify/functions/admin-client-portals', {
        headers: { Accept: 'application/json', 'X-Admin-Portal-Key': nextPassword },
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setData(null);
        setAuthError(payload.message || 'تعذر الدخول إلى لوحة المراقبة.');
        return;
      }
      sessionStorage.setItem('ml_admin_portal_key', nextPassword);
      setPassword(nextPassword);
      setData(payload);
      setSelectedClientSlug((current) => current ?? payload.clients?.[0]?.clientSlug ?? null);
    } catch {
      setAuthError('تعذر الاتصال بلوحة المراقبة.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (password) void load(password);
    const timer = window.setInterval(() => {
      if (sessionStorage.getItem('ml_admin_portal_key')) void load(sessionStorage.getItem('ml_admin_portal_key') || '');
    }, 20_000);
    return () => window.clearInterval(timer);
  }, []);

  const clients = useMemo(() => {
    const all = data?.clients ?? [];
    const value = query.trim().toLowerCase();
    if (!value) return all;
    return all.filter((client) => client.name.toLowerCase().includes(value) || client.clientSlug.toLowerCase().includes(value));
  }, [data, query]);

  const selectedClient = data?.clients?.find((client) => client.clientSlug === selectedClientSlug) ?? clients[0] ?? null;
  const events = (selectedClient?.events ?? []).filter((event) => filter === 'ALL' || event.eventType === filter);

  if (!data?.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080910] px-5 text-white" dir="rtl">
        <form
          className="w-full max-w-md rounded-3xl border border-white/10 bg-[#12141E] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void load(String(form.get('password') || ''));
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0055FF]/15 text-[#7da8ff]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black">بوابات عملاء Google Ads</h1>
              <p className="mt-1 text-xs text-white/55">لوحة مراقبة داخلية خاصة</p>
            </div>
          </div>
          <input
            className="w-full rounded-2xl border border-white/10 bg-[#080910] px-4 py-3 text-sm outline-none focus:border-[#7da8ff]"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="كلمة مرور لوحة الإدارة"
            defaultValue={password}
            required
          />
          {authError && <p className="mt-3 rounded-xl bg-red-400/10 px-4 py-3 text-xs text-red-100">{authError}</p>}
          <button disabled={loading} className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#080910] disabled:opacity-50">
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080910] px-4 py-6 text-white sm:px-8" dir="rtl">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#7da8ff]">Media Land / مراقبة داخلية</p>
            <h1 className="mt-2 text-3xl font-black">بوابات عملاء Google Ads</h1>
          </div>
          <button onClick={() => void load()} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-white/75 hover:bg-white/5">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Summary label="العملاء" value={data.summary?.clients ?? 0} />
          <Summary label="زيارات اليوم" value={data.summary?.visitsToday ?? 0} />
          <Summary label="تشغيل اليوم" value={data.summary?.enabledToday ?? 0} />
          <Summary label="إيقاف اليوم" value={data.summary?.pausedToday ?? 0} />
        </div>

        <label className="mt-5 flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
          <Search className="h-4 w-4 text-[#7da8ff]" />
          <input
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-white/35"
            placeholder="بحث عن عميل..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="grid content-start gap-4 md:grid-cols-2">
            {clients.map((client) => (
              <article key={client.clientSlug} className="rounded-3xl border border-white/10 bg-[#12141E] p-5">
                <button className="block text-right" onClick={() => setSelectedClientSlug(client.clientSlug)}>
                  <h2 className="text-xl font-black">{client.name}</h2>
                  <p className="mt-1 text-xs text-white/45">{client.campaignName}</p>
                </button>
                <div className="mt-4 space-y-3 text-sm">
                  <Info label="حالة الحملة" value={statusText(client.campaignStatus)} />
                  <Info label="آخر زيارة" value={formatKuwait(client.latestVisitAt)} />
                  <Info label="آخر إجراء" value={`${eventIcon(client.latestActionType)} ${eventLabel(client.latestActionType)}`.trim()} />
                  <Info label="وقت آخر إجراء" value={formatKuwait(client.latestActionAt)} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => setSelectedClientSlug(client.clientSlug)} className="rounded-2xl border border-[#7da8ff]/35 px-4 py-2 text-sm font-bold text-[#b9cdfd] hover:bg-[#0055FF]/10">
                    عرض النشاط
                  </button>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/45" title="الرابط الكامل يحتوي token آمن غير معروض في لوحة الإدارة">
                    زيارة صفحة العميل <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-[#12141E] p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{selectedClient ? `سجل نشاط ${selectedClient.name}` : 'سجل النشاط'}</h2>
                <p className="mt-1 text-xs text-white/45">الأحدث أولاً - توقيت الكويت</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-bold ${filter === item.value ? 'border-[#7da8ff] bg-[#0055FF]/15 text-white' : 'border-white/10 text-white/55 hover:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border-b border-white/10 pb-4 last:border-0">
                  <p className="font-mono text-sm text-white/70">{formatKuwait(event.occurredAt)}</p>
                  <p className="mt-1 text-sm font-bold">{eventIcon(event.eventType)} {eventLabel(event.eventType)}</p>
                  {event.eventType === 'PORTAL_VISIT' && (
                    <div className="mt-2 grid gap-1 text-xs text-white/45">
                      <p>نوع الجهاز: <span className="text-white/70">{deviceLabel(event.deviceType)}</span></p>
                      <p>IP: <span className="font-mono text-white/70" dir="ltr">{event.ipAddress || 'غير متاح'}</span></p>
                    </div>
                  )}
                </div>
              ))}
              {!events.length && <p className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-white/45">لا يوجد نشاط محفوظ لهذا الفلتر.</p>}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#12141E] p-5">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-black">{new Intl.NumberFormat('ar-KW').format(value)}</p>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-white/45">{label}</span>
      <span className="text-left font-bold text-white/85">{value}</span>
    </div>
  );
}
