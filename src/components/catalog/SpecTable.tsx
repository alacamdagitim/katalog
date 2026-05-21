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
    <div className={cn("overflow-hidden rounded-xl border border-neutral-200/80 bg-white", className)}>
      <table className="w-full text-left">
        <tbody>
          {entries.map(([key, value], index) => (
            <tr
              key={key}
              className={cn(
                index !== entries.length - 1 && "border-b border-neutral-100"
              )}
            >
              <th
                className={cn(
                  "font-medium text-neutral-500",
                  compact ? "px-4 py-2.5 text-xs" : "px-5 py-3.5 text-sm"
                )}
              >
                {key}
              </th>
              <td
                className={cn(
                  "text-neutral-900",
                  compact ? "px-4 py-2.5 text-xs" : "px-5 py-3.5 text-sm"
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
    new Set(
      products.flatMap((p) => Object.keys(p.specifications ?? {}))
    )
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
    <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50/80">
            <th className="sticky left-0 z-10 bg-neutral-50/95 px-4 py-3 font-medium text-neutral-500">
              Özellik
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                className="min-w-[160px] px-4 py-3 font-medium text-neutral-900"
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
              className={cn(index !== rows.length - 1 && "border-b border-neutral-100")}
            >
              <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-neutral-500">
                {row.label}
              </td>
              {row.values.map((value, i) => (
                <td key={i} className="px-4 py-3 text-neutral-800">
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
