import Image from "next/image";
import { Image as ImageIcon, Play } from "lucide-react";
import type { ProductMediaKind } from "@/lib/products/media";

export function ProductCardMedia({
  alt,
  src,
  type,
  className,
}: {
  alt: string;
  src: string | null;
  type: ProductMediaKind | null;
  className?: string;
}) {
  if (!src || !type) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111111] text-white/65">
        <ImageIcon size={30} strokeWidth={1.5} />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          No Media
        </span>
      </div>
    );
  }

  if (type === "video") {
    return (
      <>
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={className ?? "h-full w-full object-cover"}
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-white backdrop-blur-sm">
          <Play size={12} className="fill-white" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
            Video
          </span>
        </div>
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={className ?? "object-cover"}
    />
  );
}
