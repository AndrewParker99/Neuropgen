"use client";

import { useState } from "react";

export function ClientImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return <div className={`grid place-items-center bg-clinical-50 text-clinical-300 ${className || ""}`}>🧬</div>;
  }
  return <img src={src} alt={alt} className={className} onError={() => setErrored(true)} />;
}
