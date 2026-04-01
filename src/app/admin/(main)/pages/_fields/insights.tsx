"use client";

import {
  SectionHeader,
  FieldRow,
  TextInput,
  TextArea,
  ImageUpload,
} from "../_components";

export function InsightsFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" note="对应智库页顶部的全宽背景与标题区" />
        <ImageUpload name="hero.bgImage" label="Hero 背景图片" aspectHint="建议比例 16:5，JPG / PNG，最大 5MB" />
        <FieldRow label="顶部小标签">
          <TextInput name="hero.tag" defaultValue={zh ? "重装出海行业内参" : "HEAVY EQUIPMENT EXPORT INSIGHTS"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "穿透迷雾，" : "Cut the Fog, "} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "掌握底牌。" : "Own the Deal."} />
        </FieldRow>
        <FieldRow label="副标题描述">
          <TextArea name="hero.desc" defaultValue={zh ? "跳出信息不对称的陷阱。出海工程师每周为您深度拆解二手重装采购防坑逻辑、维护要略与真实市场走势。" : "Escape the trap of information asymmetry. Our senior engineers deliver weekly teardowns on used machinery export strategies, maintenance essentials, and real market trends."} />
        </FieldRow>
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块二：列表区文案" note="文章卡片动态拉取" />
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="分类 Tab：全部">
            <TextInput name="list.tabAll" defaultValue={zh ? "全部内参" : "ALL INSIGHTS"} />
          </FieldRow>
          <FieldRow label="分类 Tab：采购避坑">
            <TextInput name="list.tabGuides" defaultValue={zh ? "采购避坑" : "GUIDES"} />
          </FieldRow>
          <FieldRow label="分类 Tab：出海维保">
            <TextInput name="list.tabMaintenance" defaultValue={zh ? "出海维保" : "MAINTENANCE"} />
          </FieldRow>
          <FieldRow label="分类 Tab：港口实录">
            <TextInput name="list.tabReports" defaultValue={zh ? "港口实录" : "REPORTS"} />
          </FieldRow>
        </div>
        <FieldRow label="加载中提示文案">
          <TextInput name="list.loadingText" defaultValue={zh ? "加载中..." : "Loading..."} />
        </FieldRow>
        <FieldRow label="空状态主文案">
          <TextInput name="list.emptyText" defaultValue={zh ? "暂无文章" : "No articles yet"} />
        </FieldRow>
        <FieldRow label="空状态副文案">
          <TextInput name="list.emptySubtext" defaultValue={zh ? "敲定期待，数据将由后台发布" : "Stay tuned, articles will be published from admin panel"} />
        </FieldRow>
        <FieldRow label="卡片底部「阅读全文」类文案">
          <TextInput name="list.readMoreBtn" defaultValue={zh ? "阅读专业内参" : "Read Full Report"} />
        </FieldRow>
        <FieldRow label="「查看更多」按钮文字">
          <TextInput name="list.viewMoreBtn" defaultValue={zh ? "获取更多行业背书记录" : "Load More Insights"} />
        </FieldRow>
      </div>
    </div>
  );
}
