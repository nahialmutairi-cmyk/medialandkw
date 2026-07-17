export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export interface SearchConsoleOptimization {
  targetKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  ctrImprovementSuggestions: string[];
  titleVariations: string[];
  metaDescriptionVariations: string[];
}

// Add a record only after validating the query and impression data in Search Console.
export const searchConsoleOptimizations: Record<string, SearchConsoleOptimization> = {};

export function getSearchConsoleOptimization(pathname: string): SearchConsoleOptimization | undefined {
  return searchConsoleOptimizations[pathname];
}
