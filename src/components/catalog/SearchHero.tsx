"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCatalogStore } from "@/stores/catalog-store";

export function SearchHero() {
  const query = useCatalogStore((s) => s.query);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const resultsCount = useCatalogStore((s) => s.results.length);

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-stretch gap-0 overflow-hidden rounded-sm border border-border bg-background">
          <div className="flex w-10 shrink-0 items-center justify-center border-r border-border bg-background">
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün, SKU veya marka ara"
            className="h-10 flex-1 border-0 bg-transparent px-3 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            aria-label="Ürün ara"
          />
          {query && (
            <div className="flex items-center border-l border-border px-3 text-xs font-medium tabular-nums text-foreground">
              {resultsCount}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
