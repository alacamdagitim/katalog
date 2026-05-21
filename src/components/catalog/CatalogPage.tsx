"use client";

import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { CategorySection } from "@/components/catalog/CategorySection";
import { CompareBar } from "@/components/catalog/CompareBar";
import { CompareDrawer } from "@/components/catalog/CompareDrawer";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { MobileFilterSheet } from "@/components/catalog/MobileFilterSheet";
import { ProductDrawer } from "@/components/catalog/ProductDrawer";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SearchHero } from "@/components/catalog/SearchHero";

export function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] pb-24">
      <CatalogHeader />
      <SearchHero />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-10 pb-16 pt-4 lg:pt-8">
          <div className="hidden w-56 shrink-0 lg:block xl:w-64">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <CategorySection className="mb-6" />
            <ProductGrid />
          </div>
        </div>
      </main>

      <CompareBar />
      <ProductDrawer />
      <CompareDrawer />
      <MobileFilterSheet />
    </div>
  );
}
