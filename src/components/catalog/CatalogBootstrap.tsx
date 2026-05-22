"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/stores/catalog-store";
import type { Product } from "@/types/product";

export function CatalogBootstrap() {
  const setProducts = useCatalogStore((state) => state.setProducts);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data: { products: Product[] }) => {
        if (Array.isArray(data.products) && data.products.length) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // static fallback already loaded in store
      });
  }, [setProducts]);

  return null;
}
