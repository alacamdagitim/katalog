import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "outline";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "bg-neutral-900 text-white",
        variant === "secondary" && "bg-neutral-100 text-neutral-700",
        variant === "outline" &&
          "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
