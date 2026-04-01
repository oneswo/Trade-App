"use client";

import {
  SectionHeader,
  FieldRow,
  TextInput,
  TextArea,
  ImageUpload,
  CardBlock,
} from "../_components";

export function ProductDetailFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader
          title="模块：交付实力保障卡片"
          note="产品详情页底部的 3 张交付保障卡片（全站共用内容，单个产品可通过编辑器开关控制是否展示）"
        />

        <FieldRow label="版块标题">
          <TextInput
            name="delivery.sectionTitle"
            defaultValue={
              zh ? "交付实力保障" : "DELIVERY EXCELLENCE"
            }
          />
        </FieldRow>

        {/* ── 卡片 1 ── */}
        <CardBlock index={1} label="卡片">
          <ImageUpload
            name="delivery.card1.image"
            label="卡片图片"
            aspectHint="建议比例 16:9，JPG / PNG"
          />
          <FieldRow label="标题">
            <TextInput
              name="delivery.card1.title"
              defaultValue={
                zh
                  ? "125 项底盘与液压深度检测"
                  : "125-Point Hydraulic & Chassis Inspection"
              }
            />
          </FieldRow>
          <FieldRow label="描述">
            <TextArea
              name="delivery.card1.desc"
              defaultValue={
                zh
                  ? "从冷机启动烟色、到液压大泵主阀的滴漏渗油排查，我们的场内工程师会对该设备出具近乎苛刻的验机报告。您将看到未经任何滤镜处理的高清细节。"
                  : "From cold-start smoke analysis to main pump leak detection, our engineers provide an uncompromising report. You will see raw, unfiltered high-definition footage."
              }
            />
          </FieldRow>
        </CardBlock>

        {/* ── 卡片 2 ── */}
        <CardBlock index={2} label="卡片">
          <ImageUpload
            name="delivery.card2.image"
            label="卡片图片"
            aspectHint="建议比例 16:9，JPG / PNG"
          />
          <FieldRow label="标题">
            <TextInput
              name="delivery.card2.title"
              defaultValue={
                zh
                  ? "3000+ 台场地现车集结结网"
                  : "3,000+ Units Ready in Storage"
              }
            />
          </FieldRow>
          <FieldRow label="描述">
            <TextArea
              name="delivery.card2.desc"
              defaultValue={
                zh
                  ? '上海综保区直发。我们不是"空手套白狼"的中介机构，每一台设备均在我们的全硬化地坪仓库中真实趴放，接受您的视频连线抽检或第三方登船验收。'
                  : "Shipped directly from Shanghai Bonded Zone. Every machine is physically sitting in our hardened yards, ready for your real-time video inspection or third-party (SGS) boarding verification."
              }
            />
          </FieldRow>
        </CardBlock>

        {/* ── 卡片 3 ── */}
        <CardBlock index={3} label="卡片">
          <ImageUpload
            name="delivery.card3.image"
            label="卡片图片"
            aspectHint="建议比例 16:9，JPG / PNG"
          />
          <FieldRow label="标题">
            <TextInput
              name="delivery.card3.title"
              defaultValue={
                zh
                  ? "Ro-Ro 与 Flat Rack 深海装调"
                  : "Ro-Ro & Flat Rack Deep-Sea Rigging"
              }
            />
          </FieldRow>
          <FieldRow label="描述">
            <TextArea
              name="delivery.card3.desc"
              defaultValue={
                zh
                  ? "针对 20 吨及以上的重型怪兽，我们具有长达十余年的特种集装箱绑扎与滚装船订舱护航经验。确保您的钢铁资产横跨经纬线，安全登陆母港。"
                  : "For 20-ton+ heavy monsters, we have over a decade of experience in special container lashing and Ro-Ro vessel booking. Ensuring your steel assets land safely across the oceans."
              }
            />
          </FieldRow>
        </CardBlock>
      </div>
    </div>
  );
}
