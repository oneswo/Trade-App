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

/**
 * 带上传进度的直传 R2
 * 使用 XMLHttpRequest 以获取真实上传进度
 */
export async function directUploadWithProgress(
  file: File,
  kind: UploadKind,
  onProgress: (percent: number) => void,
): Promise<DirectUploadResult> {
  // Step 1: 获取 presigned URL (小请求，不需要进度)
  onProgress(0);

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

  // Step 2: PUT 直传 R2（使用 XHR 获取进度）
  onProgress(2); // presign 完成，给 2% 起步

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        // 2% ~ 100% 映射实际上传进度
        const pct = Math.round(2 + (e.loaded / e.total) * 98);
        onProgress(Math.min(pct, 99));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new UploadError("r2_upload_failed"));
      }
    });

    xhr.addEventListener("error", () => reject(new UploadError("r2_upload_failed")));
    xhr.addEventListener("abort", () => reject(new UploadError("upload_aborted")));

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.send(file);
  });

  return { url: publicUrl };
}
