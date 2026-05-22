"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminHeaderLogin() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Giriş başarısız.");
      return;
    }

    setOpen(false);
    setPassword("");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          setError("");
        }}
        className="rounded-sm border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
      >
        Admin
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-sm border border-border bg-background shadow-none"
        >
          <div className="border-b border-border bg-background px-3 py-2.5">
            <p className="text-sm font-medium">Admin girişi</p>
          </div>

          <div className="space-y-3 p-3">
            <div>
              <label
                htmlFor="header-admin-password"
                className="mb-1.5 block type-caption font-medium"
              >
                Şifre
              </label>
              <Input
                id="header-admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Şifrenizi girin"
                autoFocus
              />
            </div>

            {error && (
              <p className="rounded-sm border border-border bg-background px-2 py-1.5 text-sm">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="sm">
              {loading ? "Giriş..." : "Panele git"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
