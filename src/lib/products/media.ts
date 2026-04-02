export type ProductMediaKind = "image" | "video";

export interface ProductMediaSlot {
  url: string;
  type: ProductMediaKind | "";
}

export interface ProductPrimaryMedia {
  url: string;
  type: ProductMediaKind;
}

export const PRODUCT_MEDIA_SLOT_COUNT = 5;

export function createEmptyProductMediaSlot(): ProductMediaSlot {
  return { url: "", type: "" };
}

export function isVideoProductMediaUrl(url: string) {
  const lower = url.trim().toLowerCase();
  return (
    lower.includes("/video/") ||
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov")
  );
}

function normalizeProductMediaType(
  value: unknown,
  url: string
): ProductMediaKind | "" {
  if (value === "image" || value === "video") return value;
  if (!url) return "";
  return isVideoProductMediaUrl(url) ? "video" : "image";
}

export function normalizeProductMediaSlots(
  input: unknown,
  slotCount = PRODUCT_MEDIA_SLOT_COUNT
): ProductMediaSlot[] {
  const source = Array.isArray(input) ? input : [];

  return Array.from({ length: slotCount }, (_, index) => {
    const raw = source[index];
    if (!raw || typeof raw !== "object") {
      return createEmptyProductMediaSlot();
    }

    const candidate = raw as { url?: unknown; type?: unknown };
    const url = typeof candidate.url === "string" ? candidate.url.trim() : "";
    const type = normalizeProductMediaType(candidate.type, url);

    if (!url) return createEmptyProductMediaSlot();

    return { url, type };
  });
}

export function getProductPrimaryMedia(
  slots: ProductMediaSlot[] | null | undefined
): ProductPrimaryMedia | null {
  if (!Array.isArray(slots)) return null;

  for (const slot of slots) {
    if (!slot?.url) continue;
    return {
      url: slot.url,
      type: slot.type === "video" ? "video" : "image",
    };
  }

  return null;
}

export function buildLegacyProductMediaSlots(input: {
  coverImageUrl?: string | null;
  galleryImageUrls?: string[] | null;
  videoUrl?: string | null;
}) {
  const slots = Array.from(
    { length: PRODUCT_MEDIA_SLOT_COUNT },
    createEmptyProductMediaSlot
  );
  let writeIndex = 0;

  const pushSlot = (url: string | null | undefined, type: ProductMediaKind) => {
    const value = url?.trim();
    if (!value || writeIndex >= PRODUCT_MEDIA_SLOT_COUNT) return;
    slots[writeIndex] = { url: value, type };
    writeIndex += 1;
  };

  if (input.coverImageUrl) {
    pushSlot(input.coverImageUrl, "image");
    pushSlot(input.videoUrl, "video");
  } else if (input.videoUrl) {
    pushSlot(input.videoUrl, "video");
  }

  for (const imageUrl of input.galleryImageUrls ?? []) {
    pushSlot(imageUrl, "image");
  }

  return slots;
}

export function decomposeProductMediaSlots(slots: ProductMediaSlot[]) {
  let coverImageUrl: string | null = null;
  let videoUrl: string | null = null;
  const galleryImageUrls: string[] = [];

  for (const slot of slots) {
    if (!slot.url) continue;

    if (slot.type === "video") {
      if (!videoUrl) videoUrl = slot.url;
      continue;
    }

    if (!coverImageUrl) {
      coverImageUrl = slot.url;
      continue;
    }

    galleryImageUrls.push(slot.url);
  }

  return {
    coverImageUrl,
    galleryImageUrls,
    videoUrl,
  };
}

export function getOrderedProductImages(slots: ProductMediaSlot[]) {
  return slots
    .filter((slot) => slot.url && slot.type !== "video")
    .map((slot) => slot.url);
}
