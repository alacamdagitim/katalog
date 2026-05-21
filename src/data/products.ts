import rawProducts from "@/data/products.json";
import type { Product } from "@/types/product";

export const products: Product[] = rawProducts as unknown as Product[];
