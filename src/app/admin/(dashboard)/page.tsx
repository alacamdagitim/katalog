"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Stats {
  total: number;
  withImage: number;
  withUrl: number;
  byCategory: Record<string, number>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((response) => response.json())
      .then((data: { stats: Stats }) => setStats(data.stats));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="type-display">Özet</h1>
        <p className="mt-1 type-caption">
          Katalog durumu ve hızlı işlemler
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Toplam ürün", value: stats?.total ?? "—" },
          { label: "Görseli olan", value: stats?.withImage ?? "—" },
          { label: "Site linki olan", value: stats?.withUrl ?? "—" },
          {
            label: "Marka sayısı",
            value: stats ? Object.keys(stats.byCategory).length : "—",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-sm border border-border bg-background p-4">
            <p className="type-caption">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      {stats && (
        <section className="overflow-hidden rounded-sm border border-border bg-background">
          <div className="border-b border-border bg-background px-4 py-3">
            <p className="type-title text-sm">Marka dağılımı</p>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(stats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between border-b border-r border-border px-4 py-2.5 text-sm"
                >
                  <span>{category}</span>
                  <span className="tabular-nums text-muted-foreground">{count}</span>
                </div>
              ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/products">
          <Button>Ürünleri yönet</Button>
        </Link>
        <Link href="/admin/import-export">
          <Button variant="outline">Import / Export</Button>
        </Link>
      </div>
    </div>
  );
}
