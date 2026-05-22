"use client";

import { ExternalLink, FileDown, GitCompareArrows, Package } from "lucide-react";
import { ProductImage } from "@/components/catalog/ProductImage";
import { SpecTable } from "@/components/catalog/SpecTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn, formatPrice } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";

export function ProductDrawer() {
  const product = useCatalogStore((s) => s.selectedProduct);
  const isOpen = useCatalogStore((s) => s.isProductDrawerOpen);
  const closeProduct = useCatalogStore((s) => s.closeProduct);
  const toggleCompare = useCatalogStore((s) => s.toggleCompare);
  const isInCompare = useCatalogStore((s) => s.isInCompare);

  if (!product) return null;

  const inCompare = isInCompare(product.id);

  const handleExportPdf = () => {
    const url = `/print/catalog?ids=${product.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeProduct()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl lg:max-w-2xl">
        <div className="relative aspect-square w-full border-b border-border bg-background">
          <ProductImage
            src={product.image}
            alt={product.title}
            category={product.category}
            priority
            className="p-6"
          />
        </div>

        <div className="px-5 pb-8">
          <SheetHeader className="px-0 pt-5">
            <p className="catalog-label">
              {product.category} / {product.sku}
            </p>
            <SheetTitle className="type-display text-xl">{product.title}</SheetTitle>
            {product.description && (
              <SheetDescription>{product.description}</SheetDescription>
            )}
          </SheetHeader>

          <div className="mt-5 flex items-stretch justify-between gap-4 overflow-hidden rounded-sm border border-border">
            <p className="type-price flex items-center border-r border-border px-4 py-3 text-lg">
              {formatPrice(product.price)}
            </p>
            <div className="flex flex-wrap">
              {product.productUrl && (
                <Button variant="ghost" size="sm" asChild className="border-l border-border">
                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Sitede Gör
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "border-l border-border",
                  inCompare && "bg-foreground text-background hover:bg-foreground hover:text-background"
                )}
                onClick={() => toggleCompare(product.id)}
              >
                <GitCompareArrows className="h-3.5 w-3.5" />
                {inCompare ? "Seçili" : "Karşılaştır"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExportPdf} className="border-l border-border">
                <FileDown className="h-3.5 w-3.5" />
                PDF
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {product.specifications && (
            <section className="mb-6">
              <h3 className="catalog-label mb-3 border-b border-border pb-2">
                Teknik Özellikler
              </h3>
              <SpecTable specifications={product.specifications} />
            </section>
          )}

          {product.variants && product.variants.length > 0 && (
            <section className="mb-6">
              <h3 className="catalog-label mb-3 border-b border-border pb-2">Varyantlar</h3>
              <div className="divide-y divide-border overflow-hidden rounded-sm border border-border">
                {product.variants.map((variant) => (
                  <div
                    key={variant.sku}
                    className="flex items-center justify-between bg-background px-4 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{variant.name}</p>
                      <p className="type-meta">{variant.sku}</p>
                    </div>
                    <p className="type-price text-sm">
                      {formatPrice(variant.price)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {product.packaging && (
            <section>
              <h3 className="catalog-label mb-3 flex items-center gap-2 border-b border-border pb-2">
                <Package className="h-3.5 w-3.5" strokeWidth={1.5} />
                Paketleme
              </h3>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
                <div className="bg-background p-3">
                  <p className="catalog-label">Birim</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {product.packaging.unit}
                  </p>
                </div>
                <div className="bg-background p-3">
                  <p className="catalog-label">Adet</p>
                  <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
                    {product.packaging.quantity.toLocaleString("tr-TR")}
                  </p>
                </div>
                {product.packaging.dimensions && (
                  <div className="bg-background p-3">
                    <p className="catalog-label">Boyut</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {product.packaging.dimensions}
                    </p>
                  </div>
                )}
                {product.packaging.weight && (
                  <div className="bg-background p-3">
                    <p className="catalog-label">Ağırlık</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {product.packaging.weight}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
