import { Link, useLocation } from 'react-router-dom';
import { FileText, Lock, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

const updated = 'July 30, 2026';

export function LegalPages() {
  const { pathname } = useLocation();
  const activeTab = pathname === '/cookie-policy' ? 'cookie' : pathname.includes('terms') ? 'terms' : 'privacy';

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 text-left sm:px-10" dir="ltr">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0055FF]">Media Land</p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">{activeTab === 'privacy' ? 'Privacy Policy' : activeTab === 'terms' ? 'Terms of Service' : 'Cookie Policy'}</h1>
        <p className="text-sm text-[#F0F4FF]/60">Last updated: {updated}</p>
      </header>

      <nav aria-label="Legal pages" className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-white/5 bg-[#12141E] p-2">
        <LegalLink to="/privacy-policy/" active={activeTab === 'privacy'} icon={<Lock className="h-4 w-4" />}>Privacy Policy</LegalLink>
        <LegalLink to="/terms-of-service/" active={activeTab === 'terms'} icon={<FileText className="h-4 w-4" />}>Terms of Service</LegalLink>
        <LegalLink to="/cookie-policy/" active={activeTab === 'cookie'} icon={<ShieldCheck className="h-4 w-4" />}>Cookie Policy</LegalLink>
      </nav>

      <article className="mt-8 space-y-8 rounded-3xl border border-white/5 bg-[#12141E] p-8 text-sm leading-7 text-[#F0F4FF]/80 shadow-2xl">
        {activeTab === 'privacy' && <PrivacyContent />}
        {activeTab === 'terms' && <TermsContent />}
        {activeTab === 'cookie' && <CookieContent />}
      </article>
    </div>
  );
}

function LegalLink({ to, active, icon, children }: { to: string; active: boolean; icon: ReactNode; children: ReactNode }) {
  return <Link to={to} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${active ? 'bg-gradient-to-r from-[#0055FF] to-[#FF3E55] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>{icon}{children}</Link>;
}

function PrivacyContent() {
  return <>
    <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
    <p>Media Land is an advertising and search engine marketing agency in Kuwait. This policy explains how we collect, use, and protect information when you visit our website or use our secure Google Ads reporting portal.</p>
    <Section title="1. Information we collect">We may collect contact details you submit, account and organization details needed to provide client access, support communications, and technical information such as browser, device, security, and usage data. For authorized connections, the portal retrieves Google Ads reporting data through the Google Ads API, including account, campaign, ad group, ad, keyword, search-term, device, location, conversion, and performance metrics.</Section>
    <Section title="2. How we use information">We use information to provide advertising services, authenticate authorized users, assign reports to the correct client organization, produce read-only reporting, maintain security, respond to support requests, and comply with legal obligations. The portal does not create, edit, pause, enable, remove, or otherwise modify Google Ads campaigns, ads, keywords, budgets, bids, billing, or account settings.</Section>
    <Section title="3. Services and integrations">The portal may use Google Ads API for read-only reporting, Supabase for authentication and database services, and Google Authentication when needed for authorized sign-in. Credentials and secrets remain server-side and are never stored in browser-accessible storage.</Section>
    <Section title="4. Data protection and retention">Media Land applies role-based authorization, tenant isolation, Row Level Security, server-side filtering, audit logging, and least-privilege controls. Information is retained only as long as needed for service delivery, security, legal, and dispute-resolution purposes.</Section>
    <Section title="5. Cookies">We use essential cookies and similar technologies to maintain secure sessions, remember necessary preferences, and protect the portal. Disabling essential cookies may prevent sign-in or secure portal features from working.</Section>
    <Section title="6. Your rights">You may request access, correction, or deletion of personal information subject to applicable law and legitimate retention requirements. Contact us using the address below.</Section>
    <Section title="7. Contact">For privacy questions or requests, email <a className="text-[#7da8ff] underline" href="mailto:nahiq8@gmail.com">nahiq8@gmail.com</a>.</Section>
  </>;
}

function TermsContent() {
  return <>
    <h2 className="text-xl font-bold text-white">Terms of Service</h2>
    <p>These Terms govern Media Land advertising services and its secure Google Ads reporting portal. By using the Services, you agree to these Terms and applicable law.</p>
    <Section title="1. Read-only reporting">The portal retrieves reporting information through the Google Ads API for authorized accounts and campaigns. It is strictly read-only and does not create, edit, pause, enable, remove, or otherwise modify campaigns, ads, keywords, budgets, bids, billing, or Google Ads account settings.</Section>
    <Section title="2. Accounts and access">Users must provide accurate information, protect credentials, and use only the organization and reports assigned to them. Access may use Supabase authentication or Google Authentication where configured. Report unauthorized access promptly.</Section>
    <Section title="3. Acceptable use">You may not bypass authorization or tenant isolation, access another organization’s information, interfere with security or availability, reverse engineer protected components, or use reporting data unlawfully.</Section>
    <Section title="4. Third-party services">Google Ads API, Supabase, and Google Authentication may have separate terms and policies. Media Land cannot control outages, policy decisions, or changes made by third-party providers.</Section>
    <Section title="5. Availability and disclaimer">The Services are provided on an “as available” basis. Reporting may be delayed or unavailable because of account permissions, API limits, provider outages, synchronization failures, or inaccurate source data. Reports are informational and do not guarantee advertising performance.</Section>
    <Section title="6. Limitation of liability">To the maximum extent permitted by law, Media Land is not liable for indirect, incidental, consequential, special, or punitive loss arising from third-party services, account suspension, inaccurate source data, or reliance on reports.</Section>
    <Section title="7. Suspension and changes">Media Land may suspend access for security, policy violations, legal requirements, or misuse. We may update these Terms by posting a revised version with a new date.</Section>
    <Section title="8. Contact">Questions may be sent to <a className="text-[#7da8ff] underline" href="mailto:nahiq8@gmail.com">nahiq8@gmail.com</a>.</Section>
  </>;
}

function CookieContent() {
  return <><h2 className="text-xl font-bold text-white">Cookie Policy</h2><p>Media Land uses essential cookies and similar technologies for secure sessions, preferences, security, and reliable portal operation. We do not use cookies to modify Google Ads data. You can control cookies through your browser, but disabling essential cookies may affect the Services.</p><Section title="Contact">For questions, email <a className="text-[#7da8ff] underline" href="mailto:nahiq8@gmail.com">nahiq8@gmail.com</a>.</Section></>;
}

function Section({ title, children }: { title: string; children: ReactNode }) { return <section><h3 className="text-base font-bold text-white">{title}</h3><p className="mt-2">{children}</p></section>; }
