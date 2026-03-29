# KXTJ / China Machinery Web App - Mock Data

Below is the extracted mock data (structured into JSON) and image references currently used on the website. You can comfortably use these payloads for testing the API/database, seeding, or plugging directly into the Admin dashboard.

## 1. Local Image Assets
You can use the following pre-existing images from the `/public` folder for seeding mock products or articles:
- `/hero.png` (Used for Excavators, Bulldozers, General Heavy Machinery, and Hero Sections)
- `/loader.png` (Used for Wheel Loaders, Graders)

---

## 2. Product Categories Mock Data

```json
[
  { "nameZh": "大型挖掘机", "nameEn": "Excavators", "type": "Excavators", "img": "/hero.png" },
  { "nameZh": "轮式装载机", "nameEn": "Wheel Loaders", "type": "Wheel Loaders", "img": "/loader.png" },
  { "nameZh": "重型推土机", "nameEn": "Bulldozers", "type": "Bulldozers", "img": "/hero.png" },
  { "nameZh": "平地机与压路机", "nameEn": "Graders & Rollers", "type": "Graders & Rollers", "img": "/loader.png" },
  { "nameZh": "工业叉车", "nameEn": "Forklifts", "type": "Forklifts", "img": "/hero.png" }
]
```

---

## 3. Top-Rated Machines (Featured Products)

```json
[
  { 
    "brand": "VOLVO", 
    "titleZh": "L350H 巨型装载机", 
    "titleEn": "L350H Wheel Loader", 
    "tagZh": "现货就绪", 
    "tagEn": "Ready to Ship", 
    "tagBg": "#D4AF37", 
    "bgImg": "/loader.png" 
  },
  { 
    "brand": "CATERPILLAR", 
    "titleZh": "320D 履带挖掘机", 
    "titleEn": "320D Excavator", 
    "tagZh": "仅剩 2 台", 
    "tagEn": "Only 2 Left", 
    "tagBg": "#ef4444", 
    "bgImg": "/hero.png" 
  },
  { 
    "brand": "KOMATSU", 
    "titleZh": "D155A 履带推土机", 
    "titleEn": "D155A Bulldozer", 
    "tagZh": "现货就绪", 
    "tagEn": "Ready to Ship", 
    "tagBg": "#D4AF37", 
    "bgImg": "/hero.png" 
  },
  { 
    "brand": "CATERPILLAR", 
    "titleZh": "140H 轮式平地机", 
    "titleEn": "140H Motor Grader", 
    "tagZh": "近3日发往拉各斯", 
    "tagEn": "Shipping Soon", 
    "tagBg": "#374151", 
    "bgImg": "/loader.png" 
  },
  { 
    "brand": "VOLVO", 
    "titleZh": "EC380D 重型挖掘机", 
    "titleEn": "EC380D Excavator", 
    "tagZh": "现货就绪", 
    "tagEn": "Ready to Ship", 
    "tagBg": "#D4AF37", 
    "bgImg": "/hero.png" 
  },
  { 
    "brand": "XCMG", 
    "titleZh": "LW500KV 装载机", 
    "titleEn": "LW500KV Loader", 
    "tagZh": "仅剩 1 台", 
    "tagEn": "Only 1 Left", 
    "tagBg": "#ef4444", 
    "bgImg": "/loader.png" 
  }
]
```

---

## 4. Live Delivery Updates (Fallback / Fallback DB Seed)
These can be used for the CMS "News/Updates" test inputs:

```json
[
  { 
    "tag": "Shipment", 
    "date": "Oct 24, 2026", 
    "country": "🇳🇬 Lagos, Nigeria", 
    "titleEn": "Three CAT 336 heavy excavators refurbished and shipped to West Africa.", 
    "titleZh": "三台卡特336重型挖掘机完成整备，发往西非拉各斯。", 
    "img": "/hero.png" 
  },
  { 
    "tag": "Delivery", 
    "date": "Oct 15, 2026", 
    "country": "🇦🇪 Dubai, UAE", 
    "titleEn": "Volvo three-unit assembly accepted and commissioned in Abu Dhabi port heat.", 
    "titleZh": "沃尔沃装载机三件套于阿布扎比港口高温环境下完成交付验收。", 
    "img": "/loader.png" 
  },
  { 
    "tag": "Dispatch", 
    "date": "Oct 02, 2026", 
    "country": "🇨🇱 Santiago, Chile", 
    "titleEn": "First South American order! Two Komatsu D155 dozers cleared customs for the Andes.", 
    "titleZh": "南美首单！两台小松D155推土机完成清关，即刻运送至安第斯山脉矿区。", 
    "img": "/hero.png" 
  },
  { 
    "tag": "Unboxing", 
    "date": "Sep 18, 2026", 
    "country": "🇧🇷 São Paulo, Brazil", 
    "titleEn": "Batch of Volvo wheel loaders arrived in São Paulo for South American distribution.", 
    "titleZh": "南美经销网络扩容：批次沃尔沃轮式装载机抵达圣保罗港开始拆箱派发。", 
    "img": "/loader.png" 
  }
]
```
