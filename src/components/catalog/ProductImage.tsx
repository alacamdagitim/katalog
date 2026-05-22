"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  category: string;
  className?: string;
  priority?: boolean;
  fit?: "contain" | "cover";
}

export function ProductImage({
  src,
  alt,
  category,
  className,
  priority = false,
  fit = "contain",
}: ProductImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-background",
          className
        )}
      >
        <span className="type-caption font-medium">{category.slice(0, 3)}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={cn(
        fit === "cover" ? "object-cover" : "object-contain",
        className
      )}
      onError={() => setError(true)}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}
