import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, AlertTriangle, BarChart3, CheckCircle2, Lock, Pause, Play, ShieldCheck } from 'lucide-react';
import { getClientPortalConfig } from '../clientPortalConfig';

type PortalStatus = 'ENABLED' | 'PAUSED' | 'REMOVED' | 'UNKNOWN';

type PortalMetrics = {
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  conversions: number | null;
  conversionRate: number | null;
};

type PortalResponse = {
  ok: boolean;
  clientName?: string;
  campaignName?: string;
  status?: PortalStatus;
  dateRange?: string;
  metrics?: PortalMetrics;
  lookerEmbedUrl?: string;
  message?: string;
  connected?: boolean;
  clientControlEnabled?: boolean;
  controlUpdatedAt?: string | null;
};

const rangeOptions = [
  { value: 'TODAY', label: 'اليوم' },
  { value: 'LAST_7_DAYS', label: 'آخر 7 أيام' },
  { value: 'LAST_30_DAYS', label: 'آخر 30 يوماً' },
  { value: 'THIS_MONTH', label: 'هذا الشهر' },
  { value: 'LAST_MONTH', label: 'الشهر السابق' },
  { value: 'CUSTOM_DATE', label: 'فترة مخصصة' },
];

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return 'غير متاح';
  return new Intl.NumberFormat('ar-KW').format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) return 'غير متاح';
  return `${new Intl.NumberFormat('ar-KW', { maximumFractionDigits: 2 }).format(value)}%`;
}

function statusCopy(status?: PortalStatus) {
  if (status === 'ENABLED') return { label: 'الحملة الإعلانية تعمل الآن', className: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200', icon: CheckCircle2 };
  if (status === 'PAUSED') return { label: 'الحملة الإعلانية متوقفة حالياً', className: 'border-red-400/25 bg-red-400/10 text-red-200', icon: AlertTriangle };
  return { label: 'حالة الحملة غير متاحة حالياً', className: 'border-amber-400/25 bg-amber-400/10 text-amber-100', icon: AlertTriangle };
}

export function GoogleAdsClientPortal() {
  const { clientSlug, token } = useParams<{ clientSlug: string; token: string }>();
  const config = getClientPortalConfig(clientSlug);
  const [range, setRange] = useState('LAST_7_DAYS');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [data, setData] = useState<PortalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'ENABLE' | 'PAUSE' | null>(null);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({ range });
    if (range === 'CUSTOM_DATE') {
      if (customStartDate) params.set('startDate', customStartDate);
      if (customEndDate) params.set('endDate', customEndDate);
    }
    return `/.netlify/functions/google-ads-client-portal/${clientSlug}/${token}?${params.toString()}`;
  }, [clientSlug, token, range, customStartDate, customEndDate]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotice(null);

    fetch(apiUrl, { headers: { Accept: 'application/json' } })
      .then((response) => response.json())
      .then((response: PortalResponse) => {
        if (active) setData(response);
      })
      .catch(() => {
        if (active) setData({ ok: false, message: 'تعذر الاتصال بخدمة بيانات الحملة.', connected: false });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiUrl]);

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]') ?? document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex,nofollow');
    if (!robots.parentNode) document.head.appendChild(robots);

    document.title = `${config?.name ?? 'بوابة العميل'} | بوابة Google Ads | Media Land`;

    const description = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'بوابة خاصة غير مفهرسة لعرض مؤشرات حملة Google Ads والتحكم بالحملة للعميل المخول فقط.');
    if (!description.parentNode) document.head.appendChild(description);
  }, []);

  const effectiveName = data?.clientName ?? config?.name ?? 'بوابة العميل';
  const campaignName = data?.campaignName ?? config?.campaignLabel ?? effectiveName;
  const currentStatus = statusCopy(data?.status);
  const StatusIcon = currentStatus.icon;
  const nextAction = data?.status === 'ENABLED' ? 'PAUSE' : data?.status === 'PAUSED' ? 'ENABLE' : null;
  const actionLabel = nextAction === 'PAUSE' ? 'إيقاف الحملة' : 'تشغيل الحملة';
  const lookerUrl = data?.lookerEmbedUrl ?? config?.lookerEmbedUrl;
  const clientControlEnabled = data?.clientControlEnabled !== false;
  const lockMessage = 'تم تعليق التحكم بالحملة من قبل إدارة Media Land. يرجى التواصل مع الإدارة لإجراء أي تغيير.';

  async function runAction(action: 'ENABLE' | 'PAUSE') {
    setActionLoading(true);
    setNotice('جارٍ تنفيذ الطلب...');
    setConfirmAction(null);

    try {
      const response = await fetch(`/.netlify/functions/google-ads-client-portal/${clientSlug}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      setData(result);
      setNotice(result.ok ? (action === 'PAUSE' ? 'تم إيقاف الحملة بنجاح' : 'تم تشغيل الحملة بنجاح') : result.message ?? 'تعذر تنفيذ الطلب.');
    } catch {
      setNotice('تعذر تنفيذ الطلب.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080910] text-white" dir="rtl">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0055FF] to-[#FF3E55] text-xl font-black">M</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7da8ff]">Media Land</p>
              <p className="text-sm text-white/55">إدارة الحملات الإعلانية</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
            <Lock className="h-4 w-4 text-emerald-300" />
            <span>بوابة خاصة غير مفهرسة</span>
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-[#7da8ff]">لوحة الحملة الإعلانية</p>
              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">{effectiveName}</h1>
              <p className="mt-3 text-sm text-white/55">{campaignName}</p>
            </div>

            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${currentStatus.className}`}>
              <StatusIcon className="h-4 w-4" />
              <span>{loading ? 'جارٍ قراءة حالة الحملة...' : currentStatus.label}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Kpi label="مرات الظهور" value={formatNumber(data?.metrics?.impressions)} />
              <Kpi label="النقرات" value={formatNumber(data?.metrics?.clicks)} />
              <Kpi label="CTR" value={formatPercent(data?.metrics?.ctr)} />
              <Kpi label="التحويلات" value={formatNumber(data?.metrics?.conversions)} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12141E] p-4">
              <label htmlFor="date-range" className="text-xs font-bold text-white/55">الفترة الزمنية</label>
              <select
                id="date-range"
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080910] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#7da8ff]"
              >
                {rangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {range === 'CUSTOM_DATE' && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2" dir="ltr">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(event) => setCustomStartDate(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#080910] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#7da8ff]"
                    aria-label="Custom start date"
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(event) => setCustomEndDate(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#080910] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#7da8ff]"
                    aria-label="Custom end date"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12141E] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black">التحكم بالحملة</p>
                  <p className="mt-1 text-xs text-white/50">يتم التنفيذ من الخادم بعد التحقق من رابط العميل.</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
              </div>
              {!clientControlEnabled && (
                <div className="mb-3 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-xs font-bold leading-6 text-amber-100">
                  🔒 {lockMessage}
                </div>
              )}
              <button
                disabled={!nextAction || actionLoading || loading || !data?.connected || !clientControlEnabled}
                onClick={() => nextAction && setConfirmAction(nextAction)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-4 text-sm font-black text-[#080910] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/25 disabled:text-white/45"
              >
                {nextAction === 'PAUSE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{!clientControlEnabled ? 'التحكم معلق من الإدارة' : data?.connected ? actionLabel : 'Google Ads غير متصل'}</span>
              </button>
              {notice && <p className="mt-3 rounded-xl bg-white/[0.04] px-4 py-3 text-xs text-white/65">{notice}</p>}
              {!data?.connected && !loading && (
                <p className="mt-3 text-xs leading-6 text-amber-100/80">
                  يلزم تفعيل متغيرات Google Ads API في الخادم حتى تظهر البيانات الحية ويعمل زر التشغيل والإيقاف.
                </p>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#12141E] p-4">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#7da8ff]" />
                <h2 className="text-sm font-black">التقرير المرئي</h2>
              </div>
              {lookerUrl ? (
                <iframe
                  title="Google Ads report"
                  src={lookerUrl}
                  className="h-[520px] w-full rounded-xl border-0 bg-[#080910]"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#080910] p-8 text-center">
                  <Activity className="h-10 w-10 text-white/35" />
                  <p className="mt-4 text-sm font-bold">Looker Studio غير متصل حالياً</p>
                  <p className="mt-2 text-xs leading-6 text-white/45">سيظهر التقرير هنا بعد ربط تقرير خاص بهذه الحملة فقط.</p>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-6 text-white/55">
              لا تعرض هذه البوابة أي بيانات مالية تفصيلية. الوصول مخصص للحملة المرتبطة بهذا الرابط فقط.
            </div>
          </aside>
        </section>

        <footer className="border-t border-white/10 py-5 text-center text-xs text-white/45">
          إدارة الحملات الإعلانية - Media Land للدعاية والإعلان
        </footer>
      </main>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12141E] p-6 text-right shadow-2xl">
            <h2 className="text-xl font-black">{confirmAction === 'PAUSE' ? 'هل أنت متأكد من إيقاف حملتك الإعلانية؟' : 'هل تريد تشغيل حملتك الإعلانية الآن؟'}</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmAction(null)} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/70">إلغاء</button>
              <button onClick={() => runAction(confirmAction)} className="rounded-xl bg-white px-4 py-3 text-sm font-black text-[#080910]">
                {confirmAction === 'PAUSE' ? 'نعم، إيقاف الحملة' : 'نعم، تشغيل الحملة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141E] p-4">
      <p className="text-xs text-white/45">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
