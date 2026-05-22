"use client";

import { ExternalLink, GitCompareArrows } from "lucide-react";
import { ProductImage } from "@/components/catalog/ProductImage";
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
  const compareIds = useCatalogStore((s) => s.compareIds);
  const inCompare = compareIds.includes(product.id);

  return (
    <article className="group relative">
      <button
        type="button"
        onClick={() => openProduct(product)}
        className={cn(
          "catalog-row flex w-full items-center gap-0 text-left group-hover:pr-12 sm:group-hover:pr-14",
          inCompare && "border-foreground bg-foreground text-background"
        )}
        aria-label={`${product.title} detay`}
      >
        <div className="relative h-11 w-11 shrink-0 border-r border-border bg-background sm:h-12 sm:w-12">
          <ProductImage
            src={product.image}
            alt={product.title}
            category={product.category}
            priority={index < 16}
            className="object-contain p-1"
          />
        </div>

        <div className="min-w-0 flex-1 px-3 py-2.5">
          <h3
            className={cn(
              "truncate text-sm font-medium leading-snug",
              inCompare ? "text-background" : "text-foreground"
            )}
          >
            {product.title}
          </h3>
          <p
            className={cn(
              "truncate type-meta",
              inCompare ? "text-background/70" : undefined
            )}
          >
            {product.sku}
          </p>
        </div>

        <p
          className={cn(
            "type-price shrink-0 border-l border-border px-3 py-2.5",
            inCompare ? "border-background/30 text-background" : undefined
          )}
        >
          {formatPrice(product.price)}
        </p>
      </button>

      <div className="absolute right-0 top-0 flex h-full flex-col border-l border-transparent opacity-0 transition-opacity group-hover:opacity-100">
        {product.productUrl && (
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 items-center justify-center border-b border-border bg-background px-1.5 text-muted-foreground hover:bg-foreground hover:text-background"
            aria-label="Sitede gör"
            title="Sitede gör"
          >
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          </a>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          className={cn(
            "flex flex-1 items-center justify-center bg-background px-1.5 text-muted-foreground hover:bg-foreground hover:text-background",
            inCompare && "bg-foreground text-background"
          )}
          aria-label={inCompare ? "Karşılaştırmadan çıkar" : "Karşılaştır"}
        >
          <GitCompareArrows className="h-3 w-3" strokeWidth={1.5} />
        </button>
      </div>
    </article>
  );
}
