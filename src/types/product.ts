export interface ProductVariant {
  name: string;
  sku: string;
  price: string;
}

export interface ProductPackaging {
  unit: string;
  quantity: number;
  dimensions?: string;
  weight?: string;
}

export interface Product {
  id: number;
  title: string;
  sku: string;
  category: string;
  type: string;
  material: string;
  volume: string;
  brand: string;
  printed: boolean;
  color: string;
  price: string;
  image: string;
  description?: string;
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  packaging?: ProductPackaging;
}

export interface CatalogFilters {
  type: string[];
  material: string[];
  volume: string[];
  brand: string[];
  printed: string[];
  color: string[];
}

export type FilterKey = keyof CatalogFilters;

export const FILTER_LABELS: Record<FilterKey, string> = {
  type: "Tür",
  material: "Materyal",
  volume: "Hacim",
  brand: "Marka",
  printed: "Baskılı/Baskısız",
  color: "Renk",
};

export const EMPTY_FILTERS: CatalogFilters = {
  type: [],
  material: [],
  volume: [],
  brand: [],
  printed: [],
  color: [],
};

export const TRENDING_SEARCHES = [
  "karton bardak",
  "kraft poşet",
  "sushi kutusu",
  "termal etiket",
  "PET şişe",
];

export const SUGGESTED_CATEGORIES = [
  "Karton Bardak",
  "Poşet & Ambalaj",
  "Gıda Kutuları",
  "Temizlik",
  "Servis Malzemeleri",
];
