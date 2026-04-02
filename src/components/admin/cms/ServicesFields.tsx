"use client";

import { SectionHeader, FieldRow, TextInput, TextArea, DarkInput, DarkArea, ImageUpload, CardBlock } from "./shared";

export default function ServicesFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" note="对应服务页顶部的全宽背景与标题区" />
        <ImageUpload name="hero.bgImage" label="Hero 背景图片" aspectHint="建议 16:5" />
        <FieldRow label="顶部小标签">
          <TextInput name="hero.tag" defaultValue={zh ? "重资产出海专属服务" : "HEAVY EQUIPMENT EXPORT SERVICES"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "中国源头，" : "CHINESE SOURCE,"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "全球交付。" : "GLOBAL DELIVERY."} />
        </FieldRow>
        <FieldRow label="副标题描述">
          <TextArea name="hero.desc" defaultValue={zh ? "从源头查勘到重载交付，我们提供全链路保姆式出海护航，确保每台机械以巅峰状态抵达。" : "From factory inspection to heavy-load delivery, we provide end-to-end export escorts ensuring peak condition on arrival."} />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块二：六大服务矩阵" note="前 5 张白底卡片 + 第 6 张黑金 CTA 卡" />
        <FieldRow label="板块主标题">
          <TextInput name="matrix.title" defaultValue={zh ? "重装出海全维保障体系" : "PREMIUM HEAVY EQUIPMENT SERVICES"} />
        </FieldRow>
        {[
          { zh_t: "客制化找机寻源",    en_t: "Custom Machinery Sourcing",             zh_d: "利用庞大的全球货源数据库与厂方人脉，根据您的型号、小时数、预算等精准需求，实行全网反向寻机，绝不妥协任何一处瑕疵。", en_d: "Leveraging our global inventory database and factory networks, we conduct targeted reverse sourcing based on your exact specs — with zero compromise on condition." },
          { zh_t: "原厂级拆卸整备",    en_t: "OEM-Standard Disassembly & Overhaul",  zh_d: "独家聘用一线品牌退役资深液压与动力工程师。全维深度测试核心三大件，符合100项严苛出海标准才予以放行。",                  en_d: "Retired senior OEM engineers conduct full-depth testing of core assemblies against 100 rigorous export standards before clearance." },
          { zh_t: "可靠装箱与发运",    en_t: "Secure Packing & Shipment",             zh_d: "掌握拆解、防锈、打包木架的核心工艺。针对 RO-RO 或 Flat Rack 提供极致安全的捆扎绑缚，杜绝任何海运颠簸受损。",         en_d: "Professional disassembly, anti-corrosion treatment, and timber crating with expert RO-RO or flat rack lashing to prevent transit damage." },
          { zh_t: "五星级配件补给",    en_t: "Premium Spare Parts Supply",            zh_d: "附赠高频易损件保养包。滤芯、履带指、斗齿等消耗品以极具竞争力的出厂底价随船配发，扫除偏远矿区无配换的后顾之忧。",       en_d: "A complimentary maintenance kit of high-frequency wear parts included with every shipment at competitive ex-factory pricing." },
          { zh_t: "清关文书与合规",    en_t: "Customs Documentation & Compliance",    zh_d: "免费包办出口报关单证、原产地商检证书、海运提单 (B/L) 以及目的港特许清关所需的合规文件，确保您顺利清关免重税。",         en_d: "All export documentation at no extra cost — export declarations, certificate of origin, B/L, and compliance documents for smooth clearance." },
        ].map((c, i) => (
          <CardBlock key={i} index={i + 1} label="服务卡片">
            <FieldRow label="卡片标题"><TextInput name={`matrix.card.${i}.title`} defaultValue={zh ? c.zh_t : c.en_t} /></FieldRow>
            <FieldRow label="卡片描述"><TextArea name={`matrix.card.${i}.desc`} rows={2} defaultValue={zh ? c.zh_d : c.en_d} /></FieldRow>
          </CardBlock>
        ))}
        <div className="rounded-xl border border-[#D4AF37]/30 p-4 space-y-3 bg-[#111111]">
          <span className="text-[10px] font-bold tracking-widest text-[#D4AF37]/60 uppercase">服务卡片 6（黑金 CTA 卡）</span>
          <FieldRow label="主标题第一行"><DarkInput name="matrix.cta.title1" defaultValue={zh ? "急需稀缺" : "Need a Hard-to-Find"} /></FieldRow>
          <FieldRow label="主标题第二行"><DarkInput name="matrix.cta.title2" defaultValue={zh ? "特种机型？" : "Specialist Machine?"} /></FieldRow>
          <FieldRow label="卡片描述"><DarkArea name="matrix.cta.desc" defaultValue={zh ? "独家内网通道，为您直接截胡暂未面市的厂矿顶配成色一手退役机资源。" : "Through our exclusive off-market network, we source premium first-owner decommissioned units before they reach the open market."} /></FieldRow>
          <FieldRow label="按钮文字"><DarkInput name="matrix.cta.btn" defaultValue={zh ? "立即委托寻车" : "Commission a Search Now"} gold /></FieldRow>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块三：全球信任背书（3大支柱）" note="三列图文信任说明" />
        <FieldRow label="板块主标题">
          <TextInput name="trust.title" defaultValue={zh ? "赢得全球矿企与基建商的绝对信赖" : "Earning Absolute Trust from Global Mining & Infrastructure Operators"} />
        </FieldRow>
        {[
          { zh_t: "超级干线与集港联运",  en_t: "Dedicated Inland Haulage & Port Consolidation",      zh_d: "依托完全自营的重装整备基地与大件特种平板拖车车队，我们打通了直达中国各大主港的专属联运走廊，彻底告别第三方野蛮托运导致的沿途磕碰积压。", en_d: "Operating our own heavy equipment yard and specialized flatbed fleet, we've established a dedicated corridor to China's major ports — eliminating third-party haulage damage." },
          { zh_t: "云端全景实机验交",    en_t: "Live Multi-Camera Remote Acceptance",               zh_d: "采用高帧率多机位全景直播验收。我们的工程师将带您钻入机械底部排查暗漏，俯视发动机负荷黑烟，并全景展示挖掘机的极限复合动作，所见即所达。",  en_d: "High-frame-rate multi-camera live streaming — our engineers guide you through a thorough walkaround. What you see is exactly what you get." },
          { zh_t: "跨国全周期远程排障",  en_t: "Full-Lifecycle Cross-Border Troubleshooting",       zh_d: "二手机械在恶劣矿区难免磨损突发故障，我们不仅随船附送核心易损件全家桶，更建立 1V1 专属出海专家群，零延迟进行跨洋图文连线与维修实操辅导。", en_d: "Beyond the included wear parts kit, every client gets a dedicated 1-on-1 expert channel for instant cross-ocean technical guidance and live repair coaching." },
        ].map((p, i) => (
          <CardBlock key={i} index={i + 1} label="信任支柱">
            <FieldRow label="支柱标题"><TextInput name={`trust.${i}.title`} defaultValue={zh ? p.zh_t : p.en_t} /></FieldRow>
            <FieldRow label="支柱描述"><TextArea name={`trust.${i}.desc`} rows={3} defaultValue={zh ? p.zh_d : p.en_d} /></FieldRow>
          </CardBlock>
        ))}
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块四：验交发运标准（Z字流程 01–04）" note="四步流程图与文案" />
        <FieldRow label="板块主标题">
          <TextInput name="process.title" defaultValue={zh ? "二手重型设备验交与发运标准" : "Used Heavy Equipment Inspection, Acceptance & Dispatch Standards"} />
        </FieldRow>
        {[
          { zh_t: "二手寻机与严选匹配",     en_t: "Sourcing & Rigorous Machine Selection",            zh_d: "我们在全球各大矿场直接筛选出状态极致优秀的成色一手设备。只挑选底盘扎实、车况原版极品的高回本率神机，从货源源头上彻底扼杀事故车、水淹车和组装车。", en_d: "We source directly from major mining operations worldwide, selecting only first-owner units — eliminating accident-damaged, flood-damaged, and rebuilt units at the source." },
          { zh_t: "全卸复检与硬核测试",     en_t: "Full Teardown Reinspection & Load Testing",        zh_d: "绝不只做表面功夫。老练的工程师将液压泵彻底暴漏，实机测试怠速动作、极限复合动作，测试黑烟状态并对底盘四轮一带进行全面打分，出具百项检测报告书。",    en_d: "Engineers expose the hydraulic pump for thorough assessment, conduct live load tests, and score the complete undercarriage — producing a 100-item inspection report." },
          { zh_t: "工业级除垢与焕新喷漆",   en_t: "Industrial Degreasing & Factory-Grade Refinishing", zh_d: "任何设备出港前，均经过高压水流彻底剥离黄油垢与深层硬化泥土，视客户需求进行电脑无色差原厂漆调板翻新。保证每一根接管重获新生，消除隐藏漏油隐患。",    en_d: "Before departure, every machine is high-pressure washed and upon request receives computer-matched OEM paint. All hydraulic fittings are renewed to eliminate hidden leaks." },
          { zh_t: "在线验交与港口吊装发运", en_t: "Live Remote Acceptance & Port Dispatch",            zh_d: "由客户参与实时视频动态验机。确认无误后，在专属押运专员护送下进行拆解打托装箱，或直接开上港口滚装船甲板进行重型捆扎绑缚，随时云端跟踪飘洋路线。",    en_d: "Clients join a real-time live video acceptance inspection. Once confirmed, units are loaded under escort into containers or onto RO-RO vessels with full vessel tracking." },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
            <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">步骤 0{i+1}</span>
            <ImageUpload name={`process.${i}.image`} label="步骤图片" aspectHint="建议 16:9" />
            <FieldRow label="步骤标题"><TextInput name={`process.${i}.title`} defaultValue={zh ? s.zh_t : s.en_t} /></FieldRow>
            <FieldRow label="步骤描述"><TextArea name={`process.${i}.desc`} rows={3} defaultValue={zh ? s.zh_d : s.en_d} /></FieldRow>
          </div>
        ))}
      </div>
    </div>
  );
}
