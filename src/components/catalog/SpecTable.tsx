import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface SpecTableProps {
  specifications: Record<string, string>;
  className?: string;
  compact?: boolean;
}

export function SpecTable({
  specifications,
  className,
  compact = false,
}: SpecTableProps) {
  const entries = Object.entries(specifications);

  if (entries.length === 0) return null;

  return (
    <div className={cn("overflow-hidden rounded-sm border border-border bg-background", className)}>
      <table className="w-full text-left">
        <tbody>
          {entries.map(([key, value], index) => (
            <tr
              key={key}
              className={cn(index !== entries.length - 1 && "border-b border-border")}
            >
              <th
                className={cn(
                  "w-1/3 bg-background type-caption font-medium",
                  compact ? "px-3 py-2.5" : "px-4 py-3"
                )}
              >
                {key}
              </th>
              <td
                className={cn(
                  "text-sm text-foreground",
                  compact ? "px-3 py-2.5" : "px-4 py-3"
                )}
              >
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompareSpecTable({ products }: { products: Product[] }) {
  const allKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specifications ?? {})))
  );

  const rows: { label: string; values: string[] }[] = [
    { label: "SKU", values: products.map((p) => p.sku) },
    { label: "Kategori", values: products.map((p) => p.category) },
    { label: "Tür", values: products.map((p) => p.type) },
    { label: "Materyal", values: products.map((p) => p.material) },
    { label: "Hacim", values: products.map((p) => p.volume) },
    { label: "Marka", values: products.map((p) => p.brand) },
    {
      label: "Baskı",
      values: products.map((p) => (p.printed ? "Baskılı" : "Baskısız")),
    },
    { label: "Renk", values: products.map((p) => p.color) },
    ...allKeys.map((key) => ({
      label: key,
      values: products.map((p) => p.specifications?.[key] ?? "—"),
    })),
  ];

  return (
    <div className="overflow-x-auto rounded-sm border border-border bg-background">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            <th className="sticky left-0 z-10 bg-background px-3 py-2.5 type-caption font-medium">
              Özellik
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                className="min-w-[160px] border-l border-border px-3 py-2.5 text-sm font-semibold text-foreground"
              >
                {product.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={cn(index !== rows.length - 1 && "border-b border-border")}
            >
              <td className="sticky left-0 z-10 bg-background px-3 py-2.5 type-caption font-medium">
                {row.label}
              </td>
              {row.values.map((value, i) => (
                <td key={i} className="border-l border-border px-3 py-2.5 text-foreground">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
