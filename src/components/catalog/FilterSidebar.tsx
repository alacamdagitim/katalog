"use client";

import { countActiveFilters, getFilterOptions } from "@/lib/filters";
import { useCatalogStore } from "@/stores/catalog-store";
import { FILTER_LABELS, type FilterKey } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const FILTER_KEYS: FilterKey[] = [
  "type",
  "material",
  "volume",
  "brand",
  "printed",
  "color",
];

interface FilterSidebarProps {
  className?: string;
  onClose?: () => void;
}

export function FilterSidebar({ className, onClose }: FilterSidebarProps) {
  const products = useCatalogStore((s) => s.products);
  const filters = useCatalogStore((s) => s.filters);
  const toggleFilter = useCatalogStore((s) => s.toggleFilter);
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const activeCount = countActiveFilters(filters);

  return (
    <aside className={className}>
      <div className="flex items-center justify-between px-1 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Filtreler</h2>
          {activeCount > 0 && (
            <p className="mt-0.5 text-xs text-neutral-400">
              {activeCount} aktif filtre
            </p>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearFilters();
              onClose?.();
            }}
            className="h-8 text-xs text-neutral-500"
          >
            Temizle
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-3 lg:h-[calc(100vh-16rem)]">
        <div className="space-y-6">
          {FILTER_KEYS.map((key, index) => {
            const options = getFilterOptions(products, key);
            if (options.length === 0) return null;

            return (
              <div key={key}>
                {index > 0 && <Separator className="mb-6" />}
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {FILTER_LABELS[key]}
                </h3>
                <div className="space-y-2.5">
                  {options.map((option) => {
                    const checked = filters[key].includes(option);
                    return (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-neutral-100/80"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleFilter(key, option)}
                        />
                        <span className="text-sm text-neutral-700">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
