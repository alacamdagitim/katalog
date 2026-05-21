"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "Karton Bardak": "from-amber-50 to-orange-100",
  "Poşet & Ambalaj": "from-stone-100 to-stone-200",
  "Gıda Kutuları": "from-emerald-50 to-teal-100",
  "PET & Plastik": "from-sky-50 to-blue-100",
  "Etiket & Sarf": "from-violet-50 to-purple-100",
  Temizlik: "from-cyan-50 to-slate-100",
  "Servis Malzemeleri": "from-neutral-100 to-neutral-200",
};

interface ProductImageProps {
  src: string;
  alt: string;
  category: string;
  className?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  category,
  className,
  priority = false,
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const gradient = CATEGORY_COLORS[category] ?? "from-neutral-100 to-neutral-200";

  if (error) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br",
          gradient,
          className
        )}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
          {category.split(" ")[0]}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={cn("object-cover transition-transform duration-500", className)}
      onError={() => setError(true)}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}
