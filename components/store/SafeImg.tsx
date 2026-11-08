"use client";

import { ImgHTMLAttributes } from "react";
import { FALLBACK_IMG } from "../../lib/db";

type SafeImgProps = ImgHTMLAttributes<HTMLImageElement> & { fallback?: string };

export default function SafeImg({ fallback = FALLBACK_IMG, ...props }: SafeImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      onError={(e) => {
        const el = e.currentTarget;
        if (el.dataset.fallbackUsed === "1") return;
        el.dataset.fallbackUsed = "1";
        el.src = fallback;
      }}
    />
  );
}