import type { CatalogFilters, Product } from "@/types/product";
import { searchProducts as localSearch } from "@/lib/search";

/**
 * Search adapter — swap implementation for Meilisearch when ready.
 *
 * Future setup:
 * ```ts
 * import { MeiliSearch } from "meilisearch";
 * const client = new MeiliSearch({ host: process.env.MEILI_HOST!, apiKey: process.env.MEILI_KEY });
 * ```
 */
export interface SearchAdapter {
  search(
    products: Product[],
    query: string,
    filters: CatalogFilters
  ): Promise<{ products: Product[]; total: number; query: string }>;
}

export const localSearchAdapter: SearchAdapter = {
  async search(products, query, filters) {
    return localSearch(products, query, filters);
  },
};

export const searchAdapter: SearchAdapter = localSearchAdapter;
