"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { countActiveFilters } from "@/lib/filters";
import { useCatalogStore } from "@/stores/catalog-store";

export function CatalogHeader() {
  const resultsCount = useCatalogStore((s) => s.results.length);
  const filters = useCatalogStore((s) => s.filters);
  const setMobileFiltersOpen = useCatalogStore((s) => s.setMobileFiltersOpen);
  const activeCount = countActiveFilters(filters);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-[#f7f7f5]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white">
            K
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-neutral-900">
              Katalog
            </p>
            <p className="text-xs text-neutral-400">B2B Live Catalog</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-neutral-500 sm:block">
            {resultsCount} ürün
          </p>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtreler
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] text-white">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
