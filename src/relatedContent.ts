import { areaData, getAreaPath } from './areaData';
import { caseStudyPages } from './caseStudyData';
import { commercialArticles } from './commercialContent';
import { getServiceIndustryPath, serviceIndustryPages } from './serviceIndustryData';
import { siteConfig } from './siteConfig';

type RelatedContentKind = 'article' | 'case-study' | 'service-industry' | 'service' | 'industry' | 'location';

export interface RelatedContentContext {
  serviceIds?: string[];
  industryIds?: string[];
  locationIds?: string[];
  keywords?: string[];
  preferredPaths?: string[];
}

export interface RelatedContentItem {
  path: string;
  title: string;
  kind: RelatedContentKind;
  score: number;
}

interface Candidate extends Omit<RelatedContentItem, 'score'> {
  serviceIds?: string[];
  industryIds?: string[];
  locationIds?: string[];
  keywords?: string[];
}

const tokenize = (values: string[] = []) => values
  .join(' ')
  .toLocaleLowerCase('ar')
  .match(/[\p{L}\p{N}]{3,}/gu) ?? [];

const overlap = (left: string[] = [], right: string[] = []) => {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value)).length;
};

const keywordMatches = (contextKeywords: string[], candidateKeywords: string[] = []) => {
  const candidateTokens = new Set(tokenize(candidateKeywords));
  return [...new Set(tokenize(contextKeywords))].filter((token) => candidateTokens.has(token)).length;
};

export function getRelatedContent(
  currentPath: string,
  context: RelatedContentContext,
  excludedPaths: string[] = [],
  limit = 4,
): RelatedContentItem[] {
  const candidates: Candidate[] = [
    ...siteConfig.services.map((service) => ({
      path: `/services/${service.id}`,
      title: service.title,
      kind: 'service' as const,
      serviceIds: [service.id],
      keywords: [service.title, service.subtitle, service.description],
    })),
    ...siteConfig.industries.map((industry) => ({
      path: `/industries/${industry.id}`,
      title: industry.title,
      kind: 'industry' as const,
      industryIds: [industry.id],
      keywords: [industry.title, industry.targetAudience, ...industry.platforms],
    })),
    ...siteConfig.locations.map((location) => ({
      path: `/locations/${location.id}`,
      title: location.title,
      kind: 'location' as const,
      locationIds: [location.id],
      serviceIds: location.recommendedServices,
      keywords: [location.title, location.intro, ...location.sectors],
    })),
    ...areaData.map((area) => ({
      path: getAreaPath(area),
      title: area.nameAr,
      kind: 'location' as const,
      locationIds: [area.governorateId],
      serviceIds: area.recommendedServiceIds,
      industryIds: area.recommendedIndustryIds,
      keywords: [area.nameAr, area.introduction, area.serviceDelivery],
    })),
    ...serviceIndustryPages.map((page) => ({
      path: getServiceIndustryPath(page),
      title: page.title,
      kind: 'service-industry' as const,
      serviceIds: [page.serviceId],
      industryIds: [page.industryId],
      keywords: [page.title, page.intro, page.h1],
    })),
    ...commercialArticles.map((article) => ({
      path: `/blog/${article.id}`,
      title: article.title,
      kind: 'article' as const,
      serviceIds: article.relatedServiceIds,
      industryIds: article.relatedIndustryIds,
      locationIds: article.relatedLocationIds,
      keywords: [article.title, article.h1, article.intro, ...article.sections.map((section) => section.heading)],
    })),
    ...caseStudyPages.map((study) => ({
      path: `/case-studies/${study.id}`,
      title: study.title,
      kind: 'case-study' as const,
      serviceIds: study.serviceIds,
      industryIds: study.industryIds,
      locationIds: [study.locationId],
      keywords: [study.title, study.h1, study.sectorLabel, study.challenge],
    })),
  ];

  const excluded = new Set([currentPath, ...excludedPaths]);
  const scored = candidates
    .filter((candidate) => !excluded.has(candidate.path))
    .map((candidate) => ({
      ...candidate,
      score:
        overlap(context.serviceIds, candidate.serviceIds) * 5 +
        overlap(context.industryIds, candidate.industryIds) * 5 +
        overlap(context.locationIds, candidate.locationIds) * 4 +
        Math.min(keywordMatches(context.keywords ?? [], candidate.keywords), 3) +
        (context.preferredPaths?.includes(candidate.path) ? 4 : 0),
    }))
    .filter((candidate) => candidate.score >= 4)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'ar'));

  const kindCounts = new Map<RelatedContentKind, number>();
  return scored.filter((candidate) => {
    const count = kindCounts.get(candidate.kind) ?? 0;
    if (count >= 2) return false;
    kindCounts.set(candidate.kind, count + 1);
    return true;
  }).slice(0, limit);
}
