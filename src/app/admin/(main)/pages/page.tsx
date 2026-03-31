"use client";

import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { Save, Globe, ImageIcon, Film, Home, Package, Wrench, Info, BookOpen, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { SUPPORTED_LOCALES, LOCALE_LABELS } from "@/lib/i18n/locales";

// ─── 页面列表 ─────────────────────────────────────────────────────────────────

const LOCALES = SUPPORTED_LOCALES.map((id) => ({
  id,
  label: LOCALE_LABELS[id],
}));

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
      <h3 className="text-base font-bold text-[#111111]">{title}</h3>
      {note && <span className="text-[12px] text-[#111111]/30">{note}</span>}
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-semibold tracking-[0.08em] text-[#111111]/40 uppercase">{label}</label>
        {hint && <span className="text-[12px] text-[#111111]/25">{hint}</span>}
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
      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[15px] text-[#111111] transition-colors focus:border-black/30 outline-none"
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
      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[15px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none"
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
      className={`w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[15px] outline-none focus:border-white/30 ${gold ? "text-[#D4AF37]" : "text-white"}`}
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
      className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[15px] text-gray-300 outline-none resize-none focus:border-white/30"
    />
  );
}

function ImageUpload({ name, label, hint, aspectHint, defaultValue = "" }: { name: string; label: string; hint?: string; aspectHint?: string; defaultValue?: string }) {
  const { get, set } = useContext(Ctx);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUrl = get(name, defaultValue);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "image");
      if (currentUrl) formData.append("oldUrl", currentUrl);
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.ok && json.data?.url) {
        set(name, json.data.url);
      } else {
        setError(json.error || "上传失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-semibold tracking-[0.08em] text-[#111111]/40 uppercase">{label}</label>
        {hint && <span className="text-[12px] text-[#111111]/25">{hint}</span>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      {currentUrl ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="已上传图片"
            className="w-full h-32 object-cover rounded-xl border border-black/[0.08]"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[11px] font-medium rounded-lg hover:bg-gray-100"
            >
              更换
            </button>
            <button
              type="button"
              onClick={() => set(name, "")}
              className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
            uploading
              ? "border-blue-300 bg-blue-50"
              : "border-black/[0.1] bg-[#FAFAFA] hover:border-black/20 hover:bg-black/[0.02]"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-blue-500 animate-spin" />
              <span className="text-[11px] text-blue-500 font-medium">上传中...</span>
            </>
          ) : (
            <>
              <ImageIcon size={20} className="text-[#111111]/25" />
              <span className="text-[11px] text-[#111111]/40 font-medium">点击上传</span>
              {aspectHint && <span className="text-[10px] text-[#111111]/25">{aspectHint}</span>}
            </>
          )}
        </div>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function VideoUpload({ name, label, hint }: { name: string; label: string; hint?: string }) {
  const { get, set } = useContext(Ctx);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUrl = get(name, "");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "video");
      if (currentUrl) formData.append("oldUrl", currentUrl);
      const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const json = await res.json();
      if (json.ok && json.data?.url) {
        set(name, json.data.url);
      } else {
        setError(json.error || "上传失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) handleUpload(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-semibold tracking-[0.08em] text-[#111111]/40 uppercase">{label}</label>
        {hint && <span className="text-[12px] text-[#111111]/25">{hint}</span>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />
      {currentUrl ? (
        <div className="relative group">
          <video
            src={currentUrl}
            className="w-full h-32 rounded-xl border border-black/[0.08] bg-black object-cover"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[11px] font-medium rounded-lg hover:bg-gray-100">
              更换
            </button>
            <button type="button" onClick={() => set(name, "")}
              className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg hover:bg-red-600">
              删除
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
            uploading ? "border-blue-300 bg-blue-50" : "border-black/[0.1] bg-[#FAFAFA] hover:border-black/20 hover:bg-black/[0.02]"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-blue-500 animate-spin" />
              <span className="text-[11px] text-blue-500 font-medium">上传中...</span>
            </>
          ) : (
            <>
              <Film size={20} className="text-[#111111]/25" />
              <span className="text-[11px] text-[#111111]/40 font-medium">点击上传 / 拖拽视频到此处</span>
              <span className="text-[10px] text-[#111111]/25">MP4 / WebM，最大 80MB</span>
            </>
          )}
        </div>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function CardBlock({ index, label, children }: { index: number; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
      <span className="text-[12px] font-bold tracking-widest text-[#111111]/30 uppercase">{label} {index}</span>
      {children}
    </div>
  );
}

// ─── 首页字段 ─────────────────────────────────────────────────────────────────

function HomeFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="模块一 — 全屏首页大图（Hero）" note="对应首页第一屏视频背景区域" />
        <div className="grid grid-cols-2 gap-4">
          <ImageUpload name="hero.posterUrl" label="视频封面图（poster）" hint="视频加载前显示" aspectHint="建议 16:9，JPG / PNG，最大 5MB" />
          <VideoUpload name="hero.videoUrl" label="背景视频" hint="MP4，最大 80MB" />
        </div>
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
        <SectionHeader title="模块二 — 品类画廊轮播" note="对应首页向下滚动第一个卡片轮播" />
        <FieldRow label="板块大标题">
          <TextInput name="categories.title" defaultValue={zh ? "全矩阵设备覆盖" : "Full-Spectrum Equipment Coverage"} />
        </FieldRow>
        <FieldRow label="右侧辅助说明文字">
          <TextArea name="categories.desc" defaultValue={zh ? "无论您的工程面临何种极端挑战，我们都能为您提供从强力挖掘、重型装载到路面打造的全场景、无死角的高端重装解决方案。" : "Whatever your project demands, we deliver high-performance heavy equipment solutions across the full spectrum."} />
        </FieldRow>
        <FieldRow label="无分类时提示文案">
          <TextInput name="categories.emptyText" defaultValue={zh ? "暂无分类，请在后台「分类管理」中添加" : "No categories yet. Add them in the admin panel."} />
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
        <SectionHeader title="模块三 — 严选热销产品网格" note="产品卡片从「产品管理」动态拉取，无需在此维护" />
        <FieldRow label="板块大标题">
          <TextInput name="hot.title" defaultValue={zh ? "严选热销机皇" : "Top-Rated Machines, Handpicked"} />
        </FieldRow>
        <FieldRow label="右侧辅助说明文字">
          <TextArea name="hot.desc" defaultValue={zh ? "这些顶级现货机型经过 100 项全案严苛过滤，代表着本月极低的故障率和极高的投资回报比，是全球大型基建的首选制胜装备。" : "Every unit has passed a rigorous 100-point inspection — the lowest failure rates and highest ROI of the month."} />
        </FieldRow>
        <FieldRow label="右下角「查看全部」按钮文字">
          <TextInput name="hot.btnText" defaultValue={zh ? "游览所有 300+ 在线设备" : "View All 300+ Listed Machines"} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="卡片角标：现货状态">
            <TextInput name="hot.inStockLabel" defaultValue={zh ? "现货就绪" : "In Stock"} />
          </FieldRow>
          <FieldRow label="CTA 联系标签">
            <TextInput name="cta.directContactLabel" defaultValue={zh ? "专属直联" : "Direct Contact"} />
          </FieldRow>
        </div>
        <FieldRow label="无产品时提示文案">
          <TextInput name="hot.emptyText" defaultValue={zh ? "暂无在售产品，请在后台「产品列表」中添加" : "No products yet. Add them in the admin panel."} />
        </FieldRow>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块四 — 公司实力 & 数字展示（深色双栏）" note="左侧文字 + 数字，右侧视频" />
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
        <div className="grid grid-cols-2 gap-4">
          <ImageUpload name="depth.posterUrl" label="右侧封面图（播放前显示）" aspectHint="建议 16:9，JPG / PNG" />
          <VideoUpload name="depth.videoUrl" label="右侧工厂宣传视频" hint="MP4，最大 80MB" />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块五 — 六大核心服务卡片" note="对应首页六宫格服务图标卡片区" />
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
        <SectionHeader title="模块六 — 交机实录与动态（4张固定卡片）" note="每张卡片可配置视频、封面图、标签、日期、目的地、标题" />
        <FieldRow label="板块主标题">
          <TextInput name="news.title" defaultValue={zh ? "交机实录与动态" : "Live Delivery Updates"} />
        </FieldRow>
        <FieldRow label="右侧描述文字">
          <TextArea name="news.desc" defaultValue={zh ? "真实发盘、跨国海运、开箱验收。我们为您展示实时的设备全球周转录像与物流快讯，亲眼见证我们的端到端跨国履约与重装交付能力。" : "Real shipments. International ocean freight. On-site unboxing. We share live footage and logistics updates from active global dispatches."} />
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
            <div className="grid grid-cols-2 gap-4">
              <VideoUpload name={`delivery.${i}.videoUrl`} label="卡片视频" hint="MP4，最大 80MB" />
              <ImageUpload name={`delivery.${i}.posterUrl`} label="视频封面图" hint="视频播放前显示" aspectHint="建议 4:3，JPG / PNG" />
            </div>
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
              <TextInput name={`delivery.${i}.titleEn`} defaultValue={card.en_title} />
            </FieldRow>
          </CardBlock>
        ))}
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块七 — 底部黑色询盘表单区（CTA）" note="页面最底部的深色背景询盘卡片" />
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

// ─── 产品列表页字段 ───────────────────────────────────────────────────────────

function ProductsFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" note="对应产品列表顶部的全宽背景与标题区" />
        <ImageUpload name="hero.bgImage" label="Hero 背景图片" aspectHint="建议比例 16:5，JPG / PNG，最大 5MB" />
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
        <SectionHeader title="模块二：筛选区文案" note="搜索、筛选、排序、列表状态等文案" />
        <FieldRow label="筛选区顶部小标签">
          <TextInput name="filter.badge" defaultValue={zh ? "精确寻机" : "SEARCH"} />
        </FieldRow>
        <FieldRow label="筛选面板标题">
          <TextInput name="filter.panelTitle" defaultValue={zh ? "筛选机械库" : "FILTERS"} />
        </FieldRow>
        <FieldRow label="打开筛选按钮文字">
          <TextInput name="filter.openBtn" defaultValue={zh ? "打开终端" : "OPEN TERMINAL"} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="移动端筛选面板标题">
            <TextInput name="filter.mobileTitle" defaultValue={zh ? "滤镜终端" : "FILTERS TERMINAL"} />
          </FieldRow>
          <FieldRow label="移动端筛选分区标题">
            <TextInput name="filter.mobileSectionTitle" defaultValue={zh ? "属性筛选大盘" : "FILTER TERMINAL"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="重置按钮文字">
            <TextInput name="filter.resetBtn" defaultValue={zh ? "重置参数" : "RESET"} />
          </FieldRow>
          <FieldRow label="执行筛选按钮文字">
            <TextInput name="filter.executeBtn" defaultValue={zh ? "执行绝对检索" : "EXECUTE SEARCH"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="厂牌分组标题">
            <TextInput name="filter.brandTitle" defaultValue={zh ? "核心厂牌" : "BRANDS"} />
          </FieldRow>
          <FieldRow label="类目分组标题">
            <TextInput name="filter.categoryTitle" defaultValue={zh ? "器械类目" : "CATEGORIES"} />
          </FieldRow>
          <FieldRow label="年份分组标题">
            <TextInput name="filter.yearTitle" defaultValue={zh ? "年份区间" : "YEAR RANGE"} />
          </FieldRow>
        </div>
        <FieldRow label="搜索框占位提示文字">
          <TextInput name="filter.searchPlaceholder" defaultValue={zh ? "搜索品牌、型号、工况..." : "Search brand, model, condition..."} />
        </FieldRow>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="结果区前缀文案">
            <TextInput name="filter.resultsPrefix" defaultValue={zh ? "为您列阵" : "SHOWING"} />
          </FieldRow>
          <FieldRow label="结果区后缀文案">
            <TextInput name="filter.resultsSuffix" defaultValue={zh ? "辆符合指标的实车" : "MACHINES FOUND"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="排序标签文案">
            <TextInput name="filter.sortLabel" defaultValue={zh ? "排序:" : "SORT:"} />
          </FieldRow>
          <FieldRow label="加载中提示文案">
            <TextInput name="filter.loadingText" defaultValue={zh ? "正在加载产品数据..." : "Loading products..."} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="排序项：年份最新">
            <TextInput name="filter.sortNewest" defaultValue={zh ? "年份最新" : "Newest First"} />
          </FieldRow>
          <FieldRow label="排序项：工时最低">
            <TextInput name="filter.sortHours" defaultValue={zh ? "工时最低" : "Lowest Hours"} />
          </FieldRow>
          <FieldRow label="排序项：厂牌 A-Z">
            <TextInput name="filter.sortBrand" defaultValue={zh ? "厂牌 (A-Z)" : "Brand (A-Z)"} />
          </FieldRow>
        </div>
        <FieldRow label="无结果提示文字">
          <TextInput name="filter.emptyText" defaultValue={zh ? "暂无符合条件的产品，请尝试其他筛选项" : "No products found. Try different filters."} />
        </FieldRow>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="卡片标签：现货状态">
            <TextInput name="card.statusLabel" defaultValue={zh ? "现货状态" : "Available"} />
          </FieldRow>
          <FieldRow label="卡片标签：工时">
            <TextInput name="card.hoursLabel" defaultValue={zh ? "工时" : "Hours"} />
          </FieldRow>
          <FieldRow label="卡片标签：自重">
            <TextInput name="card.weightLabel" defaultValue={zh ? "自重" : "Weight"} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FieldRow label="卡片标签：动力">
            <TextInput name="card.engineLabel" defaultValue={zh ? "动力" : "Engine"} />
          </FieldRow>
          <FieldRow label="卡片标签：定位">
            <TextInput name="card.locationLabel" defaultValue={zh ? "定位" : "LOC"} />
          </FieldRow>
          <FieldRow label="卡片按钮文字">
            <TextInput name="card.viewDetailsBtn" defaultValue={zh ? "查阅详尽机况" : "VIEW DETAILS"} />
          </FieldRow>
        </div>
      </div>
    </div>
  );
}

// ─── 服务支持页字段 ───────────────────────────────────────────────────────────

function ServicesFields({ zh }: { zh: boolean }) {
  return (
    <div className="space-y-12">

      <div className="space-y-5">
        <SectionHeader title="模块一：Hero 头图区" note="对应服务页顶部的全宽背景与标题区" />
        <ImageUpload name="hero.bgImage" label="Hero 背景图片" aspectHint="对应 /images/hero/services.png，建议 16:5" />
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
          { zh_t: "二手寻机与严选匹配",     en_t: "Sourcing & Rigorous Machine Selection",            zh_d: "我们在全球各大矿场直接筛选出状态极致优秀的成色一手设备。只挑选底盘扎实、车况原版极品的高回本率神机，从货源源头上彻底扼杀事故车、水淹车和组装车。", en_d: "We source directly from major mining operations worldwide, selecting only first-owner units — eliminating accident-damaged, flood-damaged, and rebuilt units at the source.", img: "process-1.jpg" },
          { zh_t: "全卸复检与硬核测试",     en_t: "Full Teardown Reinspection & Load Testing",        zh_d: "绝不只做表面功夫。老练的工程师将液压泵彻底暴漏，实机测试怠速动作、极限复合动作，测试黑烟状态并对底盘四轮一带进行全面打分，出具百项检测报告书。",    en_d: "Engineers expose the hydraulic pump for thorough assessment, conduct live load tests, and score the complete undercarriage — producing a 100-item inspection report.", img: "process-2.jpg" },
          { zh_t: "工业级除垢与焕新喷漆",   en_t: "Industrial Degreasing & Factory-Grade Refinishing", zh_d: "任何设备出港前，均经过高压水流彻底剥离黄油垢与深层硬化泥土，视客户需求进行电脑无色差原厂漆调板翻新。保证每一根接管重获新生，消除隐藏漏油隐患。",    en_d: "Before departure, every machine is high-pressure washed and upon request receives computer-matched OEM paint. All hydraulic fittings are renewed to eliminate hidden leaks.", img: "process-3.jpg" },
          { zh_t: "在线验交与港口吊装发运", en_t: "Live Remote Acceptance & Port Dispatch",            zh_d: "由客户参与实时视频动态验机。确认无误后，在专属押运专员护送下进行拆解打托装箱，或直接开上港口滚装船甲板进行重型捆扎绑缚，随时云端跟踪飘洋路线。",    en_d: "Clients join a real-time live video acceptance inspection. Once confirmed, units are loaded under escort into containers or onto RO-RO vessels with full vessel tracking.", img: "process-4.jpg" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
            <span className="text-[10px] font-bold tracking-widest text-[#111111]/30 uppercase">步骤 0{i+1}</span>
            <ImageUpload name={`process.${i}.image`} label="步骤图片" aspectHint={`对应 /images/services/${s.img}`} />
            <FieldRow label="步骤标题"><TextInput name={`process.${i}.title`} defaultValue={zh ? s.zh_t : s.en_t} /></FieldRow>
            <FieldRow label="步骤描述"><TextArea name={`process.${i}.desc`} rows={3} defaultValue={zh ? s.zh_d : s.en_d} /></FieldRow>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <SectionHeader title="模块五：底部询单 CTA" note="页面底部深色表单区" />
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
            <TextInput name="cta.form.messageLabel" defaultValue={zh ? "工况与型号需求" : "REQUIREMENTS"} />
          </FieldRow>
        </div>
        <FieldRow label="表单提交按钮文字">
          <TextInput name="cta.submitBtn" defaultValue={zh ? "立即获取 CIF 底价" : "GET CIF PRICE NOW"} />
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

// ─── 关于我们页字段 ───────────────────────────────────────────────────────────

function AboutFields({ zh }: { zh: boolean }) {
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

// ─── 行业智库页字段 ───────────────────────────────────────────────────────────

function InsightsFields({ zh }: { zh: boolean }) {
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

// ─── 联系我们页字段 ───────────────────────────────────────────────────────────

function ContactFields({ zh }: { zh: boolean }) {
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

// ─── 主页面 ───────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "success" | "error";

export default function PagesManagementPage() {
  const [activePageId, setActivePageId] = useState("home");
  const [activeLang, setActiveLang] = useState("zh");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // 切换页面或语言时，从 API 加载已保存内容（重置字段是必要的副作用）
  useEffect(() => {
    setIsLoading(true);
    setFields({});
    fetch(`/api/page-content?pageId=${activePageId}&locale=${activeLang}`)
      .then(r => r.json())
      .then(res => {
        if (res.ok && res.data) setFields(res.data);
      })
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
