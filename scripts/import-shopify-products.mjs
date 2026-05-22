import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const CSV_PATH = process.argv[2] || path.join(process.env.HOME, "Downloads/products_export_1 18.csv");
const OUTPUT = path.join(root, "src/data/products.json");
const STORE_BASE = "https://www.alacamdagitim.com";

const VENDOR_MAP = {
  Unicomix: "Unicomix",
  FO: "Fo",
  REPO: "Repo",
  "The Coffe Warehouse": "The Coffee Warehouse",
  "Süzer Çay": "Süzer Çay",
  "Ünver Çay": "Ünver",
  "Çay City": "City Çay",
  "Başarslan Vera": "Başaraslan",
};

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cur += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cur);
      cur = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else {
      cur += char;
    }
  }

  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }

  return rows;
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

function lastCategorySegment(value) {
  if (!value) return "Genel";
  const parts = value.split(">").map((part) => part.trim());
  return parts[parts.length - 1] || "Genel";
}

function parsePrice(value) {
  const num = parseFloat(String(value || "0").replace(",", "."));
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
}

const rows = parseCSV(fs.readFileSync(CSV_PATH, "utf8"));
const headers = rows[0];
const index = Object.fromEntries(headers.map((header, i) => [header, i]));

const products = [];
let id = 1;

for (const row of rows.slice(1)) {
  const title = row[index.Title]?.trim();
  const handle = row[index.Handle]?.trim();
  const vendor = row[index.Vendor]?.trim();
  const brand = VENDOR_MAP[vendor];

  if (!title || !handle || !brand) continue;
  if (row[index.Status] !== "active" || row[index.Published] !== "true") continue;

  const image = row[index["Image Src"]]?.trim();
  if (!image) continue;

  const type = row[index.Type]?.trim() || "Ürün";
  const sku = row[index["Variant SKU"]]?.trim() || handle.toUpperCase();
  const optionValue = row[index["Option1 Value"]]?.trim();
  const productCategory = row[index["Product Category"]]?.trim();

  products.push({
    id: id++,
    title,
    sku,
    category: brand,
    type,
    material: lastCategorySegment(productCategory),
    volume: optionValue && optionValue !== "Default Title" ? optionValue : "-",
    brand,
    printed: /bask/i.test(title),
    color: "-",
    price: parsePrice(row[index["Variant Price"]]),
    image,
    productUrl: `${STORE_BASE}/products/${handle}`,
    description: stripHtml(row[index["Body (HTML)"]]),
    specifications: {
      Marka: brand,
      Tür: type,
      Kategori: lastCategorySegment(productCategory),
      Durum: "Aktif",
    },
  });
}

products.sort((a, b) => a.category.localeCompare(b.category, "tr") || a.title.localeCompare(b.title, "tr"));

fs.writeFileSync(OUTPUT, `${JSON.stringify(products, null, 2)}\n`);
console.log(`Imported ${products.length} products -> ${OUTPUT}`);

const byBrand = products.reduce((acc, product) => {
  acc[product.brand] = (acc[product.brand] || 0) + 1;
  return acc;
}, {});
console.log(byBrand);
