"use client";

import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { CompareBar } from "@/components/catalog/CompareBar";
import { CompareDrawer } from "@/components/catalog/CompareDrawer";
import { ProductDrawer } from "@/components/catalog/ProductDrawer";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CatalogBootstrap } from "@/components/catalog/CatalogBootstrap";
import { SearchHero } from "@/components/catalog/SearchHero";

export function CatalogPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <CatalogBootstrap />
      <CatalogHeader />
      <SearchHero />
      <CatalogToolbar />

      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
        <ProductGrid />
      </main>

      <CompareBar />
      <ProductDrawer />
      <CompareDrawer />
    </div>
  );
}
