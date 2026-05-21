"use client";

import { create } from "zustand";
import { products as catalogProducts } from "@/data/products";
import { searchProducts } from "@/lib/search";
import type { CatalogFilters, Product } from "@/types/product";
import { EMPTY_FILTERS } from "@/types/product";

const MAX_COMPARE = 4;

interface CatalogState {
  products: Product[];
  query: string;
  filters: CatalogFilters;
  results: Product[];
  selectedProduct: Product | null;
  compareIds: number[];
  isProductDrawerOpen: boolean;
  isCompareDrawerOpen: boolean;
  isMobileFiltersOpen: boolean;
  setQuery: (query: string) => void;
  setFilters: (filters: CatalogFilters) => void;
  toggleFilter: (key: keyof CatalogFilters, value: string) => void;
  clearFilters: () => void;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  toggleCompare: (productId: number) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  setMobileFiltersOpen: (open: boolean) => void;
  getCompareProducts: () => Product[];
  isInCompare: (productId: number) => boolean;
}

function runSearch(
  products: Product[],
  query: string,
  filters: CatalogFilters
): Product[] {
  return searchProducts(products, query, filters).products;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: catalogProducts,
  query: "",
  filters: { ...EMPTY_FILTERS },
  results: catalogProducts,
  selectedProduct: null,
  compareIds: [],
  isProductDrawerOpen: false,
  isCompareDrawerOpen: false,
  isMobileFiltersOpen: false,

  setQuery: (query) => {
    const { products, filters } = get();
    set({ query, results: runSearch(products, query, filters) });
  },

  setFilters: (filters) => {
    const { products, query } = get();
    set({ filters, results: runSearch(products, query, filters) });
  },

  toggleFilter: (key, value) => {
    const { products, query, filters } = get();
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    const newFilters = { ...filters, [key]: next };
    set({ filters: newFilters, results: runSearch(products, query, newFilters) });
  },

  clearFilters: () => {
    const { products, query } = get();
    set({
      filters: { ...EMPTY_FILTERS },
      results: runSearch(products, query, EMPTY_FILTERS),
    });
  },

  openProduct: (product) =>
    set({ selectedProduct: product, isProductDrawerOpen: true }),

  closeProduct: () =>
    set({ selectedProduct: null, isProductDrawerOpen: false }),

  toggleCompare: (productId) => {
    const { compareIds } = get();
    if (compareIds.includes(productId)) {
      set({ compareIds: compareIds.filter((id) => id !== productId) });
      return;
    }
    if (compareIds.length >= MAX_COMPARE) return;
    set({ compareIds: [...compareIds, productId] });
  },

  removeFromCompare: (productId) => {
    set({ compareIds: get().compareIds.filter((id) => id !== productId) });
  },

  clearCompare: () => set({ compareIds: [], isCompareDrawerOpen: false }),

  openCompare: () => set({ isCompareDrawerOpen: true }),

  closeCompare: () => set({ isCompareDrawerOpen: false }),

  setMobileFiltersOpen: (open) => set({ isMobileFiltersOpen: open }),

  getCompareProducts: () => {
    const { products, compareIds } = get();
    return compareIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  },

  isInCompare: (productId) => get().compareIds.includes(productId),
}));
