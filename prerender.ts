import * as fs from 'fs';
import * as path from 'path';
import { siteConfig } from './src/siteConfig';
import { getSeoForPathname, generateJsonLd } from './src/seoData';

// Constants
const DIST_DIR = path.join(process.cwd(), 'dist');
const BASE_TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(BASE_TEMPLATE_PATH)) {
  console.error(`Error: Base template not found at ${BASE_TEMPLATE_PATH}. Please run "npm run build" first.`);
  process.exit(1);
}

const baseTemplate = fs.readFileSync(BASE_TEMPLATE_PATH, 'utf-8');

// Gather all routes dynamically
const staticRoutes = [
  '/',
  '/about',
  '/portfolio',
  '/case-studies',
  '/contact',
  '/request-quote',
  '/services',
  '/industries',
  '/locations',
  '/blog',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy'
];

const serviceRoutes = siteConfig.services.map(s => `/services/${s.id}`);
const industryRoutes = siteConfig.industries.map(i => `/industries/${i.id}`);
const locationRoutes = siteConfig.locations.map(l => `/locations/${l.id}`);
const blogRoutes = siteConfig.blog.map(b => `/blog/${b.id}`);

const allRoutes = [
  ...staticRoutes,
  ...serviceRoutes,
  ...industryRoutes,
  ...locationRoutes,
  ...blogRoutes
];

console.log(`Starting pre-rendering for ${allRoutes.length} routes...`);

// Helper to generate a clean semantic HTML body for crawlers
function generateSemanticContent(route: string): string {
  const seo = getSeoForPathname(route);
  
  let html = `<div class="seo-crawler-content" style="padding: 20px; max-width: 800px; margin: 0 auto; font-family: sans-serif; line-height: 1.6; direction: rtl; text-align: right;">`;
  
  // Breadcrumbs
  html += `<nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom: 20px; font-size: 0.9em; color: #666;">`;
  html += seo.breadcrumbs.map(bc => `<a href="${bc.url}">${bc.name}</a>`).join(' &gt; ');
  html += `</nav>`;

  // Title & H1
  html += `<h1 style="font-size: 2.5em; margin-bottom: 10px; color: #111;">${seo.h1}</h1>`;
  html += `<p class="lead" style="font-size: 1.2em; color: #333; margin-bottom: 30px; font-weight: bold;">${seo.description}</p>`;

  // Content generation based on route type
  if (route === '/') {
    html += `<h2>من نحن - ميديا لاند الكويت</h2>`;
    html += `<p>مرحباً بكم في ميديا لاند، الشركة الرائدة في خدمات الدعاية والإعلان والتسويق الرقمي في دولة الكويت. نحن نقدم باقات تسويقية مبتكرة، إدارة حسابات احترافية، إنتاج فيديو وتصوير سينمائي، وتطوير مواقع ومتاجر رقمية متكاملة لضمان ريادتك ومضاعفة مبيعاتك في السوق الكويتي.</p>`;
    
    html += `<h3>أبرز الخدمات التي نقدمها:</h3><ul>`;
    siteConfig.services.slice(0, 6).forEach(s => {
      html += `<li><strong>${s.title}</strong>: ${s.subtitle}</li>`;
    });
    html += `</ul>`;
  } 
  else if (route === '/about') {
    html += `<h2>قصة ميديا لاند للدعاية والإعلان والتسويق الرقمي</h2>`;
    html += `<p>انطلقت ميديا لاند بدولة الكويت بهدف سد الفجوة الكبيرة بين التصاميم العادية والحملات الإعلانية الصارمة ذات العائد الربحي الفعلي. نحن لا نكتفي بإنشاء تصاميم، بل نضع استراتيجية متكاملة تبدأ من دراسة المنافسين وتصوير الأصول الخاصة بمشروعك تصويراً سينمائياً احترافياً.</p>`;
  } 
  else if (route === '/services') {
    html += `<h2>خدماتنا المتكاملة الـ 16 في الكويت</h2>`;
    html += `<div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;">`;
    siteConfig.services.forEach(s => {
      html += `<div style="border: 1px solid #eee; padding: 15px; border-radius: 8px;">`;
      html += `<h3 style="margin-top: 0;"><a href="/services/${s.id}">${s.title}</a></h3>`;
      html += `<p>${s.subtitle}</p>`;
      html += `</div>`;
    });
    html += `</div>`;
  } 
  else if (route === '/industries') {
    html += `<h2>القطاعات والشركات التي نخدمها في الكويت</h2>`;
    html += `<div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;">`;
    siteConfig.industries.forEach(i => {
      html += `<div style="border: 1px solid #eee; padding: 15px; border-radius: 8px;">`;
      html += `<h3 style="margin-top: 0;"><a href="/industries/${i.id}">${i.title}</a></h3>`;
      html += `<p><strong>الجمهور المستهدف:</strong> ${i.targetAudience}</p>`;
      html += `</div>`;
    });
    html += `</div>`;
  } 
  else if (route === '/locations') {
    html += `<h2>تغطية خدماتنا في جميع محافظات ومناطق دولة الكويت</h2>`;
    html += `<div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 20px;">`;
    siteConfig.locations.forEach(l => {
      html += `<div style="border: 1px solid #eee; padding: 15px; border-radius: 8px;">`;
      html += `<h3 style="margin-top: 0;"><a href="/locations/${l.id}">${l.title}</a></h3>`;
      html += `<p>${l.intro}</p>`;
      html += `</div>`;
    });
    html += `</div>`;
  }
  else if (route === '/portfolio') {
    html += `<h2>معرض أعمال ميديا لاند - مشاريع حقيقية وناجحة في الكويت</h2>`;
    siteConfig.projects.forEach(p => {
      html += `<div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">`;
      html += `<h3>${p.title}</h3>`;
      html += `<p><strong>العميل:</strong> ${p.client} | <strong>القسم:</strong> ${p.category}</p>`;
      html += `<p>${p.description}</p>`;
      html += `<p><strong>الخدمات المستخدمة:</strong> ${p.servicesUsed.join('، ')}</p>`;
      html += `</div>`;
    });
  }
  else if (route === '/case-studies') {
    html += `<h2>دراسات حالة تسويقية لعملائنا في الكويت</h2>`;
    siteConfig.caseStudies.forEach(cs => {
      html += `<div style="margin-bottom: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">`;
      html += `<h3>${cs.title}</h3>`;
      html += `<p><strong>العميل:</strong> ${cs.clientName}</p>`;
      html += `<p><strong>التحدي:</strong> ${cs.challenge}</p>`;
      html += `<p><strong>الهدف:</strong> ${cs.target}</p>`;
      html += `<p><strong>الحل:</strong> ${cs.solution}</p>`;
      html += `<h4>النتائج المحققة:</h4><ul>`;
      cs.results.forEach(r => {
        html += `<li>${r}</li>`;
      });
      html += `</ul></div>`;
    });
  }
  else if (route === '/blog') {
    html += `<h2>أحدث مقالات ونصائح التسويق الرقمي والدعاية في الكويت</h2>`;
    siteConfig.blog.forEach(b => {
      html += `<div style="margin-bottom: 20px;">`;
      html += `<h3><a href="/blog/${b.id}">${b.title}</a></h3>`;
      html += `<p><small>تاريخ النشر: ${b.date} | الكاتب: ${b.author}</small></p>`;
      html += `<p>${b.intro}</p>`;
      html += `</div>`;
    });
  }
  // Dynamic Services Details
  else if (route.startsWith('/services/')) {
    const serviceId = route.replace('/services/', '');
    const s = siteConfig.services.find(item => item.id === serviceId);
    if (s) {
      html += `<h2>مقدمة الخدمة</h2><p>${s.description}</p>`;
      
      html += `<h3>القطاعات المستهدفة:</h3><ul>`;
      s.suitableFor.forEach(sec => {
        html += `<li>${sec}</li>`;
      });
      html += `</ul>`;

      html += `<h3>المميزات والفوائد لشركتك:</h3><ul>`;
      s.features.forEach(rec => {
        html += `<li>${rec}</li>`;
      });
      html += `</ul>`;

      html += `<h3>كيف نقدم هذه الخدمة باحترافية؟</h3><p>${s.solution}</p>`;
    }
  }
  // Dynamic Industries Details
  else if (route.startsWith('/industries/')) {
    const industryId = route.replace('/industries/', '');
    const i = siteConfig.industries.find(item => item.id === industryId);
    if (i) {
      html += `<h2>مقدمة القطاع للجمهور</h2><p>${i.targetAudience}</p>`;
      
      html += `<h3>التحديات الشائعة في هذا القطاع:</h3><ul>`;
      i.challenges.forEach(sec => {
        html += `<li>${sec}</li>`;
      });
      html += `</ul>`;

      html += `<h3>الخدمات الترويجية والبرمجية الموصى بها:</h3><ul>`;
      i.recommendedServices.forEach(rec => {
        html += `<li>${rec}</li>`;
      });
      html += `</ul>`;

      html += `<h3>كيفية قياس نجاح الحملات والأداء لهذا القطاع:</h3><p>${i.measurement}</p>`;
    }
  }
  // Dynamic Locations Details
  else if (route.startsWith('/locations/')) {
    const locationId = route.replace('/locations/', '');
    const l = siteConfig.locations.find(item => item.id === locationId);
    if (l) {
      html += `<h2>دعاية وتسويق في ${l.title}</h2><p>${l.intro}</p>`;
      
      html += `<h3>المشاريع والأعمال التي نخدمها:</h3><ul>`;
      l.sectors.forEach(sec => {
        html += `<li>${sec}</li>`;
      });
      html += `</ul>`;

      html += `<h3>المناطق المغطاة بالتفصيل:</h3><p>${l.subAreas.join('، ')}</p>`;

      html += `<h3>الخدمات الموصى بها لمشاريع هذه المنطقة:</h3><ul>`;
      l.recommendedServices.forEach(rec => {
        html += `<li>${rec}</li>`;
      });
      html += `</ul>`;

      html += `<h3>كيف نساعد مشاريع المنطقة على النمو؟</h3><p>${l.howWeDeliver}</p>`;
    }
  }
  // Dynamic Blog Details
  else if (route.startsWith('/blog/')) {
    const blogId = route.replace('/blog/', '');
    const b = siteConfig.blog.find(item => item.id === blogId);
    if (b) {
      html += `<p><small>تاريخ النشر: ${b.date} | الكاتب: ${b.author}</small></p>`;
      html += `<p>${b.intro}</p>`;
      
      b.sections.forEach(sec => {
        html += `<h3>${sec.heading}</h3>`;
        html += `<p>${sec.text}</p>`;
      });
    }
  }

  // FAQ section if exists
  if (seo.faq && seo.faq.length > 0) {
    html += `<h2 style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">الأسئلة الشائعة والأجوبة (FAQ)</h2>`;
    seo.faq.forEach(f => {
      html += `<div style="margin-bottom: 20px;">`;
      html += `<h4 style="margin-bottom: 5px; color: #111;">❓ ${f.q}</h4>`;
      html += `<p style="margin-top: 0; color: #444;">💡 ${f.a}</p>`;
      html += `</div>`;
    });
  }

  // Common CTA footer
  html += `<div style="margin-top: 50px; background-color: #f7f9ff; padding: 25px; border-radius: 12px; border-right: 5px solid #0055ff; text-align: center;">`;
  html += `<h3>هل تريد مضاعفة مبيعات وأرباح مشروعك في الكويت؟</h3>`;
  html += `<p>تواصل مع فريق ميديا لاند للدعاية والإعلان والتسويق الرقمي الآن واستفد من استشارة تسويقية هاتفية مجانية مخصصة لمشروعك.</p>`;
  html += `<p><strong>رقم الهاتف المباشر:</strong> <a href="tel:${siteConfig.phone.replace(/\s+/g, '')}">${siteConfig.phone}</a></p>`;
  html += `<p><strong>واتساب مباشر:</strong> <a href="${siteConfig.whatsappUrl}">مراسلة عبر واتساب</a></p>`;
  html += `</div>`;

  html += `</div>`;
  return html;
}

// Generate static files
allRoutes.forEach(route => {
  const seo = getSeoForPathname(route);
  const jsonLd = generateJsonLd(seo);
  const semanticContent = generateSemanticContent(route);

  // Generate complete Meta block
  const metaBlock = `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <link rel="canonical" href="${seo.canonical}" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    <script type="application/ld+json" id="json-ld-seo-schema">${JSON.stringify(jsonLd)}</script>
  `;

  // Inject metaBlock into base template head
  let content = baseTemplate;
  
  // Replace existing title or inject into head
  if (content.includes('<title>')) {
    content = content.replace(/<title>[\s\S]*?<\/title>/, metaBlock);
  } else {
    content = content.replace('</head>', `${metaBlock}\n</head>`);
  }

  // Inject semantic HTML block into <div id="root"></div> for crawlers
  content = content.replace('<div id="root"></div>', `<div id="root">${semanticContent}</div>`);

  // Write file to destination
  if (route === '/') {
    // Overwrite the main index.html in dist
    fs.writeFileSync(BASE_TEMPLATE_PATH, content, 'utf-8');
    console.log(`Pre-rendered: / -> dist/index.html`);
  } else {
    // Create subfolder and write index.html inside it
    const subPath = route.startsWith('/') ? route.slice(1) : route;
    const targetFolder = path.join(DIST_DIR, subPath);
    
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    
    fs.writeFileSync(path.join(targetFolder, 'index.html'), content, 'utf-8');
    console.log(`Pre-rendered: ${route} -> dist/${subPath}/index.html`);
  }
});

console.log('Pre-rendering completed successfully!');
