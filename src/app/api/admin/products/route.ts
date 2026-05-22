import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  deleteProductsByIds,
  getCatalogStats,
  readProducts,
  updateProduct,
} from "@/lib/products-db";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const products = await readProducts();
  return NextResponse.json({
    products,
    stats: getCatalogStats(products),
  });
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as { ids?: number[] };
  const ids = body.ids ?? [];

  if (!ids.length) {
    return NextResponse.json({ error: "Silinecek ürün seçilmedi." }, { status: 400 });
  }

  const result = await deleteProductsByIds(ids);
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as { id?: number; patch?: Record<string, unknown> };
  const id = body.id;
  const patch = body.patch;

  if (!id || !patch) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const updated = await updateProduct(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ product: updated });
}
