"use client";

import {
  SectionHeader,
  FieldRow,
  TextInput,
  TextArea,
  VideoUpload,
  ImageUpload,
  CardBlock,
} from "../_components";

export function HomeFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="首页首屏" note="第一屏标题、背景图和 4 个统计数字" />
        <FieldRow label="主标题上半句">
          <TextInput name="hero.title1" defaultValue={zh ? "铸塑未来的" : "Built to Power"} translateFrom="hero.title1" />
        </FieldRow>
        <FieldRow label="主标题高亮词">
          <TextInput name="hero.titleGold" defaultValue={zh ? "重工力量" : "the World's Work."} translateFrom="hero.titleGold" />
        </FieldRow>
        <ImageUpload
          name="hero.bgImage"
          label="首屏背景图"
          hint="建议尺寸 1920×840，JPG / PNG / WebP"
          aspectHint="推荐比例 16:7 的宽幅横图"
          previewAspect="h-48"
          previewFit="cover"
        />
        <div className="space-y-2 rounded-xl border border-black/[0.06] p-4 bg-[#FAFAFA]">
          <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">四组核心统计数据</span>
          {[
            { num: "3000", suffix: "+", zh_l: "全球交付设备", en_l: "Machines Delivered" },
            { num: "50",   suffix: "+", zh_l: "覆盖国家", en_l: "Countries Served" },
            { num: "20",   suffix: "+", zh_l: "年行业经验", en_l: "Years Experience" },
            { num: "100",  suffix: "%", zh_l: "全检率", en_l: "Full Inspection Rate" },
          ].map((s, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <TextInput name={`hero.stat${i + 1}.num`} defaultValue={s.num} />
              <TextInput name={`hero.stat${i + 1}.label`} defaultValue={zh ? s.zh_l : s.en_l} translateFrom={`hero.stat${i + 1}.label`} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="分类展示区" note="分类卡片本身来自「分类管理」，这里只改标题和说明" />
        <FieldRow label="区块标题">
          <TextInput name="categories.title" defaultValue={zh ? "全矩阵设备覆盖" : "Full-Spectrum Equipment Coverage"} translateFrom="categories.title" />
        </FieldRow>
        <FieldRow label="区块说明">
          <TextArea name="categories.desc" defaultValue={zh ? "无论您的工程面临何种极端挑战，我们都能为您提供从强力挖掘、重型装载到路面打造的全场景、无死角的高端重装解决方案。" : "Whatever your project demands, we deliver high-performance heavy equipment solutions across the full spectrum."} translateFrom="categories.desc" />
        </FieldRow>
        <FieldRow label="无分类时提示文案">
          <TextInput name="categories.emptyText" defaultValue={zh ? "暂无分类，请在后台「分类管理」中添加" : "No categories yet. Add them in the admin panel."} translateFrom="categories.emptyText" />
        </FieldRow>
        {/* ⚠️ 分类卡片（名称 + 图片）已迁移至独立的「分类管理」模块统一管理 */}
        <div className="rounded-xl border border-[#D4AF37]/30 bg-[#FFFBF0] p-4 space-y-1.5">
          <p className="text-[13px] font-semibold text-[#B8860B]">📌 分类卡片由「分类管理」统一控制</p>
          <p className="text-[12px] text-[#B8860B]/70 leading-relaxed">
            品类画廊中展示的每张卡片（名称、图片、跳转链接）均在后台左侧菜单 →
            <strong>「分类管理」</strong> 中新增、编辑和排序。<br />
            在这里修改无效，请前往分类管理操作。
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="热销产品区" note="产品卡片本身来自「产品管理」，这里只改标题和标签" />
        <FieldRow label="区块标题">
          <TextInput name="hot.title" defaultValue={zh ? "严选热销机皇" : "Top-Rated Machines, Handpicked"} translateFrom="hot.title" />
        </FieldRow>
        <FieldRow label="区块说明">
          <TextArea name="hot.desc" defaultValue={zh ? "这些顶级现货机型经过 100 项全案严苛过滤，代表着本月极低的故障率和极高的投资回报比，是全球大型基建的首选制胜装备。" : "Every unit has passed a rigorous 100-point inspection — the lowest failure rates and highest ROI of the month."} translateFrom="hot.desc" />
        </FieldRow>
        <FieldRow label="查看全部按钮文字">
          <TextInput name="hot.btnText" defaultValue={zh ? "游览所有 300+ 在线设备" : "View All 300+ Listed Machines"} translateFrom="hot.btnText" />
        </FieldRow>
        <FieldRow label="卡片标签：现货状态">
          <TextInput name="hot.inStockLabel" defaultValue={zh ? "现货就绪" : "In Stock"} translateFrom="hot.inStockLabel" />
        </FieldRow>
        <FieldRow label="无产品时提示文案">
          <TextInput name="hot.emptyText" defaultValue={zh ? "暂无在售产品，请在后台「产品列表」中添加" : "No products yet. Add them in the admin panel."} translateFrom="hot.emptyText" />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="服务卡片区" note="首页中段 6 张服务卡片" />
        <FieldRow label="区块标题">
          <TextInput name="s5.title" defaultValue={zh ? "世界级的交付与服务标准" : "World-Class Delivery & After-Sales Standards"} translateFrom="s5.title" />
        </FieldRow>
        <FieldRow label="区块说明">
          <TextArea name="s5.desc" defaultValue={zh ? "在跨国重装采购中，物流与售后往往是最大的阻碍。我们将为您彻底铲除这些摩擦力，提供真正的端到端出海服务体系。" : "In cross-border heavy equipment procurement, logistics and after-sales are often the greatest barriers. We eliminate that friction entirely."} translateFrom="s5.desc" />
        </FieldRow>
        {[
          { zh_t: "100项隐患全排查",   en_t: "100-Point Pre-Export Inspection",   zh_d: "从发动机、液压主泵到外观履带，严格执行原厂级全案检测体系，出具全流程权威视频报告。",   en_d: "From the engine and hydraulic main pump to undercarriage, every unit undergoes a factory-grade inspection with video report." },
          { zh_t: "全自管翻新与喷漆",  en_t: "In-House Overhaul & Refinishing",  zh_d: "我们在国内拥有一流的数控机床与原厂喷漆房阵列，支持机器的动力总成大修与原厂化翻新装配。", en_d: "Our facility houses CNC machinery and OEM-standard paint booths for full powertrain overhauls and factory-grade refinishing." },
          { zh_t: "原厂级易损件直供",  en_t: "OEM-Grade Wear Parts Supply",       zh_d: "为海外发盘一次性备齐各类核心易损件打包（如滤芯、皮带、销轴），大幅延长基建区作业生命。", en_d: "Critical wear parts packed with every overseas shipment to maximize uptime in remote jobsite environments." },
          { zh_t: "工况重度改装调校",  en_t: "Heavy-Duty Site Adaptation",        zh_d: "针对非洲极端高温和南美高湿度恶劣矿区，针对性地加强液压散热管线和冷媒，保障高温不沸腾。",  en_d: "For extreme heat in Africa and high-humidity South American mines, we reinforce hydraulic cooling lines and upgrade coolants." },
          { zh_t: "7×24 终身技术指导", en_t: "24/7 Lifetime Technical Support",   zh_d: "拥有双语专家护航的紧急技术支援小队，提供无延迟的长途排错、图纸指引与跨国连线辅导。",    en_d: "Our bilingual technical team provides zero-delay remote diagnostics and live cross-border troubleshooting 24/7." },
          { zh_t: "跨洋海运零盲区清关", en_t: "Door-to-Port Shipping & Customs", zh_d: "凭借深耕非洲、南美的高能航运合作伙伴，打磨出包税清关、滚装直航一体化的极简提货路线。",  en_d: "Backed by partners across Africa and South America, we provide all-inclusive customs clearance and RO-RO shipping." },
        ].map((c, i) => (
          <CardBlock key={i} index={i + 1} label="服务卡片">
            <FieldRow label="卡片标题"><TextInput name={`s5.card.${i}.title`} defaultValue={zh ? c.zh_t : c.en_t} translateFrom={`s5.card.${i}.title`} /></FieldRow>
            <FieldRow label="卡片描述"><TextArea name={`s5.card.${i}.desc`} rows={2} defaultValue={zh ? c.zh_d : c.en_d} translateFrom={`s5.card.${i}.desc`} /></FieldRow>
          </CardBlock>
        ))}
        <FieldRow label="底部跳转按钮文字">
          <TextInput name="s5.btnText" defaultValue={zh ? "探索完整增值出海体系" : "Explore Our Full Export Service Suite"} translateFrom="s5.btnText" />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="交付动态区" note="首页底部 4 张动态卡片" />
        <FieldRow label="区块标题">
          <TextInput name="news.title" defaultValue={zh ? "交机实录与动态" : "Live Delivery Updates"} translateFrom="news.title" />
        </FieldRow>
        <FieldRow label="区块说明">
          <TextArea name="news.desc" defaultValue={zh ? "真实发盘、跨国海运、开箱验收。我们为您展示实时的设备全球周转录像与物流快讯，亲眼见证我们的端到端跨国履约与重装交付能力。" : "Real shipments. International ocean freight. On-site unboxing. We share live footage and logistics updates from active global dispatches."} translateFrom="news.desc" />
        </FieldRow>

        {[
          {
            tag: "SHIPMENT", date: "Oct 24, 2026", location: "🇳🇬 Lagos, Nigeria",
            zh_title: "3 台 CAT 336 重型挖掘机翻新完毕，发往西非",
            en_title: "Three CAT 336 heavy excavators refurbished and shipped to West Africa.",
          },
          {
            tag: "DELIVERY", date: "Oct 15, 2026", location: "🇦🇪 Dubai, UAE",
            zh_title: "沃尔沃三机组合验收完成，阿布扎比港口交割",
            en_title: "Volvo three-unit assembly accepted and commissioned in Abu Dhabi port.",
          },
          {
            tag: "DISPATCH", date: "Oct 02, 2026", location: "🇨🇱 Santiago, Chile",
            zh_title: "首单南美洲！两台小松 D155 推土机完成安第斯清关",
            en_title: "First South American order! Two Komatsu D155 dozers cleared customs for the Andes.",
          },
          {
            tag: "UNBOXING", date: "Sep 18, 2026", location: "🇧🇷 São Paulo, Brazil",
            zh_title: "批量沃尔沃装载机抵达圣保罗，南美大区配送启动",
            en_title: "Batch of Volvo wheel loaders arrived in São Paulo for South American distribution.",
          },
        ].map((card, i) => (
          <CardBlock key={i} index={i + 1} label="交付记录卡片">
            <VideoUpload name={`delivery.${i}.videoUrl`} label="卡片视频" hint="MP4，最大 80MB" />
            <div className="grid grid-cols-3 gap-3">
              <FieldRow label="发货标签">
                <TextInput name={`delivery.${i}.tag`} defaultValue={card.tag} />
              </FieldRow>
              <FieldRow label="日期">
                <TextInput name={`delivery.${i}.date`} defaultValue={card.date} />
              </FieldRow>
              <FieldRow label="目的地（含国旗）">
                <TextInput name={`delivery.${i}.location`} defaultValue={card.location} />
              </FieldRow>
            </div>
            <FieldRow label="卡片标题（中文）">
              <TextInput name={`delivery.${i}.titleZh`} defaultValue={card.zh_title} />
            </FieldRow>
            <FieldRow label="卡片标题（英文）">
              <TextInput name={`delivery.${i}.titleEn`} defaultValue={card.en_title} translateFrom={`delivery.${i}.titleZh`} />
            </FieldRow>
          </CardBlock>
        ))}
      </div>
    </div>
  );
}
