/**
 * 前端直传 R2 上传工具
 *
 * 流程：
 *  1. POST /api/admin/upload-url 获取 presigned URL + publicUrl
 *  2. PUT 文件直传 R2（绕过 Vercel 4.5MB 函数体积限制）
 *  3. 返回 publicUrl
 */

export type UploadKind = "image" | "video";

export interface DirectUploadResult {
  url: string;
}

export async function directUpload(
  file: File,
  kind: UploadKind,
): Promise<DirectUploadResult> {
  // Step 1: 获取 presigned URL
  const presignRes = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      kind,
    }),
  });

  const presignJson = await presignRes.json();
  if (!presignRes.ok || !presignJson.ok) {
    throw new UploadError(presignJson.error ?? "presign_failed");
  }

  const { uploadUrl, publicUrl } = presignJson.data as {
    uploadUrl: string;
    publicUrl: string;
  };

  // Step 2: PUT 直传 R2
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!putRes.ok) {
    throw new UploadError("r2_upload_failed");
  }

  return { url: publicUrl };
}

export class UploadError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}
