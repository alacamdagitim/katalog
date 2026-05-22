import { ImportExportPanel } from "@/components/admin/ImportExportPanel";

export default function AdminImportExportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="type-display">Import / Export</h1>
        <p className="mt-1 type-caption">
          Katalog dosyalarını toplu indir veya yükle
        </p>
      </div>
      <ImportExportPanel />
    </div>
  );
}
