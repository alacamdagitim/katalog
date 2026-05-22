"use client";

import { ChevronDown } from "lucide-react";
import { countActiveFilters, getFilterOptions } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";
import { FILTER_LABELS, TOOLBAR_FILTER_KEYS } from "@/types/product";

export function FilterDropdowns() {
  const products = useCatalogStore((s) => s.products);
  const filters = useCatalogStore((s) => s.filters);
  const setFilterValue = useCatalogStore((s) => s.setFilterValue);
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="flex flex-wrap items-center gap-0">
      {TOOLBAR_FILTER_KEYS.map((key, index) => {
        const options = getFilterOptions(products, key, filters);
        if (options.length === 0) return null;

        const value = filters[key][0] ?? "";
        const selectedInvalid = value && !options.includes(value);
        const displayValue = selectedInvalid ? "" : value;

        return (
          <label
            key={key}
            className={cn(
              "relative shrink-0",
              index > 0 && "border-l border-border"
            )}
          >
            <span className="sr-only">{FILTER_LABELS[key]}</span>
            <select
              value={displayValue}
              onChange={(e) => setFilterValue(key, e.target.value || null)}
              className={cn(
                "h-9 min-w-[120px] appearance-none border-0 bg-transparent py-0 pl-3 pr-7 text-sm font-medium outline-none",
                displayValue ? "text-foreground" : "text-muted-foreground"
              )}
              aria-label={FILTER_LABELS[key]}
            >
              <option value="">{FILTER_LABELS[key]}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
          </label>
        );
      })}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="ml-2 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
        >
          Temizle
        </button>
      )}
    </div>
  );
}
