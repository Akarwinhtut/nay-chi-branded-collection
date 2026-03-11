"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  position?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
};

export function ProductImage({
  src,
  alt,
  position = "center center",
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  priority = false,
  children,
}: ProductImageProps) {
  return (
    <div className={`editorial-photo ${className}`}>
      <div className="editorial-photo__media" aria-hidden="true">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>
      {children ? <div className="editorial-photo__content">{children}</div> : null}
    </div>
  );
}
