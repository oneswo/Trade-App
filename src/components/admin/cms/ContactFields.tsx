"use client";

import { SectionHeader, FieldRow, TextInput, TextArea, ImageUpload } from "./shared";

export default function ContactFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" note="对应联系页顶部的全宽背景与标题区" />
        <ImageUpload name="hero.bgImage" label="Hero 背景图片" aspectHint="建议比例 16:5，JPG / PNG，最大 5MB" />
        <FieldRow label="顶部小标签">
          <TextInput name="hero.tag" defaultValue={zh ? "全球二手重装直发中心" : "GLOBAL SALES & DISPATCH CENTER"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "全球联络，" : "GLOBAL CONTACT,"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "极速调度。" : "RAPID DISPATCH."} />
        </FieldRow>
        <FieldRow label="副标题描述">
          <TextArea name="hero.desc" defaultValue={zh ? "无论您身处哪一大洲的矿场机位，我们的特派工程师将提供 24 小时跨洋直连，为您敲定源头底价与专属航运配额。" : "Wherever you are, our engineers provide 24/7 cross-ocean support to finalize your source price and shipping quota."} />
        </FieldRow>
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块二：核心联络信息" note="左侧深色信息栏（地址、邮箱、电话、营业时间）" />
        <FieldRow label="总部标题">
          <TextInput name="info.hqTitle" defaultValue={zh ? "全域出海调度中心" : "Global Export Dispatch Center"} />
        </FieldRow>
        <FieldRow label="总部描述">
          <TextArea name="info.hqDesc" defaultValue={zh ? "无视时区差与洲际屏障。我们的国际贸易工程师将在 12 小时内为您响应跨洋货单、极致型号垂询与实机验车请求。" : "Crossing time zones and continental barriers, our trade engineers respond within 12 hours to any inquiry."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="地址模块标题">
            <TextInput name="info.addrTitle" defaultValue={zh ? "上海总部与调度中枢" : "Shanghai HQ & Dispatch Hub"} />
          </FieldRow>
          <FieldRow label="地址补充说明">
            <TextInput name="info.addrNote" defaultValue={zh ? "(紧邻重载特大型滚装海运枢纽)" : "Shanghai, China (Adjacent to RO-RO Port)"} />
          </FieldRow>
          <FieldRow label="总部地址（中文）">
            <TextInput name="info.addrZh" defaultValue="中国上海市青浦区重型机械工业园 88 号" />
          </FieldRow>
          <FieldRow label="总部地址（英文）">
            <TextInput name="info.addrEn" defaultValue="No. 88 Heavy Machinery Park, Qingpu District, Shanghai, China" />
          </FieldRow>
          <FieldRow label="邮箱">
            <TextInput name="info.email" defaultValue="global@kxtjexcavator.com" />
          </FieldRow>
          <FieldRow label="邮箱模块标题">
            <TextInput name="info.emailTitle" defaultValue={zh ? "全系底库报价专线" : "Quotation Hotline"} />
          </FieldRow>
          <FieldRow label="电话 / WhatsApp">
            <TextInput name="info.phone" defaultValue="+86 153 7531 9246" />
          </FieldRow>
          <FieldRow label="电话模块标题">
            <TextInput name="info.phoneTitle" defaultValue={zh ? "24小时全球技术抢修部" : "24/7 Technical Support"} />
          </FieldRow>
        </div>
        <FieldRow label="技术支持补充说明">
          <TextInput name="info.supportNote" defaultValue={zh ? "支持全时区实时连线 / 视频排障" : "Live Video Support Across All Time Zones"} />
        </FieldRow>
        <FieldRow label="营业时间模块标题">
          <TextInput name="info.hoursTitle" defaultValue={zh ? "营业时间" : "Business Hours"} />
        </FieldRow>
        <FieldRow label="营业时间">
          <TextInput name="info.hours" defaultValue={zh ? "周一至周六 09:00 - 18:00 (UTC+8)，紧急询盘 24小时响应" : "Mon–Sat 09:00–18:00 UTC+8, emergency inquiries answered 24/7"} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="地图气泡标题">
            <TextInput name="map.bubbleTitle" defaultValue={zh ? "中国机械 亚太调度中枢" : "KXTJ Machinery HQ"} />
          </FieldRow>
          <FieldRow label="地图气泡副标题">
            <TextInput name="map.bubbleSubtitle" defaultValue="Shanghai Global Base" />
          </FieldRow>
        </div>
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块三：大区联系人（4 位）" note="与前台「直连大洲业务总控」四张卡片顺序一致：1 尹世兵 2 尹洪峰 3 安娜·李 4 安妮" />
        <FieldRow label="团队区块主标题">
          <TextInput name="team.sectionTitle" defaultValue={zh ? "直连大洲业务总控" : "Direct Regional Contacts"} />
        </FieldRow>
        <FieldRow label="团队区块描述">
          <TextArea name="team.sectionDesc" defaultValue={zh ? "跳过漫长的转接等待。我们根据全球大洲划分了独立的业务战区，随时接管您的专线询盘。" : "Skip the long waiting queue. Our regional teams are divided by continent, ready to handle your inquiries directly."} />
        </FieldRow>
        <FieldRow label="成员卡片：直线电话标签">
          <TextInput name="team.directLineLabel" defaultValue={zh ? "专线直驳" : "Direct Line"} />
        </FieldRow>
        <FieldRow label="成员卡片：WhatsApp 标签">
          <TextInput name="team.whatsappLabel" defaultValue="WhatsApp" />
        </FieldRow>
        {[
          { nameZh: "尹世兵", nameEn: "Steven Yin", zh_title: "亚太区执行董事", en_title: "APAC Executive Director", defaultPhoto: "/images/avatars/yin.png", defaultPhone: "+8615156888267" },
          { nameZh: "尹洪峰", nameEn: "Frank Yin", zh_title: "拉非高级代办", en_title: "LATAM & Africa Lead", defaultPhoto: "/images/avatars/hong.png", defaultPhone: "+8619159103568" },
          { nameZh: "安娜·李", nameEn: "Anna Li", zh_title: "欧亚中东总监", en_title: "EU & MENA Director", defaultPhoto: "/images/avatars/anna.png", defaultPhone: "+8617321077956" },
          { nameZh: "安妮", nameEn: "Annie", zh_title: "泛西非大区专员", en_title: "West Africa Specialist", defaultPhoto: "/images/avatars/annie.png", defaultPhone: "+8617317763969" },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
            <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">成员 {i+1}</span>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-start">
              <ImageUpload name={`team.${i}.photo`} label="头像" aspectHint="建议方形，露脸清晰" defaultValue={m.defaultPhoto} />
              <div className="space-y-3">
                <FieldRow label="姓名"><TextInput name={`team.${i}.name`} defaultValue={zh ? m.nameZh : m.nameEn} /></FieldRow>
                <FieldRow label="职称"><TextInput name={`team.${i}.title`} defaultValue={zh ? m.zh_title : m.en_title} /></FieldRow>
                <FieldRow label="电话 / WhatsApp" hint="含国家区号，如 +8613812345678"><TextInput name={`team.${i}.phone`} defaultValue={m.defaultPhone} /></FieldRow>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块四：底部询单 CTA（P0）" note="联系页底部深色表单区（标题、说明、表单文案）" />
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="bottomCta.title1" defaultValue={zh ? "即刻开启您的" : "Start Your"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="bottomCta.titleGold" defaultValue={zh ? "重装之行" : "Heavy Equipment Journey"} />
        </FieldRow>
        <FieldRow label="描述文案">
          <TextArea name="bottomCta.desc" defaultValue={zh ? "只需在联系表格中留下您的电子件或电话，我们即可向您发送各大厂牌机皇底价和私密库存表。" : "Simply leave your email or phone number, and we will send you the best prices on top brands and exclusive inventory lists."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="姓名输入框标题">
            <TextInput name="bottomCta.form.nameLabel" defaultValue={zh ? "您的称谓" : "YOUR NAME"} />
          </FieldRow>
          <FieldRow label="姓名输入框占位">
            <TextInput name="bottomCta.form.namePlaceholder" defaultValue={zh ? "您的姓名 *" : "Full Name *"} />
          </FieldRow>
          <FieldRow label="联系方式输入框标题">
            <TextInput name="bottomCta.form.contactLabel" defaultValue={zh ? "联系方式 (WhatsApp / 邮箱)" : "CONTACT (WHATSAPP/EMAIL)"} />
          </FieldRow>
          <FieldRow label="联系方式输入框占位">
            <TextInput name="bottomCta.form.contactPlaceholder" defaultValue={zh ? "电子邮箱或 WhatsApp *" : "Email or WhatsApp *"} />
          </FieldRow>
          <FieldRow label="需求输入框标题">
            <TextInput name="bottomCta.form.messageLabel" defaultValue={zh ? "所需机型的极限工况与型号" : "REQUIREMENTS"} />
          </FieldRow>
          <FieldRow label="需求输入框占位">
            <TextInput name="bottomCta.form.messagePlaceholder" defaultValue={zh ? "您需要哪些型号的重装机械报价? (例如: 需要三一 36C 挖掘机发往西非) *" : "Which models do you need quotes for? (e.g. SANY 36C excavator to West Africa) *"} />
          </FieldRow>
        </div>
        <FieldRow label="提交按钮文案">
          <TextInput name="bottomCta.submitBtn" defaultValue={zh ? "立即获取 CIF 底价" : "GET CIF PRICE NOW"} />
        </FieldRow>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="社交图标标题：WhatsApp">
            <TextInput name="bottomCta.social.whatsappTitle" defaultValue="WhatsApp" />
          </FieldRow>
          <FieldRow label="社交图标标题：LinkedIn">
            <TextInput name="bottomCta.social.linkedinTitle" defaultValue="LinkedIn" />
          </FieldRow>
          <FieldRow label="社交图标标题：Facebook">
            <TextInput name="bottomCta.social.facebookTitle" defaultValue="Facebook" />
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
