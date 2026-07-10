export interface Service {
  id: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  problem: string;
  solution: string;
  description: string;
  features: string[];
  steps: string[];
  benefits: string[];
  suitableFor: string[];
  faq: { q: string; a: string }[];
  iconName: string;
}

export interface Industry {
  id: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  challenges: string[];
  targetAudience: string;
  platforms: string[];
  contentTypes: string[];
  campaigns: string[];
  recommendedServices: string[];
  measurement: string;
  faq: { q: string; a: string }[];
}

export interface LocationData {
  id: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  sectors: string[];
  recommendedServices: string[];
  subAreas: string[];
  howWeDeliver: string;
  faq: { q: string; a: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  metaDesc: string;
  date: string;
  updatedDate: string;
  author: string;
  coverImage: string;
  intro: string;
  sections: { heading: string; text: string }[];
  faq: { q: string; a: string }[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  service: string;
  description: string;
  image: string;
  clientLink?: string;
  servicesUsed: string[];
}
