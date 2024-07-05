/**
 * Options for the fuzzy search function.
 */
export interface FuzzySearchOptions {
  /**
   * The minimum score threshold for a match to be considered valid.
   * Default is 0.
   */
  threshold?: number;

  /**
   * Whether to sort the results by score.
   * Default is false.
   */
  sort?: boolean;

  /**
   * Whether the search should be case-sensitive.
   * Default is false.
   */
  caseSensitive?: boolean;
}

/**
 * The result of a fuzzy search.
 */
export interface FuzzySearchResult {
  /**
   * The item that was matched.
   */
  item: string;

  /**
   * The score of the match.
   */
  score: number;

  /**
   * The indices of the matched characters in the item.
   */
  matchedIndices: number[];
}

/**
 * Performs a fuzzy search to find the needle in the haystack.
 *
 * @param needle - The string to search for.
 * @param haystack - The string to search within.
 * @param options - Optional settings for the search.
 * @returns The result of the fuzzy search, or null if no match is found.
 */
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
        score = 1; // Exact match should have a score of 1
        return score >= threshold
          ? { item: haystack, score, matchedIndices }
          : null;
      }
    }
  }

  return null;
}

/**
 * Performs a fuzzy search on an array of items.
 *
 * @param query - The string to search for.
 * @param items - The array of strings to search within.
 * @param options - Optional settings for the search.
 * @returns An array of objects containing the matched items.
 */
export function fuzzySearchArray(
  query: string,
  items: string[],
  options: FuzzySearchOptions = {}
): FuzzySearchResult[] {
  const results: FuzzySearchResult[] = items
    .map((item) => fuzzySearch(query, item, options))
    .filter((result): result is FuzzySearchResult => result !== null);

  results.sort((a, b) => a.item.localeCompare(b.item));

  return results;
}
