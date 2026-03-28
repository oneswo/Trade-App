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

// ─── R2 存储适配器 ─────────────────────────────────────────────
// 仅在以下 4 个环境变量全部存在时启用：
// R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
// 文件公开访问 URL 由 R2_PUBLIC_URL 提供（如 https://assets.example.com）

class R2MediaStorage implements MediaStorage {
  private client: import("@aws-sdk/client-s3").S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    // Dynamic import to avoid bundling when not used
    const { S3Client } = require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");
    this.bucket = process.env.R2_BUCKET_NAME!;
    this.publicUrl = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async upload(file: File, kind: MediaKind): Promise<UploadedMedia> {
    const { PutObjectCommand } = require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");
    const ext = getFileExt(file, kind);
    const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    const key = `uploads/${kind}/${day}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type || "application/octet-stream",
        ContentLength: file.size,
      })
    );

    return {
      url: `${this.publicUrl}/${key}`,
      fileName: key.split("/").pop()!,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      kind,
    };
  }
}

/**
 * 从 R2 公开 URL 中提取 object key，用于删除操作。
 * 若 URL 不属于当前 R2 桶则返回 null。
 */
export function r2KeyFromUrl(url: string): string | null {
  const base = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  if (!base || !url.startsWith(base + "/")) return null;
  return url.slice(base.length + 1);
}

/**
 * 从 R2 删除一组文件（忽略错误，防止删除失败影响主流程）
 */
export async function deleteR2Objects(urls: (string | null | undefined)[]): Promise<void> {
  if (!isR2Configured()) return;
  const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  const bucket = process.env.R2_BUCKET_NAME!;

  const keys = urls
    .filter(Boolean)
    .map((u) => r2KeyFromUrl(u!))
    .filter(Boolean) as string[];

  await Promise.allSettled(
    keys.map((key) =>
      client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    )
  );
}

function isR2Configured() {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

export function getMediaStorage(): MediaStorage {
  if (isR2Configured()) return new R2MediaStorage();
  return localMediaStorage;
}
