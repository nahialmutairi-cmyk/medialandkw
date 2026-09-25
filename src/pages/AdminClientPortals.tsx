import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ExternalLink, Lock, LockOpen, Moon, Pause, Play, RefreshCw, Search, ShieldCheck, ShieldOff, Sun } from 'lucide-react';

type EventType =
  | 'PORTAL_VISIT'
  | 'CAMPAIGN_ENABLED'
  | 'CAMPAIGN_PAUSED'
  | 'ADMIN_CAMPAIGN_ENABLED'
  | 'ADMIN_CAMPAIGN_PAUSED'
  | 'ADMIN_CLIENT_CONTROL_LOCKED'
  | 'ADMIN_CLIENT_CONTROL_UNLOCKED'
  | 'ADMIN_CAMPAIGN_PAUSED_AND_LOCKED';

type ActivityEvent = {
  id: string;
  eventType: EventType;
  actor?: 'ADMIN' | 'CLIENT' | null;
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
  clientPagePath: string | null;
  clientControlEnabled: boolean;
  latestVisitAt: string | null;
  latestActionType: EventType | null;
  latestActionAt: string | null;
  latestActor?: 'ADMIN' | 'CLIENT' | null;
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
    runningCampaigns: number;
    pausedCampaigns: number;
    lockedClients: number;
    activityToday: number;
  };
  clients?: ClientPortalMonitor[];
};

type AdminAction = 'ENABLE' | 'PAUSE' | 'LOCK' | 'UNLOCK' | 'PAUSE_AND_LOCK';

const filters = [
  { value: 'ALL', label: 'الكل' },
  { value: 'RUNNING', label: 'تعمل' },
  { value: 'PAUSED', label: 'متوقفة' },
  { value: 'LOCKED', label: 'تحكم مقفل' },
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
  if (type === 'CAMPAIGN_ENABLED') return 'تشغيل الحملة من العميل';
  if (type === 'CAMPAIGN_PAUSED') return 'إيقاف الحملة من العميل';
  if (type === 'ADMIN_CAMPAIGN_ENABLED') return 'تشغيل الحملة من الإدارة';
  if (type === 'ADMIN_CAMPAIGN_PAUSED') return 'إيقاف الحملة من الإدارة';
  if (type === 'ADMIN_CLIENT_CONTROL_LOCKED') return 'قفل تحكم العميل';
  if (type === 'ADMIN_CLIENT_CONTROL_UNLOCKED') return 'فتح تحكم العميل';
  if (type === 'ADMIN_CAMPAIGN_PAUSED_AND_LOCKED') return 'إيقاف الحملة وقفل التحكم';
  return 'لا يوجد';
}

function deviceLabel(deviceType?: string | null) {
  if (deviceType === 'Mobile') return 'جوال';
  if (deviceType === 'Tablet') return 'تابلت';
  if (deviceType === 'Desktop') return 'كمبيوتر';
  return deviceType || 'غير معروف';
}

function statusText(status: string) {
  if (status === 'ENABLED') return 'تعمل';
  if (status === 'PAUSED') return 'متوقفة';
  return 'غير معروف';
}

function actionCopy(action: AdminAction) {
  if (action === 'ENABLE') return 'تشغيل الحملة';
  if (action === 'PAUSE') return 'إيقاف الحملة';
  if (action === 'LOCK') return 'قفل تحكم العميل';
  if (action === 'UNLOCK') return 'فتح تحكم العميل';
  return 'إيقاف الحملة وقفل تحكم العميل';
}

export function AdminClientPortals() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('ml_admin_portal_key') || '');
  const [data, setData] = useState<MonitorResponse | null>(null);
  const [query, setQuery] = useState('');
  const [selectedClientSlug, setSelectedClientSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('ALL');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ action: AdminAction; client: ClientPortalMonitor } | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ml_admin_theme') === 'dark');
  const theme = darkMode ? 'dark' : 'light';

  useEffect(() => {
    document.title = 'Media Land Ads Control Center';
    const robots = document.querySelector('meta[name="robots"]') ?? document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex,nofollow');
    if (!robots.parentNode) document.head.appendChild(robots);
  }, []);

  useEffect(() => {
    localStorage.setItem('ml_admin_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
        setAuthError(payload.message || 'تعذر الدخول إلى لوحة التحكم.');
        return;
      }
      sessionStorage.setItem('ml_admin_portal_key', nextPassword);
      setPassword(nextPassword);
      setData(payload);
      setSelectedClientSlug((current) => current ?? payload.clients?.[0]?.clientSlug ?? null);
    } catch {
      setAuthError('تعذر الاتصال بلوحة التحكم.');
    } finally {
      setLoading(false);
    }
  }

  async function runAdminAction(action: AdminAction, client: ClientPortalMonitor) {
    setActionLoading(true);
    try {
      const response = await fetch('/.netlify/functions/admin-client-portals', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Admin-Portal-Key': password,
        },
        body: JSON.stringify({ action, clientSlug: client.clientSlug }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setAuthError(payload.message || 'تعذر تنفيذ الإجراء.');
        return;
      }
      setConfirm(null);
      await load(password);
    } catch {
      setAuthError('تعذر تنفيذ الإجراء.');
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    if (password) void load(password);
    const timer = window.setInterval(() => {
      const saved = sessionStorage.getItem('ml_admin_portal_key');
      if (saved) void load(saved);
    }, 120_000);
    return () => window.clearInterval(timer);
  }, []);

  const clients = useMemo(() => {
    const all = data?.clients ?? [];
    const filtered = all.filter((client) => {
      if (filter === 'RUNNING') return client.campaignStatus === 'ENABLED';
      if (filter === 'PAUSED') return client.campaignStatus === 'PAUSED';
      if (filter === 'LOCKED') return !client.clientControlEnabled;
      return true;
    });
    const value = query.trim().toLowerCase();
    if (!value) return filtered;
    return filtered.filter((client) => client.name.toLowerCase().includes(value) || client.clientSlug.toLowerCase().includes(value));
  }, [data, filter, query]);

  const selectedClient = data?.clients?.find((client) => client.clientSlug === selectedClientSlug) ?? clients[0] ?? null;

  if (!data?.ok) {
    return (
      <main className={`flex min-h-screen items-center justify-center px-5 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-950'}`} dir="rtl">
        <form
          className={`w-full max-w-md rounded-2xl border p-6 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void load(String(form.get('password') || ''));
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black">Media Land Ads Control Center</h1>
              <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>لوحة إدارة داخلية خاصة</p>
            </div>
          </div>
          <input
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-600 ${darkMode ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50'}`}
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="كلمة مرور لوحة الإدارة"
            defaultValue={password}
            required
          />
          {authError && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">{authError}</p>}
          <button disabled={loading} className="mt-4 min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white disabled:opacity-50">
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-8 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-950'}`} dir="rtl" data-theme={theme}>
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl bg-slate-950 p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold text-blue-200">Media Land / مراقبة داخلية</p>
              <h1 className="mt-2 text-2xl font-black sm:text-4xl">Media Land Ads Control Center</h1>
              <p className="mt-2 text-sm text-slate-300">إدارة بوابات العملاء، قفل التحكم، وأرشيف النشاط بالثواني.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setDarkMode((current) => !current)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {darkMode ? 'فاتح' : 'داكن'}
              </button>
              <button onClick={() => void load()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Summary label="العملاء" value={data.summary?.clients ?? 0} />
          <Summary label="الحملات التي تعمل" value={data.summary?.runningCampaigns ?? 0} />
          <Summary label="الحملات المتوقفة" value={data.summary?.pausedCampaigns ?? 0} />
          <Summary label="نشاط اليوم" value={data.summary?.activityToday ?? 0} />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <Search className="h-4 w-4 text-blue-600" />
            <input
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
              placeholder="بحث باسم العميل أو المسار..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`min-h-12 rounded-xl border px-4 text-sm font-bold ${filter === item.value ? 'border-blue-600 bg-blue-600 text-white' : darkMode ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-slate-200 bg-white text-slate-600'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {authError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{authError}</p>}

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="grid content-start gap-4 md:grid-cols-2">
            {clients.map((client) => (
              <article key={client.clientSlug} className={`rounded-2xl border p-5 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <button className="block text-right" onClick={() => setSelectedClientSlug(client.clientSlug)}>
                  <h2 className="text-xl font-black">{client.name}</h2>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{client.campaignName}</p>
                </button>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone={client.campaignStatus === 'ENABLED' ? 'green' : client.campaignStatus === 'PAUSED' ? 'red' : 'slate'}>
                    {statusText(client.campaignStatus)}
                  </Badge>
                  <Badge tone={client.clientControlEnabled ? 'blue' : 'amber'}>
                    {client.clientControlEnabled ? 'تحكم العميل مسموح' : 'تحكم العميل مقفل'}
                  </Badge>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <Info label="آخر زيارة" value={formatKuwait(client.latestVisitAt)} />
                  <Info label="آخر إجراء" value={eventLabel(client.latestActionType)} />
                  <Info label="المنفذ" value={client.latestActor === 'ADMIN' ? 'الإدارة' : client.latestActor === 'CLIENT' ? 'العميل' : 'لا يوجد'} />
                  <Info label="وقت آخر إجراء" value={formatKuwait(client.latestActionAt)} />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <ActionButton label="تشغيل" icon={<Play className="h-4 w-4" />} onClick={() => setConfirm({ action: 'ENABLE', client })} />
                  <ActionButton label="إيقاف" icon={<Pause className="h-4 w-4" />} danger onClick={() => setConfirm({ action: 'PAUSE', client })} />
                  <ActionButton label={client.clientControlEnabled ? 'قفل العميل' : 'فتح العميل'} icon={client.clientControlEnabled ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />} onClick={() => setConfirm({ action: client.clientControlEnabled ? 'LOCK' : 'UNLOCK', client })} />
                  <ActionButton label="إيقاف وقفل" icon={<ShieldOff className="h-4 w-4" />} danger onClick={() => setConfirm({ action: 'PAUSE_AND_LOCK', client })} />
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <button onClick={() => setSelectedClientSlug(client.clientSlug)} className={`min-h-12 flex-1 rounded-xl border px-4 py-2 text-sm font-bold ${darkMode ? 'border-blue-900 text-blue-200' : 'border-blue-200 text-blue-700'}`}>
                    عرض النشاط
                  </button>
                  <a
                    href={client.portalPath || '#'}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!client.portalPath}
                    className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${darkMode ? 'border-blue-900 text-blue-200 hover:bg-slate-800' : 'border-blue-200 text-blue-700 hover:bg-blue-50'} ${client.portalPath ? '' : 'pointer-events-none opacity-50'}`}
                    title="فتح بوابة التحكم الخاصة بالعميل"
                  >
                    بوابة العميل <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href={client.clientPagePath || '#'}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!client.clientPagePath}
                    className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm ${darkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} ${client.clientPagePath ? '' : 'pointer-events-none opacity-50'}`}
                    title="فتح صفحة العميل على الموقع"
                  >
                    صفحة العميل <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <aside className={`rounded-2xl border p-5 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{selectedClient ? `سجل ${selectedClient.name}` : 'سجل النشاط'}</h2>
                <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>الأحدث أولاً - توقيت الكويت</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="space-y-4">
              {(selectedClient?.events ?? []).map((event) => (
                <div key={event.id} className={`border-r-2 pr-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <p className={`font-mono text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formatKuwait(event.occurredAt)}</p>
                  <p className="mt-1 text-sm font-bold">{eventLabel(event.eventType)}</p>
                  <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>المنفذ: {event.actor === 'ADMIN' ? 'الإدارة' : 'العميل'}</p>
                  {event.eventType === 'PORTAL_VISIT' && (
                    <div className={`mt-2 grid gap-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <p>نوع الجهاز: <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{deviceLabel(event.deviceType)}</span></p>
                      <p>IP: <span className={`font-mono font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} dir="ltr">{event.ipAddress || 'غير متاح'}</span></p>
                    </div>
                  )}
                </div>
              ))}
              {!(selectedClient?.events ?? []).length && <p className={`rounded-xl border border-dashed p-6 text-center text-sm ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>لا يوجد نشاط محفوظ.</p>}
            </div>
          </aside>
        </section>
      </section>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
          <div className={`w-full max-w-md rounded-2xl border p-6 text-right shadow-2xl ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <h2 className="text-xl font-black">تأكيد {actionCopy(confirm.action)}</h2>
            <p className={`mt-2 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>سيتم تنفيذ الإجراء على حملة {confirm.client.name} من صلاحية الإدارة وتسجيله في الأرشيف الدائم.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button disabled={actionLoading} onClick={() => setConfirm(null)} className="min-h-12 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">إلغاء</button>
              <button disabled={actionLoading} onClick={() => runAdminAction(confirm.action, confirm.client)} className="min-h-12 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white disabled:opacity-50">
                {actionLoading ? 'جاري التنفيذ...' : 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{new Intl.NumberFormat('ar-KW').format(value)}</p>
    </article>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: 'green' | 'red' | 'amber' | 'blue' | 'slate' }) {
  const classes = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
  };
  return <span className={`inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-black ${classes[tone]}`}>{children}</span>;
}

function ActionButton({ label, icon, onClick, danger = false }: { label: string; icon: ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black ${danger ? 'bg-red-600 text-white' : 'bg-slate-950 text-white'}`}>
      {icon}
      {label}
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-left font-bold text-slate-800">{value}</span>
    </div>
  );
}
