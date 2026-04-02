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

function getStorageEnvPrefix() {
  const custom = (process.env.R2_ENV_PREFIX ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (custom) return custom;

  if (process.env.VERCEL_ENV === "production") return "prod";
  if (process.env.VERCEL_ENV === "preview") return "preview";
  if (process.env.NODE_ENV === "production") return "prod";
  return "dev";
}

function withEnvPrefix(relativePath: string) {
  const prefix = getStorageEnvPrefix();
  return path.join(prefix, relativePath);
}

class LocalMediaStorage implements MediaStorage {
  async upload(file: File, kind: MediaKind) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = getFileExt(file, kind);
    const generatedName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const relativeDir = withEnvPrefix(makeRelativeDir(kind));
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

/* eslint-disable @typescript-eslint/no-require-imports */

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
    const key = path.posix.join(
      getStorageEnvPrefix(),
      "uploads",
      kind,
      day,
      `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
    );

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

  const keys = [...new Set(urls
    .filter(Boolean)
    .map((u) => r2KeyFromUrl(u!))
    .filter(Boolean) as string[])];

  if (keys.length === 0) return;

  const results = await Promise.allSettled(
    keys.map((key) =>
      client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    )
  );

  const failedKeys = results.flatMap((result, index) =>
    result.status === "rejected" ? [keys[index]] : []
  );

  if (failedKeys.length > 0) {
    console.error("[media-storage] Failed to delete R2 objects:", failedKeys);
  }
}

export function diffR2Urls(
  previousUrls: (string | null | undefined)[],
  nextUrls: (string | null | undefined)[]
) {
  const previous = new Set(previousUrls.filter(Boolean) as string[]);
  const next = new Set(nextUrls.filter(Boolean) as string[]);
  return [...previous].filter((url) => !next.has(url));
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

// ─── Presigned URL 直传 ──────────────────────────────────────────────
// 前端直传 R2，绕过 Vercel 函数体积限制

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
}

export async function createPresignedUploadUrl(
  fileName: string,
  fileType: string,
  kind: MediaKind,
): Promise<PresignedUploadResult> {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured");
  }

  const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");
  const { getSignedUrl } = require("@aws-sdk/s3-request-presigner") as typeof import("@aws-sdk/s3-request-presigner");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const ext = extFromFileName(fileName, fileType, kind);
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const key = path.posix.join(
    getStorageEnvPrefix(),
    "uploads",
    kind,
    day,
    `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`,
  );

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: fileType || "application/octet-stream",
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
  const publicBase = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  const publicUrl = `${publicBase}/${key}`;

  return { uploadUrl, publicUrl };
}

/** 从文件名 + MIME 推断扩展名（与 getFileExt 类似但接收原始字符串） */
function extFromFileName(fileName: string, mimeType: string, kind: MediaKind): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  const byMime = mimeToExt[mimeType];
  if (byMime) return byMime;
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext) return ext;
  return kind === "image" ? "jpg" : "mp4";
}
