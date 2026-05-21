"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useCatalogStore } from "@/stores/catalog-store";

export function ProductGrid() {
  const results = useCatalogStore((s) => s.results);
  const query = useCatalogStore((s) => s.query);

  if (results.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 px-6 py-16 text-center">
        <p className="text-lg font-medium text-neutral-900">Sonuç bulunamadı</p>
        <p className="mt-2 max-w-sm text-sm text-neutral-500">
          {query
            ? `"${query}" için eşleşen ürün yok. Farklı bir arama veya filtre deneyin.`
            : "Seçili filtrelere uygun ürün bulunamadı."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {results.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
