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

-- ─── site_settings 站点全局配置 ───────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id                  TEXT PRIMARY KEY DEFAULT 'default',
  -- 品牌标识
  site_name           TEXT DEFAULT 'KXTJ 重工机械',
  site_name_en        TEXT DEFAULT 'KXTJ Heavy Machinery',
  logo_text           TEXT DEFAULT '中国机械',
  logo_text_en        TEXT DEFAULT 'CHINA MACHINERY',
  logo_image_url      TEXT,
  -- 功能开关
  enable_insights     BOOLEAN DEFAULT TRUE,
  -- 联系信息
  contact_name        TEXT DEFAULT 'Jack Yin',
  contact_phone       TEXT DEFAULT '+86 17321077956',
  contact_email       TEXT DEFAULT '15156888267@163.com',
  contact_whatsapp    TEXT DEFAULT '+86 15375319246',
  contact_address     TEXT DEFAULT '中国上海市奉贤区金海路6055号',
  contact_address_en  TEXT DEFAULT 'No. 6055, Jinhai Rd, Fengxian District, Shanghai, China',
  -- 社交媒体
  social_x            TEXT DEFAULT '',
  social_instagram    TEXT DEFAULT '',
  social_facebook     TEXT DEFAULT '',
  social_youtube      TEXT DEFAULT '',
  social_tiktok       TEXT DEFAULT '',
  social_linkedin     TEXT DEFAULT '',
  -- 版权信息
  copyright_text      TEXT DEFAULT '中国机械',
  copyright_text_en   TEXT DEFAULT 'CHINA MACHINERY',
  copyright_url       TEXT DEFAULT 'WWW.ONESWO.COM',
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认配置行
INSERT INTO site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

