"use client";

import {
  SectionHeader,
  FieldRow,
  TextInput,
  TextArea,
  ImageUpload,
} from "../_components";

export function ProductsFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" note="对应产品列表顶部的全宽背景与标题区" />
        <ImageUpload name="hero.bgImage" label="Hero 背景图片" aspectHint="建议比例 16:5，JPG / PNG，最大 5MB" />
        <FieldRow label="顶部小标签">
          <TextInput name="hero.tag" defaultValue={zh ? "全球二手重工机械直采平台" : "GLOBAL USED HEAVY EQUIPMENT DIRECT SOURCING"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "精品重装，" : "PREMIUM IRON,"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "全球直发。" : "GLOBAL DIRECT."} />
        </FieldRow>
        <FieldRow label="副标题描述">
          <TextArea name="hero.desc" defaultValue={zh ? "集结全球顶级品牌二手工程机械，经 KXTJ 严苛百项质检，确保每台机械以最佳状态抵达目的地。" : "Top-tier used construction machinery from global brands, each passing KXTJ's 100-point inspection."} />
        </FieldRow>
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块二：筛选区文案" note="搜索、筛选、排序、列表状态等文案" />
        <FieldRow label="筛选区顶部小标签">
          <TextInput name="filter.badge" defaultValue={zh ? "精确寻机" : "SEARCH"} />
        </FieldRow>
        <FieldRow label="筛选面板标题">
          <TextInput name="filter.panelTitle" defaultValue={zh ? "筛选机械库" : "FILTERS"} />
        </FieldRow>
        <FieldRow label="打开筛选按钮文字">
          <TextInput name="filter.openBtn" defaultValue={zh ? "打开终端" : "OPEN TERMINAL"} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="移动端筛选面板标题">
            <TextInput name="filter.mobileTitle" defaultValue={zh ? "滤镜终端" : "FILTERS TERMINAL"} />
          </FieldRow>
          <FieldRow label="移动端筛选分区标题">
            <TextInput name="filter.mobileSectionTitle" defaultValue={zh ? "属性筛选大盘" : "FILTER TERMINAL"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="重置按钮文字">
            <TextInput name="filter.resetBtn" defaultValue={zh ? "重置参数" : "RESET"} />
          </FieldRow>
          <FieldRow label="执行筛选按钮文字">
            <TextInput name="filter.executeBtn" defaultValue={zh ? "执行绝对检索" : "EXECUTE SEARCH"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="厂牌分组标题">
            <TextInput name="filter.brandTitle" defaultValue={zh ? "核心厂牌" : "BRANDS"} />
          </FieldRow>
          <FieldRow label="类目分组标题">
            <TextInput name="filter.categoryTitle" defaultValue={zh ? "器械类目" : "CATEGORIES"} />
          </FieldRow>
          <FieldRow label="年份分组标题">
            <TextInput name="filter.yearTitle" defaultValue={zh ? "年份区间" : "YEAR RANGE"} />
          </FieldRow>
        </div>
        <FieldRow label="搜索框占位提示文字">
          <TextInput name="filter.searchPlaceholder" defaultValue={zh ? "搜索品牌、型号、工况..." : "Search brand, model, condition..."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="结果区前缀文案">
            <TextInput name="filter.resultsPrefix" defaultValue={zh ? "为您列阵" : "SHOWING"} />
          </FieldRow>
          <FieldRow label="结果区后缀文案">
            <TextInput name="filter.resultsSuffix" defaultValue={zh ? "辆符合指标的实车" : "MACHINES FOUND"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="排序标签文案">
            <TextInput name="filter.sortLabel" defaultValue={zh ? "排序:" : "SORT:"} />
          </FieldRow>
          <FieldRow label="加载中提示文案">
            <TextInput name="filter.loadingText" defaultValue={zh ? "正在加载产品数据..." : "Loading products..."} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="排序项：年份最新">
            <TextInput name="filter.sortNewest" defaultValue={zh ? "年份最新" : "Newest First"} />
          </FieldRow>
          <FieldRow label="排序项：工时最低">
            <TextInput name="filter.sortHours" defaultValue={zh ? "工时最低" : "Lowest Hours"} />
          </FieldRow>
          <FieldRow label="排序项：厂牌 A-Z">
            <TextInput name="filter.sortBrand" defaultValue={zh ? "厂牌 (A-Z)" : "Brand (A-Z)"} />
          </FieldRow>
        </div>
        <FieldRow label="无结果提示文字">
          <TextInput name="filter.emptyText" defaultValue={zh ? "暂无符合条件的产品，请尝试其他筛选项" : "No products found. Try different filters."} />
        </FieldRow>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="卡片标签：现货状态">
            <TextInput name="card.statusLabel" defaultValue={zh ? "现货状态" : "Available"} />
          </FieldRow>
          <FieldRow label="卡片标签：工时">
            <TextInput name="card.hoursLabel" defaultValue={zh ? "工时" : "Hours"} />
          </FieldRow>
          <FieldRow label="卡片标签：自重">
            <TextInput name="card.weightLabel" defaultValue={zh ? "自重" : "Weight"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="卡片标签：动力">
            <TextInput name="card.engineLabel" defaultValue={zh ? "动力" : "Engine"} />
          </FieldRow>
          <FieldRow label="卡片标签：定位">
            <TextInput name="card.locationLabel" defaultValue={zh ? "定位" : "LOC"} />
          </FieldRow>
          <FieldRow label="卡片按钮文字">
            <TextInput name="card.viewDetailsBtn" defaultValue={zh ? "查阅详尽机况" : "VIEW DETAILS"} />
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
