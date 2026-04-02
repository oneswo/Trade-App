"use client";

import {
  SectionHeader,
  FieldRow,
  TextInput,
  TextArea,
  DarkInput,
  DarkArea,
  ImageUpload,
} from "../_components";

export function AboutFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="仓储基地介绍" note="第一部分：左图右文" />
        <ImageUpload name="blockA.image" label="配图" aspectHint="建议 4:3" previewAspect="aspect-[4/3]" previewFit="contain" />
        <FieldRow label="区块标题">
          <TextInput name="blockA.title" defaultValue={zh ? "长三角核心 源头底库基地" : "Core Yangtze Delta Base of Operations"} />
        </FieldRow>
        <FieldRow label="段落 1">
          <TextArea name="blockA.p1" defaultValue={zh ? "自2003年起，我们深度扎根于具有全球航运统治力的上海港腹地。打造了拥有逾 2000平米 的现代化重装整备急库区，绝不倒买倒卖，坚持全仓纯实体现车。" : "Since 2003, deeply rooted in Shanghai's port hinterland. We built a modern 2,000+ sqm heavy equipment preparation yard — holding only real physical units, never drop-shipping."} />
        </FieldRow>
        <FieldRow label="段落 2">
          <TextArea name="blockA.p2" defaultValue={zh ? "基地内置独立无尘液压车间与动力测试线。我们斥资汇聚业内尖端检测仪与退役资深工程师，确保所有经我们出海的卡特彼勒、小松、日立等重卡，拥有硬核的原厂级运转能力。" : "The base includes a clean-room hydraulic workshop and engine dynamometer test line, staffed by retired OEM engineers ensuring factory-grade performance for every exported machine."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="勾选项 1">
            <TextInput name="blockA.check1" defaultValue={zh ? "全驱自营机械整备流水线" : "Fully self-operated overhaul assembly line"} />
          </FieldRow>
          <FieldRow label="勾选项 2">
            <TextInput name="blockA.check2" defaultValue={zh ? "深链大干线专属海运特权" : "Dedicated mainline shipping privileges"} />
          </FieldRow>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="交付能力介绍" note="第二部分：右图左文 + 2 张小卡片" />
        <ImageUpload name="blockB.image" label="配图" aspectHint="建议 4:3" previewAspect="aspect-[4/3]" previewFit="contain" />
        <FieldRow label="区块标题">
          <TextInput name="blockB.title" defaultValue={zh ? "跨越极限工况的 重载交付力" : "Heavy-Duty Delivery Beyond Extreme Conditions"} />
        </FieldRow>
        <FieldRow label="段落 1">
          <TextArea name="blockB.p1" defaultValue={zh ? '重载机械漂洋过海不是终点，矿山实操才是！我们的海外业务不仅仅是"卖单机器"，更是全生命周期的工业护航。' : "Getting heavy machinery across the ocean is only the beginning — mine-site performance is the real test. Our overseas business is full lifecycle industrial support."} />
        </FieldRow>
        <FieldRow label="段落 2">
          <TextArea name="blockB.p2" defaultValue={zh ? "至今，我们高密度地将成套编队级工程机械成功投送至印尼镍矿、秘鲁铜矿区、以及肯尼亚基建一线。以严苛的拒售翻新组装机的红线铁律，建立起跨国老客的绝对信任壁垒。" : "We have deployed fleet-scale machinery to Indonesian nickel mines, Peruvian copper zones, and Kenyan infrastructure fronts, building absolute trust through an iron-clad no-rebuilt-machine policy."} />
        </FieldRow>
        <div className="rounded-xl border border-black/[0.06] p-3 space-y-2 bg-white">
          <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">Mini 卡片 1（白色）</span>
          <FieldRow label="标题"><TextInput name="blockB.card1.title" defaultValue={zh ? "绝不妥协的品控" : "Integrity & Mutual Benefit"} /></FieldRow>
          <FieldRow label="描述"><TextArea name="blockB.card1.desc" rows={2} defaultValue={zh ? "一票否决事故框架与火烧水淹，从物理源头捍卫商誉。" : "We never trade in accident-damaged or rebuilt machines — our foundation is built on long-term partnerships worldwide."} /></FieldRow>
        </div>
        <div className="rounded-xl border border-[#D4AF37]/20 p-3 space-y-2 bg-[#111111]">
          <span className="text-[10px] font-bold tracking-widest text-[#D4AF37]/50 uppercase">Mini 卡片 2（黑金）</span>
          <FieldRow label="标题"><DarkInput name="blockB.card2.title" defaultValue={zh ? "云端穿洲排障" : "Service First"} gold /></FieldRow>
          <FieldRow label="描述"><DarkArea name="blockB.card2.desc" defaultValue={zh ? "首席技师无视时区差，跨洋视频连线硬核拆解指导。" : "Dedicated engineers provide seamless maintenance support across all time zones."} /></FieldRow>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="成就数据区" note="4 组数字和标签" />
        <div className="space-y-2 rounded-xl border border-black/[0.06] p-4 bg-[#FAFAFA]">
          {[
            { num: "20", zh_l: "年出海行业深耕", en_l: "Years in the Industry" },
            { num: "30", zh_l: "支特派抢修梯队", en_l: "Field Engineers Deployed" },
            { num: "50", zh_l: "个矿建出海国家", en_l: "Countries Reached" },
            { num: "3000", zh_l: "台实体现车交付", en_l: "Machines Safely Delivered" },
          ].map((s, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <TextInput name={`stats.${i}.num`} defaultValue={s.num} />
              <TextInput name={`stats.${i}.label`} defaultValue={zh ? s.zh_l : s.en_l} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="资质证书区" note="4 张证书卡：图片、名称、编号" />
        <FieldRow label="区块标题">
          <TextInput name="certs.title" defaultValue={zh ? "全球通行的重金属底气" : "Our Industry Certifications"} />
        </FieldRow>
        <FieldRow label="区块说明">
          <TextArea name="certs.desc" defaultValue={zh ? "我们配备了最苛刻的第三方驻场验机标准与源产地报关资质矩阵，以强悍的官方背书秒杀清关屏障。" : "We continually advance our production capabilities and quality control systems, supported by accredited inspection institutions and a globally recognized sales and service network."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-3">
          {[
            { zh_n: "重工溯源认证", en_n: "Verified Supplier", zh_code: "VERIFIED SUPPLIER", en_code: "TRADE ASSURANCE" },
            { zh_n: "欧盟通行准入", en_n: "CE Conformity", zh_code: "CE CONFORMITY", en_code: "EU MARKET ACCESS" },
            { zh_n: "国际质控标准", en_n: "ISO 9001:2015", zh_code: "ISO 9001:2015", en_code: "QUALITY MANAGEMENT" },
            { zh_n: "第三方驻场终检", en_n: "SGS Inspection", zh_code: "SGS INSPECTION", en_code: "THIRD-PARTY VERIFIED" },
          ].map((cert, i) => (
            <div key={i} className="rounded-xl border border-black/[0.06] p-3 space-y-2 bg-[#FAFAFA]">
              <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">证书 {i + 1}</span>
              <ImageUpload name={`cert.${i}.image`} label="证书图片" aspectHint="建议 7:5，JPG / PNG" previewAspect="aspect-[7/5]" previewFit="contain" />
              <FieldRow label="证书名称">
                <TextInput name={`cert.${i}.name`} defaultValue={zh ? cert.zh_n : cert.en_n} />
              </FieldRow>
              <FieldRow label="证书代码">
                <TextInput name={`cert.${i}.code`} defaultValue={zh ? cert.zh_code : cert.en_code} />
              </FieldRow>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
