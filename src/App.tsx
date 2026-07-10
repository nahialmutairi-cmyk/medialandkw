import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Container
import { Layout } from './components/Layout';

// Individual Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { ServiceIndustryDetail } from './pages/ServiceIndustryDetail';
import { Industries } from './pages/Industries';
import { IndustryDetail } from './pages/IndustryDetail';
import { Locations } from './pages/Locations';
import { LocationDetail } from './pages/LocationDetail';
import { Portfolio } from './pages/Portfolio';
import { CaseStudies } from './pages/CaseStudies';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Contact } from './pages/Contact';
import { RequestQuote } from './pages/RequestQuote';
import { LegalPages } from './pages/LegalPages';
import { ClientPortal } from './components/ClientPortal';

export function AppContent() {
  return (
    <Layout>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        
        {/* Services & Subpages */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId/:industryId" element={<ServiceIndustryDetail />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        
        {/* Sectors/Industries & Subpages */}
        <Route path="/industries" element={<Industries />} />
        <Route path="/industries/:id" element={<IndustryDetail />} />
        
        {/* Locations & Subpages */}
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:id" element={<LocationDetail />} />
        
        {/* Marketing Blog & Subpages */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        {/* Legal Compliance */}
        <Route path="/privacy-policy" element={<LegalPages />} />
        <Route path="/terms-and-conditions" element={<LegalPages />} />
        <Route path="/cookie-policy" element={<LegalPages />} />

        {/* Isolated Client Portal */}
        <Route path="/u/:clientId" element={<ClientPortal />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
