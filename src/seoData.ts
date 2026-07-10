import { siteConfig } from './siteConfig';

export interface PageSEO {
  pathname: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  schemaType: string;
  faq?: { q: string; a: string }[];
  breadcrumbs: { name: string; url: string }[];
  contentHTML?: string; // Pre-rendered content block for crawler reading
}

export function getSeoForPathname(pathname: string): PageSEO {
  // Normalize pathname: remove trailing slash, ensure starts with slash
  let path = pathname.trim();
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  const siteUrl = siteConfig.siteUrl;

  // Fallback defaults
  const defaults: PageSEO = {
    pathname: path,
    title: 'شركة دعاية وإعلان في الكويت | ميديا لاند',
    description: 'ميديا لاند شركة دعاية وإعلان وتسويق رقمي في الكويت، نقدم إدارة حسابات التواصل الاجتماعي، تصميم الإعلانات، الحملات الممولة، تصميم المواقع وتصوير المنتجات.',
    h1: 'شركة دعاية وإعلان وتسويق رقمي في الكويت',
    canonical: siteUrl + path,
    schemaType: 'ProfessionalService',
    breadcrumbs: [{ name: 'الرئيسية', url: siteUrl + '/' }]
  };

  // Static routes
  if (path === '/' || path === '/home' || path === '') {
    return {
      pathname: '/',
      title: 'شركة دعاية وإعلان في الكويت | ميديا لاند',
      description: 'ميديا لاند شركة دعاية وإعلان وتسويق رقمي في الكويت، نقدم إدارة حسابات التواصل الاجتماعي، تصميم الإعلانات، الحملات الممولة، تصميم المواقع وتصوير المنتجات.',
      h1: 'شركة دعاية وإعلان وتسويق رقمي في الكويت',
      canonical: siteUrl + '/',
      schemaType: 'ProfessionalService',
      breadcrumbs: [{ name: 'الرئيسية', url: siteUrl + '/' }]
    };
  }

  if (path === '/about') {
    return {
      pathname: '/about',
      title: 'من نحن | ميديا لاند للدعاية والإعلان في الكويت',
      description: 'تعرف على ميديا لاند، الوكالة المتخصصة في الدعاية والإعلان والتسويق الرقمي بالكويت. فريق من المبدعين والبرمجيين والمصورين الملتزمين بالنتائج.',
      h1: 'شركة ميديا لاند للدعاية والإعلان في الكويت',
      canonical: siteUrl + '/about',
      schemaType: 'AboutPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'من نحن', url: siteUrl + '/about' }
      ]
    };
  }

  if (path === '/contact') {
    return {
      pathname: '/contact',
      title: 'اتصل بنا | ميديا لاند للدعاية والإعلان في الكويت',
      description: 'تواصل مع ميديا لاند للدعاية والإعلان في الكويت. احجز استشارتك المجانية اليوم لمناقشة حملتك التسويقية أو تصميم موقعك الإلكتروني.',
      h1: 'تواصل معنا وابدأ نجاحك التسويقي اليوم',
      canonical: siteUrl + '/contact',
      schemaType: 'ContactPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'تواصل معنا', url: siteUrl + '/contact' }
      ]
    };
  }

  if (path === '/portfolio') {
    return {
      pathname: '/portfolio',
      title: 'سابقة أعمالنا ومشاريعنا | ميديا لاند الكويت',
      description: 'شاهد سابقة أعمال شركة ميديا لاند في الكويت. مشاريع حقيقية وناجحة في إدارة الحسابات، تصوير الأطعمة والعطور، وتصميم المتاجر والمواقع الإلكترونية.',
      h1: 'معرض أعمالنا وقصص نجاح عملائنا بميديا لاند',
      canonical: siteUrl + '/portfolio',
      schemaType: 'CollectionPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'سابقة أعمالنا', url: siteUrl + '/portfolio' }
      ]
    };
  }

  if (path === '/case-studies') {
    return {
      pathname: '/case-studies',
      title: 'دراسات الحالة وقصص النجاح | ميديا لاند الكويت',
      description: 'اكتشف دراسات حالة حقيقية ومفصلة تبين كيف ساعدت ميديا لاند المطاعم والشركات والمتاجر في الكويت على تحسين حضورها الرقمي والوصول لعملاء جدد بشكل منظم.',
      h1: 'دراسات حالة تسويقية لعملائنا في الكويت',
      canonical: siteUrl + '/case-studies',
      schemaType: 'CollectionPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'دراسات الحالة', url: siteUrl + '/case-studies' }
      ]
    };
  }

  if (path === '/services') {
    return {
      pathname: '/services',
      title: 'أفضل خدمات الدعاية والإعلان في الكويت | ميديا لاند',
      description: 'تعرف على خدمات ميديا لاند للدعاية والإعلان الـ 16 المتكاملة في الكويت: السوشيال ميديا، المتاجر، تصوير المنتجات، إعلانات جوجل، الهوية البصرية والمطبوعات.',
      h1: 'خدمات الدعاية والإعلان والتسويق الرقمي في الكويت',
      canonical: siteUrl + '/services',
      schemaType: 'CollectionPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'خدماتنا', url: siteUrl + '/services' }
      ]
    };
  }

  if (path === '/industries') {
    return {
      pathname: '/industries',
      title: 'القطاعات التي نخدمها تسويقياً | ميديا لاند الكويت',
      description: 'نقدم حلول دعاية وإعلان مخصصة للقطاعات الحيوية في الكويت: المطاعم، المقاهي، العيادات، العقارات، المدارس، والمتاجر الإلكترونية.',
      h1: 'القطاعات التي نخدمها تسويقياً ودعائياً في الكويت',
      canonical: siteUrl + '/industries',
      schemaType: 'CollectionPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'القطاعات', url: siteUrl + '/industries' }
      ]
    };
  }

  if (path === '/locations') {
    return {
      pathname: '/locations',
      title: 'خدماتنا في محافظات الكويت | ميديا لاند للدعاية',
      description: 'ميديا لاند تغطي جميع محافظات دولة الكويت: العاصمة، حولي، الفروانية، الأحمدي، الجهراء، ومبارك الكبير بحلول تسويقية ودعائية مخصصة.',
      h1: 'دعاية وإعلان وتسويق رقمي في جميع محافظات الكويت',
      canonical: siteUrl + '/locations',
      schemaType: 'CollectionPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'المناطق', url: siteUrl + '/locations' }
      ]
    };
  }

  if (path === '/request-quote') {
    return {
      pathname: '/request-quote',
      title: 'طلب عرض سعر مخصص | ميديا لاند الكويت',
      description: 'اطلب عرض سعر مخصص وسريع لمشروعك من ميديا لاند. نوفر باقات مرنة واقتصادية لإدارة الحسابات، الإعلانات الممولة، وتطوير الويب في الكويت.',
      h1: 'اطلب عرض سعر مخصص لمشروعك التجاري',
      canonical: siteUrl + '/request-quote',
      schemaType: 'ContactPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'طلب عرض سعر', url: siteUrl + '/request-quote' }
      ]
    };
  }

  if (path === '/blog') {
    return {
      pathname: '/blog',
      title: 'مدونة ميديا لاند | أسرار التسويق الرقمي والدعاية بالكويت',
      description: 'مقالات ونصائح تخصصية من خبراء ميديا لاند حول أسرار التسويق الرقمي، إدارة الحسابات، تصميم المواقع، وتنمية المشاريع بالكويت.',
      h1: 'مدونة ميديا لاند - نصائح وأسرار التسويق الرقمي والانتشار',
      canonical: siteUrl + '/blog',
      schemaType: 'Blog',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'المدونة', url: siteUrl + '/blog' }
      ]
    };
  }

  if (path === '/privacy-policy') {
    return {
      pathname: '/privacy-policy',
      title: 'سياسة الخصوصية وسرية البيانات | ميديا لاند الكويت',
      description: 'سياسة الخصوصية وسرية البيانات الرسمية لشركة ميديا لاند للدعاية والإعلان والتسويق الرقمي في دولة الكويت.',
      h1: 'سياسة الخصوصية وسرية البيانات',
      canonical: siteUrl + '/privacy-policy',
      schemaType: 'WebPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'سياسة الخصوصية', url: siteUrl + '/privacy-policy' }
      ]
    };
  }

  if (path === '/terms-and-conditions') {
    return {
      pathname: '/terms-and-conditions',
      title: 'الشروط والأحكام القانونية | ميديا لاند الكويت',
      description: 'الشروط والأحكام القانونية الرسمية لاستخدام خدمات وموقع شركة ميديا لاند للدعاية والإعلان والتسويق الرقمي في الكويت.',
      h1: 'الشروط والأحكام القانونية للاستخدام',
      canonical: siteUrl + '/terms-and-conditions',
      schemaType: 'WebPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'الشروط والأحكام', url: siteUrl + '/terms-and-conditions' }
      ]
    };
  }

  if (path === '/cookie-policy') {
    return {
      pathname: '/cookie-policy',
      title: 'سياسة ملفات تعريف الارتباط | ميديا لاند الكويت',
      description: 'سياسة ملفات تعريف الارتباط (Cookies) الخاصة بموقع شركة ميديا لاند للدعاية والإعلان في الكويت.',
      h1: 'سياسة ملفات تعريف الارتباط',
      canonical: siteUrl + '/cookie-policy',
      schemaType: 'WebPage',
      breadcrumbs: [
        { name: 'الرئيسية', url: siteUrl + '/' },
        { name: 'سياسة ملفات تعريف الارتباط', url: siteUrl + '/cookie-policy' }
      ]
    };
  }

  // Dynamic services
  if (path.startsWith('/services/')) {
    const serviceId = path.replace('/services/', '');
    const service = siteConfig.services.find((s) => s.id === serviceId);
    if (service) {
      return {
        pathname: path,
        title: service.metaTitle,
        description: service.metaDesc,
        h1: service.h1,
        canonical: siteUrl + path,
        schemaType: 'Service',
        faq: service.faq,
        breadcrumbs: [
          { name: 'الرئيسية', url: siteUrl + '/' },
          { name: 'خدماتنا', url: siteUrl + '/services' },
          { name: service.title, url: siteUrl + path }
        ]
      };
    }
  }

  // Dynamic industries
  if (path.startsWith('/industries/')) {
    const industryId = path.replace('/industries/', '');
    const industry = siteConfig.industries.find((i) => i.id === industryId);
    if (industry) {
      return {
        pathname: path,
        title: industry.metaTitle,
        description: industry.metaDesc,
        h1: industry.h1,
        canonical: siteUrl + path,
        schemaType: 'FAQPage',
        faq: industry.faq,
        breadcrumbs: [
          { name: 'الرئيسية', url: siteUrl + '/' },
          { name: 'القطاعات', url: siteUrl + '/industries' },
          { name: industry.title, url: siteUrl + path }
        ]
      };
    }
  }

  // Dynamic locations
  if (path.startsWith('/locations/')) {
    const locationId = path.replace('/locations/', '');
    const loc = siteConfig.locations.find((l) => l.id === locationId);
    if (loc) {
      return {
        pathname: path,
        title: loc.metaTitle,
        description: loc.metaDesc,
        h1: loc.h1,
        canonical: siteUrl + path,
        schemaType: 'ProfessionalService',
        faq: loc.faq,
        breadcrumbs: [
          { name: 'الرئيسية', url: siteUrl + '/' },
          { name: 'المناطق', url: siteUrl + '/locations' },
          { name: loc.title, url: siteUrl + path }
        ]
      };
    }
  }

  // Dynamic blog posts
  if (path.startsWith('/blog/')) {
    const blogId = path.replace('/blog/', '');
    const post = siteConfig.blog.find((b) => b.id === blogId);
    if (post) {
      return {
        pathname: path,
        title: `${post.title} | ميديا لاند الكويت`,
        description: post.metaDesc,
        h1: post.title,
        canonical: siteUrl + path,
        schemaType: 'BlogPosting',
        faq: post.faq,
        breadcrumbs: [
          { name: 'الرئيسية', url: siteUrl + '/' },
          { name: 'المدونة', url: siteUrl + '/blog' },
          { name: post.title, url: siteUrl + path }
        ]
      };
    }
  }

  return defaults;
}

export function generateJsonLd(seo: PageSEO): any {
  const siteUrl = siteConfig.siteUrl;
  const logoUrl = `${siteUrl}/assets/logo.png`; // or correct path if exists

  const basicOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    'name': 'ميديا لاند للدعاية والإعلان',
    'alternateName': 'Media Land Agency',
    'url': siteUrl,
    'logo': logoUrl,
    'email': siteConfig.email,
    'telephone': siteConfig.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': siteConfig.address,
      'addressCountry': 'KW',
      'addressLocality': 'Sharq, Kuwait City'
    },
    'sameAs': [
      siteConfig.instagram,
      siteConfig.tiktok,
      siteConfig.snapchat,
      siteConfig.x,
      siteConfig.facebook,
      siteConfig.youtube
    ]
  };

  const basicProfessionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#service-agency`,
    'name': 'ميديا لاند للدعاية والإعلان وتسويق رقمي',
    'image': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'url': siteUrl,
    'telephone': siteConfig.phone,
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': siteConfig.address,
      'addressLocality': 'Sharq, Kuwait City',
      'addressCountry': 'KW'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 29.3821, // General Coordinates of Sharq Ahmad Tower
      'longitude': 47.9898
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '09:00',
      'closes': '21:00'
    }
  };

  const basicWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    'url': siteUrl,
    'name': 'ميديا لاند ميديا لاند للدعاية والإعلان',
    'description': 'ميديا لاند شركة دعاية وإعلان وتسويق رقمي في الكويت',
    'inLanguage': 'ar'
  };

  // 1. Breadcrumb List Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': seo.breadcrumbs.map((bc, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': bc.name,
      'item': bc.url
    }))
  };

  // 2. FAQ Schema if FAQs exist
  let faqSchema: any = null;
  if (seo.faq && seo.faq.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': seo.faq.map((f) => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    };
  }

  // 3. Schema selection by Page type
  if (seo.pathname === '/') {
    return [
      basicOrganization,
      basicProfessionalService,
      basicWebSite,
      breadcrumbSchema
    ];
  }

  if (seo.pathname.startsWith('/services/')) {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': seo.h1,
      'description': seo.description,
      'provider': basicProfessionalService,
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': 'Kuwait'
      }
    };
    return faqSchema ? [breadcrumbSchema, serviceSchema, faqSchema] : [breadcrumbSchema, serviceSchema];
  }

  if (seo.pathname.startsWith('/blog/')) {
    const blogPostSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': seo.title,
      'description': seo.description,
      'url': seo.canonical,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': seo.canonical
      },
      'publisher': basicOrganization,
      'author': {
        '@type': 'Person',
        'name': 'ميديا لاند الكويت'
      },
      'inLanguage': 'ar'
    };
    return faqSchema ? [breadcrumbSchema, blogPostSchema, faqSchema] : [breadcrumbSchema, blogPostSchema];
  }

  if (seo.pathname.startsWith('/locations/')) {
    // Location specific professional service
    const locationServiceSchema = {
      ...basicProfessionalService,
      '@id': `${seo.canonical}/#location-service`,
      'name': `ميديا لاند للدعاية والإعلان - ${seo.h1}`,
      'description': seo.description,
      'url': seo.canonical
    };
    return faqSchema ? [breadcrumbSchema, locationServiceSchema, faqSchema] : [breadcrumbSchema, locationServiceSchema];
  }

  // General WebPage Schema with Breadcrumbs
  const generalPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${seo.canonical}/#webpage`,
    'url': seo.canonical,
    'name': seo.title,
    'description': seo.description,
    'isPartOf': { '@id': `${siteUrl}/#website` },
    'breadcrumb': { '@id': `${seo.canonical}/#breadcrumb` }
  };

  return faqSchema ? [breadcrumbSchema, generalPageSchema, faqSchema] : [breadcrumbSchema, generalPageSchema];
}
