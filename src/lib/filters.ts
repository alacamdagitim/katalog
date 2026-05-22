import type { CatalogFilters, FilterKey, Product } from "@/types/product";
import { SUPPLIER_ORDER } from "@/types/product";

const IGNORED_VALUES = new Set(["-", ""]);

export function getScopedProducts(
  products: Product[],
  filters: CatalogFilters,
  excludeKey?: FilterKey
): Product[] {
  if (!excludeKey) {
    return applyFilters(products, filters);
  }

  const scopedFilters: CatalogFilters = {
    ...filters,
    [excludeKey]: [],
  };

  return applyFilters(products, scopedFilters);
}

export function getFilterOptions(
  products: Product[],
  key: FilterKey,
  filters?: CatalogFilters
): string[] {
  const source = filters ? getScopedProducts(products, filters, key) : products;
  const values = new Set<string>();

  for (const product of source) {
    if (key === "printed") {
      values.add(product.printed ? "Baskılı" : "Baskısız");
    } else if (key === "category") {
      values.add(product.category);
    } else {
      values.add(String(product[key]));
    }
  }

  const options = Array.from(values).filter((value) => !IGNORED_VALUES.has(value));

  if (key === "category") {
    return options.sort((a, b) => {
      const ai = SUPPLIER_ORDER.indexOf(a);
      const bi = SUPPLIER_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b, "tr");
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  return options.sort((a, b) => a.localeCompare(b, "tr"));
}

export function applyFilters(
  products: Product[],
  filters: CatalogFilters
): Product[] {
  return products.filter((product) => {
    if (filters.category.length && !filters.category.includes(product.category)) {
      return false;
    }
    if (filters.type.length && !filters.type.includes(product.type)) {
      return false;
    }
    if (filters.material.length && !filters.material.includes(product.material)) {
      return false;
    }
    if (filters.volume.length && !filters.volume.includes(product.volume)) {
      return false;
    }
    if (filters.brand.length && !filters.brand.includes(product.brand)) {
      return false;
    }
    if (filters.printed.length) {
      const label = product.printed ? "Baskılı" : "Baskısız";
      if (!filters.printed.includes(label)) return false;
    }
    if (filters.color.length && !filters.color.includes(product.color)) {
      return false;
    }
    return true;
  });
}

export function countActiveFilters(filters: CatalogFilters): number {
  return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
}

export function groupProductsByCategory(products: Product[]): [string, Product[]][] {
  const grouped = products.reduce<Map<string, Product[]>>((acc, product) => {
    const list = acc.get(product.category) ?? [];
    list.push(product);
    acc.set(product.category, list);
    return acc;
  }, new Map());

  const entries = Array.from(grouped.entries());

  return entries.sort(([a], [b]) => {
    const ai = SUPPLIER_ORDER.indexOf(a);
    const bi = SUPPLIER_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "tr");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function isCatalogBrowseMode(query: string, filters: CatalogFilters): boolean {
  return !query.trim() && countActiveFilters(filters) === 0;
}
