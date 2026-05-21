import { applyFilters } from "@/lib/filters";
import type { CatalogFilters, Product } from "@/types/product";

export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreProduct(product: Product, tokens: string[]): number {
  if (tokens.length === 0) return 1;

  const haystack = normalize(
    [
      product.title,
      product.sku,
      product.category,
      product.type,
      product.material,
      product.brand,
      product.color,
      product.volume,
    ].join(" ")
  );

  let score = 0;

  for (const token of tokens) {
    if (product.sku.toLowerCase() === token) score += 100;
    else if (normalize(product.title).startsWith(token)) score += 50;
    else if (normalize(product.sku).startsWith(token)) score += 40;
    else if (haystack.includes(token)) score += 20;
    else return 0;
  }

  return score;
}

/**
 * Local search index — structured for future Meilisearch migration.
 * Replace `searchProducts` body with Meilisearch client calls when ready.
 */
export function searchProducts(
  products: Product[],
  query: string,
  filters: CatalogFilters
): SearchResult {
  const filtered = applyFilters(products, filters);
  const trimmed = query.trim();

  if (!trimmed) {
    return { products: filtered, total: filtered.length, query: trimmed };
  }

  const tokens = normalize(trimmed).split(/\s+/).filter(Boolean);

  const ranked = filtered
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);

  return { products: ranked, total: ranked.length, query: trimmed };
}

export function getCategoryCounts(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});
}
