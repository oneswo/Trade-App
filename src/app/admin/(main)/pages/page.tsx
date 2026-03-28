"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Save, Globe, ImageIcon, Home, Package, Wrench, Info, BookOpen, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// ─── 页面列表 ─────────────────────────────────────────────────────────────────

const LOCALES = [
  { id: "zh", label: "中文" },
  { id: "en", label: "English" },
];

const PAGES_LIST = [
  { id: "home",     name: "网站首页", slug: "/",         icon: Home },
  { id: "products", name: "产品列表", slug: "/products", icon: Package },
  { id: "services", name: "服务支持", slug: "/services", icon: Wrench },
  { id: "about",    name: "关于我们", slug: "/about",    icon: Info },
  { id: "insights", name: "行业智库", slug: "/insights", icon: BookOpen },
  { id: "contact",  name: "联系我们", slug: "/contact",  icon: Phone },
];

// ─── Context：共享读写函数 ────────────────────────────────────────────────────

const Ctx = createContext<{
  get: (name: string, fallback: string) => string;
  set: (name: string, val: string) => void;
}>({ get: (_, f) => f, set: () => {} });

// ─── 公共子组件 ───────────────────────────────────────────────────────────────

function SectionHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-black/[0.06] pb-3">
      <h3 className="text-[13px] font-bold text-[#111111]">{title}</h3>
      {note && <span className="text-[10px] text-[#111111]/30">{note}</span>}
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[10px] font-semibold tracking-[0.12em] text-[#111111]/40 uppercase">{label}</label>
        {hint && <span className="text-[10px] text-[#111111]/25">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// TextInput / TextArea：受控，读写都走 Context
function TextInput({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const { get, set } = useContext(Ctx);
  return (
    <input
      type="text"
      value={get(name, defaultValue)}
      onChange={e => set(name, e.target.value)}
      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none"
    />
  );
}

function TextArea({ name, defaultValue = "", rows = 3 }: { name: string; defaultValue?: string; rows?: number }) {
  const { get, set } = useContext(Ctx);
  return (
    <textarea
      value={get(name, defaultValue)}
      onChange={e => set(name, e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none"
    />
  );
}

// 深色主题输入框（用于黑金卡片内部）
function DarkInput({ name, defaultValue = "", gold }: { name: string; defaultValue?: string; gold?: boolean }) {
  const { get, set } = useContext(Ctx);
  return (
    <input
      type="text"
      value={get(name, defaultValue)}
      onChange={e => set(name, e.target.value)}
      className={`w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[14px] outline-none focus:border-white/30 ${gold ? "text-[#D4AF37]" : "text-white"}`}
    />
  );
}

function DarkArea({ name, defaultValue = "", rows = 2 }: { name: string; defaultValue?: string; rows?: number }) {
  const { get, set } = useContext(Ctx);
  return (
    <textarea
      value={get(name, defaultValue)}
      onChange={e => set(name, e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[14px] text-gray-300 outline-none resize-none focus:border-white/30"
    />
  );
}

function ImageUpload({ label, hint, aspectHint }: { label: string; hint?: string; aspectHint?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[10px] font-semibold tracking-[0.12em] text-[#111111]/40 uppercase">{label}</label>
        {hint && <span className="text-[10px] text-[#111111]/25">{hint}</span>}
      </div>
      <div className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/[0.1] bg-[#FAFAFA] transition-colors hover:border-black/20 hover:bg-black/[0.02]">
        <ImageIcon size={20} className="text-[#111111]/25" />
        <span className="text-[11px] text-[#111111]/40 font-medium">点击上传 / 拖拽图片到此处</span>
        {aspectHint && <span className="text-[10px] text-[#111111]/25">{aspectHint}</span>}
      </div>
    </div>
  );
}

function CardBlock({ index, label, children }: { index: number; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
      <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">{label} {index}</span>
      {children}
    </div>
  );
}

// ─── 首页字段 ─────────────────────────────────────────────────────────────────

function HomeFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 全屏首屏" />
        <FieldRow label="背景视频资源 URL" hint="MP4 直链">
          <TextInput name="hero.videoUrl" defaultValue="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" />
        </FieldRow>
        <ImageUpload label="视频封面图（poster）" hint="视频加载前显示" aspectHint="建议 16:9，JPG / PNG，最大 5MB" />
        <FieldRow label="顶部小标签文字">
          <TextInput name="hero.tag" defaultValue={zh ? "面向国际市场的高端二手工程机械" : "PREMIUM USED HEAVY EQUIPMENT FOR GLOBAL MARKETS"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "铸塑未来的" : "Built to Power"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "重工力量" : "the World's Work"} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="按钮 1 文字（黄金主按钮）">
            <TextInput name="hero.btn1" defaultValue={zh ? "探索核心机械" : "Browse Equipment"} />
          </FieldRow>
          <FieldRow label="按钮 2 文字（播放视频按钮）">
            <TextInput name="hero.btn2" defaultValue={zh ? "播放实景视频" : "Play Video"} />
          </FieldRow>
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块二：极速匹配品类画廊" />
        <FieldRow label="板块主标题">
          <TextInput name="categories.title" defaultValue={zh ? "全矩阵设备覆盖" : "Full-Spectrum Equipment Coverage"} />
        </FieldRow>
        <FieldRow label="右侧描述文字">
          <TextArea name="categories.desc" defaultValue={zh ? "无论您的工程面临何种极端挑战，我们都能为您提供从强力挖掘、重型装载到路面打造的全场景、无死角的高端重装解决方案。" : "Whatever your project demands, we deliver high-performance heavy equipment solutions across the full spectrum."} />
        </FieldRow>
        <div className="space-y-2">
          {[
            { zh_n: "大型挖掘机",    en_n: "Excavators" },
            { zh_n: "轮式装载机",    en_n: "Wheel Loaders" },
            { zh_n: "重型推土机",    en_n: "Bulldozers" },
            { zh_n: "平地机与压路机", en_n: "Graders & Rollers" },
            { zh_n: "工业叉车",      en_n: "Forklifts" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-black/[0.06] bg-white px-4 py-2.5">
              <span className="text-[10px] font-bold text-[#111111]/25 w-5 shrink-0">0{i+1}</span>
              <div className="flex-1">
                <TextInput name={`category.${i}.name`} defaultValue={zh ? c.zh_n : c.en_n} />
              </div>
              <div className="w-[80px] shrink-0">
                <div className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-black/[0.1] bg-[#FAFAFA] hover:border-black/20">
                  <ImageIcon size={12} className="text-[#111111]/25" />
                  <span className="text-[9px] text-[#111111]/30">图片</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块三：严选热销机皇" note="产品卡片从产品库动态拉取" />
        <FieldRow label="板块主标题">
          <TextInput name="hot.title" defaultValue={zh ? "严选热销机皇" : "Top-Rated Machines, Handpicked"} />
        </FieldRow>
        <FieldRow label="右侧描述文字">
          <TextArea name="hot.desc" defaultValue={zh ? "这些顶级现货机型经过 100 项全案严苛过滤，代表着本月极低的故障率和极高的投资回报比，是全球大型基建的首选制胜装备。" : "Every unit has passed a rigorous 100-point inspection — the lowest failure rates and highest ROI of the month."} />
        </FieldRow>
        <FieldRow label="底部按钮文字">
          <TextInput name="hot.btnText" defaultValue={zh ? "游览所有 300+ 在线设备" : "View All 300+ Listed Machines"} />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块四：二十载深耕实力展示" />
        <FieldRow label="左侧主标题 — 第一行">
          <TextInput name="depth.title1" defaultValue={zh ? "二十载深耕专注" : "Two Decades of Expertise."} />
        </FieldRow>
        <FieldRow label="左侧主标题 — 第二行">
          <TextInput name="depth.title2" defaultValue={zh ? "构筑起坚实底盘。" : "A Foundation You Can Trust."} />
        </FieldRow>
        <FieldRow label="左侧描述段落">
          <TextArea name="depth.desc" rows={4} defaultValue={zh ? "中国机械不仅仅是一家贸易商。我们在全球拥有自建的大型存放仓储与检测翻新基地。所有出海设备均由原厂级资深工程师亲手拆解、保养与极端测试，拒绝铁疙瘩，只发真战力。" : "China Machinery is more than a trading company. We operate our own large-scale warehousing, inspection, and refurbishment facilities. Every machine is disassembled, serviced, and stress-tested by OEM-certified senior engineers."} />
        </FieldRow>
        <div className="space-y-2 rounded-xl border border-black/[0.06] p-4 bg-[#FAFAFA]">
          <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">四组核心数据</span>
          {[
            { num: "3000", zh_l: "全球成功交付设备", en_l: "Machines Delivered Globally" },
            { num: "50",   zh_l: "无缝海运覆盖国家", en_l: "Countries Served by Sea" },
            { num: "2000", zh_l: "平米超级仓储展区", en_l: "m² Warehousing & Prep Yard" },
            { num: "100",  zh_l: "全节点拆机复检率", en_l: "Full-Teardown Inspection Rate" },
          ].map((s, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <TextInput name={`depth.stat.${i}.num`} defaultValue={s.num} />
              <TextInput name={`depth.stat.${i}.label`} defaultValue={zh ? s.zh_l : s.en_l} />
            </div>
          ))}
        </div>
        <FieldRow label="右侧工厂宣传视频 URL" hint="MP4 直链">
          <TextInput name="depth.videoUrl" defaultValue="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" />
        </FieldRow>
        <ImageUpload label="右侧封面图（播放前显示）" aspectHint="建议 16:9，JPG / PNG" />
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块五：核心出海服务体系" />
        <FieldRow label="板块主标题">
          <TextInput name="s5.title" defaultValue={zh ? "世界级的交付与服务标准" : "World-Class Delivery & After-Sales Standards"} />
        </FieldRow>
        <FieldRow label="板块描述">
          <TextArea name="s5.desc" defaultValue={zh ? "在跨国重装采购中，物流与售后往往是最大的阻碍。我们将为您彻底铲除这些摩擦力，提供真正的端到端出海服务体系。" : "In cross-border heavy equipment procurement, logistics and after-sales are often the greatest barriers. We eliminate that friction entirely."} />
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
            <FieldRow label="卡片标题"><TextInput name={`s5.card.${i}.title`} defaultValue={zh ? c.zh_t : c.en_t} /></FieldRow>
            <FieldRow label="卡片描述"><TextArea name={`s5.card.${i}.desc`} rows={2} defaultValue={zh ? c.zh_d : c.en_d} /></FieldRow>
          </CardBlock>
        ))}
        <FieldRow label="底部跳转按钮文字">
          <TextInput name="s5.btnText" defaultValue={zh ? "探索完整增值出海体系" : "Explore Our Full Export Service Suite"} />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块六：交机实录与动态" note="文章卡片从资讯库动态拉取" />
        <FieldRow label="板块主标题">
          <TextInput name="news.title" defaultValue={zh ? "交机实录与动态" : "Live Delivery Updates"} />
        </FieldRow>
        <FieldRow label="右侧描述文字">
          <TextArea name="news.desc" defaultValue={zh ? "真实发盘、跨国海运、开箱验收。我们为您展示实时的设备全球周转录像与物流快讯，亲眼见证我们的端到端跨国履约与重装交付能力。" : "Real shipments. International ocean freight. On-site unboxing. We share live footage and logistics updates from active global dispatches."} />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块七：底部询单 CTA" />
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="cta.title1" defaultValue={zh ? "未找到心仪的" : "Can't Find the"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="cta.titleGold" defaultValue={zh ? "特定机型？" : "Right Machine?"} />
        </FieldRow>
        <FieldRow label="描述文字">
          <TextArea name="cta.desc" defaultValue={zh ? "提供您的工况需求和采买预算，我们的海外专属采购代表将在 12 小时内为您在全球自有仓储网络中匹配最佳的替代品方案。" : "Share your requirements and budget, and our sourcing representative will find the best match within 12 hours."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="联系电话">
            <TextInput name="cta.phone" defaultValue="+86 1732 107 7956" />
          </FieldRow>
          <FieldRow label="总部标签文字">
            <TextInput name="cta.hqLabel" defaultValue={zh ? "总部寻址" : "Headquarters"} />
          </FieldRow>
        </div>
        <FieldRow label="总部地址">
          <TextInput name="cta.hqAddr" defaultValue={zh ? "中国上海市青浦区重型机械工业园 88 号" : "No. 88 Heavy Machinery Park, Qingpu, Shanghai, China"} />
        </FieldRow>
        <FieldRow label="表单标题文字">
          <TextInput name="cta.formTitle" defaultValue={zh ? "即刻获取定制报价" : "Get Your Custom Quote Now"} />
        </FieldRow>
        <FieldRow label="表单描述框占位文字">
          <TextInput name="cta.formPlaceholder" defaultValue={zh ? "请描述您的意向机型与工况需求..." : "Describe your machine requirements and operating conditions..."} />
        </FieldRow>
        <FieldRow label="表单提交按钮文字">
          <TextInput name="cta.submitBtn" defaultValue={zh ? "立即委托寻机" : "Commission a Search Now"} />
        </FieldRow>
      </div>

    </div>
  );
}

// ─── 产品列表页字段 ───────────────────────────────────────────────────────────

function ProductsFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" />
        <ImageUpload label="Hero 背景图片" aspectHint="建议比例 16:5，JPG / PNG，最大 5MB" />
        <FieldRow label="顶部小标签">
          <TextInput name="hero.tag" defaultValue={zh ? "全球二手重工机械直采平台" : "GLOBAL USED HEAVY EQUIPMENT DIRECT SOURCING"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "精品重装，" : "PREMIUM IRON,"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "全球直发。" : "GLOBAL DIRECT."} />
        </FieldRow>
        <FieldRow label="副标题描述">
          <TextArea name="hero.desc" defaultValue={zh ? "集结全球顶级品牌二手工程机械，经 KXTJ 严苛百项质检，确保每台机械以最佳状态抵达目的地。" : "Top-tier used construction machinery from global brands, each passing KXTJ's 100-point inspection."} />
        </FieldRow>
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块二：筛选区文案" />
        <FieldRow label="搜索框占位提示文字">
          <TextInput name="filter.searchPlaceholder" defaultValue={zh ? "搜索品牌、型号、工况..." : "Search brand, model, condition..."} />
        </FieldRow>
        <FieldRow label="无结果提示文字">
          <TextInput name="filter.emptyText" defaultValue={zh ? "暂无符合条件的产品，请尝试其他筛选项" : "No products found. Try different filters."} />
        </FieldRow>
      </div>
    </div>
  );
}

// ─── 服务支持页字段 ───────────────────────────────────────────────────────────

function ServicesFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" />
        <ImageUpload label="Hero 背景图片" aspectHint="对应 /images/hero/services.png，建议 16:5" />
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
        <SectionHeader title="模块二：六大服务矩阵" />
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
        <SectionHeader title="模块三：全球信任背书（3大支柱）" />
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
        <SectionHeader title="模块四：验交发运标准（Z字流程 01–04）" />
        <FieldRow label="板块主标题">
          <TextInput name="process.title" defaultValue={zh ? "二手重型设备验交与发运标准" : "Used Heavy Equipment Inspection, Acceptance & Dispatch Standards"} />
        </FieldRow>
        {[
          { zh_t: "二手寻机与严选匹配",     en_t: "Sourcing & Rigorous Machine Selection",            zh_d: "我们在全球各大矿场直接筛选出状态极致优秀的成色一手设备。只挑选底盘扎实、车况原版极品的高回本率神机，从货源源头上彻底扼杀事故车、水淹车和组装车。", en_d: "We source directly from major mining operations worldwide, selecting only first-owner units — eliminating accident-damaged, flood-damaged, and rebuilt units at the source.", img: "process-1.jpg" },
          { zh_t: "全卸复检与硬核测试",     en_t: "Full Teardown Reinspection & Load Testing",        zh_d: "绝不只做表面功夫。老练的工程师将液压泵彻底暴漏，实机测试怠速动作、极限复合动作，测试黑烟状态并对底盘四轮一带进行全面打分，出具百项检测报告书。",    en_d: "Engineers expose the hydraulic pump for thorough assessment, conduct live load tests, and score the complete undercarriage — producing a 100-item inspection report.", img: "process-2.jpg" },
          { zh_t: "工业级除垢与焕新喷漆",   en_t: "Industrial Degreasing & Factory-Grade Refinishing", zh_d: "任何设备出港前，均经过高压水流彻底剥离黄油垢与深层硬化泥土，视客户需求进行电脑无色差原厂漆调板翻新。保证每一根接管重获新生，消除隐藏漏油隐患。",    en_d: "Before departure, every machine is high-pressure washed and upon request receives computer-matched OEM paint. All hydraulic fittings are renewed to eliminate hidden leaks.", img: "process-3.jpg" },
          { zh_t: "在线验交与港口吊装发运", en_t: "Live Remote Acceptance & Port Dispatch",            zh_d: "由客户参与实时视频动态验机。确认无误后，在专属押运专员护送下进行拆解打托装箱，或直接开上港口滚装船甲板进行重型捆扎绑缚，随时云端跟踪飘洋路线。",    en_d: "Clients join a real-time live video acceptance inspection. Once confirmed, units are loaded under escort into containers or onto RO-RO vessels with full vessel tracking.", img: "process-4.jpg" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
            <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">步骤 0{i+1}</span>
            <ImageUpload label="步骤图片" aspectHint={`对应 /images/services/${s.img}`} />
            <FieldRow label="步骤标题"><TextInput name={`process.${i}.title`} defaultValue={zh ? s.zh_t : s.en_t} /></FieldRow>
            <FieldRow label="步骤描述"><TextArea name={`process.${i}.desc`} rows={3} defaultValue={zh ? s.zh_d : s.en_d} /></FieldRow>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块五：底部询单 CTA" />
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="cta.title1" defaultValue={zh ? "期待未来与您" : "READY TO WORK WITH YOU"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="cta.titleGold" defaultValue={zh ? "极度密切合作" : "CLOSELY"} />
        </FieldRow>
        <FieldRow label="描述文字">
          <TextArea name="cta.desc" defaultValue={zh ? "填写需求型号与目标港口，12小时内获取极致竞争力的 CIF 到岸底价。" : "Provide your requirements and destination port for an extremely competitive CIF quote within 12 hours."} />
        </FieldRow>
        <FieldRow label="表单描述框占位文字">
          <TextInput name="cta.formPlaceholder" defaultValue={zh ? "请描述您的意向机械型号与工况需求..." : "Please describe your machinery requirements..."} />
        </FieldRow>
        <FieldRow label="表单提交按钮文字">
          <TextInput name="cta.submitBtn" defaultValue={zh ? "立即获取 CIF 底价" : "GET CIF PRICE NOW"} />
        </FieldRow>
      </div>

    </div>
  );
}

// ─── 关于我们页字段 ───────────────────────────────────────────────────────────

function AboutFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" />
        <ImageUpload label="Hero 背景图片" aspectHint="对应 /images/hero/about.png，建议 16:5" />
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
        <SectionHeader title="模块二 — Block A：长三角核心源头底库基地（左图右文）" />
        <ImageUpload label="左侧图片" aspectHint="对应 /images/about/office.jpg，建议 4:3" />
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
        <SectionHeader title="模块二 — Block B：跨越极限工况的重载交付力（右图左文）" />
        <ImageUpload label="右侧图片" aspectHint="对应 /images/about/yard.jpg，建议 4:3" />
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
        <SectionHeader title="模块三：核心成就数字条（4组）" />
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
        <SectionHeader title="模块四：全球准入资质墙（4张证书卡）" />
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
              <ImageUpload label="证书图片" aspectHint="JPG / PNG" />
              <FieldRow label="中文名称"><TextInput name={`cert.${i}.name`} defaultValue={c.zh_n} /></FieldRow>
              <FieldRow label="英文代码"><TextInput name={`cert.${i}.code`} defaultValue={c.en_code} /></FieldRow>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块五：底部询单 CTA" />
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
        <FieldRow label="表单提交按钮文字">
          <TextInput name="cta.submitBtn" defaultValue={zh ? "立即获取 CIF 底价" : "Send Enquiry Now"} />
        </FieldRow>
      </div>

    </div>
  );
}

// ─── 行业智库页字段 ───────────────────────────────────────────────────────────

function InsightsFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" />
        <ImageUpload label="Hero 背景图片" aspectHint="建议比例 16:5，JPG / PNG，最大 5MB" />
        <FieldRow label="顶部小标签">
          <TextInput name="hero.tag" defaultValue={zh ? "全球工程机械前沿资讯" : "GLOBAL HEAVY EQUIPMENT INSIGHTS"} />
        </FieldRow>
        <FieldRow label="主标题 — 普通色部分">
          <TextInput name="hero.title1" defaultValue={zh ? "洞察行业前沿，" : "INDUSTRY INSIGHTS,"} />
        </FieldRow>
        <FieldRow label="主标题 — 金色高亮部分">
          <TextInput name="hero.titleGold" defaultValue={zh ? "挖掘未来价值。" : "FUTURE VALUE."} />
        </FieldRow>
        <FieldRow label="副标题描述">
          <TextArea name="hero.desc" defaultValue={zh ? "汇聚全球建设者智慧，分享最新的工程机械保养秘诀、市场洞察与发运纪实案例。" : "Gathering global builders' wisdom — maintenance tips, market insights, and real shipment stories."} />
        </FieldRow>
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块二：列表区文案" note="文章卡片动态拉取" />
        <FieldRow label="空状态提示文字">
          <TextInput name="list.emptyText" defaultValue={zh ? "暂无文章，敬请期待" : "No articles yet. Stay tuned."} />
        </FieldRow>
        <FieldRow label="「查看更多」按钮文字">
          <TextInput name="list.viewMoreBtn" defaultValue={zh ? "查看更多资讯" : "View More Insights"} />
        </FieldRow>
      </div>
    </div>
  );
}

// ─── 联系我们页字段 ───────────────────────────────────────────────────────────

function ContactFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" />
        <ImageUpload label="Hero 背景图片" aspectHint="建议比例 16:5，JPG / PNG，最大 5MB" />
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
        <SectionHeader title="模块二：核心联络信息" />
        <FieldRow label="总部标题">
          <TextInput name="info.hqTitle" defaultValue={zh ? "全域出海调度中心" : "Global Export Dispatch Center"} />
        </FieldRow>
        <FieldRow label="总部描述">
          <TextArea name="info.hqDesc" defaultValue={zh ? "无视时区差与洲际屏障。我们的国际贸易工程师将在 12 小时内为您响应跨洋货单、极致型号垂询与实机验车请求。" : "Crossing time zones and continental barriers, our trade engineers respond within 12 hours to any inquiry."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="总部地址（中文）">
            <TextInput name="info.addrZh" defaultValue="中国上海市青浦区重型机械工业园 88 号" />
          </FieldRow>
          <FieldRow label="总部地址（英文）">
            <TextInput name="info.addrEn" defaultValue="No. 88 Heavy Machinery Park, Qingpu District, Shanghai, China" />
          </FieldRow>
          <FieldRow label="邮箱">
            <TextInput name="info.email" defaultValue="global@kxtjexcavator.com" />
          </FieldRow>
          <FieldRow label="电话 / WhatsApp">
            <TextInput name="info.phone" defaultValue="+86 153 7531 9246" />
          </FieldRow>
        </div>
        <FieldRow label="营业时间">
          <TextInput name="info.hours" defaultValue={zh ? "周一至周六 09:00 - 18:00 (UTC+8)，紧急询盘 24小时响应" : "Mon–Sat 09:00–18:00 UTC+8, emergency inquiries answered 24/7"} />
        </FieldRow>
      </div>
      <div className="space-y-5">
        <SectionHeader title="模块三：团队成员展示（4位）" />
        {[
          { name: "Annie Liu",  zh_title: "国际贸易总监",     en_title: "International Trade Director" },
          { name: "Hong Wei",   zh_title: "首席技术工程师",   en_title: "Chief Technical Engineer" },
          { name: "Anna Zhang", zh_title: "非洲区域销售专员", en_title: "Africa Regional Sales" },
          { name: "Yin Chen",   zh_title: "中东区域销售专员", en_title: "Middle East Sales" },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
            <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">成员 {i+1}</span>
            <div className="grid grid-cols-[96px_1fr] gap-4 items-start">
              <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-black/[0.1] bg-white hover:border-black/20 transition-colors">
                <ImageIcon size={16} className="text-[#111111]/25" />
                <span className="text-[9px] text-[#111111]/30">头像</span>
              </div>
              <div className="space-y-3">
                <FieldRow label="姓名"><TextInput name={`team.${i}.name`} defaultValue={m.name} /></FieldRow>
                <FieldRow label="职称"><TextInput name={`team.${i}.title`} defaultValue={zh ? m.zh_title : m.en_title} /></FieldRow>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "success" | "error";

export default function PagesManagementPage() {
  const [activePageId, setActivePageId] = useState("home");
  const [activeLang, setActiveLang] = useState("zh");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // 切换页面或语言时，从 API 加载已保存内容
  useEffect(() => {
    setIsLoading(true);
    setFields({});
    fetch(`/api/page-content?pageId=${activePageId}&locale=${activeLang}`)
      .then(r => r.json())
      .then(res => { if (res.ok && res.data) setFields(res.data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activePageId, activeLang]);

  // Context 读写函数
  const get = useCallback((name: string, fallback: string) => fields[name] ?? fallback, [fields]);
  const set = useCallback((name: string, val: string) => setFields(prev => ({ ...prev, [name]: val })), []);

  // 保存
  const handleSave = async () => {
    setSaveState("saving");
    try {
      const res = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: activePageId, locale: activeLang, data: fields }),
      });
      const json = await res.json();
      setSaveState(json.ok ? "success" : "error");
    } catch {
      setSaveState("error");
    }
    setTimeout(() => setSaveState("idle"), 3000);
  };

  const activePage = PAGES_LIST.find(p => p.id === activePageId)!;
  const zh = activeLang === "zh";

  const renderFields = () => {
    switch (activePageId) {
      case "home":     return <HomeFields zh={zh} />;
      case "products": return <ProductsFields zh={zh} />;
      case "services": return <ServicesFields zh={zh} />;
      case "about":    return <AboutFields zh={zh} />;
      case "insights": return <InsightsFields zh={zh} />;
      case "contact":  return <ContactFields zh={zh} />;
      default:         return null;
    }
  };

  return (
    <Ctx.Provider value={{ get, set }}>
      <div className="h-[calc(100vh-100px)] flex flex-col">
        <div className="flex-1 min-h-0 grid grid-cols-[220px_1fr] gap-6">

          {/* 左侧：页面导航 */}
          <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-black/[0.05] px-4 py-3.5 bg-black/[0.02]">
              <h2 className="text-[12px] font-semibold text-[#111111]/60 uppercase tracking-widest">固定页面</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {PAGES_LIST.map(page => {
                const Icon = page.icon;
                const isActive = activePageId === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => setActivePageId(page.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-medium transition-all ${
                      isActive ? "bg-[#111111] text-white shadow-sm" : "text-[#111111]/50 hover:bg-black/[0.03] hover:text-[#111111]"
                    }`}
                  >
                    <Icon size={15} className={isActive ? "text-white/60" : "text-[#111111]/25"} strokeWidth={2} />
                    <span>{page.name}</span>
                    {isActive && <span className="ml-auto text-[10px] text-white/40 font-normal">{page.slug}</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 右侧：编辑区 */}
          <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">

            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between border-b border-black/[0.05] bg-[#FAFAFA] px-6 py-4 shrink-0">
              <div>
                <h2 className="text-[15px] font-bold text-[#111111]">{activePage.name}</h2>
                <p className="mt-0.5 text-[11px] text-[#111111]/35">路由：{activePage.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* 保存状态提示 */}
                {saveState === "success" && (
                  <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 font-medium">
                    <CheckCircle size={14} /> 保存成功
                  </span>
                )}
                {saveState === "error" && (
                  <span className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium">
                    <AlertCircle size={14} /> 保存失败
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving" || isLoading}
                  className="flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-black/80 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveState === "saving"
                    ? <><Loader2 size={13} className="animate-spin" /> 保存中…</>
                    : <><Save size={13} /> 保存当前语言</>
                  }
                </button>
              </div>
            </div>

            {/* 语言 Tab */}
            <div className="flex items-center border-b border-black/[0.05] px-6 shrink-0">
              {LOCALES.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setActiveLang(loc.id)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-[13px] font-medium transition-colors ${
                    activeLang === loc.id ? "text-[#111111]" : "text-[#111111]/35 hover:text-[#111111]/60"
                  }`}
                >
                  <Globe size={13} className={activeLang === loc.id ? "text-orange-500" : ""} />
                  {loc.label}
                  {activeLang === loc.id && <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#111111]" />}
                </button>
              ))}
              {isLoading && <Loader2 size={13} className="ml-4 animate-spin text-[#111111]/30" />}
            </div>

            {/* 字段内容区 */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-8 py-8 max-w-3xl">
                {renderFields()}
              </div>
            </div>

          </section>
        </div>
      </div>
    </Ctx.Provider>
  );
}
