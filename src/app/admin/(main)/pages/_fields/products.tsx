"use client";

import {
  SectionHeader,
  FieldRow,
  TextInput,
} from "../_components";

/**
 * 与前台 ProductsPageClient（usePageContent('products')）键名、默认文案一致。
 * 精简为轻量站真正需要维护的字段：筛选区标题、三个下拉筛选标题、空状态、卡片基础标签。
 */
export function ProductsFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="筛选区核心文案" note="对应 /products 顶部横向筛选条与空状态；产品内容本身来自「产品管理」" />
        <FieldRow label="筛选区标题">
          <TextInput name="filter.sidebarTitle" defaultValue={zh ? "筛选器" : "Filters"} translateFrom="filter.sidebarTitle" />
        </FieldRow>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="厂牌分组标题">
            <TextInput name="filter.brandTitle" defaultValue={zh ? "品牌" : "Brands"} translateFrom="filter.brandTitle" />
          </FieldRow>
          <FieldRow label="类目分组标题">
            <TextInput name="filter.categoryTitle" defaultValue={zh ? "分类" : "Categories"} translateFrom="filter.categoryTitle" />
          </FieldRow>
          <FieldRow label="年份分组标题">
            <TextInput name="filter.yearTitle" defaultValue={zh ? "年份" : "Year"} translateFrom="filter.yearTitle" />
          </FieldRow>
        </div>
        <FieldRow label="加载中提示文案">
          <TextInput name="filter.loadingText" defaultValue={zh ? "正在加载产品数据..." : "Loading products..."} translateFrom="filter.loadingText" />
        </FieldRow>
        <FieldRow label="无结果提示文字">
          <TextInput name="filter.emptyText" defaultValue={zh ? "暂无符合条件的产品，请尝试其他筛选项" : "No products found. Try different filters."} translateFrom="filter.emptyText" />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="产品卡片标签" note="只控制卡片右上角状态标签和底部按钮文字" />
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="卡片标签：现货状态">
            <TextInput name="card.statusLabel" defaultValue={zh ? "现货状态" : "Available"} translateFrom="card.statusLabel" />
          </FieldRow>
          <FieldRow label="卡片按钮文字">
            <TextInput name="card.viewDetailsBtn" defaultValue={zh ? "查阅详尽机况" : "VIEW DETAILS"} translateFrom="card.viewDetailsBtn" />
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
