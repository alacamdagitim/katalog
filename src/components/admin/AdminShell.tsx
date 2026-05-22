"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/import-export", label: "Import / Export" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1400px] items-stretch justify-between">
          <div className="flex items-stretch">
            <div className="flex items-center border-r border-border px-4 py-3">
              <BrandLogo href="/" />
            </div>
            <div className="flex flex-col justify-center px-4 py-3">
              <p className="text-sm font-semibold tracking-tight">Admin panel</p>
              <p className="type-caption">Katalog yönetimi</p>
            </div>
          </div>

          <div className="flex items-stretch">
            <Link
              href="/"
              className="flex items-center border-l border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Katalog
            </Link>
            <button
              type="button"
              onClick={logout}
              className="border-l border-border px-4 text-sm font-medium text-muted-foreground hover:bg-foreground hover:text-background"
            >
              Çıkış
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-[1400px] border-t border-border">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-r border-border px-4 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
