"use client";

import { useCatalogStore } from "@/stores/catalog-store";

interface CategorySectionProps {
  className?: string;
}

export function CategorySection({ className }: CategorySectionProps) {
  const results = useCatalogStore((s) => s.results);
  const query = useCatalogStore((s) => s.query);

  const categories = results.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  if (sorted.length <= 1) return null;

  return (
    <div className={className}>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
        Kategori dağılımı
      </p>
      <div className="flex flex-wrap gap-2">
        {sorted.map(([category, count]) => (
          <span
            key={category}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-600"
          >
            {category}
            <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-500">
              {count}
            </span>
          </span>
        ))}
      </div>
      {query && (
        <p className="mt-3 text-xs text-neutral-400">
          &ldquo;{query}&rdquo; araması için {results.length} ürün listeleniyor
        </p>
      )}
    </div>
  );
}
