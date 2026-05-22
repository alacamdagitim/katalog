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
  productUrl?: string;
  description?: string;
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  packaging?: ProductPackaging;
}

export interface CatalogFilters {
  category: string[];
  type: string[];
  material: string[];
  volume: string[];
  brand: string[];
  printed: string[];
  color: string[];
}

export type FilterKey = keyof CatalogFilters;

export const FILTER_LABELS: Record<FilterKey, string> = {
  category: "Marka",
  type: "Tür",
  material: "Materyal",
  volume: "Hacim",
  brand: "Marka",
  printed: "Baskılı/Baskısız",
  color: "Renk",
};

export const TOOLBAR_FILTER_KEYS: FilterKey[] = [
  "category",
  "type",
  "volume",
];

export const EMPTY_FILTERS: CatalogFilters = {
  category: [],
  type: [],
  material: [],
  volume: [],
  brand: [],
  printed: [],
  color: [],
};

export const TRENDING_SEARCHES = [
  "espresso makinesi",
  "filtre kahve",
  "demlik poşet çay",
  "barista ekipman",
  "unicomix",
];

export const SUGGESTED_CATEGORIES = [
  "Unicomix",
  "Fo",
  "Limpo",
  "Repo",
  "The Coffee Warehouse",
  "Süzer Çay",
  "Ünver",
  "Başaraslan",
  "City Çay",
];

export const SUPPLIER_ORDER = [
  "Unicomix",
  "Fo",
  "Limpo",
  "Repo",
  "The Coffee Warehouse",
  "Süzer Çay",
  "Ünver",
  "Başaraslan",
  "City Çay",
];
