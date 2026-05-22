import fs from "fs/promises";
import path from "path";
import type { Product } from "@/types/product";

const PRODUCTS_PATH = path.join(process.cwd(), "src/data/products.json");
const BACKUP_DIR = path.join(process.cwd(), "src/data/backups");

export async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(raw) as Product[];
}

export async function writeProducts(products: Product[]): Promise<void> {
  await fs.mkdir(BACKUP_DIR, { recursive: true });

  try {
    const backupPath = path.join(BACKUP_DIR, `products-${Date.now()}.json`);
    await fs.copyFile(PRODUCTS_PATH, backupPath);
  } catch {
    // first write or missing file
  }

  await fs.writeFile(
    PRODUCTS_PATH,
    `${JSON.stringify(products, null, 2)}\n`,
    "utf-8"
  );
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((product) => product.id === id);
}

export async function updateProduct(
  id: number,
  patch: Partial<Product>
): Promise<Product | null> {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) return null;

  const updated: Product = { ...products[index], ...patch, id };
  products[index] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteProductsByIds(ids: number[]): Promise<{
  deleted: number;
  remaining: Product[];
}> {
  const products = await readProducts();
  const idSet = new Set(ids);
  const remaining = products.filter((product) => !idSet.has(product.id));
  const deleted = products.length - remaining.length;

  if (deleted > 0) {
    await writeProducts(remaining);
  }

  return { deleted, remaining };
}

export async function replaceProducts(products: Product[]): Promise<number> {
  const normalized = products.map((product, index) => ({
    ...product,
    id: product.id || index + 1,
  }));
  await writeProducts(normalized);
  return normalized.length;
}

export async function mergeProducts(incoming: Product[]): Promise<{
  added: number;
  updated: number;
  total: number;
}> {
  const existing = await readProducts();
  const bySku = new Map(existing.map((product) => [product.sku.toUpperCase(), product]));
  let added = 0;
  let updated = 0;
  let nextId = Math.max(0, ...existing.map((product) => product.id)) + 1;

  for (const item of incoming) {
    const skuKey = item.sku.toUpperCase();
    const current = bySku.get(skuKey);

    if (current) {
      Object.assign(current, item, { id: current.id });
      updated += 1;
    } else {
      const product = { ...item, id: item.id || nextId++ };
      existing.push(product);
      bySku.set(skuKey, product);
      added += 1;
    }
  }

  await writeProducts(existing);
  return { added, updated, total: existing.length };
}

export function getCatalogStats(products: Product[]) {
  const byCategory = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: products.length,
    withImage: products.filter((product) => product.image).length,
    withUrl: products.filter((product) => product.productUrl).length,
    byCategory,
  };
}
