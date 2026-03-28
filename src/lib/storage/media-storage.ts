import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

export type MediaKind = "image" | "video";

export interface UploadedMedia {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  kind: MediaKind;
}

export interface MediaStorage {
  upload(file: File, kind: MediaKind): Promise<UploadedMedia>;
}

function getFileExt(file: File, kind: MediaKind) {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };

  const byMime = mimeToExt[file.type];
  if (byMime) return byMime;

  const name = file.name || "";
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext) return ext;

  return kind === "image" ? "jpg" : "mp4";
}

function makeRelativeDir(kind: MediaKind) {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return path.join("uploads", kind, day);
}

class LocalMediaStorage implements MediaStorage {
  async upload(file: File, kind: MediaKind) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = getFileExt(file, kind);
    const generatedName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const relativeDir = makeRelativeDir(kind);
    const absDir = path.join(process.cwd(), "public", relativeDir);

    await mkdir(absDir, { recursive: true });

    const absFile = path.join(absDir, generatedName);
    await writeFile(absFile, buffer);

    const normalizedRelativeDir = relativeDir.replaceAll(path.sep, "/");

    return {
      url: `/${normalizedRelativeDir}/${generatedName}`,
      fileName: generatedName,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      kind,
    };
  }
}

const localMediaStorage = new LocalMediaStorage();

export function getMediaStorage(): MediaStorage {
  // Future switch: return R2MediaStorage when env is configured.
  return localMediaStorage;
}
