"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { AdminHeaderLogin } from "@/components/catalog/AdminHeaderLogin";

export function CatalogHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <BrandLogo priority />

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-muted-foreground md:block">
            KDV hariç
          </p>
          <AdminHeaderLogin />
        </div>
      </div>
    </header>
  );
}
