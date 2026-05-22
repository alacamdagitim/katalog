"use client";

import { FilterDropdowns } from "@/components/catalog/FilterDropdowns";
import { useCatalogStore } from "@/stores/catalog-store";

export function CatalogToolbar() {
  const resultsCount = useCatalogStore((s) => s.results.length);
  const query = useCatalogStore((s) => s.query);

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-0 sm:flex-row sm:items-stretch sm:px-6 lg:px-8">
        <div className="flex items-center border-b border-border px-4 py-2.5 sm:w-48 sm:border-b-0 sm:border-r sm:px-0 sm:pl-0">
          <p className="text-sm text-muted-foreground">
            {query ? (
              <>
                <span className="font-semibold text-foreground">{resultsCount}</span> sonuç
              </>
            ) : (
              <>
                <span className="font-semibold text-foreground">{resultsCount}</span> ürün
              </>
            )}
          </p>
        </div>

        <div className="flex flex-1 items-center px-4 py-2.5 sm:px-4">
          <FilterDropdowns />
        </div>
      </div>
    </div>
  );
}
