-- KXTJ 外贸站 Supabase 建表脚本
-- 在 Supabase SQL 编辑器中运行此脚本后，
-- 设置 SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 环境变量即可自动切换真实数据库。

-- ─── admins ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,        -- 上线前改为 bcrypt hash
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 插入初始管理员 —— 将 email 和 password 替换为你的真实值再执行
-- 与 Vercel 环境变量 ADMIN_EMAIL / ADMIN_PASSWORD 保持一致
INSERT INTO admins (id, email, password, created_at)
VALUES ('admin-1', 'your_email@example.com', 'your_strong_password', NOW())
ON CONFLICT (email) DO NOTHING;

-- ─── inquiries ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  message     TEXT NOT NULL,
  locale      TEXT NOT NULL DEFAULT 'en',
  source      TEXT,
  page_path   TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  status      TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING | CONTACTED | CLOSED
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);

-- ─── products ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  category            TEXT NOT NULL,
  summary             TEXT NOT NULL DEFAULT '',
  description         TEXT NOT NULL DEFAULT '',
  specs               JSONB NOT NULL DEFAULT '[]',
  cover_image_url     TEXT,
  gallery_image_urls  TEXT[] NOT NULL DEFAULT '{}',
  video_url           TEXT,
  status              TEXT NOT NULL DEFAULT 'DRAFT',  -- DRAFT | PUBLISHED
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);

-- ─── articles ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  title_zh        TEXT,
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL,
  summary         TEXT NOT NULL DEFAULT '',
  summary_zh      TEXT,
  content         TEXT NOT NULL DEFAULT '',
  content_zh      TEXT,
  cover_image_url TEXT,
  read_time       TEXT,
  status          TEXT NOT NULL DEFAULT 'DRAFT',  -- DRAFT | PUBLISHED
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status);

-- ─── page_contents ──────────────────────────────────────────────
-- 每行对应一个页面 + 语言的全部静态字段，data 是 key-value 的 JSON 对象
CREATE TABLE IF NOT EXISTS page_contents (
  page_id     TEXT NOT NULL,           -- home | about | services | products | insights | contact
  locale      TEXT NOT NULL,           -- zh | en
  data        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (page_id, locale)
);

