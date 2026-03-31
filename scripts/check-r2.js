/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

function parseEnv(content) {
  const env = {};
  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return {};
  return parseEnv(fs.readFileSync(filePath, "utf8"));
}

function getStoragePrefix() {
  const custom = (process.env.R2_ENV_PREFIX || "").trim().replace(/^\/+|\/+$/g, "");
  if (custom) return custom;
  if (process.env.VERCEL_ENV === "production") return "prod";
  if (process.env.VERCEL_ENV === "preview") return "preview";
  if (process.env.NODE_ENV === "production") return "prod";
  return "dev";
}

async function main() {
  const localEnv = loadEnvFile(".env.local");
  const fallbackEnv = loadEnvFile(".env");
  Object.assign(process.env, fallbackEnv, localEnv, process.env);

  const required = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ 缺少必需环境变量: ${missing.join(", ")}`);
    process.exit(1);
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
  const prefix = getStoragePrefix();
  const key = `${prefix}/healthcheck/${Date.now()}-${Math.random().toString(16).slice(2)}.txt`;
  const body = Buffer.from(`r2-healthcheck ${new Date().toISOString()}`);

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  console.log("🔎 开始 R2 健康检查...");
  console.log(`- bucket: ${bucket}`);
  console.log(`- publicUrl: ${publicUrl || "(未设置，跳过公网访问检查)"}`);
  console.log(`- prefix: ${prefix}`);

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: "text/plain; charset=utf-8",
        ContentLength: body.length,
      })
    );
    console.log(`✅ 上传测试对象成功: ${key}`);

    if (publicUrl) {
      const testUrl = `${publicUrl}/${key}`;
      const response = await fetch(testUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error(`公网访问失败: ${response.status} ${response.statusText} (${testUrl})`);
      }
      console.log(`✅ 公网访问成功: ${testUrl}`);
    } else {
      console.log("⚠️ 未设置 R2_PUBLIC_URL，已跳过公网访问检查");
    }

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    console.log(`✅ 删除测试对象成功: ${key}`);
    console.log("🎉 R2 健康检查通过");
  } catch (error) {
    console.error("❌ R2 健康检查失败");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
