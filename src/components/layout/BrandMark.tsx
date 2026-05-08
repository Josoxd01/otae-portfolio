"use client";

import Image from "next/image";
import { useState } from "react";

import type { MediaReference } from "@/types/portfolio";

interface BrandMarkProps {
  imageClassName?: string;
  logoMedia?: MediaReference;
  textClassName?: string;
}

export function BrandMark({
  imageClassName = "h-8 max-w-[8rem]",
  logoMedia,
  textClassName = "font-title text-[15px] font-medium tracking-[0.42em] text-neutral-950",
}: BrandMarkProps) {
  const [failedLogoUrl, setFailedLogoUrl] = useState("");
  const logoUrl = logoMedia?.url;
  const logoFailed = Boolean(logoUrl && failedLogoUrl === logoUrl);

  if (logoUrl && !logoFailed) {
    return (
      <Image
        src={logoUrl}
        alt={logoMedia.altText ?? "OTAE"}
        width={160}
        height={48}
        className={`${imageClassName} w-auto object-contain`}
        unoptimized
        onError={() => setFailedLogoUrl(logoUrl)}
      />
    );
  }

  return <span className={textClassName}>OTAE</span>;
}
