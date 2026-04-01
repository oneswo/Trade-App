# 2026-04-01 前后端体验优化日志

## 优化概述

本次针对页面加载速度、图片/视频显示稳定性、后台移动端可用性三个方向进行了集中优化。
所有改动均不影响现有 UI 样式和业务逻辑，不引入新依赖。

---

## 改动文件清单

| # | 文件路径 | 改动类型 | 说明 |
|---|---------|---------|------|
| 1 | `src/app/[locale]/insights/page.tsx` | 性能优化 | 移除中文副标题逐字符渲染，改用 CSS text-justify |
| 2 | `src/hooks/useInquirySubmit.ts` | Bug 修复 | 添加 loading 状态判断，防止表单重复提交 |
| 3 | `src/app/[locale]/insights/page.tsx` | 容错增强 | 文章封面图添加 onError fallback |
| 4 | `src/app/[locale]/insights/[slug]/page.tsx` | 容错增强 | 文章详情封面图添加 onError fallback |
| 5 | `src/app/[locale]/products/page.tsx` | 容错增强 | 产品列表卡片图添加 onError fallback |
| 6 | `src/app/[locale]/products/[slug]/page.tsx` | 容错增强 | 产品详情主图、缩略图、相关产品图添加 onError fallback（4 处） |
| 7 | `src/app/[locale]/page.tsx` | 容错增强 | 首页产品卡片图、DeliveryCard 海报图添加 onError fallback |
| 8 | `src/app/[locale]/page.tsx` | 容错增强 | DeliveryCard 视频加载失败自动回退到海报图/占位图 |
| 9 | `src/hooks/usePageContent.ts` | 性能优化 | 添加 AbortController，组件卸载时取消未完成请求 |
| 10 | `src/components/admin/AdminSidebar.tsx` | 响应式适配 | 移动端侧边栏收起，添加汉堡菜单和遮罩层 |
| 11 | `src/app/admin/(main)/layout.tsx` | 响应式适配 | 主内容区 padding 改为响应式 |
| 12 | `src/components/admin/AdminTopbar.tsx` | 响应式适配 | 顶栏 left 偏移改为响应式，为汉堡按钮预留空间 |
| 13 | `src/app/admin/(main)/dashboard/page.tsx` | 响应式适配 | 统计卡片和询盘列表改为响应式网格 |

---

## 详细改动说明

### 1. 中文副标题逐字符渲染优化

**文件:** `src/app/[locale]/insights/page.tsx` (第 56-61 行)

**问题:** 中文副标题使用 `.split('').map()` 将每个字符包裹在独立 `<span>` 中，一段 40 字的文本会产生 40 个 DOM 节点，影响渲染性能。

**修复:** 移除逐字符拆分，改为单个 `<p>` 标签配合 CSS `text-justify` 实现两端对齐效果。

**改动前:**
```tsx
<div className="... flex justify-between items-center ...">
  {c('hero.desc', "...").split('').map((char, index) => (
    <span key={index}>{char}</span>
  ))}
</div>
```

**改动后:**
```tsx
<p className="... text-center text-justify ...">
  {c('hero.desc', "...")}
</p>
```

---

### 2. 询盘表单防重复提交

**文件:** `src/hooks/useInquirySubmit.ts` (第 51 行)

**问题:** 用户快速连击提交按钮时，多个请求同时发出，可能产生重复询盘记录。

**修复:** 在 `handleSubmit` 函数开头加入状态判断：
```tsx
if (submitState === "loading") return;
```

---

### 3-7. 图片 CDN 故障 fallback（7 处）

**涉及文件:**
- `src/app/[locale]/insights/page.tsx` — 文章封面图
- `src/app/[locale]/insights/[slug]/page.tsx` — 文章详情封面图
- `src/app/[locale]/products/page.tsx` — 产品列表卡片图
- `src/app/[locale]/products/[slug]/page.tsx` — 主图、视频缩略图、图库缩略图、相关产品图
- `src/app/[locale]/page.tsx` — 首页产品卡片图、DeliveryCard 海报图

**问题:** 所有动态图片（来自 R2 CDN）在网络异常或 CDN 故障时显示浏览器默认碎图标，影响页面美观。

**修复:** 在所有使用 CDN URL 的 `<Image>` 组件上添加 `onError` 回调，失败时自动切换到本地占位图：
```tsx
onError={(e) => { e.currentTarget.src = '/images/products/1.jpg'; }}
```

各页面使用的 fallback 图片：
- 产品相关 → `/images/products/1.jpg`
- 文章相关 → `/images/insights/1.jpg`
- 首页相关 → `/hero.png`

---

### 8. 视频加载失败 fallback

**文件:** `src/app/[locale]/page.tsx` (DeliveryCard 组件)

**问题:** 首页交付实录区域的视频如果加载失败，显示空白黑色区域，无任何提示。

**修复:** 添加 `videoError` 状态，视频 `onError` 时设置为 true，自动回退到海报图或默认占位图：
```tsx
const [videoError, setVideoError] = useState(false);
// ...
{videoUrl && !videoError ? (
  <video onError={() => setVideoError(true)} ... />
) : posterUrl ? (
  <Image src={posterUrl} ... />
) : (
  <div>占位图</div>
)}
```

---

### 9. 语言切换请求取消

**文件:** `src/hooks/usePageContent.ts` (第 40-64 行)

**问题:** 快速切换中/英文时，旧语言的 API 请求可能在新语言内容加载后才返回，导致页面短暂闪烁旧内容。

**修复:** 在 `useEffect` 中使用 `AbortController`，组件卸载（语言切换导致重新挂载）时自动取消未完成的请求，并在 catch 中过滤 AbortError：
```tsx
const controller = new AbortController();
fetch(url, { signal: controller.signal })
  .catch((err) => {
    if (err instanceof Error && err.name === 'AbortError') return;
    // ...
  });
return () => controller.abort();
```

---

### 10-13. 后台移动端响应式适配

#### AdminSidebar (`src/components/admin/AdminSidebar.tsx`)

**问题:** 侧边栏 `fixed w-52` 在移动端完全遮挡主内容。

**修复:**
- 移动端默认隐藏侧边栏（`-translate-x-full`），桌面端正常显示（`md:translate-x-0`）
- 添加汉堡菜单按钮（左上角，仅移动端显示 `md:hidden`）
- 添加半透明遮罩层，点击关闭侧边栏
- 点击导航链接后自动关闭侧边栏
- 侧边栏头部添加关闭按钮

#### AdminMainLayout (`src/app/admin/(main)/layout.tsx`)

**修复:**
- `pl-52` → `pl-0 md:pl-52`（移动端无左边距）
- `p-8` → `p-4 md:p-8`（移动端减小内边距）

#### AdminTopbar (`src/components/admin/AdminTopbar.tsx`)

**修复:**
- `left-52` → `left-0 md:left-52`（移动端全宽）
- `px-8` → `px-4 pl-16 md:pl-8 md:px-8`（移动端为汉堡按钮预留空间）

#### Dashboard (`src/app/admin/(main)/dashboard/page.tsx`)

**修复:**
- 统计卡片：`grid-cols-4` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- 询盘列表表头和数据行：`grid-cols-[2fr_2fr_1fr_1fr_1fr]` → `grid-cols-[1fr_1fr] md:grid-cols-[2fr_2fr_1fr_1fr_1fr]`
- 地区列和时间列在移动端隐藏（`hidden md:flex`）

---

## 评估后决定不做的项

| 项目 | 原因 |
|------|------|
| API 分页 | 外贸站数据量小（百级），现有 60s 客户端缓存已足够 |
| HTTP Client 缓存策略 | `no-store` 是客户端 hook 的正确默认值，缓存由 client-cache.ts 管理 |
| useParams 空值保护 | 已有 `rawSlug \|\| ''` 和 `if (!product)` 空状态页面兜底 |
| CSRF 保护 | 简单外贸站，非金融系统，不需要 |
| 登录限速 | 无公开注册，攻击面小 |
| 文件上传魔数校验 | 仅管理员可上传，信任内部用户 |
| 软删除/审计日志 | 增加复杂度，数据库备份足够 |
| ARIA 全面改造 | 外贸站客户群体不依赖屏幕阅读器 |
| API 版本前缀 | 自用 API，无第三方消费者 |

---

## 构建验证

所有改动通过 `npx next build`，无编译错误、无类型错误。
