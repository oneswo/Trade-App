# 外贸站 — 项目说明

基于 [Next.js](https://nextjs.org) 构建的二手工程机械外贸网站，包含前台展示和后台管理系统。

---

## 本地启动

```bash
npm run dev
```

启动后访问 [http://localhost:3000](http://localhost:3000)

---

## 后台管理

- **地址：** `/admin/login`
- **邮箱：** `admin@kxtj.com`
- **密码：** `admin123456`

> 注意：以上为开发阶段的测试账号，上线前需修改为加密存储。

---

## 项目文档

所有设计文档、分析报告和待办清单均在 `docs/` 目录下：

| 文件 | 内容 |
|------|------|
| `docs/11_项目全局分析与待办总表.md` | 全局分析与分批待办清单（主要参考） |
| `docs/10_后端完善任务清单.md` | 后端专项任务清单 |
| `docs/02-架构文档.md` | 项目技术架构说明 |
| `docs/03-多语言.md` | 多语言（i18n）实施方案 |

---

## 部署

项目计划部署到 [Vercel](https://vercel.com)，数据库使用外部服务，文件存储使用 Cloudflare R2。

上线所需环境变量见 `.env.example`（第四批任务完成后生成）。

---

## 技术栈

- **框架：** Next.js（App Router）
- **样式：** Tailwind CSS
- **多语言：** next-intl
- **文件存储：** 本地开发用 `public/uploads/`，生产环境用 Cloudflare R2
- **数据库：** 本地开发用内存 mock，生产环境用真实数据库（待接入）
