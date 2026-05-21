"use client";

import { Eye, GitCompareArrows } from "lucide-react";
import { ProductImage } from "@/components/catalog/ProductImage";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { useCatalogStore } from "@/stores/catalog-store";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const openProduct = useCatalogStore((s) => s.openProduct);
  const toggleCompare = useCatalogStore((s) => s.toggleCompare);
  const isInCompare = useCatalogStore((s) => s.isInCompare);
  const inCompare = isInCompare(product.id);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/70 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300/80 hover:shadow-lg hover:shadow-neutral-200/40"
    >
      <button
        type="button"
        onClick={() => openProduct(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50"
      >
        <ProductImage
          src={product.image}
          alt={product.title}
          category={product.category}
          priority={index < 4}
          className="group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              {product.category}
            </p>
            <h3 className="mt-1 line-clamp-2 text-base font-medium leading-snug text-neutral-900 sm:text-lg">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500">
          <span className="font-mono text-xs text-neutral-400">{product.sku}</span>
          <span className="text-neutral-300">·</span>
          <span>{product.material}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight text-neutral-900">
            {formatPrice(product.price)}
          </p>

          <div className="flex items-center gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-xl",
                inCompare && "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
              )}
              onClick={() => toggleCompare(product.id)}
              aria-label={inCompare ? "Karşılaştırmadan çıkar" : "Karşılaştır"}
              title={inCompare ? "Karşılaştırmadan çıkar" : "Karşılaştır"}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => openProduct(product)}
              aria-label="Önizle"
              title="Önizle"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
