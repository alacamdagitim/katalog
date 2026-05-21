"use client";

import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCatalogStore } from "@/stores/catalog-store";

export function MobileFilterSheet() {
  const isOpen = useCatalogStore((s) => s.isMobileFiltersOpen);
  const setMobileFiltersOpen = useCatalogStore((s) => s.setMobileFiltersOpen);

  return (
    <Sheet open={isOpen} onOpenChange={setMobileFiltersOpen}>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Filtreler</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-1">
          <FilterSidebar onClose={() => setMobileFiltersOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
