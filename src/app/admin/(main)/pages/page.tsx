"use client";

import { useState } from "react";
import { FileText, Save, Globe, Bold, Italic, Link2, ImageIcon, Quote, Code, Heading1, Heading2, List, ListOrdered } from "lucide-react";

// ─── 模拟数据 ─────────────────────────────────────────────────
const LOCALES = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
  { id: "ar", label: "العربية" },
  { id: "ru", label: "Русский" },
  { id: "es", label: "Español" },
];

const PAGES_LIST = [
  { id: "about", name: "关于我们", slug: "/about" },
  { id: "insights", name: "行业智库", slug: "/insights" },
  { id: "contact", name: "联系我们", slug: "/contact" },
  { id: "services", name: "服务支持", slug: "/services" },
];

export default function PagesManagementPage() {
  const [activePageId, setActivePageId] = useState("about");
  const [activeTab, setActiveTab] = useState("en");

  const activePage = PAGES_LIST.find((p) => p.id === activePageId);

  return (
    <div className="relative h-[calc(100vh-100px)] flex flex-col pt-0">

      {/* ── 双栏布局 ── */}
      <div className="flex-1 min-h-0 grid grid-cols-[240px_1fr] gap-6">
        
        {/* 左侧：页面列表侧栏 */}
        <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/[0.05] p-4 bg-black/[0.02]">
            <h2 className="text-[13px] font-semibold text-[#111111]">固定页面</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {PAGES_LIST.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePageId(page.id)}
                className={`
                  w-full flex items-center justify-between rounded-lg px-3 py-3 text-[13px] font-medium transition-colors
                  ${activePageId === page.id 
                    ? "bg-[#111111] text-white" 
                    : "text-[#111111]/60 hover:bg-black/[0.03] hover:text-[#111111]"
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={15} className={activePageId === page.id ? "text-white/50" : "text-[#111111]/30"} />
                  {page.name}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 右侧：编辑器区域 */}
        <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden relative">
          
          {/* 状态控制与保存行 */}
          <div className="flex items-center justify-between border-b border-black/[0.05] bg-[#FAFAFA] p-4 shrink-0">
            <div>
              <h2 className="text-[15px] font-bold text-[#111111]">{activePage?.name}</h2>
              <p className="mt-0.5 text-xs text-[#111111]/40">路由: {activePage?.slug}</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black/80">
              <Save size={14} />
              保存当前语言
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
               
              {/* 多语言 Tab */}
              <div className="flex items-center border-b border-black/[0.04]">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setActiveTab(loc.id)}
                    className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === loc.id
                        ? "text-[#111111]"
                        : "text-[#111111]/40 hover:text-[#111111]/70"
                    }`}
                  >
                    <Globe size={14} className={activeTab === loc.id ? "text-orange-500" : ""} />
                    {loc.label}
                    {activeTab === loc.id && (
                      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#111111]" />
                    )}
                  </button>
                ))}
              </div>

              {/* 标题输入 */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  页面标题 (SEO Title)
                </label>
                <div className="border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
                  <input
                    type="text"
                    defaultValue={activeTab === 'en' ? "About KXTJ Heavy Machinery" : ""}
                    placeholder={`输入 ${activePage?.name} 页面的显示标题...`}
                    className="w-full bg-transparent py-3 text-[15px] font-semibold text-[#111111] placeholder:text-[#111111]/30 placeholder:font-normal outline-none"
                  />
                </div>
              </div>

              {/* 动态页面表单内容区 */}
              <div className="space-y-8 pt-4">
                {activePageId === "about" && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <h3 className="text-sm font-bold text-[#111111]">模块一：Hero 宣传语</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">主标题 (Main Headline)</label>
                          <input type="text" defaultValue={activeTab === 'zh' ? "扎根上海，驱动全球" : "Rooted in Shanghai, Driving the Globe"} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">副标题 (Sub Headline)</label>
                          <input type="text" defaultValue={activeTab === 'zh' ? "二手工程机械供应商领航者" : "The leading supplier of used construction machinery"} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <h3 className="text-sm font-bold text-[#111111]">模块二：品质声誉区</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">板块标题 (Section Title)</label>
                          <input type="text" defaultValue={activeTab === 'zh' ? "享誉七大洲的重工品质声誉" : "A Reputation for Quality Across Seven Continents"} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">详细内容说明 (Description)</label>
                          <textarea rows={3} defaultValue={activeTab === 'zh' ? "从酷暑干旱的中东到极寒冻土的西伯利亚，从南美矿山到非洲基建..." : "From the heat of the Middle East to the permafrost of Siberia..."} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <h3 className="text-sm font-bold text-[#111111]">模块三：准入证书列表</h3>
                        <button className="text-[12px] font-medium text-orange-600 hover:text-orange-700">+ 新增证书</button>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">证书文字列表 (用逗号分隔或逐项编辑)</label>
                        <textarea rows={3} defaultValue={activeTab === 'zh' ? "欧盟 CE 认证, ISO9001 质量管理体系认证, 环保废气排放一级许可" : "EU CE Certification, ISO9001..."} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none" />
                      </div>
                    </div>
                  </>
                )}

                {activePageId === "contact" && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <h3 className="text-sm font-bold text-[#111111]">模块一：联系头图区</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">大标题 (Large Title)</label>
                          <input type="text" defaultValue={activeTab === 'zh' ? "全天候响应，无国界连线" : "24/7 Response, Borderless Connection"} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">副标题文字 (Subtitle)</label>
                          <input type="text" defaultValue={activeTab === 'zh' ? "无论您身在哪个大区，KXTJ 专家团队随时待命。" : "Wherever you are, our experts are on standby."} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <h3 className="text-sm font-bold text-[#111111]">模块二：联系方式网格</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                           <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">邮箱 (Email)</label>
                           <input type="text" defaultValue="global@kxtjexcavator.com" className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">电话 (Phone)</label>
                           <input type="text" defaultValue="+86 400-123-4567" className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                         </div>
                         <div className="space-y-1.5 col-span-2">
                           <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">总部地址 (HQ Address)</label>
                           <input type="text" defaultValue={activeTab === 'zh' ? "中国上海市青浦区重型机械工业园 88 号" : "No. 88 Heavy Machinery Park, Qingpu District, Shanghai, China"} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                         </div>
                      </div>
                    </div>
                  </>
                )}

                {activePageId === "insights" && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <h3 className="text-sm font-bold text-[#111111]">模块一：智库引言区</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">头图大标题 (Hero Title)</label>
                          <input type="text" defaultValue={activeTab === 'zh' ? "洞察行业前沿，挖掘未来价值" : "Insights into Industry Frontiers"} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">引言内容 (Introduction)</label>
                          <textarea rows={3} defaultValue={activeTab === 'zh' ? "汇聚全球建设者智慧，分享最新的工程机械保养秘诀与市场洞察..." : "Gathering global builders' wisdom..."} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activePageId === "services" && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <h3 className="text-sm font-bold text-[#111111]">模块一：服务承诺配置</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">核心口号 (Slogan)</label>
                          <input type="text" defaultValue={activeTab === 'zh' ? "一次交付，终身守护" : "Once delivered, lifelong guarded"} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-[#111111]/40 uppercase tracking-widest">质保细则简述 (Warranty Summary)</label>
                          <textarea rows={3} defaultValue={activeTab === 'zh' ? "所有经过 KXTJ 认证翻修的核心大件（发动机、液压泵等）均享有长达 180 天的全球质保服务。" : "All KXTJ certified core components..."} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[14px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
