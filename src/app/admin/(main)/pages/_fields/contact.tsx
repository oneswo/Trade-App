"use client";

import {
  SectionHeader,
  FieldRow,
  TextInput,
  TextArea,
  ImageUpload,
  VideoUpload,
} from "../_components";

export function ContactFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="总部联络信息" note="左侧信息栏 + 公司介绍视频" />
        <FieldRow label="主标题">
          <TextInput name="info.hqTitle" defaultValue={zh ? "全域出海调度中心" : "Global Dispatch Center"} />
        </FieldRow>
        <FieldRow label="简介说明">
          <TextArea name="info.hqDesc" defaultValue={zh ? "无视时区差与洲际屏障。我们的国际贸易工程师将在 12 小时内为您响应跨洋货单、极致型号垂询与实机验车请求。" : "We transcend time zones and continental barriers. Our international trade engineers respond within 12 hours to cross-border orders, specification inquiries, and live machine inspection requests."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="地址模块标题">
            <TextInput name="info.addrTitle" defaultValue={zh ? "上海总部与调度中枢" : "Shanghai HQ & Dispatch Hub"} />
          </FieldRow>
          <FieldRow label="地址补充说明">
            <TextInput name="info.addrNote" defaultValue={zh ? "(紧邻重载特大型滚装海运枢纽)" : "Shanghai, China (Adjacent to RO-RO Port)"} />
          </FieldRow>
          <FieldRow label="总部地址（中文）">
            <TextInput name="info.addrZh" defaultValue="中国上海市奉贤区金海公路6055号" />
          </FieldRow>
          <FieldRow label="总部地址（英文）">
            <TextInput name="info.addrEn" defaultValue="No. 6055 Jinhai Road, Fengxian District" />
          </FieldRow>
          <FieldRow label="邮箱">
            <TextInput name="info.email" defaultValue="15156888267@163.com" />
          </FieldRow>
          <FieldRow label="邮箱模块标题">
            <TextInput name="info.emailTitle" defaultValue={zh ? "全系底库报价专线" : "Quotation Hotline"} />
          </FieldRow>
          <FieldRow label="电话 / WhatsApp">
            <TextInput name="info.phone" defaultValue="+86 17321077956" />
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
        <VideoUpload
          name="media.videoUrl"
          label="公司介绍视频"
          hint="上传后前台会替换原地图模块；MP4 / WebM / MOV，最大 80MB"
        />
      </div>
      <div className="space-y-5">
        <SectionHeader title="团队联系人" note="4 位区域联系人卡片" />
        <FieldRow label="区块标题">
          <TextInput name="team.sectionTitle" defaultValue={zh ? "直连大洲业务总控" : "Direct Regional Contacts"} />
        </FieldRow>
        <FieldRow label="区块说明">
          <TextArea name="team.sectionDesc" defaultValue={zh ? "跳过漫长的转接等待。我们根据全球大洲划分了独立的业务战区，随时接管您的专线询盘。" : "Skip the long waiting queue. Our regional teams are divided by continent, ready to handle your inquiries directly."} />
        </FieldRow>
        {[
          { nameZh: "尹世兵", nameEn: "Steven Yin", zh_title: "亚太区执行董事", en_title: "APAC Executive Director", defaultPhoto: "", defaultPhone: "+8615156888267" },
          { nameZh: "尹洪峰", nameEn: "Frank Yin", zh_title: "拉非高级代办", en_title: "LATAM & Africa Lead", defaultPhoto: "", defaultPhone: "+8619159103568" },
          { nameZh: "安娜·李", nameEn: "Anna Li", zh_title: "欧亚中东总监", en_title: "EU & MENA Director", defaultPhoto: "", defaultPhone: "+8617321077956" },
          { nameZh: "安妮", nameEn: "Annie", zh_title: "泛西非大区专员", en_title: "West Africa Specialist", defaultPhoto: "", defaultPhone: "+8617317763969" },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
            <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">成员 {i + 1}</span>
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
    </div>
  );
}
