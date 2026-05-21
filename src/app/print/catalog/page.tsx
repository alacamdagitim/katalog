import { products as allProducts } from "@/data/products";
import { SpecTable } from "@/components/catalog/SpecTable";
import { formatPrice } from "@/lib/utils";
import { PrintActions } from "./PrintActions";

interface PrintCatalogPageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function PrintCatalogPage({
  searchParams,
}: PrintCatalogPageProps) {
  const params = await searchParams;
  const ids = params.ids?.split(",").map(Number).filter(Boolean) ?? [];
  const products = allProducts.filter((p) => ids.includes(p.id));

  if (products.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 print:p-0">
        <p className="text-neutral-500">Dışa aktarılacak ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 print:bg-white">
      <PrintActions />

      <div className="mx-auto max-w-4xl px-8 py-10 print:max-w-none print:px-0 print:py-0">
        <header className="mb-10 border-b border-neutral-200 pb-6 print:mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
            Katalog · B2B
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Ürün Kataloğu
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {new Date().toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {products.length} ürün
          </p>
        </header>

        <div className="space-y-12 print:space-y-10">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="break-inside-avoid print:break-after-page"
            >
              {index > 0 && (
                <div className="mb-10 hidden border-t border-neutral-200 print:block" />
              )}

              <div className="grid gap-8 print:grid-cols-[180px_1fr]">
                <div className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 print:aspect-auto print:h-40">
                  <span className="text-center text-xs uppercase tracking-widest text-neutral-400">
                    {product.category}
                  </span>
                </div>

                <div>
                  <p className="font-mono text-xs text-neutral-400">{product.sku}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {product.title}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-500">{product.description}</p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span>
                      <strong className="font-medium text-neutral-500">Fiyat:</strong>{" "}
                      {formatPrice(product.price)}
                    </span>
                    <span>
                      <strong className="font-medium text-neutral-500">Marka:</strong>{" "}
                      {product.brand}
                    </span>
                    <span>
                      <strong className="font-medium text-neutral-500">Materyal:</strong>{" "}
                      {product.material}
                    </span>
                  </div>

                  {product.specifications && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-semibold">Teknik Özellikler</h3>
                      <SpecTable
                        specifications={product.specifications}
                        compact
                        className="print:border-neutral-300"
                      />
                    </div>
                  )}

                  {product.packaging && (
                    <div className="mt-6 text-sm text-neutral-600">
                      <strong className="font-medium text-neutral-500">Paketleme:</strong>{" "}
                      {product.packaging.quantity.toLocaleString("tr-TR")} adet /{" "}
                      {product.packaging.unit}
                      {product.packaging.dimensions &&
                        ` · ${product.packaging.dimensions}`}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-12 border-t border-neutral-200 pt-6 text-xs text-neutral-400 print:mt-8">
          Bu belge Katalog B2B platformu tarafından oluşturulmuştur. Fiyatlar bilgilendirme
          amaçlıdır.
        </footer>
      </div>
    </div>
  );
}
