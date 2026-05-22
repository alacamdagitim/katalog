"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import {
  groupProductsByCategory,
  isCatalogBrowseMode,
} from "@/lib/filters";
import { useCatalogStore } from "@/stores/catalog-store";
import type { Product } from "@/types/product";

function ProductRowGrid({
  products,
  startIndex = 0,
}: {
  products: Product[];
  startIndex?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={startIndex + index}
        />
      ))}
    </div>
  );
}

export function ProductGrid() {
  const results = useCatalogStore((s) => s.results);
  const query = useCatalogStore((s) => s.query);
  const filters = useCatalogStore((s) => s.filters);
  const browsing = isCatalogBrowseMode(query, filters);

  if (results.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-sm border border-dashed border-border bg-background px-6 py-14 text-center">
        <p className="type-title">Sonuç bulunamadı</p>
        <p className="mt-2 max-w-sm type-caption">
          {query
            ? `"${query}" için eşleşen ürün yok.`
            : "Seçili filtrelere uygun ürün bulunamadı."}
        </p>
      </div>
    );
  }

  if (browsing) {
    const grouped = groupProductsByCategory(results);
    let index = 0;

    return (
      <div className="overflow-hidden rounded-sm border border-border bg-background">
        {grouped.map(([category, products]) => {
          const sectionStart = index;
          index += products.length;

          return (
            <section
              key={category}
              id={`kategori-${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="flex items-center justify-between border-b border-border bg-background px-3 py-2">
                <div className="flex items-baseline gap-3">
                  <span className="catalog-label">Marka</span>
                  <h2 className="type-title">{category}</h2>
                </div>
                <span className="type-meta tabular-nums">
                  {products.length}
                </span>
              </div>
              <ProductRowGrid products={products} startIndex={sectionStart} />
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border bg-background px-3 py-2">
        <span className="catalog-label">Sonuçlar</span>
        <span className="type-meta font-medium tabular-nums text-foreground">
          {results.length}
        </span>
      </div>
      <ProductRowGrid products={results} />
    </div>
  );
}
