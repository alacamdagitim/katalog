"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

export function ProductAdminTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/products");
    const data = (await response.json()) as { products: Product[] };
    setProducts(data.products ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((product) => selected.has(product.id));

  function toggleAll(checked: boolean) {
    if (!checked) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(filtered.map((product) => product.id)));
  }

  function toggleOne(id: number, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function deleteSelected() {
    const count = selected.size;
    if (!confirm(`${count} ürün silinsin mi?`)) return;

    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });

    if (!response.ok) {
      setMessage("Silme işlemi başarısız.");
      return;
    }

    setSelected(new Set());
    setMessage(`${count} ürün silindi.`);
    await load();
  }

  async function saveEdit() {
    if (!editing) return;

    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        patch: {
          title: editing.title,
          sku: editing.sku,
          category: editing.category,
          brand: editing.category,
          price: editing.price,
          image: editing.image,
          productUrl: editing.productUrl || undefined,
        },
      }),
    });

    if (!response.ok) {
      setMessage("Güncelleme başarısız.");
      return;
    }

    setEditing(null);
    setMessage("Ürün güncellendi.");
    await load();
  }

  if (loading) {
    return <p className="type-caption">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-sm border border-border bg-background p-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label className="mb-1.5 block type-caption font-medium">Ara</label>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Başlık, SKU, marka"
            className="bg-background"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!selected.size}
            onClick={deleteSelected}
          >
            Seçilenleri Sil ({selected.size})
          </Button>
        </div>
      </div>

      {message && (
        <p className="rounded-sm border border-border bg-background px-3 py-2 text-sm">{message}</p>
      )}

      <div className="overflow-x-auto overflow-hidden rounded-sm border border-border bg-background">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-border bg-background">
            <tr>
              <th className="w-10 px-3 py-2.5">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={(value) => toggleAll(Boolean(value))}
                />
              </th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">Ürün</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">SKU</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">Marka</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">Fiyat</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">Link</th>
              <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border bg-background">
                <td className="px-3 py-2">
                  <Checkbox
                    checked={selected.has(product.id)}
                    onCheckedChange={(value) => toggleOne(product.id, Boolean(value))}
                  />
                </td>
                <td className="max-w-[280px] truncate px-3 py-2.5 font-medium">{product.title}</td>
                <td className="type-meta px-3 py-2.5">{product.sku}</td>
                <td className="px-3 py-2.5">{product.category}</td>
                <td className="type-price px-3 py-2.5 text-sm">{formatPrice(product.price)}</td>
                <td className="px-3 py-2">
                  {product.productUrl ? (
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      Var
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...product })}
                    className="text-sm font-medium underline underline-offset-2"
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-sm border border-border bg-background">
            <div className="border-b border-border bg-background px-4 py-3">
              <p className="type-title text-sm">Ürün düzenle</p>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {(
                [
                  ["title", "Başlık"],
                  ["sku", "SKU"],
                  ["category", "Marka"],
                  ["price", "Fiyat"],
                  ["image", "Görsel URL"],
                  ["productUrl", "Site linki"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className={key === "title" || key === "image" || key === "productUrl" ? "sm:col-span-2" : ""}>
                  <span className="mb-1.5 block type-caption font-medium">
                    {label}
                  </span>
                  <Input
                    value={String(editing[key] ?? "")}
                    onChange={(event) =>
                      setEditing({ ...editing, [key]: event.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="flex border-t border-border">
              <Button
                variant="ghost"
                className="flex-1 border-r border-border"
                onClick={() => setEditing(null)}
              >
                İptal
              </Button>
              <Button className="flex-1" onClick={saveEdit}>
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
