import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { parseUploadedProducts } from "@/lib/admin-csv";
import { mergeProducts, readProducts, replaceProducts } from "@/lib/products-db";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const mode = String(formData.get("mode") ?? "merge");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const text = await file.text();
  const existing = await readProducts();
  const startId = Math.max(0, ...existing.map((product) => product.id)) + 1;

  let incoming;
  try {
    incoming = parseUploadedProducts(text, file.name, startId);
  } catch {
    return NextResponse.json({ error: "Dosya okunamadı." }, { status: 400 });
  }

  if (!incoming.length) {
    return NextResponse.json({ error: "Dosyada geçerli ürün bulunamadı." }, { status: 400 });
  }

  if (mode === "replace") {
    const total = await replaceProducts(incoming);
    return NextResponse.json({ mode, total, added: total, updated: 0 });
  }

  const result = await mergeProducts(incoming);
  return NextResponse.json({ mode: "merge", ...result });
}
