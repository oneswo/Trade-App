"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Save, ArrowLeft, Image as ImageIcon, Video, 
  Settings2, Activity, MapPin, Target, CalendarDays,
  Globe2, Trash2, Cpu, Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  
  // ===================== 表单强状态管理 =====================
  const [savingStatus, setSavingStatus] = useState<"IDLE" | "DRAFT" | "PUBLISHED">("IDLE");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // 1. 全局配置状态
  const [enableTrustCards, setEnableTrustCards] = useState(true);
  const [stockAmount, setStockAmount] = useState<number>(3);
  const [category, setCategory] = useState("Caterpillar (卡特彼勒)");

  // 2. 多语言文本内容状态
  const [content, setContent] = useState({
    nameZh: "",
    nameEn: "",
    summaryZh: "",
    summaryEn: "",
  });

  // 3. 原生 6-Grid 机皇指标状态
  const [coreMetrics, setCoreMetrics] = useState({
    year: "",
    hours: "",
    tonnage: "",
    location: "",
    model: "",
    brand: "",
  });

  // 4. 不定长瀑布流参数状态
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([
    { key: "Engine Model (型号)", value: "CAT C6.4 ACERT" },
    { key: "Net Power (净功率)", value: "103 kW (138 hp)" },
    { key: "Bucket Capacity (铲斗容量)", value: "1.2 m³" },
    { key: "Max Digging Depth (挖掘深度)", value: "6,650 mm" },
  ]);

  // 5. 图床状态（视觉馆预留）
  const [videoUrl] = useState<string>("");
  const [coverImageUrl] = useState<string>("");
  const [galleryImageUrls] = useState<string[]>([]);


  // ===================== 提交处理逻辑 =====================
  const handleSubmit = async (statusToSave: "DRAFT" | "PUBLISHED") => {
    // 粗略的必填项拦截（如果非得严要求的话）
    if (!content.nameZh && !content.nameEn) {
      setErrorMsg("请至少填写一个语言的主标题。");
      return;
    }

    setSavingStatus(statusToSave);
    setErrorMsg("");

    try {
      const payload = {
        name: content.nameZh || content.nameEn || "未命名设备", // Backend fallback Name
        nameZh: content.nameZh,
        nameEn: content.nameEn,
        category,
        summary: content.summaryZh || content.summaryEn || "",
        summaryZh: content.summaryZh,
        summaryEn: content.summaryEn,
        stockAmount,
        enableTrustCards,
        coreMetrics,
        specs: specs.filter(s => s.key.trim() && s.value.trim()), // 过滤空行
        coverImageUrl: coverImageUrl || null,
        galleryImageUrls,
        videoUrl: videoUrl || null,
        status: statusToSave
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "接口保存失败");
        setSavingStatus("IDLE");
        return;
      }

      // 发布成功，自动跳回列表
      router.push("/admin/products");
      
    } catch {
      setErrorMsg("网络异常，无法连接后台。");
      setSavingStatus("IDLE");
    }
  };


  // ===================== 动态规格表操作逻辑 =====================
  const addSpecLine = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpecLine = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* ⚠️ 错误信息展示条 */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
           <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* 顶部悬浮导航与提交栏 */}
      <header className="sticky top-0 flex items-center justify-between rounded-xl border border-black/[0.06] bg-white px-6 py-4 shadow-sm z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.06] bg-[#FAFAFA] text-[#111111]/40 hover:bg-black/[0.04] hover:text-[#111111] transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-[15px] font-bold text-[#111111] leading-tight">新增机械库档案</h1>
            <p className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase mt-0.5">Create New Asset Document</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* 中英文切换 Tab */}
          <div className="flex bg-black/[0.04] p-1 rounded-lg border border-black/[0.04]">
            <button 
              onClick={() => setLang("zh")}
              className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${lang === "zh" ? "bg-white text-[#111111] shadow-sm" : "text-[#111111]/50 hover:text-[#111111]"}`}
            >
              中文
            </button>
            <button 
              onClick={() => setLang("en")}
              className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${lang === "en" ? "bg-white text-[#111111] shadow-sm" : "text-[#111111]/50 hover:text-[#111111]"}`}
            >
              English
            </button>
          </div>

          <div className="h-5 w-px bg-black/[0.1]"></div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSubmit("DRAFT")}
              disabled={savingStatus !== "IDLE"}
              className="hidden md:flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.06] bg-white px-4 py-2 text-[12px] font-semibold text-[#111111]/60 hover:bg-black/[0.02] hover:text-[#111111] shadow-sm transition-colors disabled:opacity-50"
            >
              {savingStatus === "DRAFT" ? <Loader2 size={14} className="animate-spin" /> : null}
              存为草稿
            </button>
            <button 
              onClick={() => handleSubmit("PUBLISHED")}
              disabled={savingStatus !== "IDLE"}
              className="flex items-center gap-1.5 rounded-lg bg-[#111111] px-5 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-black/80 transition-all disabled:opacity-50"
            >
              {savingStatus === "PUBLISHED" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
              立即发布
            </button>
          </div>
        </div>
      </header>

      {/* 主体表单区域 */}
      <main className="flex flex-col gap-6">
        
        {/* ===================== 第一排：视觉馆 vs 基础信息 (高度拉伸对齐) ===================== */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* 左侧：视觉流 (7栏) */}
          <div className="xl:col-span-7 flex flex-col">
            <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col h-full">
              <div className="mb-6 pb-4 border-b border-black/[0.05] flex items-center justify-between">
                <h2 className="text-[13px] font-bold text-[#111111] flex items-center gap-2">
                  <ImageIcon size={16} className="text-[#111111]/40" /> 
                  数字视觉馆 (Media Gallery)
                </h2>
                {/* 图库右上角：在库数量 */}
                <div className="flex items-center gap-3 bg-[#FAFAFA] border border-black/[0.06] rounded-lg p-1.5 pr-4 shadow-sm">
                  <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border border-black/[0.04] text-[#25D366]">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse shadow-lg"></span>
                  </div>
                  <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">现车库存</label>
                  <input 
                    type="number" 
                    value={stockAmount}
                    onChange={(e) => setStockAmount(Number(e.target.value) || 0)}
                    min="0" 
                    className="w-12 bg-transparent text-[14px] font-bold text-[#111111] focus:outline-none text-right placeholder:text-[#111111]/20" 
                  />
                  <span className="text-[11px] font-bold text-[#111111]/40">台</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 flex-1 justify-between">
                {/* 黄金 16:10 视频上传区 */}
                <div className="w-full h-full min-h-[240px] rounded-xl bg-[#FAFAFA] border-2 border-dashed border-black/[0.08] flex flex-col items-center justify-center cursor-pointer hover:border-black/[0.2] hover:bg-white transition-all group overflow-hidden relative">
                  <div className="w-12 h-12 rounded-full border border-black/[0.1] bg-white flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-black/[0.2] transition-all shadow-sm">
                    <Video size={20} className="text-[#111111]/40 group-hover:text-[#111111] transition-colors" />
                  </div>
                  <span className="text-[13px] font-bold text-[#111111]/60 group-hover:text-[#111111] transition-colors">点击上传主视频</span>
                  <span className="text-[11px] text-[#111111]/40 mt-1">留白占位预演，接口调试完善后接入组件</span>
                </div>
                
                {/* 5 宫格剧场版小图册 */}
                <div className="grid grid-cols-5 gap-3 shrink-0">
                  <div className="aspect-[16/10] rounded-lg bg-[#FAFAFA] border border-black/[0.08] border-dashed flex items-center justify-center text-[#111111]/30 hover:text-[#111111] hover:border-black/[0.2] hover:bg-white transition-all cursor-pointer relative overflow-hidden group shadow-sm">
                     <Plus size={20} className="group-hover:scale-110 transition-transform" />
                     <div className="absolute top-0 right-0 bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-[4px]">主图</div>
                  </div>
                  {[2,3,4,5].map(i => (
                    <div key={i} className="aspect-[16/10] rounded-lg bg-[#FAFAFA] border border-black/[0.08] border-dashed flex items-center justify-center text-[#111111]/30 hover:text-[#111111] hover:border-black/[0.2] hover:bg-white transition-all cursor-pointer relative overflow-hidden group shadow-sm">
                       <Plus size={20} className="group-hover:scale-110 transition-transform" />
                       <div className="absolute top-0 right-0 bg-black/[0.1] text-black/[0.4] text-[9px] font-bold px-1.5 py-0.5 rounded-bl-[4px]">{i}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          
          {/* 右侧：基础信息 (5栏) */}
          <div className="xl:col-span-5 flex flex-col">
            <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col h-full">
              <h2 className="text-[13px] font-bold text-[#111111] mb-6 pb-4 border-b border-black/[0.05] flex items-center gap-2">
                <Globe2 size={16} className="text-[#111111]/40" /> 
                基础信息 (Basic Meta) - {lang === "zh" ? "中文编辑" : "English Edit"}
              </h2>
              
              <div className="flex flex-col gap-6 flex-1">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">主标题 ({lang.toUpperCase()})</label>
                  <textarea 
                    rows={2} 
                    value={lang === "zh" ? content.nameZh : content.nameEn}
                    onChange={(e) => setContent(prev => ({ ...prev, [lang === "zh" ? "nameZh" : "nameEn"]: e.target.value }))}
                    placeholder={lang === "zh" ? "范例: 卡特彼勒 320D L 液压挖掘机" : "Example: Caterpillar 320D L Hydraulic Excavator"} 
                    className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[14px] font-bold text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/20 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">品牌分类级 (Brand Category)</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-2.5 text-[13px] font-bold text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option>Caterpillar (卡特彼勒)</option>
                      <option>Komatsu (小松)</option>
                      <option>SANY (三一)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                   <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">摘要卖点 ({lang.toUpperCase()})</label>
                   <textarea 
                     value={lang === "zh" ? content.summaryZh : content.summaryEn}
                     onChange={(e) => setContent(prev => ({ ...prev, [lang === "zh" ? "summaryZh" : "summaryEn"]: e.target.value }))}
                     placeholder={lang === "zh" ? "精炼一句，将在列表卡片中展示..." : "A concise one-liner for card display..."} 
                     className="w-full flex-1 min-h-[80px] bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[13px] font-medium text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/20 resize-none"
                   />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ===================== 第二排：机皇核心 (横向 6 格) ===================== */}
        <section className="bg-[#111111] rounded-xl p-8 shadow-sm">
          <div className="mb-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-white flex items-center gap-2">
               <Activity size={16} className="text-[#D4AF37]" /> 
               首屏前置核心指标 (Core Specifications)
            </h2>

            {/* 开关放置区 */}
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold text-gray-400">开启安全背书卡片 (销售闭环)</span>
              <button 
                type="button"
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${enableTrustCards ? "bg-[#25D366]" : "bg-white/20"}`}
                onClick={() => setEnableTrustCards(!enableTrustCards)}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition ${enableTrustCards ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
          
          {/* 强制单行 6 列的横排布局 - 绑定真实状态 */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">出厂年份 <CalendarDays size={12} className="text-gray-600" /></div>
               <input type="text" value={coreMetrics.year} onChange={e => setCoreMetrics({...coreMetrics, year: e.target.value})} placeholder="2021" className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700" />
            </div>
            <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">表显工时 <Activity size={12} className="text-gray-600" /></div>
               <input type="text" value={coreMetrics.hours} onChange={e => setCoreMetrics({...coreMetrics, hours: e.target.value})} placeholder="1,800 小时" className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700" />
            </div>
            <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">公称吨位 <Target size={12} className="text-gray-600" /></div>
               <input type="text" value={coreMetrics.tonnage} onChange={e => setCoreMetrics({...coreMetrics, tonnage: e.target.value})} placeholder="36.0 吨" className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700" />
            </div>
            <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">实车坐标 <MapPin size={12} className="text-gray-600" /></div>
               <input type="text" value={coreMetrics.location} onChange={e => setCoreMetrics({...coreMetrics, location: e.target.value})} placeholder="上海保税区" className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700" />
            </div>
            <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">系统机型 <Cpu size={12} className="text-gray-600" /></div>
               <input type="text" value={coreMetrics.model} onChange={e => setCoreMetrics({...coreMetrics, model: e.target.value})} placeholder="Isuzu 6HK1" className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700" />
            </div>
            <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
               <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">品牌认证标</div>
               <input type="text" value={coreMetrics.brand} onChange={e => setCoreMetrics({...coreMetrics, brand: e.target.value})} placeholder="SANY" className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700" />
            </div>
          </div>
        </section>
        
        {/* ===================== 第三排：完整架构参数 ===================== */}
        <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm">
          <div className="mb-8 pb-5 border-b border-black/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-[13px] font-bold text-[#111111] flex items-center gap-2 mb-1">
                <Settings2 size={16} className="text-[#111111]/40" /> 
                全规格参数阵列档案 (Full Tech Specs)
              </h2>
              <p className="text-[11px] text-[#111111]/40 pl-6 transform">
                此表格所有新增与修改，会在前端底部的瀑布流技术表中同步体现。
              </p>
            </div>
            <button 
              onClick={addSpecLine}
              type="button"
              className="text-[12px] font-semibold tracking-wider uppercase bg-[#FAFAFA] border border-black/[0.08] hover:bg-black/[0.02] text-[#111111] px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Plus size={14}/> 新增规范参数行
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {specs.map((s, i) => (
              <div key={i} className="flex items-center gap-0 bg-[#FAFAFA] border border-black/[0.04] p-2 pr-4 rounded-xl group hover:bg-white hover:border-black/[0.08] transition-colors shadow-sm">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#111111]/20 font-bold text-[10px] shadow-sm shrink-0 border border-black/[0.04] ml-1">
                    {(i+1).toString().padStart(2, '0')}
                  </div>
                  <input 
                    type="text" 
                    value={s.key} 
                    onChange={e => updateSpec(i, "key", e.target.value)}
                    placeholder="标签，如：Engine"
                    className="w-[45%] bg-transparent px-4 py-2 text-[12px] font-semibold text-[#111111]/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/10 rounded-md transition-all ml-1" 
                  />
                  
                  <div className="w-px h-5 bg-black/[0.05] mx-3"></div>
                  
                  <input 
                    type="text" 
                    value={s.value} 
                    onChange={e => updateSpec(i, "value", e.target.value)}
                    placeholder="参数值，如：V6 3.0L"
                    className="flex-1 bg-transparent px-4 py-2 text-[13px] font-bold text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/10 rounded-md transition-all" 
                  />
                  
                  <button 
                    onClick={() => removeSpecLine(i)}
                    type="button"
                    className="text-[#111111]/20 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors ml-1 shrink-0"
                  >
                    <Trash2 size={15}/>
                  </button>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
