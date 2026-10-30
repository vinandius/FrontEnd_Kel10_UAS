"use client";

import { ImgHTMLAttributes } from "react";
import { FALLBACK_IMG } from "../../lib/db";

export default function SafeImg(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.src.endsWith(FALLBACK_IMG)) el.src = FALLBACK_IMG;
      }}
    />
  );
}