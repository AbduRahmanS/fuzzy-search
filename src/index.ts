export interface FuzzySearchOptions {
  threshold?: number;
  sort?: boolean;
  caseSensitive?: boolean;
}

export interface FuzzySearchResult {
  item: string;
  score: number;
  matchedIndices: number[];
}

export function fuzzySearch(
  needle: string,
  haystack: string,
  options: FuzzySearchOptions = {}
): FuzzySearchResult | null {
  const { threshold = 0, caseSensitive = false } = options;

  if (!caseSensitive) {
    needle = needle.toLowerCase();
    haystack = haystack.toLowerCase();
  }

  const matchedIndices: number[] = [];
  let score = 0;
  let nIndex = 0;

  for (let hIndex = 0; hIndex < haystack.length; hIndex++) {
    if (needle[nIndex] === haystack[hIndex]) {
      matchedIndices.push(hIndex);
      nIndex++;
      if (nIndex === needle.length) {
        score = 1;
        return score >= threshold
          ? { item: haystack, score, matchedIndices }
          : null;
      }
    }
  }

  return null;
}

export function fuzzySearchArray(
  query: string,
  items: string[],
  options: FuzzySearchOptions = {}
): { item: string }[] {
  const results: FuzzySearchResult[] = items
    .map((item) => fuzzySearch(query, item, options))
    .filter((result): result is FuzzySearchResult => result !== null);

  results.sort((a, b) => a.item.localeCompare(b.item));

  return results.map((result) => ({ item: result.item }));
}
