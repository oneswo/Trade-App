"use client";

import { SectionHeader, FieldRow, TextInput, TextArea, DarkInput, DarkArea, ImageUpload } from "./shared";

export default function AboutFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" note="对应关于页顶部的全宽背景与标题区" />
        <ImageUpload name="hero.bgImage" label="Hero 背景图片" aspectHint="对应 /images/hero/about.png，建议 16:5" />
        <FieldRow label="顶部小标签">
          <TextInput name="hero.tag" defaultValue={zh ? "全球工程机械发运枢纽" : "GLOBAL MACHINERY HUB"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "扎根上海，" : "ROOTED IN SH,"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "驱动全球。" : "DRIVE GLOBAL."} />
        </FieldRow>
        <FieldRow label="副标题描述">
          <TextArea name="hero.desc" defaultValue={zh ? "重塑二手工程机械出海领域的绝对信任标杆，严苛重金整备与出境质检，确保全球买家拿到顶尖实机。" : "Reshaping the absolute trust benchmark in the global used heavy equipment supply chain, ensuring every buyer receives top-tier machines."} />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块二 — Block A：长三角核心源头底库基地（左图右文）" note="第一组左图右文" />
        <ImageUpload name="blockA.image" label="左侧图片" aspectHint="对应 /images/about/office.jpg，建议 4:3" />
        <FieldRow label="板块标题">
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
        <SectionHeader title="模块二 — Block B：跨越极限工况的重载交付力（右图左文）" note="第二组右图左文 + 两枚 mini 卡" />
        <ImageUpload name="blockB.image" label="右侧图片" aspectHint="对应 /images/about/yard.jpg，建议 4:3" />
        <FieldRow label="板块标题">
          <TextInput name="blockB.title" defaultValue={zh ? "跨越极限工况的 重载交付力" : "Heavy-Duty Delivery Beyond Extreme Conditions"} />
        </FieldRow>
        <FieldRow label="段落 1">
          <TextArea name="blockB.p1" defaultValue={zh ? "重载机械漂洋过海不是终点，矿山实操才是！我们的海外业务不仅仅是销售单台机器，更是全生命周期的工业护航。" : "Getting heavy machinery across the ocean is only the beginning — mine-site performance is the real test. Our overseas business is full lifecycle industrial support."} />
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
        <SectionHeader title="模块三：核心成就数字条（4组）" note="四组数字 + 标签" />
        <div className="space-y-2 rounded-xl border border-black/[0.06] p-4 bg-[#FAFAFA]">
          {[
            { num: "20",   zh_l: "年出海行业深耕",  en_l: "Years in the Industry" },
            { num: "30",   zh_l: "支特派抢修梯队",  en_l: "Field Engineers Deployed" },
            { num: "50",   zh_l: "个矿建出海国家",  en_l: "Countries Reached" },
            { num: "3000", zh_l: "台实体现车交付",  en_l: "Machines Safely Delivered" },
          ].map((s, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <TextInput name={`stats.${i}.num`} defaultValue={s.num} />
              <TextInput name={`stats.${i}.label`} defaultValue={zh ? s.zh_l : s.en_l} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块四：全球准入资质墙（4张证书卡）" note="证书图 + 中英文名称" />
        <FieldRow label="板块主标题">
          <TextInput name="certs.title" defaultValue={zh ? "全球通行的重金属底气" : "Our Industry Certifications"} />
        </FieldRow>
        <FieldRow label="板块描述">
          <TextArea name="certs.desc" defaultValue={zh ? "我们配备了最苛刻的第三方驻场验机标准与源产地报关资质矩阵，以强悍的官方背书秒杀清关屏障。" : "We continually advance our capabilities, supported by accredited inspection institutions and a globally recognized sales and service network."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-3">
          {[
            { zh_n: "重工溯源认证",  en_code: "VERIFIED SUPPLIER" },
            { zh_n: "欧盟通行准入",  en_code: "CE CONFORMITY" },
            { zh_n: "国际质控标准",  en_code: "ISO 9001:2015" },
            { zh_n: "第三方驻场终检", en_code: "SGS INSPECTION" },
          ].map((c, i) => (
            <div key={i} className="rounded-xl border border-black/[0.06] p-3 space-y-2 bg-[#FAFAFA]">
              <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">证书 {i+1}</span>
              <ImageUpload name={`cert.${i}.image`} label="证书图片" aspectHint="JPG / PNG" />
              <FieldRow label="中文名称"><TextInput name={`cert.${i}.name`} defaultValue={c.zh_n} /></FieldRow>
              <FieldRow label="英文代码"><TextInput name={`cert.${i}.code`} defaultValue={c.en_code} /></FieldRow>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块五：底部询单 CTA" note="页面底部询盘表单" />
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="cta.title1" defaultValue={zh ? "期待未来与您" : "Looking Forward to"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="cta.titleGold" defaultValue={zh ? "极度密切联运" : "Working With You"} />
        </FieldRow>
        <FieldRow label="描述文字">
          <TextArea name="cta.desc" defaultValue={zh ? "填写需求型号与目标港口，12小时内获取极致竞争力的 CIF 出海到岸底价。" : "Share your required model and conditions, receive a highly competitive FOB / CIF price within 12 hours."} />
        </FieldRow>
        <FieldRow label="表单描述框占位文字">
          <TextInput name="cta.formPlaceholder" defaultValue={zh ? "请描述您的意向厂矿机械型号与特殊发运需求..." : "Message details (e.g., machine model required or company enquiry) *"} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="姓名输入框标题">
            <TextInput name="cta.form.nameLabel" defaultValue={zh ? "您的称谓" : "YOUR NAME"} />
          </FieldRow>
          <FieldRow label="姓名输入框占位">
            <TextInput name="cta.form.namePlaceholder" defaultValue={zh ? "您的称呼" : "Your Name"} />
          </FieldRow>
          <FieldRow label="联系方式输入框标题">
            <TextInput name="cta.form.contactLabel" defaultValue={zh ? "联系方式 (WhatsApp / 邮箱)" : "CONTACT (WHATSAPP/EMAIL)"} />
          </FieldRow>
          <FieldRow label="联系方式输入框占位">
            <TextInput name="cta.form.contactPlaceholder" defaultValue={zh ? "联系方式" : "Contact Details"} />
          </FieldRow>
          <FieldRow label="需求输入框标题">
            <TextInput name="cta.form.messageLabel" defaultValue={zh ? "所需机型的极限工况与型号" : "REQUIREMENTS"} />
          </FieldRow>
        </div>
        <FieldRow label="表单提交按钮文字">
          <TextInput name="cta.submitBtn" defaultValue={zh ? "立即获取 CIF 底价" : "Send Enquiry Now"} />
        </FieldRow>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="社交图标标题：WhatsApp">
            <TextInput name="cta.social.whatsappTitle" defaultValue="WhatsApp" />
          </FieldRow>
          <FieldRow label="社交图标标题：LinkedIn">
            <TextInput name="cta.social.linkedinTitle" defaultValue="LinkedIn" />
          </FieldRow>
          <FieldRow label="社交图标标题：Facebook">
            <TextInput name="cta.social.facebookTitle" defaultValue="Facebook" />
          </FieldRow>
        </div>
      </div>

    </div>
  );
}
