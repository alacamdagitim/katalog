import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  href?: string | null;
  priority?: boolean;
}

export function BrandLogo({
  className,
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src="/alacam-logo.png"
      alt="Alacam Dağıtım Toptan Horeca"
      width={220}
      height={48}
      priority={priority}
      className={cn("h-8 w-auto object-contain sm:h-9", className)}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}
