"use client";

import { SectionHeader, FieldRow, TextInput, TextArea } from "../_components";

/**
 * 与前台 `src/app/[locale]/products/[slug]/page.tsx` 中 usePageContent('product-detail') 键名、默认文案一致。
 */
export function ProductDetailFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="顶部导航" note="对应详情页上方返回路径" />
        <FieldRow label="首页链文字">
          <TextInput name="breadcrumb.home" defaultValue={zh ? "首页" : "Home"} translateFrom="breadcrumb.home" />
        </FieldRow>
        <FieldRow label="产品列表链文字">
          <TextInput name="breadcrumb.products" defaultValue={zh ? "产品列表" : "Products"} translateFrom="breadcrumb.products" />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="主图区" note="只保留真正有用的提示文案" />
        <FieldRow label="无产品视频时提示">
          <TextInput name="gallery.noVideo" defaultValue={zh ? "暂无产品视频" : "No product video"} translateFrom="gallery.noVideo" />
        </FieldRow>
        <FieldRow label="库存角标文字">
          <TextInput name="gallery.stockLabel" defaultValue={zh ? "现货数量" : "In Stock"} translateFrom="gallery.stockLabel" />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="首屏标签" note="标题下方三枚标签" />
        <FieldRow label="标签 1">
          <TextInput name="badge.sgs" defaultValue={zh ? "第三方 SGS 检测" : "SGS Verified"} translateFrom="badge.sgs" />
        </FieldRow>
        <FieldRow label="标签 2">
          <TextInput name="badge.loadTest" defaultValue={zh ? "100% 性能满载实测" : "100% Load Tested"} translateFrom="badge.loadTest" />
        </FieldRow>
        <FieldRow label="标签 3">
          <TextInput name="badge.roRo" defaultValue={zh ? "准现车滚装发运" : "Ro-Ro Ready"} translateFrom="badge.roRo" />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="核心参数区" note="右侧白色参数卡片标题" />
        <FieldRow label="区块标题">
          <TextInput name="coreSpecs.title" defaultValue={zh ? "机皇核心指标" : "Core Specifications"} translateFrom="coreSpecs.title" />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="询价 CTA" note="首屏右下角大按钮" />
        <FieldRow label="主标题">
          <TextInput
            name="cta.title"
            defaultValue={zh ? "获取私密底价与实车视频" : "Get Private Quote & Videos"}
            translateFrom="cta.title"
          />
        </FieldRow>
        <FieldRow label="副标题">
          <TextInput
            name="cta.subtitle"
            defaultValue={zh ? "10 分钟内连线售前工程师" : "Talk to Engineer in 10 mins"}
            translateFrom="cta.subtitle"
          />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="技术参数墙" note="中段灰底大卡片" />
        <FieldRow label="主标题">
          <TextInput
            name="techWall.title"
            defaultValue={zh ? "详尽技术规格档案" : "Detailed Technical Specifications"}
            translateFrom="techWall.title"
          />
        </FieldRow>
        <FieldRow label="副标题（小字全大写风格）">
          <TextInput
            name="techWall.subtitle"
            defaultValue={zh ? "精确到毫米的严苛工况数据背书" : "Precision engineering data backing"}
            translateFrom="techWall.subtitle"
          />
        </FieldRow>
        <FieldRow label="表格底部免责说明">
          <TextArea
            name="techWall.disclaimer"
            rows={4}
            translateFrom="techWall.disclaimer"
            defaultValue={
              zh
                ? "尺寸、工时和容量等运行数据可能因测量方式及设备后续加装套件不同而存在细微误差或变动，此表仅作为原厂出厂标准核算参考。最终成交前，请与您的专属顾问连线并获取精准的实车视频或第三方（SGS）出具的实时核实报告。"
                : "Dimensions, operating hours, and capacities may slightly vary due to continuous usage or aftermarket attachments. Please confirm with your dedicated advisor."
            }
          />
        </FieldRow>
      </div>
    </div>
  );
}
