import type { Product } from "@/types/product";

const EXPORT_HEADERS = [
  "id",
  "title",
  "sku",
  "category",
  "brand",
  "type",
  "material",
  "volume",
  "price",
  "image",
  "productUrl",
  "description",
  "printed",
  "color",
] as const;

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function productsToCsv(products: Product[]): string {
  const lines = [EXPORT_HEADERS.join(",")];

  for (const product of products) {
    lines.push(
      EXPORT_HEADERS.map((header) => {
        if (header === "printed") return product.printed ? "true" : "false";
        const value = product[header];
        return escapeCsv(value == null ? "" : String(value));
      }).join(",")
    );
  }

  return `${lines.join("\n")}\n`;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(current);
      current = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function rowToProduct(row: Record<string, string>, fallbackId: number): Product | null {
  const title = row.title?.trim();
  const sku = row.sku?.trim();

  if (!title || !sku) return null;

  return {
    id: Number(row.id) || fallbackId,
    title,
    sku,
    category: row.category?.trim() || "Genel",
    brand: row.brand?.trim() || row.category?.trim() || "Genel",
    type: row.type?.trim() || "Ürün",
    material: row.material?.trim() || "-",
    volume: row.volume?.trim() || "-",
    price: row.price?.trim() || "0.00",
    image: row.image?.trim() || "",
    productUrl: row.productUrl?.trim() || undefined,
    description: row.description?.trim() || undefined,
    printed: row.printed === "true",
    color: row.color?.trim() || "-",
    specifications: {
      Marka: row.brand?.trim() || row.category?.trim() || "Genel",
      Tür: row.type?.trim() || "Ürün",
    },
  };
}

export function csvToProducts(text: string, startId = 1): Product[] {
  const rows = parseCsv(text.trim());
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());
  const products: Product[] = [];
  let nextId = startId;

  for (const values of rows.slice(1)) {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });

    const product = rowToProduct(record, nextId);
    if (!product) continue;

    if (!record.id) nextId += 1;
    products.push(product);
  }

  return products;
}

export function parseUploadedProducts(
  text: string,
  filename: string,
  startId = 1
): Product[] {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".json")) {
    const parsed = JSON.parse(text) as Product[] | { products: Product[] };
    return Array.isArray(parsed) ? parsed : parsed.products;
  }

  return csvToProducts(text, startId);
}
