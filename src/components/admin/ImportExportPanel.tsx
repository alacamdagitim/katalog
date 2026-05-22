"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ImportExportPanel() {
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function upload(file: File) {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    const response = await fetch("/api/admin/import", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    const data = (await response.json()) as {
      error?: string;
      mode?: string;
      total?: number;
      added?: number;
      updated?: number;
    };

    if (!response.ok) {
      setMessage(data.error ?? "Import başarısız.");
      return;
    }

    if (data.mode === "replace") {
      setMessage(`Katalog değiştirildi. Toplam ${data.total} ürün.`);
      return;
    }

    setMessage(
      `Import tamamlandı. ${data.added} eklendi, ${data.updated} güncellendi. Toplam ${data.total} ürün.`
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="overflow-hidden rounded-sm border border-border bg-background">
        <div className="border-b border-border bg-background px-4 py-3">
          <p className="type-title text-sm">Export</p>
          <p className="mt-1 type-caption">Mevcut katalogu indir</p>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <a href="/api/admin/export?format=json">
            <Button variant="outline" className="w-full">
              JSON indir
            </Button>
          </a>
          <a href="/api/admin/export?format=csv">
            <Button variant="outline" className="w-full">
              CSV indir
            </Button>
          </a>
        </div>
      </section>

      <section className="overflow-hidden rounded-sm border border-border bg-background">
        <div className="border-b border-border bg-background px-4 py-3">
          <p className="type-title text-sm">Import</p>
          <p className="mt-1 type-caption">JSON veya CSV dosyası yükle</p>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex overflow-hidden rounded-sm border border-border">
            <button
              type="button"
              onClick={() => setMode("merge")}
              className={`flex-1 px-3 py-2.5 text-sm font-medium ${
                mode === "merge"
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground"
              }`}
            >
              Birleştir
            </button>
            <button
              type="button"
              onClick={() => setMode("replace")}
              className={`flex-1 border-l border-border px-3 py-2.5 text-sm font-medium ${
                mode === "replace"
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground"
              }`}
            >
              Tamamen değiştir
            </button>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-border bg-background px-4 py-10 text-center transition-colors hover:border-[var(--border-strong)]">
            <span className="text-sm font-medium">
              {loading ? "Yükleniyor..." : "Dosya seç"}
            </span>
            <span className="mt-1 type-caption">.json veya .csv</span>
            <input
              type="file"
              accept=".json,.csv,text/csv,application/json"
              className="hidden"
              disabled={loading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file);
                event.target.value = "";
              }}
            />
          </label>

          {mode === "replace" && (
            <p className="rounded-sm border border-border bg-background px-3 py-2 type-caption leading-relaxed">
              Tamamen değiştir modu mevcut katalogu siler ve dosyadaki ürünlerle yeniden yazar.
            </p>
          )}
        </div>
      </section>

      {message && (
        <p className="rounded-sm border border-border bg-background px-3 py-2 text-sm lg:col-span-2">
          {message}
        </p>
      )}
    </div>
  );
}
