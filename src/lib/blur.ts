import { cache } from "react";

/**
 * 生成极小的模糊占位图 base64 data URL
 * 用 React cache() 做请求级去重，同一次渲染不会重复生成
 */
export const getBlurDataURL = cache(
  async (imageUrl: string): Promise<string | undefined> => {
    if (!imageUrl) return undefined;
    try {
      const res = await fetch(imageUrl, { next: { revalidate: 3600 } });
      if (!res.ok) return undefined;
      const buffer = Buffer.from(await res.arrayBuffer());
      const sharp = (await import("sharp")).default;
      const tiny = await sharp(buffer)
        .resize(20, 12, { fit: "cover" })
        .blur(2)
        .jpeg({ quality: 40 })
        .toBuffer();
      return `data:image/jpeg;base64,${tiny.toString("base64")}`;
    } catch {
      return undefined;
    }
  }
);
