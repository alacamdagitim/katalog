"use client";

import { FileDown, GitCompareArrows, Package } from "lucide-react";
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
        <div className="relative aspect-[16/10] w-full bg-neutral-100">
          <ProductImage
            src={product.image}
            alt={product.title}
            category={product.category}
            priority
          />
        </div>

        <div className="px-6 pb-8">
          <SheetHeader className="px-0 pt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              {product.category} · {product.sku}
            </p>
            <SheetTitle className="text-2xl leading-tight">{product.title}</SheetTitle>
            {product.description && (
              <SheetDescription className="text-base leading-relaxed">
                {product.description}
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-2xl font-semibold tracking-tight text-neutral-900">
              {formatPrice(product.price)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  inCompare && "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                )}
                onClick={() => toggleCompare(product.id)}
              >
                <GitCompareArrows className="h-4 w-4" />
                {inCompare ? "Karşılaştırmada" : "Karşılaştır"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <FileDown className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          {product.specifications && (
            <section className="mb-8">
              <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                Teknik Özellikler
              </h3>
              <SpecTable specifications={product.specifications} />
            </section>
          )}

          {product.variants && product.variants.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-4 text-sm font-semibold text-neutral-900">Varyantlar</h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.sku}
                    className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{variant.name}</p>
                      <p className="font-mono text-xs text-neutral-400">{variant.sku}</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {formatPrice(variant.price)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {product.packaging && (
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <Package className="h-4 w-4 text-neutral-400" />
                Paketleme Detayları
              </h3>
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200/80 bg-white p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-neutral-400">Birim</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">
                    {product.packaging.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Adet</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900">
                    {product.packaging.quantity.toLocaleString("tr-TR")}
                  </p>
                </div>
                {product.packaging.dimensions && (
                  <div>
                    <p className="text-xs text-neutral-400">Boyut</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {product.packaging.dimensions}
                    </p>
                  </div>
                )}
                {product.packaging.weight && (
                  <div>
                    <p className="text-xs text-neutral-400">Ağırlık</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
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
