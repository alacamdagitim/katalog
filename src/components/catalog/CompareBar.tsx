"use client";

import { useMemo } from "react";
import { GitCompareArrows, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/stores/catalog-store";
import type { Product } from "@/types/product";

const EMPTY_COMPARE: Product[] = [];

export function CompareBar() {
  const compareIds = useCatalogStore((s) => s.compareIds);
  const products = useCatalogStore((s) => s.products);
  const openCompare = useCatalogStore((s) => s.openCompare);
  const removeFromCompare = useCatalogStore((s) => s.removeFromCompare);
  const clearCompare = useCatalogStore((s) => s.clearCompare);

  const compareProducts = useMemo(() => {
    if (compareIds.length === 0) return EMPTY_COMPARE;

    return compareIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [compareIds, products]);

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-0 sm:flex-row sm:items-stretch">
        <div className="flex flex-1 items-center gap-3 overflow-x-auto border-b border-border px-4 py-2 sm:border-b-0 sm:border-r">
          <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-foreground">
            <GitCompareArrows className="h-3.5 w-3.5" strokeWidth={1.5} />
            Karşılaştır · {compareIds.length}/4
          </div>
          <div className="flex gap-px">
            {compareProducts.map((product) => (
              <span
                key={product.id}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1.5 type-meta"
              >
                {product.sku}
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`${product.sku} kaldır`}
                >
                  <X className="h-3 w-3" strokeWidth={1.5} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompare}
            className="h-full border-r border-border px-4"
          >
            Temizle
          </Button>
          <Button
            size="sm"
            onClick={openCompare}
            disabled={compareIds.length < 2}
            className="h-full px-5"
          >
            Karşılaştır
          </Button>
        </div>
      </div>
    </div>
  );
}
