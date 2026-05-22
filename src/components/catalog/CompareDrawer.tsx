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
import { useCatalogStore, useCompareProducts } from "@/stores/catalog-store";

export function CompareDrawer() {
  const isOpen = useCatalogStore((s) => s.isCompareDrawerOpen);
  const closeCompare = useCatalogStore((s) => s.closeCompare);
  const compareProducts = useCompareProducts();
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
        <div className="sticky top-0 z-10 border-b border-border bg-background px-5 py-4">
          <SheetHeader className="px-0 pt-0">
            <SheetTitle className="type-title">Ürün karşılaştırma</SheetTitle>
            <SheetDescription>
              {compareProducts.length} ürün
            </SheetDescription>
          </SheetHeader>
          <div className="mt-3 flex overflow-hidden rounded-sm border border-border">
            <Button size="sm" variant="ghost" onClick={handleExportPdf} className="border-r border-border">
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={clearCompare}>
              Temizle
            </Button>
          </div>
        </div>

        <div className="space-y-0 px-0 py-0">
          <div className="grid gap-px border-b border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {compareProducts.map((product) => (
              <div key={product.id} className="relative bg-background">
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center border-b border-l border-border bg-background text-muted-foreground hover:bg-foreground hover:text-background"
                  aria-label="Kaldır"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <div className="relative aspect-square border-b border-border bg-background">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    category={product.category}
                    className="p-4"
                  />
                </div>
                <div className="p-3">
                  <p className="type-meta">{product.sku}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-foreground">
                    {product.title}
                  </p>
                  <p className="type-price mt-2 text-sm">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5">
            <CompareSpecTable products={compareProducts} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
