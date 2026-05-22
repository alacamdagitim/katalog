import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { productsToCsv } from "@/lib/admin-csv";
import { readProducts } from "@/lib/products-db";

export async function GET(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";
  const products = await readProducts();
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "csv") {
    return new NextResponse(productsToCsv(products), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="katalog-${stamp}.csv"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(products, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="katalog-${stamp}.json"`,
    },
  });
}
