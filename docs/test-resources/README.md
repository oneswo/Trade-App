# 测试资源整理

> 整理日期：2026-03-28  
> 用途：明天全面测试前的资源参考

---

## 一、后台登录账号

| 环境 | 邮箱 | 密码 |
|------|------|------|
| 本地开发 | `me@oneswo.com` | `huixing123@` |
| 本地备用 | `admin@kxtj.com` | `admin123456` |

---

## 二、Mock 产品数据

### 前台产品列表（18台）

| # | 型号 | 中文名 | 品牌 | 年份 | 工时 | 吨位 | 分类 | 图片 |
|---|------|--------|------|------|------|------|------|------|
| 1 | CAT 320D L | 卡特 320D L 履带挖掘机 | 卡特/CAT | 2019 | 3,200H | 21.5T | 挖掘机 | /images/products/1.jpg |
| 2 | Komatsu PC200-8 | 小松 PC200-8 液压挖掘机 | 小松/Komatsu | 2018 | 4,100H | 20.8T | 挖掘机 | /images/products/2.jpg |
| 3 | SANY SY365H | 三一 SY365H 大型挖掘机 | 三一/SANY | 2021 | 1,800H | 36.0T | 挖掘机 | /images/products/3.jpg |
| 4 | Hitachi ZX210LC-5N | 日立 ZX210LC-5N 履带挖掘机 | 日立/Hitachi | 2017 | 4,850H | 21.2T | 挖掘机 | /images/products/4.jpg |
| 5 | CAT 950H | 卡特 950H 轮式装载机 | 卡特/CAT | 2019 | 2,900H | 18.5T | 装载机 | /images/products/5.jpg |
| 6 | Komatsu D155A-6 | 小松 D155A-6 履带推土机 | 小松/Komatsu | 2016 | 5,500H | 39.5T | 推土机 | /images/products/6.jpg |

> 注：前台实际显示 18 台，是上述 6 台的 3 倍复制（slug 加 -v2、-v3 后缀）

### 后台产品数据（Mock 2台）

| 名称 | Slug | 分类 | 状态 |
|------|------|------|------|
| KXTJ-360 Hydraulic Excavator | kxtj-360-hydraulic-excavator | Large Excavators | PUBLISHED |
| KXTJ-220 Compact Excavator | kxtj-220-compact-excavator | Mini Excavators | DRAFT |

---

## 三、Mock 文章数据

### 智库文章（6篇 PUBLISHED）

| # | 英文标题 | 中文标题 | 分类 | 阅读时间 | 封面图 |
|---|----------|----------|------|----------|--------|
| 1 | Comprehensive Guide for Buying Used Excavators from China | 从中国购买二手挖掘机的全面避坑指南与跨国交割总结 | GUIDE | 8 MIN | /images/insights/1.jpg |
| 2 | Maximizing Excavator ROI: Lifespan Extension & Simplified Maintenance | 挖掘机投资效益最大化：延长使用寿命和极简化维保策略 | MAINTENANCE | 5 MIN | /images/insights/2.jpg |
| 3 | 2026 Market Insights: Price Trends | 2026年市场洞察：二手机械价格走势与区域需求分布 | REPORTS | 10 MIN | /images/insights/3.jpg |
| 4 | Bulk Procurement Negotiation Secrets | 批量设备采购谈判秘诀：价格、配件、售后一揽子方案 | GUIDE | 7 MIN | /images/insights/1.jpg |
| 5 | Wheel Loader Preventive Maintenance | 装载机预防性维保：季度保养计划与配件周期 | MAINTENANCE | 6 MIN | /images/insights/2.jpg |
| 6 | Port Records: Complete Export Checklist | 港口实录：出海单据完整清单与物流规划 | REPORTS | 4 MIN | /images/insights/3.jpg |

---

## 四、图片资源清单

### 4.1 产品图片 `/public/images/products/`

| 文件名 | 用途 | 尺寸建议 |
|--------|------|----------|
| 1.jpg | 产品卡片封面 - 挖掘机1 | 800x600 |
| 2.jpg | 产品卡片封面 - 挖掘机2 | 800x600 |
| 3.jpg | 产品卡片封面 - 挖掘机3 | 800x600 |
| 4.jpg | 产品卡片封面 - 挖掘机4 | 800x600 |
| 5.jpg | 产品卡片封面 - 装载机 | 800x600 |
| 6.jpg | 产品卡片封面 - 推土机 | 800x600 |

### 4.2 Hero 背景图 `/public/images/hero/`

| 文件名 | 用途 |
|--------|------|
| about.png | 关于我们页 Hero |
| contact.png | 联系我们页 Hero |
| insights.png | 智库页 Hero |
| products.png | 产品列表页 Hero |
| services.png | 服务页 Hero |

### 4.3 智库文章封面 `/public/images/insights/`

| 文件名 | 用途 |
|--------|------|
| 1.jpg | 文章封面图1 |
| 2.jpg | 文章封面图2 |
| 3.jpg | 文章封面图3 |

### 4.4 关于我们页 `/public/images/about/`

| 文件名 | 用途 |
|--------|------|
| cert.jpg | 资质证书墙 |
| hero.jpg | Hero 备用图 |
| office.jpg | Block A - 长三角基地 |
| yard.jpg | Block B - 重载交付力 |

### 4.5 服务页流程图 `/public/images/services/`

| 文件名 | 用途 |
|--------|------|
| process-1.jpg | 步骤1 - 精准选机 |
| process-2.jpg | 步骤2 - 全检整备 |
| process-3.jpg | 步骤3 - 安全装运 |
| process-4.jpg | 步骤4 - 抵港交付 |

### 4.6 联系页 `/public/images/contact/`

| 文件名 | 用途 |
|--------|------|
| map.png | 地图展示 |
| shanghai-night.jpg | 上海夜景背景 |

### 4.7 团队头像 `/public/images/avatars/`

| 文件名 | 对应人员 |
|--------|----------|
| anna.png | 安娜·李 |
| annie.png | 安妮 |
| hong.png | 尹洪峰 |
| yin.png | 尹世兵 |

---

## 五、首页 Hero 视频

| 位置 | 文件路径 | 说明 |
|------|----------|------|
| 首页背景 | 后台配置 | 通过 `/admin/pages` → 首页 → Hero 视频 URL 上传 |
| 上传目录 | `/public/uploads/video/` | 上传后存放位置 |

当前上传的测试视频：
- `/public/uploads/video/20260328/1774666489304-9bed0af2.mp4`

---

## 六、筛选器数据

### 品牌列表
- 卡特彼勒 / Caterpillar
- 小松 / Komatsu
- 三一 / SANY
- 日立 / Hitachi
- 沃尔沃 / Volvo
- 斗山 / Doosan

### 品类列表
- 挖掘机 / Excavator
- 装载机 / Loader
- 推土机 / Dozer
- 压路机 / Roller
- 起重机 / Crane

### 年份范围
- 2022及以上
- 2018-2021
- 2014-2017
- 2013及以前

---

## 七、多语言配置

| 语言 | 代码 | 配置文件 |
|------|------|----------|
| 中文 | zh | /src/messages/zh.json |
| 英文 | en | /src/messages/en.json |

---

## 八、数据来源说明

| 模块 | 本地开发 | 线上部署 |
|------|----------|----------|
| 产品列表（前台） | Mock 数据 (catalog.ts) | Mock 数据 |
| 产品管理（后台） | Mock 数据 (repository.ts) | Supabase |
| 文章管理 | Mock 数据 (repository.ts) | Supabase |
| 询价管理 | Mock 数据 (repository.ts) | Supabase |
| 页面内容 | Mock 数据 (repository.ts) | Supabase |
| 全局设置 | Mock 数据 | Supabase |

> ⚠️ 线上需配置 Supabase 环境变量才能使用真实数据库

---

## 九、关键文件位置

| 功能 | 文件路径 |
|------|----------|
| 产品 Mock 数据 | `/src/lib/products/catalog.ts` |
| 文章/询价 Mock 数据 | `/src/lib/data/repository.ts` |
| 中文翻译 | `/src/messages/zh.json` |
| 英文翻译 | `/src/messages/en.json` |
| 图片资源 | `/public/images/` |
| 上传文件 | `/public/uploads/` |

---

## 十、测试时替换图片

如需替换测试图片，直接用相同文件名覆盖：

```bash
# 产品图片
/public/images/products/1.jpg ~ 6.jpg

# Hero 背景
/public/images/hero/*.png

# 文章封面
/public/images/insights/1.jpg ~ 3.jpg
```

或通过后台上传新图片。
