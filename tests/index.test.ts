import { fuzzySearch, fuzzySearchArray } from "../src/index";

describe("fuzzySearch", () => {
  test("should match exact strings", () => {
    const result = fuzzySearch("hello", "hello");
    expect(result).not.toBeNull();
    expect(result?.score).toBe(1);
  });

  test("should match fuzzy strings", () => {
    const result = fuzzySearch("hlo", "hello");
    expect(result).not.toBeNull();
    expect(result?.score).toBeGreaterThan(0);
  });

  test("should not match non-matching strings", () => {
    expect(fuzzySearch("abc", "xyz")).toBeNull();
  });

  test("should respect case sensitivity option", () => {
    expect(fuzzySearch("ABC", "abc", { caseSensitive: true })).toBeNull();
    expect(fuzzySearch("ABC", "abc", { caseSensitive: false })).not.toBeNull();
  });
});

describe("fuzzySearchArray", () => {
  const fruits = ["apple", "banana", "orange", "pear"];

  test("should return matching items", () => {
    const results = fuzzySearchArray("a", fruits);
    expect(results.map((r) => r.item)).toEqual([
      "apple",
      "banana",
      "orange",
      "pear",
    ]);
  });

  test("should return empty array for no matches", () => {
    const results = fuzzySearchArray("z", fruits);
    expect(results).toEqual([]);
  });

  test("should sort results by default", () => {
    const results = fuzzySearchArray("a", fruits);
    expect(results.map((r) => r.item)).toEqual([
      "apple",
      "banana",
      "orange",
      "pear",
    ]);
  });
});
