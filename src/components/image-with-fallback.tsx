"use client";
import { useState } from "react";
import { cn } from "~/lib/utils";

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  ...props
}: {
  src: string;
  fallbackSrc: string;
  alt?: string;
}) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error || !src ? fallbackSrc : src}
      alt={alt}
      onError={() => setError(true)}
      className={cn("object-cover", {
        "h-full w-full": !error,
        "h-20 w-20": error || !src,
      })}
      {...props}
    />
  );
}
