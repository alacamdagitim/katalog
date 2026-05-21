"use client";

import { Button } from "@/components/ui/button";

export function PrintActions() {
  return (
    <div className="sticky top-0 z-10 flex justify-end gap-2 border-b border-neutral-200 bg-white px-6 py-3 print:hidden">
      <Button variant="outline" size="sm" onClick={() => window.close()}>
        Kapat
      </Button>
      <Button size="sm" onClick={() => window.print()}>
        Yazdır / PDF Kaydet
      </Button>
    </div>
  );
}
