import { ProductAdminTable } from "@/components/admin/ProductAdminTable";

export default function AdminProductsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="type-display">Ürünler</h1>
        <p className="mt-1 type-caption">Ara, düzenle veya toplu sil</p>
      </div>
      <ProductAdminTable />
    </div>
  );
}
