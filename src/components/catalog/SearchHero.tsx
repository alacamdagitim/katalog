"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCatalogStore } from "@/stores/catalog-store";
import {
  SUGGESTED_CATEGORIES,
  TRENDING_SEARCHES,
} from "@/types/product";

export function SearchHero() {
  const query = useCatalogStore((s) => s.query);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const resultsCount = useCatalogStore((s) => s.results.length);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
      <div className="mb-8 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
          B2B Katalog
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          Ürün keşfi,
          <span className="text-neutral-400"> anında.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-neutral-500 sm:text-lg">
          HORECA ve toptan ürün kataloğunuz. SKU, kategori veya marka ile arayın.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün, SKU veya kategori ara..."
          className="h-14 rounded-2xl border-neutral-200/80 bg-white pl-14 pr-5 text-base shadow-sm shadow-neutral-200/50 transition-shadow focus-visible:shadow-md focus-visible:shadow-neutral-200/60 sm:h-16 sm:text-lg"
          aria-label="Ürün ara"
        />
      </div>

      {query && (
        <p className="mt-3 text-center text-sm text-neutral-400">
          {resultsCount} sonuç bulundu
        </p>
      )}

      <div className="mt-8 space-y-5">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
            Önerilen kategoriler
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setQuery(category)}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98]"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
            Popüler aramalar
          </p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
