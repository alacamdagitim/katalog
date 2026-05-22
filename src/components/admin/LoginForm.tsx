"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Giriş başarısız.");
      return;
    }

    window.location.assign("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm overflow-hidden rounded-sm border border-border bg-background">
      <div className="border-b border-border bg-background px-4 py-3">
        <p className="type-title text-sm">Admin girişi</p>
        <p className="mt-1 type-caption">Katalog yönetim paneli</p>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block type-caption font-medium"
          >
            Şifre
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Şifrenizi girin"
            autoFocus
          />
        </div>

        {error && (
          <p className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </Button>
      </div>
    </form>
  );
}
