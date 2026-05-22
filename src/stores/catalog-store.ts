"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { products as catalogProducts } from "@/data/products";
import { searchProducts } from "@/lib/search";
import type { CatalogFilters, Product } from "@/types/product";
import { EMPTY_FILTERS } from "@/types/product";

const MAX_COMPARE = 4;
const EMPTY_COMPARE_PRODUCTS: Product[] = [];

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
  setFilterValue: (key: keyof CatalogFilters, value: string | null) => void;
  clearFilters: () => void;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  toggleCompare: (productId: number) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  setMobileFiltersOpen: (open: boolean) => void;
  setProducts: (products: Product[]) => void;
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

  setFilterValue: (key, value) => {
    const { products, query, filters } = get();
    const nextFilters: CatalogFilters = {
      ...filters,
      [key]: value ? [value] : [],
    };

    if (key === "category") {
      nextFilters.type = [];
      nextFilters.volume = [];
    } else if (key === "type") {
      nextFilters.volume = [];
    }

    set({ filters: nextFilters, results: runSearch(products, query, nextFilters) });
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

  setProducts: (products) => {
    const { query, filters } = get();
    set({ products, results: runSearch(products, query, filters) });
  },

  getCompareProducts: () => {
    const { products, compareIds } = get();
    return compareIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  },

  isInCompare: (productId) => get().compareIds.includes(productId),
}));

export function useCompareProducts(): Product[] {
  const compareIds = useCatalogStore((state) => state.compareIds);
  const products = useCatalogStore((state) => state.products);

  return useMemo(() => {
    if (compareIds.length === 0) return EMPTY_COMPARE_PRODUCTS;

    return compareIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [compareIds, products]);
}
