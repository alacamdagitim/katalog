"use client";

import { FileDown, X } from "lucide-react";
import { CompareSpecTable } from "@/components/catalog/SpecTable";
import { ProductImage } from "@/components/catalog/ProductImage";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";

export function CompareDrawer() {
  const isOpen = useCatalogStore((s) => s.isCompareDrawerOpen);
  const closeCompare = useCatalogStore((s) => s.closeCompare);
  const compareProducts = useCatalogStore((s) => s.getCompareProducts());
  const removeFromCompare = useCatalogStore((s) => s.removeFromCompare);
  const clearCompare = useCatalogStore((s) => s.clearCompare);

  const handleExportPdf = () => {
    const ids = compareProducts.map((p) => p.id).join(",");
    window.open(`/print/catalog?ids=${ids}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCompare()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-4xl lg:max-w-6xl"
      >
        <div className="sticky top-0 z-10 border-b border-neutral-200 bg-[#fafafa]/95 px-6 py-5 backdrop-blur-sm">
          <SheetHeader className="px-0 pt-0">
            <SheetTitle>Ürün Karşılaştırma</SheetTitle>
            <SheetDescription>
              {compareProducts.length} ürün yan yana karşılaştırılıyor
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleExportPdf}>
              <FileDown className="h-4 w-4" />
              PDF Dışa Aktar
            </Button>
            <Button size="sm" variant="ghost" onClick={clearCompare}>
              Tümünü temizle
            </Button>
          </div>
        </div>

        <div className="space-y-8 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {compareProducts.map((product) => (
              <div
                key={product.id}
                className="relative overflow-hidden rounded-xl border border-neutral-200/80 bg-white"
              >
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute right-2 top-2 z-10 rounded-md bg-white/90 p-1 text-neutral-400 transition-colors hover:text-neutral-900"
                  aria-label="Kaldır"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative aspect-[4/3] bg-neutral-50">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    category={product.category}
                  />
                </div>
                <div className="p-4">
                  <p className="font-mono text-xs text-neutral-400">{product.sku}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-neutral-900">
                    {product.title}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-900">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <CompareSpecTable products={compareProducts} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
