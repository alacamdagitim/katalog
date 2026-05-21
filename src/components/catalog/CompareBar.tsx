"use client";

import { GitCompareArrows, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/stores/catalog-store";

export function CompareBar() {
  const compareIds = useCatalogStore((s) => s.compareIds);
  const compareProducts = useCatalogStore((s) => s.getCompareProducts());
  const openCompare = useCatalogStore((s) => s.openCompare);
  const removeFromCompare = useCatalogStore((s) => s.removeFromCompare);
  const clearCompare = useCatalogStore((s) => s.clearCompare);

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-lg shadow-neutral-200/50 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-neutral-900">
            <GitCompareArrows className="h-4 w-4" />
            Karşılaştır ({compareIds.length}/4)
          </div>
          <div className="flex gap-2">
            {compareProducts.map((product) => (
              <span
                key={product.id}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700"
              >
                {product.sku}
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  className="text-neutral-400 hover:text-neutral-900"
                  aria-label={`${product.sku} kaldır`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Temizle
          </Button>
          <Button size="sm" onClick={openCompare} disabled={compareIds.length < 2}>
            Karşılaştır
          </Button>
        </div>
      </div>
    </div>
  );
}
