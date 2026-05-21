import type { CatalogFilters, FilterKey, Product } from "@/types/product";

export function getFilterOptions(
  products: Product[],
  key: FilterKey
): string[] {
  const values = new Set<string>();

  for (const product of products) {
    if (key === "printed") {
      values.add(product.printed ? "Baskılı" : "Baskısız");
    } else {
      values.add(String(product[key]));
    }
  }

  return Array.from(values).sort((a, b) => a.localeCompare(b, "tr"));
}

export function applyFilters(
  products: Product[],
  filters: CatalogFilters
): Product[] {
  return products.filter((product) => {
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
